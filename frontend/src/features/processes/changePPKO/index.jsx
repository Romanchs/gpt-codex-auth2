import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { checkPermissions } from '../../../util/verifyRole';
import Page from '../../../Components/Global/Page';
import SimpleImportModal from '../../../Components/Modal/SimpleImportModal';
import { ModalWrapper } from '../../../Components/Modal/ModalWrapper';
import { BlueButton } from '../../../Components/Theme/Buttons/BlueButton';
import CircleButton from '../../../Components/Theme/Buttons/CircleButton';
import { DangerButton } from '../../../Components/Theme/Buttons/DangerButton';
import Statuses from '../../../Components/Theme/Components/Statuses';
import { DHTab, DHTabs } from '../../../Components/pages/Processes/Components/Tabs';
import { DEFAULT_ROLES } from './data.js';
import DelegateBtn from '../../../features/delegate/delegateBtn';
import { mainApi } from '../../../app/mainApi';
import {
  useChangePPKOQuery,
  useInitChangePPKOMutation,
  useUpdateChangePPKOMutation,
  useUploadChangePPKOMutation
} from './api';
import DetailsTab from './tabs/DetailsTab';
import FilesTab from './tabs/FilesTab';
import RequestsTab from './tabs/RequestsTab';
import { defaultInitData, defaultParams, setDataForInit, setParams } from './slice';
import { useTranslation } from 'react-i18next';

export const CHANGE_PPKO_ACCESS_ACCEPT_ROLES = ['АКО_ППКО', 'ОДКО', 'АТКО', 'ОЗД', 'ОЗКО'];

