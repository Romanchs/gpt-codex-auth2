import PropTypes from 'prop-types';
import { useEffect, useMemo, useRef, useState } from 'react';
import Autocomplete from './Autocomplete';
import { mainApi } from '../../../app/mainApi';

const AsyncAutocomplete = ({
  label,
  defaultValue = '',
  onSelect,
  error,
  apiPath,
  searchBy,
  mapOptions,
  prefetchAll,
  dataMarker,
  searchStart = 1,
  filterOptions = (items, { inputValue }) => {
    inputValue = inputValue.trim()?.toLocaleLowerCase();
    return items.filter((i) => i.label?.toLocaleLowerCase().includes(inputValue));
  },
  selectInputValue = false,
  searchParams = {},
  ...props
}) => {
  const timeout = useRef(null);
  const [inputValue, setInputValue] = useState(defaultValue);

  const [fetch, { data, isFetching, originalArgs }] = mainApi.endpoints[apiPath].useLazyQuery();

  const mappedData = useMemo(() => {
    return mapOptions && data ? mapOptions(data) : data || [];
  }, [data]);

  useEffect(() => {
    if (prefetchAll) fetch();
  }, [fetch, prefetchAll]);

  const handleChange = (event, newInputValue) => {
    setInputValue(newInputValue);
    clearTimeout(timeout.current);
    if (prefetchAll) return;
    if (data?.length < 50 && newInputValue.includes(originalArgs?.name)) return;
    if (newInputValue?.length >= searchStart && event.target.value) {
      timeout.current = setTimeout(() => {
        fetch({ [searchBy]: newInputValue, limit: 50, ...searchParams }).then((res) => {
          if (res.data?.length === 0 && selectInputValue) onSelect({ value: newInputValue, label: newInputValue });
        });
      }, 400);
    }
  };

  return (
    <Autocomplete
      label={label}
      data-marker={dataMarker}
      id={'async-autocomplete-' + dataMarker}
      inputValue={inputValue}
      loading={isFetching}
      list={inputValue?.length >= searchStart && mappedData ? mappedData : []}
      onInput={handleChange}
      onChange={(value) => onSelect(value)}
      filterOptions={filterOptions}
      disabledItemsFocusable
      freeSolo
      error={error}
      ListboxProps={{ sx: { maxHeight: 300, zIndex: '999999 !important' } }}
      {...props}
    />
  );
};

AsyncAutocomplete.propTypes = {
  onSelect: PropTypes.func.isRequired,
  apiPath: PropTypes.string.isRequired,
  mapOptions: PropTypes.func,
  searchBy: PropTypes.string,
  prefetchAll: PropTypes.bool,
  dataMarker: PropTypes.string,
  defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  searchStart: PropTypes.number
};

export default AsyncAutocomplete;
