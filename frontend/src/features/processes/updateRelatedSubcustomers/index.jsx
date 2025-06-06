import Grid from '@material-ui/core/Grid';
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
  useCreateUpdateRelatedSubcustomersMutation,
  useGetUpdateRelatedSubcustomersQuery,
  useUpdateUpdateRelatedSubcustomersMutation,
  useUploadUpdateRelatedSubcustomersMutation
} from './api';
import { UploadedFilesTable } from '../../../Components/pages/Processes/Components/UploadedFilesTable';
import DelegateBtn from '../../delegate/delegateBtn';
import DelegateInput from '../../delegate/delegateInput';
import { useTranslation } from 'react-i18next';

export const UPDATE_RELATED_SUBCUSTOMERS_ACCESS_ACCEPT_ROLES = ['СВБ', 'АКО_Процеси'];

const UpdateRelatedSubcustomers = () => {
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

  const [initProcess] = useCreateUpdateRelatedSubcustomersMutation();
  const [update, { isLoading: isUpdating }] = useUpdateUpdateRelatedSubcustomersMutation();
  const [uploadFile, { isLoading: uploading, error: uploadingError }] = useUploadUpdateRelatedSubcustomersMutation();
  const {
    currentData,
    error: notFound,
    isFetching: isDataLoading,
    refetch: getData
  } = useGetUpdateRelatedSubcustomersQuery(uid, { skip: !uid });

  return (
    <Page
      acceptPermisions={
        uid ? 'PROCESSES.UPDATE_RELATED_SUBCUSTOMERS.ACCESS' : 'PROCESSES.UPDATE_RELATED_SUBCUSTOMERS.INITIALIZATION'
      }
      acceptRoles={!uid ? ['СВБ'] : UPDATE_RELATED_SUBCUSTOMERS_ACCESS_ACCEPT_ROLES}
      faqKey={'PROCESSES__UPDATE_RELATED_SUBCUSTOMERS'}
      pageName={
        isDataLoading
          ? `${t('LOADING')}...`
          : currentData?.id
          ? t('PAGES.UPDATE_RELATED_SUBCUSTOMERS_ID', { id: currentData.id })
          : t('PAGES.UPDATE_RELATED_SUBCUSTOMERS')
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
                navigate(`/processes/update-related-subcustomers/${uid}`);
              }}
            />
          )}
          {currentData?.can_cancel && (
            <CircleButton type={'remove'} title={t('CONTROLS.CANCEL')} onClick={() => setOpenCancel(true)} />
          )}
          {currentData?.can_upload && (
            <CircleButton type={'upload'} title={t('CONTROLS.IMPORT')} onClick={() => setOpenUpload(true)} />
          )}
          {currentData?.can_complete && (
            <CircleButton
              type={'done'}
              title={t('CONTROLS.PERFORM')}
              onClick={() => update({ uid, type: '/complete' })}
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
          <Grid item xs={12} md={6}>
            <DelegateInput
              label={t('FIELDS.USER_INITIATOR')}
              value={currentData?.initiator?.username ?? full_name}
              readOnly
              data={currentData?.delegation_history || []}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <StyledInput
              label={t('FIELDS.RECEIVING_DATETIME')}
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
          <Grid item xs={12}>
            <StyledInput
              label={t('FIELDS.INITIATOR_COMPANY')}
              value={currentData?.initiator_company?.short_name ?? initiator_company}
              readOnly
            />
          </Grid>
        </Grid>
      </div>
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
        {t('TOTAL_NUMBER_OF_FILES_UPLOADEDP_AS_PART_OF_THE_APPLICATION')}:
      </h3>
      <UploadedFilesTable
        files={currentData?.files || []}
        handleUpdateList={() => getData(uid)}
        tags={['Ідентифікація пов’язаних осіб СПМ/Споживача']}
      />
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
        title={t('IMPORT_FILE_WITH_CHARACTERISTICS')}
        openUpload={openUpload}
        setOpenUpload={setOpenUpload}
        handleUpload={(formData, handleClose) => {
          uploadFile({ uid, formData }).then((response) => {
            if (!response?.error) handleClose();
          });
        }}
        layoutList={[
          {
            key: 'file_original',
            label: t('IMPORT_FILE.SELECT_FILE_IN_FORMAT_XLS_XLSX_XLSM'),
            accept: '.xls,.xlsx,.xlsm'
          },
          { key: 'file_original_key', label: t('SELECT_DIGITAL_SIGNATURE_FILE'), accept: '.p7s' }
        ]}
        uploading={uploading}
        error={uploadingError?.data}
      />
    </Page>
  );
};

export default UpdateRelatedSubcustomers;
