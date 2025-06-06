import Page from '../../Components/Global/Page';
import { useTranslation } from 'react-i18next';
import CircleButton from '../../Components/Theme/Buttons/CircleButton';
import { checkPermissions } from '../../util/verifyRole';
import React, { useState } from 'react';
import { DHTab, DHTabs } from '../../Components/pages/Processes/Components/Tabs';
import { Box } from '@mui/material';
import Terms from './Terms';
import Files from './Files';
import { useSelector } from 'react-redux';
import SimpleImportModal from '../../Components/Modal/SimpleImportModal';
import { useLazyDownloadQuery, useUploadMutation } from './api';
import useImportFileLog from '../../services/actionsLog/useImportFileLog';

export const PUBLICATION_CMD_ACCEPT_PERMISION = 'PUBLICATION_CMD.ACCESS';
export const PUBLICATION_CMD_ACCEPT_ROLES = ['АКО_Процеси', 'СВБ', 'ОДКО'];

const TABS = {
  TERMS: 'terms',
  FILES: 'files',
}

const PublicationCMD = () => {
  const { t } = useTranslation();
  const [openUpload, setOpenUpload] = useState(false);
  const loading = useSelector(state => state.publicationCMD.loading.length > 0);
  const [tab, setTab] = useState(TABS.TERMS);
  const [onUpload, {isLoading, error}] = useUploadMutation();
  const [onDownload, {isLoading: downloading}] = useLazyDownloadQuery();
  const importFileLog = useImportFileLog();

  const handleChangeTab = (...args) => {
    setTab(args[1]);
  };

  const handleDownload = () => {
    onDownload();
  }

  const handleUpload = (formData) => {
    onUpload(formData).then((res) => {
      setOpenUpload(false);
      if (res?.data?.status === 'ok') {
        setTab(TABS.FILES);
      }
    });
    importFileLog();
  }

  return (
    <Page
      pageName={t('PAGES.PUBLICATION_CMD')}
      backRoute={'/'}
      acceptPermisions={PUBLICATION_CMD_ACCEPT_PERMISION}
      acceptRoles={PUBLICATION_CMD_ACCEPT_ROLES}
      faqKey={'INFORMATION_BASE__PUBLICATION_CMD'}
      loading={loading || isLoading || downloading}
      controls={
        <>
          {checkPermissions('PUBLICATION_CMD.CONTROLS.UPLOAD', ['АКО_Процеси']) && (
            <CircleButton type={'upload'} title={t('CONTROLS.IMPORT')} onClick={() => setOpenUpload(true)} />
          )}
          <CircleButton type={'download'} title={t('CONTROLS.DOWNLOAD')} onClick={handleDownload} />
        </>
      }
    >
      <Box className={'boxShadow'} sx={{ px: 3, mb: 2 }}>
        <DHTabs value={tab} onChange={handleChangeTab}>
          <DHTab label={t('PUBLICATION_CMD_TERMS')} value={TABS.TERMS} />
          {
            checkPermissions('PUBLICATION_CMD.TABS.FILES', ['АКО_Процеси']) &&
            <DHTab label={t('DOWNLOADED_FILES')} value={TABS.FILES} />
          }
        </DHTabs>
      </Box>
      {tab === TABS.TERMS && <Terms/>}
      {tab === TABS.FILES && <Files/>}
      <SimpleImportModal
        title={t('IMPORT_FILE.IMPORT_FILE')}
        openUpload={openUpload}
        setOpenUpload={setOpenUpload}
        handleUpload={handleUpload}
        layoutList={[
          {
            key: 'file_original',
            label: t('IMPORT_FILE.SELECT_FILE_FORMAT', { format: '.xls, .xlsx, .xlm' }),
            accept: '.xls,.xlsx,.xlm',
            maxSize: 50000000,
            sizeError: t('VERIFY_MSG.MAX_FILE_SIZE', {size: 50})
          }
        ]}
        uploading={isLoading}
        error={error?.data}
      />
    </Page>
  );
};

export default PublicationCMD;
