import moment from 'moment';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { enqueueSnackbar } from '../../../actions/notistackActions';

import CircleButton from '../../../Components/Theme/Buttons/CircleButton';
import DatePicker from '../../../Components/Theme/Fields/DatePicker';
import MultiSelect from '../../../Components/Theme/Fields/MultiSelect';
import SelectField from '../../../Components/Theme/Fields/SelectField';
import StyledInput from '../../../Components/Theme/Fields/StyledInput';
import TimePicker from '../../../Components/Theme/Fields/TimePicker';
import CancelModal from '../../../Components/Modal/CancelModal';
import { useTableStyles } from '../filterStyles';
import { mainApi } from '../../../app/mainApi';
import { useCreateProcessManagerMutation, useDeleteProcessManagerMutation, useGetDataProcessManagerQuery } from './api';
import Table from './Table';
import { useTranslation } from 'react-i18next';
import { Box, CircularProgress, Grid } from '@mui/material';
import { isIntegerOrNull } from '../../../util/helpers';
import { useLazyVersionsByPeriodQuery } from '../../versionsByPeriod/api';
import InputAdornment from '@material-ui/core/InputAdornment';

const initialFilters = {
  metering_grid_area_list: [{ label: 'ALL', value: 'all' }],
  startup_type: 'MANUAL',
  processes: [],
  is_certified: false,
  version: null,
  parent_process_name: '',
  unique_time_series: true,

  period_from: null,
  period_to: null,
  metering_grid_areas: [],

  period_type: 'DECADE',
  day: 1,
  first_start: moment(),
  second_start: moment()
};

