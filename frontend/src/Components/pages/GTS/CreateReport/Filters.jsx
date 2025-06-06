import { Divider, FormControlLabel, Grid } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';

import { setGtsReportSettingFilters } from '../../../../actions/gtsActions';
import DatePicker from '../../../Theme/Fields/DatePicker';
import SelectField from '../../../Theme/Fields/SelectField';
import MultiSelect from '../../../Theme/Fields/MultiSelect';
import { useMemo, useState } from 'react';
import { REPORT_TYPE } from '../constants';
import { useMultiselectStyles } from '../filterStyles';
import { useTranslation } from 'react-i18next';
import { resetFieldsData, setFilters, setIsChangedGeneralFilter } from '../slice';
import { showVersion } from '../utils';
import VersionsByPeriod from '../../../../features/versionsByPeriod';
import { StyledSwitch } from '../../../Theme/Fields/StyledSwitch';

const yearFilter = [...new Array(moment().diff(moment().set('year', 2019).startOf('year'), 'years') + 1)]
  .map((i, index) => {
    const year = moment().subtract(index, 'year').year();
    return {
      value: year,
      label: `${year}`,
      hidden: false
    };
  })
  .reverse();

const monthsList = [
  { value: '0', label: 'MONTHS.JANUARY', hidden: false },
  { value: '1', label: 'MONTHS.FEBRUARY', hidden: false },
  { value: '2', label: 'MONTHS.MARCH', hidden: false },
  { value: '3', label: 'MONTHS.APRIL', hidden: false },
  { value: '4', label: 'MONTHS.MAY', hidden: false },
  { value: '5', label: 'MONTHS.JUNE', hidden: false },
  { value: '6', label: 'MONTHS.JULY', hidden: false },
  { value: '7', label: 'MONTHS.AUGUST', hidden: false },
  { value: '8', label: 'MONTHS.SEPTEMBER', hidden: false },
  { value: '9', label: 'MONTHS.OCTOBER', hidden: false },
  { value: '10', label: 'MONTHS.NOVEMBER', hidden: false },
  { value: '11', label: 'MONTHS.DECEMBER', hidden: false }
];

const getMonths = () => {
  const startDate = moment().startOf('year');
  const endDate = moment();
  const months = [];

  if (startDate < endDate) {
    const date = startDate.startOf('month');

    while (date < endDate.endOf('month')) {
      months.push(`${date.month()}`);
      date.add(1, 'month');
    }
  }

  return months;
};

