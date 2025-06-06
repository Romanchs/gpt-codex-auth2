import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Page from '../../../Components/Global/Page';
import CircleButton from '../../../Components/Theme/Buttons/CircleButton';
import DelegateBtn from '../../delegate/delegateBtn';
import Statuses from '../../../Components/Theme/Components/Statuses';
import { DHTab, DHTabs } from '../../../Components/pages/Processes/Components/Tabs';
import SimpleImportModal from '../../../Components/Modal/SimpleImportModal';
import CancelModal from '../../../Components/Modal/CancelModal';
import {
  tags,
  useLazyExportTerminationResumptionApsQuery,
  useRemoveTerminationResumptionPointMutation,
  useTerminationResumptionCheckedApsMutation,
  useTerminationResumptionFilesQuery,
  useTerminationResumptionQuery,
  useUpdateTerminationResumptionMutation,
  useUploadTerminationResumptionApsMassCancelMutation,
  useUploadTerminationResumptionFilesMutation
} from './api';
import DetailsTab from './tabs/DetailsTab';
import FilesTab from './tabs/FilesTab';
import { mainApi } from '../../../app/mainApi';
import RequestsTab from './tabs/RequestsTab';
import { useDispatch } from 'react-redux';

export const TERMINATION_RESUMPTION_ACCEPT_ROLES = ['АКО', 'АКО_Процеси', 'АКО_Користувачі', 'СВБ', 'АТКО'];

