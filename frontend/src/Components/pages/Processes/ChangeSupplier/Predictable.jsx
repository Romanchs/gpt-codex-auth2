import Page from '../../../Global/Page';
import { useDispatch, useSelector } from 'react-redux';
import Statuses from '../../../Theme/Components/Statuses';
import { DHTab, DHTabs } from '../Components/Tabs';
import { useEffect, useState } from 'react';
import { checkPermissions } from '../../../../util/verifyRole';
import {
  changeSupplierPredictableUpload,
  clearCurrentProcess,
  doneChangeSupplyPredictable,
  formingChangeSupplyPredictable
} from '../../../../actions/processesActions';
import { useNavigate, useParams } from 'react-router-dom';
import PredictableTkosTab from './PredictableTkosTab';
import PredictableFilesTab from './PredictableFilesTab';
import CircleButton from '../../../Theme/Buttons/CircleButton';
import SimpleImportModal from '../../../Modal/SimpleImportModal';
import { clearTkoUpload } from '../../../../actions/massLoadActions';
import DelegateBtn from '../../../../features/delegate/delegateBtn';
import { useTranslation } from 'react-i18next';

const tabs = {
  tkos: 'tkos',
  files: 'files'
};

const Predictable = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { uid } = useParams();
  const {
    activeRoles: [{ relation_id }]
  } = useSelector(({ user }) => user);
  const { loading, currentProcess, notFound } = useSelector(({ processes }) => processes);
  const { uploading, error } = useSelector(({ massLoad }) => massLoad);
  const [tab, setTab] = useState(tabs.tkos);
  const [openUpload, setOpenUpload] = useState(false);
  const [delegating, setDelegating] = useState(false);

  // Check roles & get data
  useEffect(() => {
    if (!checkPermissions('PROCESSES.CHANGE_SUPPLIER.PREDICTABLE.ACCESS', 'ОДКО')) {
      navigate('/processes');
    }
  }, [relation_id, navigate]);

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

  const handleStart = () => {
    dispatch(formingChangeSupplyPredictable(uid, () => onUpdate()));
  };

  const handleCloseUpload = () => {
    setOpenUpload(false);
    dispatch(clearTkoUpload());
  };

  const handleUpload = (files) => {
    dispatch(
      changeSupplierPredictableUpload(uid, files, () => {
        handleCloseUpload();
        onUpdate(tabs.files);
      })
    );
  };

  const handleDone = () => {
    dispatch(doneChangeSupplyPredictable(uid, () => onUpdate()));
  };

  return (
    <Page
      pageName={
        currentProcess?.id ? t('PAGES.CHANGE_SUPPLIER_ID', { id: currentProcess?.id }) : t('PAGES.CHANGE_SUPPLIER')
      }
      backRoute={'/processes'}
      faqKey={'PROCESSES__PREDICTABLE_CONSUMPTION_ODKO'}
      loading={loading || delegating || uploading}
      notFoundMessage={notFound && t('REQUEST_NOT_FOUND')}
      controls={
        <>
          {currentProcess?.can_start && (
            <CircleButton type={'create'} title={t('CONTROLS.TAKE_TO_WORK')} onClick={handleStart} />
          )}
          {currentProcess?.can_upload_file && (
            <CircleButton type={'upload'} title={t('CONTROLS.IMPORT')} onClick={() => setOpenUpload(true)} />
          )}
          {currentProcess?.can_done_subprocess && (
            <CircleButton type={'done'} title={t('CONTROLS.PERFORM')} onClick={handleDone} />
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
      <Statuses statuses={['NEW', 'IN_PROCESS', 'DONE', 'CANCELED']} currentStatus={currentProcess?.status} />
      <div className={'boxShadow'} style={{ paddingLeft: 24, paddingRight: 24, marginTop: 16, marginBottom: 16 }}>
        <DHTabs value={tab} onChange={handleChangeTab}>
          <DHTab label={t('REQUEST_DETAILS')} value={tabs.tkos} />
          <DHTab label={t('PREDICTABLE_FILES')} value={tabs.files} />
        </DHTabs>
      </div>
      {tab === tabs.tkos && <PredictableTkosTab />}
      {tab === tabs.files && <PredictableFilesTab />}
      <SimpleImportModal
        title={t('IMPORT_AP_FILES')}
        openUpload={openUpload}
        setOpenUpload={setOpenUpload}
        handleUpload={(formData) => {
          handleCloseUpload();
          handleUpload(formData);
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

export default Predictable;
