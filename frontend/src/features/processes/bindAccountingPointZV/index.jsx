import Grid from '@material-ui/core/Grid';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import Page from '../../../Components/Global/Page';
import CancelModal from '../../../Components/Modal/CancelModal';
import SimpleImportModal from '../../../Components/Modal/SimpleImportModal';
import CircleButton from '../../../Components/Theme/Buttons/CircleButton';
import Statuses from '../../../Components/Theme/Components/Statuses';
import StyledInput from '../../../Components/Theme/Fields/StyledInput';
import {
  useCreateBindAccountingPointZVMutation,
  useLazyGetBindAccountingPointZVQuery,
  useUpdateBindAccountingPointZVMutation,
  useUploadBindAccountingPointZVMutation
} from './api';
import { UploadedFilesTable } from '../../../Components/pages/Processes/Components/UploadedFilesTable';
import { useTranslation } from 'react-i18next';
import DelegateBtn from '../../delegate/delegateBtn';
import DelegateInput from '../../delegate/delegateInput';
import ConfirmBindAccountingPointZV from './ConfirmBindAccountingPointZV';

export const BIND_ACCOUNTING_POINT_ZV_ACCEPT_ROLES = ['АКО_Процеси', 'АКО/АР_ZV'];

const BindAccountingPointZV = () => {
  const {t} = useTranslation();
  const { uid } = useParams();
  const navigate = useNavigate();
  const {
    activeOrganization: { name: initiator_company, eic, usreou },
    full_name
  } = useSelector(({ user }) => user);
  const [currentProcess, setCurrentProcess] = useState({ status: 'NEW' });
  const [openCancel, setOpenCancel] = useState(false);
  const [openUpload, setOpenUpload] = useState(false);
  const [delegating, setDelegating] = useState(false);
  const [openConfirmOverrideApZv, setOpenConfirmOverrideApZv] = useState(false);

  const [initProcess] = useCreateBindAccountingPointZVMutation();
  const [update, { isLoading: isUpdating }] = useUpdateBindAccountingPointZVMutation();
  const [uploadFile, { isLoading: uploading, error: uploadingError }] = useUploadBindAccountingPointZVMutation();
  const [getData, { data, error: notFound, isFetching: isDataLoading }] = useLazyGetBindAccountingPointZVQuery();

  useEffect(() => {
    if (uid) getData(uid);
  }, [uid, getData]);

  useEffect(() => {
    setCurrentProcess((prev) => ({ ...prev, ...data }));
  }, [data]);

  const handleCompleteProcess = () => {
    if(!currentProcess.require_confirm_complete) {
      update({ uid, type: '/complete', body: {} })
      return;
    }
    setOpenConfirmOverrideApZv(true);
  }

  const handleOverrideApZv = (override) => {
    update({ uid, type: '/complete', body: {override_ap_zv: override} });
    setOpenConfirmOverrideApZv(false);
  }


  return (
    <Page
      acceptPermisions={
        uid ? 'PROCESSES.BIND_ACCOUNTING_POINT_ZV.ACCESS' : 'PROCESSES.BIND_ACCOUNTING_POINT_ZV.INITIALIZATION'
      }
      acceptRoles={BIND_ACCOUNTING_POINT_ZV_ACCEPT_ROLES}
      pageName={
        isDataLoading 
          ? `${t('LOADING')}...`
          : currentProcess.id ? t('PAGES.BIND_ACCOUNTING_POINT_ZV_ID', {id: currentProcess.id}) : t('PAGES.BIND_ACCOUNTING_POINT_ZV')
      }
      backRoute={'/processes'}
      faqKey={'PROCESSES__BIND_ACCOUNTING_POINT_ZV'}
      loading={isDataLoading || isUpdating || uploading || delegating}
      notFoundMessage={notFound && t('PROCESS_NOT_FOUND')}
      controls={
        <>
          {currentProcess.status === 'NEW' && (
            <CircleButton
              type={'create'}
              title={t('CONTROLS.TAKE_TO_WORK')}
              onClick={async () => {
                const { data: uid } = await initProcess();
                navigate(`/processes/bind-accounting-point-zv/${uid}`);
              }}
            />
          )}
          {currentProcess.can_cancel && (
            <CircleButton type={'remove'} title={t('CONTROLS.CANCEL_PROCESS')} onClick={() => setOpenCancel(true)} />
          )}
          {currentProcess.can_upload && (
            <CircleButton type={'upload'} title={t('CONTROLS.IMPORT')} onClick={() => setOpenUpload(true)} />
          )}
          {currentProcess?.can_delegate && (
            <DelegateBtn
              process_uid={uid}
              onStarted={() => setDelegating(true)}
              onFinished={() => setDelegating(false)}
              onSuccess={() => window.location.reload()}
            />
          )}
          {currentProcess.can_complete && (
            <CircleButton type={'done'} title={t('CONTROLS.DONE_PROCESS')} onClick={handleCompleteProcess} />
          )}
        </>
      }
    >
      <Statuses
        statuses={['NEW', 'IN_PROCESS', 'PARTIALLY_DONE', 'DONE', 'CANCELED']}
        currentStatus={currentProcess.status}
      />
      <div className={'boxShadow'} style={{ marginTop: 16, padding: '20px 24px' }}>
        <Grid container spacing={3} alignItems={'flex-start'}>
          <Grid item xs={12} md={6}>
            <StyledInput
              label={t('FIELDS.INITIATOR_COMPANY')}
              value={currentProcess.initiator_company?.short_name || initiator_company || ''}
              readOnly
            />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <StyledInput
              label={t('FIELDS.INITIATOR_COMPANY_EIC_CODE')}
              value={currentProcess.initiator_company?.eic || eic || ''}
              readOnly
            />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <StyledInput
              label={t('FIELDS.USREOU')}
              value={currentProcess.initiator_company?.usreou || usreou || ''}
              readOnly
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <DelegateInput
              label={t('FIELDS.USER_EXECUTOR')}
              value={currentProcess.executor?.username || full_name}
              readOnly
              data={currentProcess?.delegation_history || []}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <StyledInput
              label={t('FIELDS.COMPLETE_DATETIME')}
              value={currentProcess.finished_at && moment(currentProcess.finished_at).format('DD.MM.yyyy • HH:mm')}
              readOnly
            />
          </Grid>
        </Grid>
      </div>
      {currentProcess.files?.length > 0 && (
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
          <UploadedFilesTable files={currentProcess.files || []} handleUpdateList={() => getData(uid)} tags={['Прив’язка ТКО Z до ZV']}/>
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
        title={t('SELECT_FILE_WITH_Z_CODES')}
        openUpload={openUpload}
        setOpenUpload={setOpenUpload}
        handleUpload={(formData, handleClose) => {
          uploadFile({ uid, formData }).then((res) => {
            if (!res?.error) handleClose();
          });
        }}
        layoutList={[
          { key: 'file_original', label: t('SELECT_FILE_WITH_Z_CODES'), accept: '.xlsx' },
          { key: 'file_original_key', label: t('IMPORT_FILE.SELECT_DIGITAL_SIGNATURE_FILE'), accept: '.p7s' }
        ]}
        uploading={uploading}
        error={uploadingError?.data}
      />
      <ConfirmBindAccountingPointZV
        open={openConfirmOverrideApZv}
        setOpen={setOpenConfirmOverrideApZv}
        onCancel={() => handleOverrideApZv(false)}
        onSubmit={() => handleOverrideApZv(true)}
      />
    </Page>
  );
};

export default BindAccountingPointZV;
