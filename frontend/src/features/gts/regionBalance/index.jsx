import React, { useCallback, useMemo, useState } from 'react';
import Page from '../../../Components/Global/Page';
import CircleButton from '../../../Components/Theme/Buttons/CircleButton';
import { GreenButton } from '../../../Components/Theme/Buttons/GreenButton';
import SelectField from '../../../Components/Theme/Fields/SelectField';
import StyledInput from '../../../Components/Theme/Fields/StyledInput';
import Autocomplete from '../../../Components/Theme/Fields/Autocomplete';
import DoneRounded from '@mui/icons-material/DoneRounded';
import moment from 'moment/moment';
import DataTable from './DataTable';
import { useExportFileMutation, useLazyRegionBalanceListQuery, useMeteringGridAreasQuery } from './api';
import DatePicker from '../../../Components/Theme/Fields/DatePicker';
import Grid from '@mui/material/Grid';
import { useTranslation } from 'react-i18next';
import i18n from '../../../i18n/i18n';
import useExportFileLog from '../../../services/actionsLog/useEportFileLog';
import useSearchLog from '../../../services/actionsLog/useSearchLog';
import { GTS_LOG_TAGS } from '../../../services/actionsLog/constants';
import { AppBar, Box, Typography } from '@mui/material';
import Paper from '@mui/material/Paper';
import VersionsByPeriod from '../../versionsByPeriod';

export const GTS_REGION_BALANCE_ACCEPT_ROLES = ['АКО_Процеси', 'ОС', 'ОДКО', 'ОМ'];