const RequestChangePPKO = () => {
  const { uid } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { params, dataForInit } = useSelector((store) => store.changePPKO);

  const [tab, setTab] = useState('details');
  const [cancelDialog, setCancelDialog] = useState(false);
  const [uploadDialog, setUploadDialog] = useState(false);
  const [delegating, setDelegating] = useState(false);

  const { currentData: ppko_company, isFetching: autocompleteLoading } =
    mainApi.endpoints.changePPKOAutocomplete.useQueryState(null);
  const { isFetching: rolesLoading } = mainApi.endpoints.changePPKORoles.useQueryState(null);

  const {
    currentData: data,
    isFetching: isLoading,
    isError,
    refetch
  } = useChangePPKOQuery({ uid, params }, { skip: !uid });

  const { isFetching: filesLoading } = mainApi.endpoints.changePPKOFiles.useQueryState({ uid, params });

  const { isFetching: requestsLoading } = mainApi.endpoints.changePPKOSubprocesses.useQueryState({ uid, params });

  const [init, { isLoading: isCreating }] = useInitChangePPKOMutation({ fixedCacheKey: 'changePPKO_init' });
  const [update, { isLoading: isUpdating }] = useUpdateChangePPKOMutation({ fixedCacheKey: 'changePPKO_update' });
  const [uploadFile, { isLoading: uploading, error: uploadingError }] = useUploadChangePPKOMutation();
  const loading =
    autocompleteLoading ||
    rolesLoading ||
    isCreating ||
    isLoading ||
    isUpdating ||
    uploading ||
    filesLoading ||
    requestsLoading;

  const handleChangeTab = (...args) => {
    setTab(args[1]);
    dispatch(setParams(defaultParams));
  };

  const handleCancel = () => {
    update({ uid, type: '/cancel' });
    setCancelDialog(false);
  };

  useEffect(() => {
    dispatch(setDataForInit(defaultInitData));
  }, [dispatch, uid]);

  return (
    <Page
      acceptPermisions={uid ? 'PROCESSES.CHANGE_PPKO.MAIN.ACCESS' : 'PROCESSES.CHANGE_PPKO.INITIALIZATION'}
      acceptRoles={uid ? CHANGE_PPKO_ACCESS_ACCEPT_ROLES : ['ОДКО', 'АТКО', 'ОЗД', 'ОЗКО']}
      pageName={
        uid && data?.id
          ? t('PAGES.CHANGE_PPKO_REQUEST_ID', { id: data?.id })
          : !uid
          ? t('PAGES.CHANGE_PPKO_REQUEST')
          : `${t('LOADING')}...`
      }
      backRoute={'/processes'}
      faqKey={'PROCESSES__REQUEST_CHANGE_PPKO'}
      loading={loading || delegating}
      notFoundMessage={isError && t('PROCESS_NOT_FOUND')}
      controls={
        <>
          {!uid && (
            <CircleButton
              type={'create'}
              title={t('CONTROLS.TAKE_TO_WORK')}
              onClick={() =>
                init({
                  roles_info: Object.fromEntries(
                    Object.entries(DEFAULT_ROLES).map((i) => [i[0], dataForInit.roles.includes(i[0])])
                  ),
                  ppko_company
                }).then((res) => {
                  if (res?.data?.uid) navigate(res.data.uid, { replace: true });
                })
              }
              disabled={loading || !dataForInit.roles.length}
            />
          )}
          {(data?.status === 'IN_PROCESS' || data?.status === 'FORMED') &&
            checkPermissions('PROCESSES.CHANGE_PPKO.MAIN.CONTROLS.CANCEL', ['ОДКО', 'АТКО', 'ОЗД', 'ОЗКО']) &&
            data?.can_cancel && (
              <CircleButton
                type={'remove'}
                title={t('CONTROLS.CANCEL_PROCESS')}
                onClick={() => setCancelDialog(true)}
                disabled={loading}
              />
            )}
          {data?.status === 'IN_PROCESS' &&
            checkPermissions('PROCESSES.CHANGE_PPKO.MAIN.CONTROLS.UPLOAD', ['ОДКО', 'АТКО', 'ОЗД', 'ОЗКО']) && (
              <CircleButton
                type={'upload'}
                title={t('CONTROLS.IMPORT_AP')}
                onClick={() => setUploadDialog(true)}
                disabled={loading || !data?.can_upload}
              />
            )}
          {data?.status === 'IN_PROCESS' &&
            checkPermissions('PROCESSES.CHANGE_PPKO.MAIN.CONTROLS.FORMED', ['ОДКО', 'АТКО', 'ОЗД', 'ОЗКО']) && (
              <CircleButton
                type={'create'}
                title={t('CONTROLS.FORM')}
                onClick={() =>
                  update({
                    uid,
                    type: '/formed',
                    body: { ppko_change_date: dataForInit.ppko_change_date }
                  })
                }
                disabled={loading || !data?.can_formed || isNaN(parseInt(dataForInit.ppko_change_date))}
              />
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
        statuses={['NEW', 'IN_PROCESS', 'FORMED', 'DONE', 'REJECTED', 'CANCELED']}
        currentStatus={data?.status || 'NEW'}
      />
      <Box className={'boxShadow'} sx={{ pl: 3, pr: 3, mt: 2, mb: 2 }}>
        <DHTabs value={tab} onChange={handleChangeTab}>
          <DHTab label={t('REQUEST_DETAILS')} value={'details'} />
          <DHTab label={t('LOADED_AP_FILES')} value={'files'} disabled={!uid} />
          <DHTab
            label={t('INITIATED_SUBPROCESSES')}
            value={'requests'}
            disabled={!uid || data?.status === 'IN_PROCESS'}
          />
        </DHTabs>
      </Box>
      {tab === 'details' && <DetailsTab />}
      {tab === 'files' && <FilesTab />}
      {tab === 'requests' && <RequestsTab />}
      <ModalWrapper header={t('CANCEL_PROCESS_CONFIRM')} open={cancelDialog} onClose={() => setCancelDialog(false)}>
        <Stack direction={'row'} sx={{ pt: 3 }} justifyContent={'space-between'} spacing={1}>
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <BlueButton onClick={() => setCancelDialog(false)} style={{ width: '100%' }}>
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
      <SimpleImportModal
        title={t('IMPORT_AP_FILES')}
        openUpload={uploadDialog}
        setOpenUpload={setUploadDialog}
        handleUpload={(body, handleClose) => {
          uploadFile({ uid, body }).then((res) => {
            if (!res?.error) {
              setUploadDialog(false);
              handleChangeTab(0, 'files');
              refetch();
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

export default RequestChangePPKO;
