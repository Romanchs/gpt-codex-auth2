import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Page from '../../../Components/Global/Page';
import CancelModal from '../../../Components/Modal/CancelModal';
import CircleButton from '../../../Components/Theme/Buttons/CircleButton';
import Statuses from '../../../Components/Theme/Components/Statuses';
import StyledInput from '../../../Components/Theme/Fields/StyledInput';
import SelectField from '../../../Components/Theme/Fields/SelectField';
import SimpleImportModal from '../../../Components/Modal/SimpleImportModal';
import { UploadedFilesTable } from '../../../Components/pages/Processes/Components/UploadedFilesTable';
import {
  useCreateAddingNewVirtualTkoMutation,
  useGetAddingNewVirtualTkoQuery,
  useInitAddingNewVirtualTkoQuery,
  useUpdateAddingNewVirtualTkoMutation,
  useUploadFileMutation
} from './api';
import DelegateBtn from '../../delegate/delegateBtn';
import DelegateInput from '../../delegate/delegateInput';
import ConfirmModal from './ConfirmModal';

export const ADDING_NEW_VIRTUAL_TKO_ACCEPT_ROLES = ['АКО', 'АКО_Процеси', 'АТКО', 'АКО_Користувачі', 'ОЗКО'];
export const ADDING_NEW_VIRTUAL_TKO_INITIALIZATION_ROLES = ['АТКО', 'ОЗКО'];

