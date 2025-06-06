import Box from '@mui/material/Box';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { mainApi } from '../../../app/mainApi';
import Page from '../../../Components/Global/Page';
import CircleButton from '../../../Components/Theme/Buttons/CircleButton';
import Statuses from '../../../Components/Theme/Components/Statuses';
import { DHTab, DHTabs } from '../../../Components/pages/Processes/Components/Tabs';
import { useTranslation } from 'react-i18next';
import {
  useInitUpdateApsHistoryMutation,
  useUpdateApsHistoryQuery,
  useUpdateUpdateApsHistoryMutation,
  useUploadDescriptionUpdateApsHistoryMutation,
  useUploadUpdateApsHistoryMutation
} from './api';
import { reset, setData } from './slice';
import DetailsTab from './components/DetailsTab';
import FilesTab from './components/FilesTab';
import RejectDialog from './components/RejectDialog';
import UploadDialog from './components/UploadDialog';
import { verifyRole } from '../../../util/verifyRole';
import useProcessRoom from '../../../app/sockets/useProcessRoom';
import { FilesTabDko } from './components/FilesTabDko';

export const UPDATE_APS_HISTORY_ACCEPT_ROLES = ['АКО_Процеси', 'АТКО', 'АКО_Суперечки', 'СВБ', 'ОДКО'];

const UpdateApsHistory = () => {
  const navigate = useNavigate();
  const { uid } = useParams();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const data = useSelector((store) => store.updateApsHistory.data);
  const validFilters = useSelector((store) => store.updateApsHistory.validFilters);
  const [tab, setTab] = useState('details');

  const { isFetching: isFetchingInitData } = mainApi.endpoints.initDataUpdateApsHistory.useQueryState();
  const { currentData, isFetching, isError, refetch } = useUpdateApsHistoryQuery(uid, { skip: !uid });

  useProcessRoom(uid, refetch);

  const [initProcess, { isLoading: isCreating }] = useInitUpdateApsHistoryMutation({
    fixedCacheKey: 'updateApsHistory_init'
  });
  const [update, { isLoading: isUpdating }] = useUpdateUpdateApsHistoryMutation({
    fixedCacheKey: 'updateApsHistory_update'
  });
  const [, { isLoading: isUploading }] = useUploadDescriptionUpdateApsHistoryMutation({
    fixedCacheKey: 'updateApsHistory_upload'
  });
  const [, { isLoading: isUploadingProcess }] = useUploadUpdateApsHistoryMutation({
    fixedCacheKey: 'updateApsHistory_uploadProcess'
  });

  const loading = isFetchingInitData || isCreating || isFetching || isUpdating || isUploading || isUploadingProcess;

  useEffect(() => {
    if (!uid) {
      setTab('details');
      dispatch(reset());
    }
  }, [dispatch, uid]);

  return (
    <Page
      acceptPermisions={uid ? 'PROCESSES.UPDATE_APS_HISTORY.ACCESS' : 'PROCESSES.UPDATE_APS_HISTORY.INITIALIZATION'}
      acceptRoles={UPDATE_APS_HISTORY_ACCEPT_ROLES}
      faqKey={'PROCESSES__UPDATE_APS_HISTORY'}
      pageName={
        uid
          ? currentData
            ? `${t('PROCESSES.UPDATE_APS_HISTORY')} №${currentData?.id}`
            : `${t('LOADING')}...`
          : t('PROCESSES.UPDATE_APS_HISTORY')
      }
      backRoute={'/processes'}
      loading={loading}
      notFoundMessage={isError && t('PROCESS_NOT_FOUND')}
      controls={
        <>
          {!uid && (
            <CircleButton
              type={'create'}
              title={t('CONTROLS.TAKE_TO_WORK')}
              disabled={!validFilters}
              onClick={() => {
                initProcess({ ...data, ap_properties: data.ap_properties.map((i) => i.value) }).then((res) => {
                  if (res?.data?.uid) {
                    dispatch(setData(null));
                    navigate(res.data.uid, { replace: true });
                  }
                });
              }}
            />
          )}
          {(currentData?.can_cancel || currentData?.can_reject) && (
            <RejectDialog isCancel={currentData?.can_cancel} isReject={currentData?.can_reject} />
          )}
          {currentData?.can_upload && <UploadDialog setTab={setTab} refetch={refetch} tab={tab} />}
          {currentData?.can_form && (
            <CircleButton
              type={'new'}
              title={t('CONTROLS.FORM')}
              onClick={() => {
                update({ uid, type: '/formed', body: { ap_properties: data } });
              }}
              dataMarker={'formed'}
            />
          )}
          {(currentData?.can_done || currentData?.can_complete || currentData?.can_approve) && (
            <CircleButton
              type={'done'}
              title={
                currentData?.status === 'FORMED' && currentData.can_approve
                  ? t('CONTROLS.APPROVE_CONTROL')
                  : currentData?.status === 'FORMED' && verifyRole(['АКО_Процеси'])
                  ? t('CONTROLS.PERFORM')
                  : t('CONTROLS.DONE_PROCESS')
              }
              onClick={() => {
                const data = { uid, type: '/complete' };
                if (currentData.can_done) {
                  data.type = '/done';
                  data.body = { approve_when_ts_exist: true };
                } else if (currentData.can_approve) {
                  data.type = '/approve';
                }
                update(data);
              }}
            />
          )}
        </>
      }
    >
      <Statuses
        statuses={['NEW', 'IN_PROCESS', 'FORMED', 'DONE', 'COMPLETED', 'PARTIALLY_DONE', 'REJECTED', 'CANCELED']}
        currentStatus={currentData?.status || 'NEW'}
      />
      <Box className={'boxShadow'} sx={{ pl: 3, pr: 3, mt: 2, mb: 2 }}>
        <DHTabs value={tab} onChange={(...args) => setTab(args[1])}>
          <DHTab label={t('REQUEST_DETAILS')} value={'details'} />
          <DHTab label={t('LOADED_AP_FILES')} value={'files'} disabled={!currentData?.status} />
          {currentData?.edit_type === 'AP_MEASUREMENT_INTERVAL' && (
            <DHTab label={t('LOADED_AP_FILES_DKO')} value={'files_dko'} disabled={!currentData?.status} />
          )}
        </DHTabs>
      </Box>
      {tab === 'details' && <DetailsTab />}
      {tab === 'files' && <FilesTab />}
      {tab === 'files_dko' && <FilesTabDko />}
    </Page>
  );
};

export default UpdateApsHistory;
