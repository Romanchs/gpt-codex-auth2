import { Grid } from '@material-ui/core';
import makeStyles from '@material-ui/core/styles/makeStyles';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import WarningRounded from '@mui/icons-material/WarningRounded';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import { clearTkoUpload } from '../../../../actions/massLoadActions';
import {
  cancelPonRequestTko,
  clearPonRequestTko,
  deletePonRequestUploadedTko,
  donePonRequestTko,
  downloadPonRequestTkoFile,
  getPonRequestTkoData,
  startPonRequestTko,
  uploadPonTko
} from '../../../../actions/ponActions';
import { checkPermissions } from '../../../../util/verifyRole';
import Page from '../../../Global/Page';
import { ImportTkoModalToggle } from '../../../Modal/ImportTkoModalToggle';
import { ModalWrapper } from '../../../Modal/ModalWrapper';
import { BlueButton } from '../../../Theme/Buttons/BlueButton';
import CircleButton from '../../../Theme/Buttons/CircleButton';
import { DangerButton } from '../../../Theme/Buttons/DangerButton';
import { LightTooltip } from '../../../Theme/Components/LightTooltip';
import Statuses from '../../../Theme/Components/Statuses';
import StyledInput from '../../../Theme/Fields/StyledInput';
import NotResultRow from '../../../Theme/Table/NotResultRow';
import { StyledTable } from '../../../Theme/Table/StyledTable';
import DelegateBtn from '../../../../features/delegate/delegateBtn';
import DelegateInput from '../../../../features/delegate/delegateInput';
import { useTranslation } from 'react-i18next';
import useExportFileLog from '../../../../services/actionsLog/useEportFileLog';

const useStyles = makeStyles(() => ({
  header: {
    fontSize: 16,
    fontWeight: 'normal',
    color: '#0D244D',
    lineHeight: 1.2
  }
}));

export const REQUEST_TKO_ACCEPT_ROLES = ['АКО', 'АКО_Процеси', 'АКО_ППКО', 'АКО_Користувачі', 'АКО_Довідники', 'АТКО'];

