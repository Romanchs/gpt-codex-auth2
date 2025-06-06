import React, { useEffect, useState } from 'react';
import Statuses from '../../../Theme/Components/Statuses';
import { useDispatch, useSelector } from 'react-redux';
import {
  clearCurrentProcess,
  downloadGrantingAuthorityTkos,
  formGrantingAuthority,
  getFilesGrantingAuthority,
  getGeneratedFilesGrantingAuthority,
  getHistoryGrantingAuthority,
  getTimeRowsTko,
  getTkosGrantingAuthorityTkos,
  uploadGrantingAuthorityTKO
} from '../../../../actions/processesActions';
import Page from '../../../Global/Page';
import CircleButton from '../../../Theme/Buttons/CircleButton';
import { useParams } from 'react-router-dom';
import { DHTab, DHTabs } from '../Components/Tabs';
import { clearTkoUpload } from '../../../../actions/massLoadActions';
import GrantingAuthorityTkoDetailsTab from './GrantingAuthorityTKODetailsTab';
import GrantingAuthorityTkoFilesTab from './GrantingAuthorityTKOFilesTab';
import GrantingAuthorityTkoGeneratedTab from './GrantingAuthorityTkoGeneratedTab';
import GrantingAuthorityTkoHistoryTab from './GrantingAuthorityTKOHistoryTab';
import { checkPermissions } from '../../../../util/verifyRole';
import DelegateBtn from '../../../../features/delegate/delegateBtn';
import SimpleImportModal from '../../../Modal/SimpleImportModal';
import { useTranslation } from 'react-i18next';
import useExportFileLog from '../../../../services/actionsLog/useEportFileLog';

export const GRANTING_AUTHORITY_ACCEPT_ROLES = [
  'СВБ',
  'АКО_Процеси',
  'АКО_Користувачі',
  'АКО',
  'АТКО',
  'ОДКО',
  'ОЗД',
  'ОЗКО'
];

