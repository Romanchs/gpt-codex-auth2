const mapForSelect = (array, key) => {
  return array.map((value) => ({
    value,
    label: `${key}.${value}`
  }));
};

export const JOB_TYPES = ['ПВФ', 'ПВХ', 'ПП', 'ПНД', 'ПЯД', 'ПНВФ', 'ПВС', 'ПВД', 'ППР', 'ПЗ'];

export const AUDIT_STATUSES = mapForSelect(['SCHEDULED', 'NEW', 'CURRENT', 'COMPLETED', 'CANCELED'], 'AUDIT_STATUSES');

export const AUDIT_TYPES = mapForSelect(['SCHEDULED', 'UNSCHEDULED'], 'AUDIT_TYPES');

export const AUDIT_NOTICE = mapForSelect(['YES', 'NO'], 'CONTROLS');

export const AUDIT_COMPLETION = mapForSelect(
  ['COMPLETED', 'IN_PROGRESS', 'NOT_COMPLETED', 'NOT_SPECIFIED', 'TAKEN_OUT'],
  'AUDIT_COMPLETION'
);

export const EXIST_DEPART = mapForSelect(
  ['EXIST', 'DEPART'],
  'AUDIT_ORDER'
);

export const AUDIT_ORDER = mapForSelect(
  ['EXIST', 'DEPART', 'NOT_REQUIRED'],
  'AUDIT_ORDER'
);

export const SITE_ACCOUNTING_SCHEME = mapForSelect(
  ['COMPLIES', 'NOT_COMPLIES', 'DEPART'],
  'SITE_ACCOUNTING_SCHEME'
);

export const YES_NO_OPTIONS = mapForSelect(['YES', 'NO'], 'CONTROLS');

export const VERIFICATION_VO = mapForSelect(
  ['INSTALLED', 'NOT_INSTALLED', 'NOT_REQUIRED'],
  'VERIFICATION_VO'
);

export const COUNTER_DUPLICATE = mapForSelect(
  ['EXIST', 'DEPART', 'NOT_REQUIRED_BY_LEGISLATION'],
  'COUNTER_DUPLICATE'
);

export const MP_TYPES = mapForSelect(
  ['CONSUMPTION', 'PRODUCTION', 'EXCHANGE', 'COMBINED' ], 
  'MP_TYPE'
);

export const DATE_OF_STATE_METER_VERIFICATION = mapForSelect(
  ['FIRST_QUARTER', 'SECOND_QUARTER', 'THIRD_QUARTER', 'FOURTH_QUARTER', 'YEAR'],
  'DATE_OF_STATE_METER_VERIFICATION'
);

export const SEALING_REPORT_NUMBER = mapForSelect(
  ['EXIST', 'DEPART'],
  'SEALING_REPORT_NUMBER'
);