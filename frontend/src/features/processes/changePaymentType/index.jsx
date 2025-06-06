import Box from '@mui/material/Box';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import Page from '../../../Components/Global/Page';
import { DHTab, DHTabs } from '../../../Components/pages/Processes/Components/Tabs';
import SimpleImportModal from '../../../Components/Modal/SimpleImportModal';
import CancelModal from '../../../Components/Modal/CancelModal';
import CircleButton from '../../../Components/Theme/Buttons/CircleButton';
import DelegateBtn from '../../delegate/delegateBtn';
import Statuses from '../../../Components/Theme/Components/Statuses';
import { mainApi } from '../../../app/mainApi';
import {
  useChangePaymentTypeQuery,
  useInitChangePaymentTypeMutation,
  useUpdateChangePaymentTypeMutation,
  useUploadChangePaymentTypeMutation
} from './api';
import { useTranslation } from 'react-i18next';
import DetailsTab from './components/DetailsTab';
import { defaultParams, setData, setParams } from './slice';
import FilesTab from './components/FilesTab';

const PAGE_TABS = {
  DETAILS: 'details',
  FILES: 'files'
};

export const CHANGE_PAYMENT_TYPE_ACCESS_ACCEPT_ROLES = ['АКО_Процеси', 'АТКО', 'СВБ'];

const ChangePaymentType = () => {
  const { uid } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const payment_change_date = useSelector((store) => store.changePaymentType.payment_change_date);
  const params = useSelector((store) => store.changePaymentType.params);
  const [tab, setTab] = useState(PAGE_TABS.DETAILS);
  const [openUpload, setOpenUpload] = useState(false);
  const [cancelModalText, setCancelModalText] = useState('');
  const [delegating, setDelegating] = useState(false);

  const { currentData, isFetching, isError, error } = useChangePaymentTypeQuery({ uid, params }, { skip: !uid });
  const { isFetching: isFiles } = mainApi.endpoints.filesChangePaymentType.useQueryState({ uid, params });

  const [initProcess, { isLoading: isCreating }] = useInitChangePaymentTypeMutation({
    fixedCacheKey: 'changePaymentType_init'
  });
  const [update, { isLoading: isUpdating }] = useUpdateChangePaymentTypeMutation();
  const [uploadFile, { isLoading: uploading, error: uploadingError }] = useUploadChangePaymentTypeMutation();

  const loading = isFetching || isFiles || isCreating || isUpdating || uploading || delegating;

  useEffect(() => {
    if (error?.data?.detail === 'У вас немає дозволу на виконання цієї дії.') {
      navigate('/processes');
    }
  }, [navigate, error]);

  useEffect(() => {
    if (!uid) {
      setTab(PAGE_TABS.DETAILS);
      dispatch(setData(null));
      dispatch(setParams(defaultParams));
    }
  }, [dispatch, uid]);

  const handleChangeTab = (...args) => {
    setTab(args[1]);
    dispatch(setParams(defaultParams));
  };

  return (
    <Page
      acceptPermisions={'PROCESSES.CHANGE_PAYMENT_TYPE.ACCESS'}
      acceptRoles={uid ? CHANGE_PAYMENT_TYPE_ACCESS_ACCEPT_ROLES : ['СВБ']}
      faqKey={'PROCESSES__CHANGE_PAYMENT_TYPE'}
      pageName={
        loading
          ? `${t('LOADING')}...`
          : currentData
          ? t('PAGES.CHANGE_PAYMENT_TYPE_ID', { id: currentData?.id })
          : t('PAGES.CHANGE_PAYMENT_TYPE')
      }
      backRoute={'/processes'}
      loading={loading}
      notFoundMessage={isError && t('PROCESS_NOT_FOUND')}
      controls={
        <>
          {!uid && (
            <CircleButton
              type={'create'}
              title={t('CONTROLS.TAKE_TO_WORK')}
              onClick={() =>
                initProcess({ payment_change_date: moment(payment_change_date).startOf('day').utc().format() }).then(
                  (res) => {
                    if (res?.data?.uid) {
                      navigate(res.data.uid, { replace: true });
                    }
                  }
                )
              }
              dataMarker={'init'}
              disabled={!moment(payment_change_date, moment.ISO_8601).isValid()}
            />
          )}
          {currentData?.status === 'IN_PROCESS' && (
            <CircleButton
              type={'remove'}
              title={t('CONTROLS.CANCEL')}
              onClick={() => setCancelModalText(t('CANCEL_PROCESS_CONFIRMATION'))}
              dataMarker={'cancel'}
              disabled={!currentData?.can_cancel}
            />
          )}
          {(currentData?.status === 'IN_PROCESS' || currentData?.status === 'FORMED') && (
            <CircleButton
              type={'upload'}
              title={t('CONTROLS.IMPORT')}
              onClick={() => setOpenUpload(true)}
              disabled={!currentData?.can_upload}
            />
          )}
          {currentData?.status === 'IN_PROCESS' && (
            <CircleButton
              type={'new'}
              title={t('CONTROLS.FORM')}
              onClick={() => update({ uid, type: '/formed' })}
              dataMarker={'formed'}
              disabled={!currentData?.can_form}
            />
          )}
          {currentData?.can_delegate && (
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
        statuses={['NEW', 'IN_PROCESS', 'FORMED', 'DONE', 'PARTIALLY_DONE', 'CANCELED']}
        currentStatus={currentData?.status || 'NEW'}
      />
      <Box className={'boxShadow'} sx={{ mt: 2, mb: 2, pl: 3, pr: 3 }}>
        <DHTabs value={tab} onChange={handleChangeTab}>
          <DHTab label={t('REQUEST_DETAILS')} value={PAGE_TABS.DETAILS} />
          <DHTab label={t('DOWNLOADED_FILES_FOR_REQUEST')} value={PAGE_TABS.FILES} disabled={!uid} />
        </DHTabs>
      </Box>
      {tab === PAGE_TABS.DETAILS && <DetailsTab />}
      {tab === PAGE_TABS.FILES && <FilesTab />}
      <CancelModal
        text={cancelModalText}
        open={Boolean(cancelModalText)}
        onClose={() => setCancelModalText('')}
        onSubmit={() => {
          setCancelModalText('');
          update({ uid, type: '/cancel' });
        }}
      />
      <SimpleImportModal
        title={t('IMPORT_AP_FILES')}
        openUpload={openUpload}
        setOpenUpload={setOpenUpload}
        handleUpload={(body, handleClose) => {
          uploadFile({ uid, body }).then((res) => {
            if (!res?.error) {
              setOpenUpload(false);
              setTab(PAGE_TABS.FILES);
            }
          });
          handleClose();
        }}
        layoutList={[
          {
            key: 'file_original',
            label: t('IMPORT_FILE.SELECT_FILE_WITH_AP_INFORMAT', { format: '.xls, .xlsx, .xlsm' }),
            accept: '.xls,.xlsx,.xlsm',
            maxSize: 15728640,
            sizeError: t('VERIFY_MSG.FILE_SIZE', { size: 15 })
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
        error={uploadingError}
      />
    </Page>
  );
};

export default ChangePaymentType;
