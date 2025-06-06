import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import moment from 'moment';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import Page from '../../../Components/Global/Page';
import CancelModal from '../../../Components/Modal/CancelModal';
import SimpleImportModal from '../../../Components/Modal/SimpleImportModal';
import CircleButton from '../../../Components/Theme/Buttons/CircleButton';
import Statuses from '../../../Components/Theme/Components/Statuses';
import StyledInput from '../../../Components/Theme/Fields/StyledInput';
import { Pagination } from '../../../Components/Theme/Table/Pagination';
import { UploadedFilesTable } from '../../../Components/pages/Processes/Components/UploadedFilesTable';
import DelegateBtn from '../../delegate/delegateBtn';
import DelegateInput from '../../delegate/delegateInput';
import { checkPermissions } from '../../../util/verifyRole';
import {
  useInitCreateTKOMutation,
  useUpdateCreateTKOMutation,
  useUploadCreateTKOMutation,
  useGetCreateTKOQuery
} from './api';
import { useTranslation } from 'react-i18next';
import { useLazyMsFilesDownloadQuery } from '../../../app/mainApi';
import useExportFileLog from '../../../services/actionsLog/useEportFileLog';

export const CREATE_TKO_ACCESS_ACCEPT_ROLES = ['АТКО', 'АКО', 'АКО_Процеси', 'АКО_Користувачі'];

