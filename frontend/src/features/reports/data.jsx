import moment from 'moment';
import i18n from '../../i18n/i18n';

export const versionsByPeriodReports = ['renewable-objects', 'renewable-objects-market-premium', 'comparison-ppko-by-tko-z-and-zv', 'mga-losses', 'comparison-dko-by-type-a', 'ap-count-grid-losses'];

export const getVersionsData = () => {
  return new Array(3).fill(1).map((v, i) => ({ label: v + i, value: v + i }));
};

export const withChangesData = [
  { label: 'ALL_AP', value: 'false' },
  { label: 'AP_WITH_CHANGES', value: 'true' }
];

export const markersData = [
  { label: i18n.t('MARKERS_DATA.FO'), value: 'fo' },
  { label: i18n.t('MARKERS_DATA.FOP'), value: 'fop' },
  { label: i18n.t('MARKERS_DATA.UO'), value: 'uo' },
  { label: i18n.t('MARKERS_DATA.UOB'), value: 'uob' }
];

export const tkoStatusesData = [
  { label: i18n.t('AP_STATUSES_DATA.DEMOLISHED'), value: 'Demolished' },
  { label: i18n.t('AP_STATUSES_DATA.UNDERCONSTRUCTION'), value: 'Underconstruction' },
  { label: i18n.t('AP_STATUSES_DATA.DISCONNECTED_BY_GAP'), value: 'Disconnected by GAP' },
  { label: i18n.t('AP_STATUSES_DATA.DISCONNECTED_BY_CUST'), value: 'Disconnected by Cust' },
  { label: i18n.t('AP_STATUSES_DATA.DISCONNECTED'), value: 'Disconnected' },
  { label: i18n.t('AP_STATUSES_DATA.CONNECTED'), value: 'Connected' },
  { label: i18n.t('AP_STATUSES_DATA.DISCONNECTED_BY_GAP&BS'), value: 'Disconnected by GAP&BS' }
];

export const apTypeData = [
  { label: 'Z', value: 'z' },
  { label: 'ZV', value: 'zv' }
];

export const yearData = new Array(moment().year() - 2018)
  .fill(0)
  .map((...args) => args[1] + 2019)
  .map((i) => ({ label: i, value: i }));

export const monthData = [
  { label: 'MONTHS.JANUARY', value: 1 },
  { label: 'MONTHS.FEBRUARY', value: 2 },
  { label: 'MONTHS.MARCH', value: 3 },
  { label: 'MONTHS.APRIL', value: 4 },
  { label: 'MONTHS.MAY', value: 5 },
  { label: 'MONTHS.JUNE', value: 6 },
  { label: 'MONTHS.JULY', value: 7 },
  { label: 'MONTHS.AUGUST', value: 8 },
  { label: 'MONTHS.SEPTEMBER', value: 9 },
  { label: 'MONTHS.OCTOBER', value: 10 },
  { label: 'MONTHS.NOVEMBER', value: 11 },
  { label: 'MONTHS.DECEMBER', value: 12 }
];

export const verifyPeriods = ({ period_from, period_to }, code) => {
  if (!period_from || !period_to) return {};
  if (!moment(period_from, moment.ISO_8601).isValid()) {
    return { period_from: 'VERIFY_MSG.UNCORRECT_DATE' };
  }
  if (!moment(period_to, moment.ISO_8601).isValid()) {
    return { period_to: 'VERIFY_MSG.UNCORRECT_DATE' };
  }
  if (moment(period_to).isAfter(moment())) {
    return { period_to: 'VERIFY_MSG.PERIOD_TO_IS_AFTER' };
  }
  if (moment(period_to).isBefore(moment(period_from))) {
    return { period_to: 'VERIFY_MSG.PERIOD_TO_IS_BEFORE' };
  }
  if (code === 'processes-changing-ppko' && moment(period_from).isBefore(moment('2019-07-01'))) {
    return { period_from: 'VERIFY_MSG.UNCORRECT_DATE' };
  }
  if (code === 'processes-changing-ppko' && moment(period_to).isBefore(moment('2019-07-01'))) {
    return { period_to: 'VERIFY_MSG.UNCORRECT_DATE' };
  }
  if (
    code === 'mga-losses' &&
    (moment(period_from).isBefore(moment('2019-07-01')) || moment(period_from).isAfter(moment().subtract(1, 'd')))
  )
    return { period_from: 'VERIFY_MSG.UNCORRECT_DATE' };
  if (
    code === 'mga-losses' &&
    (moment(period_to).isBefore(moment('2019-07-01')) || moment(period_from).isAfter(moment().subtract(1, 'd')))
  )
    return { period_to: 'VERIFY_MSG.UNCORRECT_DATE' };
  if (code === 'mga-losses' && moment(period_to).diff(moment(period_from), 'days') > 31)
    return { period_to: 'VERIFY_MSG.UNCORRECT_DATE' };

  return { period_from: null, period_to: null };
};

export const verifyWithChanges = (newValues, newInnerError) => {
  if (newValues.period_from) delete newValues.period_from;
  if (newValues.period_to) delete newValues.period_to;

  if (newInnerError.period_from) delete newInnerError.period_from;
  if (newInnerError.period_to) delete newInnerError.period_to;
  return { newValues, newInnerError };
};

export const periodTypeData = [
  { label: i18n.t('HOUR'), value: 'HOUR' },
  { label: i18n.t('DAY'), value: 'DAY' },
  { label: i18n.t('YEAR'), value: 'YEAR' }
];

export const auditNotificationData = [
  { label: i18n.t('CONTROLS.YES'), value: 'yes' },
  { label: i18n.t('CONTROLS.NO'), value: 'no' }
];

export const auditNotificationStateData = [
  { label: i18n.t('AUDIT_COMPLETION.COMPLETED'), value: 'completed' },
  { label: i18n.t('AUDIT_COMPLETION.NOT_COMPLETED'), value: 'not_completed' },
  { label: i18n.t('AUDIT_COMPLETION.IN_PROGRESS'), value: 'in_progress' },
  { label: i18n.t('AUDIT_COMPLETION.NOT_SPECIFIED'), value: 'not_specified' },
  { label: i18n.t('AUDIT_COMPLETION.TAKEN_OUT'), value: 'taken_out' }
];

export const customerTypeData = [
  { label: 'CUSTOMER_TYPES.COLLECTIVE_HOUSEHOLD', value: 'collective_household' },
  { label: 'CUSTOMER_TYPES.INDIVIDUAL_HOUSEHOLD', value: 'individual_household' }
];

export const calculationTypeData = [
  { label: 'CALCULATION_TYPES.WITH_COMPARISON_OF_DCO_VERSIONS', value: 'with_comparison' },
  { label: 'CALCULATION_TYPES.WITHOUT_COMPARISON_OF_DCO_VERSIONS', value: 'without_comparison' }
];
