import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTakeToWorkErpMutation } from './api';
import { Grid } from '@material-ui/core';
import SelectField from '../../../Components/Theme/Fields/SelectField';
import DatePicker from '../../../Components/Theme/Fields/DatePicker';
import moment from 'moment';
import Page from '../../../Components/Global/Page';
import Statuses from '../../../Components/Theme/Components/Statuses';
import { DHTab, DHTabs2 } from '../../../Components/pages/Processes/Components/Tabs';
import CircleButton from '../../../Components/Theme/Buttons/CircleButton';
import { useTranslation } from 'react-i18next';
import i18n from '../../../i18n/i18n';
import VersionsByPeriod from '../../versionsByPeriod';

const InitErpReport = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [takeToWork, { error, isLoading, reset }] = useTakeToWorkErpMutation({ fixedCacheKey: 'takeToWorkErp' });
  const [form, setForm] = useState({
    start_date: null,
    end_date: null,
    version: null,
    subversion: 1
  });
  const [datesError, setDatesError] = useState({ from: null, to: null });

  const handleInit = () => {
    takeToWork(form).then((response) => {
      if (response.data && response.data.uid) navigate(`/processes/erp-report/${response.data.uid}`, { replace: true });
    });
  };

  const handleChange = (type) => (value) => {
    setForm((f) => ({ ...f, [type]: value }));
    if (error?.data[type]) {
      reset();
    }
  };

  const disableInit = error || !form.start_date || !form.end_date;

  return (
    <>
      <Page
        pageName={t('SUBPROCESSES.REPORT_ERP')}
        backRoute={'/processes'}
        loading={isLoading}
        acceptPermisions={'PROCESSES.ERP_REPORT.INITIALIZATION'}
        acceptRoles={['АКО_Процеси']}
        faqKey={'PROCESSES__REPORT_ERP'}
        controls={<CircleButton type={'create'} title={'Взяти в роботу'} onClick={handleInit} disabled={disableInit} />}
      >
        <Statuses statuses={['NEW', 'IN_PROCESS', 'DONE']} currentStatus={'NEW'} />
        <DHTabs2 value={1} sx={{ marginTop: 16 }}>
          <DHTab label={t('REQUEST_DETAILS')} value={1} />
          <DHTab label={t('DOWNLOADED_FILES')} value={2} disabled />
          <DHTab label={t('SENDED_DATA_TO_ERP')} value={3} disabled />
        </DHTabs2>
        <div className={'boxShadow'} style={{ padding: 24, marginTop: 16, marginBottom: 16 }}>
          <Grid container spacing={3} alignItems={'flex-start'}>
            <Grid item xs={12} md={6} lg={3}>
              <SelectField
                onChange={() => null}
                value={'all'}
                label={t('FIELDS.REPORT_TYPE')}
                disabled
                data={PROCESSES_TYPES_OPTIONS}
                dataMarker={'processType'}
              />
            </Grid>
            <Grid item xs={12} md={6} lg={2}>
              <DatePicker
                label={t('FIELDS.PERIOD_FROM')}
                value={form.start_date}
                outFormat={'YYYY-MM-DD'}
                maxDate={form.end_date ? moment(form.end_date) : moment('2200-01-01')}
                maxDateMessage={t('VERIFY_MSG.PERIOD_FROM_SHOUlLD_NOT_BE_LONGER_THAN_PERIOD_TO')}
                onChange={handleChange('start_date')}
                error={error?.data?.start_date}
                onError={(from) => setDatesError({ ...datesError, from })}
              />
            </Grid>
            <Grid item xs={12} md={6} lg={2}>
              <DatePicker
                label={t('FIELDS.PERIOD_TO')}
                outFormat={'YYYY-MM-DD'}
                value={form.end_date}
                minDate={form.start_date ? moment(form.start_date) : undefined}
                minDateMessage={t('VERIFY_MSG.PERIOD_TO_SHOUlLD_NOT_BE_LESS_THAN_PERIOD_FROM')}
                maxDate={moment('2200-01-01')}
                onChange={handleChange('end_date')}
                error={error?.data?.end_date}
                onError={(to) => setDatesError({ ...datesError, to })}
              />
            </Grid>
            <Grid item xs={12} md={6} lg={2}>
              <VersionsByPeriod
                from_date={form.start_date}
                to_date={form.end_date}
                label={t('FIELDS.VERSION')}
                value={form.version}
                useNull
                onChange={handleChange('version')}
                dataMarker={'version'}
                datesError={datesError}
              />
            </Grid>
            <Grid item xs={12} md={6} lg={2}>
              <SelectField
                onChange={handleChange('subversion')}
                value={form.subversion}
                label={t('FIELDS.SUBVERSION')}
                data={SUBVERSIONS_OPTIONS}
                dataMarker={'subversion'}
              />
            </Grid>
          </Grid>
        </div>
      </Page>
    </>
  );
};

const PROCESSES_TYPES_OPTIONS = [
  { value: 'all', label: i18n.t('ERP_PROCESSES_TYPES_OPTIONS.ALL') },
  { value: 1, label: i18n.t('ERP_PROCESSES_TYPES_OPTIONS.CONSUMPTION_BY_MANUFACTURER') },
  { value: 2, label: i18n.t('ERP_PROCESSES_TYPES_OPTIONS.CONSUMPTION_BY_USER') }
];

const SUBVERSIONS_OPTIONS = Array.from({ length: 100 }, (_, index) => ({ value: index + 1, label: index + 1 }));

export default InitErpReport;
