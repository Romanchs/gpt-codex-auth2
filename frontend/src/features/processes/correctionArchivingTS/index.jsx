import Box from '@mui/material/Box';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Page from '../../../Components/Global/Page';
import { DHTab, DHTabs } from '../../../Components/pages/Processes/Components/Tabs';
import SimpleImportModal from '../../../Components/Modal/SimpleImportModal';
import CancelModal from '../../../Components/Modal/CancelModal';
import CircleButton from '../../../Components/Theme/Buttons/CircleButton';
import DelegateBtn from '../../delegate/delegateBtn';
import Statuses from '../../../Components/Theme/Components/Statuses';
import { mainApi } from '../../../app/mainApi';
import {
  useCorrectionArchivingTSQuery,
  useInitCorrectionArchivingTSMutation,
  useUpdateCorrectionArchivingTSMutation,
  useUploadCorrectionArchivingTSMutation,
  useChangeDescriptionFilesCorrectionArchivingTSMutation
} from './api';
import { useTranslation } from 'react-i18next';
import DetailsTab from './components/DetailsTab';
import { defaultParams, initialInitData, setParams, ACTION_TYPES, setInitData } from './slice';
import FilesTab from './components/FilesTab';
import SubprocessesTab from './components/SubprocessesTab';

const PAGE_TABS = {
  DETAILS: 'details',
  FILES: 'files',
  SUBPROCESSES: 'subprocesses'
};

export const CORRECTION_ARCHIVING_TS_ACCEPT_ROLES = ['АКО_Процеси', 'ОДКО'];

