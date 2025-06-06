import Page from '../../../Components/Global/Page';
import CircleButton from '../../../Components/Theme/Buttons/CircleButton';
import Statuses from '../../../Components/Theme/Components/Statuses';
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { useErpReportQuery, useUploadErpFileMutation, useFormedErpMutation } from './api';
import { DHTab, DHTabs2 } from '../../../Components/pages/Processes/Components/Tabs';
import DetailsTab from './DetailsTab';
import UploadedFilesTab from './UploadedFilesTab';
import SimpleImportModal from '../../../Components/Modal/SimpleImportModal';
import StyledInput from '../../../Components/Theme/Fields/StyledInput';
import { useTranslation } from 'react-i18next';

const tabs = ['details', 'files', 'sendedToErp'];

export const REPORT_ERP_ACCEPT_ROLES = ['АКО_Процеси'];

const ErpReportDetails = () => {
  const {t} = useTranslation();
  const { uid } = useParams();
  const [tab, setTab] = useState(tabs[0]);
  const [description, setDescription] = useState('');
  const { currentData: data, isLoading } = useErpReportQuery(uid);
  const [upload, { isFetching: uploading, error: uploadError }] = useUploadErpFileMutation();
  const [formed, { isFetching: isForming }] = useFormedErpMutation();
  const [openUpload, setOpenUpload] = useState(false);

  const handleChangeDescription = (event) => {
    const { value } = event.target;
    setDescription(value);
  };

  const handleUpload = (formData) => {
    formData.append('description', description);
    upload({ uid, data: formData }).then(() => {
      setOpenUpload(false);
      setTab(tabs[1]);
      setDescription('');
    });
  };

  const handleCloseUpload = () => {
    setOpenUpload(false);
    setDescription('');
  };

  return (
    <>
      <Page
        pageName={data?.id ? t('PAGES.ERP_REPORT_ID', {id: data?.id}) : t('PAGES.ERP_REPORT')}
        backRoute={'/processes'}
        loading={isLoading || isForming}
        acceptPermisions={'PROCESSES.ERP_REPORT.ACCESS'}
        acceptRoles={REPORT_ERP_ACCEPT_ROLES}
        faqKey={'PROCESSES__REPORT_ERP'}
        controls={
          <>
            {data?.can_form && <CircleButton type={'new'} title={t('CONTROLS.FORM')} onClick={() => formed(uid)} />}
            {data?.can_upload && (
              <CircleButton
                type={'upload'}
                title={t('CONTROLS.DOWNLOAD_FILE')}
                onClick={() => setOpenUpload(true)}
                disabled={data?.files?.length === 0}
              />
            )}
            {data?.status === 'DONE' && <CircleButton type={'send'} title={t('CONTROLS.SEND_TO_ERP')} disabled />}
          </>
        }
      >
        <Statuses statuses={['NEW', 'IN_PROCESS', 'DONE']} currentStatus={data?.status || 'NEW'} />
        <DHTabs2 value={tab} onChange={(...args) => setTab(args[1])} sx={{ marginTop: 16 }}>
          <DHTab label={t('REQUEST_DETAILS')} value={tabs[0]} />
          <DHTab label={t('DOWNLOADED_FILES')} value={tabs[1]} />
          <DHTab label={t('SENDED_DATA_TO_ERP')} value={tabs[2]} disabled />
        </DHTabs2>
        {tab === tabs[0] && <DetailsTab />}
        {tab === tabs[1] && <UploadedFilesTab />}
      </Page>
      <SimpleImportModal
        title={t('IMPORT_FILE_WITH_CORRECTIONS')}
        openUpload={openUpload}
        setOpenUpload={handleCloseUpload}
        uploading={uploading}
        handleUpload={handleUpload}
        canUploadWithoutKey
        layoutList={[
          {
            key: 'file_original',
            label: t('IMPORT_FILE.SELECT_FILE_WITH_COMPANIES_IN_FORMAT', {format: '.xlsx, .xlsm'}),
            accept: '.xlsx,.xlsm',
            maxSize: 15000000,
            sizeError: t('VERIFY_MSG.MAX_FILE_SIZE', {size: 15})
          }
        ]}
        error={uploadError}
        disabledUpload={description.trim().length > 500}
        inOneLine
      >
        {data?.status === 'DONE' && (
          <StyledInput
            label={t('FIELDS.CORRECTION_REASON')}
            value={description}
            onChange={handleChangeDescription}
            multiline
            maxRows={3}
            error={description.trim().length > 500 ? t('VERIFY_MSG.MAX_500_SYMBOLS') : null}
          />
        )}
      </SimpleImportModal>
    </>
  );
};

export default ErpReportDetails;
