import Box from '@material-ui/core/Box';
import PlaylistAddCheckRounded from '@mui/icons-material/PlaylistAddCheckRounded';
import SearchRounded from '@mui/icons-material/SearchRounded';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import {
  clearCurrentProcess,
  exportChangeSupplyAps,
  formingChangeSupply,
  getChangeSupplierFiles,
  uploadChangeSupply,
  uploadChangeSupplyApsMassCancel,
  uploadChangeSupplyTestFile,
  uploadFileClear
} from '../../../../actions/processesActions';
import { checkPermissions } from '../../../../util/verifyRole';
import Page from '../../../Global/Page';
import CancelModal from '../../../Modal/CancelModal';
import { ImportFilesModal } from '../../../Modal/ImportFilesModal';
import { ModalWrapper } from '../../../Modal/ModalWrapper';
import { BlueButton } from '../../../Theme/Buttons/BlueButton';
import CircleButton from '../../../Theme/Buttons/CircleButton';
import { GreenButton } from '../../../Theme/Buttons/GreenButton';
import Statuses from '../../../Theme/Components/Statuses';
import StyledInput from '../../../Theme/Fields/StyledInput';
import { DHTab, DHTabs } from '../Components/Tabs';
import FilesTab from './FilesTab';
import TkosTab from './TkosTab';
import { useTranslation } from 'react-i18next';
import DelegateBtn from '../../../../features/delegate/delegateBtn';
import SimpleImportModal from '../../../Modal/SimpleImportModal';

const tabs = {
  tkos: 'tkos',
  files: 'files'
};

export const CHANGE_SUPPLIER_ACCESS_ACCEPT_ROLES = ['СВБ', 'АКО_Процеси'];

