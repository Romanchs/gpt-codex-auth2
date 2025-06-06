import { FormHelperText } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import makeStyles from '@material-ui/core/styles/makeStyles';
import FileCopyRounded from '@mui/icons-material/FileCopyRounded';
import clsx from 'clsx';
import propTypes from 'prop-types';
import { forwardRef } from 'react';

import { useCopyToClipboardWithSnackbar } from '../../../Hooks/useCopyToClipboard';

const useStyles = makeStyles(() => ({
  root: {
    width: '100%',
    position: 'relative',
    '& .MuiInput-underline:after': {
      display: 'none'
    },
    '& .MuiInput-underline:before': {
      display: 'none'
    }
  },
  input: {
    background: '#fff',
    borderRadius: 10,
    border: 'none',
    outline: 'none',
    boxSizing: 'border-box',
    color: '#4A5B7A',
    '&>input': {
      fontSize: 14,
      padding: 12,
      '&:read-only': {
        textOverflow: 'ellipsis'
      }
    },
    '&>fieldset': {
      display: 'none'
    },
    '&.Mui-error': {
      borderColor: '#f44336'
    },
    '&.MuiInput-multiline': {
      padding: '12px 12px 6px',
      lineHeight: 1.6
    }
  },
  inputWithClipboard: {
    paddingRight: 50,
    '&.MuiInput-multiline': {
      paddingRight: 50
    }
  },
  clipboard: {
    background: 'none !important',
    position: 'absolute',
    top: 10,
    right: -3,

    '& .MuiTouchRipple-root': {
      display: 'none'
    }
  }
}));

export const StyledInputWhite = forwardRef(
  (
    {
      value,
      name,
      label,
      onChange,
      onBlur,
      error,
      dataMarker,
      disabled,
      readOnly,
      number,
      max,
      style,
      multiline,
      maxRows,
      rows,
      clipboard,
      ...props
    },
    forwardedRef
  ) => {
    const classes = useStyles();
    const { copy } = useCopyToClipboardWithSnackbar();

    const handleOnChange = (event) => {
      if (max && event.target.value?.length > max) {
        return;
      }
      onChange(event);
    };

    return (
      <FormControl variant="outlined" className={classes.root} error={Boolean(error)} style={style}>
        <Input
          ref={forwardedRef}
          type={number ? 'number' : 'text'}
          multiline={multiline}
          maxRows={maxRows}
          rows={rows}
          disabled={disabled}
          readOnly={readOnly}
          title={(readOnly && value) || ''}
          className={clsx(classes.input, clipboard && classes.inputWithClipboard)}
          value={value || ''}
          name={name}
          onChange={handleOnChange}
          onBlur={onBlur}
          data-marker={dataMarker}
          placeholder={label}
          {...props}
        />
        {clipboard && (
          <Button className={classes.clipboard} onClick={() => copy(value)} size={'small'}>
            <FileCopyRounded fontSize={'small'} />
          </Button>
        )}
        {error && <FormHelperText>{error}</FormHelperText>}
      </FormControl>
    );
  }
);

StyledInputWhite.propTypes = {
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
  rows: propTypes.number,
  clipboard: propTypes.bool,
  shrink: propTypes.bool
};

export default StyledInputWhite;