const AddingNewVirtualTko = () => {
  const { t } = useTranslation();
  const { uid } = useParams();
  const navigate = useNavigate();
  const initiator_company = useSelector((store) => store.user.organizations.find((i) => i.active).name);
  const initiator = useSelector((store) => store.user.full_name);
  const [mpType, setMpType] = useState(null);
  const [openCancel, setOpenCancel] = useState(false);
  const [openUpload, setOpenUpload] = useState(false);
  const [openReject, setOpenReject] = useState(false);
  const [openDone, setOpenDone] = useState(false);
  const [delegating, setDelegating] = useState(false);

  const { currentData: initOptions } = useInitAddingNewVirtualTkoQuery(null, { skip: uid });
  const {
    currentData,
    isFetching: fetchingTko,
    isError,
    refetch
  } = useGetAddingNewVirtualTkoQuery(uid, { skip: !uid });
  const [initProcess, { isLoading: creating }] = useCreateAddingNewVirtualTkoMutation();
  const [update, { isLoading: updating }] = useUpdateAddingNewVirtualTkoMutation();
  const [uploadFile, { isLoading: uploading, error: uploadingError }] = useUploadFileMutation();

  const isLoading = creating || updating || uploading || fetchingTko || delegating;

  useEffect(() => {
    if (!uid) setMpType(null);
  }, [uid]);

  const handleCreate = async () => {
    const { data: id } = await initProcess({ mp_type: mpType });
    if (!id) return;
    navigate(`/processes/adding-new-virtual-tko/${id}`, { replace: true });
  };

  const handleComplete = () => {
    if (currentData?.show_executor_block) {
      setOpenDone(true);
      return;
    }
    update({ uid, body: {}, type: 'complete' });
  };

  const getExecutorFinalDateField = () => {
    if (currentData?.status == 'DONE')
      return (
        <StyledInput
          label={t('FIELDS.COMPLETE_DATETIME')}
          value={currentData?.completed_at && moment(currentData?.completed_at).format('DD.MM.yyyy • HH:mm')}
          readOnly
        />
      );
    if (currentData?.status == 'REJECTED')
      return (
        <StyledInput
          label={t('FIELDS.REQUEST_CANCEL_REJECTED_DATE')}
          value={currentData?.finished_at && moment(currentData?.finished_at).format('DD.MM.yyyy • HH:mm')}
          readOnly
        />
      );
    if (currentData?.status == 'CANCELED' || currentData?.status == 'CANCELED_BY_OWNER')
      return (
        <StyledInput
          label={t('FIELDS.CANCELED_AT')}
          value={currentData?.finished_at && moment(currentData?.finished_at).format('DD.MM.yyyy • HH:mm')}
          readOnly
        />
      );
    return (
      <StyledInput
        label={t('FIELDS.MUST_BE_FINISHED_AT')}
        value={currentData?.must_be_finished_at ? moment(currentData?.must_be_finished_at).format('DD.MM.yyyy') : ''}
        readOnly
      />
    );
  };

  const isExecutorInfoVisible =
    currentData?.show_executor_block &&
    ['FORMED', 'DONE', 'PARTIALLY_DONE', 'CANCELED', 'CANCELED_BY_OWNER', 'REJECTED'].includes(currentData?.status);

  return (
    <Page
      acceptPermisions={
        uid ? 'PROCESSES.ADDING_NEW_VIRTUAL_TKO.ACCESS' : 'PROCESSES.ADDING_NEW_VIRTUAL_TKO.INITIALIZATION'
      }
      acceptRoles={uid ? ADDING_NEW_VIRTUAL_TKO_ACCEPT_ROLES : ADDING_NEW_VIRTUAL_TKO_INITIALIZATION_ROLES}
      faqKey={'PROCESSES__CREATE_METERING_POINT'}
      pageName={
        isLoading
          ? `${t('LOADING')}...`
          : currentData?.id
          ? t('PAGES.ADDING_NEW_VIRTUAL_TKO_ID', { id: currentData?.id })
          : t('PAGES.ADDING_NEW_VIRTUAL_TKO')
      }
      backRoute={'/processes'}
      loading={isLoading}
      notFoundMessage={isError && t('PROCESS_NOT_FOUND')}
      controls={
        <>
          {!currentData && mpType && (
            <CircleButton type={'create'} title={t('CONTROLS.TAKE_TO_WORK')} onClick={handleCreate} />
          )}
          {currentData?.can_take_to_work && (
            <CircleButton
              type={'create'}
              title={t('CONTROLS.TAKE_TO_WORK')}
              onClick={() => update({ uid, type: 'take-to-work' })}
              dataMarker={'adding-new-virtual-tko-take-to-work'}
            />
          )}
          {currentData?.can_form && (
            <CircleButton
              type={'new'}
              title={t('CONTROLS.FORM')}
              dataMarker={'adding-new-virtual-tko-form'}
              onClick={() => update({ uid, type: 'to-form' })}
            />
          )}
          {currentData?.can_reject && (
            <CircleButton
              type={'remove'}
              title={t('CONTROLS.REMOVE_PROCESS')}
              onClick={() => setOpenReject(true)}
              dataMarker={'adding-new-virtual-tko-reject'}
            />
          )}
          {currentData?.can_complete && (
            <CircleButton
              type={'done'}
              title={t('CONTROLS.PERFORM')}
              onClick={handleComplete}
              dataMarker={'adding-new-virtual-tko-complete'}
            />
          )}
          {currentData?.can_prolong && (
            <CircleButton
              type={'update'}
              title={t('CONTROLS.CONTINUE_REVIEW', { days: 5 })}
              onClick={() => update({ uid, type: 'prolong' })}
              dataMarker={'adding-new-virtual-tko-update'}
            />
          )}
          {currentData?.can_cancel && (
            <CircleButton
              type={'remove'}
              title={t('CONTROLS.CANCEL_PROCESS')}
              dataMarker={'adding-new-virtual-tko-cancel'}
              onClick={() => setOpenCancel(true)}
            />
          )}
          {currentData?.can_upload && (
            <CircleButton
              type={'upload'}
              title={t('CONTROLS.IMPORT')}
              dataMarker={'adding-new-virtual-tko-upload'}
              onClick={() => setOpenUpload(true)}
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
      }
    >
      <Statuses
        statuses={['NEW', 'IN_PROCESS', 'FORMED', 'DONE', 'PARTIALLY_DONE', 'CANCELED', 'REJECTED']}
        currentStatus={currentData?.status || 'NEW'}
      />
      <Box className={'boxShadow'} sx={{ mt: 2, p: '20px 24px' }}>
        <Grid container spacing={2} alignItems={'flex-start'}>
          <Grid item xs={12} md={6} lg={6}>
            {currentData?.delegate_initiator ? (
              <DelegateInput
                label={t('FIELDS.USER_INITIATOR')}
                value={currentData?.initiator?.username || initiator || ''}
                readOnly
                data={currentData?.delegation_history || []}
              />
            ) : (
              <StyledInput
                label={t('FIELDS.USER_INITIATOR')}
                value={currentData?.initiator?.username || initiator || ''}
                readOnly
              />
            )}
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <StyledInput
              label={t('FIELDS.CREATED_AT')}
              value={
                currentData?.created_at
                  ? moment(currentData?.created_at).format('DD.MM.yyyy • HH:mm')
                  : moment().format('DD.MM.yyyy • HH:mm')
              }
              readOnly
            />
          </Grid>
          {!currentData?.show_executor_block && (
            <Grid item xs={12} md={6} lg={3}>
              <StyledInput
                label={t('FIELDS.COMPLETE_DATETIME')}
                value={
                  currentData?.status === 'DONE' || currentData?.status === 'PARTIALLY_DONE'
                    ? currentData?.finished_at && moment(currentData?.finished_at).format('DD.MM.yyyy • HH:mm')
                    : ''
                }
                readOnly
              />
            </Grid>
          )}
          <Grid item xs={12} md={6} lg={3}>
            <SelectField
              onChange={setMpType}
              value={currentData?.mp_type?.value || mpType}
              label={t('FIELDS.AP_TYPE')}
              data={
                initOptions?.mp_type?.map(({ value }) => ({ value, label: `PLATFORM.${value?.toUpperCase()}` })) ||
                (currentData?.mp_type
                  ? [{ ...currentData?.mp_type, label: `PLATFORM.${currentData?.mp_type.value?.toUpperCase()}` }]
                  : [])
              }
              readOnly={Boolean(currentData)}
              dataMarker={'mp_type'}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <StyledInput
              label={t('FIELDS.UNIQUE_APS')}
              value={currentData ? String(currentData.successful) : ''}
              readOnly
            />
          </Grid>
          {!currentData?.show_executor_block && (
            <Grid item xs={12} md={6} lg={3}>
              <StyledInput
                label={t('FIELDS.CANCELED_AT')}
                value={
                  currentData?.status === 'CANCELED_BY_OWNER'
                    ? currentData?.finished_at && moment(currentData?.finished_at).format('DD.MM.yyyy • HH:mm')
                    : ''
                }
                readOnly
              />
            </Grid>
          )}
          <Grid item xs={12}>
            <StyledInput
              label={t('FIELDS.INITIATOR_COMPANY')}
              value={currentData?.initiator_company?.short_name || initiator_company || ''}
              readOnly
            />
          </Grid>
        </Grid>
      </Box>
      {isExecutorInfoVisible && (
        <Box className={'boxShadow'} sx={{ mt: 2, p: '20px 24px' }}>
          <Grid container spacing={2} alignItems={'flex-start'}>
            <Grid item xs={12} md={6} lg={6}>
              <StyledInput label={t('FIELDS.USER_EXECUTOR')} value={currentData?.executor?.username || ''} readOnly />
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
              <StyledInput
                label={t('FIELDS.START_WORK_DATE')}
                value={
                  currentData?.started_at
                    ? moment(currentData?.started_at).format('DD.MM.yyyy • HH:mm')
                    : moment().format('DD.MM.yyyy • HH:mm')
                }
                readOnly
              />
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
              {getExecutorFinalDateField()}
            </Grid>
            <Grid item xs={12}>
              <StyledInput
                label={t('FIELDS.EXECUTOR_COMPANY')}
                value={currentData?.executor_company?.short_name || ''}
                readOnly
              />
            </Grid>
            {currentData?.complete_comment && (
              <Grid item xs={12}>
                <StyledInput label={t('FIELDS.COMMENT')} value={currentData?.complete_comment} readOnly multiline />
              </Grid>
            )}
            {currentData?.reject_reason && (
              <Grid item xs={12}>
                <StyledInput
                  label={t('FIELDS.REJECTED_REASON')}
                  value={currentData?.reject_reason}
                  readOnly
                  multiline
                />
              </Grid>
            )}
          </Grid>
        </Box>
      )}
      {currentData?.files?.length > 0 && (
        <>
          <Typography
            variant="h3"
            style={{
              fontSize: 15,
              fontWeight: 'normal',
              color: '#0D244D',
              lineHeight: 1.2,
              paddingBottom: 16,
              paddingTop: 18
            }}
          >
            {t('DOWNLOADED_FILES')}:
          </Typography>
          <UploadedFilesTable
            files={currentData?.files || []}
            handleUpdateList={refetch}
            tags={['Додавання нових віртуальних/фізичних ТКО']}
          />
        </>
      )}
      <CancelModal
        text={t('CANCEL_PROCESS_CONFIRM_UNSAVING_CHANGES')}
        open={openCancel}
        onClose={() => setOpenCancel(false)}
        onSubmit={() => {
          setOpenCancel(false);
          update({ uid, type: 'cancel' });
        }}
      />
      <SimpleImportModal
        title={t('IMPORT_AP_FILES')}
        openUpload={openUpload}
        setOpenUpload={setOpenUpload}
        handleUpload={(formData, handleClose) => {
          handleClose();
          uploadFile({ uid, formData });
        }}
        layoutList={[
          { key: 'file_original', label: t('IMPORT_FILE.SELECT_FILE_WITH_APS'), accept: '.xls,.xlsx,.xml' },
          { key: 'file_original_key', label: t('IMPORT_FILE.SELECT_DIGITAL_SIGNATURE_FILE'), accept: '.p7s' }
        ]}
        uploading={uploading}
        error={uploadingError?.data}
      />
      <ConfirmModal
        text={t('REASON_FOR_REJECTING_APPLICATION')}
        fieldLabel={t('FIELDS.REQUEST_REJECTED_REASON')}
        open={openReject}
        onClose={() => setOpenReject(false)}
        onSubmit={(reason) => {
          setOpenReject(false);
          update({ uid, body: { reason }, type: 'reject' });
        }}
      />
      <ConfirmModal
        text={t('MODALS.ADD_COMMENT_TO_APPROVE_APPLICATION')}
        fieldLabel={t('FIELDS.COMMENT')}
        open={openDone}
        onClose={() => setOpenDone(false)}
        onSubmit={(comment) => {
          setOpenDone(false);
          update({ uid, body: { comment }, type: 'complete' });
        }}
      />
    </Page>
  );
};

export default AddingNewVirtualTko;
