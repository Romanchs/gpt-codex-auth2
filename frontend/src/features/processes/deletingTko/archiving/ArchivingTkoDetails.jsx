import { useEffect, useState } from 'react';
import Page from '../../../../Components/Global/Page';
import CircleButton from '../../../../Components/Theme/Buttons/CircleButton';
import RejectDialog from '../RejectDialog';
import DelegateBtn from '../../../delegate/delegateBtn';
import Statuses from '../../../../Components/Theme/Components/Statuses';
import CancelModal from '../../../../Components/Modal/CancelModal';
import SimpleImportModal from '../../../../Components/Modal/SimpleImportModal';
import { useNavigate, useParams } from 'react-router-dom';
import { useArchiningTkoQuery, useArchiningTkoUploadMutation, useUpdateArchiningTkoMutation } from './api';
import { ArchivingTkoForm } from './ArchivingTkoForm';
import { useTranslation } from 'react-i18next';
import { UploadedFilesTable } from '../../../../Components/pages/Processes/Components/UploadedFilesTable';
import useProcessRoom from '../../../../app/sockets/useProcessRoom';

export const ARCHIVING_AP_ACCEPT_ROLES = ['АТКО', 'АКО_Процеси', 'СВБ', 'ОДКО', 'ОЗД'];

const ArchivingTkoDetails = () => {
  const { uid } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { currentData: data, isFetching, error, refetch } = useArchiningTkoQuery(uid);
  const [update, { isLoading: isUpdating }] = useUpdateArchiningTkoMutation({ fixedCacheKey: 'updateArchivingTko' });
  const [upload, { isLoading: isUploading, error: uploadingError, reset: resetUpload }] =
    useArchiningTkoUploadMutation();
  const [openCancel, setOpenCancel] = useState(false);
  const [openImportFile, setOpenImportFile] = useState(false);
  const [delegating, setDelegating] = useState(false);

  const loading = isFetching || isUpdating || isUploading || delegating;

  useProcessRoom(uid, refetch);

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
      type: 'to-form'
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
      loading={loading}
      faqKey={'PROCESSES__DISMANTLE_ARCHIVE_AP'}
      acceptPermisions={'PROCESSES.DELETING_TKO.ACCESS'}
      acceptRoles={ARCHIVING_AP_ACCEPT_ROLES}
      notFoundMessage={error?.status == 404 && t('PROCESS_NOT_FOUND')}
      controls={
        <>
          {data?.can_cancel && (
            <CircleButton
              type={'remove'}
              title={t('CONTROLS.CANCEL')}
              dataMarker={'archiving-tko-cancel'}
              onClick={() => setOpenCancel(true)}
            />
          )}
          {data?.can_upload_ap && (
            <CircleButton
              type={'upload'}
              title={t('CONTROLS.IMPORT')}
              dataMarker={'archiving-tko-upload'}
              onClick={() => setOpenImportFile(true)}
            />
          )}
          {data?.can_reject && <RejectDialog />}
          {data?.can_form && (
            <CircleButton
              type={'create'}
              title={t('CONTROLS.FORM')}
              dataMarker={'archiving-tko-forming'}
              onClick={handleForm}
            />
          )}
          {data?.can_approve && (
            <CircleButton
              type={'done'}
              title={t('CONTROLS.APPROVE')}
              dataMarker={'archiving-tko-approve'}
              onClick={handleApprove}
            />
          )}
          {data?.can_complete && (
            <CircleButton
              type={'done'}
              title={t('CONTROLS.DONE')}
              dataMarker={'archiving-tko-done'}
              onClick={handleComplete}
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
        statuses={['NEW', 'IN_PROCESS', 'FORMED', 'DONE', 'PARTIALLY_DONE', 'CANCELED']}
        currentStatus={data?.status || 'NEW'}
      />
      <ArchivingTkoForm />
      {data?.files?.length > 0 && (
        <UploadedFilesTable files={data.files || []} handleUpdateList={refetch} tags={['Демонтаж/Архівація']} />
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
        error={uploadingError?.data}
      />
    </Page>
  );
};

export default ArchivingTkoDetails;
