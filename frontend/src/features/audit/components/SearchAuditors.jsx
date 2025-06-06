import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useLazyAuditorsQuery } from '../api';
import Autocomplete from '../../../Components/Theme/Fields/Autocomplete';

const SearchAuditors = ({
  defaultValue,
  label,
  onSelect,
  showAll,
  clearable = false,
  error,
  required = false,
  disabled
}) => {
  const timeOut = useRef(null);
  const [fetch, { data, isFetching }] = useLazyAuditorsQuery();
  const [value, setValue] = useState(defaultValue || '');

  const auditors = useMemo(() => {
    return Array.isArray(data) ? data.map((i) => ({ label: i, value: i })) : [];
  }, [data]);

  useEffect(() => {
    if (clearable && !defaultValue) {
      setValue('');
    }
    if (!clearable && defaultValue) {
      setValue(defaultValue);
    }
  }, [clearable, defaultValue]);

  const searchAuditors = (value) => {
    clearTimeout(timeOut.current);
    setValue(value);
    if (value?.length > 2) {
      timeOut.current = setTimeout(() => {
        fetch({ value, assigned: showAll ? 0 : 1 });
      }, 500);
    }
  };

  const selectAuditor = (option) => {
    if (!option) {
      onSelect(undefined);
      return;
    }
    onSelect(option.label);
    setValue(option.label);
  };

  return (
    <Autocomplete
      fullWidth
      label={label}
      value={value}
      inputValue={value}
      list={auditors}
      loading={isFetching}
      onInput={(e) => searchAuditors(e?.target?.value || '')}
      sx={{ mb: 0.375 }}
      onChange={selectAuditor}
      error={error}
      required={required}
      disabled={disabled}
    />
  );
};

export default SearchAuditors;
