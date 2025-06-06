import { Grid } from '@material-ui/core';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import WarningRounded from '@mui/icons-material/WarningRounded';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import {
  cancelDistrictProcesses,
  clearCurrentProcess,
  completeDistrictProcesses,
  createDistrictProcesses,
  downloadDistrictProcessesFile,
  getDistrictProcesses,
  getUpdateTkoDataProcesses,
  uploadFilesDistrictProcesses
} from '../../../../actions/processesActions';
import { checkPermissions } from '../../../../util/verifyRole';
import Page from '../../../Global/Page';
import { ModalWrapper } from '../../../Modal/ModalWrapper';
import SimpleImportModal from '../../../Modal/SimpleImportModal';
import { BlueButton } from '../../../Theme/Buttons/BlueButton';
import CircleButton from '../../../Theme/Buttons/CircleButton';
import { DangerButton } from '../../../Theme/Buttons/DangerButton';
import { LightTooltip } from '../../../Theme/Components/LightTooltip';
import Statuses from '../../../Theme/Components/Statuses';
import StyledInput from '../../../Theme/Fields/StyledInput';
import NotResultRow from '../../../Theme/Table/NotResultRow';
import { StyledTable } from '../../../Theme/Table/StyledTable';
import SelectField from '../../../Theme/Fields/SelectField';
import DelegateBtn from '../../../../features/delegate/delegateBtn';
import DelegateInput from '../../../../features/delegate/delegateInput';
import { useTranslation } from 'react-i18next';
import useExportFileLog from '../../../../services/actionsLog/useEportFileLog';
import useProcessRoom from '../../../../app/sockets/useProcessRoom';
import {
  useChangeTkoFormMutation,
  useChangeTkoFormTakeToWorkMutation,
  useChangeTkoProlongMutation,
  useChangeTkoRejectMutation
} from './api';
import ConfirmModal from '../../../../features/processes/addingNewVirtualTko/ConfirmModal';

export const UPDATE_TKO_DATA_ACCESS_ACCEPT_ROLES = [
  'АКО',
  'АКО_Процеси',
  'АКО_ППКО',
  'АКО_Користувачі',
  'АКО_Довідники',
  'АТКО',
  'СВБ',
  'ОЗКО',
  'ГарПок'
];
export const UPDATE_TKO_DATA_ACCESS_INITIALIZATION_ROLES = ['АТКО', 'АКО', 'АКО_Процеси', 'СВБ', 'ОЗКО', 'ГарПок'];

const completeField = (status) => {
  switch (status) {
    case 'CANCELED':
    case 'CANCELED_BY_OWNER':
      return {
        label: 'CANCELED_AT',
        data: 'finished_at'
      };
    case 'REJECTED':
      return {
        label: 'REQUEST_CANCEL_REJECTED_DATE',
        data: 'finished_at'
      };
    default:
      return {
        label: 'COMPLETE_DATETIME',
        data: 'completed_at'
      };
  }
};

