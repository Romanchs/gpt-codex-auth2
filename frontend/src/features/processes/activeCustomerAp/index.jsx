import Grid from '@material-ui/core/Grid';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import Page from '../../../Components/Global/Page';
import CancelModal from '../../../Components/Modal/CancelModal';
import SimpleImportModal from '../../../Components/Modal/SimpleImportModal';
import CircleButton from '../../../Components/Theme/Buttons/CircleButton';
import Statuses from '../../../Components/Theme/Components/Statuses';
import StyledInput from '../../../Components/Theme/Fields/StyledInput';

import {
  useCreateActiveCustomerApMutation,
  useGetActiveCustomerApQuery,
  useUpdateActiveCustomerApMutation,
  useUploadActiveCustomerApMutation
} from './api';
import { UploadedFilesTable } from '../../../Components/pages/Processes/Components/UploadedFilesTable';
import DelegateBtn from '../../delegate/delegateBtn';
import DelegateInput from '../../delegate/delegateInput';
import { useTranslation } from 'react-i18next';
import { sockets } from '../../../app/sockets';
import { mainApi } from '../../../app/mainApi';

const ACTIVE_CUSTOMER_AP_LOG_TAGS = ["Заявка на зміну статусу 'Активний споживач' за ТКО"];
export const ACTIVE_CUSTOMER_AP_ACCEPT_ROLES = ['СВБ', 'АКО_Процеси', 'ГарПок'];

