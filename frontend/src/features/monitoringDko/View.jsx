import Box from '@mui/material/Box';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { enqueueSnackbar } from '../../actions/notistackActions';
import Page from '../../Components/Global/Page';
import { DHTab, DHTabs } from '../../Components/pages/Processes/Components/Tabs';
import CircleButton from '../../Components/Theme/Buttons/CircleButton';
import ZTab from './Z/Tab';
import ZVTab from './ZV/Tab';
import Register from './Register/Tab';
import Requests from './Requests/Tab';
import CheckDkoZ from './checkDkoZ/Tab';
import CheckDkoZV from './checkDkoZV/Tab';
import { mainApi } from '../../app/mainApi';
import { useCreateMDZVMutation, useDownloadReportMDZVMutation } from './ZV/api';
import { useCreateMDZMutation, useDownloadReportMDZMutation } from './Z/api';
import { useDownloadRequestsMutation } from './Requests/api';
import { checkPermissions } from '../../util/verifyRole';
import { useTranslation } from 'react-i18next';
import { useCreateMDCHECKDKOZMutation, useLazyDownloadMDCHECKDKOZQuery } from './checkDkoZ/api';
import {
  useLazyDownloadMDCHECKDKOZVQuery,
  useCreateMDCHECKDKOZVMutation,
  useUploadMassFileMutation
} from './checkDkoZV/api';
import { defaultParams, defaultSelected, setFilters, setParams, setPoints, setSelected } from './slice';
import useExportFileLog from '../../services/actionsLog/useEportFileLog';
import { MONITORING_DKO_LOG_TAGS } from '../../services/actionsLog/constants';
import SimpleImportModal from '../../Components/Modal/SimpleImportModal';
import SelectField from '../../Components/Theme/Fields/SelectField';
import { verifyRole } from '../../util/verifyRole';

const defaultTabs = [
  { label: 'REQUESTS', value: 'requests' },
  { label: 'INFORMATION_PPKO_BY_Z', value: 'z' },
  { label: 'INFORMATION_PPKO_BY_ZV', value: 'zv' },
  { label: 'REGISTER', value: 'register' },
  { label: 'CHECK_DKO_Z.TITLE', value: 'checkDkoZ' },
  { label: 'CHECK_DKO_ZV.TITLE', value: 'checkDkoZV' }
];

export const MONITORING_DKO_ACCEPT_ROLES = ['АКО', 'АКО_Процеси', 'ОДКО'];

