import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import SimpleImportModal from '../../../Components/Modal/SimpleImportModal';
import CircleButton from '../../../Components/Theme/Buttons/CircleButton';
import { useTranslation } from 'react-i18next';
import { useUpdateUpdateSubApMeterMutation } from './api';

const UploadDialog = ({ setLoading }) => {
  const { uid } = useParams();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [update, { isLoading }] = useUpdateUpdateSubApMeterMutation();

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading]);

  return (
    <>
      <CircleButton
        type={'upload'}
        title={t('CONTROLS.IMPORT_FILE')}
        onClick={() => setOpen(true)}
        disabled={isLoading}
      />
      <SimpleImportModal
        title={t('IMPORT_AP_FILES')}
        openUpload={open}
        setOpenUpload={setOpen}
        handleUpload={(body, handleClose) => {
          update({ body, uid, type: 'upload' }).finally(() => handleClose());
        }}
        layoutList={[
          {
            key: 'file_original',
            label: t('IMPORT_FILE.SELECT_FILE_IN_FORMAT_XLS_XLSX_XLSM'),
            accept: '.xls,.xlsx,.xlsm'
          },
          { key: 'file_original_key', label: t('IMPORT_FILE.SELECT_DIGITAL_SIGNATURE_FILE'), accept: '.p7s' }
        ]}
      />
    </>
  );
};

export default UploadDialog;
