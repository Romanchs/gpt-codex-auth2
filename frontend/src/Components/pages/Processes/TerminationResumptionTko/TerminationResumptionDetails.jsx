import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import {
  cancelTerminationResumption,
  clearCurrentProcess,
  exportTerminationResumptionAps,
  getTerminationResumptionFiles,
  toFormTerminationResumption,
  uploadFileClear,
  uploadTerminationResumptionApsMassCancel,
  uploadTerminationResumptionFiles
} from '../../../../actions/processesActions';
import { checkPermissions } from '../../../../util/verifyRole';
import Page from '../../../Global/Page';
import CircleButton from '../../../Theme/Buttons/CircleButton';
import Statuses from '../../../Theme/Components/Statuses';
import { DHTab, DHTabs } from '../Components/Tabs';
import TerminationResumptionDetailsTab from './TerminationResumptionDetailsTab';
import TerminationResumptionFilesTab from './TerminationResumptionFilesTab';
import TerminationResumptionRequestsTab from './TerminationResumptionRequestsTab';
import SimpleImportModal from '../../../Modal/SimpleImportModal';
import CancelModal from '../../../Modal/CancelModal';
import DelegateBtn from '../../../../features/delegate/delegateBtn';
import { useTranslation } from 'react-i18next';

export const TERMINATION_RESUMPTION_ACCEPT_ROLES = ['АКО', 'АКО_Процеси', 'АКО_Користувачі', 'СВБ', 'АТКО'];

