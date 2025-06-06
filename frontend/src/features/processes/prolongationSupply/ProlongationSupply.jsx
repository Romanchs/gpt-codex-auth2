import Grid from '@material-ui/core/Grid';
import moment from 'moment';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import Page from '../../../Components/Global/Page';
import CircleButton from '../../../Components/Theme/Buttons/CircleButton';
import DelegateBtn from '../../delegate/delegateBtn';
import Statuses from '../../../Components/Theme/Components/Statuses';
import DelegateInput from '../../delegate/delegateInput';
import { UploadedFilesTable } from '../../../Components/pages/Processes/Components/UploadedFilesTable';
import SimpleImportModal from '../../../Components/Modal/SimpleImportModal';
import CancelModal from '../../../Components/Modal/CancelModal';
import {
  useProlongationSupplyQuery,
  useProlongationSupplyUploadMutation,
  useUpdateProlongationSupplyMutation
} from './api';
import StyledInput from '../../../Components/Theme/Fields/StyledInput';
import { useTranslation } from 'react-i18next';

export const PROLONGATION_SUPPLY_ACCEPT_ROLES = [
  'СВБ',
  'АКО',
  'АКО_Процеси',
  'АКО_ППКО',
  'АКО_Користувачі',
  'АКО_Довідники'
];

const ProlongationSupply = () => {
  const { uid } = useParams();
  const { t } = useTranslation();
  const [openDelete, setOpenDelete] = useState(false);
  const [openUpload, setOpenUpload] = useState(false);
  const [delegating, setDelegating] = useState(false);
  const { currentData: currentProcess, isLoading, isError, refetch } = useProlongationSupplyQuery(uid);
  const [update, { isLoading: updating }] = useUpdateProlongationSupplyMutation();
  const [upload, { isLoading: uploading, error }] = useProlongationSupplyUploadMutation();

  const loading = isLoading || updating || delegating || uploading;

  const handleCancel = () => {
    setOpenDelete(false);
    update({ uid, type: 'cancel' });
  };

  const handleDone = () => {
    update({ uid, type: 'complete' });
  };

  return (
    <Page
      pageName={
        currentProcess?.id
          ? t('PAGES.EXTENDING_TERM_OF_SUPPLY_CONTRACT_ID', { id: currentProcess?.id })
          : t('PAGES.EXTENDING_TERM_OF_SUPPLY_CONTRACT')
      }
      acceptPermisions={'PROCESSES.PROLONGATION_SUPPLY.ACCESS'}
      acceptRoles={PROLONGATION_SUPPLY_ACCEPT_ROLES}
      backRoute={'/processes'}
      faqKey={'PROCESSES__PROLONGATION_SUPPLY'}
      notFoundMessage={isError && t('REQUEST_NOT_FOUND')}
      loading={loading || delegating || uploading}
      controls={
        <>
          {currentProcess?.can_cancel && (
            <CircleButton
              type={'remove'}
              title={t('CONTROLS.CANCEL_PROCESS')}
              onClick={() => setOpenDelete(true)}
              disabled={loading}
            />
          )}
          {currentProcess?.can_delegate && (
            <DelegateBtn
              process_uid={uid}
              onStarted={() => setDelegating(true)}
              onFinished={() => setDelegating(false)}
              onSuccess={() => window.location.reload()}
            />
          )}
          {currentProcess?.can_upload && (
            <CircleButton
              type={'upload'}
              title={t('CONTROLS.IMPORT')}
              onClick={() => setOpenUpload(true)}
              disabled={loading}
            />
          )}
          {currentProcess?.can_complete && (
            <CircleButton type={'done'} title={t('CONTROLS.DONE_PROCESS')} onClick={handleDone} disabled={loading} />
          )}
        </>
      }
    >
      <Statuses
        statuses={['NEW', 'IN_PROCESS', 'DONE', 'PARTIALLY_DONE', 'CANCELED']}
        currentStatus={currentProcess?.status}
      />
      <div className={'boxShadow'} style={{ padding: 24, marginTop: 16, marginBottom: 16 }}>
        <Grid container spacing={3} alignItems={'flex-start'}>
          <Grid item xs={12} md={6} lg={3}>
            <DelegateInput
              label={t('FIELDS.USER_INITIATOR')}
              disabled
              value={currentProcess?.executor?.username}
              data={currentProcess?.delegation_history || []}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={9}>
            <StyledInput
              label={t('FIELDS.INITIATOR_COMPANY')}
              disabled
              value={currentProcess?.executor_company?.short_name}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <StyledInput
              label={t('FIELDS.CREATED_AT')}
              disabled
              value={currentProcess?.started_at && moment(currentProcess?.started_at).format('DD.MM.yyyy • HH:mm')}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <StyledInput
              label={
                currentProcess?.status?.startsWith('CANCELED') ? t('FIELDS.CANCELED_AT') : t('FIELDS.COMPLETE_DATETIME')
              }
              disabled
              value={
                currentProcess?.status?.startsWith('CANCELED')
                  ? currentProcess?.canceled_at && moment(currentProcess?.canceled_at).format('DD.MM.yyyy • HH:mm')
                  : currentProcess?.finished_at && moment(currentProcess?.finished_at).format('DD.MM.yyyy • HH:mm')
              }
            />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <StyledInput label={t('FIELDS.UNIQUE_APS')} disabled value={currentProcess?.successful?.toString()} />
          </Grid>
        </Grid>
      </div>
      <h3
        style={{
          fontSize: 16,
          fontWeight: 'normal',
          color: '#0D244D',
          lineHeight: 1.2,
          paddingBottom: 12
        }}
      >
        {t('TOTAL_NUMBER_OF_FILES_UPLOADEDP_AS_PART_OF_THE_APPLICATION')}:
      </h3>
      <UploadedFilesTable
        files={currentProcess?.files || []}
        handleUpdateList={refetch}
        tags={['Продовження терміну договору на постачання']}
      />
      <SimpleImportModal
        title={t('IMPORT_AP_FILES')}
        openUpload={openUpload}
        setOpenUpload={setOpenUpload}
        handleUpload={(formData, handleClose) => {
          upload({ uid, body: formData });
          handleClose();
        }}
        layoutList={[
          {
            key: 'file_original',
            label: t('IMPORT_FILE.SELECT_FILE_FORMAT', { format: '.xls, .xlsx, .xlsm' }),
            accept: '.xls,.xlsx,.xlsm',
            maxSize: 15000000,
            sizeError: t('VERIFY_MSG.MAX_FILE_SIZE', { size: 15 })
          },
          {
            key: 'file_original_key',
            label: t('IMPORT_FILE.SELECT_DIGITAL_SIGNATURE_FILE'),
            accept: '.p7s',
            maxSize: 40960,
            sizeError: t('VERIFY_MSG.UNCORRECT_SIGNATURE')
          }
        ]}
        uploading={uploading}
        error={error}
      />
      <CancelModal
        text={t('CANCEL_PROCESS_CONFIRM_UNSAVING_CHANGES')}
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        onSubmit={handleCancel}
      />
    </Page>
  );
};

export default ProlongationSupply;
