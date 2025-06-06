import Grid from '@material-ui/core/Grid';
import moment from 'moment';
import { useState } from 'react';
import { useParams } from 'react-router-dom';

import Page from '../../../Components/Global/Page';
import CircleButton from '../../../Components/Theme/Buttons/CircleButton';
import Statuses from '../../../Components/Theme/Components/Statuses';
import StyledInput from '../../../Components/Theme/Fields/StyledInput';
import { UploadedFilesTable } from '../../../Components/pages/Processes/Components/UploadedFilesTable';
import SimpleImportModal from '../../../Components/Modal/SimpleImportModal';
import { getEnv } from '../../../util/getEnv';
import DoneProcessModal from './DoneProcessModal';
import DelegateBtn from '../../delegate/delegateBtn';
import DelegateInput from '../../delegate/delegateInput';
import { useTranslation } from 'react-i18next';
import {
  useRequestToUpdateCustomersQuery,
  useUpdateRequestToUpdateCustomersMutation,
  useUploadRequestToUpdateCustomersMutation
} from './api';

const RequestToUpdateCustomers = () => {
  const { t } = useTranslation();
  const { uid } = useParams();
  const [openUpload, setOpenUpload] = useState(false);
  const [openDoneProcess, setOpenDoneProcess] = useState(false);
  const [comment, setComment] = useState('');
  const [delegating, setDelegating] = useState(false);

  const { data, error, isFetching, refetch } = useRequestToUpdateCustomersQuery({ uid });
  const [update, { isLoading: isUpdating, error: updateError }] = useUpdateRequestToUpdateCustomersMutation();
  const [uploadFile, { isLoading: uploading, error: uploadingError }] = useUploadRequestToUpdateCustomersMutation();

  const handleDoneProcess = () => {
    if (data && data.force_done_allowed) {
      setOpenDoneProcess(true);
    } else {
      update({ uid, type: '/done', body: { comment } });
    }
  };

  const getPageName = () => {
    if (isFetching) return `${t('LOADING')}...`;
    if (data?.id) return t('PAGES.REQUEST_UPDATE_CUSTOMERS_ID', { id: data.id });
    return t('PAGES.REQUEST_UPDATE_BASIC_AP');
  };

  return (
    <Page
      acceptPermisions={'PROCESSES.REQUEST_ACTUALIZATION_TKO.ACCESS'}
      acceptRoles={['АКО_Процеси', 'СВБ', 'АТКО']}
      pageName={getPageName()}
      faqKey={'PROCESSES__REQUEST_TO_UPDATE_CUSTOMERS'}
      backRoute={'/processes'}
      loading={isFetching || isUpdating || uploading || delegating}
      notFoundMessage={error && !error?.comment && t('PROCESS_NOT_FOUND')}
      controls={
        <>
          {data?.can_formed && (
            <CircleButton
              type={'create'}
              title={t('CONTROLS.TAKE_TO_WORK')}
              onClick={() => update({ uid, type: '/to-form' })}
            />
          )}
          {data?.can_upload && (
            <CircleButton type={'upload'} title={t('CONTROLS.IMPORT')} onClick={() => setOpenUpload(true)} />
          )}
          {data?.can_done && <CircleButton type={'done'} title={t('CONTROLS.PERFORM')} onClick={handleDoneProcess} />}
          {data?.can_delegate && (
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
      <Statuses statuses={['NEW', 'IN_PROCESS', 'DONE']} currentStatus={data?.status || 'NEW'} />
      <div className={'boxShadow'} style={{ padding: 24, marginTop: 16 }}>
        <Grid container spacing={3} alignItems={'center'}>
          <Grid item xs={12} md={6}>
            <StyledInput label={t('FIELDS.USER_INITIATOR')} value={data?.initiator} disabled />
          </Grid>
          <Grid item xs={12} md={3}>
            <StyledInput
              label={t('FIELDS.CREATE_REQUEST_DATE')}
              value={data?.created_at && moment(data?.created_at).format('DD.MM.yyyy • HH:mm')}
              disabled
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <StyledInput
              label={t('FIELDS.MUST_BE_FINISHED_AT')}
              value={data?.must_be_finished_at && moment(data?.must_be_finished_at).format('DD.MM.yyyy • HH:mm')}
              disabled
            />
          </Grid>
          <Grid item xs={12}>
            <StyledInput label={t('FIELDS.EXECUTOR_COMPANY')} value={data?.executor_company?.full_name} disabled />
          </Grid>
          <Grid item xs={12}>
            <StyledInput
              label={t('FIELDS.JUSTIFICATION')}
              value={t('REQUEST_UPDATE_BASIC_AP_JUSTIFICATION_TEXT_FOR_CUSTOMER')}
              multiline
              rows={2}
              disabled
            />
          </Grid>
          {data?.status && data?.status !== 'NEW' && (
            <>
              <Grid item xs={12}>
                <StyledInput
                  label={t('FIELDS.COMMENT')}
                  value={data?.can_done ? comment : data?.comment}
                  onChange={(e) => setComment(e.target.value)}
                  error={error?.data?.comment || updateError?.data?.comment}
                  disabled={!data?.can_done}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <DelegateInput
                  label={t('FIELDS.USER_EXECUTOR')}
                  value={data?.executor}
                  disabled
                  data={data?.delegation_history || []}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <StyledInput
                  label={t('FIELDS.START_WORK_DATE')}
                  value={data?.formed_at && moment(data?.formed_at).format('DD.MM.yyyy • HH:mm')}
                  disabled
                />
              </Grid>
            </>
          )}
        </Grid>
      </div>
      {data?.files?.length > 0 && (
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
            {t('TOTAL_NUMBER_UPLOADED_AP_IN_REQUEST')}:
          </h3>
          <UploadedFilesTable files={data?.files || []} handleUpdateList={refetch} tags={['Запит щодо актуалізації основних даних СПМ/Споживача']} />
        </>
      )}
      <SimpleImportModal
        title={t('IMPORT_FILE.IMPORT_FILE')}
        openUpload={openUpload}
        setOpenUpload={setOpenUpload}
        layoutList={[
          {
            label: `${t('IMPORT_FILE.SELECT_FILE_IN_XLS_OR_XLS')}:`,
            key: 'file_original',
            accept: '.xls,.xlsx',
            maxSize: 26214400,
            sizeError: t('VERIFY_MSG.MAX_FILE_SIZE', { size: 25 })
          },
          {
            label: `${t('IMPORT_FILE.SELECT_DIGITAL_SIGNATURE_FILE')}:`,
            key: 'file_original_key',
            accept: '.p7s',
            maxSize: 40960,
            sizeError: t('VERIFY_MSG.UNCORRECT_SIGNATURE')
          }
        ]}
        handleUpload={(formData) => {
          uploadFile({ uid, formData }).then((res) => {
            if (!res?.error) {
              setOpenUpload(false);
            }
          });
        }}
        canUploadWithoutKey={getEnv().env === 'dev'}
        uploading={uploading}
        error={uploadingError?.data}
      />
      <DoneProcessModal
        open={openDoneProcess}
        onClose={() => setOpenDoneProcess(false)}
        comment={comment}
        setComment={setComment} />
    </Page>
  );
};

export default RequestToUpdateCustomers;