const TerminationResumptionDetails = () => {
  const { t } = useTranslation();
  const { uid } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    activeRoles: [{ relation_id }]
  } = useSelector(({ user }) => user);
  const [openDialog, setOpenDialog] = useState(false);
  const [openCancel, setOpenCancel] = useState(false);
  const [openUploadApsMassCancelFile, setOpenUploadApsMassCancelFile] = useState(false);
  const { loading, currentProcess, notFound } = useSelector(({ processes }) => processes);
  const { uploading, error } = useSelector(({ massLoad }) => massLoad);
  const [tab, setTab] = useState('details');
  const [dataForInit, setDataForInit] = useState({
    must_be_finished_at: moment(),
    name: currentProcess?.action_type,
    accounting_points: []
  });
  const [delegating, setDelegating] = useState(false);

  // Check roles & get data
  useEffect(() => {
    if (!checkPermissions('PROCESSES.TERMINATION_RESUMPTION.MAIN.ACCESS', TERMINATION_RESUMPTION_ACCEPT_ROLES)) {
      navigate('/processes');
    }
  }, [dispatch, navigate, uid, relation_id]);

  useEffect(() => {
    if (currentProcess && !currentProcess.is_all_files_processed) {
      setTab('files');
    }
  }, [currentProcess]);

  useEffect(() => () => dispatch(clearCurrentProcess()), [dispatch]);

  const handleChangeTab = (event, newValue) => {
    setTab(newValue);
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleUpload = (data) => {
    dispatch(
      uploadTerminationResumptionFiles(uid, data, () => {
        if (tab === 'files') {
          dispatch(getTerminationResumptionFiles(uid));
        } else setTab('files');
      })
    );
    setOpenDialog(false);
  };

  const handleInit = () => {
    dispatch(
      toFormTerminationResumption(uid, {
        ...dataForInit,
        must_be_finished_at: moment(dataForInit.must_be_finished_at).startOf('day')
      })
    );
  };

  const handleCancel = () => {
    dispatch(
      cancelTerminationResumption(uid, () => {
        if (tab === 'files') {
          dispatch(getTerminationResumptionFiles(uid));
        }
        setOpenCancel(false);
      })
    );
  };

  const handleCloseUploadApsMassCancelFile = () => {
    if (uploading) {
      return;
    }
    setOpenUploadApsMassCancelFile(false);
    dispatch(uploadFileClear());
  };

  const handleUploadApsMassCancelFile = (formData) => {
    dispatch(
      uploadTerminationResumptionApsMassCancel(uid, formData, () => {
        handleCloseUploadApsMassCancelFile();
        if(tab === 'files')
          dispatch(getTerminationResumptionFiles(uid));
        else setTab('files');
      })
    );
  };

  const handleMassExportAps = () => {
    dispatch(exportTerminationResumptionAps(uid, () => {
      if(tab === 'files')
        dispatch(getTerminationResumptionFiles(uid));
      else setTab('files');
    }));
  };

  const getFaqKey = () => {
    if (currentProcess?.action_type === 'RESUMPTION_SUPPLY') {
      return 'PROCESSES__RESUMPTION_SUPPLY';
    }
    return 'PROCESSES__TERMINATION_SUPPLY';
  };

  return (
    <>
      <Page
        pageName={
          currentProcess ? t(`PAGES.${currentProcess.action_type}`, { id: currentProcess.id }) : `${t('LOADING')}...`
        }
        backRoute={'/processes'}
        faqKey={getFaqKey()}
        loading={loading || uploading || delegating}
        notFoundMessage={notFound && t('PROCESS_NOT_FOUND')}
        controls={
          <>
            {currentProcess?.status === 'IN_PROCESS' && (
              <>
                {currentProcess?.can_upload_file && (
                  <CircleButton type={'upload'} title={t('CONTROLS.IMPORT')} onClick={handleOpenDialog} disabled={loading} />
                )}
                {currentProcess?.can_formed && currentProcess?.is_all_files_processed && (
                  <CircleButton
                    type={'create'}
                    title={t('CONTROLS.FORM')}
                    onClick={handleInit}
                    disabled={loading || !dataForInit.must_be_finished_at}
                  />
                )}
                {currentProcess?.can_cancel && (
                  <CircleButton type={'remove'} title={t('CONTROLS.CANCEL')} onClick={() => setOpenCancel(true)} />
                )}
              </>
            )}
            {currentProcess?.can_delegate && (
              <DelegateBtn
                process_uid={uid}
                onStarted={() => setDelegating(true)}
                onFinished={() => setDelegating(false)}
                onSuccess={() => window.location.reload()}
              />
            )}
            {(currentProcess?.status === 'FORMED' || currentProcess?.status === 'DONE' || currentProcess?.status === 'COMPLETED') && (
              <CircleButton type={'download'} title={t('CONTROLS.EXPORT_TKO')} onClick={handleMassExportAps} />
            )}
            {currentProcess?.can_mass_cancel && (
              <CircleButton type={'upload'} title={t('CONTROLS.IMPORT_FILE_FOR_MAS_LOAD_CANCEL')} onClick={() => setOpenUploadApsMassCancelFile(true)} dataMarker={'import'} />
            )}
          </>
        }
      >
        <Statuses
          statuses={['NEW', 'IN_PROCESS', 'FORMED', 'DONE', 'COMPLETED', 'CANCELED']}
          currentStatus={currentProcess?.status}
        />
        <div className={'boxShadow'} style={{ paddingLeft: 24, paddingRight: 24, marginTop: 16, marginBottom: 16 }}>
          <DHTabs value={tab} onChange={handleChangeTab}>
            <DHTab label={t('REQUEST_DETAILS')} value={'details'} disabled={!currentProcess?.is_all_files_processed} />
            <DHTab label={t('DOWNLOADED_FILES_FOR_REQUEST')} value={'files'} />
            <DHTab
              label={
                !currentProcess?.name
                  ? `${t('LOADING')}...`
                  : !currentProcess?.name?.indexOf(t('RESTORATION'))
                  ? t('FIELDS.TKO_CONNECTION_REQUESTS')
                  : t('FIELDS.TKO_DISCONNECTION_REQUESTS')
              }
              value={'requests'}
              disabled={!currentProcess?.is_all_files_processed}
            />
          </DHTabs>
        </div>
        {tab === 'details' && (
          <TerminationResumptionDetailsTab dataForInit={dataForInit} setDataForInit={setDataForInit} />
        )}
        {tab === 'files' && <TerminationResumptionFilesTab data={currentProcess} />}
        {tab === 'requests' && <TerminationResumptionRequestsTab />}
      </Page>
      <SimpleImportModal
        title={t('IMPORT_AP_FILES')}
        openUpload={openDialog}
        setOpenUpload={setOpenDialog}
        handleUpload={(formData) => {
          handleUpload(formData);
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
        minWidth={380}
        open={openCancel}
        text={t('CANCEL_PROCESS_CONFIRMATION')}
        onClose={() => setOpenCancel(false)}
        onSubmit={handleCancel}
      />
      <SimpleImportModal
        title={t('IMPORT_AP_FILES')}
        openUpload={openUploadApsMassCancelFile}
        setOpenUpload={setOpenUploadApsMassCancelFile}
        handleUpload={(formData) => {
          handleUploadApsMassCancelFile(formData);
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
            label: t('IMPORT_FILE.SELECT_DIGITAL_SIGNATURE_FILE'),
            accept: '.p7s',
            maxSize: 40960,
            sizeError: t('VERIFY_MSG.UNCORRECT_SIGNATURE')
          }
        ]}
        uploading={uploading}
        error={error}
      />
    </>
  );
};

export default TerminationResumptionDetails;
