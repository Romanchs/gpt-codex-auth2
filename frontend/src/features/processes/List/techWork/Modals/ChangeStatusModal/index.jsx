import { ModalWrapper } from '../../../../../../Components/Modal/ModalWrapper';
import { modalTypes } from '../../constants';
import { useTranslation } from 'react-i18next';
import { Grid, Stack, Typography } from '@mui/material';
import styles from './styles';
import { getName } from '../../../../../../Components/Theme/Components/Statuses';
import SelectField from '../../../../../../Components/Theme/Fields/SelectField';
import { statuses } from '../../../index';
import { useState } from 'react';
import DateTimePicker from '../../../../../techWork/components/DateTimePicker';
import { BlueButton } from '../../../../../../Components/Theme/Buttons/BlueButton';
import { GreenButton } from '../../../../../../Components/Theme/Buttons/GreenButton';
import { useTechWorkProcessUpdateMutation } from '../../../../../techWork/api';
import moment from 'moment';

const innitialValues = {
  status: null,
  dt: null
};

const ChangeStatusModal = ({ data, handleClose }) => {
  const { t } = useTranslation();
  const isOpen = data.modalType === modalTypes.changeStatus && !!data.processData;
  const [values, setValues] = useState(innitialValues);
  const [error, setError] = useState(null);
  const allowedStatuses = data?.processData?.admin_actions?.change_status ?? [];
  const allowedStatusesForChange = statuses.filter((status) => allowedStatuses.includes(status.value));
  const [handleChangeStatus, { isLoading: isChangeStatusLoading }] = useTechWorkProcessUpdateMutation({
    fixedCacheKey: 'processes-quality-monitoring'
  });

  const handleOnChange = (field) => (value) => {
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
    handleChangeStatus({ uid: data.processData.uid, data: values, actionType: 'change-status' })
      .unwrap()
      .then(() => handleModalClose())
      .catch(() => {});
  };

  const isSubmitAllowed = Object.values(values).every((value) => !!value) && !error && !isChangeStatusLoading;

  return (
    <ModalWrapper
      open={isOpen}
      onClose={handleModalClose}
      header={t('TECH_WORKS.MODALS.SELECT_DESIRED_PROCESS_STATUS', {
        processName: t(`GROUPS.${data.processData?.group}`),
        processId: data.processData?.id
      })}
      transitionDuration={{ enter: 225, exit: 0 }}
    >
      <Typography sx={styles.workStatus}>
        {t('TECH_WORKS.MODALS.CURRENT_PROCESS_STATUS', { status: getName(data.processData?.status, t) })}
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={7}>
          <SelectField
            label={t('FIELDS.STATUS')}
            value={values.status || ''}
            data={allowedStatusesForChange}
            onChange={handleOnChange('status')}
            disabled={!allowedStatusesForChange.length}
          />
        </Grid>
        <Grid item xs={5}>
          <DateTimePicker
            label={t('FIELDS.STATUS_CHANGE_DATETIME')}
            value={values.dt || ''}
            onChange={handleOnChange('dt')}
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

export default ChangeStatusModal;