const ChangeSupplier = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { uid } = useParams();
  const {
    activeRoles: [{ relation_id }]
  } = useSelector(({ user }) => user);
  const { loading, currentProcess, notFound } = useSelector(({ processes }) => processes);
  const { uploading, error } = useSelector(({ massLoad }) => massLoad);
  const [files, setFiles] = useState({});
  const [tab, setTab] = useState(tabs.tkos);
  const [openUpload, setOpenUpload] = useState(false);
  const [openWarning, setOpenWarning] = useState(false);
  const [openTestFile, setOpenTestFile] = useState(false);
  const [delegating, setDelegating] = useState(false);
  const [openUploadApsMassCancelFile, setOpenUploadApsMassCancelFile] = useState(false);


  useEffect(() => {
    if (!checkPermissions('PROCESSES.CHANGE_SUPPLIER.ACCESS', CHANGE_SUPPLIER_ACCESS_ACCEPT_ROLES)) {
      navigate('/processes');
    }
  }, [navigate, relation_id]);

  // Clear store after unmount
  useEffect(() => () => dispatch(clearCurrentProcess()), [dispatch]);

  const handleChangeTab = (_, newValue) => {
    setTab(newValue);
  };

  const onUpdate = () => {
    const lastTab = tab;
    setTab('');
    setTimeout(() => {
      setTab(lastTab);
    }, 0);
  };
  const handleCloseUpload = () => {
    if (uploading) {
      return;
    }
    setOpenUpload(false);
    setFiles({});
    dispatch(uploadFileClear());
  };

  const handleUpload = (params) => {
    const formData = new FormData();
    Object.keys(files).forEach((key) => formData.append(key, files[key][0]));
    dispatch(
      uploadChangeSupply(uid, params, formData, () => {
        handleCloseUpload();
        onUpdate();
      })
    );
  };

  const handleForm = () => {
    if (currentProcess?.show_warning_before_form) {
      setOpenWarning(true);
    } else {
      dispatch(formingChangeSupply(uid, () => onUpdate()));
    }
  };

  const handleCloseUploadApsMassCancelFile = () => {
    if (uploading) {
      return;
    }
    setOpenUploadApsMassCancelFile(false);
    dispatch(uploadFileClear());
  };

  const handleUploadApsMassCancelFile = (formData) => {
    dispatch(
      uploadChangeSupplyApsMassCancel(uid, formData, () => {
        handleCloseUploadApsMassCancelFile();
        if(tab === tabs.files)
          dispatch(getChangeSupplierFiles(uid));
        else setTab(tabs.files);
      })
    );
  };

  const handleExportAps = () => {
    dispatch(exportChangeSupplyAps(uid));
  }

  return (
    <Page
      pageName={
        currentProcess?.id ? t('PAGES.CHANGE_SUPPLIER_ID', { id: currentProcess?.id }) : t('PAGES.CHANGE_SUPPLIER')
      }
      backRoute={'/processes'}
      faqKey={'PROCESSES__CHANGE_SUPPLIET'}
      loading={loading || delegating || uploading}
      notFoundMessage={notFound && t('REQUEST_NOT_FOUND')}
      controls={
        <>
          {currentProcess?.can_upload_test_file && (
            <CircleButton
              title={t('CONTROLS.CHECK_FILE')}
              color={'blue'}
              icon={<PlaylistAddCheckRounded />}
              onClick={() => setOpenTestFile(true)}
              dataMarker={'uploadTest'}
            />
          )}
          {currentProcess?.can_upload_file && (
            <CircleButton
              type={'upload'}
              title={t('CONTROLS.IMPORT')}
              onClick={() => setOpenUpload(true)}
              dataMarker={'upload'}
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
          {currentProcess?.can_done_subprocess && (
            <CircleButton type={'new'} title={t('CONTROLS.FORM')} onClick={handleForm} dataMarker={'forming'} />
          )}
          {currentProcess?.can_mass_cancel && (
            <CircleButton type={'upload'} title={t('CONTROLS.IMPORT_FILE_FOR_MAS_LOAD_CANCEL')} onClick={() => setOpenUploadApsMassCancelFile(true)} dataMarker={'import'} />
          )}
          {(currentProcess?.status === 'FORMED' || currentProcess?.status === 'DONE') && (
            <CircleButton type={'download'} title={t('CONTROLS.EXPORT_TKO')} onClick={handleExportAps} dataMarker={'massExport'} />
          )}
        </>
      }
    >
      <Statuses statuses={['NEW', 'IN_PROCESS', 'FORMED', 'DONE', 'CANCELED']} currentStatus={currentProcess?.status} />
      <div className={'boxShadow'} style={{ paddingLeft: 24, paddingRight: 24, marginTop: 16, marginBottom: 16 }}>
        <DHTabs value={tab} onChange={handleChangeTab}>
          <DHTab label={t('REQUEST_DETAILS')} value={tabs.tkos} />
          <DHTab label={t('LOADED_AP_FILES')} value={tabs.files} />
        </DHTabs>
      </div>
      {tab === tabs.tkos && <TkosTab />}
      {tab === tabs.files && <FilesTab />}
      <ModalFiles
        currentProcess={currentProcess}
        openUpload={openUpload}
        uploading={uploading}
        setFiles={setFiles}
        handleCloseUpload={handleCloseUpload}
        handleUpload={() => handleUpload({})}
        files={files}
        error={error}
      />
      <CancelModal
        open={openWarning}
        onClose={() => setOpenWarning(false)}
        text={t('CONFIRM_START_PROCESS')}
        onSubmit={() => {
          dispatch(
            formingChangeSupply(uid, () => {
              onUpdate();
            })
          );
          setOpenWarning(false);
        }}
      />
      <ImportFilesModal
        title={t('IMPORT_TEST_FILE_FROM_CONSUMER')}
        content={[
          { key: 'file_original', label: t('IMPORT_FILE.SELECT_TEST_FILE_IN_FORMAT_XLS_XLSX'), accept: '.xls,.xlsx' }
        ]}
        open={openTestFile}
        loading={uploading}
        error={error}
        onClose={() => setOpenTestFile(false)}
        onUpload={(formData) => {
          dispatch(
            uploadChangeSupplyTestFile(uid, formData, () => {
              setOpenTestFile(false);
              onUpdate();
            })
          );
        }}
      />
      <SimpleImportModal
        title={t('IMPORT_AP_FILES')}
        openUpload={openUploadApsMassCancelFile}
        setOpenUpload={setOpenUploadApsMassCancelFile}
        handleUpload={(formData) => {
          handleUploadApsMassCancelFile(formData);
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
    </Page>
  );
};

export default ChangeSupplier;

const ModalFiles = ({
  currentProcess,
  openUpload,
  uploading,
  setFiles,
  handleCloseUpload,
  handleUpload,
  files,
  error
}) => {
  const { t } = useTranslation();

  const canUpload = useMemo(() => {
    if (uploading) {
      return false;
    }
    if (currentProcess?.keys_wanted) {
      const allFields = new Set(['file_original', 'file_key_new_supplier'].concat(currentProcess.keys_wanted));
      Object.keys(files).forEach((i) => allFields.delete(i));
      return allFields.size === 0 || (allFields.size === 1 && allFields.has('file_key_current_supplier'));
    }
    return true;
  }, [uploading, files, currentProcess]);

  return (
    <ModalWrapper open={openUpload} onClose={handleCloseUpload} header={t('IMPORT_AP_FILES')} maxWidth={'lg'}>
      <Box style={{ marginTop: 40 }}>
        {[
          { label: `${t('IMPORT_FILE.FILE_WITH_AP_IN_FORMAT', { format: '.xlsx, .xls' })}:`, key: 'file_original' },
          { label: `${t('IMPORT_FILE.NEW_SUPPLIER_FILE')}:`, key: 'file_key_new_supplier' },
          {
            label: `${t('IMPORT_FILE.CURRENT_SUPPLIER_FILE')}:`,
            key: 'file_key_current_supplier',
            hidden: !currentProcess?.keys_wanted?.includes('file_key_current_supplier')
          },
          {
            label: t('IMPORT_FILE.DIGITAL_SIGN_FILE'),
            key: 'file_key_customer',
            hidden: !currentProcess?.keys_wanted?.includes('file_key_customer')
          }
        ].map(({ label, key, hidden }) => {
          if (!hidden)
            return (
              <Box style={{ display: 'flex', minWidth: 540, gap: 24, marginBottom: 24 }} key={key}>
                <StyledInput
                  size={'small'}
                  value={files[key]?.[0]?.name}
                  label={label}
                  placeholder={`${t('IMPORT_FILE.SELECT_FILE')}...`}
                  shrink={true}
                  error={error?.response?.data?.detail && error?.response?.data?.detail[key]}
                  readOnly
                />
                <input
                  accept={key === 'file_original' ? '.xlsx,.xls' : '.p7s'}
                  id={`changeSupplier-${key}`}
                  disabled={uploading}
                  type="file"
                  onChange={({ target }) => setFiles({ ...files, [key]: target.files.length ? target.files : null })}
                />
                <label htmlFor={`changeSupplier-${key}`}>
                  <BlueButton
                    component="span"
                    disabled={uploading}
                    style={{ whiteSpace: 'nowrap', padding: '11.25px 12px', borderRadius: 8 }}
                  >
                    <SearchRounded />
                    {t('CONTROLS.CHOOSE_FILE')}
                  </BlueButton>
                </label>
              </Box>
            );
        })}
      </Box>
      <Box style={{ display: 'flex', justifyContent: 'center', gap: 24, marginTop: 40 }}>
        <BlueButton
          style={{ minWidth: 204, textTransform: 'uppercase' }}
          onClick={handleCloseUpload}
          disabled={uploading}
        >
          {t('CONTROLS.CANCEL')}
        </BlueButton>
        <GreenButton style={{ minWidth: 204, textTransform: 'uppercase' }} onClick={handleUpload} disabled={!canUpload}>
          {uploading ? `${t('LOADING')}...` : t('CONTROLS.DOWNLOAD')}
        </GreenButton>
      </Box>
    </ModalWrapper>
  );
};
