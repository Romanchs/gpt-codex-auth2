import SaveRounded from '@mui/icons-material/SaveRounded';
import Grid from '@material-ui/core/Grid';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import Toggle from '../../../Components/Theme/Fields/Toggle';
import CircleButton from '../../../Components/Theme/Buttons/CircleButton';
import DatePicker from '../../../Components/Theme/Fields/DatePicker';
import SelectField from '../../../Components/Theme/Fields/SelectField';
import TimePicker from '../../../Components/Theme/Fields/TimePicker';
import { useTableStyles } from '../filterStyles';
import ZVTable from './ZVTable';
import {
  TAGS,
  useGetListPMZVQuery,
  useInitPMZVQuery,
  useUpdateLockGlobalPMZVMutation,
  useUpdatePointsPMZVMutation
} from './api';
import i18n from '../../../i18n/i18n';
import { useTranslation } from 'react-i18next';
import { mainApi } from '../../../app/mainApi';

const initialFilters = {
  interval_divider1: 1,
  interval_type1: 'decade',
  interval_time1: moment(),

  interval_divider2: 1,
  interval_type2: 'decade',
  interval_time2: moment(),

  interval_divider3: 1,
  interval_type3: 'decade',
  interval_time3: moment(),

  action_type: 'locked',
  period_from: moment(),
  period_to: moment(),
  points: []
};

const defaultOptions = {
  interval_type: [{ value: 'decade', label: i18n.t('FIELDS.DECADE') }],
  interval_divider: [{ value: '1', label: '1' }]
};

const globalLock = [
  { id: 'interval_type1', name: 'interval_type', label: 'FIELDS.PERIOD', defaultOptions: defaultOptions.interval_type },
  {
    id: 'interval_divider1',
    name: 'interval_divider',
    label: 'FIELDS.DAY_NUMBER',
    defaultOptions: defaultOptions.interval_divider
  },
  { id: 'interval_time1', name: 'interval_time', label: 'FIELDS.TIME', md: 2 },
  { id: 'active1', name: 'active', md: 6, textAlign: 'right' }
];

const defaultParams = {
  page: 1,
  size: 25,
  context: 'locked'
};

