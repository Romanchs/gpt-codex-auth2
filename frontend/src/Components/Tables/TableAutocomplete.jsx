import PropTypes from 'prop-types';
import { useEffect, useMemo, useRef, useState } from 'react';
import { mainApi } from '../../app/mainApi';
import Autocomplete from '../Theme/Fields/Autocomplete';

const TableAutocomplete = ({
  onSelect,
  apiPath,
  searchBy,
  mapOptions,
  prefetchAll,
  dataMarker,
  defaultValue = '',
  searchStart = 1,
  filterOptions = (items, { inputValue }) => {
    inputValue = inputValue.trim().toLocaleLowerCase();
    return items.filter((i) => i.label.toLocaleLowerCase().includes(inputValue));
  },
  renderOption
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
    if (data?.length < 50 && newInputValue.includes(originalArgs?.[searchBy])) return;
    if (newInputValue.length >= searchStart && event.target.value) {
      timeout.current = setTimeout(() => {
        fetch({ [searchBy]: newInputValue, limit: 50 }, { preferCacheValue: true });
        clearTimeout(timeout.current);
      }, 400);
    }
  };

  return (
    <Autocomplete
      label={''}
      data-marker={dataMarker}
      id={'table-autocomplete-' + dataMarker}
      inputValue={inputValue}
      loading={isFetching}
      list={inputValue.length >= searchStart && mappedData ? mappedData : []}
      renderInput={(params) => (
        <div ref={params.InputProps.ref}>
          <input type={'text'} {...params.inputProps} />
        </div>
      )}
      onInput={handleChange}
      onChange={(value) => onSelect(value)}
      filterOptions={filterOptions}
      disabledItemsFocusable
      freeSolo
      ListboxProps={{ sx: { maxHeight: 300 } }}
      renderOption={renderOption}
    />
  );
};

TableAutocomplete.propTypes = {
  onSelect: PropTypes.func.isRequired,
  apiPath: PropTypes.string.isRequired,
  mapOptions: PropTypes.func,
  searchBy: PropTypes.string,
  prefetchAll: PropTypes.bool,
  dataMarker: PropTypes.string,
  defaultValue: PropTypes.string,
  searchStart: PropTypes.number
};

export default TableAutocomplete;