const RequestTko = ({ dispatch, loading, data, notFound, activeRoles, error }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const { uid } = useParams();
  const navigate = useNavigate();
  const [openUpload, setOpenUpload] = useState(false);
  const [openRemoveDialog, setOpenRemoveDialog] = useState(false);
  const [openDoneDialog, setOpenDoneDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [delegating, setDelegating] = useState(false);

  const [uploading, setUploading] = useState(false);
  const exportFileLog = useExportFileLog(['Запит даних у АТКО']);

  useEffect(() => {
    if (checkPermissions('PROCESSES.PON.REQUEST_TKO_DATA.ACCESS', REQUEST_TKO_ACCEPT_ROLES)) {
      dispatch(getPonRequestTkoData(uid));
    } else {
      navigate('/processes');
    }
    return () => dispatch(clearPonRequestTko());
  }, [dispatch, navigate, activeRoles, uid]);

  const handleUpdateList = () => {
    dispatch(getPonRequestTkoData(uid));
  };

  const handleDownload = ({ file_id, file_name }) => {
    dispatch(downloadPonRequestTkoFile(file_id, file_name));
    exportFileLog(uid);
  };

  const handleStart = () => {
    dispatch(startPonRequestTko(uid));
  };

  const handleRemove = () => {
    dispatch(cancelPonRequestTko(uid));
    setOpenRemoveDialog(false);
  };

  const handleDone = () => {
    dispatch(donePonRequestTko(uid));
    setOpenDoneDialog(false);
  };

  const handleDeleteAll = () => {
    dispatch(deletePonRequestUploadedTko(uid));
    setOpenDeleteDialog(false);
  };

  const handleUpload = () => {
    setOpenUpload(true);
  };

  const onUpload = (data, isNewMode) => {
    setUploading(true);
    dispatch(
      uploadPonTko(
        isNewMode ? 'new' : 'old',
        uid,
        data,
        () => {
          setUploading(false);
          setOpenUpload(false);
          dispatch(clearTkoUpload());
          handleUpdateList();
        },
        () => setUploading(false)
      )
    );
  };

  return (
    <Page
      pageName={data?.id && !loading ? t('PAGES.REQUEST_TKO_DATA_ID', { id: data?.id }) : t('PAGES.REQUEST_TKO_DATA')}
      backRoute={'/processes'}
      faqKey={'PROCESSES__REQUEST_DATA_IN_ATKO'}
      notFoundMessage={notFound && t('REQUEST_NOT_FOUND')}
      loading={loading || delegating}
      controls={
        <>
          {data?.can_start_subprocess && checkPermissions('PROCESSES.PON.REQUEST_TKO_DATA.CONTROLS.START', 'АТКО') && (
            <CircleButton type={'create'} onClick={handleStart} title={t('CONTROLS.TAKE_TO_WORK')} disabled={loading} />
          )}
          {data?.can_close_subprocess &&
            checkPermissions('PROCESSES.PON.REQUEST_TKO_DATA.CONTROLS.TKO_MISSING', 'АТКО') && (
              <CircleButton
                type={'block'}
                onClick={() => setOpenRemoveDialog(true)}
                title={t('CONTROLS.NO_AVAILABLE_AP')}
                disabled={loading}
              />
            )}
          {data?.can_delete_files &&
            checkPermissions('PROCESSES.PON.REQUEST_TKO_DATA.CONTROLS.DELETE_ALL_TKO', 'АТКО') && (
              <CircleButton
                type={'delete'}
                onClick={() => setOpenDeleteDialog(true)}
                title={t('CONTROLS.DELETE_ALL_TKO')}
                disabled={loading}
              />
            )}
          {data?.can_done_subprocess && (
            <CircleButton
              type={'done'}
              onClick={() => setOpenDoneDialog(true)}
              title={t('CONTROLS.DONE_PROCESS')}
              disabled={loading}
            />
          )}
          {data?.can_upload_file && checkPermissions('PROCESSES.PON.REQUEST_TKO_DATA.CONTROLS.UPLOAD', 'АТКО') && (
            <CircleButton type={'upload'} onClick={handleUpload} title={t('CONTROLS.IMPORT')} disabled={loading} />
          )}
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
        statuses={['NEW', 'IN_PROCESS', 'PARTIALLY_DONE', 'DONE', 'CANCELED']}
        currentStatus={data?.status.startsWith('CANCELED') ? 'CANCELED' : data?.status}
      />
      <div className={'boxShadow'} style={{ padding: 24, marginTop: 16 }}>
        <Grid container spacing={3} alignItems={'center'}>
          <Grid item xs={12} md={6}>
            <StyledInput label={t('FIELDS.REQUEST_TYPE')} disabled value={data?.request_type} />
          </Grid>
          <Grid item xs={12} md={6} lg={2}>
            <StyledInput label={t('FIELDS.EIC_CODE_INITIATOR')} disabled value={data?.current_supplier?.eic} />
          </Grid>
          <Grid item xs={12} md={6} lg={2}>
            <StyledInput label={t('FIELDS.COMPANY_USREOU')} disabled value={data?.current_supplier?.usreou} />
          </Grid>
          <Grid item xs={12} md={6} lg={2}>
            <StyledInput
              label={t('FIELDS.MUST_BE_FINISHED_AT')}
              disabled
              value={data?.must_be_finished_at && moment(data?.must_be_finished_at).format('DD.MM.yyyy • HH:mm')}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <StyledInput label={t('FIELDS.SUPPLIER_NAME')} disabled value={data?.current_supplier?.full_name} />
          </Grid>
          <Grid item xs={12} md={3}>
            <StyledInput
              label={t('FIELDS.UNIQUE_APS')}
              disabled
              value={data?.uploaded_successfully_unique_tko.toString()}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <StyledInput
              label={t('FIELDS.TKOS_NUMBER_REGISTER')}
              disabled
              value={data?.tkos_number_register?.toString()}
            />
          </Grid>
          <Grid item xs={12}>
            <StyledInput label={t('FIELDS.JUSTIFICATION')} disabled value={data?.reasoning} multiline={true} />
          </Grid>
        </Grid>
      </div>
      <Grid
        container
        justifyContent={'space-between'}
        alignItems={'center'}
        spacing={3}
        style={{ paddingBottom: 12, paddingTop: 18 }}
      >
        <Grid item xs={12}>
          <h3 className={classes.header}>{t('TOTAL_NUMBER_OF_FILES_UPLOADEDP_AS_PART_OF_THE_APPLICATION')}:</h3>
        </Grid>
      </Grid>
      <UploadedFilesTable
        files={data?.uploaded_files || []}
        handleDownload={(file) => {
          handleDownload(file);
          if (data?.can_close_by_download) dispatch(cancelPonRequestTko(uid));
        }}
        handleUpdateList={handleUpdateList}
      />
      <div className={'boxShadow'} style={{ padding: 24, marginTop: 16 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <StyledInput label={t('FIELDS.USER_INITIATOR')} readOnly value={data?.initiator} />
          </Grid>
          <Grid item xs={12} md={3}>
            <StyledInput
              label={t('FIELDS.CREATED_AT')}
              readOnly
              value={data?.created_at && moment(data?.created_at).format('DD.MM.yyyy • HH:mm')}
            />
          </Grid>
          <Grid item xs={12}>
            <StyledInput label={t('FIELDS.INITIATOR_COMPANY')} readOnly value={data?.initiator_company} />
          </Grid>
        </Grid>
      </div>
      <div className={'boxShadow'} style={{ padding: 24, marginTop: 16 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <DelegateInput
              label={t('FIELDS.USER_EXECUTOR')}
              readOnly
              value={data?.executor}
              data={data?.delegation_history || []}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <StyledInput
              label={t('FIELDS.START_WORK_DATE')}
              readOnly
              value={data?.started_at && moment(data?.started_at).format('DD.MM.yyyy • HH:mm')}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <StyledInput
              label={data?.status.startsWith('CANCELED') ? t('FIELDS.CANCELED_AT') : t('FIELDS.COMPLETE_DATETIME')}
              readOnly
              value={data?.finished_at && moment(data?.finished_at).format('DD.MM.yyyy • HH:mm')}
            />
          </Grid>
          <Grid item xs={12}>
            <StyledInput label={t('FIELDS.EXECUTOR_COMPANY')} readOnly value={data?.executor_company} />
          </Grid>
        </Grid>
      </div>
      <ImportTkoModalToggle
        onClose={() => {
          setOpenUpload(false);
          dispatch(clearTkoUpload());
        }}
        open={openUpload}
        loading={uploading}
        onUpload={onUpload}
        error={error}
      />
      <ModalWrapper
        open={openRemoveDialog}
        onClose={() => setOpenRemoveDialog(false)}
        header={t('MODALS.CONFIRM_MISSING_AP')}
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
      <ModalWrapper
        open={openDoneDialog}
        onClose={() => setOpenDoneDialog(false)}
        header={t('MODALS.CONFIRM_ALL_INFO_IS_PROVIDED')}
        maxWidth={'sm'}
      >
        <Grid container justifyContent={'space-between'} alignItems={'center'} spacing={3} style={{ marginTop: 24 }}>
          <Grid item xs={6}>
            <BlueButton onClick={() => setOpenDoneDialog(false)} style={{ width: '100%' }}>
              {t('CONTROLS.NO')}
            </BlueButton>
          </Grid>
          <Grid item xs={6}>
            <DangerButton onClick={handleDone} style={{ width: '100%' }}>
              {t('CONTROLS.YES')}
            </DangerButton>
          </Grid>
        </Grid>
      </ModalWrapper>
      <ModalWrapper
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        header={t('MODALS.CONFIRM_DELETE_UPLOADED_DATA')}
        maxWidth={'sm'}
      >
        <Grid container justifyContent={'space-between'} alignItems={'center'} spacing={3} style={{ marginTop: 24 }}>
          <Grid item xs={6}>
            <BlueButton onClick={() => setOpenDeleteDialog(false)} style={{ width: '100%' }}>
              {t('CONTROLS.NO')}
            </BlueButton>
          </Grid>
          <Grid item xs={6}>
            <DangerButton onClick={handleDeleteAll} style={{ width: '100%' }} disabled={loading}>
              {t('CONTROLS.YES')}
            </DangerButton>
          </Grid>
        </Grid>
      </ModalWrapper>
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
          files.map((file) => (
            <UploadedFilesRow
              key={file.file_id}
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
  handleUpdateList
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
        <TableCell data-marker={'all_tko_count'}>{`${t('IN_TOTAL')}: ${all_tko_count || 0}`}</TableCell>
        <TableCell data-marker={'success'}>
          <span className={'success'}>{`${t('FILE_PROCESSING_STATUSES.DONE')}: ${success || 0}`}</span>
        </TableCell>
        <TableCell data-marker={'failed'}>
          <span className={'danger'}>{`${t('NOT_DOWNLOADED')}: ${failed || 0}`}</span>
        </TableCell>
        <TableCell style={{ position: 'relative' }} data-marker={'status'}>
          {(status === 'FAILED' || status === 'BAD_FILE_STRUCTURE') && (
            <LightTooltip
              title={
                status === 'BAD_FILE_STRUCTURE'
                  ? t('FILE_PROCESSING_STATUSES.BAD_FILE_STRUCTURE')
                  : t('FILE_PROCESSING_STATUSES.FAILED')
              }
              arrow
              disableTouchListener
              disableFocusListener
            >
              <WarningRounded
                style={{
                  color: '#f90000',
                  fontSize: 22,
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
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

const mapStateToProps = ({ pon: { requestTko }, user, massLoad }) => ({
  loading: requestTko.loading,
  data: requestTko.data,
  notFound: requestTko.notFound,
  activeRoles: user.activeRoles,
  uploading: massLoad.uploading,
  uploadingResponse: massLoad.uploadingResponse,
  error: massLoad.error
});

export default connect(mapStateToProps)(RequestTko);
