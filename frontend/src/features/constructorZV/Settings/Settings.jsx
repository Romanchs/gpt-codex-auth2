import {AutocompleteWithChips} from "../../../Components/Theme/Fields/AutocompleteWithChips";
import {Card} from "../../../Components/Theme/Components/Card";
import SettingsTable from "./SettingsTable";
import {useEffect, useRef, useState} from "react";
import CancelModal from "../../../Components/Modal/CancelModal";
import moment from "moment/moment";
import Grid from "@mui/material/Grid";
import DatePicker from "../../../Components/Theme/Fields/DatePicker";
import SelectField from "../../../Components/Theme/Fields/SelectField";
import TimePicker from "../../../Components/Theme/Fields/TimePicker";
import StyledInput from "../../../Components/Theme/Fields/StyledInput";
import CircleButton from "../../../Components/Theme/Buttons/CircleButton";
import {
  usePmDeleteTaskMutation,
  usePmSettingsQuery,
  usePmStartMutation,
  usePmZVQuery
} from "../api";
import {enqueueSnackbar} from "../../../actions/notistackActions";
import {useDispatch} from "react-redux";
import {mainApi} from "../../../app/mainApi";
import { useTranslation } from "react-i18next";
import useRefreshDataLog from "../../../services/actionsLog/useRefreshDataLog";
import useDeleteDataLog from "../../../services/actionsLog/useDeleteDataLog";
import { CONSTRUCTOR_ZV_LOG_TAGS } from "../../../services/actionsLog/constants";

const defaultParams = {page: 1, size: 150, name: ''};

const initialSettings = {
  name: '',
  startup_type: 'MANUAL',

  period_from: null,
  period_to: null,

  period_type: 'DECADE',
  day: 1,
  first_start: moment(),
  second_start: moment(),
  zv_eics: []
};

