import makeStyles from '@material-ui/core/styles/makeStyles';
import { DateTimePicker as DTPicker } from '@material-ui/pickers';
import moment from 'moment';
import propTypes from 'prop-types';
import { forwardRef, memo } from 'react';
import { useTranslation } from 'react-i18next';

export const useDateTimePickerStyles = makeStyles(() => ({
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
      renderFormat,
      onChange,
      minDate,
      minDateMessage,
      maxDate,
      maxDateMessage,
      error,
      required,
      disabled,
      readOnly,
      dataMarker
    },
    forwardedRef
  ) => {
    const { t } = useTranslation();
    const classes = useDateTimePickerStyles();
    const handleChangeDate = (date) => {
      onChange(moment(date));
    };

    return (
      <div className={classes.root} ref={forwardedRef}>
        <DTPicker
          autoOk
          ampm={false}
          variant={'inline'}
          inputVariant={'outlined'}
          label={
            <>
              {label} {required && <span className={'danger'}>*</span>}
            </>
          }
          value={value || null}
          onChange={handleChangeDate}
          format={renderFormat || 'dd.MM.yyyy • HH:mm'}
          minDate={minDate}
          minDateMessage={minDateMessage || t('VERIFY_MSG.DATE_IS_LESS_THEN_VALID')}
          maxDate={maxDate}
          maxDateMessage={maxDateMessage || t('VERIFY_MSG.DATE_IS_MORE_THEN_VALID')}
          error={Boolean(error)}
          helperText={error || ''}
          invalidDateMessage={t('VERIFY_MSG.UNCORRECT_DATE')}
          disabled={disabled}
          readOnly={readOnly}
          data-marker={dataMarker}
        />
      </div>
    );
  }
);

DateTimePicker.propTypes = {
  label: propTypes.string.isRequired,
  value: propTypes.oneOfType([propTypes.object, propTypes.string]),
  renderFormat: propTypes.string,
  onChange: propTypes.func.isRequired,
  minDate: propTypes.oneOfType([propTypes.object, propTypes.string]),
  minDateMessage: propTypes.string,
  maxDate: propTypes.oneOfType([propTypes.object, propTypes.string]),
  maxDateMessage: propTypes.string,
  error: propTypes.string,
  required: propTypes.bool,
  disabled: propTypes.bool,
  readOnly: propTypes.bool,
  dataMarker: propTypes.string
};

export default memo(DateTimePicker);
