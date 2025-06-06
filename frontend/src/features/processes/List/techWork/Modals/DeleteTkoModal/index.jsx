import { ModalWrapper } from '../../../../../../Components/Modal/ModalWrapper';
import { modalTypes } from '../../constants';
import { useTranslation } from 'react-i18next';
import { Grid, Stack } from '@mui/material';

import { useState } from 'react';
import DateTimePicker from '../../../../../techWork/components/DateTimePicker';
import { BlueButton } from '../../../../../../Components/Theme/Buttons/BlueButton';
import { GreenButton } from '../../../../../../Components/Theme/Buttons/GreenButton';
import StyledInput from '../../../../../../Components/Theme/Fields/StyledInput';
import { useTechWorkProcessUpdateMutation } from '../../../../../techWork/api';
import moment from 'moment/moment';

const innitialValues = {
  eic: null,
  dt: null
};

const DeleteTkoModal = ({ data, handleClose }) => {
  const { t } = useTranslation();
  const isOpen = data.modalType === modalTypes.deleteTko && !!data.processData;
  const [values, setValues] = useState(innitialValues);
  const [error, setError] = useState(null);
  const [handleDeleteTko, { isLoading: isDeleteTkoLoading }] = useTechWorkProcessUpdateMutation({
    fixedCacheKey: 'processes-quality-monitoring'
  });

  const handleOnChange = (field, value) => {
    if (field === 'dt') {
      value.isAfter(moment()) ? setError({ dt: t('VERIFY_MSG.DATE_IS_MORE_THEN_VALID') }) : setError(null);
    }
    setValues({ ...values, [field]: value });
  };

  const handleModalClose = () => {
    handleClose();
    setValues(innitialValues);
    setError(null);
  };

  const onSubmit = () => {
    handleDeleteTko({ uid: data.processData.uid, data: values, actionType: 'remove-ap' })
      .unwrap()
      .then(() => handleModalClose())
      .catch(() => {});
  };

  const isSubmitAllowed = Object.values(values).every((value) => !!value) && !error && !isDeleteTkoLoading;

  return (
    <ModalWrapper
      open={isOpen}
      onClose={handleModalClose}
      header={t('TECH_WORKS.MODALS.SELECT_TKO_TO_DELETE_FROM', {
        processName: t(`GROUPS.${data.processData?.group}`),
        processId: data.processData?.id
      })}
      transitionDuration={{ enter: 225, exit: 0 }}
    >
      <Grid container spacing={2} sx={{ pt: 5 }}>
        <Grid item xs={7}>
          <StyledInput
            label={t('FIELDS.AP_EIC_CODE')}
            value={values.eic || ''}
            onChange={(e) => handleOnChange('eic', e.target.value)}
          />
        </Grid>
        <Grid item xs={5}>
          <DateTimePicker
            label={t('FIELDS.TKO_DELETION_DATE_TIME')}
            value={values.dt || ''}
            onChange={(value) => handleOnChange('dt', value)}
            minDate={data.processData?.created_at && moment(data.processData?.created_at)}
            maxDate={moment()}
            maxDateMessage={t('VERIFY_MSG.DATE_IS_MORE_THEN_VALID')}
            error={error?.dt}
          />
        </Grid>
      </Grid>
      <Stack direction={'row'} sx={{ pt: 5 }} justifyContent={'space-between'} spacing={3}>
        <BlueButton onClick={handleModalClose} fullWidth>
          {t('CONTROLS.CANCEL')}
        </BlueButton>
        <GreenButton onClick={onSubmit} disabled={!isSubmitAllowed} fullWidth>
          {t('CONTROLS.SAVE')}
        </GreenButton>
      </Stack>
    </ModalWrapper>
  );
};

export default DeleteTkoModal;
