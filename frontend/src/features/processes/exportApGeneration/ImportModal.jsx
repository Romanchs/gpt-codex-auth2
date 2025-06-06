import {useState} from "react";
import SimpleImportModal from "../../../Components/Modal/SimpleImportModal";
import CircleButton from "../../../Components/Theme/Buttons/CircleButton";
import {useExportApGenUploadMutation} from "./api";
import {useParams} from "react-router-dom";
import {getEnv} from "../../../util/getEnv";
import { useTranslation } from "react-i18next";

const ImportModal = () => {
  const {t} = useTranslation();
  const {uid} = useParams();
  const [open, setOpen] = useState(false);
  const [uploadFile, {isLoading: uploading, error: uploadingError}] = useExportApGenUploadMutation({
    fixedCacheKey: 'exportApGen_upload'
  });

  return (
    <>
      <CircleButton
        type={'upload'}
        title={t('CONTROLS.IMPORT')}
        onClick={() => setOpen(true)}
      />
      <SimpleImportModal
        title={t('IMPORT_FILE_WITH_IDENTIFIERS')}
        openUpload={open}
        setOpenUpload={setOpen}
        handleUpload={(formData, handleClose) => {
          handleClose();
          uploadFile({uid, formData});
        }}
        layoutList={[
          {
            label: `${t('IMPORT_FILE.SELECT_FILE_IN_XLS_OR_XLS')}:`,
            key: 'file_original',
            accept: '.xls,.xlsx',
            maxSize: 26214400,
            sizeError: t('VERIFY_MSG.MAX_FILE_SIZE', {size: 25})
          },
          {
            label: `${t('IMPORT_FILE.SELECT_DIGITAL_SIGNATURE_FILE')}:`, 
            key: 'file_original_key', 
            accept: '.p7s', 
            maxSize: 40960,
            sizeError: t('VERIFY_MSG.UNCORRECT_SIGNATURE')
          }
        ]}
        canUploadWithoutKey={getEnv().env === 'dev'}
        uploading={uploading}
        error={uploadingError?.data}
      />
    </>
  );
};

export default ImportModal;