const CreateTKO = () => {
  const { uid } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { activeOrganization, full_name } = useSelector(({ user }) => user);
  const [openCancel, setOpenCancel] = useState(false);
  const [openUpload, setOpenUpload] = useState(false);
  const [delegating, setDelegating] = useState(false);
  const [params, setParams] = useState({ page: 1, size: 25 });

  const [initProcess, { isLoading: isCreating }] = useInitCreateTKOMutation();
  const [update, { isLoading }] = useUpdateCreateTKOMutation();
  const [uploadFile, { isLoading: uploading, error: uploadingError }] = useUploadCreateTKOMutation();
  const [downloadFile] = useLazyMsFilesDownloadQuery();

  const exportFileLog = useExportFileLog(['Створення ТКО']);

  const { currentData, isFetching, isError, refetch } = useGetCreateTKOQuery(
    { uid, params },
    {
      skip: !uid
    }
  );

  return (
    <Page
      acceptPermisions={uid ? 'PROCESSES.CREATE_TKO.ACCESS' : 'PROCESSES.CREATE_TKO.INITIALIZATION'}
      acceptRoles={uid ? CREATE_TKO_ACCESS_ACCEPT_ROLES : ['АТКО']}
      faqKey={'PROCESSES__CREATE_TKO'}
      pageName={
        isFetching
          ? `${t('LOADING')}...`
          : currentData?.id
          ? t('PAGES.CREATE_TKO_ID', { id: currentData?.id })
          : t('PAGES.CREATE_TKO')
      }
      backRoute={'/processes'}
      loading={isCreating || isFetching || isLoading || uploading || delegating}
      notFoundMessage={isError && t('PROCESS_NOT_FOUND')}
      controls={
        <>
          {!uid && (
            <CircleButton
              type={'create'}
              title={t('CONTROLS.TAKE_TO_WORK')}
              onClick={() => {
                initProcess().then((res) => {
                  if (res?.data?.uid) {
                    navigate(res.data.uid, { replace: true });
                  }
                });
              }}
              disabled={isFetching}
              dataMarker={'init-button'}
            />
          )}
          {currentData?.status && currentData?.status !== 'DONE' && currentData?.status !== 'CANCELED' && (
            <>
              {currentData?.can_cancel && (
                <CircleButton
                  type={'remove'}
                  title={t('CONTROLS.CANCEL')}
                  dataMarker={'tko-disputes-cancel'}
                  onClick={() => setOpenCancel(true)}
                />
              )}
              {currentData?.can_delete_files && (
                <CircleButton
                  type={'delete'}
                  title={t('CONTROLS.DELETE_FILES')}
                  onClick={() => update({ uid, type: '/delete' })}
                  dataMarker={'remove-button'}
                />
              )}
              {currentData?.can_upload && (
                <CircleButton
                  type={'upload'}
                  title={t('CONTROLS.IMPORT')}
                  onClick={() => setOpenUpload(true)}
                  dataMarker={'upload-button'}
                />
              )}
              {currentData?.status === 'IN_PROCESS' &&
                checkPermissions('PROCESSES.CREATE_TKO.CONTROLS.DONE', 'АТКО') && (
                  <CircleButton
                    type={'done'}
                    title={t('CONTROLS.DONE_PROCESS')}
                    onClick={() => update({ uid, type: '/complete' })}
                    dataMarker={'done-button'}
                    dataStatus={currentData?.can_complete ? 'active' : 'disabled'}
                    disabled={!currentData?.can_complete}
                  />
                )}
              {currentData?.can_delegate && (
                <DelegateBtn
                  process_uid={uid}
                  onStarted={() => setDelegating(true)}
                  onFinished={() => setDelegating(false)}
                  onSuccess={() => window.location.reload()}
                />
              )}
            </>
          )}
        </>
      }
    >
      <Statuses
        statuses={['NEW', 'IN_PROCESS', 'DONE', 'PARTIALLY_DONE', 'CANCELED']}
        currentStatus={uid ? currentData?.status : 'NEW'}
      />
      <Box className={'boxShadow'} sx={{ mt: 2, mb: 2, p: 3 }}>
        <Grid container spacing={3} alignItems={'flex-start'}>
          <Grid item xs={12} md={6} lg={3}>
            <DelegateInput
              label={t('FIELDS.USER_INITIATOR')}
              value={uid ? currentData?.initiator?.username : full_name}
              disabled
              data={currentData?.delegation_history || []}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <StyledInput
              label={t('FIELDS.START_WORK_DATE')}
              value={
                uid
                  ? currentData?.created_at && moment(currentData?.created_at).format('DD.MM.yyyy • HH:mm')
                  : moment().format('DD.MM.yyyy • HH:mm')
              }
              disabled
            />
          </Grid>
          <Grid item xs={12} md={6} lg={8}>
            <StyledInput
              label={t('FIELDS.INITIATOR_COMPANY')}
              value={uid ? currentData?.initiator_company?.full_name : activeOrganization?.name}
              disabled
            />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <StyledInput
              label={
                currentData?.status.startsWith('CANCELED') ? t('FIELDS.CANCELED_AT') : t('FIELDS.COMPLETE_DATETIME')
              }
              value={currentData?.finished_at && moment(currentData?.finished_at).format('DD.MM.yyyy • HH:mm')}
              disabled
            />
          </Grid>
        </Grid>
      </Box>
      {uid && (
        <>
          <Box>
            <Box
              component={'h3'}
              sx={{
                fontSize: 15,
                fontWeight: 'normal',
                color: '#0D244D',
                lineHeight: 1.2,
                pt: 2,
                pb: 2
              }}
            >
              {t('TOTAL_NUMBER_UPLOADED_AP_IN_REQUEST')}:
            </Box>
            <UploadedFilesTable
              files={currentData?.files?.data || []}
              handleDownload={(file) => {
                downloadFile({ id: file?.file_processed_id, name: file?.file_name });
                exportFileLog(uid);
              }}
              handleUpdateList={refetch}
            />
            <Pagination
              {...currentData?.files}
              loading={isFetching}
              params={params}
              onPaginate={(v) => setParams({ ...params, ...v })}
            />
          </Box>
          <SimpleImportModal
            title={t('IMPORT_AP_FILES')}
            openUpload={openUpload}
            setOpenUpload={setOpenUpload}
            handleUpload={(formData, handleClose) => {
              uploadFile({ uid, formData }).then((res) => {
                if (!res?.error) handleClose();
              });
            }}
            layoutList={[
              {
                key: 'file_original',
                label: t('IMPORT_FILE.SELECT_FILE_WITH_AP_INFORMAT', { format: '.xls, .xlsx, .xlsm' }),
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
            error={uploadingError?.data}
          />
          <CancelModal
            text={t('CANCEL_PROCESS_CONFIRMATION')}
            open={openCancel}
            onClose={() => setOpenCancel(false)}
            onSubmit={() => {
              update({ uid, type: '/cancel' }).then((res) => {
                if (!res?.error) {
                  setOpenCancel(false);
                  navigate('/processes');
                }
              });
            }}
          />
        </>
      )}
    </Page>
  );
};

export default CreateTKO;
