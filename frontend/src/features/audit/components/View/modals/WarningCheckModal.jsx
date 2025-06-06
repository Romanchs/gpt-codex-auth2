import PropTypes from 'prop-types';
import { Grid, Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { ModalWrapper } from '../../../../../Components/Modal/ModalWrapper';
import { BlueButton } from '../../../../../Components/Theme/Buttons/BlueButton';
import { GreenButton } from '../../../../../Components/Theme/Buttons/GreenButton';
import DatePicker from '../../../../../Components/Theme/Fields/DatePicker';
import SearchAuditors from '../../SearchAuditors';
import { useMemo, useState } from 'react';
import moment from 'moment';
import MultiSelectAuditors from '../../Сreate/MultiSelectAuditors';

const initValues = { date_start: null, date_end: null, auditor: null, manager: null };

const WarningCheckModal = ({ open, onSubmit, onClose }) => {
  const { t } = useTranslation();
  const [data, setData] = useState(initValues);

  const isDateRangeValid = (data) => {
    return moment(data.date_start).isValid() 
    && moment(data.date_end).isValid()
    && moment(data.date_end) >= moment(data.date_start) ;
  }

  const isCreateDisabled = useMemo(() => Object.values(data).some((v) => !v) || !isDateRangeValid(data), [data]);
  

  const handleChangeDateTo = (date) => {
    if (moment(date) < moment(data.date_start)) setData((prev) => ({ ...prev, date_start: null, date_end: date }));
    else setData({ ...data, date_end: date });
  };

  const handleClose = () => {
    setData(initValues);
    onClose();
  };

  const handleSubmit = () => {
    onSubmit(data)
    setData(initValues);
  };

  return (
    <ModalWrapper header={t('AUDIT.WARNING_CHECK_CREATE_MODAL_TITLE')} open={open} onClose={handleClose}>
      <Grid container spacing={1.5} sx={{ mt: 2 }}>
        <Grid item xs={12} sm={6}>
          <DatePicker
            label={t('FIELDS.AUDIT_DATE_START')}
            outFormat={'YYYY-MM-DD'}
            value={data.date_start}
            maxDate={data.date_end || undefined}
            onChange={(date) => setData((prev) => ({ ...prev, date_start: date }))}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <DatePicker
            label={t('FIELDS.AUDIT_DATE_END')}
            outFormat={'YYYY-MM-DD'}
            value={data.date_end}
            minDate={data.date_start || undefined}
            onChange={handleChangeDateTo}
          />
        </Grid>
        <Grid item xs={12}>
          <MultiSelectAuditors
            value={data?.auditor || []}
            label={t('FIELDS.INSPECTOR_FULL_NAME')}
            onChange={(v) => setData((prev) => ({ ...prev, auditor: v }))}
          />
        </Grid>
        <Grid item xs={12}>
          <SearchAuditors
            label={t('FIELDS.MANAGER_FULL_NAME')}
            showAll
            value={data.manager}
            onSelect={(v) => setData((prev) => ({ ...prev, manager: v }))}
          />
        </Grid>
      </Grid>
      <Stack direction={'row'} sx={{ pt: 3 }} justifyContent={'space-between'} spacing={1}>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <BlueButton onClick={handleClose} style={{ width: '100%' }}>
              {t('CONTROLS.CANCEL')}
            </BlueButton>
          </Grid>
          <Grid item xs={6}>
            <GreenButton onClick={handleSubmit} style={{ width: '100%' }} disabled={isCreateDisabled}>
              {t('CONTROLS.CREATE')}
            </GreenButton>
          </Grid>
        </Grid>
      </Stack>
    </ModalWrapper>
  );
};

WarningCheckModal.propTypes = {
  title: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired
};

export default WarningCheckModal;
