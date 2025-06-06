import React from 'react';
import DatePicker from '../../../Components/Theme/Fields/DatePicker';
import { useTranslation } from 'react-i18next';

export const ReportDatePickerField = ({ values, id, onChange, innerError, ...props }) => {
  const {t} = useTranslation();
  
  return (
    <DatePicker
      value={values?.[id]}
      onChange={(value) => onChange(id, value)}
      error={t(innerError?.[id])}
      disabled={values.with_changes === 'false'}
      {...props}
    />
  );
};
