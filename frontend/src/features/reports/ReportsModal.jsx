import Dialog from '@mui/material/Dialog';
import dialogClasses from '@mui/material/Dialog/dialogClasses';
import IconButton from '@mui/material/IconButton';
import CloseRounded from '@mui/icons-material/CloseRounded';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { BlueButton } from '../../Components/Theme/Buttons/BlueButton';
import { GreenButton } from '../../Components/Theme/Buttons/GreenButton';
import MultiSelect from '../../Components/Theme/Fields/MultiSelect';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import SearchField from './components/SearchField';
import {
  apTypeData,
  auditNotificationData,
  auditNotificationStateData,
  calculationTypeData,
  customerTypeData,
  getVersionsData,
  markersData,
  monthData,
  periodTypeData,
  tkoStatusesData,
  verifyPeriods,
  verifyWithChanges,
  versionsByPeriodReports,
  withChangesData,
  yearData
} from './data';
import VersionsByPeriod from '../versionsByPeriod';
import { AsyncSelectField } from './components/AsyncSelectField';
import { DialogActions, DialogContent, DialogTitle, Grid } from '@mui/material';
import { ReportSelectField } from './components/ReportSelectField';
import { ReportDatePickerField } from './components/ReportDatePickerField';
import { MarketPremiumFile } from './MarketPremiumFile';
import MultyPairInput from './components/MultyPairInput';
import { StyledSwitch } from '../../Components/Theme/Fields/StyledSwitch';
import FormControlLabel from '@material-ui/core/FormControlLabel';