const TasksTab = ({ toBlockedTab }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const classes = useTableStyles();
  const [params, setParams] = useState({});
  const [filters, setFilters] = useState(initialFilters);
  const [approveModal, setApproveModal] = useState({
    isOpen: false,
    text: t('ARE_YOU_SURE_YOU_WANT_TO_RUN_THE_PROCEDURE'),
    handler: null
  });
  const [fromDateError, setFromDateError] = useState(null);
  const [toDateError, setToDateError] = useState(null);
  const { data: settings } = useGetDataProcessManagerQuery({ type: 'settings' });
  const [createTask, { error, reset }] = useCreateProcessManagerMutation({
    fixedCacheKey: 'processManager_createTask'
  });
  const [deleteTask] = useDeleteProcessManagerMutation({ fixedCacheKey: 'processManager_deleteTask' });

  const [getVersions, { data, isFetching }] = useLazyVersionsByPeriodQuery();

  useEffect(() => {
    if (!settings) return;
    const time1 = settings.AUTO?.[initialFilters.period_type]?.first_start?.split(':'),
      time2 = settings.AUTO?.[initialFilters.period_type]?.second_start?.split(':');

    setFilters((prev) => ({
      ...prev,
      metering_grid_area_list: settings.MANUAL?.metering_grid_areas,
      parent_process_name: settings.parent_process_name,
      period_from: settings.MANUAL?.period_from,
      period_to: settings.MANUAL?.period_to,
      first_start: moment().set({ hour: time1[0], minute: time1[1] }),
      second_start: moment().set({ hour: time2[0], minute: time2[1] })
    }));
  }, [settings]);

  useEffect(() => {
    if (!filters.period_from || !filters.period_to || !filters.is_certified) return;
    if (!moment(filters.period_from).isValid() || !moment(filters.period_to).isValid()) return;
    if (fromDateError || toDateError) return;
    getVersions({
      from_date: moment(filters.period_from)?.format('yyyy-MM-DD'),
      to_date: moment(filters.period_to)?.format('yyyy-MM-DD')
    }).then((res) => {
      if (res?.data?.versions?.length > 0) {
        setFilters({ ...filters, version: Math.max(...res.data.versions) });
      }
    });
  }, [fromDateError, toDateError, filters.is_certified, filters.period_to, filters.period_from, getVersions]);

  const handleOnChangeFilters = (filter) => {
    return (value) => {
      reset();
      switch (filter) {
        case 'period_type': {
          const time1 = settings.AUTO?.[value]?.first_start?.split(':'),
            time2 = settings.AUTO?.[value]?.second_start?.split(':');
          setFilters({
            ...filters,
            [filter]: value,
            day: 1,
            first_start: moment().set({ hour: time1[0], minute: time1[1] }),
            second_start: moment().set({ hour: time2[0], minute: time2[1] })
          });
          break;
        }
        case 'processes':
	        if (value.find((i) => i.value === 'CERTIFICATION_TS')) {
		        setFilters({ ...filters, [filter]: value, is_certified: true, version: null })
		        break;
	        }
          if (!value.length || !value.find((i) => i.value === 'CERTIFICATION_TS')) {
            setFilters({ ...filters, [filter]: value, is_certified: false, version: null });
            break;
          }
          if (!value.length || (value.length === 1 && value.find((i) => i.value === 'AGGREGATE_DATA_BY_GROUP_A'))) {
            setFilters({ ...filters, [filter]: value, metering_grid_areas: [] });
          } else {
            setFilters({ ...filters, [filter]: value });
          }
          break;
        case 'parent_process_name':
          if (value.target.value?.length > 16) break;
          setFilters({ ...filters, [filter]: value.target.value });
          break;
        case 'period_from':
        case 'period_to':
          setFilters({ ...filters, [filter]: moment(value).format('yyyy-MM-DD') });
          break;
        case 'version':
          if (isIntegerOrNull(value.target.value) && Number(value.target.value) < 1000) {
            setFilters({ ...filters, [filter]: Number(value.target.value) || null });
          }
          break;
        default:
          setFilters({ ...filters, [filter]: value });
      }
    };
  };

  const handleStart = async (isRun) => {
    if (filters.startup_type === 'AUTO' && !isRun) {
      setApproveModal({ isOpen: true, text: t('ARE_YOU_SURE_YOU_WANT_TO_RUN_THE_PROCEDURE'), handler: handleStart });
      return;
    }
    if (filters.startup_type === 'MANUAL' && !isRun) {
      if (filters.is_certified && filters.period_from && filters.period_to && data) {
        setApproveModal({
          isOpen: true,
          text: data.versions?.includes(filters.version)
            ? t('CONFIRM_OVERWRITING_CERTIFICATION')
            : t('CONFIRM_RUN_CERTIFICATION'),
          handler: handleStart
        });
      } else {
        await handleStart(true);
      }
      return;
    }
    const { error } = await createTask({
      type: filters.startup_type === 'MANUAL' ? 'manual-start' : 'auto-startup/create',
      params: {
        parent_process_name: filters.parent_process_name,
        processes: filters.processes.map((i) => i.value),
        unique_time_series: filters.unique_time_series,
        ...(filters.startup_type === 'MANUAL'
          ? {
              metering_grid_areas: filters.metering_grid_areas.map((i) => i.value),
              period_from: filters.period_from,
              period_to: filters.period_to,
              is_certified: filters.is_certified,
              version: filters.version
            }
          : {
              day: filters.period_type === 'DAY' ? null : filters.day,
              period_type: filters.period_type,
              first_start: moment(filters.first_start).format('HH:mm:00'),
              second_start: filters.second_start && moment(filters.second_start).format('HH:mm:00'),
              metering_grid_areas: filters.metering_grid_areas.map((i) => i.value),
              is_certified: filters.is_certified,
              version: filters.version
            })
      }
    });
    if (!error) {
      if (filters.startup_type === 'MANUAL') {
        dispatch(
          enqueueSnackbar({
            message: t('PROCESS_STARTED_SUCCESSFULLY'),
            options: {
              key: new Date().getTime() + Math.random(),
              variant: 'success',
              autoHideDuration: 5000
            }
          })
        );
      }
      dispatch(mainApi.util.invalidateTags(['PROCESS_MANAGER_REGISTER_LIST']));
    } else if (error?.data?.details === 'Заблоковано розрахунок.') toBlockedTab();
  };

  const handleDelete = ({ id, startup_type }, isRun) => {
    if (startup_type === 'Автоматичний' && !isRun) {
      setApproveModal({
        isOpen: true,
        text: t('DO_YOU_WANT_TO_CANCEEL_AUTOMATIC_PROCEDURE_IN_QUEUE'),
        handler: handleDelete.bind(null, { id, startup_type })
      });
      return;
    }
    deleteTask(id);
  };

  const handleLayout = (type, settingsLayout) =>
    ({
      MANUAL: (
        <>
          <Grid item xs={12} sm={6} md={3} lg={2}>
            <DatePicker
              label={t('FIELDS.PERIOD_FROM')}
              dataMarker={'period_from_settings'}
              onError={setFromDateError}
              value={filters.period_from}
              onChange={handleOnChangeFilters('period_from')}
              minDate={moment('2019-07-01')}
              minDateMessage={t('VERIFY_MSG.MIN_DATE_MESSAGE_WITH_PARAM', { param: '01.07.2019' })}
              maxDate={moment().subtract(1, 'days')}
              error={error?.data?.period_from}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3} lg={2}>
            <DatePicker
              label={t('FIELDS.PERIOD_TO')}
              dataMarker={'period_to_settings'}
              onError={setToDateError}
              value={filters.period_to}
              onChange={handleOnChangeFilters('period_to')}
              minDate={moment(filters.period_from).isValid() ? moment(filters.period_from) : moment('2019-07-01')}
              minDateMessage={
                moment(filters.period_from).isValid()
                  ? t('VERIFY_MSG.DATE_FROM_SHOULD_BE_MORE_THEN_DATE_TO')
                  : t('VERIFY_MSG.MIN_DATE_MESSAGE_WITH_PARAM', { param: '01.07.2019' })
              }
              maxDate={
                moment(filters.period_from).add(31, 'days').isAfter(moment().subtract(1, 'days'))
                  ? moment().subtract(1, 'days')
                  : moment(filters.period_from).add(31, 'days')
              }
              error={error?.data?.period_to}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3} lg={1.5}>
            <SelectField
              label={t('FIELDS.CERTIFIED_DKO')}
              dataMarker={'is_certified'}
              value={filters.is_certified.toString()}
              data={[
                { value: 'true', label: 'Так' },
                { value: 'false', label: 'Ні' }
              ]}
              onChange={(v) => handleOnChangeFilters('is_certified')(v === 'true')}
              error={error?.data?.is_certified}
              disabled={!filters.processes.some((i) => i.value === 'CERTIFICATION_TS')}
              ignoreI18
            />
          </Grid>
          {filters.is_certified && (
            <Grid item xs={12} sm={6} md={2}>
              <StyledInput
                label={t('FIELDS.CERTIFICATION_NUMBER')}
                dataMarker={'version_settings'}
                value={filters.version}
                onChange={handleOnChangeFilters('version')}
                error={error?.data?.version}
                disabled={isFetching || Boolean(fromDateError) || Boolean(toDateError)}
                endAdornment={
                  isFetching && (
                    <InputAdornment position="start" sx={{ pr: 1 }}>
                      <CircularProgress size={24} />
                    </InputAdornment>
                  )
                }
              />
            </Grid>
          )}
          <Grid item xs={12} sm={6} md={3}>
            <MultiSelect
              label={t('FIELDS.EIC_Y')}
              value={filters.metering_grid_areas}
              list={filters.metering_grid_area_list}
              onChange={handleOnChangeFilters('metering_grid_areas')}
              error={error?.data?.metering_grid_areas}
              sx={{
                input: {
                  padding: '12px 24px 12px 12px'
                },
                label: {
                  transform: 'translate(14px, 12px) scale(1)'
                }
              }}
              ignoreI18
              dataMarker={'metering_grid_areas'}
            />
          </Grid>
        </>
      ),
      AUTO: (
        <>
          <Grid item xs={12} sm={6} md={2}>
            <SelectField
              label={t('FIELDS.PERIOD')}
              dataMarker={'period_type_settings'}
              value={filters.period_type}
              data={settingsLayout.period_type || [{ label: t('FIELDS.DECADE'), value: 'DECADE' }]}
              onChange={handleOnChangeFilters('period_type')}
              error={error?.data?.period_type}
              ignoreI18
            />
          </Grid>
          {filters.period_type !== 'DAY' && (
            <Grid item xs={12} sm={6} md={1}>
              <SelectField
                label={t('FIELDS.DAY_NUMBER')}
                dataMarker={'day_settings'}
                value={filters.day}
                data={settingsLayout[filters.period_type]?.day || [{ label: '1', value: '1' }]}
                onChange={handleOnChangeFilters('day')}
                error={error?.data?.day}
                ignoreI18
              />
            </Grid>
          )}
          <Grid item xs={12} sm={6} md={2}>
            <TimePicker
              label={t('FIELDS.STARTUP_TIME_WITH_PARAM', { param: 1 })}
              data-marker={'first_start_settings'}
              value={filters.first_start}
              onChange={handleOnChangeFilters('first_start')}
              error={error?.data?.first_start}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <TimePicker
              label={t('FIELDS.STARTUP_TIME_WITH_PARAM', { param: 2 })}
              clearable
              data-marker={'second_start_settings'}
              value={filters.second_start}
              onChange={handleOnChangeFilters('second_start')}
              error={error?.data?.second_start}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <StyledInput
              label={t('FIELDS.AGGREGATION_PERIOD')}
              value={settingsLayout[filters.period_type]?.period}
              readOnly
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3} lg={1.5}>
            <SelectField
              label={t('FIELDS.CERTIFIED_DKO')}
              dataMarker={'is_certified'}
              value={filters.is_certified.toString()}
              data={[
                { value: 'true', label: 'Так' },
                { value: 'false', label: 'Ні' }
              ]}
              onChange={(v) => handleOnChangeFilters('is_certified')(v === 'true')}
              error={error?.data?.is_certified}
              disabled={!filters.processes.some((i) => i.value === 'SEND_DKO_2_MMS')}
              ignoreI18
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <MultiSelect
              label={t('FIELDS.EIC_Y')}
              value={filters.metering_grid_areas}
              list={filters.metering_grid_area_list}
              onChange={handleOnChangeFilters('metering_grid_areas')}
              error={error?.data?.metering_grid_areas}
              sx={{
                input: {
                  padding: '12px 24px 12px 12px'
                },
                label: {
                  transform: 'translate(14px, 12px) scale(1)'
                }
              }}
              ignoreI18
              dataMarker={'metering_grid_areas'}
            />
          </Grid>
          {filters.is_certified && (
            <Grid item xs={12} sm={6} md={2}>
              <StyledInput
                label={t('FIELDS.CERTIFICATION_NUMBER')}
                dataMarker={'version_settings'}
                value={filters.version}
                onChange={handleOnChangeFilters('version')}
                error={error?.data?.version}
                disabled={isFetching || Boolean(fromDateError) || Boolean(toDateError)}
                endAdornment={
                  isFetching && (
                    <InputAdornment position="start" sx={{ pr: 1 }}>
                      <CircularProgress size={24} />
                    </InputAdornment>
                  )
                }
              />
            </Grid>
          )}
        </>
      )
    }[type]);

  return (
    <>
      <section className={classes.table}>
        <h4 className={classes.tableHeader}>{t('STARTUP_SETTINGS')}</h4>
        <div className={classes.tableBody}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <SelectField
                label={t('FIELDS.STARTUP_MODE')}
                dataMarker={'startup_type'}
                value={filters.startup_type}
                data={settings?.startup_type || [{ value: 'MANUAL', label: t('MANUAL') }]}
                onChange={handleOnChangeFilters('startup_type')}
                error={error?.data?.startup_type}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <MultiSelect
                label={t('FIELDS.PROCESS_BEFORE_START')}
                value={filters.processes}
                list={
                  settings?.processes || [
                    {
                      value: 'AGGREGATE_DATA_BY_GROUP_A',
                      label: t('AGGREGATE_DATA_BY_GROUP_A')
                    }
                  ]
                }
                onChange={handleOnChangeFilters('processes')}
                error={error?.data?.processes}
                dataMarker={'process_settings'}
                sx={{
                  input: {
                    padding: '12px 24px 12px 12px'
                  },
                  label: {
                    transform: 'translate(14px, 12px) scale(1)'
                  }
                }}
                ignoreI18
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2.5}>
              <StyledInput
                label={t('FIELDS.PARENT_PROCESS_NAME')}
                value={filters.parent_process_name}
                onChange={handleOnChangeFilters('parent_process_name')}
                error={error?.data?.parent_process_name}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2.5}>
              <SelectField
                label={t('FIELDS.UNIQUE_TIME_SERIES')}
                dataMarker={'unique_time_series'}
                value={filters.unique_time_series.toString()}
                data={[
                  { value: 'true', label: 'ON' },
                  { value: 'false', label: 'OFF' }
                ]}
                onChange={(v) => handleOnChangeFilters('unique_time_series')(v === 'true')}
                error={error?.data?.unique_time_series}
              />
            </Grid>
          </Grid>
        </div>
        <div className={classes.tableBody}>
          <Grid container spacing={2}>
            {settings && handleLayout(filters.startup_type, settings?.[filters.startup_type] || {})}
            <Box sx={{ flexGrow: 1 }} />
            <Grid item xs={12} sm={'auto'} style={{ textAlign: 'right' }}>
              <CircleButton
                type={isFetching ? 'loading' : 'create'}
                title={t('CONTROLS.START_PROCESS')}
                color={'green'}
                dataMarker={'start'}
                disabled={isFetching}
                onClick={() => handleStart()}
              />
            </Grid>
          </Grid>
        </div>
      </section>
      <Table params={params} setParams={setParams} handleDelete={handleDelete} settings={settings} />
      <CancelModal
        text={approveModal.text}
        open={approveModal.isOpen}
        submitType={'green'}
        onClose={() => setApproveModal((prev) => ({ ...prev, isOpen: false }))}
        onSubmit={() => {
          approveModal.handler(true);
          setApproveModal((prev) => ({ ...prev, isOpen: false }));
        }}
      />
    </>
  );
};

export default TasksTab;