const Filters = ({ reportType }) => {
  const { t, i18n } = useTranslation();
  const isUA = i18n.language === 'ua';
  const [monthFilter, setMonthFilter] = useState({ yearFrom: moment().year(), yearTo: moment().year() });
  const [datesError, setDatesError] = useState({ from: null, to: null });
  const dispatch = useDispatch();
  const {
    reportSettings,
    reportByEic,
    reportByRelease,
    reportByVersion,
    generalSettings,
    originalSettings,
    error = {}
  } = useSelector((store) => store.gts);
  const initError = useSelector((store) => store.gtsSlice.initError);
  const paramsfilters = useSelector((store) => store.gtsSlice.filters);
  const filters =
    reportType === REPORT_TYPE.BY_PARAMS && Object.keys(paramsfilters).length ? paramsfilters : reportSettings;
  const classes = useMultiselectStyles();

  const monthsFilter = monthsList.map((item) => {
    if (moment().year() === monthFilter.yearFrom) {
      return {
        ...item,
        hidden: !getMonths().some((i) => i === item.value)
      };
    }
    return { ...item };
  });

  const areFiltersDifferent = (newFilter, originalFilter) => {
    return Object.keys(newFilter).some((key) => newFilter[key] !== originalFilter[key]);
  };

  const updateFilters = (reportType, newFilters) => {
    dispatch(setIsChangedGeneralFilter(areFiltersDifferent(newFilters, originalSettings)));
    if (reportType === REPORT_TYPE.BY_PARAMS) {
      dispatch(setFilters(newFilters));
    } else {
      dispatch(setGtsReportSettingFilters(newFilters));
    }
  };

  const handleOnChange = (key) => (value) => {
    switch (key) {
      case 'version':
        updateFilters(reportType, { ...filters, [key]: value });
        break;
      case 'period_from':
        if (datesError.from) setDatesError({ ...datesError, from: null});
        updateFilters(reportType, { ...filters, [key]: value ? moment(value).startOf('day') : null });
        break;
      case 'period_to':
        if (datesError.to) setDatesError({ ...datesError, to: null});
        updateFilters(reportType, { ...filters, [key]: value ? moment(value).endOf('day') : null });
        break;
      case 'eic_y':
      case 'zv_type':
      case 'metering_grid_area':
        updateFilters(reportType, { ...filters, [key]: value === 'null' ? null : value });
        break;
      case 'source_type': {
        updateFilters(reportType, {
          ...filters,
          [key]: value === 'null' ? null : value,
          version: null,
          dimension: null,
          energy_type: null,
          quality_type: value === 'DH' ? null : filters?.quality_type
        });
        break;
      }
      case 'year':
        if (Object.values(datesError).some(Boolean)) setDatesError({ from: null, to: null });
        if (filters.dimension === 'p1y') {
          updateFilters(reportType, {
            ...filters,
            period_from: moment().year(value).startOf('year'),
            period_to:
              moment().year(value).endOf('year') < moment()
                ? moment().year(value).endOf('year')
                : moment().subtract(1, 'day')
          });
        }
        if (filters.dimension === 'p1m') {
          let period_to = moment().subtract(1, 'day');
          if (moment().year(value).endOf('year') < moment() || moment().month() > 0) {
            period_to = moment().year(value).month(0).endOf('month');
          }

          setMonthFilter({
            yearFrom: moment().year(value).year(),
            yearTo: moment().year(value).year()
          });
          updateFilters(reportType, {
            ...filters,
            period_from: moment().year(value).startOf('year'),
            period_to
          });
        }
        break;
      case 'month':
        updateFilters(reportType, {
          ...filters,
          period_from: moment().year(monthFilter.yearFrom).month(value).startOf('month'),
          period_to:
            moment().year(monthFilter.yearTo).month(value).endOf('month') < moment()
              ? moment().year(monthFilter.yearTo).month(value).endOf('month')
              : moment().subtract(1, 'day')
        });
        break;
      default:
        if (value === 'p1d' && key === 'dimension') {
          updateFilters(reportType, {
            ...filters,
            [key]: value,
            quality_type: 'OFF',
            period_from: null,
            period_to: null
          });
        } else if ((value === 'p1y' || value === 'p1h' || value === 'p1m') && key === 'dimension') {
          updateFilters(reportType, { ...filters, [key]: value, period_from: null, period_to: null });
        } else if (key === 'point_type' || key === 'point_species') {
          const newSettings = { ...filters, [key]: value };
          if (value === 'InstallationAccountingPoint') {
            newSettings.point_species = '';
          } else if (value === 'SubmeteringPoint') {
            newSettings.point_species = generalSettings?.point_species?.options?.[0]?.value || '';
          } else if (value === 'CONSUMPTION_FOR_DOMESTIC_NEEDS' || value === 'CONSUMPTION_FOR_NON_DOMESTIC_NEEDS') {
            newSettings.report_type = 'TS_BY_AP';
            newSettings.version = null;
          }
          dispatch(resetFieldsData());
          updateFilters(reportType, newSettings);
        } else {
          updateFilters(reportType, { ...filters, [key]: value });
        }
        break;
    }
  };

  const handleMaxDate = () => {
    if (
      reportType === REPORT_TYPE.BY_ZV &&
      filters.period_from &&
      moment(filters.period_from).add(12, 'months').unix() < moment().subtract(1, 'days').unix()
    ) {
      return {
        maxDate: moment(filters.period_from).add(12, 'months'),
        maxDateMessage: t('VERIFY_MSG.GTS_REPORT_MAX_DATE_MONTHS')
      };
    }
    if (
      reportType !== REPORT_TYPE.BY_ZV &&
      filters.period_from &&
      moment(filters.period_from).add(31, 'days').unix() < moment().unix()
    ) {
      return {
        maxDate: moment(filters.period_from).add(31, 'days'),
        maxDateMessage: t('VERIFY_MSG.GTS_REPORT_MAX_DATE_DAYS')
      };
    }
    return {
      maxDate: moment().subtract(1, 'days'),
      maxDateMessage: t('VERIFY_MSG.DATE_IS_MORE_THEN_VALID')
    };
  };

  const dimensionOptions = useMemo(() => {
    if (reportType === REPORT_TYPE.BY_RELEASE) {
      return (
        generalSettings?.dimension?.options?.filter(
          (option) =>
            !(
              (option.value === 'pt15m' || option.value === 'pt30m' || option.value === 'p1y') &&
              filters?.source_type === 'DH'
            )
        ) || []
      );
    }
    return (
      generalSettings?.dimension?.options?.filter(
        (option) =>
          !(
            (option.value === 'pt15m' || option.value === 'pt30m') &&
            (filters?.source_type === 'DH' ||
              filters?.report_type === 'SUM_TS' ||
              filters?.report_type === 'SALDO_TS' ||
              filters?.report_type === 'TS_BY_AP_SALDO_TS')
          )
      ) || []
    );
  }, [generalSettings, reportType, filters?.source_type, filters?.report_type]);

  return (
    <div className={'boxShadow'} style={{ padding: 16, paddingBottom: 8, marginBottom: 16, marginTop: 8 }}>
      <Typography variant={'h2'} color={'textPrimary'} style={{ marginBottom: 12 }}>
        {t('GENERAL_FILTERS')}
      </Typography>
      <Divider style={{ marginBottom: 8 }} />
      <Grid container spacing={2} style={{ paddingTop: 12, paddingBottom: 12 }}>
        <Grid item xs={12} sm={6} md={2}>
          <SelectField
            label={t('FIELDS.DIMENSION')}
            value={filters.dimension}
            data={dimensionOptions}
            onChange={handleOnChange('dimension')}
            disabled={Boolean(reportByEic || reportByRelease || reportByVersion)}
            error={error?.dimension || initError?.dimension}
            dataMarker={'dimension'}
            ignoreI18={![REPORT_TYPE.BY_ZV, REPORT_TYPE.BY_COMPONENTS_ZV].includes(reportType)}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          {filters.dimension !== 'p1m' && filters.dimension !== 'p1y' && (
            <DatePicker
              label={t('FIELDS.PERIOD_FROM')}
              clearable
              onError={(from) => setDatesError({ ...datesError, from })}
              value={filters.period_from}
              onChange={handleOnChange('period_from')}
              minDate={moment('2019-07-01')}
              minDateMessage={t('VERIFY_MSG.MIN_DATE_MESSAGE_WITH_PARAM', { param: '01.07.2019' })}
              maxDate={moment().subtract(1, 'days')}
              outFormat={'yyyy-MM-DD'}
              disabled={Boolean(reportByEic || reportByRelease || reportByVersion)}
              error={error?.period_from || initError?.period_from}
              dataMarker={'period_from'}
            />
          )}
          {(filters?.dimension === 'p1m' || filters.dimension === 'p1y') && (
            <SelectField
              label={t('FIELDS.YEAR')}
              value={filters?.period_from?.year() || ''}
              data={yearFilter}
              ignoreI18
              onChange={handleOnChange('year')}
              error={error?.period_from || initError?.period_from}
              disabled={Boolean(reportByEic || reportByRelease)}
              dataMarker={'year'}
            />
          )}
        </Grid>
        {filters.dimension !== 'p1m' && filters.dimension !== 'p1y' && (
          <Grid item xs={12} sm={6} md={2}>
            <DatePicker
              label={t('FIELDS.PERIOD_TO')}
              onError={(to) => setDatesError({ ...datesError, to })}
              clearable
              value={filters.period_to}
              onChange={handleOnChange('period_to')}
              minDate={moment(filters.period_from) || moment('2019-07-01')}
              {...handleMaxDate()}
              outFormat={'yyyy-MM-DD'}
              disabled={Boolean(reportByEic || reportByRelease || reportByVersion)}
              error={error?.period_to || initError?.period_to}
              dataMarker={'period_to'}
            />
          </Grid>
        )}
        {showVersion(filters, reportType) && (
          <Grid item xs={12} sm={6} md={2}>
            <VersionsByPeriod
              from_date={filters.period_from}
              to_date={filters.period_to}
              label={t('FIELDS.VERSION')}
              value={filters.version}
              useNull={![REPORT_TYPE.BY_COMPONENTS_ZV, REPORT_TYPE.BY_VERSION].includes(reportType)}
              useEmptySting={[REPORT_TYPE.BY_COMPONENTS_ZV, REPORT_TYPE.BY_VERSION].includes(reportType)}
              onChange={handleOnChange('version')}
              datesError={datesError}
              error={error?.version || initError?.version}
              dataMarker={'version'}
            />
          </Grid>
        )}
        {filters?.dimension === 'p1m' && (
          <Grid item xs={12} sm={6} md={2}>
            <SelectField
              label={t('FIELDS.MONTH')}
              value={`${filters?.period_from?.month() || 0}`}
              data={monthsFilter}
              error={error?.period_from || initError?.period_from}
              onChange={handleOnChange('month')}
              disabled={Boolean(reportByEic || reportByRelease)}
              dataMarker={'month'}
            />
          </Grid>
        )}
        {[REPORT_TYPE.BY_ZV, REPORT_TYPE.BY_COMPONENTS_ZV].includes(reportType) && (
          <>
            <Grid item xs={12} sm={6} md={2}>
              <SelectField
                ignoreI18
                label={t('FIELDS.METERING_GRID_AREA_EIC')}
                value={filters.metering_grid_area ?? 'null'}
                data={
                  generalSettings?.metering_grid_area?.options
                    ? reportType === REPORT_TYPE.BY_COMPONENTS_ZV
                      ? generalSettings.metering_grid_area.options
                      : [{ value: 'null', label: t('ALL') }, ...generalSettings.metering_grid_area.options]
                    : []
                }
                error={error?.metering_grid_area || initError?.metering_grid_area}
                onChange={handleOnChange('metering_grid_area')}
                dataMarker={'metering_grid_area'}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <SelectField
                label={t('FIELDS.ZV_TYPE')}
                value={filters.zv_type ?? 'null'}
                data={
                  generalSettings?.zv_type?.options
                    ? [
                        { value: 'null', label: 'ALL' },
                        ...generalSettings.zv_type.options.map((i) => ({
                          ...i,
                          label: 'ZV_TYPE.' + i.label
                        }))
                      ]
                    : []
                }
                error={error?.zv_type || initError?.zv_type}
                onChange={handleOnChange('zv_type')}
                dataMarker={'zv_type'}
              />
            </Grid>
            {reportType !== REPORT_TYPE.BY_COMPONENTS_ZV && (
              <Grid item xs={12} sm={6} md={2}>
                <SelectField
                  label={t('FIELDS.MMS_DIRECTION_VALIDITY')}
                  value={filters.is_mms_validity_direction}
                  data={generalSettings?.is_mms_validity_direction?.options || []}
                  error={error?.is_mms_validity_direction || initError?.is_mms_validity_direction}
                  onChange={handleOnChange('is_mms_validity_direction')}
                  dataMarker={'is_mms_validity_direction'}
                />
              </Grid>
            )}
          </>
        )}
        {reportType !== REPORT_TYPE.BY_COMPONENTS_ZV && (
          <Grid item xs={12} sm={6} md={2}>
            <SelectField
              label={t('FIELDS.SOURCE')}
              value={filters.source_type}
              data={generalSettings?.source_type?.options || []}
              error={error?.source_type || initError?.source_type}
              disabled={Boolean(reportByEic || reportByRelease || reportByVersion)}
              onChange={handleOnChange('source_type')}
              dataMarker={'source_type'}
              ignoreI18
            />
          </Grid>
        )}

        {![REPORT_TYPE.BY_ZV, REPORT_TYPE.BY_COMPONENTS_ZV, REPORT_TYPE.BY_VERSION].includes(reportType) && (
          <Grid item xs={12} sm={6} md={2}>
            <MultiSelect
              ignoreI18
              label={t('FIELDS.QUALITY_TYPE')}
              list={
                generalSettings?.quality_type?.options.map((i) => ({
                  value: i?.code ?? i?.value,
                  label: i?.label ? i.label : isUA ? i?.name_ua : i?.name_en
                })) || []
              }
              value={filters.quality_type || []}
              onChange={handleOnChange('quality_type')}
              error={error?.quality_type || initError?.quality_type}
              disabled={filters.source_type === 'DH'}
              className={classes.multiselect}
            />
          </Grid>
        )}
          {![REPORT_TYPE.BY_COMPONENTS_ZV, REPORT_TYPE.BY_VERSION].includes(reportType) && (
          <Grid item xs={12} sm={6} md={2}>
            <SelectField
              label={t('FIELDS.DATA_VIEW')}
              value={filters.data_view}
              data={generalSettings?.data_view?.options || []}
              error={error?.data_view || initError?.data_view}
              onChange={handleOnChange('data_view')}
              dataMarker={'data_view'}
            />
          </Grid>
        )}
        {reportType === REPORT_TYPE.BY_EIC && (
          <Grid item xs={12} sm={6} md={2}>
            <SelectField
              label={t('FIELDS.IS_DKO')}
              value={filters.dko_type}
              data={generalSettings?.dko_type?.options || []}
              error={error?.dko_type || initError?.dko_type}
              onChange={handleOnChange('dko_type')}
              dataMarker={'is_tko'}
              ignoreI18
            />
          </Grid>
        )}
        {Boolean(generalSettings?.apply_esign) && (
          <Grid
            item
            xs={12}
            sm={6}
            md={2}
            style={{
              marginTop: 7
            }}
          >
            <FormControlLabel
              control={
                <StyledSwitch
                  checked={!!filters?.apply_esign}
                  onChange={(v) => handleOnChange('apply_esign')(v.target.checked)}
                />
              }
              label={t('FIELDS.DIGITAL_SIGNATURE')}
            />
          </Grid>
        )}
        {reportType === REPORT_TYPE.BY_PARAMS && (
          <Grid item xs={12} sm={6} md={2}>
            <SelectField
              label={t('FIELDS.ENERGY_TYPE')}
              value={filters.energy_type}
              data={
                generalSettings?.energy_type?.options
                  .map((i) => ({ ...i, label: 'FIELDS.' + i.value }))
                  .filter((option) => !(filters?.source_type === 'DH' && option.value === 'REACTIVE')) || []
              }
              error={error?.energy_type || initError?.energy_type}
              onChange={handleOnChange('energy_type')}
              dataMarker={'energy_type'}
            />
          </Grid>
        )}
        {[REPORT_TYPE.BY_PARAMS, REPORT_TYPE.BY_COMPONENTS_ZV].includes(reportType) && (
          <Grid item xs={12} sm={6} md={2}>
            <SelectField
              label={t('FIELDS.REPORT_TYPE')}
              value={filters.report_type}
              data={
                generalSettings?.report_type?.options
                  .map((i) => ({ ...i, label: 'REPORT_TYPE.' + i.value }))
                  .filter(
                    (option) =>
                      !(
                        (filters?.dimension === 'pt15m' ||
                          filters?.dimension === 'pt30m' ||
                          filters?.point_species === 'CONSUMPTION_FOR_DOMESTIC_NEEDS' ||
                          filters?.point_species === 'CONSUMPTION_FOR_NON_DOMESTIC_NEEDS') &&
                        (option.value === 'SALDO_TS' ||
                          option.value === 'SUM_TS' ||
                          option.value === 'TS_BY_AP_SALDO_TS')
                      )
                  ) || []
              }
              error={error?.report_type || initError?.report_type}
              onChange={handleOnChange('report_type')}
              dataMarker={'report_type'}
            />
          </Grid>
        )}
        {reportType === REPORT_TYPE.BY_PARAMS && (
          <Grid item xs={12} sm={6} md={2}>
            <SelectField
              label={t('FIELDS.POINT_TYPE')}
              value={filters.point_type}
              data={generalSettings?.point_type?.options.map((i) => ({ ...i, label: 'POINT_TYPE.' + i.value })) || []}
              error={error?.point_type || initError?.point_type}
              onChange={handleOnChange('point_type')}
              dataMarker={'point_type'}
            />
          </Grid>
        )}
        {reportType === REPORT_TYPE.BY_PARAMS && (
          <Grid item xs={12} sm={6} md={2}>
            <SelectField
              label={t('FIELDS.AP_TYPE')}
              value={filters.point_species}
              data={generalSettings?.point_species?.options.map((i) => ({ ...i, label: 'PLATFORM.' + i.value })) || []}
              error={error?.point_species || initError?.point_species}
              onChange={handleOnChange('point_species')}
              disabled={
                filters.point_type === 'InstallationAccountingPoint' || !generalSettings?.point_species?.options
              }
              dataMarker={'point_species'}
            />
          </Grid>
        )}
	      {[REPORT_TYPE.BY_EIC, REPORT_TYPE.BY_PARAMS, REPORT_TYPE.BY_COMPONENTS_ZV].includes(reportType) && (
		      <Grid item xs={12} sm={6} md={2}>
			      <SelectField
				      label={t('FIELDS.SHOW_IN')}
				      value={filters.toggle_ts_direction}
				      data={generalSettings?.toggle_ts_direction?.options || []}
				      error={error?.toggle_ts_direction || initError?.toggle_ts_direction}
				      onChange={handleOnChange('toggle_ts_direction')}
				      dataMarker={'toggle_ts_direction'}
				      ignoreI18
			      />
		      </Grid>
	      )}
      </Grid>
    </div>
  );
};

export default Filters;