const ChangeTko = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { uid } = useParams();
  const { full_name, activeOrganization, activeRoles } = useSelector(({ user }) => user);
  const { loading, notFound, currentProcess, uploading, error, updateTkoData } = useSelector(
    ({ processes }) => processes
  );
  const [openUpload, setOpenUpload] = useState(false);
  const [openRemoveDialog, setOpenRemoveDialog] = useState(false);
  const [rejectDialog, setRejectDialog] = useState(false);
  const [approveDialog, setApproveDialog] = useState(false);
  const [selectedTypeTko, setSelectedTypeTko] = useState(null);
  const [delegating, setDelegating] = useState(false);
  const exportFileLog = useExportFileLog(['Оновлення характеристик ТКО']);
  const [onForm, { isLoading }] = useChangeTkoFormMutation();
  const [onTakeToWork, { isLoading: isTakeToWorkLoading }] = useChangeTkoFormTakeToWorkMutation();
  const [onReject, { isLoading: isRejecting }] = useChangeTkoRejectMutation();
  const [onProlong, { isLoading: isProlonging }] = useChangeTkoProlongMutation();

  const allLoadings =
    loading || uploading || delegating || isLoading || isTakeToWorkLoading || isRejecting || isProlonging;

  useProcessRoom(uid, () => dispatch(getDistrictProcesses(uid)));

  useEffect(() => {
    if (openUpload) {
      setOpenUpload(false);
    }
    dispatch(uid ? getDistrictProcesses(uid) : getUpdateTkoDataProcesses());
    return () => dispatch(clearCurrentProcess());
  }, [dispatch, navigate, activeRoles, uid]);

  const handleStart = () => {
    dispatch(
      createDistrictProcesses({ mp_type: selectedTypeTko }, (uid) => navigate(`/processes/change-main-data-tko/${uid}`))
    );
  };

  const handleUpdateList = () => {
    dispatch(getDistrictProcesses(uid));
  };

  const handleRemove = () => {
    dispatch(cancelDistrictProcesses(uid));
    setOpenRemoveDialog(false);
  };

  const handleComplete = (comment) => {
    dispatch(completeDistrictProcesses(uid, comment));
  };

  const handleDownload = ({ file_id, file_name }) => {
    dispatch(downloadDistrictProcessesFile(file_id, file_name));
    exportFileLog(uid);
  };

  const handleForm = () => {
    onForm(uid)
      .unwrap()
      .then(() => dispatch(getDistrictProcesses(uid)));
  };

  const handleTakeToWork = () => {
    onTakeToWork(uid)
      .unwrap()
      .then(() => dispatch(getDistrictProcesses(uid)));
  };

  const handleProlong = () => {
    onProlong(uid)
      .unwrap()
      .then(() => dispatch(getDistrictProcesses(uid)));
  };

  const handleReject = (reason) => {
    onReject({
      uid,
      body: { reason }
    })
      .unwrap()
      .then(() => {
        dispatch(getDistrictProcesses(uid));
        setRejectDialog(false);
      });
  };

  return (
    <Page
      pageName={currentProcess?.id ? t('PAGES.CHANGE_TKO_ID', { id: currentProcess?.id }) : t('PAGES.CHANGE_TKO')}
      backRoute={'/processes'}
      acceptPermisions={uid ? 'PROCESSES.CHANGE_MAIN_DATA_TKO.ACCESS' : 'PROCESSES.CHANGE_MAIN_DATA_TKO.INITIALIZATION'}
      acceptRoles={uid ? UPDATE_TKO_DATA_ACCESS_ACCEPT_ROLES : UPDATE_TKO_DATA_ACCESS_INITIALIZATION_ROLES}
      faqKey={'PROCESSES__UPDATE_TKO_DATA'}
      notFoundMessage={notFound && t('REQUEST_NOT_FOUND')}
      loading={allLoadings}
      controls={
        <>
          {checkPermissions(
            'PROCESSES.CHANGE_MAIN_DATA_TKO.CONTROLS.CREATE',
            UPDATE_TKO_DATA_ACCESS_INITIALIZATION_ROLES
          ) &&
            !uid && (
              <CircleButton
                type={'create'}
                onClick={handleStart}
                title={t('CONTROLS.TAKE_TO_WORK')}
                disabled={allLoadings || !selectedTypeTko}
              />
            )}
          {currentProcess?.can_cancel && (
            <CircleButton
              type={'remove'}
              onClick={() => setOpenRemoveDialog(true)}
              title={t('CONTROLS.CANCEL_PROCESS')}
              disabled={allLoadings}
            />
          )}
          {currentProcess?.can_reject && (
            <CircleButton
              type={'remove'}
              title={t('CONTROLS.REJECT_REQUEST')}
              onClick={() => setRejectDialog(true)}
              disabled={allLoadings}
            />
          )}
          {currentProcess?.can_delegate && (
            <DelegateBtn
              process_uid={uid}
              onStarted={() => setDelegating(true)}
              onFinished={() => setDelegating(false)}
              onSuccess={() => window.location.reload()}
              disabled={allLoadings}
            />
          )}
          {currentProcess?.can_prolong && (
            <CircleButton
              type={'update'}
              onClick={handleProlong}
              title={t('CONTROLS.CONTINUE_REVIEW', { days: 5 })}
              disabled={allLoadings}
            />
          )}
          {currentProcess?.can_upload && (
            <CircleButton
              type={'upload'}
              onClick={() => setOpenUpload(true)}
              title={t('CONTROLS.IMPORT')}
              disabled={allLoadings}
            />
          )}
          {currentProcess?.can_form && (
            <CircleButton type={'new'} title={t('CONTROLS.FORM')} onClick={handleForm} disabled={allLoadings} />
          )}
          {currentProcess?.can_take_to_work && (
            <CircleButton
              type={'create'}
              title={t('CONTROLS.TAKE_TO_WORK')}
              onClick={handleTakeToWork}
              disabled={allLoadings}
            />
          )}
          {currentProcess?.can_complete && (
            <CircleButton
              type={'done'}
              onClick={() => (currentProcess?.show_executor_block ? setApproveDialog(true) : handleComplete())}
              title={t('CONTROLS.DONE_PROCESS')}
              disabled={allLoadings}
            />
          )}
        </>
      }
    >
      <Statuses
        statuses={['NEW', 'IN_PROCESS', 'FORMED', 'DONE', 'PARTIALLY_DONE', 'CANCELED', 'REJECTED']}
        currentStatus={currentProcess?.status || 'NEW'}
      />
      <div className={'boxShadow'} style={{ padding: 24, marginTop: 16 }}>
        <Grid container spacing={3} alignItems={'center'}>
          <Grid item xs={12} lg={3}>
            {currentProcess?.delegate_initiator ? (
              <DelegateInput
                label={t('FIELDS.USER_INITIATOR')}
                disabled
                value={uid ? currentProcess?.initiator?.username : full_name}
                data={currentProcess?.delegation_history || []}
              />
            ) : (
              <StyledInput
                label={t('FIELDS.USER_INITIATOR')}
                disabled
                value={uid ? currentProcess?.initiator?.username : full_name}
              />
            )}
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <StyledInput
              label={t('FIELDS.CREATED_AT')}
              disabled
              value={currentProcess?.created_at && moment(currentProcess?.created_at).format('DD.MM.yyyy • HH:mm')}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <StyledInput
              label={
                currentProcess?.status?.includes('CANCELED') ? t('FIELDS.CANCELED_AT') : t('FIELDS.COMPLETE_DATETIME')
              }
              disabled
              value={currentProcess?.finished_at && moment(currentProcess?.finished_at).format('DD.MM.yyyy • HH:mm')}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <StyledInput label={t('FIELDS.UNIQUE_APS')} disabled value={currentProcess?.successful?.toString()} />
          </Grid>
          <Grid item xs={12} lg={6}>
            <StyledInput
              label={t('FIELDS.INITIATOR_COMPANY')}
              disabled
              value={uid ? currentProcess?.initiator_company?.short_name : activeOrganization?.name}
            />
          </Grid>
          <Grid item xs={12} lg={6}>
            {uid ? (
              <StyledInput
                label={t('FIELDS.AP_TYPE')}
                disabled
                value={
                  currentProcess?.mp_type.value ? t(`PLATFORM.${currentProcess?.mp_type.value.toUpperCase()}`) : ''
                }
              />
            ) : (
              <SelectField
                label={t('FIELDS.AP_TYPE')}
                value={selectedTypeTko}
                data={
                  updateTkoData?.mp_type.map(({ value }) => ({
                    value,
                    label: t(`PLATFORM.${value?.toUpperCase()}`)
                  })) || []
                }
                readOnly={uid}
                onChange={setSelectedTypeTko}
                required
              />
            )}
          </Grid>
        </Grid>
      </div>
      {currentProcess?.show_executor_block &&
        ['FORMED', 'DONE', 'PARTIALLY_DONE', 'CANCELED', 'CANCELED_BY_OWNER', 'REJECTED'].includes(
          currentProcess?.status
        ) && (
          <div className={'boxShadow'} style={{ padding: 24, marginTop: 16 }}>
            <Grid container spacing={3} alignItems={'center'}>
              <Grid item xs={12} lg={6}>
                <DelegateInput
                  label={t('FIELDS.USER_EXECUTOR')}
                  disabled
                  value={currentProcess.executor?.username ?? ''}
                  data={currentProcess.delegation_history || []}
                />
              </Grid>
              <Grid item xs={12} md={6} lg={3}>
                <StyledInput
                  label={t('FIELDS.START_WORK_DATE')}
                  disabled
                  value={currentProcess.formed_at && moment(currentProcess.formed_at).format('DD.MM.yyyy • HH:mm')}
                />
              </Grid>
              <Grid item xs={12} md={6} lg={3}>
                <StyledInput
                  label={t(`FIELDS.${completeField(currentProcess?.status).label}`)}
                  disabled
                  value={
                    currentProcess[completeField(currentProcess?.status).data] &&
                    moment(currentProcess[completeField(currentProcess?.status).data]).format('DD.MM.yyyy • HH:mm')
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <StyledInput
                  label={t('FIELDS.EXECUTOR_COMPANY_NAME')}
                  disabled
                  value={currentProcess.executor_company?.short_name || ''}
                />
              </Grid>
              {currentProcess?.status === 'REJECTED' && (
                <Grid item xs={12}>
                  <StyledInput
                    label={t('FIELDS.REJECTED_REASON')}
                    disabled
                    value={currentProcess.reject_reason || ''}
                  />
                </Grid>
              )}
              {currentProcess?.status === 'DONE' && (
                <Grid item xs={12}>
                  <StyledInput label={t('FIELDS.COMMENT')} disabled value={currentProcess?.complete_comment || ''} />
                </Grid>
              )}
            </Grid>
          </div>
        )}
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
        {t('TOTAL_NUMBER_OF_FILES_UPLOADEDP_AS_PART_OF_THE_APPLICATION')}:
      </h3>
      <UploadedFilesTable
        files={currentProcess?.files || []}
        handleDownload={handleDownload}
        handleUpdateList={handleUpdateList}
      />
      <SimpleImportModal
        title={t('IMPORT_AP_FILES')}
        openUpload={openUpload}
        setOpenUpload={setOpenUpload}
        uploading={uploading}
        handleUpload={(data) =>
          dispatch(
            uploadFilesDistrictProcesses(uid, data, () => {
              setOpenUpload(false);
              dispatch(getDistrictProcesses(uid));
            })
          )
        }
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
        warningMessage={t('IMPORT_FILE.IMPORT_MAX_AP_COUNT_WARNING')}
      />
      <ModalWrapper
        open={openRemoveDialog}
        onClose={() => setOpenRemoveDialog(false)}
        header={t('DO_YOU_WANT_TO_CANCEL_THE_PROCESS')}
        maxWidth={'sm'}
      >
        <Grid container justifyContent={'space-between'} alignItems={'center'} spacing={3} style={{ marginTop: 24 }}>
          <Grid item xs={6}>
            <BlueButton onClick={() => setOpenRemoveDialog(false)} style={{ width: '100%' }}>
              {t('CONTROLS.NO')}
            </BlueButton>
          </Grid>
          <Grid item xs={6}>
            <DangerButton onClick={handleRemove} style={{ width: '100%' }}>
              {t('CONTROLS.YES')}
            </DangerButton>
          </Grid>
        </Grid>
      </ModalWrapper>
      <ConfirmModal
        text={t('REASON_FOR_REJECTING_APPLICATION')}
        fieldLabel={t('FIELDS.REQUEST_REJECTED_REASON')}
        open={rejectDialog}
        onClose={() => setRejectDialog(false)}
        onSubmit={(reason) => {
          handleReject(reason);
        }}
      />
      <ConfirmModal
        text={t('MODALS.ADD_COMMENT_TO_APPROVE_APPLICATION')}
        fieldLabel={t('FIELDS.COMMENT')}
        open={approveDialog}
        onClose={() => setApproveDialog(false)}
        onSubmit={(comment) => {
          setApproveDialog(false);
          handleComplete(comment);
        }}
      />
    </Page>
  );
};

