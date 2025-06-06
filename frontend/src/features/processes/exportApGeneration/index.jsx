import VpnKeyRoundedIcon from '@mui/icons-material/VpnKeyRounded';
import NoteAddRounded from '@mui/icons-material/NoteAddRounded';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import Page from '../../../Components/Global/Page';
import CircleButton from '../../../Components/Theme/Buttons/CircleButton';
import Statuses from '../../../Components/Theme/Components/Statuses';
import DetailsTab from './DetailsTab';
import RequestsTab from './RequestsTab';
import {
  useCreateExportApGenMutation,
  useExportApGenQuery,
  useExportApGenUploadMutation,
  useUpdateExportApGenMutation
} from './api';
import { DHTab, DHTabs2 } from '../../../Components/pages/Processes/Components/Tabs';
import ImportModal from './ImportModal';
import { mainApi } from '../../../app/mainApi';
import DelegateBtn from '../../delegate/delegateBtn';
import { enqueueSnackbar } from '../../../actions/notistackActions';
import { useTranslation } from 'react-i18next';

const tabs = ['files', 'subprocesses'];

export const EXPORT_AP_GENERATION_ACCEPT_ROLES = ['СВБ', 'АКО_Процеси'];

const ExportApGeneration = () => {
  const {t} = useTranslation();
  const { uid } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [tab, setTab] = useState(tabs[0]);
  const [initProcess, { isLoading }] = useCreateExportApGenMutation();
  const {
    currentData: data,
    isFetching,
    isError,
    isUninitialized
  } = useExportApGenQuery(
    {
      uid,
      tab
    },
    { skip: !uid }
  );
  const [, { isLoading: isUploading }] = useExportApGenUploadMutation({ fixedCacheKey: 'exportApGen_upload' });
  const [update, { isLoading: isUpdating }] = useUpdateExportApGenMutation();
  const [delegating, setDelegating] = useState(false);

  const loading = isLoading || isFetching || isUploading || isUpdating || delegating;
  const hideSecondTab = !uid || data?.status === 'IN_PROCESS' || (loading && tab !== tabs[1]);

  useEffect(() => {
    if (isUninitialized && !uid) {
      dispatch(mainApi.util.invalidateTags(['EXPORT_AP_GEN']));
      setTab(tabs[0]);
    }
  }, [uid, isUninitialized, dispatch]);

  const handleCreate = () => {
    initProcess().then((res) => {
      if (res?.data?.uid) {
        navigate(res.data.uid, { replace: true });
      }
    });
  };

  const handleForm = () => {
    // if (!data?.can_formed) {
    //   refetch();
    //   const newData = await mainApi.util.getRunningOperationPromise('exportApGen', { uid, tab });
    //   if (!newData?.data?.can_formed) {
    //     dispatch(
    //       enqueueSnackbar({
    //         message: t('NOTIFICATIONS.IMPOSSIBLE_TO_FORM_APPLICATION'),
    //         options: {
    //           key: new Date().getTime() + Math.random(),
    //           variant: 'warning',
    //           autoHideDuration: 5000
    //         }
    //       })
    //     );
    //     return;
    //   }
    // }
    update({
      uid,
      type: 'formed'
    });
  };

  const handleSign = async () => {
    const { error } = await update({
      uid,
      type: 'sign',
      method: 'GET'
    });
    if (!error) {
      dispatch(
        enqueueSnackbar({
          message: t('SIGNING_PROCESS_STARTED'),
          options: {
            key: new Date().getTime() + Math.random(),
            variant: 'success',
            autoHideDuration: 5000
          }
        })
      );
    }
  };

  return (
    <Page
      acceptPermisions={uid ? 'PROCESSES.EXPORT_AP_GENERATION.ACCESS' : 'PROCESSES.EXPORT_AP_GENERATION.INITIALIZATION'}
      acceptRoles={EXPORT_AP_GENERATION_ACCEPT_ROLES}
      pageName={data?.id ? t('PAGES.EXPORT_AP_GENERATION_ID', {id: data?.id}) : t('PAGES.EXPORT_AP_GENERATION')}
      backRoute={'/processes'}
      faqKey={'PROCESSES__EXPORT_AP_GENERATION'}
      loading={loading}
      notFoundMessage={isError && t('PROCESS_NOT_FOUND')}
      controls={
        <>
          {!uid && <CircleButton type={'create'} title={t('CONTROLS.TAKE_TO_WORK')} onClick={handleCreate} />}
          {data?.can_upload && <ImportModal />}
          {data?.can_formed && (
            <CircleButton
              icon={<NoteAddRounded />}
              color={'green'}
              title={t('CONTROLS.FORM')}
              dataMarker={'forming'}
              onClick={handleForm}
            />
          )}
          {tab === tabs[0] && data?.can_done && (
            <CircleButton
              icon={<VpnKeyRoundedIcon />}
              color={'blue'}
              title={t('CONTROLS.SIGN_FILE')}
              dataMarker={'sign_file'}
              onClick={handleSign}
            />
          )}
          {data?.can_delegate && (
            <DelegateBtn
              process_uid={uid}
              onStarted={() => setDelegating(true)}
              onFinished={() => setDelegating(false)}
              onSuccess={() => window.location.reload()}
            />
          )}
        </>
      }
    >
      <Statuses
        statuses={['NEW', 'IN_PROCESS', 'FORMED', 'PARTIALLY_DONE', 'DONE', 'CANCELED']}
        currentStatus={loading ? '' : data?.status || 'NEW'}
      />
      <DHTabs2 value={tab} onChange={(...args) => setTab(args[1])} sx={{ marginTop: 16 }}>
        <DHTab label={t('REQUEST_DETAILS')} value={tabs[0]} />
        <DHTab label={hideSecondTab ? '' : t('OUTBOUND_REQUESTS')} value={tabs[1]} disabled={hideSecondTab} />
      </DHTabs2>
      {tab === tabs[0] && <DetailsTab />}
      {tab === tabs[1] && <RequestsTab />}
    </Page>
  );
};

export default ExportApGeneration;
