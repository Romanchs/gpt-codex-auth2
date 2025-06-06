import Grid from '@material-ui/core/Grid';
import InputAdornment from '@material-ui/core/InputAdornment';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import { downloadFileById, uploadDisputeTkoSubprocess } from '../../../../actions/massLoadActions';
import { clearMmsUpload } from '../../../../actions/mmsActions';
import {
  clearCurrentProcess,
  doneDisputeSubprocess,
  exportDisputeTkoSubprocess,
  getDisputeTkoSubprocess,
  startDisputeSubprocess
} from '../../../../actions/processesActions';
import { checkPermissions } from '../../../../util/verifyRole';
import Page from '../../../Global/Page';
import CancelModal from '../../../Modal/CancelModal';
import CircleButton from '../../../Theme/Buttons/CircleButton';
import Statuses from '../../../Theme/Components/Statuses';
import StyledInput from '../../../Theme/Fields/StyledInput';
import { UploadedFilesTable } from '../Components/UploadedFilesTable';
import { types } from './disputeSideTypes';
import DelegateBtn from '../../../../features/delegate/delegateBtn';
import DelegateInput from '../../../../features/delegate/delegateInput';
import SimpleImportModal from '../../../Modal/SimpleImportModal';
import { useTranslation } from 'react-i18next';
import useExportFileLog from '../../../../services/actionsLog/useEportFileLog';

export const DISPUTE_TKO_SUBPROCESS_ACCEPT_ROLES = [
  'АКО',
  'АКО_Процеси',
  'АКО_ППКО',
  'АКО_Користувачі',
  'АКО_Довідники',
  'АТКО'
];

