import Grid from '@mui/material/Grid';
import DoneRounded from '@mui/icons-material/DoneRounded';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { enqueueSnackbar } from '../../../actions/notistackActions';
import { GreenButton } from '../../../Components/Theme/Buttons/GreenButton';
import DatePicker from '../../../Components/Theme/Fields/DatePicker';
import { useTableStyles } from '../filterStyles';
import DateTimePicker from '../../../Components/Theme/Fields/DateTimePicker';
import Table from './Table';
import { mainApi } from '../../../app/mainApi';
import { useCreateMDZVMutation } from './api';
import { useTranslation } from 'react-i18next';
import useSearchLog from '../../../services/actionsLog/useSearchLog';
import { MONITORING_DKO_LOG_TAGS } from '../../../services/actionsLog/constants';
import PaperWithAppBar from '../../../Components/Theme/Components/PaperWithAppBar';
import { Box } from '@mui/material';
import VersionsByPeriod from '../../versionsByPeriod';

const initialFilters = {
  period_from: null,
  period_to: null,
  version: null,
  started_at: null,
  finished_at: null
};

const ZVTab = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const classes = useTableStyles();
  const params = useSelector((store) => store.monitoringDko.params);
  const [filters, setFilters] = useState(initialFilters);
  const [datesError, setDatesError] = useState({ from: null, to: null });
  const { data } = mainApi.endpoints.getListMDZV.useQueryState(params);
  const [create, { error }] = useCreateMDZVMutation({ fixedCacheKey: 'MDZV_create' });
  const searchLog = useSearchLog(MONITORING_DKO_LOG_TAGS);

  useEffect(() => {
    if (!data) return;
    setFilters((prev) => ({
      ...prev,
      period_from: data.period_from,
      period_to: data.period_to,
      version: data.version,
      started_at: data.started_at,
      finished_at: data.finished_at
    }));
  }, [data]);

  const handleOnChangeFilters = (filter) => (value) => {
    setFilters({ ...filters, [filter]: value });
  };

  const handleCreate = async () => {
    const { error } = await create({
      period_from: moment(filters.period_from).startOf('day').utc().format(),
      period_to: moment(filters.period_to).startOf('day').utc().format(),
      version: filters.version
    });
    searchLog();
    if (!error) {
      dispatch(
        enqueueSnackbar({
          message: t('FORMING_REPORT_STARTED'),
          options: {
            key: new Date().getTime() + Math.random(),
            variant: 'success',
            autoHideDuration: 5000
          }
        })
      );
    }
  };

  return (
    <>
      <PaperWithAppBar header={t('ADDITIONAL_INFO')}>
        <Grid container spacing={2} alignItems={'flex-start'}>
          <Grid item xs={12} md={6} lg={1.9}>
            <DatePicker
              onError={(from) => setDatesError({ ...datesError, from })}
              label={t('FIELDS.REPORT_PERIOD_FROM')}
              value={filters.period_from}
              onChange={handleOnChangeFilters('period_from')}
              maxDate={moment().subtract('1', 'days')}
              error={error?.data?.period_from}
              disabled={!data?.can_start}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={1.9}>
            <DatePicker
              onError={(to) => setDatesError({ ...datesError, to })}
              label={t('FIELDS.REPORT_PERIOD_TO')}
              value={filters.period_to}
              onChange={handleOnChangeFilters('period_to')}
              maxDate={moment().subtract('1', 'days')}
              error={error?.data?.period_to}
              disabled={!data?.can_start}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={1.2}>
            <VersionsByPeriod
              label={t('FIELDS.VERSION')}
              value={filters.version}
              onChange={handleOnChangeFilters('version')}
              useEmptySting
              useNull
              error={error?.data?.version}
              disabled={!data?.can_start}
              from_date={filters?.period_from}
              to_date={filters?.period_to}
              datesError={datesError}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={2}>
            <DateTimePicker
              label={t('FIELDS.REPORT_STARTED_AT')}
              value={filters.started_at}
              onChange={handleOnChangeFilters('started_at')}
              error={error?.data?.started_at}
              disabled
            />
          </Grid>
          <Grid item xs={12} md={6} lg={2}>
            <DateTimePicker
              label={t('FIELDS.REPORT_FORMED_AT')}
              value={filters.finished_at}
              onChange={handleOnChangeFilters('finished_at')}
              error={error?.data?.finished_at}
              disabled
            />
          </Grid>
          <Box sx={{ flexGrow: 1 }} />
          <Grid item xs={12} sm={'auto'} sx={{ textAlign: 'right', mt: 0.5 }}>
            <GreenButton
              data-marker={'create'}
              onClick={handleCreate}
              className={classes.saveButton}
              disabled={!data?.can_start || !filters.period_from || !filters.period_to}
            >
              <DoneRounded />
              {t('CONTROLS.ENGAGE')}
            </GreenButton>
          </Grid>
        </Grid>
      </PaperWithAppBar>
      <Table />
    </>
  );
};

export default ZVTab;
