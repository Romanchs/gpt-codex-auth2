import { TimePicker as Picker } from '@material-ui/pickers';
import propTypes from 'prop-types';

import { useDatePickerStyles } from './DatePicker';
import IconButton from '@material-ui/core/IconButton';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import {useTranslation} from "react-i18next";

const TimePicker = ({ error, clearable, ...props }) => {
  const classes = useDatePickerStyles();
  const {t} = useTranslation();

  return (
    <div className={classes.root}>
      <Picker
        autoOk
        variant="inline"
        ampm={false}
        inputVariant="outlined"
        invalidDateMessage={t('INCORRECT_TIME')}
        error={Boolean(error)}
        helperText={error || ''}
        InputProps={{
          endAdornment: clearable && (
            <IconButton
              data-marker={'clear'}
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                props.onChange(null);
              }}
            >
              <CloseRoundedIcon fontSize="inherit" />
            </IconButton>
          )
        }}
        {...props}
      />
    </div>
  );
};

export default TimePicker;

TimePicker.propTypes = {
  label: propTypes.string.isRequired,
  value: propTypes.any,
  onChange: propTypes.func.isRequired,
  error: propTypes.oneOfType([propTypes.bool, propTypes.string])
};