const RegionBalance = () => {
  const { t } = useTranslation();
  const initParams = {
    period_type: TYPES[0].value,
    metering_grid_area_id: '',
    period_from: undefined,
    period_to: undefined,
    month: '',
    year: moment().subtract(1, 'day').year()
  };
  const [params, setParams] = useState(initParams);
  const [fetch, { data, isFetching, isUninitialized, error }] = useLazyRegionBalanceListQuery();
  const { data: eicYList } = useMeteringGridAreasQuery();
  const [downloadFile] = useExportFileMutation();

  const exportFileLog = useExportFileLog(GTS_LOG_TAGS);
  const searchLog = useSearchLog();

  const handleDownload = () => {
    let exportDto = {
      period_type: params.period_type,
      metering_grid_area_id: params.metering_grid_area_id,
      version: params.version || null
    };
    if (params.period_type === PERIOD_TYPES.day)
      downloadFile({
        ...exportDto,
        period_from: params.period_from,
        period_to: params.period_to
      });
    if (params.period_type === PERIOD_TYPES.month)
      downloadFile({ ...exportDto, month: params.month, year: params.year });
    if (params.period_type === PERIOD_TYPES.year) downloadFile({ ...exportDto, year: params.year });
    exportFileLog();
  };

  const onSearch = (id, value) => {
    if (id === 'year' && params.period_type === PERIOD_TYPES.month) {
      setParams({ ...params, [id]: value, month: 0 });
      return;
    }
    if (id === 'period_type') {
      setParams({
        ...params,
        [id]: value,
        month: '',
        period_from: undefined,
        period_to: undefined,
        year: moment().subtract(1, 'day').year()
      });
      return;
    }
    if (id === 'version' && !value && value !== 0) {
      setParams({ ...params, [id]: undefined });
      return;
    }
    setParams({ ...params, [id]: value });
  };

  const handleApplyFiters = () => {
    fetch(params);
    searchLog();
  };

  const validateYear = useCallback(() => {
    if (params.year < 2019) {
      return t('VERIFY_MSG.DATE_IS_LESS_THEN_VALID');
    }
    if (params.year > moment().subtract(1, 'days').year()) {
      return t('VERIFY_MSG.DATE_IS_MORE_THEN_VALID');
    }
    return error?.data?.details?.year;
  }, [params.year, error]);

  const getMonths = useCallback(() => {
    if (params.period_type === PERIOD_TYPES.month && Number(params.year) === 2019) {
      return MONTHES.filter((i) => i.value >= 7);
    }
    if (params.period_type === PERIOD_TYPES.month && Number(params.year) === moment().subtract(1, 'days').year()) {
      return MONTHES.filter((i) => i.value <= moment().subtract(1, 'days').month() + 1);
    }
    return MONTHES;
  }, [params.year, params.period_type]);

  const validate = useCallback(() => {
    if (!params.metering_grid_area_id?.length) {
      return false;
    }
    if (params.period_type === PERIOD_TYPES.day) {
      const from = moment(params.period_from);
      const to = moment(params.period_to);
      const now = moment().subtract(1, 'day');
      const minDate = moment('2019-06-30');
      const isValidRange =
        from.isValid() &&
        to.isValid() &&
        from.isAfter(minDate) &&
        from.isBefore(now) &&
        to.isAfter(minDate) &&
        to.isBefore(now) &&
        to.diff(from, 'days') <= 31;
      return isValidRange;
    }
    if (params.period_type === PERIOD_TYPES.month) {
      return Boolean(params.month);
    }
    if (params.period_type === PERIOD_TYPES.year) {
      return !validateYear();
    }
    return true;
  }, [params]);

  const versionsDates = useMemo(() => {
    switch (params.period_type) {
      case PERIOD_TYPES.day:
        return { from: params.period_from, to: params.period_to };
      case PERIOD_TYPES.month:
        if (params.month > 0) {
          const date = moment()
            .set('year', Number(params.year))
            .set('month', params.month - 1);
          return { from: date.startOf('month').format('YYYY-MM-DD'), to: date.endOf('month').format('YYYY-MM-DD') };
        }
        return null;
      case PERIOD_TYPES.year:
        if (!validateYear()) {
          const date = moment().set('year', Number(params.year));
          return { from: date.startOf('year').format('YYYY-MM-DD'), to: date.endOf('year').format('YYYY-MM-DD') };
        }
        return null;
      default:
        return null;
    }
  }, [params]);

  return (
    <Page
      pageName={t('PAGES.REGION_BALANCE')}
      backRoute={'/gts'}
      loading={isFetching}
      acceptPermisions={'GTS.TKO_LIST_VIEW.CONTROLS.REGION_BALANCE'}
      acceptRoles={GTS_REGION_BALANCE_ACCEPT_ROLES}
      controls={
        <>
          <CircleButton
            type={'download'}
            data-marker={'download'}
            title={t('CONTROLS.EXPORT')}
            dataMarker={'region-balance-download'}
            onClick={handleDownload}
            disabled={isUninitialized}
          />
        </>
      }
    >
      <Paper elevation={4} sx={{ borderRadius: 3, overflow: 'hidden', mb: 2 }}>
        <AppBar sx={{ position: 'relative', px: 3, py: 1.75, zIndex: 2 }} color={'blue'} elevation={0}>
          <Typography variant={'body1'}>{t('GENERAL_FILTERS')}</Typography>
        </AppBar>
        <Grid container spacing={2} sx={{ px: 3, py: 2 }} alignItems={'center'}>
          <Grid item xs={12} sm={6} md={2.5}>
            <Autocomplete
              label={t('FIELDS.METERING_GRID_AREA_ID')}
              data-marker={'metering_grid_area_id'}
              list={eicYList || []}
              disablePortal={false}
              scrollLock
              onChange={(v) => onSearch('metering_grid_area_id', v?.value || null)}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <SelectField
              onChange={(type) => onSearch('period_type', type)}
              data={TYPES}
              dataMarker={'period_type'}
              label={t('FIELDS.DIMENSION')}
              value={params.period_type}
              error={error?.data?.type}
            />
          </Grid>
          {params.period_type === PERIOD_TYPES.day && (
            <>
              <Grid item xs={12} sm={6} md={2}>
                <DatePicker
                  label={t('FIELDS.PERIOD_FROM')}
                  value={params.period_from}
                  dataMarker="period_from"
                  onChange={(date) => onSearch('period_from', date)}
                  outFormat="yyyy-MM-DD"
                  minDate={params.period_to ? moment(params.period_to).subtract(31, 'day') : moment('2019-07-01')}
                  maxDate={params.period_to ? moment(params.period_to) : moment().subtract(1, 'day')}
                  error={error?.data?.period_from}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={2}>
                <DatePicker
                  label={t('FIELDS.PERIOD_TO')}
                  value={params.period_to}
                  dataMarker="period_to"
                  onChange={(date) => onSearch('period_to', date)}
                  outFormat="yyyy-MM-DD"
                  minDate={params.period_from ? moment(params.period_from) : moment('2019-07-01')}
                  maxDate={
                    params.period_from
                      ? moment.min(moment(params.period_from).add(31, 'day'), moment().subtract(1, 'day'))
                      : moment().subtract(1, 'day')
                  }
                  error={error?.data?.period_to}
                />
              </Grid>
            </>
          )}
          {(params.period_type === PERIOD_TYPES.year || params.period_type === PERIOD_TYPES.month) && (
            <Grid item xs={12} sm={6} md={2}>
              <StyledInput
                label={t('FIELDS.YEAR')}
                value={params.year}
                dataMarker={'year'}
                type="number"
                onChange={(e) => onSearch('year', e.target.value)}
                error={validateYear()}
              />
            </Grid>
          )}
          {params.period_type === PERIOD_TYPES.month && (
            <Grid item xs={12} sm={6} md={2}>
              <SelectField
                label={t('FIELDS.MONTH')}
                value={params.month}
                data={getMonths()}
                dataMarker={'month'}
                onChange={(month) => onSearch('month', month)}
                error={error?.data?.details?.month}
                disabled={Boolean(validateYear())}
              />
            </Grid>
          )}
          <Grid item xs={12} sm={6} md={2}>
            <VersionsByPeriod
              value={params.version}
              onChange={(v) => onSearch('version', v)}
              label={t('FIELDS.VERSION')}
              error={error?.data?.version}
              dataMarker={'version'}
              from_date={versionsDates?.from}
              to_date={versionsDates?.to}
              useNull
            />
          </Grid>
          <Box sx={{ flexGrow: 1 }} />
          <Grid item xs={12} sm={'auto'}>
            <GreenButton
              style={{ borderRadius: 20, padding: '0 16px', height: 32 }}
              onClick={handleApplyFiters}
              data-marker={'apply'}
              disabled={!validate()}
            >
              <DoneRounded />
              {t('CONTROLS.ENGAGE')}
            </GreenButton>
          </Grid>
        </Grid>
      </Paper>
      <DataTable data={data} />
    </Page>
  );
};

