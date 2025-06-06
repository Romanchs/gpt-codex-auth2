import Paper from '@mui/material/Paper';
import { AppBar, Grid, Typography } from '@mui/material';
import StyledInput from '../../../../Components/Theme/Fields/StyledInput';
import DatePicker from '../../../../Components/Theme/Fields/DatePicker';
import { useTranslation } from 'react-i18next';
import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { onChangeMainFilters } from '../../slice';
import SearchAuditors from '../SearchAuditors';

const RegisterFilters = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const timeOut = useRef(null);
  const { auditor, job_type, aps, inspection_date_start, inspection_date_end, notice_executed, notice_closed } =
    useSelector((store) => store.audits.mainFilters);
  const [form, setForm] = useState({ aps, job_type });

  const handleChange =
    (name) =>
    ({ target: { value } }) => {
      clearTimeout(timeOut.current);
      setForm({ ...form, [name]: value });
      if (!value) {
        dispatch(onChangeMainFilters([name, undefined]));
        return;
      }
      timeOut.current = setTimeout(() => {
        dispatch(onChangeMainFilters([name, value]));
      }, 500);
    };

  const handleChangeDate = (key) => (date) => {
    if (!date || date.isValid()) {
      dispatch(onChangeMainFilters([key, date?.format('YYYY-MM-DD') || undefined]));
    }
  };

  return (
    <Paper elevation={4} sx={{ borderRadius: 3, overflow: 'hidden', mb: 2 }}>
      <AppBar sx={{ position: 'relative', px: 3, py: 1.75, zIndex: 2 }} color={'blue'} elevation={0}>
        <Typography variant={'body1'}>{t('GENERAL_FILTERS')}</Typography>
      </AppBar>
      <Grid container spacing={2} sx={{ px: 3, py: 3 }} alignItems={'flex-start'}>
        <Grid item xs={12} sm={6} lg={4}>
          <SearchAuditors
            defaultValue={auditor}
            label={t('FIELDS.INSPECTOR_FULL_NAME')}
            onSelect={(v) => dispatch(onChangeMainFilters(['auditor', v]))}
          />
        </Grid>
        <Grid item xs={12} sm={3} lg={2}>
          <StyledInput
            label={t('FIELDS.EVENT_TYPE')}
            value={form.job_type}
            dataMarker={'job_type'}
            onChange={handleChange('job_type')}
          />
        </Grid>
        <Grid item xs={12} sm={3} lg={2}>
          <StyledInput label={t('FIELDS.EICZ_CMP')} value={form.aps} onChange={handleChange('aps')} />
        </Grid>
        <Grid item xs={12} sm={3} lg={2}>
          <DatePicker
            label={t('FIELDS.AUDIT_ACT_START')}
            value={inspection_date_start}
            onChange={handleChangeDate('inspection_date_start')}
          />
        </Grid>
        <Grid item xs={12} sm={3} lg={2}>
          <DatePicker
            label={t('FIELDS.AUDIT_ACT_END')}
            value={inspection_date_end}
            onChange={handleChangeDate('inspection_date_end')}
          />
        </Grid>
        <Grid item xs={12} sm={3} lg={2}>
          <DatePicker
            label={t('FIELDS.NOTIFICATION_END_DATE')}
            value={notice_closed}
            onChange={handleChangeDate('notice_closed')}
          />
        </Grid>
        <Grid item xs={12} sm={3} lg={2}>
          <DatePicker
            label={t('FIELDS.NOTIFICATION_COMPLETE_DATE')}
            value={notice_executed}
            onChange={handleChangeDate('notice_executed')}
          />
        </Grid>
      </Grid>
    </Paper>
  );
};

export default RegisterFilters;
