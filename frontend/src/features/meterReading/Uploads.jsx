import CircleButton from '../../Components/Theme/Buttons/CircleButton';
import Page from '../../Components/Global/Page';
import React, { useState } from 'react';
import { useMeterDataUploadMutation, useMeterDataUploadsQuery } from './api';
import { checkPermissions } from '../../util/verifyRole';
import { Pagination } from '../../Components/Theme/Table/Pagination';
import { useTranslation } from 'react-i18next';
import DragDropFiles from '../../Components/pages/Processes/MMS/DragDropFiles';
import UploadsTable from './components/UploadsTable';
import useImportFileLog from '../../services/actionsLog/useImportFileLog';
import useViewCallbackLog from '../../services/actionsLog/useViewCallbackLog';

export const METER_READING_UPLOADS_ACCEPT_ROLES = ['ОЗД', 'АКО_Процеси'];

const Uploads = () => {
  const { t } = useTranslation();
  const [params, setParams] = useState({ page: 1, size: 25 });
  const [open, setOpen] = useState(false);

  const { data, isFetching } = useMeterDataUploadsQuery(params);
  const [onUpload, { isLoading }] = useMeterDataUploadMutation();

  const importFileLog = useImportFileLog();
  const onPaginateLog = useViewCallbackLog();

  const handleCloseDialog = () => {
    setOpen(false);
  };

  const handleUpload = (files) => {
    onUpload(files);
    importFileLog();
  };

  const onPaginate = (p) => {
    setParams({ ...params, ...p });
    onPaginateLog();
  }

  return (
    <Page
      pageName={t('PAGES.METER_READING')}
      backRoute={'/meter-reading/view'}
      loading={isFetching || isLoading}
      faqKey={'INFORMATION_BASE__METER_READING_UPLOADS'}
      acceptPermisions={'METER_READING.SEND_DATA.ACCESS'}
      acceptRoles={METER_READING_UPLOADS_ACCEPT_ROLES}
      controls={
        checkPermissions('METER_READING.SEND_DATA.CONTROLS.UPLOAD', ['ОЗД']) && (
          <CircleButton type={'upload'} title={t('CONTROLS.IMPORT')} onClick={() => setOpen(true)} />
        )
      }
    >
      <UploadsTable data={data} setParams={setParams} params={params} />
      <Pagination {...data} loading={isFetching} params={params} onPaginate={onPaginate} />

      <DragDropFiles
        open={open}
        handleClose={handleCloseDialog}
        onUpload={handleUpload}
        maxCount={50}
        keyMaxSize={35}
      />

      {/*<SimpleImportModal*/}
      {/*  title={t('IMPORT_METER_READINGS_FILES')}*/}
      {/*  openUpload={open}*/}
      {/*  setOpenUpload={setOpen}*/}
      {/*  handleUpload={(formData, onClose) => {*/}
      {/*    onUpload(formData).then((res) => {*/}
      {/*      if (!res?.error) onClose();*/}
      {/*    });*/}
      {/*  }}*/}
      {/*  layoutList={[*/}
      {/*    {*/}
      {/*      label: `${t('IMPORT_FILE.SELECT_FILE_FORMAT', {format: '.xml'})}:`,*/}
      {/*      key: 'file_original',*/}
      {/*      accept: '.xml',*/}
      {/*      maxSize: 26214400,*/}
      {/*      sizeError: t('VERIFY_MSG.MAX_FILE_SIZE', {size: 25})*/}
      {/*    },*/}
      {/*    {*/}
      {/*      label: `${t('IMPORT_FILE.SELECT_DIGITAL_SIGNATURE_FILE')}:`,*/}
      {/*      key: 'file_original_key',*/}
      {/*      accept: '.p7s',*/}
      {/*      maxSize: 40960,*/}
      {/*      sizeError: t('VERIFY_MSG.UNCORRECT_SIGNATURE')*/}
      {/*    }*/}
      {/*  ]}*/}
      {/*  uploading={isLoading}*/}
      {/*  error={error?.data}*/}
      {/*/>*/}
    </Page>
  );
};

export default Uploads;
