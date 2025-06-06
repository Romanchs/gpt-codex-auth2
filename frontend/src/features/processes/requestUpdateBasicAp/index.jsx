import Grid from '@material-ui/core/Grid';
import moment from 'moment';
import { useState } from 'react';
import { useParams } from 'react-router-dom';

import Page from '../../../Components/Global/Page';
import CircleButton from '../../../Components/Theme/Buttons/CircleButton';
import Statuses from '../../../Components/Theme/Components/Statuses';
import StyledInput from '../../../Components/Theme/Fields/StyledInput';
import {
  useRequestUpdateBasicApQuery,
  useUpdateRequestUpdateBasicApMutation,
  useUploadRequestUpdateBasicApMutation
} from './api';
import { UploadedFilesTable } from '../../../Components/pages/Processes/Components/UploadedFilesTable';
import SimpleImportModal from '../../../Components/Modal/SimpleImportModal';
import { getEnv } from '../../../util/getEnv';
import DoneProcessModal from './DoneProcessModal';
import DelegateBtn from '../../delegate/delegateBtn';
import DelegateInput from '../../delegate/delegateInput';
import { useTranslation } from 'react-i18next';

export const REQUEST_ACTUALIZATION_TKO_ACCEPT_ROLES = ['АКО_Процеси', 'СВБ', 'АТКО'];

const RequestUpdateBasicAp = () => {
  const { t } = useTranslation();
  const { uid } = useParams();
  const [openUpload, setOpenUpload] = useState(false);
  const [openDoneProcess, setOpenDoneProcess] = useState(false);
  const [comment, setComment] = useState('');
  const [delegating, setDelegating] = useState(false);

  const { data, error, isFetching, refetch } = useRequestUpdateBasicApQuery({ uid });
  const [update, { isLoading: isUpdating, error: updateError }] = useUpdateRequestUpdateBasicApMutation();
  const [uploadFile, { isLoading: uploading, error: uploadingError }] = useUploadRequestUpdateBasicApMutation();

  const handleDoneProcess = () => {
    if (data && data.force_done_allowed) {
      setOpenDoneProcess(true);
    } else {
      update({ uid, type: '/done', body: { comment } });
    }
  };

  return (
    <Page
      acceptPermisions={'PROCESSES.REQUEST_ACTUALIZATION_TKO.ACCESS'}
      acceptRoles={REQUEST_ACTUALIZATION_TKO_ACCEPT_ROLES}
      faqKey={'PROCESSES__REQUEST_TO_UPDATE_BASIC_AP_DATA'}
      pageName={
        isFetching
          ? `${t('LOADING')}...`
          : data?.id
          ? t('PAGES.REQUEST_UPDATE_BASIC_AP_ID', { id: data.id })
          : t('PAGES.REQUEST_UPDATE_BASIC_AP')
      }
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
      <Statuses
        statuses={
          ['NEW', 'IN_PROCESS', 'PARTIALLY_DONE', 'COMPLETED', 'DONE', 'CANCELED']
        }
        currentStatus={data?.status || 'NEW'}
      />
      <div className={'boxShadow'} style={{ padding: 24, marginTop: 16 }}>
        <Grid container spacing={3} alignItems={'center'}>
          <Grid item xs={12} md={6}>
            <StyledInput label={t('FIELDS.USER_INITIATOR')} value={data?.initiator} disabled />
          </Grid>
          <Grid item xs={12} md={3}>
            <StyledInput
              label={t('FIELDS.CREATED_AT')}
              value={data?.created_at && moment(data?.created_at).format('DD.MM.yyyy • HH:mm')}
              disabled
            />
          </Grid>
          <Grid item xs={12}>
            <StyledInput label={t('FIELDS.INITIATOR_COMPANY')} value={data?.initiator_company?.full_name} disabled />
          </Grid>
          <Grid item xs={12}>
            <StyledInput
              label={t('FIELDS.JUSTIFICATION')}
              value={t('REQUEST_UPDATE_BASIC_AP_JUSTIFICATION_TEXT')}
              multiline
              rows={2}
              disabled
            />
          </Grid>
          <Grid item xs={12}>
            <StyledInput
              label={t('FIELDS.ANSWER')}
              value={data?.can_done ? comment : data?.comment}
              onChange={(e) => setComment(e.target.value)}
              error={error?.data?.comment || updateError?.data?.comment}
              disabled={!data?.can_done}
              required={data?.can_done}
            />
          </Grid>
          {data?.status && data?.status !== 'NEW' && (
            <>
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
              <Grid item xs={12}>
                <StyledInput label={t('FIELDS.EXECUTOR_COMPANY')} value={data?.executor_company?.full_name} disabled />
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
          <UploadedFilesTable files={data?.files || []} handleUpdateList={refetch} tags={['Запит щодо актуалізації основних даних ТКО']} />
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
      <DoneProcessModal open={openDoneProcess} onClose={() => setOpenDoneProcess(false)} />
    </Page>
  );
};

export default RequestUpdateBasicAp;
