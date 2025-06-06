import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import propTypes from 'prop-types';
import fieldControl from '../../../Forms/fieldControl';
import { updateForm } from '../../../Forms/formActions';
import Autocomplete from '../../../Components/Theme/Fields/Autocomplete';
import { mainApi } from '../../../app/mainApi';

const ArchivingAutocompleteFormField = ({
  label = '',
  name,
  form_name,
  value,
  onChange,
  searchStart = 1,
  required,
  error,
  dataMarker
}) => {
  const dispatch = useDispatch();
  const timeout = useRef(null);
  const [inputValue, setInputValue] = useState('');
  const formData = useSelector((store) => store.forms[form_name]);

  const [fetch, { data, isFetching, originalArgs }] = mainApi.endpoints.usersList.useLazyQuery();

  useEffect(() => {
    setInputValue(value?.full_name || '');
  }, [value]);

  const handleInput = (event, newInputValue) => {
    setInputValue(newInputValue);
    clearTimeout(timeout.current);
    if (newInputValue.length === 0 && formData) {
      handleSelect();
    }
    if (data?.length < 50 && newInputValue.includes(originalArgs?.name)) return;
    if (newInputValue.length >= searchStart && event.target.value) {
      timeout.current = setTimeout(() => {
        fetch({ full_name: newInputValue, limit: 50 });
      }, 400);
    }
  };

  const handleSelect = (item) => {
    onChange(item);
    dispatch(updateForm(form_name, name, item || null));
  };

  return (
    <Autocomplete
      label={label}
      data-marker={dataMarker}
      id={'form-autocomplete-' + dataMarker}
      inputValue={inputValue}
      loading={isFetching}
      list={inputValue.length >= searchStart && data ? data : []}
      renderInput={(params) => (
        <TextField
          {...params}
          label={
            <>
              {label}{' '}
              {required && (
                <Box component={'span'} className={'danger'}>
                  *
                </Box>
              )}
            </>
          }
          error={Boolean(error)}
          helperText={error}
        />
      )}
      onInput={handleInput}
      onChange={handleSelect}
      filterOptions={(items) => items}
      disabledItemsFocusable
      freeSolo
      ListboxProps={{ sx: { maxHeight: 300 } }}
      getOptionKey={(i) => i.uid}
      getOptionLabel={(i) => i.full_name}
    />
  );
};

ArchivingAutocompleteFormField.propTypes = {
  label: propTypes.string,
  name: propTypes.string.isRequired,
  form_name: propTypes.string.isRequired,
  value: propTypes.oneOfType([propTypes.string, propTypes.object]),
  onChange: propTypes.func,
  searchStart: propTypes.number,
  required: propTypes.bool,
  error: propTypes.string,
  dataMarker: propTypes.string.isRequired
};

export default fieldControl(ArchivingAutocompleteFormField);