const ActiveCustomerAp = () => {
  const { t } = useTranslation();
  const { uid } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    activeOrganization: { name: initiator_company },
    full_name
  } = useSelector(({ user }) => user);
  const [openCancel, setOpenCancel] = useState(false);
  const [openUpload, setOpenUpload] = useState(false);
  const [delegating, setDelegating] = useState(false);

  const [initProcess, { isLoading: isInitingProcess }] = useCreateActiveCustomerApMutation();
  const [update, { isLoading: isUpdating }] = useUpdateActiveCustomerApMutation();
  const [uploadFile, { isLoading: uploading, error: uploadingError }] = useUploadActiveCustomerApMutation();
  const {
    currentData,
    error: notFound,
    isFetching: isDataLoading,
    refetch
  } = useGetActiveCustomerApQuery(uid, { skip: !uid });

  const handleCreateProcess = async () => {
    //const { data: uid } = await initProcess({ date_status_change: dateStatusChange });
    const { data: uid } = await initProcess();
    if (uid) navigate(`/processes/active-customer-ap/${uid}`);
  };

  useEffect(() => {
    if (uid && sockets.connection.auth) {
      sockets.joinProcess(uid);
      sockets.connection.on('message', ({ type, payload }) => {
        if (type === 'PROCESS_UPDATED' && payload?.process_uid === uid) {
          dispatch(mainApi.util.invalidateTags(['ACTIVE_CUSTOMER_AP']));
        }
      });
    }
  }, [uid, sockets.connection.auth, refetch]);

  useEffect(
    () => () => {
      sockets.leaveProcess(uid);
    },
    [uid]
  );

  return (
    <Page
      acceptPermisions={uid ? 'PROCESSES.ACTIVE_CUSTOMER_AP.ACCESS' : 'PROCESSES.ACTIVE_CUSTOMER_AP.INITIALIZATION'}
      acceptRoles={!uid ? ['СВБ', 'ГарПок'] : ACTIVE_CUSTOMER_AP_ACCEPT_ROLES}
      faqKey={'PROCESSES__ACTIVE_CUSTOMER_AP'}
      pageName={
        isDataLoading
          ? `${t('LOADING')}...`
          : currentData?.id
          ? t('PAGES.ACTIVE_CUSTOMER_AP_ID', { id: currentData?.id })
          : t('PAGES.ACTIVE_CUSTOMER_AP')
      }
      backRoute={'/processes'}
      loading={isInitingProcess || isDataLoading || isUpdating || uploading || delegating || currentData?.processing}
      notFoundMessage={uid && notFound && t('PROCESS_NOT_FOUND')}
      controls={
        <>
          {!uid && (
            <CircleButton
              type={'create'}
              title={t('CONTROLS.TAKE_TO_WORK')}
              // disabled={!moment(dateStatusChange).isValid()}
              onClick={handleCreateProcess}
            />
          )}
          {currentData?.can_cancel && (
            <CircleButton type={'remove'} title={t('CONTROLS.CANCEL_REQUEST')} onClick={() => setOpenCancel(true)} />
          )}
          {currentData?.can_delegate && (
            <DelegateBtn
              process_uid={uid}
              onStarted={() => setDelegating(true)}
              onFinished={() => setDelegating(false)}
              onSuccess={() => window.location.reload()}
            />
          )}
          {currentData?.can_upload && (
            <CircleButton type={'upload'} title={t('CONTROLS.IMPORT')} onClick={() => setOpenUpload(true)} />
          )}
          {currentData?.can_complete && (
            <CircleButton type={'new'} title={t('CONTROLS.FORM')} onClick={() => update({ uid, type: '/complete' })} />
          )}
        </>
      }
    >
      <Statuses
        statuses={['NEW', 'IN_PROCESS', 'FORMED', 'DONE', 'PARTIALLY_DONE', 'CANCELED']}
        currentStatus={currentData?.status || 'NEW'}
      />
      <div className={'boxShadow'} style={{ marginTop: 16, marginBottom: 16, padding: '20px 24px' }}>
        <Grid container spacing={3} alignItems={'flex-start'}>
          <Grid item xs={12} md={6} lg={6}>
            <DelegateInput
              label={t('FIELDS.USER_INITIATOR')}
              readOnly
              value={currentData?.initiator?.username ?? full_name}
              data={currentData?.delegation_history || []}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <StyledInput
              label={t('FIELDS.CREATED_AT')}
              value={currentData?.created_at && moment(currentData?.created_at).format('DD.MM.yyyy • HH:mm')}
              readOnly
            />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <StyledInput
              label={
                currentData?.status.startsWith('CANCELED') ? t('FIELDS.CANCELED_AT') : t('FIELDS.COMPLETE_DATETIME')
              }
              value={
                currentData?.status?.startsWith('CANCELED')
                  ? currentData?.canceled_at && moment(currentData?.canceled_at).format('DD.MM.yyyy • HH:mm')
                  : currentData?.finished_at && moment(currentData?.finished_at).format('DD.MM.yyyy • HH:mm')
              }
              readOnly
            />
          </Grid>
          <Grid item xs={12} md={6} lg={6}>
            <StyledInput
              label={t('FIELDS.INITIATOR_COMPANY')}
              value={currentData?.initiator_company?.short_name ?? initiator_company}
              readOnly
            />
          </Grid>
          {/* <Grid item xs={12} md={6} lg={3}>
            {currentData?.must_be_finished_at ? (
              <StyledInput
                label={t('FIELDS.STATUS_CHANGE_DATE')}
                value={moment(currentData.must_be_finished_at).format('DD.MM.yyyy')}
                readOnly
              />
            ) : (
              <DatePicker
                value={dateStatusChange}
                label={t('FIELDS.STATUS_CHANGE_DATE')}
                onChange={(d) => setDateStatusChange(d || null)}
              />
            )}
          </Grid> */}
        </Grid>
      </div>
      {currentData?.files?.length > 0 && (
        <UploadedFilesTable
          files={currentData?.files || []}
          handleUpdateList={refetch}
          tags={ACTIVE_CUSTOMER_AP_LOG_TAGS}
        />
      )}
      <CancelModal
        text={t('CANCEL_PROCESS_CONFIRM_UNSAVING_CHANGES')}
        open={openCancel}
        onClose={() => setOpenCancel(false)}
        onSubmit={() => {
          setOpenCancel(false);
          update({ uid, type: '/cancel' });
        }}
      />
      <SimpleImportModal
        title={t('IMPORT_FILE.SELECT_FILE')}
        openUpload={openUpload}
        setOpenUpload={setOpenUpload}
        handleUpload={(formData, handleClose) => {
          uploadFile({ uid, formData }).then((res) => {
            if (!res?.error) handleClose();
          });
        }}
        layoutList={[
          { key: 'file_original', label: t('IMPORT_FILE.SELECT_FILE'), accept: '.xls,.xlsx,.xlsm' },
          { key: 'file_original_key', label: t('IMPORT_FILE.SELECT_DIGITAL_SIGNATURE_FILE'), accept: '.p7s' }
        ]}
        uploading={uploading}
        error={uploadingError?.data}
        warningMessage={t('IMPORT_FILE.IMPORT_MAX_AP_COUNT_WARNING')}
      />
    </Page>
  );
};

export default ActiveCustomerAp;
