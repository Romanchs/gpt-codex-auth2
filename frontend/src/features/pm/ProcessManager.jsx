import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Page from '../../Components/Global/Page';
import { DHTab, DHTabs } from '../../Components/pages/Processes/Components/Tabs';
import CircleButton from '../../Components/Theme/Buttons/CircleButton';
import { useCreateProcessManagerMutation, useDeleteProcessManagerMutation } from './Tasks/api';
import { useLazyDownloadPMZVQuery, useUpdateLockGlobalPMZVMutation, useUpdatePointsPMZVMutation } from './ZV/api';
import { useLazyDownloadPMZQuery, useUpdateLockGlobalPMZMutation, useUpdatePointsPMZMutation } from './Z/api';
import { useLockPMBlockedMutation } from './СalculationsBlocked/api';
import {
  useLazyDownloadRegisterQuery,
  useLazyDownloadSendingDkoQuery,
  useUpdateSendingDkoMutation
} from './SendingDko/api';
import { useDownloadBlockedSendingDkoMutation, useUpdateBlockedSendingDkoMutation } from './BlockedSendingDko/api';
import TasksTab from './Tasks/TasksTab';
import RegisterTab from './Register/RegisterTab';
import ZVTab from './ZV/ZVTab';
import ZTab from './Z/ZTab';
import СalculationsBlockedTab from './СalculationsBlocked/СalculationsBlockedTab';
import SendingDkoTab from './SendingDko/SendingDkoTab';
import BlockedSendingDkoTab from './BlockedSendingDko/BlockedSendingDkoTab';
import ArchivingTab from './Archiving/ArchivingTab';
import CorrectionTab from './Correction/CorrectionTab';
import { useTranslation } from 'react-i18next';
import useExportFileLog from '../../services/actionsLog/useEportFileLog';

export const PROCESS_MANAGER_ACCEPT_ROLES = ['АКО_Процеси'];

