import React from 'react';
import SelectField from '../../../Components/Theme/Fields/SelectField';

export const ReportSelectField = ({ values, id, data, onChange, innerError, withAll = true, ...props }) => {
  const handleChange = (v) => {
    if (v === 'all') {
      onChange(id, null);
    } else onChange(id, v);
  };

  return (
    <SelectField
      value={withAll ? values?.[id] ?? 'all' : values?.[id]}
      data={data}
      onChange={handleChange}
      error={innerError?.[id]}
      withAll={withAll}
      {...props}
    />
  );
};
