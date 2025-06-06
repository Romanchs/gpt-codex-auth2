import moment from 'moment/moment';
import { REPORT_TYPE } from './constants';

export const FIELD_TYPE = {
  INPUTALL: 'INPUTALL',
  INPUT: 'INPUT',
  SEARCH: 'SEARCH',
  SELECT: 'SELECT',
  MULTISELECT: 'MULTISELECT',
  DATE: 'DATE',
  MUILTISEARCH: 'MUILTISEARCH'
};

const prepareFields = {
  [FIELD_TYPE.INPUTALL]: (value) => {
    if (value) return value === 'Всі' ? null : value;
  },
  [FIELD_TYPE.INPUT]: (value) => {
    if (value) return value?.toLowerCase() === 'всі' ? null : value;
  },
  [FIELD_TYPE.SEARCH]: (value) => {
    if (value) return value === 'Всі' ? null : value;
  },
  [FIELD_TYPE.SELECT]: (value) => value,
  [FIELD_TYPE.MULTISELECT]: (list, key, settings) => {
    if (!list?.length) return undefined;
    const values = settings.find((i) => i.key === key)?.values;
    if (values?.length === list.length) return null;
    return list.map((i) => i.value);
  },
  [FIELD_TYPE.DATE]: (value) => {
    if (value === null || moment(value, moment.ISO_8601).isValid()) return value;
  }
};

export const prepareMultiSearchData = (input) => {
  const transformed = {};
  const filterDataType = Object.values(input).filter(({ type }) => type === FIELD_TYPE.MUILTISEARCH);
  if (!filterDataType.length) return {};
  const isAllValuesNull = filterDataType.every(({ value }) => value?.length === 1 && value[0]?.value === 'null');
  if (isAllValuesNull) {
    return Object.keys(input).reduce((acc, key) => {
      const relatedKey = input[key].related_key;
      acc[relatedKey] = null;
      return acc;
    }, {});
  }
  Object.entries(input).forEach(([key, { value, related_key }]) => {
    if (!related_key) return;
    if (!value || !value.length) return;
    if (!transformed[related_key]) {
      transformed[related_key] = [];
    }
    value.forEach((item, index) => {
      if (!transformed[related_key][index]) {
        transformed[related_key][index] = {};
      }
      transformed[related_key][index][key] = item.label.split(':')[0]?.split('|')[0]?.trim();
      transformed[related_key][index][key.replace('__name', '__eic')] = item.value;
    });
  });
  return transformed;
};

export const prepareFieldsData = (data, settings) => {
  const result = {};
  for (const k in data) {
    if (data[k].type !== FIELD_TYPE.MUILTISEARCH) {
      const value = prepareFields[data[k].type](data[k].value, k, settings);
      if (value !== undefined) result[k] = value;
    }
  }
  return result;
};

export const getPairByName = (pairs, name, item) => {
  const secondParam = pairs[name] || name;
  if (name.endsWith('__name')) {
    return {
      [name]: item.label,
      [secondParam]: item.value
    };
  }
  return {
    [secondParam]: item.label,
    [name]: item.value
  };
};

export const showVersion = (filters, reportType) => {
  if (
    (filters?.point_species === 'CONSUMPTION_FOR_DOMESTIC_NEEDS' ||
      filters?.point_species === 'CONSUMPTION_FOR_NON_DOMESTIC_NEEDS') &&
    reportType === REPORT_TYPE.BY_PARAMS
  )
    return false;
  if (filters?.source_type === 'ARCHIVE_TS' && reportType === REPORT_TYPE.BY_PARAMS) return false;
  if (filters?.source_type === 'PPKO' && reportType === REPORT_TYPE.BY_PARAMS) return true;
  return filters?.source_type !== 'PPKO' || reportType === REPORT_TYPE.BY_PARAMS || reportType === REPORT_TYPE.BY_ZV || reportType === REPORT_TYPE.BY_VERSION;
};
