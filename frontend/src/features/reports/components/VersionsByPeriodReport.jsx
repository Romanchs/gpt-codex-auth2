import React from 'react';
import SelectField from '../../../Components/Theme/Fields/SelectField';
import moment from 'moment/moment';
import { useVersionsByPeriodQuery } from '../../versionsByPeriod/api';

export const VersionsByPeriodReport = ({
  values,
  id,
  onChange,
  innerError,
  from_date,
  to_date,
  datesError = {},
  customFilter,
  isDisabled,
  ...props
}) => {
  const invalidDates =
    !from_date ||
    !to_date ||
    !moment(from_date).isValid() ||
    !moment(to_date).isValid() ||
    moment(from_date).isAfter(to_date) ||
    Object.values(datesError).some(Boolean);

  const { data: versionsDara, isFetching } = useVersionsByPeriodQuery(
    {
      from_date: moment(from_date)?.format('yyyy-MM-DD'),
      to_date: moment(to_date)?.format('yyyy-MM-DD')
    },
    { skip: invalidDates }
  );

  const versions = versionsDara?.versions || [];

  const items = ['*', ...versions].map((v) => ({
    value: v.toString(),
    label: v.toString(),
  }));

  const filteredItems = customFilter ? items.filter(customFilter) : items;

  return (
    <SelectField
      value={values?.[id]}
      data={filteredItems}
      loading={isFetching}
      onChange={onChange}
      error={innerError?.[id]}
      ignoreI18
      disabled={invalidDates || isFetching || versions?.length === 0 || isDisabled}
      {...props}
    />
  );
};