const ReportsModal = ({ title, openModal, setOpenModal, handleSubmit, reportSettings: { code, params }, error }) => {
  const { t } = useTranslation();
  const [innerError, setInnerError] = useState({});
  const [values, setValues] = useState({});
  const { eic: myEic, name: myCompanyName } = useSelector((store) => store.user.activeOrganization);
  const isSupplierRole = useSelector((store) => store.user.activeRoles[0].role === 'BALANCE SUPPLIER');

  const MIN_DATE_FROM =
    code === 'change-ppko-for-ap'
      ? moment('2024-01-01')
      : code === 'processes-changing-ppko' || code === 'comparison-dko-by-type-a'
      ? moment('2019-07-01')
      : undefined;
  const MIN_DATE_TO = code === 'processes-changing-ppko' ? moment('2019-07-01') : undefined;

  useEffect(() => {
    const responseError = JSON.parse(JSON.stringify(error?.data?.detail || error?.data || {}));
    delete responseError.details;
    if (typeof responseError === 'object') setInnerError(responseError);
  }, [error]);

  useEffect(() => {
    if (params?.includes('company') && code !== 'ap-list-change-supplier') {
      setValues({ company: { value: null, label: t('ALL_OR_EIC_IS_NULL'), title: t('ALL') } });
    }
  }, [code, params]);

  useEffect(() => {
    if (code === 'ap-list-change-supplier' && isSupplierRole) {
      setValues({ ...values, company: { value: myEic, title: myCompanyName } });
    }
  }, [code, isSupplierRole, myEic]);

  useEffect(() => {
    if (code === 'deep-request-for-editing-ap-properties') {
      setValues({ ...values, with_another_ap_properties: false });
    }
  }, [code]);

  const handleClose = () => {
    setOpenModal(false);
    setValues({});
    setInnerError({});
  };

  const handleDisabledUpload = () => {
    if (Object.values(innerError).filter((i) => i).length) return true;
    for (const id of params || []) {
      if (
        id === 'period_from' &&
        values?.period_from &&
        MIN_DATE_FROM &&
        moment(values?.period_from).isBefore(MIN_DATE_FROM)
      )
        return true;
      if ((id === 'period_from' || id === 'period_to') && values.with_changes === 'false') continue;
      if ((code === 'change-supplier-ap-z' || code === 'updated-tko-profile-type-on-date') && id === 'point_type')
        continue;
      if (
        code === 'change-supplier-ap-z' &&
        ((id === 'metering_grid_area_id' && values.osr_company) ||
          (id === 'osr_company' && values.metering_grid_area_id))
      ) {
        continue;
      }
      if (
        code === 'comparison-of-agg-ts-by-zv' &&
        values?.year &&
        values?.month &&
        values?.mga_eics &&
        values?.calculation_type === 'without_comparison' &&
        !values.version_pairs
      )
        continue;
      if (code === 'deep-request-for-editing-ap-properties') continue;
      if (code !== 'mga-losses' && code !== 'ts-revision' && id === 'mga_eics') continue;
      if (code === 'ppko-audit-results' && ['ppko', 'auditor', 'job_type', 'notice', 'completion'].includes(id))
        continue;
      if (code === 'renewable-objects' && id === 'version') continue;
      if (code === 'renewable-objects-market-premium' && id === 'version') continue;
      if (code === 'comparison-ppko-by-tko-z-and-zv' && id === 'version') continue;
      if (code === 'mga-losses' && id === 'version') continue;
      if (code === 'comparison-dko-by-type-a' && id === 'version') continue;
      if (code === 'ap-count-grid-losses' && id === 'version') continue;
      if (code === 'mga-losses' && id === 'year' && values.period_type !== 'YEAR') continue;
      if (id === 'customer_type') continue;
      if (!values[id] || (Array.isArray(values[id]) && !values[id].length)) return true;
    }
    return false;
  };

  const handleInnerSubmit = () => {
    const result = params.reduce((acc, id) => {
      if (id === 'mga_eics') {
        acc[id] = !values[id]?.length ? null : values[id];
      } else if (id === 'customer_type') {
        acc[id] = values[id] || null;
      } else if (['company', 'metering_grid_area_id', 'osr_company', 'auditor', 'ppko'].includes(id)) {
        acc[id] = values[id]?.value;
      } else if (['period_from', 'period_to'].includes(id)) {
        if (values[id]) {
          acc[id] = moment(values[id]).format('yyyy-MM-DD');
        }
      } else if (id === 'ap_group') {
        acc[id] = values[id].length === 1 ? values[id][0] : null;
      } else if (id === 'with_another_ap_properties') {
        acc[id] = values[id];
      }
      else if (id === 'version_pairs') {
        acc[id] =
          values?.calculation_type === 'with_comparison'
            ? values[id].map(({ value1, value2 }) => {
                const num1 = Number(value1);
                const num2 = isNaN(Number(value2)) ? null : Number(value2);
                return [num1, num2];
              })
            : undefined;
      } else if (values[id]) {
        acc[id] = values[id];
      }
      return acc;
    }, {});

    handleSubmit({ code, params: result });
  };

  const handleChange = (name, value) => {
    switch (name) {
      case 'period_from':
      case 'period_to':
        return handleChangePeriods(name, value);
      case 'with_changes':
        return handleChangeWithChanges(value);
      case 'year':
        return handleChangeYear(value);
      case 'period_type':
        return handleChangePeriodType(value);
      default: {
        handleSetValue(name, value);
      }
    }
  };

  const handleSetValue = (name, value) => {
    setValues({ ...values, [name]: value });
    setInnerError({ ...innerError, [name]: null });
  };

  const handleChangePeriods = (name, value) => {
    const error = verifyPeriods({ ...values, [name]: value }, code);
    setInnerError({ ...innerError, ...error });
    setValues({ ...values, [name]: value });
  };

  const handleChangeWithChanges = (value) => {
    if (value !== 'false') {
      handleSetValue('with_changes', value);
      return;
    }
    const { newValues, newInnerError } = verifyWithChanges(values, { ...innerError, ...error });
    setValues({ ...newValues, with_changes: value });
    setInnerError(newInnerError);
  };

  const handleChangeYear = (value) => {
    if (code === 'mga-losses') {
      const period_from = moment({ year: value, month: 0 }).startOf('month').format('YYYY-MM-DD');
      const period_to = moment({ year: value, month: 11 }).endOf('month').format('YYYY-MM-DD');
      setValues({ ...values, year: value, period_from, period_to });
      return;
    }
    if (value === moment().year() || value === 2019) {
      setValues({ ...values, year: value, month: null });
      return;
    }

    handleSetValue('year', value);
  };

  const handleChangePeriodType = (value) => {
    setValues({ period_type: value, mga_eics: values.mga_eics });
    setInnerError({});
  };

  return (
    <StyledDialog open={openModal} onClose={handleClose}>
      <DialogTitle>{title}</DialogTitle>
      <IconButton onClick={handleClose} sx={styles.close} data-marker={'close-dialog'}>
        <CloseRounded />
      </IconButton>
      <DialogContent>
        <Grid
          container
          justifyContent={'space-between'}
          sx={{ maxWidth: '480px' }}
          alignItems={'center'}
          spacing={1}
          wrap="wrap"
        >
          {params?.includes('period_type') && (
            <Grid item xs={12} md={6}>
              <ReportSelectField
                id={'period_type'}
                values={values}
                label={t('FIELDS.DIMENSION')}
                data={periodTypeData}
                onChange={handleChange}
                innerError={innerError}
                withAll={false}
              />
            </Grid>
          )}
          {code === 'mga-losses' && values.period_type === 'YEAR' && (
            <Grid item xs={12} md={6}>
              <ReportSelectField
                id={'year'}
                label={t('FIELDS.YEAR')}
                data={yearData}
                values={values}
                onChange={handleChange}
                innerError={innerError}
                withAll={false}
              />
            </Grid>
          )}
          {params?.includes('year') && code !== 'mga-losses' && (
            <Grid item xs={12} md={6}>
              <ReportSelectField
                ignoreI18
                id={'year'}
                label={t('FIELDS.YEAR')}
                data={yearData}
                values={values}
                onChange={handleChange}
                innerError={innerError}
                withAll={!['ts-revision', 'comparison-of-agg-ts-by-zv'].includes(code)}
              />
            </Grid>
          )}
          {params?.includes('month') && (
            <Grid item xs={12} md={6}>
              <ReportSelectField
                ignoreI18
                id={'month'}
                label={t('FIELDS.MONTH')}
                data={(values.year === moment().year()
                  ? monthData.filter((i) => i.value <= moment().month())
                  : values.year === 2019 && ['ts-revision', 'comparison-of-agg-ts-by-zv'].includes(code)
                  ? monthData.slice(6)
                  : monthData
                ).map((i) => ({
                  ...i,
                  label: t(i.label)
                }))}
                values={values}
                onChange={handleChange}
                withAll={!['ts-revision', 'comparison-of-agg-ts-by-zv'].includes(code)}
                innerError={innerError}
              />
            </Grid>
          )}
          {params?.includes('company') && (
            <Grid item xs={12}>
              <SearchField
                id={'company'}
                values={values}
                code={code}
                onChange={handleChange}
                label={
                  code === 'comparison-ppko-by-tko-z-and-zv'
                    ? t('FIELDS.METERING_GRID_AREA')
                    : t('FIELDS.MARKET_PARTICIPANT')
                }
                paramName={code === 'comparison-ppko-by-tko-z-and-zv' ? 'balance_areas' : 'company'}
                error={innerError?.company}
                disabled={code === 'ap-list-change-supplier' && isSupplierRole}
              />
            </Grid>
          )}
          {params?.includes('marker') && (
            <>
              <Grid item xs={12} md={6}>
                <MultiSelect
                  label={t('FIELDS.MARKER')}
                  list={markersData}
                  onChange={(values) =>
                    handleChange(
                      'marker',
                      values.map((i) => i.value)
                    )
                  }
                  error={innerError?.marker}
                />
              </Grid>
              {!(code === 'updated-tko-profile-type-on-date' && params?.includes('point_type')) && (
                <Grid item xs={12} md={6}></Grid>
              )}
            </>
          )}
          {code === 'updated-tko-profile-type-on-date' && params?.includes('point_type') && (
            <Grid item xs={12} md={6}>
              <AsyncSelectField
                type={'multiselect'}
                label={t('FIELDS.TYPE_ACCOUNTING_POINT')}
                apiPath={'getPointTypesListReports'}
                params={code}
                onChange={(values) =>
                  handleChange(
                    'point_type',
                    values.map((i) => i.value)
                  )
                }
                error={innerError?.point_type}
              />
            </Grid>
          )}
          {params?.includes('on_date') && (
            <Grid item xs={12}>
              <ReportDatePickerField
                id={'on_date'}
                label={t('FIELDS.DATE')}
                values={values}
                onChange={handleChange}
                innerError={innerError}
                outFormat={'yyyy-MM-DD'}
              />
            </Grid>
          )}
          {params?.includes('tko_status') && (
            <>
              <Grid item xs={12}>
                <MultiSelect
                  label={t('FIELDS.STATUS_AP')}
                  list={tkoStatusesData}
                  onChange={(values) =>
                    handleChange(
                      'tko_status',
                      values.map((i) => i.value)
                    )
                  }
                  error={innerError?.tko_status}
                />
              </Grid>
            </>
          )}
          {code === 'mga-losses' && (values.period_type === 'DAY' || values.period_type === 'HOUR') && (
            <>
              <Grid item xs={12} md={6}>
                <ReportDatePickerField
                  id={'period_from'}
                  label={t('FIELDS.PERIOD_FROM')}
                  values={values}
                  onChange={handleChange}
                  innerError={innerError}
                  minDate={moment('2019-07-01')}
                  maxDate={moment().subtract(1, 'd')}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <ReportDatePickerField
                  id={'period_to'}
                  label={t('FIELDS.PERIOD_TO')}
                  values={values}
                  onChange={handleChange}
                  innerError={innerError}
                  minDate={moment('2019-07-01')}
                  maxDate={
                    values.period_from && moment(values.period_from).add(31, 'day').isBefore(moment())
                      ? moment(values.period_from).add(31, 'day')
                      : moment().subtract(1, 'd')
                  }
                />
              </Grid>
            </>
          )}
          {params?.includes('period_from') && code !== 'mga-losses' && (
            <Grid item xs={12} md={6}>
              <ReportDatePickerField
                id={'period_from'}
                label={t('FIELDS.PERIOD_FROM')}
                values={values}
                onChange={handleChange}
                innerError={innerError}
                minDate={MIN_DATE_FROM}
              />
            </Grid>
          )}
          {params?.includes('period_to') && code !== 'mga-losses' && (
            <Grid item xs={12} md={6}>
              <ReportDatePickerField
                id={'period_to'}
                label={t('FIELDS.PERIOD_TO')}
                values={values}
                onChange={handleChange}
                innerError={innerError}
                minDate={MIN_DATE_TO}
              />
            </Grid>
          )}
          {params?.includes('version') && (
            <Grid item xs={12} md={6}>
              {versionsByPeriodReports.includes(code) ? (
                <VersionsByPeriod
                  useNull
                  label={t('FIELDS.VERSION')}
                  onChange={(v) => handleChange('version', v)}
                  value={values.version}
                  from_date={
                    code === 'comparison-ppko-by-tko-z-and-zv' && values.year && values.month
                      ? moment({ year: values.year, month: values.month - 1 })
                          .startOf('month')
                          .format('YYYY-MM-DD')
                      : values.period_from
                  }
                  to_date={
                    code === 'comparison-ppko-by-tko-z-and-zv' && values.year && values.month
                      ? moment({ year: values.year, month: values.month - 1 })
                          .endOf('month')
                          .format('YYYY-MM-DD')
                      : values.period_to
                  }
                  datesError={{ from: innerError?.period_from, to: innerError?.period_to }}
                />
              ) : (
                <ReportSelectField
                  id={'version'}
                  label={t('FIELDS.VERSION')}
                  data={getVersionsData()}
                  values={values}
                  onChange={handleChange}
                  innerError={innerError}
                />
              )}
            </Grid>
          )}
          {params?.includes('metering_grid_area_id') && (
            <Grid item xs={12} md={6}>
              <SearchField
                id={'metering_grid_area_id'}
                values={values}
                code={code}
                onChange={handleChange}
                label={t('FIELDS.METERING_GRID_AREA')}
                paramName={'metering_grid_area_id'}
                error={innerError?.metering_grid_area_id}
                disabled={Boolean(values.osr_company)}
              />
            </Grid>
          )}
          {params?.includes('with_changes') && (
            <Grid item xs={12} md={6}>
              <ReportSelectField
                id={'with_changes'}
                label={t('TYPE_OF_REPORT_GENERATION')}
                data={withChangesData.map((i) => ({ ...i, label: t(i.label) }))}
                values={values}
                onChange={handleChange}
                innerError={innerError}
              />
            </Grid>
          )}
          {code !== 'updated-tko-profile-type-on-date' && params?.includes('point_type') && (
            <Grid item xs={12} md={6}>
              <AsyncSelectField
                id={'point_type'}
                label={t('FIELDS.TYPE_ACCOUNTING_POINT')}
                value={values.point_type}
                onChange={(v) => handleChange('point_type', v === 'all' ? null : v)}
                error={innerError?.point_type}
                apiPath={'getPointTypesListReports'}
                params={code}
                withAll
              />
            </Grid>
          )}
          {params?.includes('osr_company') && (
            <Grid item xs={12}>
              <SearchField
                id={'osr_company'}
                values={values}
                code={code}
                onChange={handleChange}
                label={t('FIELDS.OSR_COMPANY')}
                paramName={'osr_company'}
                error={innerError?.osr_company}
                disabled={Boolean(values.metering_grid_area_id)}
              />
            </Grid>
          )}
          {params?.includes('ap_group') && (
            <Grid item xs={6}>
              <MultiSelect
                sx={{ '& .MuiInputBase-root': { p: 0.125, mb: 0.25 } }}
                label={t('FIELDS.AP_GROUP')}
                value={params.ap_group}
                ignoreI18
                list={[
                  { label: 'А', value: 'A' },
                  { label: 'Б', value: 'B' }
                ]}
                onChange={(values) =>
                  handleChange(
                    'ap_group',
                    values.map((i) => i.value)
                  )
                }
                error={innerError?.ap_group}
              />
            </Grid>
          )}
          {params?.includes('mga_eics') && (
            <Grid item xs={12}>
              <AsyncSelectField
                ignoreI18={true}
                type={'multiselect'}
                label={t('FIELDS.METERING_GRID_AREA')}
                apiPath={'getAreaEICSListReports'}
                params={null}
                onChange={(values) =>
                  handleChange(
                    'mga_eics',
                    values.map((i) => i.value)
                  )
                }
                error={innerError?.mga_eics}
              />
            </Grid>
          )}
          {params?.includes('ap_type') && (
            <Grid item xs={12}>
              <ReportSelectField
                id={'ap_type'}
                label={t('FIELDS.TKO_TYPE')}
                data={apTypeData}
                values={values}
                onChange={handleChange}
                innerError={innerError}
              />
            </Grid>
          )}
          {params?.includes('auditor') && (
            <Grid item xs={12}>
              <SearchField
                id={'auditor'}
                values={values}
                code={code}
                onChange={handleChange}
                label={t('FIELDS.INSPECTOR')}
                paramName={'auditor'}
                error={innerError?.auditor}
              />
            </Grid>
          )}
          {params?.includes('ppko') && (
            <Grid item xs={12}>
              <SearchField
                id={'ppko'}
                values={values}
                code={code}
                onChange={handleChange}
                label={t('PPKO')}
                paramName={'ppko'}
                error={innerError?.ppko}
              />
            </Grid>
          )}
          {params?.includes('job_type') && (
            <Grid item xs={12}>
              <AsyncSelectField
                type={'autocomplete'}
                label={t('FIELDS.EVENT_TYPE')}
                freeSolo
                apiPath={'getAuditJobs'}
                params={undefined}
                value={values.job_type}
                onInput={(e, value) => handleChange('job_type', value)}
              />
            </Grid>
          )}
          {params?.includes('notice') && (
            <Grid item xs={12}>
              <ReportSelectField
                id={'notice'}
                label={t('FIELDS.AUDIT_NOTIFICATION')}
                data={auditNotificationData}
                values={values}
                onChange={handleChange}
                innerError={innerError}
              />
            </Grid>
          )}
          {params?.includes('completion') && (
            <Grid item xs={12}>
              <ReportSelectField
                id={'completion'}
                label={t('FIELDS.AUDIT_NOTIFICATION_STATE')}
                data={auditNotificationStateData}
                values={values}
                onChange={handleChange}
                innerError={innerError}
              />
            </Grid>
          )}
          {params?.includes('customer_type') && (
            <Grid item xs={12}>
              <ReportSelectField
                id={'customer_type'}
                label={t('CHARACTERISTICS.TYPE_SPM')}
                data={customerTypeData}
                values={values}
                onChange={handleChange}
                innerError={innerError}
              />
            </Grid>
          )}
          {params?.includes('w_market_premium_file') && (
            <Grid item xs={12}>
              <MarketPremiumFile
                value={values.w_market_premium_file || null}
                onChange={(v) => handleChange('w_market_premium_file', v)}
                innerError={innerError}
              />
            </Grid>
          )}
          {params?.includes('calculation_type') && (
            <Grid item xs={12}>
              <ReportSelectField
                id={'calculation_type'}
                label={t('FIELDS.CALCULATION')}
                data={calculationTypeData}
                values={values}
                onChange={handleChange}
                innerError={innerError}
                withAll={false}
              />
            </Grid>
          )}
          {params?.includes('version_pairs') && values.calculation_type === 'with_comparison' && (
            <Grid item xs={12}>
              <MultyPairInput
                id={'version_pairs'}
                value={values.version_pairs}
                onChange={handleChange}
                innerError={innerError}
                allValues={values}
              />
            </Grid>
          )}
          {params?.includes('with_another_ap_properties') && (
            <FormControlLabel
              control={
                <StyledSwitch
                  checked={values.with_another_ap_properties ?? false}
                  onChange={(e) => handleChange('with_another_ap_properties', e.target.checked)}
                />
              }
              label={t('FIELDS.PRESENCE_OF_NON_TARGET_PROPERTIES_IN_REPORT')}
            />
          )}
        </Grid>
      </DialogContent>
      <DialogActions sx={styles.controls}>
        <BlueButton style={styles.controls__button} onClick={handleClose}>
          {t('CONTROLS.CANCEL')}
        </BlueButton>
        <GreenButton style={styles.controls__button} onClick={handleInnerSubmit} disabled={handleDisabledUpload()}>
          {t('CONTROLS.FORM')}
        </GreenButton>
      </DialogActions>
    </StyledDialog>
  );
};

ReportsModal.propTypes = {
  title: PropTypes.string.isRequired,
  openModal: PropTypes.bool.isRequired,
  setOpenModal: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  reportSettings: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  error: PropTypes.object
};

export default ReportsModal;

export const StyledDialog = styled((props) => <Dialog maxWidth={'lg'} {...props} />)(({ theme }) => ({
  [`.${dialogClasses.paper}`]: {
    overflowY: 'visible',
    '& > div': {
      position: 'relative',
      borderRadius: 8,
      backgroundColor: '#fff',
      padding: '32px 24px 36px',
      [theme.breakpoints.down('md')]: {
        padding: '21px 20px 36px'
      }
    }
  }
}));

const styles = {
  close: {
    position: 'absolute',
    right: 16,
    top: 16,
    '& svg': {
      fontSize: 19
    }
  },
  controls: {
    paddingTop: '0 !important',
    px: 3,
    display: 'flex',
    justifyContent: 'space-between'
  },
  controls__button: {
    minWidth: 204,
    textTransform: 'uppercase',
    fontSize: 12
  }
};
