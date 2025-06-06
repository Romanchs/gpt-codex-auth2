import { useEffect, useState } from 'react';
import { DatePicker as KeyboardDatePicker } from '@material-ui/pickers';
import moment from 'moment';
import IconButton from '@material-ui/core/IconButton';
import HighlightOffRounded from '@mui/icons-material/HighlightOffRounded';
import {useTranslation} from "react-i18next";

const SearchDate = ({ onSearch, column, formatDate, name, value, maxDate, minDate }) => {
  const [valueDate, setValueDate] = useState(value || null);
  const {t} = useTranslation();

  useEffect(() => {
    if (moment(value).isValid()) {
      setValueDate(value);
    } else {
      setValueDate(null);
    }
  }, [value]);

  return (
    <div className="body__calendar">
      <KeyboardDatePicker
        className="calendar__main-style"
        cancelLabel={t('CONTROLS.CANCEL')}
        okLabel={t('CONTROLS.APPLY')}
        value={valueDate || null}
        onChange={(e) => {
          setValueDate(e);
          if (onSearch) {
            onSearch(column?.id, moment(e).format(formatDate));
          }
        }}
        autoOk
        format={'dd.MM.yyyy'}
        variant={'modal'}
        fullWidth={true}
        minDate={minDate}
        maxDate={maxDate}
        name={name ? name : null}
      />
      {valueDate && (
        <IconButton
          size={'small'}
          onClick={() => {
            setValueDate(null);
            onSearch(column?.id, null);
          }}
          className="clear-button"
          data-marker={'data-picker--clear'}
        >
          <HighlightOffRounded />
        </IconButton>
      )}
    </div>
  );
};

export default SearchDate;