const GrantingAuthorityTkoDetails = () => {
  const { t } = useTranslation();
  const { uid } = useParams();
  const dispatch = useDispatch();
  const { currentProcess, loading, notFound } = useSelector(({ processes }) => processes);
  const { uploading, error } = useSelector(({ massLoad }) => massLoad);
  const [tab, setTab] = useState('details');
  const [openDialog, setOpenDialog] = useState(false);
  const [delegating, setDelegating] = useState(false);
  const exportFileLog = useExportFileLog(['Запит на перегляд даних ТКО']);

  // Clear store after unmount
  useEffect(() => () => dispatch(clearCurrentProcess()), [dispatch]);

  const handleChangeTab = (event, newValue) => {
    setTab(newValue);
  };

  const handleShowTab = () => {
    tab === 'details' && dispatch(getTkosGrantingAuthorityTkos(uid, { page: 1, size: 25 }));
    tab === 'files' && dispatch(getFilesGrantingAuthority(uid, { page: 1, size: 25 }));
    tab === 'generated' && dispatch(getGeneratedFilesGrantingAuthority(uid, { page: 1, size: 25 }));
    tab === 'historical' && dispatch(getHistoryGrantingAuthority(uid, { page: 1, size: 25 }));
  };

  // const handleCloseDialog = () => {
  //   if (loading) {
  //     clearInterval(window.massLoadInterval);
  //   }
  //   dispatch(clearTkoUpload());
  //   setOpenDialog(false);
  // };

  const handleForm = () => {
    dispatch(formGrantingAuthority(uid, handleShowTab));
  };
  const handleDownload = () => {
    dispatch(
      downloadGrantingAuthorityTkos(
        uid,
        handleShowTab
      )
    );
    exportFileLog(uid);
  };

  const handleDownloadTimeRows = () => {
    dispatch(getTimeRowsTko(uid, tab === 'generated'));
  };

  const handleCloseUpload = () => {
    setOpenDialog(false);
    dispatch(clearTkoUpload());
  };

  return (
    <Page
      acceptPermisions={'PROCESSES.GRANTING_AUTHORITY.MAIN.ACCESS'}
      acceptRoles={GRANTING_AUTHORITY_ACCEPT_ROLES}
      faqKey={'PROCESSES__GRANTING_AUTHORITY'}
      pageName={currentProcess ? t('PAGES.GRANTING_AUTHORITY_ID', { id: currentProcess?.id }) : `${t('LOADING')}...`}
      backRoute={'/processes'}
      loading={loading || delegating}
      notFoundMessage={notFound && t('PROCESS_NOT_FOUND')}
      controls={
        <>
          {currentProcess?.status === 'IN_PROCESS' && (
            <>
              {checkPermissions('PROCESSES.GRANTING_AUTHORITY.MAIN.CONTROLS.UPLOAD', [
                'СВБ',
                'АТКО',
                'ОДКО',
                'ОЗД',
                'ОЗКО'
              ]) && (
                <CircleButton
                  type={'upload'}
                  title={t('CONTROLS.IMPORT_FILE')}
                  onClick={() => setOpenDialog(true)}
                  disabled={loading || uploading || !currentProcess?.can_upload}
                />
              )}
              {checkPermissions('PROCESSES.GRANTING_AUTHORITY.MAIN.CONTROLS.FORMING', [
                'СВБ',
                'АТКО',
                'ОДКО',
                'ОЗД',
                'ОЗКО'
              ]) && (
                <CircleButton
                  type={'new'}
                  dataMarker={'create'}
                  title={t('CONTROLS.FORM')}
                  disabled={loading || !currentProcess?.successfully_uploaded_tkos || !currentProcess?.can_form}
                  onClick={handleForm}
                />
              )}
            </>
          )}
          {currentProcess?.status === 'FORMED' && (
            <>
              {checkPermissions('PROCESSES.GRANTING_AUTHORITY.MAIN.CONTROLS.DOWNLOAD_TIME_ROWS', [
                'СВБ',
                'АТКО',
                'ОДКО',
                'ОЗД',
                'ОЗКО'
              ]) && (
                <CircleButton
                  type={'circle-download'}
                  title={t('CONTROLS.DOWNLOAD_TIME_ROWS')}
                  onClick={handleDownloadTimeRows}
                  disabled={loading || !currentProcess?.can_download_dko_historical}
                />
              )}
              {checkPermissions('PROCESSES.GRANTING_AUTHORITY.MAIN.CONTROLS.DOWNLOAD_TKO', [
                'СВБ',
                'АТКО',
                'ОДКО',
                'ОЗД',
                'ОЗКО'
              ]) && (
                <CircleButton
                  type={'download'}
                  title={t('CONTROLS.DOWNLOAD_CHARACTERISTICS')}
                  onClick={handleDownload}
                  disabled={loading || !currentProcess?.can_download_resulted_file}
                />
              )}
            </>
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
      <Statuses statuses={['NEW', 'IN_PROCESS', 'FORMED', 'DONE', 'CANCELED']} currentStatus={currentProcess?.status} />
      {currentProcess?.status !== 'NEW' && (
        <div className={'boxShadow'} style={{ paddingLeft: 24, paddingRight: 24, marginTop: 16, marginBottom: 16 }}>
          <DHTabs value={tab} onChange={handleChangeTab}>
            <DHTab label={t('REQUEST_DETAILS')} value={'details'} />
            <DHTab label={t('LOADED_AP_FILES')} value={'files'} disabled={currentProcess?.status === 'NEW'} />
            {currentProcess?.status !== 'NEW' && currentProcess?.status !== 'IN_PROCESS' && (
              <DHTab label={t('GENERATED_FILES')} value={'generated'} />
            )}
            {currentProcess?.show_historical_timeseries && (
              <DHTab label={t('SUBPROCESSES.REQUEST_HISTORICAL_DKO')} value={'historical'} />
            )}
          </DHTabs>
        </div>
      )}
      {tab === 'details' && <GrantingAuthorityTkoDetailsTab />}
      {tab === 'files' && <GrantingAuthorityTkoFilesTab />}
      {tab === 'generated' && <GrantingAuthorityTkoGeneratedTab />}
      {tab === 'historical' && <GrantingAuthorityTkoHistoryTab />}
      <SimpleImportModal
        title={t('IMPORT_AP_FILES')}
        openUpload={openDialog}
        setOpenUpload={setOpenDialog}
        handleUpload={(data) =>
          dispatch(
            uploadGrantingAuthorityTKO(data, uid, () => {
              handleCloseUpload();
              handleShowTab();
              setOpenDialog(false);
            })
          )
        }
        layoutList={[
          {
            key: 'file_original',
            label: t('IMPORT_FILE.SELECT_FILE_WITH_DKO_IN_FORMATS', { format: '.xls, .xlsx, .xlsm' }),
            accept: '.xls,.xlsx,.xlsm',
            maxSize: 50000000,
            sizeError: t('VERIFY_MSG.MAX_FILE_SIZE', { size: 50 })
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
export default GrantingAuthorityTkoDetails;