const UploadedFilesTable = ({ files, handleDownload, handleUpdateList }) => {
  const { t } = useTranslation();

  return (
    <StyledTable>
      <TableHead>
        <TableRow>
          <TableCell style={{ minWidth: 130 }}>{t('FIELDS.USER_FULL_NAME')}</TableCell>
          <TableCell style={{ minWidth: 122 }}>{t('FIELDS.DOWNLOAD_DATETIME')}</TableCell>
          <TableCell style={{ minWidth: 100 }}>{t('FIELDS.FILENAME')}</TableCell>
          <TableCell style={{ minWidth: 410 }} colSpan={4}>
            {t('FIELDS.FILE_RETURN_CODES')}
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {files.length === 0 ? (
          <NotResultRow text={t('FILES_ARE_MISSING')} span={7} small />
        ) : (
          files.map((file, index) => (
            <UploadedFilesRow
              key={'file-' + index}
              {...file}
              handleDownloadFile={() => handleDownload(file)}
              handleUpdateList={handleUpdateList}
            />
          ))
        )}
      </TableBody>
    </StyledTable>
  );
};

const UploadedFilesRow = ({
  created_by,
  created_at,
  file_name,
  all_tko_count,
  success,
  failed,
  status,
  handleDownloadFile,
  handleUpdateList,
  description
}) => {
  const { t } = useTranslation();

  return (
    <>
      <TableRow data-marker="table-row" className="body__table-row">
        <TableCell data-marker={'created_by'}>{created_by || ''}</TableCell>
        <TableCell data-marker={'created_at'}>
          {created_at ? moment(created_at).format('DD.MM.yyyy • HH:mm') : ''}
        </TableCell>
        <TableCell data-marker={'file_name'}>{file_name || ''}</TableCell>
        <TableCell data-marker={'all_tko_count'}>
          {t('IN_TOTAL')}: {all_tko_count || 0}
        </TableCell>
        <TableCell data-marker={'success'}>
          <span className={'success'}>
            {t('FILE_PROCESSING_STATUSES.DONE')}: {success || 0}
          </span>
        </TableCell>
        <TableCell data-marker={'failed'}>
          <span className={'danger'}>
            {t('NOT_DOWNLOADED')}: {failed || 0}
          </span>
        </TableCell>
        <TableCell style={{ position: 'relative' }} data-marker={'status'}>
          {(status === 'FAILED' || status === 'BAD_FILE_STRUCTURE') && (
            <LightTooltip
              title={
                status === 'BAD_FILE_STRUCTURE'
                  ? description || t('FILE_PROCESSING_STATUSES.BAD_FILE_STRUCTURE')
                  : t('FILE_PROCESSING_STATUSES.FAILED')
              }
              arrow
              disableTouchListener
              disableFocusListener
            >
              <WarningRounded
                data-marker={`error: ${status}`}
                style={{
                  color: '#f90000',
                  fontSize: 22,
                  cursor: 'pointer'
                }}
              />
            </LightTooltip>
          )}
          {file_name && status !== 'FAILED' && status !== 'BAD_FILE_STRUCTURE' && (
            <CircleButton
              type={status === 'IN_PROCESS' || status === 'NEW' ? 'loading' : 'download'}
              size={'small'}
              onClick={status === 'DONE' || status === 'FAILED' ? handleDownloadFile : handleUpdateList}
              title={status === 'DONE' || status === 'FAILED' ? t('DOWNLOAD_RESULT') : `${t('FILE_PROCESSING')}...`}
            />
          )}
        </TableCell>
      </TableRow>
    </>
  );
};

export default ChangeTko;
