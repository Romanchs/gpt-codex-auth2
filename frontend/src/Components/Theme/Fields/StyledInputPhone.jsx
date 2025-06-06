import propTypes from 'prop-types';
import makeStyles from '@material-ui/core/styles/makeStyles';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import { FormHelperText } from '@material-ui/core';
import { forwardRef } from 'react';

const useStyles = makeStyles(() => ({
  root: {
    width: '100%',
    position: 'relative'
  },
  labels: {
    display: 'block',
    transform: 'translate(14px, 14px) scale(1)',
    padding: '0 5px',
    marginLeft: -5,
    color: '#A9B9C6',
    '&.Mui-focused': {
      color: '#567691'
    },
    '&.Mui-error': {
      color: '#f44336'
    }
  },
  input: {
    borderRadius: 10,
    border: '1px solid #D1EDF3',
    outline: 'none',
    color: '#4A5B7A',
    '&>input': {
      fontSize: 14,
      padding: 12,
      '&:read-only': {
        textOverflow: 'ellipsis'
      }
    },
    '&.Mui-focused': {
      border: '1px solid #567691'
    },
    '&.Mui-disabled': {
      border: '1px solid #E9EDF6'
    },
    '&>fieldset': {
      display: 'none'
    },
    '&.Mui-error': {
      borderColor: '#f44336'
    },
    '&.MuiOutlinedInput-multiline': {
      padding: 12,
      lineHeight: 1.6
    }
  }
}));

const toPhoneFormat = (value) => {
  if (!value.startsWith('380')) {
    return '380';
  }

  return value
    .replace(/[^+\d]/g, '')

    .replace(/(\d{3})(\d{1})/, '$1 $2')
    .replace(/(\s\d{2})(\d{1})/, '$1 $2')
    .replace(/(\s\d{3})(\d{1})/, '$1 $2')
    .replace(/(\d{3}\s\d{2}\s\d{3}\s\d{2})(\d{1})/, '$1 $2');
};

export const StyledInputPhone = forwardRef(
  (
    {
      value = '380',
      name,
      label,
      onChange,
      onBlur,
      error,
      dataMarker,
      disabled,
      readOnly,
      required,
      number,
      max = 16,
      style,
      multiline,
      maxRows,
      rows,
      ...props
    },
    forwardedRef
  ) => {
    const classes = useStyles();

    const handleOnChange = (event) => {
      const value = event.target.value;

      if ((max && value?.length > max) || value?.length <= 3) {
        return;
      }

      onChange(toPhoneFormat(value));
    };

    return (
      <FormControl variant="outlined" className={classes.root} error={Boolean(error)} style={style}>
        <InputLabel className={classes.labels}>
          {label} {required && <span className={'danger'}>*</span>}
        </InputLabel>
        <OutlinedInput
          ref={forwardedRef}
          type={number ? 'number' : 'text'}
          multiline={multiline}
          maxRows={maxRows}
          rows={rows}
          disabled={disabled}
          readOnly={readOnly}
          title={readOnly ? value : ''}
          className={classes.input}
          value={value === null ? '' : toPhoneFormat(value)}
          name={name}
          onChange={handleOnChange}
          onBlur={onBlur}
          data-marker={dataMarker}
          {...props}
        />
        {error && <FormHelperText>{error}</FormHelperText>}
      </FormControl>
    );
  }
);

StyledInputPhone.propTypes = {
  value: propTypes.oneOfType([propTypes.string, propTypes.number, propTypes.object]),
  name: propTypes.string,
  label: propTypes.string.isRequired,
  onChange: propTypes.func,
  dataMarker: propTypes.string,
  disabled: propTypes.bool,
  readOnly: propTypes.bool,
  number: propTypes.bool,
  max: propTypes.number,
  multiline: propTypes.bool,
  maxRows: propTypes.number,
  rows: propTypes.number
};

export default StyledInputPhone;
