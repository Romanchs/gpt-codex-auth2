import React, { useEffect, useMemo, useState } from 'react';
import { ModalWrapper } from '../../Components/Modal/ModalWrapper';
import { Box, Grid } from '@material-ui/core';
import StyledInput from '../../Components/Theme/Fields/StyledInput';
import { BlueButton } from '../../Components/Theme/Buttons/BlueButton';
import { GreenButton } from '../../Components/Theme/Buttons/GreenButton';
import { useTranslation } from 'react-i18next';
import SearchRounded from '@mui/icons-material/SearchRounded';
import SelectField from '../../Components/Theme/Fields/SelectField';
import { ROLES } from '../../util/directories';
import { i18resources } from '../../i18n/i18n';
import MultiSelect from '../../Components/Theme/Fields/MultiSelect';

const initParams = {
  instr_name: '',
  chapter: '',
  roles: [],
  language: '',
  file_original: null
};

export const AddEditInstructionModal = ({ open, chapters, onClose, onSubmit, instruction }) => {
  const { t } = useTranslation();
  const [params, setParams] = useState(initParams);

  const rolesList = useMemo(
    () =>
      Object.keys(ROLES).map((i) => ({
        value: i,
        label: t(`ROLES.${i.replaceAll(' ', '_')}`)
      })),
    [t]
  );

  const isSaveDisabled = useMemo(() => {
    return !params.chapter || (!params.file_original && !instruction) || !params.instr_name || !params.language || !params.roles?.length;
  }, [params]);

  useEffect(() => {
    if (!instruction) return;
    const roles = instruction.roles.includes('all') ? rolesList : rolesList.filter(r => instruction.roles.includes(r.value))
    setParams({...instruction, roles});
  }, [instruction]);

  const onChange = (name, value) => {
    setParams((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    if (params.roles.length === rolesList.length) onSubmit({ ...params, roles: ['all'] });
    else onSubmit({...params, roles: params.roles.map(r => r.value)});
    handleClose();
  };

  const handleClose = () => {
    setParams(initParams);
    onClose();
  };

  return (
    <ModalWrapper open={open} header={instruction ? t('MODALS.EDIT_NEW_INSTRUCTION') : t('MODALS.ADD_NEW_INSTRUCTION')} onClose={handleClose}>
      <Grid container style={{ paddingTop: 30 }} spacing={3}>
        {!instruction && (
          <Grid item xs={12}>
            <Box display={'flex'} gridGap={10} alignItems={'center'}>
              <StyledInput
                value={params?.file_original?.name}
                size={'small'}
                label={t('IMPORT_FILE.SELECT_FILE_FORMAT', { format: '.pdf, .xls, .xlsm, .xlsx, .zip, .xml' })}
                readOnly
                style={styles.field__input}
              />
              <input
                id={`import-file`}
                type="file"
                accept=".pdf,.xls,.xlsm,.xlsx,.zip,.xml"
                onClick={(event) => (event.currentTarget.value = null)}
                onChange={({ target }) => onChange('file_original', target.files[0])}
              />
              <label htmlFor={`import-file`}>
                <BlueButton component="span" style={styles.field__button}>
                  <SearchRounded />
                  {t('CONTROLS.CHOOSE_FILE')}
                </BlueButton>
              </label>
            </Box>
          </Grid>
        )}
        <Grid item xs={12}>
          <SelectField
            label={t('FIELDS.INFO_BLOCK')}
            data={chapters}
            value={params.chapter}
            onChange={(v) => onChange('chapter', v)}
            dataMarker={'chapter'}
          />
        </Grid>
        <Grid item xs={12}>
          <MultiSelect
            label={t('FIELDS.ROLES_FOR_WHICH_ARE_AVAILABLE')}
            list={rolesList}
            value={params.roles}
            onChange={(v) => onChange('roles', v)}
            dataMarker={'roles'}
            ignoreI18
          />
        </Grid>
        <Grid item xs={12}>
          <SelectField
            label={t('FIELDS.LOCALIZATION')}
            data={languagesList}
            value={params.language}
            onChange={(v) => onChange('language', v)}
            dataMarker={'language'}
          />
        </Grid>
        <Grid item xs={12}>
          <StyledInput
            label={t('FIELDS.FILE_NAME_FOR_USER')}
            value={params.instr_name}
            onChange={(event) => onChange('instr_name', event.target.value)}
            max={200}
            dataMarker={'instr_name'}
          />
        </Grid>
      </Grid>
      <Grid container spacing={2} style={{ paddingTop: 40 }}>
        <Grid item xs={12} sm={6}>
          <BlueButton data-marker={'buttonModalClose'} style={{ width: '100%' }} onClick={handleClose}>
            {t('CONTROLS.CANCEL')}
          </BlueButton>
        </Grid>
        <Grid item xs={12} sm={6}>
          <GreenButton
            data-marker={'buttonModalSave'}
            style={{ width: '100%' }}
            disabled={isSaveDisabled}
            onClick={handleSubmit}
          >
            {t('CONTROLS.SAVE')}
          </GreenButton>
        </Grid>
      </Grid>
    </ModalWrapper>
  );
};

const styles = {
  field__input: {
    borderRadius: 5,
    '&>input': {
      padding: '9px 12px'
    }
  },
  field__button: {
    padding: '8px 16px 8px 18px',
    whiteSpace: 'nowrap',
    borderRadius: 4
  }
};

const languagesList = Object.values(i18resources).map((i) => ({
  value: i.code,
  label: i.title
}));