const TerminationResumption = () => {
  const { t } = useTranslation();
  const { uid } = useParams();
  const dispatch = useDispatch();
  const [openDialog, setOpenDialog] = useState(false);
  const [openCancel, setOpenCancel] = useState(false);
  const [tab, setTab] = useState('details');
  const [mustBeFinishedAt, setMustBeFinishedAt] = useState(moment());
  const [delegating, setDelegating] = useState(false);
  const [openUploadApsMassCancelFile, setOpenUploadApsMassCancelFile] = useState(false);
  const [params, setParams] = useState({ page: 1, size: 25 });

  const {
    data,
    isFetching: loading,
    error: notFound
  } = useTerminationResumptionQuery(
    {
      uid,
      params
    },
    { refetchOnMountOrArgChange: true }
  );
  const { isFetching: loadingFiles } = useTerminationResumptionFilesQuery(uid, { skip: tab !== 'files' });
  const [update, { isLoading: forming }] = useUpdateTerminationResumptionMutation();
  const [uploadFiles, { isLoading: uploading, error }] = useUploadTerminationResumptionFilesMutation();
  const [exportAps, { isFetching: exporting }] = useLazyExportTerminationResumptionApsQuery();
  const [uploadMassCancel, { isLoading: uploadingMassCancel, error: errorMassCancel }] =
    useUploadTerminationResumptionApsMassCancelMutation();
  const [, { isLoading: removingPoint }] = useRemoveTerminationResumptionPointMutation({
    fixedCacheKey: 'remove-point'
  });
  const [, { isLoading: checkingAp }] = useTerminationResumptionCheckedApsMutation({
    fixedCacheKey: 'terminationResumptionCheckedAps'
  });

  const isLoading =
    loading ||
    loadingFiles ||
    forming ||
    uploading ||
    delegating ||
    exporting ||
    uploadingMassCancel ||
    removingPoint ||
    checkingAp;

  useEffect(() => {
    if (data && !data.is_all_files_processed) {
      setTab('files');
    }
  }, [data]);

  const handleChangeTab = (_, newValue) => {
    setTab(newValue);
  };

  const handleUpload = (body) => {
    uploadFiles({ uid, body }).then(() => {
      if (tab !== 'files') setTab('files');
    });
    setOpenDialog(false);
  };

  const handleForm = () => {
    const body = {
      name: data.action_type,
      must_be_finished_at: moment(mustBeFinishedAt).startOf('day')
    };
    update({ uid, body, params, action: 'to-form' }).then(() => {
      if (tab === 'files') {
        dispatch(mainApi.util.invalidateTags([tags.TERMINATE_RESUMPTION_FILES]));
      }
      if (tab === 'requests') {
        dispatch(mainApi.util.invalidateTags([tags.TERMINATE_RESUMPTION_REQUESTS]));
      }
    });
  };

  const handleCancel = () => {
    update({ uid, body: {}, params, action: 'cancel' }).then(() => {
      if (tab === 'files') {
        mainApi.util.invalidateTags([tags.TERMINATE_RESUMPTION_FILES]);
      }
      setOpenCancel(false);
    });
  };

  const handleUploadApsMassCancelFile = (body) => {
    uploadMassCancel({ uid, body }).then(() => {
      if (tab !== 'files') setTab('files');
      setOpenUploadApsMassCancelFile(false);
    });
  };

  const handleMassExport = () => {
    exportAps(uid).then(() => {
      if (tab !== 'files') setTab('files');
      mainApi.util.invalidateTags([tags.TERMINATE_RESUMPTION_FILES]);
    });
  };

  const getFaqKey = () => {
    if (data?.action_type === 'RESUMPTION_SUPPLY') {
      return 'PROCESSES__RESUMPTION_SUPPLY';
    }
    return 'PROCESSES__TERMINATION_SUPPLY';
  };

  return (
    <>
      <Page
        pageName={data ? t(`PAGES.${data.action_type}`, { id: data.id }) : `${t('LOADING')}...`}
        acceptPermisions={'PROCESSES.TERMINATION_RESUMPTION.MAIN.ACCESS'}
        acceptRoles={TERMINATION_RESUMPTION_ACCEPT_ROLES}
        backRoute={'/processes'}
        faqKey={getFaqKey()}
        loading={isLoading}
        notFoundMessage={notFound && t('PROCESS_NOT_FOUND')}
        controls={
          <>
            {data?.status === 'IN_PROCESS' && (
              <>
                {data?.can_upload_file && (
                  <CircleButton type={'upload'} title={t('CONTROLS.IMPORT')} onClick={() => setOpenDialog(true)} />
                )}
                {data?.can_formed && data?.is_all_files_processed && data?.chosen_ap?.length > 0 && (
                  <CircleButton
                    type={'create'}
                    title={t('CONTROLS.FORM')}
                    onClick={handleForm}
                    disabled={!mustBeFinishedAt && isLoading}
                  />
                )}
                {data?.can_cancel && (
                  <CircleButton type={'remove'} title={t('CONTROLS.CANCEL')} onClick={() => setOpenCancel(true)} />
                )}
              </>
            )}
            {(data?.status === 'FORMED' || data?.status === 'DONE' || data?.status === 'COMPLETED') && (
              <CircleButton type={'download'} title={t('CONTROLS.EXPORT_TKO')} onClick={handleMassExport} />
            )}
            {data?.can_mass_cancel && (
              <CircleButton
                type={'upload'}
                title={t('CONTROLS.IMPORT_FILE_FOR_MAS_LOAD_CANCEL')}
                onClick={() => setOpenUploadApsMassCancelFile(true)}
                dataMarker={'import'}
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
          statuses={['NEW', 'IN_PROCESS', 'FORMED', 'DONE', 'COMPLETED', 'CANCELED']}
          currentStatus={data?.status}
        />
        <div className={'boxShadow'} style={{ paddingLeft: 24, paddingRight: 24, marginTop: 16, marginBottom: 16 }}>
          <DHTabs value={tab} onChange={handleChangeTab}>
            <DHTab label={t('REQUEST_DETAILS')} value={'details'} disabled={!data?.is_all_files_processed} />
            <DHTab label={t('DOWNLOADED_FILES_FOR_REQUEST')} value={'files'} />
            <DHTab
              label={
                !data?.name
                  ? `${t('LOADING')}...`
                  : !data?.name?.indexOf(t('RESTORATION'))
                  ? t('FIELDS.TKO_CONNECTION_REQUESTS')
                  : t('FIELDS.TKO_DISCONNECTION_REQUESTS')
              }
              value={'requests'}
              disabled={!data?.is_all_files_processed}
            />
          </DHTabs>
        </div>
        {tab === 'details' && (
          <DetailsTab
            mustBeFinishedAt={mustBeFinishedAt}
            setMustBeFinishedAt={setMustBeFinishedAt}
            params={params}
            setParams={setParams}
          />
        )}
        {tab === 'files' && <FilesTab />}
        {tab === 'requests' && <RequestsTab />}
      </Page>
      <SimpleImportModal
        title={t('IMPORT_AP_FILES')}
        openUpload={openDialog}
        setOpenUpload={setOpenDialog}
        handleUpload={handleUpload}
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
            label: t('IMPORT_FILE.SELECT_DIGITAL_SIGNATURE_FILE'),
            accept: '.p7s',
            maxSize: 40960,
            sizeError: t('VERIFY_MSG.UNCORRECT_SIGNATURE')
          }
        ]}
        uploading={uploading}
        warningMessage={t('AFTER_ADDING_FILE_ONLY_TKO')}
        error={error}
      />
      <CancelModal
        open={openCancel}
        text={t('CANCEL_PROCESS_CONFIRMATION')}
        onClose={() => setOpenCancel(false)}
        onSubmit={handleCancel}
      />
      <SimpleImportModal
        title={t('IMPORT_AP_FILES')}
        openUpload={openUploadApsMassCancelFile}
        setOpenUpload={setOpenUploadApsMassCancelFile}
        handleUpload={handleUploadApsMassCancelFile}
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
            label: t('IMPORT_FILE.SELECT_DIGITAL_SIGNATURE_FILE'),
            accept: '.p7s',
            maxSize: 40960,
            sizeError: t('VERIFY_MSG.UNCORRECT_SIGNATURE')
          }
        ]}
        uploading={uploadingMassCancel}
        error={errorMassCancel}
      />
    </>
  );
};

export default TerminationResumption;
