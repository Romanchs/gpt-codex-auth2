import { useEffect, useState } from 'react';
import { useDeletingTkoQuery, useDeletingTkoUploadMutation, useUpdateDeletingTkoMutation } from './api';
import { DeletingTkoForm } from './DeletingTkoForm';
import Page from '../../../../Components/Global/Page';
import CircleButton from '../../../../Components/Theme/Buttons/CircleButton';
import RejectDialog from '../RejectDialog';
import DelegateBtn from '../../../delegate/delegateBtn';
import Statuses from '../../../../Components/Theme/Components/Statuses';
import CancelModal from '../../../../Components/Modal/CancelModal';
import SimpleImportModal from '../../../../Components/Modal/SimpleImportModal';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { UploadedFilesTable } from '../../../../Components/pages/Processes/Components/UploadedFilesTable';
import { sockets } from '../../../../app/sockets';

export const DELETE_AP_ACCEPT_ROLES = ['АТКО', 'АКО', 'АКО_Процеси'];

const DeletingTkoDetails = () => {
  const { uid } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { currentData: data, isFetching, error, refetch } = useDeletingTkoQuery(uid);
  const [update, { isLoading: isUpdating }] = useUpdateDeletingTkoMutation({ fixedCacheKey: 'updateDeletingTko' });
  const [upload, { isLoading: isUploading, error: UploadingError, reset: resetUpload }] =
    useDeletingTkoUploadMutation();
  const [openCancel, setOpenCancel] = useState(false);
  const [openImportFile, setOpenImportFile] = useState(false);
  const [delegating, setDelegating] = useState(false);

  const loading = isFetching || isUpdating || isUploading || delegating;

  useEffect(() => {
    if (uid && sockets.connection.auth) {
      sockets.joinProcess(uid);
      sockets.connection.on('message', ({ type, payload }) => {
        if (type === 'PROCESS_UPDATED' && payload?.process_uid === uid) {
          setTimeout(() => {
            refetch();
          }, 1000);
        }
      });
    }
  }, [uid, sockets.connection.auth, refetch]);

  useEffect(
    () => () => {
      sockets.leaveProcess(uid);
    },
    [uid]
  );

  useEffect(() => {
    if (error && error.status == 403) navigate('/processes');
  }, [error, navigate]);

  const handleCancel = () => {
    setOpenCancel(false);
    update({
      uid,
      type: 'cancel'
    });
  };

  const handleForm = () => {
    update({
      uid,
      type: 'make-summary-file'
    });
  };

  const handleApprove = () => {
    update({
      uid,
      type: 'approve'
    });
  };

  const handleComplete = () => {
    update({
      uid,
      type: 'complete'
    });
  };

  return (
    <Page
      pageName={data?.id ? t('PAGES.DELETE_ACTIVATE_TKO_ID', { id: data?.id }) : t('PAGES.DELETE_ACTIVATE_TKO')}
      backRoute={'/processes'}
      loading={loading || data?.processing}
      faqKey={'PROCESSES__DELETE_AP'}
      acceptPermisions={'PROCESSES.DELETING_TKO.ACCESS'}
      acceptRoles={DELETE_AP_ACCEPT_ROLES}
      notFoundMessage={error?.status === 404 && t('PROCESS_NOT_FOUND')}
      controls={
        <>
          {data?.can_cancel && (
            <CircleButton
              type={'remove'}
              title={t('CONTROLS.CANCEL')}
              dataMarker={'deleting-tko-cancel'}
              onClick={() => setOpenCancel(true)}
              disabled={data?.processing}
            />
          )}
          {data?.can_upload && (
            <CircleButton
              type={'upload'}
              title={t('CONTROLS.IMPORT')}
              dataMarker={'deleting-tko-upload'}
              onClick={() => setOpenImportFile(true)}
              disabled={data?.processing}
            />
          )}
          {data?.can_reject && <RejectDialog disabled={data?.processing} />}
          {data?.can_make_summary_file && (
            <CircleButton
              type={'create'}
              title={t('CONTROLS.FORM')}
              dataMarker={'deleting-tko-forming'}
              onClick={handleForm}
              disabled={data?.processing}
            />
          )}
          {data?.can_approve && (
            <CircleButton
              type={'done'}
              title={t('CONTROLS.APPROVE')}
              dataMarker={'deleting-tko-approve'}
              onClick={handleApprove}
              disabled={data?.processing}
            />
          )}
          {data?.can_complete && (
            <CircleButton
              type={'done'}
              title={t('CONTROLS.DONE')}
              dataMarker={'deleting-tko-done'}
              onClick={handleComplete}
              disabled={data?.processing}
            />
          )}
          {data?.can_delegate && (
            <DelegateBtn
              process_uid={uid}
              onStarted={() => setDelegating(true)}
              onFinished={() => setDelegating(false)}
              onSuccess={() => window.location.reload()}
              disabled={data?.processing}
            />
          )}
        </>
      }
    >
      <Statuses
        statuses={['NEW', 'IN_PROCESS', 'FORMED', 'DONE', 'PARTIALLY_DONE', 'COMPLETED', 'REJECTED', 'CANCELED']}
        currentStatus={data?.status || 'NEW'}
      />
      <DeletingTkoForm />
      {data?.files?.length > 0 && (
        <UploadedFilesTable files={data.files || []} handleUpdateList={refetch} tags={['Видалення даних']} />
      )}
      <CancelModal
        minWidth={380}
        open={openCancel}
        text={t('CANCEL_PROCESS_CONFIRMATION')}
        onClose={() => setOpenCancel(false)}
        onSubmit={handleCancel}
      />
      <SimpleImportModal
        title={t('IMPORT_AP_FILES')}
        openUpload={openImportFile}
        setOpenUpload={setOpenImportFile}
        handleUpload={(formData, handleClose) =>
          upload({ uid, body: formData }).then((response) => {
            if (response?.error) return;
            handleClose();
            resetUpload();
          })
        }
        layoutList={[
          {
            key: 'file_original',
            label: t('IMPORT_FILE.FILE_WITH_AP_IN_FORMAT', { format: '.xlsx' }),
            accept: '.xlsx',
            maxSize: 15000000,
            sizeError: t('VERIFY_MSG.MAX_FILE_SIZE', { size: 15 })
          },
          {
            key: 'file_original_key',
            label: t('IMPORT_FILE.DIGITALLY_SIGNED_FILE'),
            accept: '.p7s',
            maxSize: 40960,
            sizeError: t('VERIFY_MSG.UNCORRECT_SIGNATURE')
          }
        ]}
        uploading={isUploading}
        error={UploadingError?.data}
      />
    </Page>
  );
};

export default DeletingTkoDetails;
