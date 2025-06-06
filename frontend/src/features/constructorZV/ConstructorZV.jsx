import Page from '../../Components/Global/Page';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { DHTab, DHTabs } from '../../Components/pages/Processes/Components/Tabs';
import CreateZV from './CreateZV/CreateZV';
import CircleButton from '../../Components/Theme/Buttons/CircleButton';
import Settings from './Settings/Settings';
import Register from './Register/Register';
import { usePmDeleteTaskMutation, usePmStartMutation, useUpdateZvGroupMutation, useZvGroupMutation } from './api';
import { mainApi } from '../../app/mainApi';
import { useTranslation } from 'react-i18next';
import useCancelProcessLog from '../../services/actionsLog/useCancelProcessLog';
import useSearchLog from '../../services/actionsLog/useSearchLog';
import { CONSTRUCTOR_ZV_LOG_TAGS } from '../../services/actionsLog/constants';

const defaultParams = { page: 1, size: 25 };

const initialAggregation = {
  name: '',
  properties: [],
  aggregation_type: ''
};


const ConstructorZV = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { search } = useLocation();
  const tabParams = new URLSearchParams(search).get('tab');
  const [tab, setTab] = useState(tabParams || 'create');
  const [aggregation, setAggregation] = useState(initialAggregation);
  const [clearProperties, setClearProperties] = useState({});

  const [paramsCreateTab, setParamsCreateTab] = useState(defaultParams);
  const [paramsSettingsTab, setParamsSettingsTab] = useState(defaultParams);
  const [paramsRegisterTab, setParamsRegisterTab] = useState(defaultParams);

  const { isFetching: isLoadingGroups } = mainApi.endpoints.zvGroups.useQueryState(paramsCreateTab);
  const [create, { error: createError, isLoading: isCreatingZvGroup }] = useZvGroupMutation();
  const { isFetching: isLoadingTasks } = mainApi.endpoints.pmTasks.useQueryState(paramsSettingsTab);
  const [, { isLoading: isCreatingPm }] = usePmStartMutation({ fixedCacheKey: 'PmStart_createTask' });
  const [, { isLoading: isDeletingPm }] = usePmDeleteTaskMutation({ fixedCacheKey: 'PmDelete_task' });
  const [, { isLoading: isUpdatingZvGroup, error: updateNameError, reset }] = useUpdateZvGroupMutation({
    fixedCacheKey: 'Update_zv_group'
  });
  const { isFetching: isLoadingRegister } = mainApi.endpoints.processes.useQueryState(paramsRegisterTab);
  const cancelProcessLog = useCancelProcessLog(CONSTRUCTOR_ZV_LOG_TAGS);
  const searchLog = useSearchLog(CONSTRUCTOR_ZV_LOG_TAGS);

  const handleChangeTab = (...args) => {
    setTab(args[1]);
    navigate('?tab=' + args[1]);
    if (args[1] === 'create') {
      setParamsCreateTab(defaultParams);
    } else if (args[1] === 'settings') {
      setParamsSettingsTab(defaultParams);
    } else if (args[1] === 'register') {
      setParamsRegisterTab(defaultParams);
    }
  };

  useEffect(() => {
    return reset();
  }, []);

  const clearForm = () => {
    clearProperties.onClick();
    setAggregation(initialAggregation);
    reset();
  };

  const handleClear = () => {
    clearForm();
    cancelProcessLog();
  };

  const handleCreate = () => {
    create(aggregation).then((res) => {
      if (!res?.error) clearForm();
    });
    searchLog();
  };

  return (
    <Page
      acceptPermisions={'CONSTRUCTOR_ZV.ACCESS'}
      acceptRoles={['АКО_Процеси']}
      pageName={t('PAGES.CONSTRUCTOR_ZV')}
      backRoute={'/'}
      loading={
        isCreatingZvGroup ||
        isLoadingTasks ||
        isLoadingGroups ||
        isCreatingPm ||
        isDeletingPm ||
        isLoadingRegister ||
        isUpdatingZvGroup
      }
      controls={
        tab === 'create' && (
          <>
            <CircleButton
              type={'remove'}
              title={t('CONTROLS.UNDO')}
              onClick={handleClear}
              disabled={JSON.stringify(aggregation) === JSON.stringify(initialAggregation)}
            />
            <CircleButton
              type={'new'}
              title={t('CONTROLS.GENERATE')}
              onClick={handleCreate}
              disabled={aggregation.name === '' || aggregation.aggregation_type === ''}
            />
          </>
        )
      }
    >
      <div className={'boxShadow'} style={{ paddingLeft: 24, paddingRight: 24, marginBottom: 16 }}>
        <DHTabs value={tab} onChange={handleChangeTab}>
          <DHTab label={t('CREATING_ZV')} value={'create'} />
          <DHTab label={t('STARTUP_SETTINGS')} value={'settings'} />
          <DHTab label={t('REGISTES')} value={'register'} />
        </DHTabs>
      </div>
      {tab === 'create' && (
        <CreateZV
          params={paramsCreateTab}
          setParams={setParamsCreateTab}
          aggregation={aggregation}
          setAggregation={setAggregation}
          error={createError || updateNameError}
          setClearProperties={setClearProperties}
        />
      )}
      {tab === 'settings' && <Settings params={paramsSettingsTab} setParams={setParamsSettingsTab} />}
      {tab === 'register' && <Register params={paramsRegisterTab} setParams={setParamsRegisterTab} />}
    </Page>
  );
};

export default ConstructorZV;
