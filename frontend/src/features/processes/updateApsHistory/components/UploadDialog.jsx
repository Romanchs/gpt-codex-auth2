import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import CircleButton from '../../../../Components/Theme/Buttons/CircleButton';
import SimpleImportModal from '../../../../Components/Modal/SimpleImportModal';
import { useUploadDescriptionUpdateApsHistoryMutation, useUploadUpdateApsHistoryMutation } from '../api';
import { useTranslation } from 'react-i18next';
import { mainApi } from '../../../../app/mainApi';
import { verifyRole } from '../../../../util/verifyRole';

const UploadDialog = ({ setTab, refetch }) => {
  const { uid } = useParams();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [layoutList, setLayoutList] = useState([]);

  const { currentData } = mainApi.endpoints.updateApsHistory.useQueryState(uid, { skip: !uid });

  const isFormedWithInterval =
    currentData?.status === 'FORMED' && currentData.edit_type === 'AP_MEASUREMENT_INTERVAL' && verifyRole(['ОДКО']);
  useEffect(() => {
    if (!open) return;
    setTitle(isFormedWithInterval ? t('IMPORT_FILE_WITH_DKO') : t('IMPORT_AP_FILES'));
    setLayoutList([
      {
        key: 'file_original',
        label: isFormedWithInterval
          ? t('IMPORT_FILE.SELECT_FILE_IN_FORMAT_XML')
          : t('IMPORT_FILE.SELECT_FILE_IN_FORMAT_XLS_XLSX_XLSM'),
        accept: isFormedWithInterval ? '.xml' : '.xls,.xlsx,.xlsm'
      },
      {
        key: 'file_original_key',
        label: t('IMPORT_FILE.SELECT_DIGITAL_SIGNATURE_FILE'),
        accept: '.p7s'
      }
    ]);
  }, [isFormedWithInterval, open]);

  const [uploadFile, { isLoading, error }] = useUploadDescriptionUpdateApsHistoryMutation({
    fixedCacheKey: 'updateApsHistory_upload'
  });

  const [uploadFileProcess, { isLoadingProcess, errorProcess }] = useUploadUpdateApsHistoryMutation({
    fixedCacheKey: 'updateApsHistory_uploadProcess'
  });

  const handleUpload = (body, handleClose) => {
    (currentData?.status === 'IN_PROCESS' ? uploadFileProcess : uploadFile)({ uid, type: '/file', body }).then(
      (res) => {
        if (!res?.error) {
          handleClose();
          if (isFormedWithInterval) {
            setTab('files_dko');
          } else {
            setTab('files');
          }
          refetch();
        }
      }
    );
  };

  return (
    <>
      <CircleButton type={'upload'} title={t('CONTROLS.IMPORT_FILE')} onClick={() => setOpen(true)} />
      <SimpleImportModal
        title={title}
        openUpload={open}
        setOpenUpload={setOpen}
        handleUpload={handleUpload}
        layoutList={layoutList}
        uploading={isLoading || isLoadingProcess}
        error={error?.data || errorProcess?.data}
      />
    </>
  );
};

export default UploadDialog;