const DisputeTkoSubprocessDetails = () => {
  const { t } = useTranslation();
  const { uid } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    activeRoles: [{ relation_id }]
  } = useSelector(({ user }) => user);
  const { uploading, error } = useSelector(({ massLoad }) => massLoad);
  const { loading, currentProcess, notFound, error: processError } = useSelector(({ processes }) => processes);
  const [openEmptyTkoDialog, setOpenEmptyTkoDialog] = useState(false);
  const [openImportModal, setOpenImportModal] = useState(false);
  const [answerDescription, setAnswerDescription] = useState(currentProcess?.additional_data?.answer_description || '');
  const [delegating, setDelegating] = useState(false);
  const exportFileLog = useExportFileLog(['Відповідь на cуперечку з основних даних ТКО']);

  // Check roles & get data
  useEffect(() => {
    if (checkPermissions('PROCESSES.DISPUTE_TKO.SUBPROCESSES.ACCESS', DISPUTE_TKO_SUBPROCESS_ACCEPT_ROLES)) {
      dispatch(getDisputeTkoSubprocess(uid));
    } else {
      navigate('/processes');
    }
  }, [dispatch, navigate, uid, relation_id]);

  useEffect(() => () => dispatch(clearCurrentProcess()), [dispatch]);

  const handleDisputeLayout = (requestType) => {
    switch (requestType) {
      case types.BY_TKO:
        return (
          <>
            <Grid item xs={12} md={6} lg={3}>
              <StyledInput label={t('FIELDS.UNIQUE_APS')} value={currentProcess?.successful} readOnly />
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
              <StyledInput
                label={t('FIELDS.REQUEST_TYPE')}
                value={currentProcess?.additional_data?.dispute_request_type === 'BY_TKO' ? t('BY_TKO') : t('BY_SIDE')}
                readOnly
              />
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
              <StyledInput
                label={t('FIELDS.MUST_BE_FINISHED_AT')}
                value={
                  currentProcess?.deadline_response_at &&
                  moment(currentProcess?.deadline_response_at).format('DD.MM.yyyy • HH:mm')
                }
                readOnly
              />
            </Grid>
            {currentProcess?.status === 'CANCELED_BY_OWNER' && (
              <Grid item xs={12} md={6} lg={3}>
                <StyledInput
                  label={t('FIELDS.CANCELED_AT')}
                  value={
                    currentProcess?.finished_at && moment(currentProcess?.finished_at).format('DD.MM.yyyy • HH:mm')
                  }
                  readOnly
                />
              </Grid>
            )}
            {currentProcess?.status === 'DONE' && (
              <Grid item xs={12} md={3} lg={3}>
                <StyledInput
                  label={t('FIELDS.COMPLETE_DATETIME')}
                  value={
                    currentProcess?.finished_at && moment(currentProcess?.finished_at).format('DD.MM.yyyy • HH:mm')
                  }
                  readOnly
                />
              </Grid>
            )}
          </>
        );
      case types.BY_SIDE:
        return (
          <>
            <Grid item xs={12} md={6} lg={3}>
              <StyledInput
                label={t('FIELDS.REQUEST_TYPE')}
                value={currentProcess?.additional_data?.dispute_request_type === 'BY_TKO' ? t('BY_TKO') : t('BY_SIDE')}
                readOnly
              />
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
              <StyledInput
                label={t('FIELDS.EIC_CODE_TYPE_X_OF_PART')}
                value={currentProcess?.side_data?.eic}
                readOnly
              />
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
              <StyledInput label={t('FIELDS.PART_ID')} value={currentProcess?.side_data?.usreou} readOnly />
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
              <StyledInput label={t('FIELDS.UNIQUE_APS')} value={currentProcess?.successful} readOnly />
            </Grid>
            <Grid item xs={12} md={6}>
              <StyledInput label={t('FIELDS.PART_NAME')} value={currentProcess?.side_data?.short_name} readOnly />
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
              <StyledInput
                label={t('FIELDS.MUST_BE_FINISHED_AT')}
                value={
                  currentProcess?.deadline_response_at &&
                  moment(currentProcess?.deadline_response_at).format('DD.MM.yyyy • HH:mm')
                }
                readOnly
              />
            </Grid>
            {currentProcess?.status === 'CANCELED_BY_OWNER' && (
              <Grid item xs={12} md={6} lg={3}>
                <StyledInput
                  label={t('FIELDS.CANCELED_AT')}
                  value={
                    currentProcess?.finished_at && moment(currentProcess?.finished_at).format('DD.MM.yyyy • HH:mm')
                  }
                  readOnly
                />
              </Grid>
            )}
            {currentProcess?.status === 'DONE' && (
              <Grid item xs={12} md={3} lg={3}>
                <StyledInput
                  label={t('FIELDS.COMPLETE_DATETIME')}
                  value={
                    currentProcess?.finished_at && moment(currentProcess?.finished_at).format('DD.MM.yyyy • HH:mm')
                  }
                  readOnly
                />
              </Grid>
            )}
          </>
        );
      default:
        return null;
    }
  };

  const handleDownload = (file) => {
    dispatch(downloadFileById(file?.file_id, file?.file_name));
    exportFileLog(uid);
  };

  const handleDownloadFile = () => {
    if (!currentProcess?.file_description?.file_description) return;

    dispatch(
      downloadFileById(currentProcess?.file_description?.file_description, currentProcess?.file_description?.file_name)
    );
    exportFileLog(uid);
  };

  return (
    <Page
      pageName={
        currentProcess ? t('PAGES.DISPUTE_TKO_SUBPROCESS_ID', { id: currentProcess?.id }) : `${t('LOADING')}...`
      }
      backRoute={'/processes'}
      faqKey={'PROCESSES__DISPUTE_TKO_SUBPROCESS'}
      loading={loading || uploading || delegating}
      notFoundMessage={notFound && t('PROCESS_NOT_FOUND')}
      controls={
        <>
          {currentProcess?.can_cancel && (
            <CircleButton
              type={'block'}
              title={t('CONTROLS.NO_AVAILABLE_AP')}
              disabled={!answerDescription.length}
              onClick={() => setOpenEmptyTkoDialog(true)}
            />
          )}
          {currentProcess?.can_start && (
            <CircleButton
              type={'create'}
              title={t('CONTROLS.TAKE_TO_WORK')}
              onClick={() => dispatch(startDisputeSubprocess(uid))}
            />
          )}
          {currentProcess?.status === 'IN_PROCESS' && (
            <>
              <CircleButton
                type={'done'}
                title={t('CONTROLS.COMPLETE_REQUEST')}
                onClick={() => dispatch(doneDisputeSubprocess(uid, { answer_description: answerDescription }))}
                disabled={currentProcess?.successful < 1 || !answerDescription.length || !currentProcess?.can_done}
              />
              <CircleButton
                type={'upload'}
                title={t('CONTROLS.IMPORT')}
                onClick={() => setOpenImportModal(true)}
                disabled={!currentProcess?.can_upload}
              />
            </>
          )}
          {currentProcess?.status === 'IN_PROCESS' &&
            currentProcess?.additional_data?.dispute_request_type === types.BY_TKO && (
              <CircleButton
                type={'download'}
                title={t('CONTROLS.DOWNLOAD')}
                onClick={() => dispatch(exportDisputeTkoSubprocess(uid, 'tko_for_get_dispute_response'))}
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
        </>
      }
    >
      <Statuses
        statuses={['NEW', 'IN_PROCESS', 'PARTIALLY_DONE', 'DONE', 'CANCELED']}
        currentStatus={currentProcess?.status}
      />
      <div className={'boxShadow'} style={{ padding: 24, marginTop: 16, marginBottom: 16 }}>
        <Grid container spacing={3} alignItems={'flex-start'}>
          {handleDisputeLayout(currentProcess?.additional_data?.dispute_request_type)}
          <Grid item xs={12}>
            <StyledInput
              label={t('FIELDS.JUSTIFICATION')}
              value={currentProcess?.additional_data?.process_description}
              multiline
              readOnly
            />
          </Grid>
          <Grid item xs={12} md={12} lg={3}>
            <StyledInput
              label={t('FIELDS.DISPUTE_FILE')}
              value={currentProcess?.file_description?.file_name}
              readOnly
              endAdornment={
                <InputAdornment position="end">
                  <CircleButton
                    type="download"
                    size="small"
                    title={t('CONTROLS.DOWNLOAD')}
                    onClick={handleDownloadFile}
                  />
                </InputAdornment>
              }
            />
          </Grid>
          <Grid item xs={12}>
            <StyledInput
              label={t('FIELDS.ANSWER')}
              value={answerDescription}
              error={
                currentProcess?.status !== 'IN_PROCESS'
                  ? processError?.answer_description
                  : answerDescription?.length >= 500 && t('VERIFY_MSG.MAX_SYMBOLS_COUNT_500')
              }
              onChange={({ target }) => setAnswerDescription(target.value)}
              multiline
              max={500}
              readOnly={currentProcess?.status !== 'NEW' && currentProcess?.status !== 'IN_PROCESS'}
            />
          </Grid>
        </Grid>
      </div>
      <h3
        style={{
          fontSize: 16,
          fontWeight: 'normal',
          color: '#0D244D',
          lineHeight: 1.2,
          paddingBottom: 12,
          paddingTop: 18
        }}
      >
        {t('TOTAL_NUMBER_UPLOADED_AP_IN_REQUEST')}:
      </h3>
      <UploadedFilesTable
        files={currentProcess?.files || []}
        handleDownload={handleDownload}
        handleUpdateList={() => dispatch(getDisputeTkoSubprocess(uid))}
      />
      <div className={'boxShadow'} style={{ padding: 24, marginTop: 16, marginBottom: 16 }}>
        <Grid container spacing={3} alignItems={'flex-start'}>
          <Grid item xs={12} md={6}>
            <StyledInput label={t('FIELDS.USER_INITIATOR')} value={currentProcess?.initiator?.username} readOnly />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <StyledInput
              label={t('FIELDS.CREATED_AT')}
              value={currentProcess?.created_at && moment(currentProcess?.created_at).format('DD.MM.yyyy • HH:mm')}
              readOnly
            />
          </Grid>
          <Grid item xs={12} md={6} lg={12}>
            <StyledInput
              label={t('FIELDS.INITIATOR_COMPANY')}
              value={currentProcess?.initiator_company?.short_name}
              readOnly
            />
          </Grid>
        </Grid>
      </div>
      {currentProcess?.status !== 'NEW' && (
        <div className={'boxShadow'} style={{ padding: 24, marginTop: 16, marginBottom: 16 }}>
          <Grid container spacing={3} alignItems={'flex-start'}>
            <Grid item xs={12} md={6}>
              <DelegateInput
                label={t('FIELDS.USER_EXECUTOR')}
                readOnly
                value={currentProcess?.executor?.username}
                data={currentProcess?.delegation_history || []}
              />
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
              <StyledInput
                label={t('FIELDS.START_WORK_DATE')}
                value={currentProcess?.started_at && moment(currentProcess?.started_at).format('DD.MM.yyyy • HH:mm')}
                readOnly
              />
            </Grid>
            <Grid item xs={12}>
              <StyledInput
                label={t('FIELDS.EXECUTOR_COMPANY')}
                value={currentProcess?.executor_company?.short_name}
                readOnly
              />
            </Grid>
          </Grid>
        </div>
      )}
      <SimpleImportModal
        title={t('IMPORT_AP_FILES')}
        openUpload={openImportModal}
        setOpenUpload={setOpenImportModal}
        uploading={uploading}
        handleUpload={(data) => {
          setOpenImportModal(false);
          dispatch(
            uploadDisputeTkoSubprocess(data, uid, () => {
              dispatch(getDisputeTkoSubprocess(uid));
              dispatch(clearMmsUpload());
            })
          );
        }}
        layoutList={[
          {
            key: 'file_original',
            label: t('IMPORT_FILE.SELECT_FILE_WITH_AP_INFORMAT', { format: '.xls, .xlsx, .xlsm' }),
            accept: '.xls,.xlsx,.xlsm',
            maxSize: 26214400,
            sizeError: t('VERIFY_MSG.MAX_FILE_SIZE', { size: 25 })
          },
          {
            key: 'file_original_key',
            label: t('IMPORT_FILE.SELECT_DIGITAL_SIGNATURE_FILE'),
            accept: '.p7s',
            maxSize: 40960,
            sizeError: t('VERIFY_MSG.UNCORRECT_SIGNATURE')
          }
        ]}
        error={error}
      />
      <CancelModal
        text={t('MODALS.CONFIRM_MISSING_AP')}
        open={openEmptyTkoDialog}
        onClose={() => setOpenEmptyTkoDialog(false)}
        onSubmit={() => {
          dispatch(doneDisputeSubprocess(uid, { answer_description: answerDescription }, true));
          setOpenEmptyTkoDialog(false);
        }}
      />
    </Page>
  );
};

export default DisputeTkoSubprocessDetails;