const Settings = ({params, setParams}) => {
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const timeout = useRef(null);
  const [settings, setSettings] = useState(initialSettings);
  const [confirmModal, setConfirmModal] = useState({
    open: false,
    text: t('ARE_U_SURE_U_WANT_TO_RUN_THE_PROCEDURE')
  });
  const [paramsZV, setParamsZV] = useState(defaultParams);
  const [reusedValue, setReusedValue] = useState([]);

  const {data: selectZV, isFetching: isLoadingZV} = usePmZVQuery(paramsZV);
  const {data: settingsData} = usePmSettingsQuery();
  const [createTask, {error}] = usePmStartMutation({fixedCacheKey: 'PmStart_createTask'});
  const [deleteTask] = usePmDeleteTaskMutation({fixedCacheKey: 'PmDelete_task'});
  const refreshDataLog = useRefreshDataLog(CONSTRUCTOR_ZV_LOG_TAGS);
  const deleteDataLog = useDeleteDataLog(CONSTRUCTOR_ZV_LOG_TAGS);

  useEffect(() => {
    if (!settingsData) return;
    const time1 = settingsData.AUTO?.[initialSettings.period_type]?.first_start?.split(':'),
      time2 = settingsData.AUTO?.[initialSettings.period_type]?.second_start?.split(':');

    setSettings(prev => ({
      ...prev,
      period_from: settingsData.MANUAL?.period_from,
      period_to: settingsData.MANUAL?.period_to,
      first_start: moment().set({'hour': time1[0], 'minute': time1[1]}),
      second_start: moment().set({'hour': time2[0], 'minute': time2[1]})
    }));
  }, [settingsData]);

  const handleOnChangeSettings = (setting) => {
    return (value) => {
      switch (setting) {
        case 'period_type': {
          const time1 = settingsData.AUTO?.[value]?.first_start?.split(':'),
            time2 = settingsData.AUTO?.[value]?.second_start?.split(':');
          setSettings({
            ...settings, [setting]: value, day: 1,
            first_start: moment().set({'hour': time1[0], 'minute': time1[1]}),
            second_start: moment().set({'hour': time2[0], 'minute': time2[1]})
          });
          break;
        }
        case 'name':
          setSettings({...settings, [setting]: value.target.value});
          break;
        case 'period_from':
        case 'period_to':
          setSettings({...settings, [setting]: moment(value).format('yyyy-MM-DD')});
          break;
        case 'zv_eics':
          setSettings({...settings, [setting]: value.map(i => i.value)});
          break;
        default:
          setSettings({...settings, [setting]: value});
      }
    };
  };

  const handleConfirm = async (isRun) => {
    if (settings.startup_type === 'MANUAL' && !isRun) {
      setConfirmModal({open: true, text: t('ARE_U_SURE_U_WANT_TO_RUN_THE_PROCEDURE'), handler: handleConfirm});
      return;
    }
    if (settings.startup_type === 'AUTO' && !isRun) {
      setConfirmModal({open: true, text: t('ARE_U_SURE_U_WANT_TO_SAVE_SETTINGS'), handler: handleConfirm});
      return;
    }
    refreshDataLog();
    const {error} = await createTask({
      type: settings.startup_type === 'MANUAL' ? 'manual-start' : 'auto-startup/create',
      body: {
        name: settings.name,
        zv_eics: settings.zv_eics,
        ...(settings.startup_type === 'MANUAL' ? {
          period_from: settings.period_from,
          period_to: settings.period_to
        } : {
          day: settings.period_type === 'DAY' ? null : settings.day,
          period_type: settings.period_type,
          first_start: moment(settings.first_start).format('HH:mm:00'),
          second_start: moment(settings.second_start).format('HH:mm:00')
        })
      }
    });
    if(!error) {
      if(settings.startup_type === 'MANUAL') {
        dispatch(enqueueSnackbar({
          message: t('PROCESS_STARTED_SUCCESSFULLY'),
          options: {
            key: new Date().getTime() + Math.random(),
            variant: 'success',
            autoHideDuration: 5000
          }
        }));
      } else if(settings.startup_type === 'AUTO') {
        dispatch(enqueueSnackbar({
          message: t('PROCESS_SAVED_SUCCESSFULLY'),
          options: {
            key: new Date().getTime() + Math.random(),
            variant: 'success',
            autoHideDuration: 5000
          }
        }));
        dispatch(mainApi.util.invalidateTags(['PM-LIST']));
      }
    }
  };

  const handleDelete = ({id, startup_type}, isRun) => {
    if (startup_type === t('AUTO') && !isRun) {
      setConfirmModal({
        open: true,
        text: t('ARE_U_SURE_U_WANT_TO_DELETE_THE_SCHEDULED_TASK'),
        handler: handleDelete.bind(null, {id, startup_type})
      });
      return;
    }
    deleteTask(id);
    deleteDataLog();
  };

  const handleInputValue = (value) => {
    if(value && value.length < 2) return;
    clearTimeout(timeout.current);
    timeout.current = setTimeout(() => {
      setParamsZV({...paramsZV, name: value});
    }, 500);
  };

  const handleLayout = (type, settingsLayout) => ({
    MANUAL: (
      <>
        <Grid item xs={12} sm={6} md={2}>
          <DatePicker
            label={t('FIELDS.PERIOD_FROM')}
            dataMarker={'period_from_settings'}
            value={settings.period_from}
            onChange={handleOnChangeSettings('period_from')}
            minDate={moment('2019-07-01')}
            minDateMessage={t('VERIFY_MSG.MIN_DATE_MESSAGE_WITH_PARAM', {param: '01.07.2019'})}
            maxDate={moment().subtract(1, 'days')}
            error={error?.data?.period_from}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <DatePicker
            label={t('FIELDS.PERIOD_TO')}
            dataMarker={'period_to_settings'}
            value={settings.period_to}
            onChange={handleOnChangeSettings('period_to')}
            minDate={moment('2019-07-01')}
            minDateMessage={t('VERIFY_MSG.MIN_DATE_MESSAGE_WITH_PARAM', {param: '01.07.2019'})}
            maxDate={moment().subtract(1, 'days')}
            error={error?.data?.period_to}
          />
        </Grid>
      </>
    ),
    AUTO: (
      <>
        <Grid item xs={12} sm={6} md={1.5}>
          <SelectField
            label={t('FIELDS.PERIOD')}
            dataMarker={'period_type_settings'}
            value={settings.period_type}
            data={settingsLayout.period_type || [{label: t('FIELDS.DECADE'), value: 'DECADE'}]}
            onChange={handleOnChangeSettings('period_type')}
            error={error?.data?.period_type}
          />
        </Grid>
        {settings.period_type !== 'DAY' && (
          <Grid item xs={12} sm={6} md={1}>
            <SelectField
              label={t('FIELDS.DAY_NUMBER')}
              datamarker={'day_settings'}
              value={settings.day}
              data={settingsLayout[settings.period_type]?.day || [{label: '1', value: '1'}]}
              onChange={handleOnChangeSettings('day')}
              error={error?.data?.day}
            />
          </Grid>
        )}
        <Grid item xs={12} sm={6} md={1}>
          <TimePicker
            label={t('FIELDS.STARTUP_TIME_WITH_PARAM', {param: 1})}
            datamarker={'first_start_settings'}
            value={settings.first_start}
            onChange={handleOnChangeSettings('first_start')}
            error={error?.data?.first_start}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={1}>
          <TimePicker
            label={t('FIELDS.STARTUP_TIME_WITH_PARAM', {param: 2})}
            datamarker={'second_start_settings'}
            value={settings.second_start}
            onChange={handleOnChangeSettings('second_start')}
            error={error?.data?.second_start}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={1.5}>
          <StyledInput
            label={t('FIELDS.AGGREGATION_PERIOD')}
            value={settingsLayout[settings.period_type]?.period}
            readOnly
          />
        </Grid>
      </>
    )
  })[type];

  return (
    <>
      <Card title={t('STARTUP_SETTINGS')}>
        <AutocompleteWithChips
          options={selectZV}
          reusedValue={reusedValue}
          nameKey={'properties'}
          label={t('FIELDS.CHOICE_OF_ZV')}
          isLoading={isLoadingZV}
          textNoMoreOption={t('THERE_ARE_NO_ZVs_TO_CHOOSE_FROM')}
          handleChange={handleOnChangeSettings('zv_eics')}
          getInputValue={handleInputValue}
          error={error?.data?.zv_eics}
        />
        <Grid container spacing={3} sx={{mt: 1}}>
          <Grid item xs={12} sm={6} md={3}>
            <StyledInput
              label={t('FIELDS.AGREGATION_NAME')}
              value={settings.name}
              onChange={handleOnChangeSettings('name')}
              max={250}
              error={error?.data?.name}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <SelectField
              label={t('FIELDS.STARTUP_MODE')}
              value={settings.startup_type}
              data={settingsData?.startup_type || [{value: 'MANUAL', label: t('MANUAL')}]}
              onChange={handleOnChangeSettings('startup_type')}
            />
          </Grid>
          {settingsData && handleLayout(settings.startup_type, settingsData?.[settings.startup_type] || {})}
          {settings.startup_type === 'MANUAL'
            ? (
              <Grid item xs={12} sm={6} md={3} sx={{textAlign: 'right'}}>
                <CircleButton
                  type={'create'}
                  title={t('CONTROLS.START')}
                  dataMarker={'start'}
                  onClick={() => handleConfirm()}
                />
              </Grid>
            )
            : (
              <Grid item xs={12} sm={6} md={settings.period_type === 'DAY' ? 2 : 1} sx={{textAlign: 'right'}}>
                <CircleButton
                  type={'save'}
                  title={t('CONTROLS.SAVE')}
                  dataMarker={'save'}
                  onClick={() => handleConfirm()}
                />
              </Grid>
            )
          }
        </Grid>
      </Card>
      <SettingsTable
        settingsData={settingsData}
        settings={settings}
        setSettings={setSettings}
        params={params}
        setParams={setParams}
        handleDelete={handleDelete}
        setReusedValue={setReusedValue}
      />
      <CancelModal
        minWidth={380}
        text={confirmModal.text}
        open={confirmModal.open}
        submitType={'green'}
        onClose={() => setConfirmModal({...confirmModal, open: false})}
        onSubmit={() => {
          confirmModal.handler(true);
          setConfirmModal(prev => ({...prev, open: false}));
        }}
      />
    </>
  );
}

export default Settings;