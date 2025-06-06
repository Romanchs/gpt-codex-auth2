import Page from '../../../Components/Global/Page';
import Statuses from '../../../Components/Theme/Components/Statuses';
import Box from '@mui/material/Box';
import { DHTab, DHTabs } from '../../../Components/pages/Processes/Components/Tabs';
import DetailsTab from './tabs/DetailsTab';
import FilesTab from './tabs/FilesTab';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SubprocessesTab from './tabs/SubprocessesTab';
import {
  useAutocompleteQuery,
  useCancelProcessMutation,
  useDeleteAllTkoPointMutation,
  useFormProcessMutation,
  useGetProcessApsQuery,
  useGetProcessQuery,
  useInitProcessMutation,
  useUploadTkoFileMutation
} from './api';
import CircleButton from '../../../Components/Theme/Buttons/CircleButton';
import { useDispatch, useSelector } from 'react-redux';
import { resetInitData, setInitData } from './slice';
import DelegateBtn from '../../delegate/delegateBtn';
import SimpleImportModal from '../../../Components/Modal/SimpleImportModal';

const tabs = {
  details: 'details',
  files: 'files',
  subprocesses: 'subprocesses'
};

const AccountingServiceCompletion = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [delegating, setDelegating] = useState(false);
  const { uid } = useParams();
  const [tab, setTab] = useState(tabs.details);
  const [openDialog, setOpenDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { initData } = useSelector((store) => store.accountingServiceCompletion);
  const { data: autocompleteData, isFetching: isAutocompleteLoading } = useAutocompleteQuery({}, { skip: uid });
  const {
    data: processData,
    isFetching: isProcessLoading,
    isError: notFound
  } = useGetProcessQuery({ uid }, { skip: !uid });
  const { data: apsData, isFetching: isApsLoading } = useGetProcessApsQuery(
    {
      uid,
      params: { page: 1, size: 25 }
    },
    { skip: !uid }
  );
  const [initProcess, { isLoading: isInitLoading }] = useInitProcessMutation({
    fixedCacheKey: 'initAccountingServiceCompletion'
  });

  const [cancelProcess, { isLoading: isCancelLoading }] = useCancelProcessMutation();
  const [formProcess, { isLoading: isFormLoading }] = useFormProcessMutation();
  const [uploadFile, { isLoading: isUploadLoading, error: uploadError }] = useUploadTkoFileMutation();
  const [deleteAllTkoPoint, { isLoading: isDeleteAllTkoPointLoading }] = useDeleteAllTkoPointMutation();

  useEffect(() => {
    if (processData?.additional_data?.roles_info) {
      dispatch(setInitData({ ...initData, roles_info: processData.additional_data.roles_info }));
    }
  }, [processData]);

  useEffect(() => () => {
    dispatch(resetInitData());
  }, [])

  useEffect(() => {
    setIsLoading(
      isAutocompleteLoading ||
        isInitLoading ||
        isProcessLoading ||
        isCancelLoading ||
        delegating ||
        isFormLoading ||
        isUploadLoading ||
        isDeleteAllTkoPointLoading ||
        isApsLoading
    );
  }, [
    isAutocompleteLoading,
    isInitLoading,
    isProcessLoading,
    isCancelLoading,
    delegating,
    isFormLoading,
    isUploadLoading,
    isDeleteAllTkoPointLoading,
    isApsLoading
  ]);

  const handleChangeTab = (...args) => {
    setTab(args[1]);
  };

  const handleInitProcess = () => {
    initProcess({
      planned_completion_date: initData.planned_completion_date,
      roles_info: initData.roles_info,
      ppko_company: autocompleteData
    })
      .unwrap()
      .then((res) => {
        if (res?.uid) {
          navigate(res.uid, { replace: true });
        }
      })
      .catch(() => {});
  };

  const isInitDisabled = useMemo(() => {
    return !(
      initData.planned_completion_date &&
      Object.values(initData.roles_info).some(Boolean) &&
      autocompleteData
    );
  }, [initData, autocompleteData]);

  const handleCancel = () => {
    cancelProcess(uid)
      .unwrap()
      .then(() => {
        navigate('/processes');
      })
      .catch(() => {});
  };

  const handleForm = () => {
    formProcess({ uid, body: { planned_completion_date: processData?.additional_data?.planned_completion_date } });
  };

  const handleUploadFile = (file) => {
    uploadFile({ uid, file }).then((res) => {
      if (!res?.error) {
        handleChangeTab(0, 'files');
      }
    });
  };

  return (
    <Page
      acceptPermisions={
        uid ? 'PROCESSES.SERVICE_TERMINATION_REQUEST.ACCESS' : 'PROCESSES.SERVICE_TERMINATION_REQUEST.INITIALIZATION'
      }
      acceptRoles={uid ? ['ОЗД', 'ОДКО', 'ОЗКО', 'АТКО', 'АКО_ППКО'] : ['ОЗД', 'ОДКО', 'ОЗКО', 'АТКО']}
      pageName={
        processData?.id
          ? `${t('PAGES.REQUEST_TERMINATION_SERVICE')} №${processData?.id}`
          : t('PAGES.REQUEST_TERMINATION_SERVICE')
      }
      backRoute={'/processes'}
      notFoundMessage={notFound && t('PROCESS_NOT_FOUND')}
      controls={
        <>
          {['IN_PROCESS', 'FORMED'].includes(processData?.status) && processData?.can_cancel && (
            <CircleButton
              type={'remove'}
              title={t('CONTROLS.CANCEL')}
              dataMarker={'tko-disputes-cancel'}
              disabled={isLoading}
              onClick={handleCancel}
            />
          )}
          {apsData?.aps?.total > 0 && processData?.can_delete_point && (
            <CircleButton
              type={'delete'}
              title={t('CONTROLS.DELETE_ALL_AP')}
              disabled={isLoading}
              onClick={() => deleteAllTkoPoint(uid)}
            />
          )}
          {processData?.can_delegate && (
            <DelegateBtn
              process_uid={uid}
              onStarted={() => setDelegating(true)}
              onFinished={() => setDelegating(false)}
              onSuccess={() => window.location.reload()}
              disabled={isLoading}
            />
          )}
          {processData?.status === 'IN_PROCESS' && processData?.can_upload && (
            <CircleButton
              type={'upload'}
              title={t('CONTROLS.DOWNLOAD_FILE')}
              onClick={() => setOpenDialog(true)}
              disabled={isLoading}
            />
          )}
          {!uid && (
            <CircleButton
              type={'create'}
              title={t('CONTROLS.TAKE_TO_WORK')}
              onClick={handleInitProcess}
              disabled={isInitDisabled || isLoading}
              data-marker={'init'}
            />
          )}
          {processData?.status === 'IN_PROCESS' && processData?.can_form && (
            <CircleButton type={'new'} title={t('CONTROLS.FORM')} onClick={handleForm} disabled={isLoading} />
          )}
        </>
      }
      loading={isLoading}
    >
      <Statuses
        statuses={['NEW', 'IN_PROCESS', 'FORMED', 'DONE', 'PARTIALLY_DONE', 'REJECTED', 'CANCELED']}
        currentStatus={processData?.status ?? 'NEW'}
      />
      <Box className={'boxShadow'} sx={{ pl: 3, pr: 3, mt: 2, mb: 2 }}>
        <DHTabs value={tab} onChange={handleChangeTab}>
          <DHTab label={t('REQUEST_DETAILS')} value={tabs.details} />
          <DHTab label={t('LOADED_AP_FILES')} value={tabs.files} disabled={!uid || processData?.can_delegate} />
          <DHTab
            label={t('INITIATED_SUBPROCESSES')}
            value={tabs.subprocesses}
            disabled={!uid || processData?.status === 'IN_PROCESS'}
          />
        </DHTabs>
      </Box>
      {tab === tabs.details && <DetailsTab setIsLoading={setIsLoading} />}
      {tab === tabs.files && <FilesTab setIsLoading={setIsLoading} />}
      {tab === tabs.subprocesses && <SubprocessesTab setIsLoading={setIsLoading} />}
      <SimpleImportModal
        title={t('IMPORT_AP_FILES')}
        openUpload={openDialog}
        setOpenUpload={setOpenDialog}
        handleUpload={(formData, handleClose) => {
          handleUploadFile(formData);
          handleClose();
        }}
        layoutList={[
          {
            key: 'file_original',
            label: t('IMPORT_FILE.SELECT_FILE_WITH_AP_INFORMAT', { format: '.xls, .xlsx, .xlsm' }),
            accept: '.xls,.xlsx,.xlsm',
            maxSize: 15000000,
            sizeError: t('VERIFY_MSG.MAX_FILE_SIZE', { size: 15 })
          },
          {
            key: 'file_original_key',
            label: t('IMPORT_FILE.PPKO_FILE'),
            accept: '.p7s',
            maxSize: 40960,
            sizeError: t('VERIFY_MSG.UNCORRECT_SIGNATURE')
          },
          {
            key: 'file_key_customer',
            label: t('IMPORT_FILE.DIGITAL_SIGN_FILE'),
            accept: '.p7s',
            maxSize: 40960,
            sizeError: t('VERIFY_MSG.UNCORRECT_SIGNATURE')
          }
        ]}
        keyFiles={['file_original_key', 'file_key_customer']}
        uploading={isUploadLoading}
        error={uploadError}
      />
    </Page>
  );
};

export default AccountingServiceCompletion;
