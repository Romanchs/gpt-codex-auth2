import moment from 'moment';
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { confirmConnectionDisconnectionPoint } from '../../../../actions/processesActions';
import { ModalWrapper } from '../../../Modal/ModalWrapper';
import StyledInput from '../../../Theme/Fields/StyledInput';
import DatePicker from '../../../Theme/Fields/DatePicker';
import TimePicker from '../../../Theme/Fields/TimePicker';
import { WhiteButton } from '../../../Theme/Buttons/WhiteButton';
import { BlueButton } from '../../../Theme/Buttons/BlueButton';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';
import { CircularProgress, Grid, Typography } from '@mui/material';

const TerminationModal = ({ data, onClose, uid, minDate, refetch }) => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const open = Boolean(data);
  const dispatch = useDispatch();
  const [date, setDate] = useState(moment());
  const [time, setTime] = useState(moment());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) setTime(moment());
  }, [open]);

  const dateError = useMemo(() => {
    return (
      (minDate && moment(date).startOf('day').unix() < moment(minDate).startOf('day').unix()) ||
      moment(date).startOf('day').unix() > moment().startOf('day').unix()
    );
  }, [date, minDate]);

  const timeError = useMemo(() => {
    const diff = minDate ? moment(minDate).startOf('day').diff(moment(time).startOf('day'), 'days') : 0;
    if (
      !dateError &&
      minDate &&
      moment(date).startOf('day').unix() === moment(minDate).startOf('day').unix() &&
      moment(minDate).unix() > moment(time).add(diff, 'days').unix()
    ) {
      return t('VERIFY_MSG.TIME_SHOULD_BE_MORE_THEN_PARAM', { param: moment(minDate).format('HH:mm') });
    }
    if (
      !dateError &&
      moment(date).startOf('day').unix() === moment().startOf('day').unix() &&
      moment().unix() < moment(time).unix()
    ) {
      return t('VERIFY_MSG.TIME_MUST_NOT_EXCEED_CUREENT_TIME');
    }
    return '';
  }, [dateError, minDate, date, time]);

  const handleApprove = () => {
    const body = {
      uid: data?.uid,
      valid_from_date: moment(date).format('yyyy-MM-DD'),
      valid_from_time: moment(time).format('HH:mm:ss')
    };
    setLoading(true);
    dispatch(
      confirmConnectionDisconnectionPoint(
        uid,
        body,
        (res) => {
          setLoading(false);
          setDate(moment());
          setTime(moment());
          onClose();
          refetch();
          if (res?.data?.code === 'W005') {
            enqueueSnackbar(res?.data?.detail, { variant: 'warning' });
          }
        },
        () => setLoading(false)
      )
    );
  };

  return (
    <ModalWrapper
      open={open}
      header={t('MODALS.ENTER_DATE_TIME_OF_CHANGE_AP_STATUS')}
      onClose={onClose}
      maxWidth={'lg'}
    >
      <Typography
        variant={'body1'}
        color={'error'}
        style={{ textTransform: 'uppercase', paddingTop: 16, paddingBottom: 28, width: 600 }}
      >
        {t('WARNING_AFTER_CONFIRMING_THE_ENTERED_VALUES_THEIR_CHANGE_WILL_NOT_BE_AVAILABLE')}
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4.5}>
          <StyledInput label={t('FIELDS.AP_EIC_CODE')} readOnly value={data?.eic || ''} />
        </Grid>
        <Grid item xs={12} sm={4}>
          <DatePicker
            label={t('FIELDS.STATUS_CHANGE_DATE')}
            value={date}
            onChange={setDate}
            minDate={minDate && moment(minDate)}
            minDateMessage={t('VERIFY_MSG.DATE_CANNOT_BE_EARLIER_THAN_PLANNED_DATE_OF_STATUS_CHANGE')}
            maxDate={moment()}
            maxDateMessage={t('VERIFY_MSG.DATE_MUST_NOT_EXCEED_CUREENT_DATE')}
          />
        </Grid>
        <Grid item xs={12} sm={3.5}>
          <TimePicker label={t('FIELDS.STATUS_CHANGE_TIME')} value={time} onChange={setTime} error={timeError} />
        </Grid>
      </Grid>
      {loading ? (
        <div style={{ textAlign: 'center', paddingTop: 24 }}>
          <CircularProgress color={'secondary'} size={28} />
        </div>
      ) : (
        <Grid container spacing={2} style={{ paddingTop: 24 }}>
          <Grid item xs={12} sm={6}>
            <WhiteButton style={{ width: '100%' }} onClick={onClose}>
              {t('CONTROLS.CANCEL')}
            </WhiteButton>
          </Grid>
          <Grid item xs={12} sm={6}>
            <BlueButton
              style={{ width: '100%' }}
              onClick={handleApprove}
              disabled={dateError || Boolean(timeError) || loading}
            >
              {t('CONTROLS.APPROVE')}
            </BlueButton>
          </Grid>
        </Grid>
      )}
    </ModalWrapper>
  );
};

export default TerminationModal;
