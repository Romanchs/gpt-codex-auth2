import Grid from '@material-ui/core/Grid';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import Page from '../../../Components/Global/Page';
import CancelModal from '../../../Components/Modal/CancelModal';
import CircleButton from '../../../Components/Theme/Buttons/CircleButton';
import Statuses from '../../../Components/Theme/Components/Statuses';
import StyledInput from '../../../Components/Theme/Fields/StyledInput';
import {
  useCreateBindAccountingPointMutation,
  useLazyGetBindAccountingPointQuery,
  useUpdateBindAccountingPointMutation,
  useUploadBindAccountingPointMutation
} from './api';
import { UploadedFilesTable } from '../../../Components/pages/Processes/Components/UploadedFilesTable';
import { ImportTkoModal } from '../../../Components/Modal/ImportTkoModal';
import { useTranslation } from 'react-i18next';
import DelegateBtn from '../../delegate/delegateBtn';
import DelegateInput from '../../delegate/delegateInput';

export const BIND_ACCOUNTING_POINT_ACCESS_ACCEPT_ROLES = [
  'АТКО',
  'АКО',
  'АКО_Процеси',
  'АКО_Користувачі',
  'АКО_Довідники'
];

const BindAccountingPoint = () => {
  const { t } = useTranslation();
  const { uid } = useParams();
  const navigate = useNavigate();
  const {
    activeOrganization: { name: initiator_company },
    full_name
  } = useSelector(({ user }) => user);
  const [currentProcess, setCurrentProcess] = useState({ status: 'NEW' });
  const [openCancel, setOpenCancel] = useState(false);
  const [openUpload, setOpenUpload] = useState(false);
  const [delegating, setDelegating] = useState(false);

  const [initProcess] = useCreateBindAccountingPointMutation();
  const [update, { isLoading: isUpdating }] = useUpdateBindAccountingPointMutation();
  const [uploadFile, { isLoading: uploading, error: uploadingError }] = useUploadBindAccountingPointMutation();
  const [getData, { currentData: data, error: notFound, isFetching: isDataLoading }] =
    useLazyGetBindAccountingPointQuery();

  useEffect(() => {
    if (uid) {
      getData(uid);
      return;
    }
    if (data) {
      setCurrentProcess({ status: 'NEW' });
    }
  }, [uid, getData]);

  useEffect(() => {
    setCurrentProcess((prev) => ({ ...prev, ...data }));
  }, [data]);

  return (
    <Page
      acceptPermisions={
        uid ? 'PROCESSES.BIND_ACCOUNTING_POINT.ACCESS' : 'PROCESSES.BIND_ACCOUNTING_POINT.INITIALIZATION'
      }
      acceptRoles={uid ? BIND_ACCOUNTING_POINT_ACCESS_ACCEPT_ROLES : ['АТКО']}
      pageName={
        isDataLoading
          ? `${t('LOADING')}...`
          : currentProcess.id
          ? t('PAGES.BIND_ACCOUNTING_POINT_ID', { id: currentProcess.id })
          : t('PAGES.BIND_ACCOUNTING_POINT')
      }
      backRoute={'/processes'}
      faqKey={'PROCESSES__BIND_ACCOUNTING_POINT'}
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
                navigate(`/processes/bind-accounting-point/${uid}`);
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
            <CircleButton
              type={'done'}
              title={t('CONTROLS.DONE_PROCESS')}
              onClick={() => update({ uid, type: '/complete' })}
            />
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
          <Grid item xs={12} md={6} lg={6}>
            <DelegateInput
              label={t('FIELDS.USER_INITIATOR')}
              value={currentProcess.initiator?.username ?? full_name}
              readOnly
              data={currentProcess?.delegation_history || []}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <StyledInput
              label={t('FIELDS.CREATED_AT')}
              value={currentProcess.created_at && moment(currentProcess.created_at).format('DD.MM.yyyy • HH:mm')}
              readOnly
            />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <StyledInput
              label={
                currentProcess.status.startsWith('CANCELED') ? t('FIELDS.CANCELED_AT') : t('FIELDS.COMPLETE_DATETIME')
              }
              value={currentProcess.finished_at && moment(currentProcess.finished_at).format('DD.MM.yyyy • HH:mm')}
              readOnly
            />
          </Grid>
          <Grid item xs={12} md={6} lg={6}>
            <StyledInput
              label={t('FIELDS.INITIATOR_COMPANY')}
              value={currentProcess.initiator_company?.short_name ?? initiator_company}
              readOnly
            />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <StyledInput label={t('FIELDS.UNIQUE_APS')} value={currentProcess.successful?.toString()} readOnly />
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
          <UploadedFilesTable
            files={currentProcess.files || []}
            handleUpdateList={() => getData(uid)}
            tags={['Прив’язка ТКО до іншої ТКО']}
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
      <ImportTkoModal
        open={openUpload}
        onClose={() => setOpenUpload(false)}
        onUpload={(formData) => {
          uploadFile({ uid, formData }).then((res) => {
            if (!res?.error) {
              setOpenUpload(false);
            }
          });
        }}
        loading={uploading}
        error={uploadingError?.data}
      />
    </Page>
  );
};

export default BindAccountingPoint;