const ProcessManager = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [tab, setTab] = useState(window.location.search.split('?tab=')?.[1] || 'tasks');
  const [, { isLoading: isCreating }] = useCreateProcessManagerMutation({ fixedCacheKey: 'processManager_createTask' });
  const [, { isLoading: isDeleting }] = useDeleteProcessManagerMutation({ fixedCacheKey: 'processManager_deleteTask' });

  const [, { isLoading: isLockZVUpdate }] = useUpdateLockGlobalPMZVMutation({ fixedCacheKey: 'PMZV_updateLock' });
  const [, { isLoading: isPointsZVUpdate }] = useUpdatePointsPMZVMutation({ fixedCacheKey: 'PMZV_updatePoints' });
  const [, { isLoading: isLockZUpdate }] = useUpdateLockGlobalPMZMutation({ fixedCacheKey: 'PMZ_updateLock' });
  const [, { isLoading: isPointsZUpdate }] = useUpdatePointsPMZMutation({ fixedCacheKey: 'PMZ_updatePoints' });
  const [, { isLoading: isBlockedUpdate }] = useLockPMBlockedMutation({ fixedCacheKey: 'PMBlocked_update' });
  const [, { isLoading: isSettingDko }] = useUpdateSendingDkoMutation({ fixedCacheKey: 'SendingDKO_update' });
  const [, { isLoading: isBlockedSettingDko }] = useUpdateBlockedSendingDkoMutation({
    fixedCacheKey: 'BlockedSendingDKO_update'
  });

  const queries = useSelector((store) =>
    Object.values(store.mainApi.queries).filter(
      (q) =>
        q.endpointName === 'getListPMZV' ||
        q.endpointName === 'getListPMZ' ||
        q.endpointName === 'getListPMBlocked' ||
        q.endpointName === 'initSendingDko' ||
        q.endpointName === 'blockedSendingDko' ||
        q.endpointName === 'getListPM' ||
        q.endpointName === 'getDataProcessManager' ||
        q.endpointName === 'pmArchivingTS' ||
        q.endpointName === 'pmCorrectionTS'
    )
  );
  const isFetching = Boolean(queries.find((q) => q.status === 'pending'));

  const [donwloadZ] = useLazyDownloadPMZQuery();
  const [donwloadZV] = useLazyDownloadPMZVQuery();
  const [donwloadSendingDko, { isLoading: sendingDkoloading }] = useLazyDownloadSendingDkoQuery();
  const [donwloadRegister, { isLoading: registerloading }] = useLazyDownloadRegisterQuery();
  const [donwloadBlockedSendingDko, { isLoading: blockedSendingDkoloading }] = useDownloadBlockedSendingDkoMutation();

  const exportFileLog = useExportFileLog(['Менеджер процесів']);

  const handleChangeTab = (...args) => {
    setTab(args[1]);
    navigate('?tab=' + args[1]);
  };

  const handleDownload = () => {
    if (tab === 'z') {
      donwloadZ(t('FILENAMES.EXPORT_UNLOCKED_TKO_Z_xlsx'));
    } else if (tab === 'zv') {
      donwloadZV(t('FILENAMES.EXPORT_UNLOCKED_TKO_ZV_xlsx'));
    } else if (tab === 'sendingDko') {
      donwloadSendingDko(t('AGGREGATION_PAGE_CONFIGURATION_LOG_xlsx'));
    }
    exportFileLog();
  };

  return (
    <Page
      acceptPermisions={'PROCESS_MANAGER.ACCESS'}
      acceptRoles={PROCESS_MANAGER_ACCEPT_ROLES}
      faqKey={'INFORMATION_BASE__PROCESS_MANAGER'}
      pageName={isFetching ? `${t('LOADING')}...` : t('PAGES.PROCESS_MANAGER')}
      backRoute={'/'}
      loading={
        isFetching ||
        isCreating ||
        isDeleting ||
        isLockZVUpdate ||
        isPointsZVUpdate ||
        isLockZUpdate ||
        isPointsZUpdate ||
        isBlockedUpdate ||
        isSettingDko ||
        isBlockedSettingDko
      }
      controls={
        <>
          {(tab === 'zv' || tab === 'z' || tab === 'sendingDko') && (
            <CircleButton
              type={'download'}
              title={t('CONTROLS.DOWNLOAD')}
              onClick={handleDownload}
              disabled={sendingDkoloading}
            />
          )}
          {tab === 'register' && (
            <CircleButton
              type={'download'}
              title={t('CONTROLS.DOWNLOAD')}
              onClick={() => {
                donwloadRegister();
                exportFileLog();
              }}
              disabled={registerloading}
            />
          )}
          {tab === 'blockedSendingDko' && (
            <CircleButton
              type={'download'}
              title={t('CONTROLS.GENERATE_REPORT')}
              onClick={() => {
                donwloadBlockedSendingDko();
                exportFileLog();
              }}
              disabled={blockedSendingDkoloading}
            />
          )}
        </>
      }
    >
      <div className={'boxShadow'} style={{ paddingLeft: 24, paddingRight: 24, marginBottom: 16 }}>
        <DHTabs value={tab} onChange={handleChangeTab}>
          <DHTab label={t('STARTING_PROCESSES')} value={'tasks'} />
          <DHTab label={t('REGISTES')} value={'register'} />
          <DHTab label={t('ADMIN_ZV')} value={'zv'} />
          <DHTab label={t('ADMIN_Z')} value={'z'} />
          <DHTab label={t('BLOCK_PAYMENTS')} value={'calculationsBlocked'} />
          <DHTab label={t('SETTING_DKO')} value={'sendingDko'} />
          <DHTab label={t('BLOCKED_SETTING_DKO')} value={'blockedSendingDko'} />
          <DHTab label={t('ARCHIVING_TS')} value={'archiving'} />
          <DHTab label={t('CORRECTION_TS')} value={'correction'} />
        </DHTabs>
      </div>
      {tab === 'tasks' && <TasksTab toBlockedTab={() => setTab('calculationsBlocked')} />}
      {tab === 'register' && <RegisterTab />}
      {tab === 'zv' && <ZVTab />}
      {tab === 'z' && <ZTab />}
      {tab === 'calculationsBlocked' && <СalculationsBlockedTab />}
      {tab === 'sendingDko' && <SendingDkoTab />}
      {tab === 'blockedSendingDko' && <BlockedSendingDkoTab />}
      {tab === 'archiving' && <ArchivingTab />}
      {tab === 'correction' && <CorrectionTab />}
    </Page>
  );
};

export default ProcessManager;
