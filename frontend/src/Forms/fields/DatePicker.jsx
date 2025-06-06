import makeStyles from '@material-ui/core/styles/makeStyles';
import TodayRounded from '@mui/icons-material/TodayRounded';
import { DatePicker as MaterialDatePicker } from '@material-ui/pickers';
import moment from 'moment';
import { useEffect } from 'react';

import fieldControl from '../fieldControl';
import {useTranslation} from "react-i18next";

const useStyles = makeStyles(() => ({
  root: {
    width: '100%',
    position: 'relative'
  },
  picker: {
    width: '100%',
    backgroundColor: '#fff',
    '& .MuiInput-underline:after': {
      display: 'none'
    },
    '& .MuiInput-underline:before': {
      display: 'none'
    },
    '& input': {
      padding: '8px 50px 8px 12px'
    }
  },
  icon: {
    position: 'absolute',
    right: 10,
    top: 6,
    fontSize: 22,
    pointerEvents: 'none',
    cursor: 'pointer'
  }
}));

const DatePicker = ({ value, onChange, minDate, initDate }) => {
  const classes = useStyles();
  const {t} = useTranslation();

  const handleOnChange = (value) => {
    onChange(value.startOf('day').format(moment.HTML5_FMT.DATETIME_LOCAL_MS));
  };

  useEffect(() => {
    if (!value) {
      handleOnChange(initDate || moment());
    }
  }, []);

  return (
    <div className={classes.root}>
      <MaterialDatePicker
        cancelLabel={t('CONTROLS.CANCEL')}
        okLabel={t('CONTROLS.APPLY')}
        className={classes.picker}
        value={value}
        minDate={minDate}
        autoOk
        onChange={(d) => handleOnChange(moment(d))}
        initialFocusedDate={initDate}
        format={'dd MMMM yyyy'}
        variant={'modal'}
      />
      <TodayRounded className={classes.icon} />
    </div>
  );
};

export default fieldControl(DatePicker);
