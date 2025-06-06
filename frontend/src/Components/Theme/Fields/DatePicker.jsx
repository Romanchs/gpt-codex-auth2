import makeStyles from '@material-ui/core/styles/makeStyles';
import { KeyboardDatePicker } from '@material-ui/pickers';
import moment from 'moment';
import propTypes from 'prop-types';
import { forwardRef, memo, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

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
        color: 'rgba(86, 118, 145, 1)',
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

const DatePicker = forwardRef(
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
    const { t } = useTranslation();

    useEffect(() => {
      onError && onError(errorText);
    }, [errorText]);

    const handleChangeDate = (date) => {
      if (!date) {
        return onChange(null);
      }
      if (outFormat) return onChange(moment(date).startOf('day').format(outFormat));
      return onChange(moment(date).startOf('day'));
    };

    return (
      <div className={classes.root} ref={forwardedRef}>
        <KeyboardDatePicker
          autoOk
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
          format={months ? 'MMMM yyyy' : 'dd.MM.yyyy'}
          value={value || null}
          InputAdornmentProps={{ position: 'end' }}
          onChange={handleChangeDate}
          maxDateMessage={maxDateMessage || t('VERIFY_MSG.DATE_IS_MORE_THEN_VALID')}
          minDateMessage={minDateMessage || t('VERIFY_MSG.DATE_IS_LESS_THEN_VALID')}
          invalidDateMessage={t('VERIFY_MSG.UNCORRECT_DATE')}
          onError={(e) => setErrorText(e || error)}
          error={Boolean(errorText)}
          helperText={errorText}
          views={months && ['year', 'month']}
          data-marker={dataMarker}
          inputProps={{ 'data-marker': `${dataMarker}_input` }}
        />
      </div>
    );
  }
);

DatePicker.propTypes = {
  label: propTypes.string,
  name: propTypes.string,
  onChange: propTypes.func.isRequired,
  value: propTypes.oneOfType([propTypes.object, propTypes.string]),
  error: propTypes.oneOfType([propTypes.string, propTypes.array]),
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

export default memo(DatePicker);
