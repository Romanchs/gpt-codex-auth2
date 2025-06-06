import { useEffect, useState } from 'react';
import { checkPermissions } from '../../../../../util/verifyRole';
import Page from '../../../../Global/Page';
import SimpleImportModal from '../../../../Modal/SimpleImportModal';
import CircleButton from '../../../../Theme/Buttons/CircleButton';
import Statuses from '../../../../Theme/Components/Statuses';
import DelegateBtn from '../../../../../features/delegate/delegateBtn';
import { useTranslation } from 'react-i18next';
import { api, useEndOfSupplyQuery, useFormEndOfSupplyMutation, useLazyExportEosApsQuery, useUploadProlongationFileMutation } from '../api';
import { DHTab, DHTabs } from '../../Components/Tabs';
import { UploadedFiles } from './UploadedFiles';
import { EosDetails } from './EosDetails';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setParams } from '../slice';
import { Box } from '@mui/material';

export const END_OF_SUPPLY_ACCEPT_ROLES = ['АТКО', 'СВБ', 'АКО', 'АКО_Процеси', 'АКО_ППКО', 'АКО_Користувачі', 'АКО_Довідники'];

const Eos = () => {
  const { uid } = useParams();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [tab, setTab] = useState('details');
  const [openUpload, setOpenUpload] = useState(false);
  const [delegating, setDelegating] = useState(false);
  const { params } = useSelector((store) => store.endOfSupply);
  const [form, { isLoading: forming }] = useFormEndOfSupplyMutation();
  const { data, isFetching, error: notFound } = useEndOfSupplyQuery({ uid, params });
  const [uploadFile, { isLoading: uploading, error }] = useUploadProlongationFileMutation();
  const { isFetching: loadingFiles } = api.endpoints.endOfSupplyFiles.useQueryState(uid);
  const [massExport, {isFetching: exporting}] = useLazyExportEosApsQuery();

  useEffect(() => {
    return () => dispatch(setParams({ size: 25, page: 1 }));
  }, []);

  const handleChangeTab = (...args) => {
    setTab(args[1]);
  };

  return (
    <Page
      pageName={data?.id && !isFetching ? t('PAGES.END_OF_SUPPLY_ID', { id: data?.id }) : t('PAGES.END_OF_SUPPLY')}
      backRoute={'/processes'}
      acceptRoles={END_OF_SUPPLY_ACCEPT_ROLES}
      acceptPermisions={'PROCESSES.END_OF_SUPPLY.MAIN.ACCESS'}
      faqKey={'PROCESSES__END_OF_SUPPLY'}
      notFoundMessage={notFound && t('REQUEST_NOT_FOUND')}
      loading={isFetching || uploading || delegating || forming || loadingFiles || exporting}
      controls={
        <>
          {data?.can_upload && checkPermissions('PROCESSES.END_OF_SUPPLY.MAIN.CONTROLS.UPLOAD', ['СВБ']) && (
            <CircleButton type={'upload'} onClick={() => setOpenUpload(true)} title={t('CONTROLS.IMPORT')} />
          )}
          {data?.can_delegate && (
            <DelegateBtn
              process_uid={uid}
              onStarted={() => setDelegating(true)}
              onFinished={() => setDelegating(false)}
              onSuccess={() => window.location.reload()}
            />
          )}
          {data?.move_to_slr_aps_amount > 0 && data?.status === 'IN_PROCESS' && (
            <CircleButton
              type={'new'}
              title={t('CONTROLS.FORM')}
              onClick={() => form(uid)}
              disabled={isFetching || uploading || delegating}
            />
          )}
          {(data?.status === 'FORMED' || data?.status === 'DONE') && (
            <CircleButton type={'download'} onClick={() => massExport(uid)} title={t('CONTROLS.EXPORT_TKO')} />
          )}
        </>
      }
    >
      <Statuses statuses={['NEW', 'IN_PROCESS', 'FORMED', 'DONE', 'CANCELED']} currentStatus={data?.status || 'NEW'} />
      <Box className={'boxShadow'} sx={{ px: 3, my: 2 }}>
        <DHTabs value={tab} onChange={handleChangeTab}>
          <DHTab label={t('REQUEST_DETAILS')} value={'details'} />
          <DHTab label={t('DOWNLOADED_FILES_FOR_REQUEST')} value={'files'} />
        </DHTabs>
      </Box>
      {tab === 'files' && <UploadedFiles />}
      {tab === 'details' && <EosDetails />}
      <SimpleImportModal
        title={t('IMPORT_AP_FILES')}
        openUpload={openUpload}
        setOpenUpload={setOpenUpload}
        handleUpload={(formData, handleClose) => {
          uploadFile({ uid, formData }).then(() => {
            handleClose();
            setTab('files');
          });
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
        error={error?.data}
      />
    </Page>
  );
};

export default Eos;
