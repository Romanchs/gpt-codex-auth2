import Grid from '@material-ui/core/Grid';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import {
  cancelConnectDisconnectProcess,
  clearCurrentProcess,
  doneConnectDisconnect,
  exportConnectingDisconnectingAps,
  getConnectingDisconnectingTKOFiles,
  initConnectionDisconnectionSubprocess,
  toFormConnectDisconnectProcess,
  uploadConnectingDisconnectingMassActionAp,
  uploadConnectingTKOFiles,
  uploadDisconnectingTKOFiles,
  uploadFileClear
} from '../../../../actions/processesActions';
import { checkPermissions } from '../../../../util/verifyRole';
import Page from '../../../Global/Page';
import { ModalWrapper } from '../../../Modal/ModalWrapper';
import { BlueButton } from '../../../Theme/Buttons/BlueButton';
import CircleButton from '../../../Theme/Buttons/CircleButton';
import { DangerButton } from '../../../Theme/Buttons/DangerButton';
import Statuses from '../../../Theme/Components/Statuses';
import { DHTab, DHTabs } from '../Components/Tabs';
import DetailsTab from './DetailsTab';
import ReasonModal from './ReasonModal';
import RequestsTab from './RequestsTab';
import SimpleImportModal from '../../../Modal/SimpleImportModal';
import UploadedFilesTab from './UploadedFilesTab';
import moment from 'moment';
import { ACTION_TYPES } from '.';
import { Stack } from '@mui/material';
import DelegateBtn from '../../../../features/delegate/delegateBtn';
import { useTranslation } from 'react-i18next';
import SelectField from '../../../Theme/Fields/SelectField';

const PAGE_TABS = {
  details: 'details',
  files: 'files',
  requests: 'requests'
};

export const CONNECTING_DISCONNECTING_ACCESS_ACCEPT_ROLES = ['АКО', 'АКО_Процеси', 'АКО_Користувачі', 'АТКО', 'СВБ'];

