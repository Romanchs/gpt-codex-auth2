import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import makeStyles from '@material-ui/core/styles/makeStyles';
import SettingsRounded from '@mui/icons-material/SettingsRounded';
import { useEffect, useState } from 'react';

import { ModalWrapper } from '../../Modal/ModalWrapper';
import { BlueButton } from '../../Theme/Buttons/BlueButton';
import { GreenButton } from '../../Theme/Buttons/GreenButton';
import RadioButton from '../../Theme/Fields/RadioButton';
import { useTranslation } from 'react-i18next';
import { getTemplatesList } from '../../../actions/adminActions';
import { useDispatch } from 'react-redux';
import { getEnv } from '../../../util/getEnv';

const useStyles = makeStyles(() => ({
  root: {
    marginTop: 24,
    width: '85vw',
    '&>label': {
      display: 'block',
      marginBottom: 8
    }
  },
  templateCheckbox: {
    marginTop: 8,
    marginBottom: 16,
    padding: '0 8px',
    maxWidth: '100%',
    maxHeight: 'calc(100vh - 320px)',
    overflowX: 'hidden',
    overflowY: 'auto'
  }
}));

const TemplatesSettings = ({
  availableTemplates,
  templatesList,
  setAvailableTemplates,
  handleSaveTemplates,
  handleClearTemplates
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const { env } = getEnv();

  useEffect(() => {
    if (env !== 'prod' && open && !templatesList) dispatch(getTemplatesList());
  }, [dispatch, env, open]);

  const handleChangeCheckbox = (uid) => {
    const arr = new Set(availableTemplates);
    arr.has(uid) ? arr.delete(uid) : arr.add(uid);
    setAvailableTemplates([...arr]);
  };

  const handleChangeButtonSave = () => {
    handleSaveTemplates();
    setOpen(false);
  };

  const handleChangeButtonCancel = () => {
    handleClearTemplates();
    setOpen(false);
  };

  return (
    <>
      <BlueButton style={{ marginTop: 3, width: '100%' }} onClick={() => setOpen(true)}>
        <SettingsRounded />
        {t('ADD_TEMPLATE')}
      </BlueButton>
      <ModalWrapper open={open} onClose={() => setOpen(false)} header={t('ADD_TEMPLATE')} maxWidth={'xl'}>
        <div className={classes.root}>
          <div className={classes.templateCheckbox}>
            <Grid container spacing={2} alignItems={'flex-start'}>
              {templatesList &&
                templatesList?.map((item, key) => (
                  <Grid item xs={6} md={4} key={key + item.uid}>
                    <FormControlLabel
                      control={<RadioButton data-marker={item.value} />}
                      checked={availableTemplates?.some((itemActive) => item.uid === itemActive)}
                      label={item.description ? item.description : item.name}
                      onChange={() => handleChangeCheckbox(item.uid)}
                    />
                  </Grid>
                ))}
            </Grid>
          </div>
          <Grid container spacing={2} alignItems={'center'} justifyContent={'space-between'}>
            <Grid item>
              <BlueButton onClick={handleChangeButtonCancel}>{t('CONTROLS.CANCEL')}</BlueButton>
            </Grid>
            <Grid item>
              <GreenButton onClick={handleChangeButtonSave}>{t('CONTROLS.SAVE')}</GreenButton>
            </Grid>
          </Grid>
        </div>
      </ModalWrapper>
    </>
  );
};

export default TemplatesSettings;
