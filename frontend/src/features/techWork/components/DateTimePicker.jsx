import makeStyles from '@material-ui/core/styles/makeStyles';
import { KeyboardDateTimePicker } from '@material-ui/pickers';
import moment from 'moment';
import propTypes from 'prop-types';
import { forwardRef, memo, useEffect, useState } from 'react';
import i18n from '../../../i18n/i18n';

export const useDatePickerStyles = makeStyles(() => ({
  root: {
    width: '100%',
    position: 'relative',
    '& > *': {
      width: '100%'
    },

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
        maxWidth: 'calc(100% - 50px)',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      }
    },

    '& .MuiInputBase-root.MuiOutlinedInput-root': {
      width: '100%',
      borderRadius: 10,
      border: '1px solid #D1EDF3',
      outline: 'none',
      color: '#6C7D9A',
      '&.MuiOutlinedInput-adornedEnd': {
        paddingRight: 4
      },
      '&>input': {
        fontSize: 14,
        padding: 12,
        paddingRight: 0
      },
      '&.Mui-focused': {
        border: '1px solid #567691'
      },
      '&>fieldset': {
        display: 'none'
      },
      '&.Mui-error': {
        borderColor: '#f44336'
      },
      '&.Mui-disabled': {
        color: 'rgba(128, 140, 161, 0.9)',
        borderColor: '#E9EDF6'
      }
    },
    '& .MuiButtonBase-root.MuiIconButton-root': {
      color: '#6C7D9A',
      padding: 8,
      '&.Mui-disabled': {
        opacity: 0.5
      }
    }
  }
}));

const DateTimePicker = forwardRef(
  (
    {
      label,
      value,
      onChange,
      error,
      minDate,
      maxDate,
      maxDateMessage,
      minDateMessage,
      required,
      outFormat,
      months,
      disabled,
      onError,
      dataMarker
    },
    forwardedRef
  ) => {
    const classes = useDatePickerStyles();
    const [errorText, setErrorText] = useState('');

    useEffect(() => {
      onError && onError(errorText);
    }, [errorText]);

    const handleChangeDate = (date) => {
      if (!date) {
        return onChange(null);
      }
      if (outFormat) return onChange(moment(date).format(outFormat));
      return onChange(moment(date));
    };

    return (
      <div className={classes.root} ref={forwardedRef}>
        <KeyboardDateTimePicker
          autoOk
          ampm={false}
          variant="inline"
          minDate={minDate}
          maxDate={maxDate}
          inputVariant="outlined"
          disabled={disabled}
          label={
            <>
              {label} {required && <span className={'danger'}>*</span>}
            </>
          }
          format={'dd.MM.yyyy • HH:mm'}
          value={value || null}
          InputAdornmentProps={{ position: 'end' }}
          onChange={handleChangeDate}
          maxDateMessage={maxDateMessage || i18n.t('TECH_WORKS.FIELDS.DATETIME.MAX_DATE_MESSAGE')}
          minDateMessage={minDateMessage || i18n.t('TECH_WORKS.FIELDS.DATETIME.MIN_DATE_MESSAGE')}
          invalidDateMessage={i18n.t('TECH_WORKS.FIELDS.DATETIME.INVALID_DATE_MESSAGE')}
          onError={(e) => setErrorText(e || error)}
          error={Boolean(errorText)}
          helperText={errorText}
          views={months && ['year', 'month']}
          data-marker={dataMarker}
        />
      </div>
    );
  }
);

DateTimePicker.propTypes = {
  label: propTypes.string.isRequired,
  name: propTypes.string,
  onChange: propTypes.func.isRequired,
  value: propTypes.oneOfType([propTypes.object, propTypes.string]),
  error: propTypes.string,
  maxDateMessage: propTypes.string,
  minDateMessage: propTypes.string,
  outFormat: propTypes.string,
  required: propTypes.bool,
  months: propTypes.bool,
  readOnly: propTypes.bool,
  disabled: propTypes.bool,
  onError: propTypes.func,
  dataMarker: propTypes.string
};

export default memo(DateTimePicker);
