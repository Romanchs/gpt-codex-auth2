import Grid from '@material-ui/core/Grid';
import HighlightOffRounded from '@mui/icons-material/HighlightOffRounded';
import NoteAddRounded from '@mui/icons-material/NoteAddRounded';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Page from '../../../Components/Global/Page';
import CircleButton from '../../../Components/Theme/Buttons/CircleButton';
import Statuses from '../../../Components/Theme/Components/Statuses';
import {
  useActivateDeactivateTkoProcessQuery,
  useCancelActivateDeactivateTkoMutation,
  useFormedActivateDeactivateTkoMutation,
  useUploadFileWithTKOMutation
} from './api';
import DetailsTab from './DetailsTab';
import { BlueButton } from '../../../Components/Theme/Buttons/BlueButton';
import { DangerButton } from '../../../Components/Theme/Buttons/DangerButton';
import { ModalWrapper } from '../../../Components/Modal/ModalWrapper';
import { DHTab, DHTabs } from '../../../Components/pages/Processes/Components/Tabs';
import SimpleImportModal from '../../../Components/Modal/SimpleImportModal';
import UploadedFiles from './UploadedFiles';
import { ACTION_TYPES, ACTIVATE_AP_LOG, DEACTIVATE_AP_LOG } from './data';
import ProviderRequest from './ProviderRequest';
import { Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';
import useCancelProcessLog from '../../../services/actionsLog/useCancelProcessLog';
import useImportFileLog from '../../../services/actionsLog/useImportFileLog';
import useViewLog from '../../../services/actionsLog/useViewLog';
import useFormProcessLog from '../../../services/actionsLog/useFormProcessLog';

export const ACTIVATE_DEACTIVATE_ACCEPT_ROLES = ['АКО', 'АКО_Процеси', 'АКО_Користувачі', 'АТКО', 'СВБ'];

const ActivateDeactivateDetails = () => {
  const { t } = useTranslation();
  const { uid } = useParams();
  const navigate = useNavigate();
  const { data: currentProcess, isFetching: loading, error } = useActivateDeactivateTkoProcessQuery(uid);
  const [cancel, { isFetching: isCanseling }] = useCancelActivateDeactivateTkoMutation();
  const [formed, { isFetching: isForming }] = useFormedActivateDeactivateTkoMutation({
    fixedCacheKey: 'formActivateDeactivateTko'
  });
  const [uploadFile, { isLoading: uploading, error: uploadError }] = useUploadFileWithTKOMutation();
  const [tab, setTab] = useState('details');
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openImportFile, setOpenImportFile] = useState(false);
  const [mustBeFinishedAt, setMustBeFinishedAt] = useState('');

  const logTags = useMemo(() => {
    if (currentProcess?.process_type === ACTION_TYPES.activating) return ACTIVATE_AP_LOG;
    return DEACTIVATE_AP_LOG;
  }, [currentProcess]);

  const viewLog = useViewLog(logTags);
  const cancelProcessLog = useCancelProcessLog(logTags);
  const importFileLog = useImportFileLog(logTags);
  const formProcessLog = useFormProcessLog(logTags)

  useEffect(() => {
    if (!currentProcess) return;
    viewLog(uid);
  }, [currentProcess]);

  useEffect(() => {
    if (error?.status == 403) navigate('/processes');
  }, [error]);

  const handleCancel = () => {
    setOpenDeleteDialog(false);
    cancel(uid).then(() => cancelProcessLog(uid));
  };

  const handlForm = () => {
    setOpenDeleteDialog(false);
    formed({
      uid,
      body: { process_type: currentProcess.process_type, must_be_finished_at: mustBeFinishedAt }
    }).then(() => formProcessLog(uid))
  };

  const handleChangeTab = (event, newValue) => {
    setTab(newValue);
  };

  const handleUpload = (data) => {
    uploadFile({ body: data, uid }).then(() => {
      setOpenImportFile(false);
      setTab('files');
      importFileLog(uid);
    });
  };

  const getPageName = () => {
    if (!currentProcess) return `${t('LOADING')}...`;
    if (currentProcess.process_type === ACTION_TYPES.activating)
      return t('PAGES.ACTIVATE_AP', { id: currentProcess?.id });
    return t('PAGES.DEACTIVATE_AP', { id: currentProcess?.id });
  };

  const getFaqKey = () => {
    if (currentProcess && currentProcess.process_type === ACTION_TYPES.activating)
      return 'PROCESSES__ACTIVATING_AP';
    return 'PROCESSES__DEACTIVATING_AP';
  };

  return (
    <>
      <Page
        pageName={getPageName()}
        faqKey={getFaqKey()}
        backRoute={'/processes'}
        loading={loading || isCanseling || uploading || isForming}
        acceptPermisions={'PROCESSES.ACTIVATING_DEACTIVATING.ACCESS'}
        acceptRoles={ACTIVATE_DEACTIVATE_ACCEPT_ROLES}
        notFoundMessage={error && t('PROCESS_NOT_FOUND')}
        controls={
          <>
            {currentProcess?.can_upload && (
              <CircleButton
                title={t('DOWNLOAD_APPLICATION_FOR_ACTIVATION_DEACTIVATION_AP')}
                color={'blue'}
                type={'upload'}
                onClick={() => setOpenImportFile(true)}
                dataMarker={'uploadFile'}
              />
            )}
            {currentProcess?.can_cancel && (
              <CircleButton
                icon={<HighlightOffRounded />}
                color={'red'}
                title={t('CONTROLS.CANCEL')}
                dataMarker={'cancel'}
                onClick={() => setOpenDeleteDialog(true)}
              />
            )}
            {currentProcess?.can_form && (
              <CircleButton
                icon={<NoteAddRounded />}
                color={'green'}
                title={t('CONTROLS.FORM')}
                dataMarker={'formed'}
                onClick={handlForm}
              />
            )}
          </>
        }
      >
        <Statuses
          statuses={['NEW', 'IN_PROCESS', 'FORMED', 'DONE', 'CANCELED']}
          currentStatus={currentProcess?.status}
        />
        <div className={'boxShadow'} style={{ paddingLeft: 24, paddingRight: 24, marginTop: 16, marginBottom: 16 }}>
          <DHTabs value={tab} onChange={handleChangeTab}>
            <DHTab label={t('REQUEST_DETAILS')} value={'details'} />
            <DHTab label={t('DOWNLOADED_FILES_FOR_REQUEST')} value={'files'} />
            {currentProcess?.status !== 'IN_PROCESS' && currentProcess?.process_type === ACTION_TYPES.activating && (
              <DHTab label={t('REQUEST_FOR_PROVIDER')} value={'requestForProvider'} />
            )}
            {currentProcess?.status !== 'IN_PROCESS' && <DHTab label={t('REQUEST_FOR_RECORDING')} disabled />}
          </DHTabs>
        </div>
        {tab === 'details' && (
          <DetailsTab
            mustBeFinishedAt={mustBeFinishedAt}
            setMustBeFinishedAt={setMustBeFinishedAt}
            logTags={logTags}
          />
        )}
        {tab === 'files' && <UploadedFiles data={currentProcess} tags={logTags} />}
        {tab === 'requestForProvider' && <ProviderRequest />}
        <ModalWrapper
          header={t('CANCEL_REQUEST_MODAL_TITLE')}
          open={openDeleteDialog}
          onClose={() => setOpenDeleteDialog(false)}
        >
          <Stack direction={'row'} sx={{ pt: 3 }} justifyContent={'space-between'} spacing={1}>
            <Grid container spacing={3}>
              <Grid item xs={6}>
                <BlueButton onClick={() => setOpenDeleteDialog(false)} style={{ width: '100%' }}>
                  {t('CONTROLS.NO')}
                </BlueButton>
              </Grid>
              <Grid item xs={6}>
                <DangerButton onClick={handleCancel} style={{ width: '100%' }}>
                  {t('CONTROLS.YES')}
                </DangerButton>
              </Grid>
            </Grid>
          </Stack>
        </ModalWrapper>
      </Page>
      <SimpleImportModal
        title={t('IMPORT_AP_FILES')}
        openUpload={openImportFile}
        setOpenUpload={setOpenImportFile}
        handleUpload={(formData) => {
          handleUpload(formData);
        }}
        layoutList={[
          {
            key: 'file_original',
            label: t('IMPORT_FILE.SELECT_FILE_WITH_AP_INFORMAT', { format: '.xlsx' }),
            accept: '.xlsx',
            maxSize: 15000000,
            sizeError: t('VERIFY_MSG.MAX_FILE_SIZE', { size: 15 })
          },
          {
            key: 'file_original_key',
            label: t('IMPORT_FILE.SELECT_DIGITAL_SIGNATURE_FILE'),
            accept: '.p7s',
            maxSize: 40960,
            sizeError: t('VERIFY_MSG.MAX_FILE_SIZE_KBYTE', { size: 40 })
          }
        ]}
        uploading={uploading}
        error={uploadError}
      />
    </>
  );
};

export default ActivateDeactivateDetails;
