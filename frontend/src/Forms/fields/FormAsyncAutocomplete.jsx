import { useRef, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import propTypes from 'prop-types';
import fieldControl from '../fieldControl';
import { updateForm } from '../formActions';
import Autocomplete from '../../Components/Theme/Fields/Autocomplete';
import { mainApi } from '../../app/mainApi';

const FormAsyncAutocomplete = ({
  label = '',
  name,
  form_name,
  onChange,
  searchStart = 1,
  dataMarker,
  apiPath,
  searchBy,
  mapOptions
}) => {
  const dispatch = useDispatch();
  const timeout = useRef(null);
  const [inputValue, setInputValue] = useState('');
  const formData = useSelector((store) => store.forms[form_name]);

  const [fetch, { data, isFetching, originalArgs }] = mainApi.endpoints[apiPath].useLazyQuery();

  const mappedData = useMemo(() => {
    return mapOptions && data ? mapOptions(data) : data || [];
  }, [data]);

  const handleInput = (event, newInputValue) => {
    setInputValue(newInputValue);
    clearTimeout(timeout.current);
    if (newInputValue?.length === 0 && formData) {
      handleSelect();
    }
    if (data?.length < 50 && newInputValue.includes(originalArgs?.name)) return;
    if (newInputValue?.length >= searchStart && event?.target?.value) {
      timeout.current = setTimeout(() => {
        fetch({ [searchBy]: newInputValue, limit: 50 });
      }, 400);
    }
  };

  const handleSelect = (item) => {
    onChange(item);
    dispatch(updateForm(form_name, name, item || null));
  };

  const filterOptions = (options, { inputValue }) => {
    return options.filter((option) => option.label.toLowerCase().includes(inputValue.toLowerCase()));
  };

  return (
    <Autocomplete
      label={label}
      data-marker={dataMarker}
      id={'form-autocomplete-' + dataMarker}
      inputValue={inputValue || formData?.[name]?.label || []}
      loading={isFetching}
      list={inputValue?.length >= searchStart && mappedData ? mappedData : []}
      onInput={handleInput}
      onChange={handleSelect}
      filterOptions={filterOptions}
      freeSolo
      ListboxProps={{ sx: { maxHeight: 300 } }}
      disablePortal={false}
    />
  );
};

FormAsyncAutocomplete.propTypes = {
  label: propTypes.string,
  name: propTypes.string.isRequired,
  form_name: propTypes.string.isRequired,
  onChange: propTypes.func,
  searchStart: propTypes.number,
  dataMarker: propTypes.string.isRequired,
  apiPath: propTypes.string.isRequired,
  searchBy: propTypes.string.isRequired,
  mapOptions: propTypes.func
};

export default fieldControl(FormAsyncAutocomplete);
