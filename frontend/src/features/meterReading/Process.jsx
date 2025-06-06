import Page from '../../Components/Global/Page';
import { useNavigate, useParams } from 'react-router-dom';
import Statuses from '../../Components/Theme/Components/Statuses';
import { Box } from '@mui/material';
import { DHTab, DHTabs } from '../../Components/pages/Processes/Components/Tabs';
import { useEffect, useState } from 'react';
import CircleButton from '../../Components/Theme/Buttons/CircleButton';
import {
  useMeterReadingProcessFormMutation,
  useMeterReadingProcessQuery,
  useMeterReadingProcessStartMutation,
  useMeterReadingProcessUploadMutation
} from './api';
import moment from 'moment';
import DetailsTab from './components/DetailsTab';
import SimpleImportModal from '../../Components/Modal/SimpleImportModal';
import RequestsTab from './components/RequestsTab';
import FilesTab from './components/FilesTab';
import { useDispatch } from 'react-redux';
import { mainApi } from '../../app/mainApi';
import { useTranslation } from 'react-i18next';
import useProcessRoom from '../../app/sockets/useProcessRoom';

export const METER_READING_TRANSFER_PPKO_ACCEPT_ROLES = ['ОДКО', 'АКО_Процеси', 'СВБ'];

const Process = () => {
  const { t } = useTranslation();
  const { uid } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [tab, setTab] = useState('details');
  const [must_be_finished_at, setDate] = useState(null);
  const [openUpload, setOpenUpload] = useState(false);
  const [params, setParams] = useState({ page: 1, size: 25 });
  const [onStart, { reset, isLoading }] = useMeterReadingProcessStartMutation({
    fixedCacheKey: 'meter-reading-start'
  });

  const { currentData: data, isFetching, refetch } = useMeterReadingProcessQuery({ uid, params }, { skip: !uid });
  const [onUpload, { isLoading: isUploading, error: uploadError }] = useMeterReadingProcessUploadMutation();
  const [onForm, { isLoading: isLoadingForm }] = useMeterReadingProcessFormMutation();

  useProcessRoom(uid, refetch);

  useEffect(() => {
    if (!uid) {
      dispatch(mainApi.util.invalidateTags(['METER_READING__PROCESS']));
    }
  }, [uid, dispatch]);

  const handleStart = () => {
    onStart({ must_be_finished_at }).then((res) => {
      if (res?.data?.uid) {
        setDate(null);
        reset();
        navigate(`/meter-reading/process/${res?.data?.uid}`);
      }
    });
  };

  const handleFilterRequests = (data) => {
    setParams((p) => ({ ...p, ...data }));
  };

  return (
    <Page
      pageName={data?.id ? t('PAGES.METER_READING_ID', { id: data?.id }) : t('PROCESSES.METER_READING')}
      backRoute={'/processes'}
      acceptPermisions={'PROCESSES.METER_READING.INITIALIZATION'}
      acceptRoles={METER_READING_TRANSFER_PPKO_ACCEPT_ROLES}
      faqKey={'PROCESSES__METER_READING_TRANSFER_PPKO'}
      loading={isFetching || isLoading || isUploading || isLoadingForm}
      controls={
        <>
          {!uid && (
            <CircleButton
              type={'create'}
              title={t('CONTROLS.TAKE_TO_WORK')}
              onClick={handleStart}
              disabled={
                !must_be_finished_at ||
                !must_be_finished_at.isValid() ||
                !must_be_finished_at.isBetween(moment().add(2, 'days'), moment().add(31, 'days'))
              }
            />
          )}
          {data?.can_upload && (
            <CircleButton type={'upload'} title={t('CONTROLS.IMPORT')} onClick={() => setOpenUpload(true)} />
          )}
          {data?.can_form && <CircleButton type={'new'} title={t('CONTROLS.FORM')} onClick={() => onForm(uid)} />}
        </>
      }
    >
      <Statuses statuses={['NEW', 'IN_PROCESS', 'FORMED', 'DONE', 'CANCELED']} currentStatus={data?.status ?? 'NEW'} />
      <Box className={'boxShadow'} sx={{ pl: 3, pr: 3, mt: 2, mb: 2 }}>
        <DHTabs value={tab} onChange={(...args) => setTab(args[1])}>
          <DHTab label={t('DATA_ON_REQUEST')} value={'details'} />
          <DHTab label={t('OUTGOING_REQUESTS_FOR_METER_DATA_COLLECTOR')} value={'requests'} disabled={!uid} />
          <DHTab label={t('DOWNLOADED_FILES')} value={'files'} disabled={!uid} />
        </DHTabs>
      </Box>
      {tab === 'details' && (
        <DetailsTab date={must_be_finished_at} handleDate={setDate} params={params} setParams={setParams} />
      )}
      {tab === 'requests' && <RequestsTab params={params} handleFilter={handleFilterRequests} />}
      {tab === 'files' && <FilesTab params={params} />}
      <SimpleImportModal
        title={t('IMPORT_AP_FILES')}
        openUpload={openUpload}
        setOpenUpload={setOpenUpload}
        handleUpload={(body) => {
          onUpload({ uid, body }).then((res) => {
            if (!res?.error) setOpenUpload(false);
          });
        }}
        layoutList={[
          {
            key: 'file_original',
            label: t('IMPORT_FILE.SELECT_FILE_WITH_AP_INFORMAT', { format: 'xls, xlsx, xml' }),
            accept: '.xls,.xlsx,.xml',
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
        uploading={isUploading}
        error={uploadError}
      />
    </Page>
  );
};

export default Process;
