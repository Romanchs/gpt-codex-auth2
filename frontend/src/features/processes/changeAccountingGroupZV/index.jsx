import Grid from '@material-ui/core/Grid';
import { Typography } from '@mui/material';
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
import {
  useCreateChangeAccountingGroupZVMutation,
  useGetChangeAccountingGroupZVQuery,
  useUpdateChangeAccountingGroupZVMutation,
  useUploadChangeAccountingGroupZVMutation
} from './api';
import { UploadedFilesTable } from '../../../Components/pages/Processes/Components/UploadedFilesTable';
import DelegateBtn from '../../delegate/delegateBtn';
import DelegateInput from '../../delegate/delegateInput';
import { useTranslation } from 'react-i18next';

export const CHANGE_ACCOUNTING_GROUP_ZV_ACCESS_ACCEPT_ROLES = ['АТКО', 'АКО_Процеси'];

const ChangeAccountingGroupZV = () => {
  const { t } = useTranslation();
  const { uid } = useParams();
  const navigate = useNavigate();
  const {
    activeOrganization: { name: initiator_company },
    full_name
  } = useSelector(({ user }) => user);
  const [openCancel, setOpenCancel] = useState(false);
  const [openUpload, setOpenUpload] = useState(false);
  const [delegating, setDelegating] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);

  const [initProcess] = useCreateChangeAccountingGroupZVMutation();
  const [update, { isLoading: isUpdating }] = useUpdateChangeAccountingGroupZVMutation();
  const [uploadFile, { isLoading: uploading, error: uploadingError }] = useUploadChangeAccountingGroupZVMutation();
  const {
    currentData,
    error: notFound,
    isFetching: isDataLoading,
    refetch: getData
  } = useGetChangeAccountingGroupZVQuery(uid, { skip: !uid });

  return (
    <Page
      acceptPermisions={
        uid ? 'PROCESSES.CHANGE_ACCOUNTING_GROUP_ZV.ACCESS' : 'PROCESSES.CHANGE_ACCOUNTING_GROUP_ZV.INITIALIZATION'
      }
      acceptRoles={!uid ? ['АТКО'] : CHANGE_ACCOUNTING_GROUP_ZV_ACCESS_ACCEPT_ROLES}
      faqKey={'PROCESSES__CHANGE_ACCOUNTING_GROUP_ZV'}
      pageName={
        isDataLoading
          ? `${t('LOADING')}...`
          : currentData?.id
          ? t('PAGES.CHANGE_ACCOUNTING_GROUP_ZV_ID', { id: currentData?.id })
          : t('PAGES.CHANGE_ACCOUNTING_GROUP_ZV')
      }
      backRoute={'/processes'}
      loading={isDataLoading || isUpdating || uploading || delegating}
      notFoundMessage={uid && notFound && t('PROCESS_NOT_FOUND')}
      controls={
        <>
          {!uid && (
            <CircleButton
              type={'create'}
              title={t('CONTROLS.TAKE_TO_WORK')}
              onClick={async () => {
                const { data: uid } = await initProcess();
                navigate(`/processes/change-accounting-group-zv/${uid}`);
              }}
            />
          )}
          {currentData?.can_cancel && (
            <CircleButton type={'remove'} title={t('CONTROLS.CANCEL_REQUEST')} onClick={() => setOpenCancel(true)} />
          )}
          {currentData?.can_upload && (
            <CircleButton type={'upload'} title={t('CONTROLS.IMPORT')} onClick={() => setOpenUpload(true)} />
          )}
          {currentData?.can_complete && (
            <CircleButton
              type={'done'}
              title={t('CONTROLS.DONE_PROCESS')}
              onClick={() =>
                currentData?.require_confirm_complete ? setIsConfirmationOpen(true) : update({ uid, type: '/complete' })
              }
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
        statuses={['NEW', 'IN_PROCESS', 'DONE', 'PARTIALLY_DONE', 'CANCELED']}
        currentStatus={currentData?.status || 'NEW'}
      />
      <div className={'boxShadow'} style={{ marginTop: 16, padding: '20px 24px' }}>
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
              value={currentData?.finished_at && moment(currentData?.finished_at).format('DD.MM.yyyy • HH:mm')}
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
          <Grid item xs={12} md={6} lg={3}>
            <StyledInput label={t('FIELDS.UNIQUE_APS')} value={currentData?.successful?.toString()} readOnly />
          </Grid>
        </Grid>
      </div>
      {currentData?.files?.length > 0 && (
        <>
          <h3
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
          </h3>
          <UploadedFilesTable
            files={currentData?.files || []}
            handleUpdateList={() => getData(uid)}
            tags={['Зміна групи обліку за ТКО']}
          />
        </>
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
      />
      <CancelModal
        open={isConfirmationOpen}
        dataMarker={'confirm-modal'}
        submitType={'green'}
        onClose={() => setIsConfirmationOpen(false)}
        onSubmit={() => {
          setIsConfirmationOpen(false);
          update({ uid, type: '/complete' });
        }}
      >
        <Typography
          data-marker={'confirm-text'}
          sx={{ fontWeight: 400, fontSize: '16px', lineHeight: '24px', color: '#0D244D' }}
        >
          {t('WARNING_TKO_GROUP_CHANGE')}
        </Typography>
        <Typography data-marker={'confirm-is-done-text'} sx={{ fontWeight: 400, fontSize: '16px', color: '#0D244D' }}>
          {t('CONTROLS.DONE_PROCESS')}?
        </Typography>
      </CancelModal>
    </Page>
  );
};

export default ChangeAccountingGroupZV;