const View = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const points = useSelector((store) => store.monitoringDko.points);
  const params = useSelector((store) => store.monitoringDko.params);
  const showZVImportBtn = useSelector((store) => store.monitoringDko.showZVImportBtn);
  const IS_ODKO_ROLE = checkPermissions('MONITORING_DKO.FUNCTIONS.SHOW_TAB_REQUESTS_INSTEAD_TABS_Z_ZV', 'ОДКО');
  const IS_AKO_PROCESS_ROLE = checkPermissions('MONITORING_DKO.FUNCTIONS.SHOW_TAB_CHECK_DKO_Z', 'АКО_Процеси');
  const [tab, setTab] = useState(window.location.search.split('?tab=')?.[1] || (IS_ODKO_ROLE ? 'requests' : 'z'));
  const tabs = defaultTabs.filter((i) => {
    if (IS_ODKO_ROLE) return i.value !== 'z' && i.value !== 'zv';
    if (!IS_AKO_PROCESS_ROLE) return i.value !== 'checkDkoZ' && i.value !== 'checkDkoZV';
    return i.value !== 'requests';
  });
  const [openUploadMassActionApFile, setOpenUploadMassActionApFile] = useState(false);
  const [fileType, setFileType] = useState(null);

  const [, { isLoading: isZVCreate }] = useCreateMDZVMutation({ fixedCacheKey: 'MDZV_create' });
  const [, { isLoading: isZCreate }] = useCreateMDZMutation({ fixedCacheKey: 'MDZ_create' });
  const [downloadReportZV, { isLoading: isDownloadReportZV }] = useDownloadReportMDZVMutation();
  const [downloadReportZ, { isLoading: isDownloadReportZ }] = useDownloadReportMDZMutation();
  const [downloadRequests, { isLoading: isDownloadRequests }] = useDownloadRequestsMutation();
  const [downloadReportCheckDkoZ] = useLazyDownloadMDCHECKDKOZQuery();
  const [downloadReportCheckDkoZV] = useLazyDownloadMDCHECKDKOZVQuery();
  const [, { isLoading: isCheckDKOZCreate }] = useCreateMDCHECKDKOZMutation({ fixedCacheKey: 'MD_CHECKDKOZ_create' });
  const [, { isLoading: isCheckDKOZVCreate }] = useCreateMDCHECKDKOZVMutation({
    fixedCacheKey: 'MD_CHECKDKOZV_create'
  });
  const [uploadFile, { isLoading: isLoadingUpload, error: uploadFileError }] = useUploadMassFileMutation();

  const exportFileLog = useExportFileLog(MONITORING_DKO_LOG_TAGS);

  const isLoading =
    isZVCreate ||
    isZCreate ||
    isDownloadReportZV ||
    isDownloadReportZ ||
    isDownloadRequests ||
    isCheckDKOZCreate ||
    isCheckDKOZVCreate ||
    isLoadingUpload;

  const specialQueries = useSelector((store) =>
    Object.values(store.mainApi.queries).filter(
      (q) =>
        q.endpointName === 'getListMDZV' ||
        q.endpointName === 'getListMDZ' ||
        q.endpointName === 'listMDCHECKDKOZ' ||
        q.endpointName === 'listMDCHECKDKOZV'
    )
  );
  const queriesList = useSelector((store) =>
    Object.values(store.mainApi.queries).filter(
      (q) => q.endpointName === 'getListMDR' || q.endpointName === 'settingsMDCHECKDKOZ'
    )
  );
  const queries = useMemo(() => [...specialQueries, ...queriesList], [specialQueries, queriesList]);
  const lastQuery = useMemo(
    () => specialQueries.find((q) => q.startedTimeStamp === Math.max(...specialQueries.map((q) => q.startedTimeStamp))),
    [specialQueries]
  );
  const { currentData } = mainApi.endpoints[lastQuery?.endpointName || 'getListMDZ'].useQueryState(
    lastQuery?.originalArgs
  );
  const isFetching = Boolean(queries.find((q) => q.status === 'pending'));

  const handleChangeTab = (...args) => {
    setTab(args[1]);
    navigate('?tab=' + args[1]);
    dispatch(setParams(defaultParams));
    dispatch(setPoints([]));
    dispatch(setSelected(defaultSelected));
    dispatch(setFilters({}));
  };

  const handleDownloadReport = async (is_sent) => {
    const donwloadF = tab === 'zv' ? downloadReportZV : downloadReportZ;
    const { data, error } = await donwloadF({ uids: points === 'all' ? null : points, is_sent });
    dispatch(setPoints([]));
    if (!error && data.detail) {
      dispatch(
        enqueueSnackbar({
          message: data.detail,
          options: {
            key: new Date().getTime() + Math.random(),
            variant: 'success',
            autoHideDuration: 5000
          }
        })
      );
      handleChangeTab(0, 'register');
    }
    exportFileLog();
  };

  return (
    <Page
      acceptPermisions={'MONITORING_DKO.ACCESS'}
      acceptRoles={MONITORING_DKO_ACCEPT_ROLES}
      faqKey={'INFORMATION_BASE__MONITORING_DKO'}
      pageName={isFetching ? `${t('LOADING')}...` : t('PAGES.MONITORING_DKO')}
      backRoute={'/'}
      loading={isFetching || isLoading}
      controls={
        <>
          {(tab === 'z' || tab === 'zv') && (
            <>
              <CircleButton
                onClick={() => handleDownloadReport()}
                type={'download'}
                title={t('CONTROLS.DOWNLOAD')}
                disabled={!points.length || !currentData?.can_start}
              />
              <CircleButton
                onClick={() => handleDownloadReport(true)}
                type={'send'}
                title={t('CONTROLS.SEND')}
                disabled={!points.length || !currentData?.can_start}
              />
            </>
          )}
          {tab === 'checkDkoZ' && (
            <CircleButton
              onClick={() => {
                downloadReportCheckDkoZ({ ...params, page: undefined, size: undefined });
                exportFileLog();
              }}
              type={'download'}
              title={t('CONTROLS.EXPORT')}
            />
          )}
          {tab === 'checkDkoZV' && (
            <>
              {!verifyRole(['ОДКО']) && (
                <CircleButton
                  onClick={() => {
                    setOpenUploadMassActionApFile(true);
                  }}
                  disabled={showZVImportBtn}
                  type={'upload'}
                  title={t('CONTROLS.IMPORT_ACTION')}
                />
              )}
              <CircleButton
                onClick={() => {
                  downloadReportCheckDkoZV({ ...params, page: undefined, size: undefined });
                  exportFileLog();
                }}
                type={'download'}
                title={t('CONTROLS.EXPORT')}
              />
            </>
          )}
        </>
      }
    >
      <Box className={'boxShadow'} sx={{ pl: 3, pr: 3, mb: 2 }}>
        <DHTabs value={tab} onChange={handleChangeTab}>
          {tabs.map((i) => (
            <DHTab key={i.value} label={t(i.label)} value={i.value} />
          ))}
        </DHTabs>
      </Box>
      {tab === 'z' && <ZTab />}
      {tab === 'zv' && <ZVTab />}
      {tab === 'register' && <Register />}
      {tab === 'requests' && <Requests fetch={downloadRequests} />}
      {tab === 'checkDkoZ' && <CheckDkoZ />}
      {tab === 'checkDkoZV' && <CheckDkoZV />}
      <SimpleImportModal
        title={t('IMPORT_FILE.IMPORT_FILE')}
        contentUp
        openUpload={openUploadMassActionApFile}
        setOpenUpload={(open) => {
          setOpenUploadMassActionApFile(open);
          setFileType(null);
        }}
        canUploadWithoutKey
        handleUpload={(formData) => {
          formData.append('file_type', fileType);
          uploadFile({ body: formData })
            .unwrap()
            .then(() => {
              setOpenUploadMassActionApFile(false);
              setFileType(null);
            })
            .catch((e) => {
              setFileType(null);
              return e;
            });
        }}
        layoutList={[
          {
            key: 'file_original',
            label: t('IMPORT_FILE.SELECT_FILE_WITH_AP_INFORMAT', { format: '.xlsx' }),
            accept: '.xlsx',
            maxSize: 15000000,
            sizeError: t('VERIFY_MSG.MAX_FILE_SIZE', { size: 15 })
          }
        ]}
        uploading={isLoadingUpload}
        disabledUpload={!fileType}
        error={uploadFileError}
      >
        <SelectField
          dataMarker={'fileType'}
          onChange={setFileType}
          data={[
            { value: 'POWER_OF_RESOURCE_OBJECTS', label: t('CHECK_DKO_ZV.POWER_OF_RESOURCE_OBJECTS') },
            { value: 'POWER_PARSING_FOR_W_MARKET_PREMIUM', label: t('CHECK_DKO_ZV.POWER_PARSING_FOR_W_MARKET_PREMIUM') }
          ]}
          label={t('CHECK_DKO_ZV.FILE_TYPE')}
          value={fileType}
        />
      </SimpleImportModal>
    </Page>
  );
};

export default View;
