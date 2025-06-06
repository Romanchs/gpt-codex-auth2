import Page from '../../Components/Global/Page';
import { useTranslation } from 'react-i18next';
import { AUDITS_WRITE_PERMISSION, AUDITS_WRITE_ROLES } from './index';
import CircleButton from '../../Components/Theme/Buttons/CircleButton';
import { AppBar, Grid, Typography } from '@mui/material';
import React, { useMemo, useState } from 'react';
import Paper from '@mui/material/Paper';
import SelectField from '../../Components/Theme/Fields/SelectField';
import { AUDIT_TYPES, JOB_TYPES } from './data';
import StyledInput from '../../Components/Theme/Fields/StyledInput';
import { useSelector } from 'react-redux';
import DatePicker from '../../Components/Theme/Fields/DatePicker';
import SearchAuditors from './components/SearchAuditors';
import MultiSelectAuditors from './components/Сreate/MultiSelectAuditors';
import PpkoSearch from './components/Сreate/PpkoSearch';
import { useCreateAuditMutation } from './api';
import { useNavigate } from 'react-router-dom';
import Autocomplete from '../../Components/Theme/Fields/Autocomplete';
import moment from 'moment';

const Create = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const initiator = useSelector((store) => store.user.full_name);
  const [onCreate, { isLoading, error, reset }] = useCreateAuditMutation();

  const [form, setForm] = useState({
    audit_type: '',
    job_type: '',
    auditor: [],
    manager: '',
    audit_period_start: null,
    audit_period_end: null,
    eices_z: [],
    date_start: null,
    date_end: null,
    rationale: '',
    name: '',
    eic_x: '',
    usreou: '',
    city: '',
    address: ''
  });

  const isScheduled = form.audit_type === 'SCHEDULED';

  const AVIABLES_JOB_TYPES = useMemo(() => {
    if (isScheduled) {
      return ['ПВФ'];
    } else {
      return JOB_TYPES;
    }
  }, [form.audit_type, JOB_TYPES]);

  const createIsDisabled = useMemo(() => {
    const dates = [form.audit_period_start, form.audit_period_end, form.date_start, form.date_end];
    if (
      !form.audit_type ||
      !form.job_type ||
      !form.manager ||
      !form.address ||
      (!isScheduled && !form.audit_period_start) ||
      (!isScheduled && !form.audit_period_end) ||
      !form.date_start ||
      !form.date_end
    ) {
      return true;
    }
    if (form.auditor.length === 0) {
      return true;
    }
    if (dates.find((i) => i === 'Invalid date')) {
      return true;
    }
    if (
      moment(form.audit_period_start).isAfter(moment().endOf('day')) ||
      moment(form.audit_period_end).isAfter(moment().endOf('day'))
    ) {
      return true;
    }
    if (!isScheduled && form.eices_z.length < 1) {
      return true;
    }
    if (!isScheduled && (form.rationale.length < 10 || form.rationale.length > 200)) return true;
    return !isScheduled && !form.rationale;
  }, [form]);

  const handleCreate = () => {
    onCreate({
      ...form,
      initiator
    }).then((res) => {
      if (res?.data?.uid) {
        navigate('/audits/' + res.data.uid);
      }
    });
  };

  const updateForm = (key, value) => {
    reset();
    setForm((form) => ({ ...form, [key]: value }));
  };

  const updateAuditType = (value) => {
    updateForm('audit_type', value);
    updateForm('job_type', value === 'SCHEDULED' ? 'ПВФ' : '');
  };

  return (
    <Page
      pageName={t('PAGES.AUDIT_CREATION')}
      backRoute={'/audits'}
      loading={isLoading}
      acceptRoles={AUDITS_WRITE_ROLES}
      acceptPermisions={AUDITS_WRITE_PERMISSION}
      controls={
        <CircleButton
          type={'create'}
          title={t('CONTROLS.CREATE_AUDIT')}
          onClick={handleCreate}
          disabled={createIsDisabled}
        />
      }
    >
      <Paper elevation={4} sx={{ borderRadius: 3, overflow: 'hidden', mb: 2 }}>
        <AppBar sx={{ position: 'relative', px: 3, py: 1.75, zIndex: 2 }} color={'blue'} elevation={0}>
          <Typography variant={'body1'}>{t('AUDIT_CREATION_FORM_HEADER')}</Typography>
        </AppBar>
        <Grid container spacing={2} sx={{ px: 3, py: 3 }} alignItems={'flex-start'}>
          <Grid item xs={12} sm={6} lg={3}>
            <SelectField
              label={t('FIELDS.AUDIT_TYPE')}
              value={form.audit_type}
              data={AUDIT_TYPES}
              dataMarker={'audit_type'}
              onChange={updateAuditType}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <StyledInput disabled value={initiator} label={t('FIELDS.USER_INITIATOR')} />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <Autocomplete
              label={t('FIELDS.EVENT_TYPE')}
              freeSolo
              list={AVIABLES_JOB_TYPES}
              value={form.job_type}
              onInput={(e, value) => updateForm('job_type', value)}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <MultiSelectAuditors
              value={form.auditor}
              label={t('FIELDS.INSPECTOR_FULL_NAME')}
              onChange={(auditors) => updateForm('auditor', auditors)}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <DatePicker
              label={t('FIELDS.AUDIT_DKO_DATE_START')}
              value={form.audit_period_start}
              onChange={(v) => updateForm('audit_period_start', v)}
              outFormat={'YYYY-MM-DD'}
              maxDate={moment()}
              required={!isScheduled}
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <DatePicker
              label={t('FIELDS.AUDIT_DKO_DATE_END')}
              value={form.audit_period_end}
              onChange={(v) => updateForm('audit_period_end', v)}
              outFormat={'YYYY-MM-DD'}
              maxDate={moment()}
              required={!isScheduled}
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <SearchAuditors
              label={t('FIELDS.MANAGER_FULL_NAME')}
              showAll
              defaultValue={form.manager}
              onSelect={(v) => updateForm('manager', v)}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <MultiSelectAuditors
              label={t('FIELDS.EICZ_CMP')}
              value={form.eices_z}
              solo
              error={error?.data?.eices_z}
              onChange={(list) => updateForm('eices_z', list)}
              required={!isScheduled}
            />
          </Grid>
          <Grid item xs={12}>
            <PpkoSearch
              label={t('FIELDS.PPKO_NAME')}
              value={form.name}
              name={'full_name'}
              onChange={(ppko) => setForm({ ...form, ...ppko })}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <PpkoSearch
              label={t('FIELDS.EIC_PPKO')}
              value={form.eic_x}
              name={'eic'}
              onChange={(ppko) => setForm({ ...form, ...ppko })}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <PpkoSearch
              label={t('FIELDS.USREOU')}
              value={form.usreou}
              name={'usreou'}
              onChange={(ppko) => setForm({ ...form, ...ppko })}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <DatePicker
              label={t('FIELDS.AUDIT_DATE_START')}
              value={form.date_start}
              onChange={(v) => updateForm('date_start', v)}
              outFormat={'YYYY-MM-DD'}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <DatePicker
              label={t('FIELDS.AUDIT_DATE_END')}
              value={form.date_end}
              onChange={(v) => updateForm('date_end', v)}
              outFormat={'YYYY-MM-DD'}
              required
              error={error?.data?.date_end}
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <StyledInput label={t('FIELDS.CITY')} value={form.city} disabled />
          </Grid>
          <Grid item xs={12} lg={9}>
            <StyledInput label={t('CONTACTS_DATA.ADDRESS')} value={form.address} disabled />
          </Grid>
          {!isScheduled && (
            <Grid item xs={12}>
              <StyledInput
                label={t('FIELDS.JUSTIFICATION')}
                value={form.rationale}
                multiline
                onChange={(v) => updateForm('rationale', v.target.value)}
                required
                max={200}
                error={error?.data?.rationale}
                helperText={t('VERIFY_MSG.MIN_10_MAX_200_SYMBOLS')}
              />
            </Grid>
          )}
        </Grid>
      </Paper>
    </Page>
  );
};

export default Create;