const ConnectingDisconnectingDetails = () => {
  const { t } = useTranslation();
  const { uid } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    activeRoles: [{ relation_id }]
  } = useSelector(({ user }) => user);
  const { loading, currentProcess, notFound } = useSelector(({ processes }) => processes);
  const { uploading, error } = useSelector(({ massLoad }) => massLoad);
  const [tab, setTab] = useState(PAGE_TABS.details);
  const [isOnlyFilesTabAvailable, setIsOnlyFilesTabAvailable] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [doneModalText, setDoneModalText] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [mustBeFinishedAt, setMustBeFinishedAt] = useState('');
  const [selectedTko, setSelectedTko] = useState({});
  const [delegating, setDelegating] = useState(false);
  const [openUploadMassActionApFile, setOpenUploadMassActionApFile] = useState(false);
  const [massAction, setMassAction] = useState();
  // Check roles & get data
  useEffect(() => {
    if (!checkPermissions('PROCESSES.CONNECTING_DISCONNECTING.ACCESS', CONNECTING_DISCONNECTING_ACCESS_ACCEPT_ROLES)) {
      navigate('/processes');
    }
    setTab(PAGE_TABS.details);
  }, [dispatch, uid, navigate, relation_id]);

  // Clear store after unmount
  useEffect(() => () => dispatch(clearCurrentProcess()), [dispatch]);

  useEffect(() => {
    if (currentProcess?.files?.find((file) => file.status === 'IN_PROCESS' || file.status === 'NEW')) {
      setTab(PAGE_TABS.files);
      setIsOnlyFilesTabAvailable(true);
    } else setIsOnlyFilesTabAvailable(false);
  }, [currentProcess?.files]);

  const PROCESS_MASS_ACTIONS = useMemo(() => {
    return [
      {value: 'MASS_CANCEL', label: 'CONNECTING_DISCONNECTING_PROCESS_MASS_ACTIONS.CANCEL', disabled: !currentProcess?.can_mass_cancel},
      {value: 'MASS_COMPLETED', label: 'CONNECTING_DISCONNECTING_PROCESS_MASS_ACTIONS.COMPLETE', disabled: !currentProcess?.can_mass_confirm },
    ];
  }, [currentProcess]);

  const handleCancel = () => {
    setOpenDeleteDialog(false);
    dispatch(cancelConnectDisconnectProcess(uid, tab, () => setSelectedTko({})));
  };

  const handleToForm = () => {
    dispatch(
      toFormConnectDisconnectProcess(uid, { must_be_finished_at: mustBeFinishedAt }, () => {
        setSelectedTko({});
        if (tab === PAGE_TABS.files) dispatch(getConnectingDisconnectingTKOFiles(uid));
      })
    );
  };

  const handleChangeTab = (event, newValue) => {
    setTab(newValue);
  };

  const handleSuccessUploadFile = () => {
    if (tab === PAGE_TABS.files) dispatch(getConnectingDisconnectingTKOFiles(uid));
    else setTab(PAGE_TABS.files);
  };

  const handleUpload = (data) => {
    if (currentProcess?.action_type === ACTION_TYPES.connected) {
      dispatch(uploadConnectingTKOFiles(uid, data, handleSuccessUploadFile));
    } else {
      dispatch(uploadDisconnectingTKOFiles(uid, data, handleSuccessUploadFile));
    }
  };

  const handleCloseUploadApsMassCancelFile = () => {
    if (uploading) {
      return;
    }
    setOpenUploadMassActionApFile(false);
    dispatch(uploadFileClear());
  };

  const handleUploadMassActionApFile = (formData) => {
    const action = !massAction ? PROCESS_MASS_ACTIONS.find(a => !a.disabled)?.value : massAction;
    formData.append('action_type', action);

    dispatch(
      uploadConnectingDisconnectingMassActionAp(uid, formData, () => {
        handleCloseUploadApsMassCancelFile();
        setTab(PAGE_TABS.files);
        setMassAction(null);
      })
    );
  };

  const handleMassExportAps = () => {
    dispatch(exportConnectingDisconnectingAps(uid, () => {
      if(tab === PAGE_TABS.files) 
        dispatch(getConnectingDisconnectingTKOFiles(uid));
      else setTab(PAGE_TABS.files);
    }));
  };

  const headerString = currentProcess
    ? t(`PAGES.${currentProcess.action_type}`, { id: currentProcess.id })
    : `${t('LOADING')}...`;

  return (
    <Page
      pageName={headerString}
      backRoute={'/processes'}
      loading={loading || uploading || delegating}
      faqKey={currentProcess?.action_type === 'DISCONNECT_TKO' ? 'PROCESSES__DISCONNECT_TKO' : 'PROCESSES__CONNECT_TKO'}
      notFoundMessage={notFound && t('PROCESS_NOT_FOUND')}
      controls={
        <>
          {currentProcess?.can_start && (
            <CircleButton
              type={'create'}
              title={t('CONTROLS.TAKE_TO_WORK')}
              onClick={() => dispatch(initConnectionDisconnectionSubprocess(uid))}
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
          {currentProcess?.can_complete && (
            <CircleButton
              type={'done'}
              title={t('CONTROLS.DONE_PROCESS')}
              onClick={() => setDoneModalText(t('DONE_CONNECT_DISCONNECT_TKO_PROCESS_MODAL_TEXT'))}
            />
          )}
          {currentProcess?.can_upload && (
            <CircleButton type={'upload'} title={t('CONTROLS.DOWNLOAD_FILE')} onClick={() => setOpenDialog(true)} />
          )}
          {(currentProcess?.can_form ||
            (Boolean(
              Object.keys(selectedTko).length > 0
                ? Object.values(selectedTko).filter((chosen) => chosen).length > 0
                : currentProcess?.aps_count
            ) &&
              currentProcess?.status === 'IN_PROCESS')) && (
            <CircleButton
              type={'new'}
              title={t('CONTROLS.FORM')}
              disabled={
                !moment(mustBeFinishedAt).isValid() ||
                !(Object.keys(selectedTko).length > 0
                  ? Object.values(selectedTko).filter((chosen) => chosen).length > 0
                  : currentProcess?.aps_count)
              }
              dataMarker={'formed'}
              onClick={handleToForm}
            />
          )}
          {currentProcess?.can_cancel && (
            <CircleButton
              type={'remove'}
              title={t('CONTROLS.CANCEL_PROCESS')}
              onClick={() => setOpenDeleteDialog(true)}
            />
          )}
          {(currentProcess?.status === 'FORMED' ||
            currentProcess?.status === 'DONE' ||
            currentProcess?.status === 'COMPLETED') && (
            <CircleButton
              type={'download'}
              title={t('CONTROLS.EXPORT_TKO')}
              onClick={handleMassExportAps}
              dataMarker={'massExport'}
            />
          )}
          {(currentProcess?.can_mass_cancel || currentProcess?.can_mass_confirm) && (
              <CircleButton
                type={'upload'}
                title={t('CONTROLS.IMPORT_FILE_FOR_MAS_LOAD')}
                onClick={() => setOpenUploadMassActionApFile(true)}
                dataMarker={'import'}
              />
            )}
        </>
      }
    >
      <Statuses
        statuses={
          currentProcess?.self_managed
            ? ['NEW', 'IN_PROCESS', 'FORMED', 'DONE', 'COMPLETED', 'CANCELED']
            : ['NEW', 'FORMED', 'DONE', 'COMPLETED', 'CANCELED']
        }
        currentStatus={currentProcess?.status}
      />
      <div className={'boxShadow'} style={{ paddingLeft: 24, paddingRight: 24, marginTop: 16, marginBottom: 16 }}>
        <DHTabs value={tab} onChange={handleChangeTab}>
          <DHTab label={t('REQUEST_DETAILS')} value={PAGE_TABS.details} disabled={isOnlyFilesTabAvailable} />
          <DHTab label={t('DOWNLOADED_FILES_FOR_REQUEST')} value={PAGE_TABS.files} />
          {/* <DHTab
            label={'Вихідні запити на ОДКО'}
            value={'requests'}
            disabled={!currentProcess?.can_read_subprocesses}
          /> */}
        </DHTabs>
      </div>
      {tab === PAGE_TABS.details && (
        <DetailsTab
          mustBeFinishedAt={mustBeFinishedAt}
          setMustBeFinishedAt={setMustBeFinishedAt}
          selectedTko={selectedTko}
          setSelectedTko={setSelectedTko}
        />
      )}
      {tab === PAGE_TABS.files && <UploadedFilesTab />}
      {tab !== PAGE_TABS.files && tab !== PAGE_TABS.details && <RequestsTab />}
      <ModalWrapper
        header={t('CANCEL_REQUEST_MODAL_TITLE')}
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <Stack direction={'row'} sx={{ pt: 3 }} justifyContent={'space-between'} spacing={1}>
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <BlueButton onClick={() => setOpenDeleteDialog(false)} style={{ width: '100%' }}>
                {t('CONTROLS.NO')}
              </BlueButton>
            </Grid>
            <Grid item xs={6}>
              <DangerButton onClick={handleCancel} style={{ width: '100%' }}>
                {t('CONTROLS.YES')}
              </DangerButton>
            </Grid>
          </Grid>
        </Stack>
      </ModalWrapper>
      <ReasonModal
        text={doneModalText}
        open={Boolean(doneModalText)}
        onClose={() => setDoneModalText('')}
        onSubmit={(reason) => {
          setDoneModalText('');
          dispatch(doneConnectDisconnect(uid, tab, { reason }));
        }}
      />
      <SimpleImportModal
        title={t('IMPORT_AP_FILES')}
        openUpload={openDialog}
        setOpenUpload={setOpenDialog}
        handleUpload={(formData, handleClose) => {
          handleUpload(formData);
          handleClose();
        }}
        layoutList={[
          {
            key: 'file_original',
            label: t('IMPORT_FILE.SELECT_FILE_WITH_AP_INFORMAT', { format: '.xls, .xlsx, .xlsm' }),
            accept: '.xls,.xlsx,.xlsm',
            maxSize: 15000000,
            sizeError: t('VERIFY_MSG.MAX_FILE_SIZE', { size: 15 })
          },
          {
            key: 'file_original_key',
            label: t('IMPORT_FILE.SELECT_DIGITAL_SIGNATURE_FILE'),
            accept: '.p7s',
            maxSize: 40960,
            sizeError: t('VERIFY_MSG.UNCORRECT_SIGNATURE')
          }
        ]}
        uploading={uploading}
        error={error}
      />
      <SimpleImportModal
        title={t('IMPORT_AP_FILES')}
        openUpload={openUploadMassActionApFile}
        setOpenUpload={(open) => {setOpenUploadMassActionApFile(open); setMassAction(null);}}
        handleUpload={(formData) => {
          handleUploadMassActionApFile(formData);
        }}
        layoutList={[
          {
            key: 'file_original',
            label: t('IMPORT_FILE.SELECT_FILE_WITH_AP_INFORMAT', { format: '.xls, .xlsx, .xlsm' }),
            accept: '.xls,.xlsx,.xlsm',
            maxSize: 15000000,
            sizeError: t('VERIFY_MSG.MAX_FILE_SIZE', { size: 15 })
          },
          {
            key: 'file_original_key',
            label: t('IMPORT_FILE.SELECT_DIGITAL_SIGNATURE_FILE'),
            accept: '.p7s',
            maxSize: 40960,
            sizeError: t('VERIFY_MSG.UNCORRECT_SIGNATURE')
          }
        ]}
        uploading={uploading}
        disabledUpload={currentProcess?.self_managed && !massAction}
        error={error}
      >
        {currentProcess?.self_managed && (
          <SelectField
            onChange={setMassAction}
            data={PROCESS_MASS_ACTIONS}
            label={t('FIELDS.ACTION_TYPE')}
            value={massAction}
          />
        )}
      </SimpleImportModal>
    </Page>
  );
};

export default ConnectingDisconnectingDetails;
