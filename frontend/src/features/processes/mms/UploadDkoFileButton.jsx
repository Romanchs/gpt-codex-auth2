import React, { useState } from 'react';
import CircleButton from '../../../Components/Theme/Buttons/CircleButton';
import SimpleImportModal from '../../../Components/Modal/SimpleImportModal';
import { useUploadDkoFileMutation } from './api';
import { useTranslation } from 'react-i18next';
import useImportFileLog from '../../../services/actionsLog/useImportFileLog';


const UploadDkoFileButton = () => {
  const {t} = useTranslation();
  const [openDialog, setOpenDialog] = useState(false);
  const [upload, { isFetching, error }] = useUploadDkoFileMutation({ fixedCacheKey: 'uploadFiles' });
  const importFileLog = useImportFileLog();

  const handleUpload = (formData) => {
    const body = new FormData();
    for (const key of formData.keys()) {
      body.append('files', formData.get(key));
    }
    upload(body).then(() => {
      setOpenDialog(false);
    });
    importFileLog();
  };

  return (
    <>
      <CircleButton type={'upload'} onClick={() => setOpenDialog(true)} title={'Імпорт'} />
      <SimpleImportModal
        title={t('IMPORT_FILE_WITH_DKO')}
        openUpload={openDialog}
        setOpenUpload={setOpenDialog}
        handleUpload={handleUpload}
        layoutList={[
          {
            key: 'file_original',
            label: t('IMPORT_FILE.SELECT_FILE_WITH_DKO'),
            accept: '.xlsx',
            maxSize: 50000000,
            sizeError: t('VERIFY_MSG.MAX_FILE_SIZE', {size: 50})
          },
          {
            key: 'file_original_key',
            label: t('IMPORT_FILE.SELECT_DIGITAL_SIGNATURE_FILE'),
            accept: '.p7s',
            maxSize: 40960,
            sizeError: t('VERIFY_MSG.UNCORRECT_SIGNATURE')
          }
        ]}
        uploading={isFetching}
        error={error?.data}
     />
    </>
  );
};

export default UploadDkoFileButton;