const CorrectionArchivingTS = () => {
  const { uid } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const initData = useSelector((store) => store.correctionArchivingTS.initData);
  const params = useSelector((store) => store.correctionArchivingTS.params);
  const [tab, setTab] = useState(PAGE_TABS.DETAILS);
  const [openUpload, setOpenUpload] = useState(false);
  const [approveModal, setApproveModal] = useState(false);
  const [delegating, setDelegating] = useState(false);

  const { currentData, isFetching, isError, error } = useCorrectionArchivingTSQuery({ uid, params }, { skip: !uid });
  const { isFetching: isFiles } = mainApi.endpoints.filesCorrectionArchivingTS.useQueryState(uid);
  const { isFetching: isSubprocesses } = mainApi.endpoints.subprocessesCorrectionArchivingTS.useQueryState(uid);

  const [initProcess, { isLoading: isCreating }] = useInitCorrectionArchivingTSMutation({
    fixedCacheKey: 'correctionArchivingTS_init'
  });
  const [update, { isLoading: isUpdating }] = useUpdateCorrectionArchivingTSMutation({
    fixedCacheKey: 'correctionArchivingTS_update'
  });
  const [uploadFile, { isLoading: uploading, error: uploadingError }] = useUploadCorrectionArchivingTSMutation();
  const [, { isLoading: isFileDescription }] = useChangeDescriptionFilesCorrectionArchivingTSMutation({
    fixedCacheKey: 'correctionArchivingTS_descriptionFiles'
  });

  const loading =
    isFetching || isFiles || isSubprocesses || isCreating || isUpdating || uploading || isFileDescription || delegating;
  const IS_ARCHIVING = !uid
    ? initData.action_type === ACTION_TYPES.archiving
    : currentData?.additional_data?.process_type === ACTION_TYPES.archiving;

  useEffect(() => {
    if (error?.data?.detail === 'У вас немає дозволу на виконання цієї дії.') {
      navigate('/processes');
    }
  }, [navigate, error]);

  useEffect(() => {
    if (!uid) {
      setTab(PAGE_TABS.DETAILS);
      dispatch(setInitData(initialInitData));
      dispatch(setParams(defaultParams));
    }
  }, [dispatch, uid]);

  const handleChangeTab = (...args) => {
    setTab(args[1]);
    dispatch(setParams(defaultParams));
  };

  const getPageName = () => {
    if (loading) return `${t('LOADING')}...`;
    if (currentData) {
      return IS_ARCHIVING
        ? t('PAGES.ARCHIVING_TS_ID', { id: currentData?.id })
        : t('PAGES.CORRECTION_TS_ID', { id: currentData?.id });
    }
    return IS_ARCHIVING ? t('SUBPROCESSES.ARCHIVING_TS') : t('SUBPROCESSES.CORRECTION_TS');
  };

  return (
    <Page
      acceptPermisions={
        uid ? 'PROCESSES.CORRECTION_ARCHIVING_TS.ACCESS' : 'PROCESSES.CORRECTION_ARCHIVING_TS.INITIALIZATION'
      }
      acceptRoles={CORRECTION_ARCHIVING_TS_ACCEPT_ROLES}
      pageName={getPageName()}
      faqKey={'PROCESSES__CORRECTION_ARCHIVING_TS'}
      backRoute={'/processes'}
      loading={loading}
      notFoundMessage={isError && t('PROCESS_NOT_FOUND')}
      controls={
        <>
          {!uid && (
            <CircleButton
              type={'create'}
              title={t('CONTROLS.TAKE_TO_WORK')}
              onClick={() =>
                initProcess(
                  IS_ARCHIVING ? { action_type: initData.action_type, reason: initData.reason } : initData
                ).then((res) => {
                  if (res?.data?.uid) {
                    navigate(res.data.uid, { replace: true });
                  }
                })
              }
              dataMarker={'init'}
            />
          )}
          {currentData?.can_cancel_aps && (
            <CircleButton
              type={'delete'}
              title={t('CONTROLS.DELETE_FILE_AP')}
              onClick={() => update({ uid, type: '/cancel-ap' })}
              dataMarker={'cancel_aps'}
            />
          )}
          {currentData?.can_cancel && (
            <CircleButton
              type={'remove'}
              title={t('CONTROLS.CANCEL_PROCESS')}
              onClick={() => update({ uid, type: '/cancel' })}
              dataMarker={'cancel'}
            />
          )}
          {currentData?.can_delegate && (
            <DelegateBtn
              process_uid={uid}
              onStarted={() => setDelegating(true)}
              onFinished={() => setDelegating(false)}
              onSuccess={() => window.location.reload()}
            />
          )}
          {currentData?.can_upload && (
            <CircleButton type={'upload'} title={t('CONTROLS.IMPORT')} onClick={() => setOpenUpload(true)} />
          )}
          {currentData?.can_form && (
            <CircleButton
              type={'new'}
              title={t('CONTROLS.FORM')}
              onClick={() => setApproveModal(true)}
              dataMarker={'form'}
              disabled={initData.reason?.trim().length > 500}
            />
          )}
        </>
      }
    >
      <Statuses
        statuses={
          IS_ARCHIVING
            ? ['NEW', 'IN_PROCESS', 'FORMED', 'DONE', 'CANCELED', 'REJECTED']
            : ['NEW', 'IN_PROCESS', 'FORMED', 'DONE', 'COMPLETED', 'CANCELED', 'REJECTED']
        }
        currentStatus={currentData?.status || 'NEW'}
      />
      <Box className={'boxShadow'} sx={{ mt: 2, mb: 2, pl: 3, pr: 3 }}>
        <DHTabs value={tab} onChange={handleChangeTab}>
          <DHTab label={t('REQUEST_DETAILS')} value={PAGE_TABS.DETAILS} />
          <DHTab label={t('DOWNLOADED_FILES_FOR_REQUEST')} value={PAGE_TABS.FILES} disabled={!uid} />
          <DHTab
            label={t('INITIATED_SUBPROCESSES')}
            value={PAGE_TABS.SUBPROCESSES}
            disabled={!uid || currentData?.status === 'IN_PROCESS'}
          />
        </DHTabs>
      </Box>
      {tab === PAGE_TABS.DETAILS && <DetailsTab />}
      {tab === PAGE_TABS.FILES && <FilesTab />}
      {tab === PAGE_TABS.SUBPROCESSES && <SubprocessesTab />}
      <CancelModal
        text={t('ARE_U_SURE_U_WANT_TO_FORMED_PROCESS')}
        open={approveModal}
        submitType={'green'}
        onClose={() => setApproveModal(false)}
        onSubmit={() => {
          setApproveModal(false);
          update({ uid, type: '/formed', body: { reason: initData.reason } });
        }}
      />
      <SimpleImportModal
        title={t('IMPORT_AP_FILES')}
        openUpload={openUpload}
        setOpenUpload={setOpenUpload}
        handleUpload={(body, handleClose) => {
          uploadFile({ uid, body }).then((res) => {
            if (!res?.error) {
              setOpenUpload(false);
              setTab(PAGE_TABS.FILES);
            }
          });
          handleClose();
        }}
        layoutList={[
          {
            key: 'file_original',
            label: t('IMPORT_FILE.SELECT_FILE_WITH_AP_INFORMAT', { format: '.xls, .xlsx, .xlsm' }),
            accept: '.xls,.xlsx,.xlsm',
            maxSize: 15728640,
            sizeError: t('VERIFY_MSG.FILE_SIZE', { size: 15 })
          },
          {
            key: 'file_original_key',
            label: t('IMPORT_FILE.SELECT_DIGITAL_SIGNATURE_FILE'),
            accept: '.p7s',
            maxSize: 40960,
            sizeError: t('VERIFY_MSG.UNCORRECT_SIGNATURE')
          }
        ]}
        uploading={uploading}
        error={uploadingError}
      />
    </Page>
  );
};

export default CorrectionArchivingTS;
