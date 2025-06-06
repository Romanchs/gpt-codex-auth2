import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import { clearTkoUpload, downloadFileById } from '../../../../actions/massLoadActions';
import {
  cancelReceivingDkoActual,
  clearCurrentProcess,
  doneReceivingDkoActual,
  getReceivingDkoActual,
  getReceivingDkoActualUploadedFiles,
  getReceivingDkoHistorySubprocess,
  uploadReceivingDkoActual
} from '../../../../actions/processesActions';
import { checkPermissions } from '../../../../util/verifyRole';
import Page from '../../../Global/Page';
import CancelModal from '../../../Modal/CancelModal';
import { ImportTkoModal } from '../../../Modal/ImportTkoModal';
import CircleButton from '../../../Theme/Buttons/CircleButton';
import Statuses from '../../../Theme/Components/Statuses';
import { DHTab, DHTabs } from '../Components/Tabs';
import DetailsTab from './DetailsTab';
import RequestsTab from './RequestsTab';
import UploadedTab from './UploadedTab';
import {useTranslation} from "react-i18next";
import useExportFileLog from '../../../../services/actionsLog/useEportFileLog';

export const RECEIVING_DKO_ACTUAL_ACCEPT_ROLES = ['АКО','АКО_Процеси','АКО_ППКО','АКО_Користувачі','АКО_Довідники','СВБ'];

const ReceivingDkoActual = () => {
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { uid } = useParams();
  const { uploading, error: uploadingError } = useSelector(({ massLoad }) => massLoad);
  const { loading, currentProcess, notFound } = useSelector(({ processes }) => processes);

  const [tab, setTab] = useState('details');
  const [openUpload, setOpenUpload] = useState(false);
  const [openCancelDialog, setOpenCancelDialog] = useState(false);

  const exportFileLog = useExportFileLog(['Запит на зйом показів']);

  // Clear store after unmount
  useEffect(() => {
    if (
      !checkPermissions('PROCESSES.RECEIVING_DKO_ACTUAL.MAIN.ACCESS', RECEIVING_DKO_ACTUAL_ACCEPT_ROLES)
    ) {
      navigate('/processes');
    }
    return () => dispatch(clearCurrentProcess());
  }, [dispatch, navigate]);

  const handleChangeTab = (event, newValue) => {
    setTab(newValue);
  };

  const handleCancel = () => {
    setOpenCancelDialog(false);
    dispatch(
      cancelReceivingDkoActual(uid, () => {
        tab === 'details' && dispatch(getReceivingDkoActual(uid, { page: 1, size: 25 }));
        tab === 'files' && dispatch(getReceivingDkoActualUploadedFiles(uid, { page: 1, size: 25 }));
        tab === 'requests' && dispatch(getReceivingDkoHistorySubprocess(uid, { page: 1, size: 25 }));
      })
    );
  };

  const handleDone = () => {
    dispatch(
      doneReceivingDkoActual(uid, () => {
        tab === 'details' && dispatch(getReceivingDkoActual(uid, { page: 1, size: 25 }));
        tab === 'files' && dispatch(getReceivingDkoActualUploadedFiles(uid, { page: 1, size: 25 }));
        tab === 'requests' && dispatch(getReceivingDkoHistorySubprocess(uid, { page: 1, size: 25 }));
      })
    );
  };

  const handleDownloadResulted = () => {
    dispatch(
      downloadFileById(currentProcess?.resulted_file?.file_processed_id, currentProcess?.resulted_file?.file_name)
    );
    exportFileLog(uid);
  };

  const handleCloseDialog = () => {
    setOpenUpload(false);
    dispatch(clearTkoUpload());
  };

  return (
    <Page
      pageName={currentProcess ? t('PAGES.RECEIVING_DKO_ACTUAL_ID', {id: currentProcess?.id}) : `${t('LOADING')}...`}
      backRoute={'/processes'}
      notFoundMessage={notFound && t('PROCESS_NOT_FOUND')}
      faqKey={'PROCESSES__RECEIVING_DKO_ACTUAL'}
      loading={loading}
      controls={
        <>
          {currentProcess?.can_upload_file &&
            checkPermissions('PROCESSES.RECEIVING_DKO_ACTUAL.MAIN.CONTROLS.UPLOAD', ['АКО_Процеси', 'СВБ']) && (
              <CircleButton
                type={'upload'}
                onClick={() => setOpenUpload(true)}
                title={t('CONTROLS.IMPORT')}
                disabled={loading}
              />
            )}
          {currentProcess?.can_cancel_subprocess &&
            checkPermissions('PROCESSES.RECEIVING_DKO_ACTUAL.MAIN.CONTROLS.CANCEL', ['АКО_Процеси', 'СВБ']) && (
              <CircleButton
                type={'remove'}
                onClick={() => setOpenCancelDialog(true)}
                title={t('CONTROLS.CANCEL_PROCESS')}
                disabled={loading}
              />
            )}
          {currentProcess?.can_formed_subprocess && (
            <CircleButton type={'done'} onClick={handleDone} title={t('CONTROLS.FORM')} disabled={loading} />
          )}
          {currentProcess?.can_download_resulted_file && (
            <CircleButton
              type={'download'}
              onClick={handleDownloadResulted}
              title={t('CONTROLS.DOWNLOAD_SHOWS')}
              disabled={loading}
            />
          )}
        </>
      }
    >
      <Statuses
        statuses={['NEW', 'IN_PROCESS', 'FORMED', 'DONE', 'CANCELED_BY_OWNER']}
        currentStatus={currentProcess?.status}
      />
      <div className={'boxShadow'} style={{ paddingLeft: 24, paddingRight: 24, marginTop: 16, marginBottom: 16 }}>
        <DHTabs value={tab} onChange={handleChangeTab}>
          <DHTab label={t('REQUEST_DETAILS')} value={'details'} />
          <DHTab label={t('LOADED_AP_FILES')} value={'files'} />
          {currentProcess?.status !== 'IN_PROCESS' && <DHTab label={t('OUTGOING_REQUESTS_FOR_ODKO')} value={'requests'} />}
        </DHTabs>
      </div>
      {tab === 'details' && <DetailsTab />}
      {tab === 'files' && <UploadedTab />}
      {tab === 'requests' && <RequestsTab />}
      <ImportTkoModal
        open={openUpload}
        onClose={handleCloseDialog}
        loading={uploading}
        onUpload={(data) =>
          dispatch(
            uploadReceivingDkoActual(uid, data, () => {
              handleCloseDialog();
              tab === 'details' && dispatch(getReceivingDkoActual(uid, { page: 1, size: 25 }));
              tab === 'files' && dispatch(getReceivingDkoActualUploadedFiles(uid, { page: 1, size: 25 }));
            })
          )
        }
        error={uploadingError}
      />
      <CancelModal
        text={`${t('CANCEL_PROCESS_CONFIRMATION')} ${
          currentProcess?.status === 'IN_PROCESS'
            ? t('CHANGES_TO_APPLICATION_WILL_NOT_SAVED')
            : t('ALL_CREATED_REQUESTS_WILL_BE_CANCELLED')
        }.`}
        open={openCancelDialog}
        onSubmit={handleCancel}
        onClose={() => setOpenCancelDialog(false)}
      />
    </Page>
  );
};
export default ReceivingDkoActual;
