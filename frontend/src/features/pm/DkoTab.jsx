import Grid from '@material-ui/core/Grid';
import SaveRounded from '@mui/icons-material/SaveRounded';
import moment from 'moment';
import { useEffect, useState } from 'react';
import CircleButton from '../../Components/Theme/Buttons/CircleButton';
import DatePicker from '../../Components/Theme/Fields/DatePicker';
import SelectField from '../../Components/Theme/Fields/SelectField';
import StyledInput from '../../Components/Theme/Fields/StyledInput';
import TimePicker from '../../Components/Theme/Fields/TimePicker';
import Toggle from '../../Components/Theme/Fields/Toggle';
import { useTableStyles } from './filterStyles';
import {
  useLazyBeginAggregationQuery,
  useLazyGetAggregationByPeriodQuery,
  useLazyGetAggregationQuery,
  useLazySaveAggregationQuery,
  useLazySendToMMSQuery
} from './api';
import { enqueueSnackbar } from '../../actions/notistackActions';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n/i18n';

const initialFilters = {
  period: 'DAY',
  is_active: false,
  first_start: '',
  second_start: '',
  version: 1,
  send_to_mms: 'false'
};

const DkoTab = ({ toRegisterTab }) => {
  const { t } = useTranslation();
  const classes = useTableStyles();
  const [currentProcess, setCurrentProcess] = useState({});
  const [range, setRange] = useState({
    period_from: null,
    period_to: null
  });
  const [filters, setFilters] = useState(initialFilters);
  const [rangeErrors, setRangeErrors] = useState({});
  const [getAggregation, { error }] = useLazyGetAggregationQuery();
  const [getAggregationByPeriod] = useLazyGetAggregationByPeriodQuery();
  const [beginAggregation] = useLazyBeginAggregationQuery();
  const [sendToMMS] = useLazySendToMMSQuery();
  const [saveAggregation] = useLazySaveAggregationQuery();

  useEffect(() => {
    getAggregation().then((res) => {
      setCurrentProcess(res.data);
      setFilters({ ...initialFilters, ...res.data });
    });
  }, []);

  useEffect(() => {
    setRangeErrors((prevErrors) => ({ ...prevErrors, ...verifyRange(range) }));
  }, [range]);

  const handleOnChangeFilters = (filter) => {
    return (value) => {
      switch (filter) {
        case 'period_from':
        case 'period_to':
          setRange({ ...range, [filter]: moment(value).startOf('day') });
          break;
        case 'first_start':
        case 'second_start':
          setFilters({ ...filters, [filter]: value });
          break;
        default:
          if (filter === 'period') {
            getAggregationByPeriod({ period: value }).then((res) => {
              setCurrentProcess(res.data);
            });
          }
          setFilters({ ...filters, [filter]: value });
      }
    };
  };

  const getFilterData = () => ({
    period_from: moment(range.period_from).startOf('day').format('YYYY-MM-DD'),
    period_to: moment(range.period_to).add(1, 'days').startOf('day').format('YYYY-MM-DD'),
    send_to_mms: filters?.send_to_mms,
    version: filters?.version
  });

  const handleBeginAggregation = () => {
    beginAggregation(getFilterData()).then(() => {
      enqueueSnackbar({
        message: t('NOTIFICATIONS.FORMATION_OF_AGGREGATED_DATA_FOR_RROUO_A_LAUNCHED'),
        options: {
          key: new Date().getTime() + Math.random(),
          variant: 'success',
          autoHideDuration: 5000
        }
      });
      toRegisterTab();
    });
  };

  const handleSendToMMS = () => {
    sendToMMS(getFilterData()).then(() => {
      enqueueSnackbar({
        message: t('NOTIFICATIONS.SEND_TO_MMS'),
        options: {
          key: new Date().getTime() + Math.random(),
          variant: 'success',
          autoHideDuration: 5000
        }
      });
      toRegisterTab();
    });
  };

  const handleSave = () => {
    const templateProps = Object.keys(initialFilters);
    const toServer = Object.fromEntries(
      Object.entries(filters)
        .filter(([k]) => templateProps.includes(k))
        .map(([k, v]) => [k, k === 'first_start' || k === 'second_start' ? moment.utc(v).format('H:mm:00') : v])
    );
    toServer.send_to_mms = toServer.send_to_mms === 'true';
    saveAggregation(toServer).then((res) => {
      setCurrentProcess(res.data);
      enqueueSnackbar({
        message: t('NOTIFICATIONS.CHANGES_TO_DKO_AGGREGATION_IN_AUTOMATIC_MODE_SAVED'),
        options: {
          key: new Date().getTime() + Math.random(),
          variant: 'success',
          autoHideDuration: 5000
        }
      });
    });
  };

  return (
    <>
      <section className={classes.table}>
        <h4 className={classes.tableHeader}>{t('MANUAL_MODE')}</h4>
        <div className={classes.tableBody}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={2}>
              <SelectField
                label={t('FIELDS.VERSION')}
                value={filters.version}
                data={[
                  { value: 1, label: '1' },
                  { value: 2, label: '2' },
                  { value: 3, label: '3' }
                ]}
                onChange={handleOnChangeFilters('version')}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <DatePicker
                label={t('FIELDS.PERIOD_FROM')}
                value={range.period_from}
                minDate={moment('2021-01-01')}
                maxDate={range.period_to ? range.period_to : moment().add(-1, 'days')}
                onChange={handleOnChangeFilters('period_from')}
                maxDateMessage={rangeErrors.period_from}
                minDateMessage={rangeErrors.period_from}
                error={rangeErrors?.period_from || error?.period_from}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <DatePicker
                label={t('FIELDS.PERIOD_TO')}
                value={range.period_to}
                minDate={range.period_from ? range.period_from : moment('2021-01-01')}
                maxDate={moment().add(-1, 'days')}
                onChange={handleOnChangeFilters('period_to')}
                maxDateMessage={rangeErrors.period_to}
                minDateMessage={rangeErrors.period_to}
                error={rangeErrors?.period_to || error?.period_to}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <SelectField
                label={t('FIELDS.SEND_TO_MMS')}
                value={filters.send_to_mms}
                data={[
                  { value: 'true', label: t('CONTROLS.YES') },
                  { value: 'false', label: t('CONTROLS.NO') }
                ]}
                onChange={handleOnChangeFilters('send_to_mms')}
              />
            </Grid>
          </Grid>
          <div className={classes.buttonPanel}>
            <CircleButton
              type={'create'}
              title={t('CONTROLS.START_AGGREGATION')}
              dataMarker={'beginAggregation'}
              onClick={handleBeginAggregation}
              disabled={
                !range.period_from || !range.period_to || Boolean(Object.values(rangeErrors).filter((v) => v).length)
              }
            />
            <CircleButton
              type={'send'}
              title={t('CONTROLS.SEND_TO_MMS_2')}
              dataMarker={'sendToMMS'}
              onClick={handleSendToMMS}
              disabled={
                !range.period_from || !range.period_to || Boolean(Object.values(rangeErrors).filter((v) => v).length)
              }
            />
          </div>
        </div>
      </section>
      <section className={classes.table}>
        <h4 className={classes.tableHeader}>{t('AUTOMATIC_MODE')}</h4>
        <div className={classes.tableBody}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={2}>
              <SelectField
                label={t('FIELDS.PERIOD')}
                value={filters.period}
                data={[
                  { value: 'DECADE', label: t('FIELDS.DECADE') },
                  { value: 'DAY', label: t('FIELDS.DAY') }
                ]}
                onChange={handleOnChangeFilters('period')}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <TimePicker
                label={t('FIELDS.AGGREGATION_START_TIME', { num: 1 })}
                value={filters.first_start ? moment(filters.first_start) : ''}
                onChange={handleOnChangeFilters('first_start')}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <TimePicker
                label={t('FIELDS.AGGREGATION_START_TIME', { num: 2 })}
                value={filters.second_start ? moment(filters.second_start) : ''}
                onChange={handleOnChangeFilters('second_start')}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StyledInput
                label={t('FIELDS.AGGREGATION_PERIOD')}
                value={
                  currentProcess
                    ? moment(currentProcess?.period_from).format('DD.MM.YYYY') +
                      ' - ' +
                      moment(currentProcess?.period_to).format('DD.MM.YYYY')
                    : ''
                }
                readOnly
              />
            </Grid>
          </Grid>
          <Toggle
            title={filters?.is_active ? t('TURN_OFF_AGGREGATION') : t('TURN_ON_AGGREGATION')}
            dataMarker={'toggleMode'}
            setSelected={handleOnChangeFilters('is_active')}
            selected={Boolean(filters?.is_active)}
          />
          <CircleButton
            icon={<SaveRounded />}
            color={'green'}
            title={t('SAVE_CHANGES')}
            dataMarker={'saveAggregation'}
            onClick={handleSave}
            disabled={JSON.stringify(filters) === JSON.stringify(currentProcess)}
          />
        </div>
      </section>
    </>
  );
};