const ZVTab = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const classes = useTableStyles();
  const [params, setParams] = useState(defaultParams);

  const [filters, setFilters] = useState(initialFilters);
  const [isAll, setIsAll] = useState(false);

  const { data: settings } = useInitPMZVQuery();
  const { data: points, isFetching } = useGetListPMZVQuery(params);
  const [updateLockGlobalZv, { error }] = useUpdateLockGlobalPMZVMutation({ fixedCacheKey: 'PMZV_updateLock' });
  const [updatePoints] = useUpdatePointsPMZVMutation({ fixedCacheKey: 'PMZV_updatePoints' });

  const timeToValue = (time) => {
    time = time.split(':');
    return moment().set({ hour: time[0], minute: time[1] });
  };

  useEffect(() => {
    if (!settings?.actives) return;
    setFilters((prev) => {
      const actives = {};
      for (let i = 0; i < 3; i++) {
        const n = i + 1;
        if (prev['active' + n] === undefined) actives['active' + n] = Boolean(settings.actives[i]);
        if (!actives['active' + n]) continue;
        actives['interval_divider' + n] = settings.actives[i].interval_divider?.value;
        actives['interval_type' + n] = settings.actives[i].interval_type.value;
        actives['interval_time' + n] = timeToValue(settings.actives[i].interval_time);
      }
      return { ...prev, ...actives };
    });
  }, [settings]);

  const changeSettings = (values) => {
    setFilters((prev) => ({ ...prev, ...values }));
  };

  const handleOnChangeFilters = (filter) => {
    return (value) => {
      switch (filter) {
        case 'period_from':
        case 'period_to':
          changeSettings({ [filter]: moment(value).format('yyyy-MM-DD') });
          break;
        case 'interval_type1':
        case 'interval_type2':
        case 'interval_type3': {
          const values = { [filter]: value };
          if (value === 'day') values['interval_divider' + filter.slice(-1)] = null;
          changeSettings(values);
          break;
        }
        case 'action_type':
          setParams({ ...params, context: value });
          changeSettings({ [filter]: value, points: [] });
          break;
        default:
          changeSettings({ [filter]: value });
      }
    };
  };

  const handleChangeToggle = async (id, value, index) => {
    const body = {
      interval_type: filters['interval_type' + index],
      interval_divider: filters['interval_divider' + index],
      interval_time: moment(filters['interval_time' + index]).format('HH:mm:00')
    };
    const { error } = await updateLockGlobalZv({ body, action: value ? 'lock' : 'unlock' });
    if (!error) {
      changeSettings({ [id]: value });
      dispatch(mainApi.util.invalidateTags([TAGS.PROCESS_MANAGER_ZV_SETTINGS]));
    }
  };

  const handleSaveLock = () => {
    const body = {
      interval_from: moment(filters.period_from).startOf('day').utc().format(),
      interval_to: moment(filters.period_to).startOf('day').utc().format(),
      include: isAll ? [] : filters.points,
      exclude: isAll ? filters.points : [],
      all: isAll
    };
    updatePoints({ type: filters.action_type === 'locked' ? 'unlock' : 'lock', body, params });
    setIsAll(false);
    changeSettings({ points: [] });
  };

  const globalLockedRender = ({ id, name, label, defaultOptions }) => {
    const index = id.slice(-1);
    if (name === 'interval_time')
      return (
        <TimePicker
          label={t(label)}
          value={filters[id]}
          onChange={handleOnChangeFilters(id)}
          error={error?.data?.[name]}
          disabled={filters['active' + index]}
        />
      );
    if (name === 'active')
      return (
        <Toggle
          title={filters[id] ? t('DISABLE_GLOBAL_BLOCKING') : t('ENABLE_GLOBAL_BLOCKING')}
          dataMarker={'globalLockToggle' + index}
          setSelected={() => handleChangeToggle(id, !filters[id], index)}
          selected={filters[id] || false}
          color={'green-red'}
        />
      );
    let dataList = settings?.[name] || defaultOptions;
    if (name === 'interval_divider' && settings?.[name]) {
      const intervalType = filters['interval_type' + index];
      if (intervalType !== 'day') {
        dataList = settings[name][intervalType];
      } else {
        dataList = settings[name][filters[id] > settings[name]['decade'].length ? 'month' : 'decade'];
      }
    }
    return (
      <SelectField
        label={t(label)}
        value={filters[id]}
        data={dataList}
        dataMarker={id}
        onChange={handleOnChangeFilters(id)}
        error={error?.data?.[name]}
        disabled={
          filters['active' + index] || (name === 'interval_divider' && filters['interval_type' + index] === 'day')
        }
        ignoreI18
      />
    );
  };

  return (
    <>
      <section className={classes.table}>
        <h4 className={classes.tableHeader}>{t('GLOBAL_LOCK_SETTINGS')}</h4>
        <div className={classes.tableBody}>
          <Grid container spacing={3}>
            {globalLock.map(({ md = 2, textAlign = 'left', ...field }) => (
              <Grid key={field.id} item xs={12} sm={6} md={md} style={{ textAlign }}>
                {globalLockedRender(field)}
              </Grid>
            ))}
          </Grid>
        </div>
      </section>
      <section className={classes.table}>
        <h4 className={classes.tableHeader}>{t('POINT_ADJUSTMENT')}</h4>
        <div className={classes.tableBody}>
          <Grid item xs={12} sm={6} md={2}>
            <DatePicker
              label={t('FIELDS.PERIOD_FROM')}
              value={filters.period_from}
              onChange={handleOnChangeFilters('period_from')}
              error={error?.data?.period_from}
              minDate={moment('2019-07-01')}
              minDateMessage={t('VERIFY_MSG.MIN_DATE_MESSAGE_WITH_PARAM', { param: '01.07.2019' })}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <DatePicker
              label={t('FIELDS.PERIOD_TO')}
              value={filters.period_to}
              onChange={handleOnChangeFilters('period_to')}
              error={error?.data?.period_to}
              minDate={moment(filters.period_from).isValid() ? moment(filters.period_from) : moment('2019-07-01')}
              minDateMessage={
                moment(filters.period_from).isValid()
                  ? t('VERIFY_MSG.DATE_FROM_SHOULD_BE_MORE_THEN_DATE_TO')
                  : t('VERIFY_MSG.MIN_DATE_MESSAGE_WITH_PARAM', { param: '01.07.2019' })
              }
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <SelectField
              label={t('FIELDS.ACTION_TYPE')}
              value={filters.action_type}
              data={[
                { label: t('UNLOCKING'), value: 'locked' },
                { label: t('LOCKING'), value: 'unlocked' }
              ]}
              onChange={handleOnChangeFilters('action_type')}
              ignoreI18
              dataMarker={'action_type'}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6} style={{ textAlign: 'right' }}>
            <CircleButton
              icon={<SaveRounded />}
              color={'green'}
              title={t('CONTROLS.SAVE')}
              dataMarker={'saveLock'}
              onClick={handleSaveLock}
              disabled={!(isAll || filters.points.length > 0)}
            />
          </Grid>
        </div>
      </section>
      <ZVTable
        response={points}
        params={params}
        setParams={setParams}
        points={filters.points}
        setPoints={(points) => changeSettings({ points })}
        loading={isFetching}
        isAll={isAll}
        setIsAll={setIsAll}
      />
    </>
  );
};

export default ZVTab;
