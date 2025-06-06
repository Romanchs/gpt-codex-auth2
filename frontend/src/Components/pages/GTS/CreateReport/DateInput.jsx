import Box from '@mui/material/Box';
import CheckedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import UncheckedIcon from '@mui/icons-material/RadioButtonUncheckedRounded';
import { useEffect, useMemo, useRef, useState } from 'react';
import StyledInput from '../../../Theme/Fields/StyledInput';
import moment from 'moment/moment';
import DatePicker from '../../../Theme/Fields/DatePicker';
import { LightTooltip } from '../../../Theme/Components/LightTooltip';
import { useTranslation } from 'react-i18next';
import propTypes from 'prop-types';

const DateInput = ({
  label,
  onInput,
  onChecked,
  error,
  maxDate,
  minDate,
  maxDateMessage,
  minDateMessage,
  invalidDateMessage,
  required,
  readOnly,
  disabled,
  dataMarker,
  ...props
}) => {
  const { t } = useTranslation();
  const inputRef = useRef();
  const [value, setValue] = useState('');
  const isDisabled = readOnly || disabled;
  const isChecked = value === t('ALL');
  const [isChangeInput, setIsChangeInput] = useState(0);

  useEffect(() => {
    const masked = getMask(value);
    const index = getLastNumberIndex(masked);
    if (index > -1) {
      inputRef.current?.childNodes?.[0].setSelectionRange(index + 1, index + 1);
    }
  }, [value, isChangeInput]);

  const innerError = useMemo(() => {
    if (!value?.length) return error;
    const minDateIsDate = moment(minDate, moment.ISO_8601).isValid();
    const maxDateIsDate = moment(maxDate, moment.ISO_8601).isValid();

    if (!isChecked && !isValidDate(value)) {
      return invalidDateMessage || t('VERIFY_MSG.UNCORRECT_DATE');
    }
    if (maxDateIsDate && moment(value).isAfter(maxDate)) {
      return maxDateMessage || t('VERIFY_MSG.DATE_IS_MORE_THEN_VALID');
    }
    if (minDateIsDate && moment(value).isBefore(minDate)) {
      return minDateMessage || t('VERIFY_MSG.DATE_IS_LESS_THEN_VALID');
    }
    return error;
  }, [t, value, isChecked, minDate, maxDate, error, maxDateMessage, minDateMessage, invalidDateMessage]);

  const handleOnChange = (e) => {
    const newValue = e.target.value.replace(/\D/g, '').substring(0, 8);
    if (value === newValue) {
      setIsChangeInput((prev) => prev + 1);
    }
    setValue(newValue);

    if (!newValue?.length) onInput('');
    else if (newValue.length === 8) onInput(moment(getFormattedDate(newValue)));
    else onInput(moment('Invalid Date'));
  };

  const handleOnChangeDate = (v) => {
    onInput(moment(v));
    setValue(v);
  };

  const handleOnChecked = () => {
    if (!isDisabled) {
      setValue(isChecked ? '' : t('ALL'));
      onChecked(!isChecked);
    }
  };

  return (
    <Box
      sx={{
        position: 'relative',
        '& .MuiFormLabel-root.MuiInputLabel-root:not(.MuiInputLabel-shrink)': {
          maxWidth: 'calc(100% - 70px)'
        },
        '& input': {
          p: '12px 72px 12px 12px'
        }
      }}
    >
      <StyledInput
        label={label}
        value={!value?.length || isChecked ? value : getMask(value)}
        onChange={handleOnChange}
        error={innerError}
        required={required}
        readOnly={readOnly}
        disabled={disabled}
        dataMarker={dataMarker}
        ref={inputRef}
        {...props}
      />
      <Box
        sx={{
          position: 'absolute',
          top: 3.5,
          right: 4,
          display: 'inline-block',
          p: 0,
          '& .MuiInputBase-root.MuiOutlinedInput-root>input': {
            width: 0,
            height: 0,
            p: 0
          },
          '& .MuiInputAdornment-root': {
            ml: 0,
            alignItems: 'flex-start'
          },
          '& .MuiInputBase-formControl.MuiOutlinedInput-root.MuiOutlinedInput-adornedEnd': {
            pr: 0,
            border: 'none'
          }
        }}
      >
        <DatePicker
          label={''}
          onChange={handleOnChangeDate}
          outFormat={'DDMMyyyy'}
          minDate={minDate}
          maxDate={maxDate}
          disabled={isDisabled}
        />
      </Box>
      <LightTooltip title={t('SELECT_ALL')} arrow disableTouchListener disableFocusListener>
        <Box
          sx={{
            position: 'absolute',
            top: '10px',
            right: '40px',
            height: '22px',
            '&>svg': {
              cursor: 'pointer',
              fontSize: '22px'
            }
          }}
        >
          {isChecked ? (
            <CheckedIcon onClick={handleOnChecked} sx={{ color: '#F28C60', ...(isDisabled && { opacity: '0.5' }) }} />
          ) : (
            <UncheckedIcon onClick={handleOnChecked} sx={{ color: '#4A5B7A', ...(isDisabled && { opacity: '0.5' }) }} />
          )}
        </Box>
      </LightTooltip>
    </Box>
  );
};

const getMask = (value) => {
  let mask = '__.__.____'.split(''),
    j = 0;
  for (let i = 0; i < value.length; i++) {
    if (mask[j] === '.') j++;
    mask[j++] = value[i];
  }
  return mask.join('');
};

const getFormattedDate = (value) => getMask(value).split('.').reverse().join('-');

const isValidDate = (date) => {
  if (date?.length === 8) {
    return moment(getFormattedDate(date), moment.ISO_8601).isValid();
  }
  return false;
};

const getLastNumberIndex = (value) => {
  if (!value) return 0;
  let index = -1;
  for (let i = value.length - 1; i > -1; i--) {
    if ('0123456789'.indexOf(value[i]) > -1) {
      index = i;
      break;
    }
  }
  return index;
};

DateInput.propTypes = {
  label: propTypes.string.isRequired,
  onInput: propTypes.func.isRequired,
  onChecked: propTypes.func.isRequired,
  error: propTypes.oneOfType([propTypes.string, propTypes.array]),
  maxDate: propTypes.oneOfType([propTypes.object, propTypes.string]),
  minDate: propTypes.oneOfType([propTypes.object, propTypes.string]),
  maxDateMessage: propTypes.string,
  minDateMessage: propTypes.string,
  invalidDateMessage: propTypes.string,
  required: propTypes.bool,
  readOnly: propTypes.bool,
  disabled: propTypes.bool,
  dataMarker: propTypes.string
};

export default DateInput;