const PERIOD_TYPES = {
  day: 'DAY',
  month: 'MONTH',
  year: 'YEAR'
};

const TYPES = [
  { value: PERIOD_TYPES.day, label: i18n.t('FIELDS.DAY') },
  { value: PERIOD_TYPES.month, label: i18n.t('FIELDS.MONTH') },
  { value: PERIOD_TYPES.year, label: i18n.t('FIELDS.YEAR') }
];

const MONTHES = [
  { value: 1, label: i18n.t('MONTHS.JANUARY') },
  { value: 2, label: i18n.t('MONTHS.FEBRUARY') },
  { value: 3, label: i18n.t('MONTHS.MARCH') },
  { value: 4, label: i18n.t('MONTHS.APRIL') },
  { value: 5, label: i18n.t('MONTHS.MAY') },
  { value: 6, label: i18n.t('MONTHS.JUNE') },
  { value: 7, label: i18n.t('MONTHS.JULY') },
  { value: 8, label: i18n.t('MONTHS.AUGUST') },
  { value: 9, label: i18n.t('MONTHS.SEPTEMBER') },
  { value: 10, label: i18n.t('MONTHS.OCTOBER') },
  { value: 11, label: i18n.t('MONTHS.NOVEMBER') },
  { value: 12, label: i18n.t('MONTHS.DECEMBER') }
];

export default RegionBalance;
