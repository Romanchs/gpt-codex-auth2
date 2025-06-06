import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import { clearTkoUpload, uploadDisputeTko } from '../../../../actions/massLoadActions';
import { clearMmsUpload } from '../../../../actions/mmsActions';
import {
  cancelDisputeTko,
  clearCurrentProcess,
  getDisputeTko,
  updateDispute
} from '../../../../actions/processesActions';
import { checkPermissions } from '../../../../util/verifyRole';
import Page from '../../../Global/Page';
import CancelModal from '../../../Modal/CancelModal';
import CircleButton from '../../../Theme/Buttons/CircleButton';
import Statuses from '../../../Theme/Components/Statuses';
import { DHTab, DHTabs } from '../Components/Tabs';
import DisputeDetails from './DisputeDetails';
import DisputeFiles from './DisputeFiles';
import DisputeRequests from './DisputeRequests';
import { types } from './disputeSideTypes';
import DelegateBtn from '../../../../features/delegate/delegateBtn';
import SimpleImportModal from '../../../Modal/SimpleImportModal';
import { useTranslation } from 'react-i18next';

export const DISPUTE_TKO_ACCEPT_ROLES = ['АКО','АКО_Процеси','АКО_ППКО','АКО_Користувачі','АКО_Довідники','СВБ','ВТКО','СПМ','ОДКО','АДКО','ОЗД','ОЗКО'];

const DisputeTkoDetails = () => {
  const {t} = useTranslation();
  const { uid } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    activeRoles: [{ relation_id }]
  } = useSelector(({ user }) => user);
  const { loading, currentProcess, notFound } = useSelector(({ processes }) => processes);
  const { uploading, error } = useSelector(({ massLoad }) => massLoad);
  const [tab, setTab] = useState('details');
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [delegating, setDelegating] = useState(false);

  const tkoStatuses = ['NEW', 'IN_PROCESS', 'FORMED', 'DONE', 'CANCELED'];
  const sideStatuses = ['NEW', 'IN_PROCESS', 'FORMED', 'DONE', 'CANCELED'];

  // Check roles & get data
  useEffect(() => {
    if (
      checkPermissions('PROCESSES.DISPUTE_TKO.MAIN.ACCESS', DISPUTE_TKO_ACCEPT_ROLES)
    ) {
      dispatch(getDisputeTko(uid));
    } else {
      navigate('/processes');
    }
  }, [dispatch, navigate, uid, relation_id]);

  useEffect(() => () => dispatch(clearCurrentProcess()), [dispatch]);

  const handleChangeTab = (event, newValue) => {
    setTab(newValue);
  };

  return (
    <Page
      pageName={currentProcess ? t('PAGES.DISPUTE_TKO_ID', {id: currentProcess?.id}) : `${t('LOADING')}...`}
      backRoute={'/processes'}
      faqKey={'PROCESSES__DISPUTE_REQUEST_DATA_IN_ATKO'}
      loading={loading || uploading || delegating}
      notFoundMessage={notFound && t('PROCESS_NOT_FOUND')}
      controls={
        <>
          {currentProcess?.can_cancel && (
            <CircleButton type={'remove'} title={t('CONTROLS.CANCEL')} onClick={() => setOpenDeleteDialog(uid)} />
          )}
          {currentProcess?.can_upload && (
            <CircleButton type={'upload'} title={t('CONTROLS.IMPORT_FILE')} onClick={() => setOpenDialog(true)} />
          )}
          {currentProcess?.can_complete && (
            <CircleButton
              type={'done'}
              title={t('CONTROLS.FORM')}
              onClick={() => dispatch(updateDispute(uid, () => setTab('details')))}
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
        statuses={currentProcess?.dispute_request_type === types.BY_TKO ? tkoStatuses : sideStatuses}
        currentStatus={currentProcess?.status}
      />
      <div className={'boxShadow'} style={{ paddingLeft: 24, paddingRight: 24, marginTop: 16, marginBottom: 16 }}>
        <DHTabs value={tab} onChange={handleChangeTab}>
          <DHTab label={t('REQUEST_DETAILS')} value={'details'} />
          {currentProcess?.dispute_request_type === types.BY_TKO && (
            <DHTab label={t('LOADED_AP_FILES')} value={'files'} />
          )}
          <DHTab
            label={t('ATKO_REQUESTS')}
            value={'requests'}
            disabled={currentProcess?.status === 'IN_PROCESS'}
          />
        </DHTabs>
      </div>
      {tab === 'details' && <DisputeDetails />}
      {tab === 'requests' && <DisputeRequests />}
      {tab === 'files' && <DisputeFiles />}
      <SimpleImportModal
        title={t('IMPORT_AP_FILES')}
        openUpload={openDialog}
        setOpenUpload={(isOpen) => {
          if (!isOpen) {
            if (loading) {
              clearInterval(window.massLoadInterval);
            }
            dispatch(clearTkoUpload());
          }
          setOpenDialog(isOpen);
        }}
        uploading={uploading}
        handleUpload={(data) => {
          setOpenDialog(false);
          dispatch(
            uploadDisputeTko(data, uid, () => {
              dispatch(getDisputeTko(uid));
              dispatch(clearMmsUpload());
            })
          );
        }}
        layoutList={[
          {
            key: 'file_original',
            label: t('IMPORT_FILE.SELECT_FILE_WITH_AP_INFORMAT', {format: '.xls, .xlsx, .xlsm'}),
            accept: '.xls,.xlsx,.xlsm',
            maxSize: 26214400,
            sizeError: t('VERIFY_MSG.MAX_FILE_SIZE', {size: 25})
          },
          {
            key: 'file_original_key',
            label: t('IMPORT_FILE.SELECT_DIGITAL_SIGNATURE_FILE'),
            accept: '.p7s',
            maxSize: 40960,
            sizeError: t('VERIFY_MSG.UNCORRECT_SIGNATURE'),
          }
        ]}
        error={error}
      />
      <CancelModal
        text={t('EXIT_FROM_PROCESS_CONFIRMATION')}
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        onSubmit={() => {
          dispatch(
            cancelDisputeTko(uid, () => {
              setOpenDeleteDialog(false);
              setTab('details');
            })
          );
        }}
      />
    </Page>
  );
};
export default DisputeTkoDetails;
