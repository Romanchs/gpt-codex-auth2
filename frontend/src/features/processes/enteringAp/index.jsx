import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { mainApi } from '../../../app/mainApi';
import Page from '../../../Components/Global/Page';
import { ModalWrapper } from '../../../Components/Modal/ModalWrapper';
import { BlueButton } from '../../../Components/Theme/Buttons/BlueButton';
import { DangerButton } from '../../../Components/Theme/Buttons/DangerButton';
import CircleButton from '../../../Components/Theme/Buttons/CircleButton';
import Statuses from '../../../Components/Theme/Components/Statuses';
import { DHTab, DHTabs } from '../../../Components/pages/Processes/Components/Tabs';
import DelegateBtn from '../../delegate/delegateBtn';
import SimpleImportModal from '../../../Components/Modal/SimpleImportModal';
import { useInitEnteringApMutation, useUpdateEnteringApMutation } from './api';
import DetailsTab from './components/DetailsTab';
import FilesTab from './components/FilesTab';
import {useTranslation} from "react-i18next";

const tabs = {
  details: 'details',
  files: 'files'
};

export const ENTERING_AP_INTO_ACCOUNTING_ACCESS_ACCEPT_ROLES = ['АКО_Процеси', 'АТКО'];

const EnteringAp = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loading = useSelector((store) =>
    Boolean(
      Object.values(store.mainApi.queries)
        .filter((q) => q.endpointName === 'detailsEnteringAp' || q.endpointName === 'filesEnteringAp')
        .find((q) => q.status === 'pending')
    )
  );

  const queries = useSelector((store) =>
    Object.values(store.mainApi.queries).filter(
      (q) => q.endpointName === 'detailsEnteringAp' || q.endpointName === 'filesEnteringAp'
    )
  );
  const lastQuery = useMemo(
    () => queries.find((q) => q.startedTimeStamp === Math.max(...queries.map((q) => q.startedTimeStamp))),
    [queries]
  );

  const { uid } = useParams();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [delegating, setDelegating] = useState(false);
  const { uploading, error } = useSelector((store) => store.massLoad);
  const [openUpload, setOpenUpload] = useState(false);
  const [tab, setTab] = useState(tabs.details);

  const [initProcess, { isLoading: isCreating }] = useInitEnteringApMutation();
  const [update, { isLoading: isUpdating }] = useUpdateEnteringApMutation();

  useEffect(() => {
    if (lastQuery?.error?.data?.detail === 'У вас немає дозволу на виконання цієї дії.') {
      navigate('/processes');
    }
  }, [navigate, lastQuery?.error]);

  useEffect(() => {
    if (!uid && lastQuery) {
      setTab(tabs.details);
      dispatch(mainApi.util.invalidateTags(['ENTERING_AP_DETAILS', 'ENTERING_AP_FILES']));
    }
  }, [dispatch, uid, lastQuery]);

  const handleChangeTab = (...args) => {
    setTab(args[1]);
  };

  return (
    <Page
      acceptPermisions={uid ? 'PROCESSES.ENTERING_AP.ACCESS' : 'PROCESSES.ENTERING_AP.INITIALIZATION'}
      acceptRoles={uid ? ENTERING_AP_INTO_ACCOUNTING_ACCESS_ACCEPT_ROLES : ['АТКО']}
      faqKey={'PROCESSES__ENTERING_AP_INTO_ACCOUNTING'}
      pageName={
        uid
          ? lastQuery?.data
            ? t('PAGES.ENTRY_TKO_ID', {id: lastQuery?.data?.id})
            : `${t('LOADING')}...`
          : t('SUBPROCESSES.ENTERING_AP_INTO_ACCOUNTING')
      }
      backRoute={'/processes'}
      loading={isCreating || isUpdating || delegating || loading}
      notFoundMessage={Boolean(lastQuery?.error) && t('PROCESS_NOT_FOUND')}
      controls={
        <>
          {!uid && (
            <CircleButton
              type={'create'}
              title={t('CONTROLS.TAKE_TO_WORK')}
              onClick={() => {
                initProcess().then((res) => {
                  if (res?.data?.uid) {
                    navigate(res.data.uid, { replace: true });
                  }
                });
              }}
              data-marker={'init'}
            />
          )}
          {lastQuery?.data?.can_cancel && (
            <CircleButton
              type={'remove'}
              title={t('CONTROLS.CANCEL')}
              onClick={() => setOpenDeleteDialog(true)}
              data-marker={'cancel'}
            />
          )}
          {lastQuery?.data?.can_upload && (
            <CircleButton type={'upload'} title={t('CONTROLS.IMPORT')} onClick={() => setOpenUpload(true)} />
          )}
          {lastQuery?.data?.can_delegate && (
            <DelegateBtn
              process_uid={uid}
              onStarted={() => setDelegating(true)}
              onFinished={() => setDelegating(false)}
              onSuccess={() => window.location.reload()}
            />
          )}
          {lastQuery?.data?.can_done && (
            <CircleButton type={'done'} title={t('CONTROLS.PERFORM')} onClick={() => update({ uid, type: '/done' })} />
          )}
        </>
      }
    >
      <Statuses
        statuses={['NEW', 'IN_PROCESS', 'DONE', 'PARTIALLY_DONE', 'CANCELED']}
        currentStatus={lastQuery?.data?.status || 'NEW'}
      />
      <Box className={'boxShadow'} sx={{ pl: 3, pr: 3, mt: 2, mb: 2 }}>
        <DHTabs value={tab} onChange={handleChangeTab}>
          <DHTab label={t('REQUEST_DETAILS')} value={tabs.details} />
          <DHTab label={t('LOADED_AP_FILES')} value={tabs.files} disabled={!uid} />
        </DHTabs>
      </Box>
      {tab === tabs.details && <DetailsTab />}
      {tab === tabs.files && <FilesTab />}
      <SimpleImportModal
        title={t('IMPORT_AP_FILES')}
        openUpload={openUpload}
        setOpenUpload={setOpenUpload}
        uploading={uploading}
        handleUpload={(body) => {
          setOpenUpload(false);
          update({ uid, type: '/upload', body }).then(() => {
            setTab(tabs.files);
          });
        }}
        layoutList={[
          {
            key: 'file_original',
            label: t('IMPORT_FILE.SELECT_FILE_WITH_AP_INFORMAT', {format: '.xls, .xlsx, .xlsm'}),
            accept: '.xls,.xlsx,.xlsm',
            maxSize: 26214400,
            sizeError: t('VERIFY_MSG.MAX_FILE_SIZE', {size: '25'})
          },
          {
            key: 'file_original_key',
            label: t('IMPORT_FILE.SELECT_DIGITAL_SIGNATURE_FILE'),
            accept: '.p7s',
            maxSize: 40960,
            sizeError: t('IMPORT_FILE.SIGNATURE_SIZE_LIMIT')
          }
        ]}
        error={error}
        warningMessage={t('IMPORT_FILE.IMPORT_MAX_AP_COUNT_WARNING')}
      />
      <ModalWrapper
        header={t('CANCEL_PROCESS_CONFIRMATION')}
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
              <DangerButton
                style={{ width: '100%' }}
                onClick={() => {
                  setOpenDeleteDialog(false);
                  update({ uid, type: '/cancel' });
                }}
              >
                {t('CONTROLS.YES')}
              </DangerButton>
            </Grid>
          </Grid>
        </Stack>
      </ModalWrapper>
    </Page>
  );
};

export default EnteringAp;
