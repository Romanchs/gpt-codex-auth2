import Page from '../../../../Components/Global/Page';
import Statuses from '../../../../Components/Theme/Components/Statuses';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  useCancelUnArchiveTkoMutation,
  useFormUnArchiveTkoMutation,
  useUnArchiningTkoQuery,
  useUploadUnArchiveTkoMutation
} from './api';
import { UnArchiveForm } from './UnArchiveForm';
import { UploadedFilesTable } from '../../../../Components/pages/Processes/Components/UploadedFilesTable';
import CircleButton from '../../../../Components/Theme/Buttons/CircleButton';
import { useState } from 'react';
import CancelModal from '../../../../Components/Modal/CancelModal';
import SimpleImportModal from '../../../../Components/Modal/SimpleImportModal';
import useProcessRoom from '../../../../app/sockets/useProcessRoom';
import DelegateBtn from '../../../delegate/delegateBtn';

export const UN_ARCHIVE_ACCEPT_ROLES = ['АТКО', 'АКО_Процеси'];

const UnArchiveTkoDetails = () => {
  const { t } = useTranslation();
  const { uid } = useParams();
  const { currentData: data, isFetching, error, refetch } = useUnArchiningTkoQuery(uid);
  const [openCancel, setOpenCancel] = useState(false);
  const [openImportFile, setOpenImportFile] = useState(false);
  const [delegating, setDelegating] = useState(false);
  const [onCancel, {isLoading: isCanceling}] = useCancelUnArchiveTkoMutation();
  const [onUpload, {isLoading: isUploading, error: uploadingError, reset: resetUpload}] = useUploadUnArchiveTkoMutation();
  const [onForm, {isLoading: isForming}] = useFormUnArchiveTkoMutation();

  const loading = isFetching || isCanceling || isUploading || isForming || delegating;

  useProcessRoom(uid, refetch);

  const handleCancel = () => {
    setOpenCancel(false);
    onCancel(uid);
  }

  const handleForm = () => {
    onForm(uid);
  }

  return (
    <Page
      pageName={data?.id ? t('PAGES.UNARCHIVE_TKO_ID', { id: data?.id }) : t('SUBPROCESSES.UNARCHIVE_AP')}
      backRoute={'/processes'}
      loading={loading}
      faqKey={'PROCESSES__UN_ARCHIVE_AP'}
      acceptPermisions={'PROCESSES.DELETING_TKO.ACCESS'}
      acceptRoles={UN_ARCHIVE_ACCEPT_ROLES}
      redirectToProcesses={error?.status == 403}
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
          {data?.can_upload && (
            <CircleButton
              type={'upload'}
              title={t('CONTROLS.IMPORT')}
              dataMarker={'archiving-tko-upload'}
              onClick={() => setOpenImportFile(true)}
            />
          )}
          {data?.can_form && (
            <CircleButton
              type={'create'}
              title={t('CONTROLS.FORM')}
              dataMarker={'archiving-tko-approve'}
              onClick={handleForm}
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
        currentStatus={data?.status || 'NEW'}
      />
      <UnArchiveForm />
      {data?.files?.length > 0 && (
        <UploadedFilesTable files={data.files || []} handleUpdateList={refetch} tags={['Деархівація ТКО']} />
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
          onUpload({ uid, body: formData }).then((response) => {
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

export default UnArchiveTkoDetails;
