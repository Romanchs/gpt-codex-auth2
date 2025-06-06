import moment from 'moment';

export const getChecksValues = (checksList, chosenBlocks, group) => {
  if (!checksList || !chosenBlocks || !group) return [];
  return chosenBlocks.map((i) => checksList[i.value][group]).flat();
};

export const getBlockOfChecksValues = (values, group) => {
  if (!values || !group) return [];
  return values[group];
};

export const getPeriodToError = (t, from, to, defaultError) => {
  if (moment(to).isBefore('2019-07-01')) {
    return t('VERIFY_MSG.DATE_IS_LESS_THEN_VALID');
  }
  if (moment(to).isBefore(from)) {
    return t('VERIFY_MSG.PERIOD_DATE_IS_BEFORE', {
      from: t('FIELDS.REPORT_PERIOD_FROM').toUpperCase(),
      to: t('FIELDS.REPORT_PERIOD_TO').toUpperCase()
    });
  }
  if (moment(from).isBefore(moment(to).add(-31, 'days'))) {
    return t('VERIFY_MSG.TERM_SHOULD_BE_NO_MORE');
  }
  return defaultError;
};

export const getDataForCreate = (filters, fields) => {
  const checksDataFields = fields?.find((i) => i.key === 'checks');
  const checksValues = filters.checks === 'all' ? checksDataFields?.values.map((i) => i.value) : [filters.checks];
  return {
    version: filters.version === '*' ? null : filters.version,
    source: filters.source,
    period_from: moment(filters.period_from).startOf('day').utc().format(),
    period_to: moment(filters.period_to).startOf('day').utc().format(),
    metering_grid_areas: Array.isArray(filters.metering_grid_areas)
      ? filters.metering_grid_areas.map((i) => i.value)
      : [filters.metering_grid_areas],
    checks: checksValues
  };
};