export default DkoTab;

const verifyRange = ({ period_from, period_to }) => {
  let err_from = null,
    err_to = null;
  if (period_from) {
    if (moment(period_from).isBefore(moment('2021-01-01'))) {
      err_from = i18n.t('VERIFY_MSG.PARAMETR_PERIOD_SHOULD_BE_LONGER');
    } else if (moment(period_from).isAfter(moment().add(-1, 'days'))) {
      err_from = i18n.t('VERIFY_MSG.PARAMETR_PERIOD_EXCEEDS_VALID_DATE');
    } else if (period_to && moment(period_from).isAfter(period_to)) {
      err_from = i18n.t('VERIFY_MSG.PARAMETR_PERIOD_SHOULD_BE_LESS');
    } else if (period_to && moment(period_from).isBefore(moment(period_to).add(-31, 'days'))) {
      err_from = i18n.t('VERIFY_MSG.TERM_SHOULD_BE_NO_MORE');
    }
  }
  if (period_to) {
    if (moment(period_to).isBefore(moment('2021-01-01'))) {
      err_to = i18n.t('VERIFY_MSG.DATE_FROM_SHOULD_BE_MORE');
    } else if (moment(period_to).isAfter(moment().add(-1, 'days'))) {
      err_to = i18n.t('VERIFY_MSG.PARAMETR_PERIOD_PO_EXCEEDS_VALID_DATE');
    } else if (period_from && moment(period_to).isBefore(period_from)) {
      err_to = i18n.t('VERIFY_MSG.DATE_FROM_SHOULD_BE_MORE_THEN_DATE_TO');
    }
  }
  return { period_from: err_from, period_to: err_to };
};
