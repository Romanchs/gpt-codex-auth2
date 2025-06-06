import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import AutocompleteMUI from '@mui/material/Autocomplete';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const Autocomplete = ({
  label,
  defaultValue,
  value,
  list,
  onChange,
  onInput,
  required,
  error,
  sx,
  dataMarker,
  scrollLock = false,
  ...props
}) => {
  const { t } = useTranslation();
  const [innerValue, setInnerValue] = useState(defaultValue || '');

  const handleInputChange = onInput || ((e, v) => e && setInnerValue(v));

  const handleSelect = (...args) => {
    if (onChange) {
      setInnerValue(args[1]?.label || '');
      onChange(args[1]);
    }
  };

  const handleOpen = () => {
    if(scrollLock) {
      document.body.style.overflow = 'hidden'
    }
  }

  const handleClose = () => {
    if(scrollLock) {
      document.body.style.overflow = 'auto'
    }
  }

  return (
    <AutocompleteMUI
      value={onInput ? value : innerValue}
      options={list}
      getOptionLabel={(option) => option.label ?? option}
      loadingText={`${t('LOADING')}...`}
      noOptionsText={t('NO_RESULTS')}
      onChange={handleSelect}
      onInputChange={handleInputChange}
      onOpen={handleOpen} 
      onClose={handleClose}
      renderInput={(params) => (
        <TextField
          {...params}
          data-marker={dataMarker}
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
      isOptionEqualToValue={() => true}
      filterOptions={(options) => {
        const inputValue = (onInput ? value : innerValue)?.trim().toLocaleLowerCase();
        return !inputValue
          ? []
          : options.filter((i) =>
              i?.label ? i.label?.toLocaleLowerCase().includes(inputValue) : i.toLocaleLowerCase().includes(inputValue)
            );
      }}
      clearOnBlur={false}
      clearIcon={null}
      popupIcon={null}
      disablePortal={props.disablePortal || true}
      {...props}
      sx={{
        ...sx,
        '&+.MuiAutocomplete-popper': {
          '& .MuiAutocomplete-option[aria-selected="true"]': {
            backgroundColor: '#fff',
            '&.Mui-focused': {
              backgroundColor: 'rgba(0, 0, 0, 0.04)'
            }
          }
        },
        '&>.MuiFormControl-root': {
          '&>.MuiFormHelperText-root.Mui-error': { color: '#f44336' },
          '&>label': {
            fontSize: 14,
            fontWeight: 400,
            transform: 'translate(14px, 11px) scale(1)',
            color: '#A9B9C6',
            '&.MuiInputLabel-shrink': { transform: 'translate(14px, -6px) scale(0.75)' },
            '&.Mui-disabled': { color: '#A9B9C6' },
            '&.Mui-error': { color: '#f44336' },
            '&.Mui-focused': { color: '#567691' }
          },
          '&>.MuiInputBase-root': {
            border: '1px solid #D1EDF3',
            padding: '12px 65px 12px 12px',
            fontSize: '14px',
            borderRadius: '10px',
            cursor: 'text',
            '&.Mui-disabled': { borderColor: '#E9EDF6', cursor: 'default' },
            '&.Mui-error': { borderColor: '#f44336' },
            '&.Mui-focused': { borderColor: '#567691' },
            '&>.MuiAutocomplete-input': {
              height: '16.63px',
              p: 0,
              color: '#4A5B7A',
              fontWeight: 400,
              '&.Mui-disabled': { color: '#808CA1', WebkitTextFillColor: '#808CA1' }
            },
            '&>.MuiAutocomplete-endAdornment': { display: 'none' }
          }
        },
        '& div>fieldset': { display: 'none' }
      }}
    />
  );
};

const valueType = PropTypes.oneOfType([PropTypes.string, PropTypes.number]);

const listType = PropTypes.arrayOf(
  PropTypes.oneOfType([
    PropTypes.shape({
      value: valueType.isRequired,
      label: valueType.isRequired
    }),
    PropTypes.string
  ])
);

Autocomplete.propTypes = {
  label: valueType.isRequired,
  list: listType.isRequired,
  onChange: PropTypes.func,
  defaultValue: valueType,
  value: valueType,
  onInput: PropTypes.func,
  required: PropTypes.bool,
  error: PropTypes.string,
  props: PropTypes.object
};

export default Autocomplete;
