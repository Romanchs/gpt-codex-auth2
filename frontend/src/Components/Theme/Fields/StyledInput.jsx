import { FormHelperText } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import makeStyles from '@material-ui/core/styles/makeStyles';
import FileCopyRounded from '@mui/icons-material/FileCopyRounded';
import clsx from 'clsx';
import propTypes from 'prop-types';
import { forwardRef, useEffect, useRef, useState } from 'react';

import { useCopyToClipboardWithSnackbar } from '../../../Hooks/useCopyToClipboard';
import { LightTooltip } from '../Components/LightTooltip';

const useStyles = makeStyles(() => ({
  root: {
    width: '100%',
    position: 'relative',

    '& .MuiFormLabel-root.MuiInputLabel-root': {
      backgroundColor: '#fff',
      maxWidth: 'none',
      padding: '0 5px',
      marginLeft: -5,
      color: '#A9B9C6',
      '&.Mui-focused': {
        color: '#567691'
      },
      '&.Mui-error': {
        color: '#f44336'
      },
      '&:not(.MuiInputLabel-shrink)': {
        transform: 'translate(14px, 14px) scale(1)',
        maxWidth: 'calc(100% - 10px)',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      }
    }
  },
  labels: {
    display: 'block',
    transform: 'translate(14px, 14px) scale(1)',
    maxWidth: 'calc(100% - 50px)',

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
    color: '#567691',
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
      border: '1px solid #E9EDF6',
      color: '#567691'
    },
    '&>fieldset': {
      display: 'none'
    },
    '&.Mui-error': {
      borderColor: '#f44336'
    },
    '&.MuiOutlinedInput-multiline': {
      padding: '9px 12px',
      lineHeight: 1.6
    }
  },
  inputWithClipboard: {
    paddingRight: 50,
    '&.MuiOutlinedInput-multiline': {
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

export const StyledInput = forwardRef(
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
      required,
      number,
      max,
      style,
      multiline,
      maxRows,
      rows,
      clipboard,
      helperText,
      showTooltipIfOverflow = false,
      disableInputTitle = false,
      ...props
    },
    forwardedRef
  ) => {
    const classes = useStyles();
    const { copy } = useCopyToClipboardWithSnackbar();
    const inputRef = useRef(null);
    const [enableTooltip, setEnableTooltip] = useState(false);

    const handleOnChange = (event) => {
      if (max && event.target.value?.length > max) {
        return;
      }
      onChange(event);
    };

    useEffect(() => {
      if (showTooltipIfOverflow && inputRef.current) {
        setEnableTooltip(inputRef.current.scrollWidth > inputRef.current.clientWidth);
      } else {
        setEnableTooltip(false);
      }
    }, [showTooltipIfOverflow, inputRef]);

    return (
      <FormControl variant="outlined" className={classes.root} error={Boolean(error)} style={style}>
        <InputLabel className={classes.labels} shrink={props?.shrink}>
          {label} {required && <span className={'danger'}>*</span>}
        </InputLabel>
        {enableTooltip ? (
          <LightTooltip
            title={enableTooltip ? value : null}
            placement={'bottom-start'}
            disableTouchListener
            disableFocusListener
            disableHoverListener={!enableTooltip}
            data-marker={'tooltip'}
            slotProps={{
              popper: {
                modifiers: [
                  {
                    name: 'offset',
                    options: {
                      offset: [0, -16]
                    }
                  }
                ]
              }
            }}
          >
            <OutlinedInput
              ref={forwardedRef}
              inputProps={{
                ref: inputRef
              }}
              type={number ? 'number' : 'text'}
              multiline={multiline}
              maxRows={maxRows}
              rows={rows}
              disabled={disabled}
              readOnly={readOnly}
              title={(!disableInputTitle && readOnly && value) || ''}
              className={clsx(classes.input, clipboard && classes.inputWithClipboard)}
              value={value || ''}
              name={name}
              onChange={handleOnChange}
              onBlur={onBlur}
              data-marker={dataMarker}
              {...props}
            />
          </LightTooltip>
        ) : (
          <OutlinedInput
            ref={forwardedRef}
            inputProps={{
              ref: inputRef
            }}
            type={number ? 'number' : 'text'}
            multiline={multiline}
            maxRows={maxRows}
            rows={rows}
            disabled={disabled}
            readOnly={readOnly}
            title={(!disableInputTitle && readOnly && value) || ''}
            className={clsx(classes.input, clipboard && classes.inputWithClipboard)}
            value={value || ''}
            name={name}
            onChange={handleOnChange}
            onBlur={onBlur}
            data-marker={dataMarker}
            {...props}
          />
        )}
        {clipboard && (
          <Button className={classes.clipboard} onClick={() => copy(value)} size={'small'}>
            <FileCopyRounded fontSize={'small'} />
          </Button>
        )}
        <FormHelperText>{error || helperText}</FormHelperText>
      </FormControl>
    );
  }
);

StyledInput.propTypes = {
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
  shrink: propTypes.bool,
  disableInputTitle: propTypes.bool
};

export default StyledInput;
