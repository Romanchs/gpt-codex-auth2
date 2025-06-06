import { useTranslation } from 'react-i18next';
import Page from '../../Components/Global/Page';
import CircleButton from '../../Components/Theme/Buttons/CircleButton';
import { useNavigate } from 'react-router-dom';
import { AppBar, Box, Grid, Paper, Typography } from '@mui/material';
import DatePicker from '../../Components/Theme/Fields/DatePicker';
import { GreenButton } from '../../Components/Theme/Buttons/GreenButton';
import DoneRounded from '@mui/icons-material/DoneRounded';
import { useMemo, useState } from 'react';
import moment from 'moment';
import { Pagination } from '../../Components/Theme/Table/Pagination';
import { useActionLogEventsQuery, useCreateEventsReportMutation } from './api';
import ActionsLogTable from './ActionsLogTable';
import { useDispatch } from 'react-redux';
import { enqueueSnackbar } from '../../actions/notistackActions';

export const START_DATE = '2024-03-01';

export const ACTIONS_LOG_ACCEPT_ROLES = ['АКО_Процеси', 'АКО_Суперечки'];

const ActionsLog = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    period_from: null,
    period_to: null
  });
  const [params, setParams] = useState({ page: 1, size: 25 });
  const { data, isFetching, originalArgs, refetch } = useActionLogEventsQuery(params, {
    skip: !params?.period_from || !params?.period_to,
    refetchOnMountOrArgChange: true
  });
  const [createEventsReport, { isLoading }] = useCreateEventsReportMutation();

  const isValidDateRange = (periodFrom, periodTo) => {
    const startDate = moment(periodFrom);
    const endDate = moment(periodTo);

    return (
      startDate.isValid() &&
      endDate.isValid() &&
      startDate.isBetween(START_DATE, moment(), 'days', '[]') &&
      endDate.isBetween(START_DATE, moment(), 'days', '[]') &&
      !(startDate.isAfter(periodTo) || moment(periodFrom).add(4, 'days').isBefore(periodTo))
    );
  };

  const disabledApply = useMemo(() => !isValidDateRange(filters.period_from, filters.period_to), [filters]);

  const handleCreateReport = () => {
    const { page, size, ...body } = params;
    createEventsReport(body).then((response) => {
      if (response?.data?.detail)
        dispatch(
          enqueueSnackbar({
            message: response.data.detail,
            options: {
              key: new Date().getTime() + Math.random(),
              variant: 'success',
              autoHideDuration: 5000
            }
          })
        );
    });
  };

  const handleApply = () => {
    if (JSON.stringify({ ...params, ...filters }) === JSON.stringify(originalArgs)) {
      refetch();
    }
    setParams({ ...params, ...filters, page: 1 });
  };

  const periodToMaxDate = useMemo(() => {
    const currentDate = moment();
    if (!filters.period_from) return currentDate;

    const maxDate = moment(filters.period_from).add(4, 'days');
    return maxDate > currentDate ? currentDate : maxDate;
  }, [filters.period_from]);

  const periodToMinDate = useMemo(() => {
    const periodFrom = moment(filters.period_from);
    if (!filters.period_from || periodFrom < moment(START_DATE)) return START_DATE;
    return periodFrom;
  }, [filters.period_from]);

  const onChangeStartDate = (date) => {
    if (filters.period_to && !isValidDateRange(date, filters.period_to)) {
      setFilters({ ...filters, period_from: moment(date).format(), period_to: moment(date).format() });
    } else {
      setFilters({ ...filters, period_from: moment(date).format() });
    }
  };

  const onChangeParams = (search) => {
    const searchParams = {};
    for (const key in search) {
      searchParams[key] = search[key] || undefined;
    }
    setParams({ ...params, ...searchParams, page: 1 });
  };

  return (
    <Page
      pageName={t('PAGES.USER_ACTIONS_LOG')}
      backRoute={'/'}
      loading={isFetching || isLoading}
      acceptPermisions={'ACTIONS_LOG.ACCESS'}
      acceptRoles={ACTIONS_LOG_ACCEPT_ROLES}
      faqKey={'INFORMATION_BASE__USER_ACTIONS_LOG'}
      disableLogging
      controls={
        <>
          <CircleButton
            type={'document'}
            title={t('PAGES.FORMED_REQUESTS')}
            onClick={() => navigate('/actions-log/requests')}
          />
          <CircleButton
            disabled={!params?.period_from || !params?.period_to}
            type={'download'}
            title={t('CONTROLS.GENERATE_REPORT')}
            onClick={handleCreateReport}
          />
        </>
      }
    >
      <Paper elevation={4} sx={{ borderRadius: 3, overflow: 'hidden', mb: 2 }}>
        <AppBar sx={{ position: 'relative', px: 3, py: 1.75, zIndex: 2 }} color={'blue'} elevation={0}>
          <Typography variant={'body1'}>{t('GENERAL_FILTERS')}</Typography>
        </AppBar>
        <Grid container spacing={2} sx={{ px: 3, py: 2 }} alignItems={'center'}>
          <Grid item xs={12} sm={3}>
            <DatePicker
              label={t('FIELDS.PERIOD_FROM')}
              value={filters.period_from || null}
              maxDate={moment()}
              minDate={moment(START_DATE)}
              onChange={onChangeStartDate}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <DatePicker
              label={t('FIELDS.PERIOD_TO')}
              value={filters.period_to || null}
              maxDate={periodToMaxDate}
              minDate={periodToMinDate}
              onChange={(date) => setFilters({ ...filters, period_to: moment(date).format() })}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <GreenButton
                style={{ borderRadius: 20, padding: '0 16px', height: 32 }}
                onClick={handleApply}
                disabled={disabledApply}
                data-marker={'apply'}
                data-status={disabledApply ? 'disabled' : 'active'}
              >
                <DoneRounded />
                {t('CONTROLS.ENGAGE')}
              </GreenButton>
            </Box>
          </Grid>
        </Grid>
      </Paper>
      {Boolean(data) && <ActionsLogTable list={data?.data || []} onSearch={onChangeParams} params={params} />}
      {Boolean(data) && (
        <Pagination
          {...data}
          params={params}
          loading={isFetching}
          onPaginate={(p) => setParams((params) => ({ ...params, ...p }))}
        />
      )}
    </Page>
  );
};

export default ActionsLog;
