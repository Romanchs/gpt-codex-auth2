import { Box, Grid } from '@mui/material';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import Page from '../../../Components/Global/Page';
import CancelModal from '../../../Components/Modal/CancelModal';
import SimpleImportModal from '../../../Components/Modal/SimpleImportModal';
import CircleButton from '../../../Components/Theme/Buttons/CircleButton';
import Statuses from '../../../Components/Theme/Components/Statuses';
import StyledInput from '../../../Components/Theme/Fields/StyledInput';
import { AutocompleteWithChips } from '../../../Components/Theme/Fields/AutocompleteWithChips';
import {
  useCreateUpdateApHistoryMutation,
  useInitDataUpdateApHistoryQuery,
  useUpdateApHistoryQuery,
  useUpdateUpdateApHistoryMutation,
  useUploadUpdateApHistoryMutation
} from './api';
import { useTableStyles } from './filterStyles';
import { Table } from './Table';
import { useTranslation } from 'react-i18next';
import { useLazyMsFilesDownloadQuery } from '../../../app/mainApi';
import useExportFileLog from '../../../services/actionsLog/useEportFileLog';
import SelectField from '../../../Components/Theme/Fields/SelectField';
import useProcessRoom from '../../../app/sockets/useProcessRoom';

const defaultFields = {
  ap_properties: [],
  ap_eic: '',
  description: '',
  ap_type: null,
  eic_code: null
};

export const UPDATE_AP_HISTORY_ACCESS_ACCEPT_ROLES = ['АТКО', 'СВБ', 'АКО_Процеси'];

const UpdateApHistory = () => {
  const { t, i18n } = useTranslation();
  const { uid } = useParams();
  const navigate = useNavigate();
  const classes = useTableStyles();
  const {
    activeOrganization: { name: initiator_company },
    full_name
  } = useSelector(({ user }) => user);
  const [openCancel, setOpenCancel] = useState(false);
  const [openUpload, setOpenUpload] = useState(false);
  const [autocompleteKey, setAutocompleteKey] = useState(new Date().getTime() + Math.random());
  const [fields, setFields] = useState(defaultFields);
  const [initParams, setInitParams] = useState(null);

  const [initProcess, { isLoading: isCreating, error: createError }] = useCreateUpdateApHistoryMutation();
  const [update, { isLoading: isUpdating }] = useUpdateUpdateApHistoryMutation();
  const [uploadFile, { isLoading: uploading, error: uploadingError }] = useUploadUpdateApHistoryMutation();
  const {
    currentData,
    error: notFound,
    isFetching: isLoading,
    refetch
  } = useUpdateApHistoryQuery('/' + uid, { skip: !uid });
  const { currentData: initData, isFetching: isInitLoading } = useInitDataUpdateApHistoryQuery(initParams, {
    skip: uid
  });
  const [downloadFile] = useLazyMsFilesDownloadQuery();
  const exportFileLog = useExportFileLog(['Внесення змін до історії основних даних ТКО']);

  useProcessRoom(uid, refetch);

  useEffect(() => {
    setAutocompleteKey(new Date().getTime() + Math.random());
    setFields(defaultFields);
  }, [uid]);

  const handleFieldChange =
    (id) =>
    ({ target }) => {
      if (id === 'ap_eic' && target.value.length > 16) return;
      setFields({ ...fields, [id]: target.value });
    };

  const handleApTypeChange = (value) => {
    setInitParams({ ap_type: value });
    setFields({ ...fields, ap_type: value, ap_properties: [] });
    setAutocompleteKey(new Date().getTime() + Math.random());
  };

  return (
    <Page
      acceptPermisions={!uid ? 'PROCESSES.UPDATE_AP_HISTORY.INITIALIZATION' : 'PROCESSES.UPDATE_AP_HISTORY.ACCESS'}
      acceptRoles={!uid ? ['АТКО', 'СВБ'] : UPDATE_AP_HISTORY_ACCESS_ACCEPT_ROLES}
      faqKey={'PROCESSES__UPDATE_AP_HISTORY'}
      pageName={
        isLoading || isInitLoading
          ? `${t('LOADING')}...`
          : currentData?.id
          ? t('PAGES.UPDATE_AP_HISTORY_ID', { id: currentData.id })
          : t('PAGES.UPDATE_AP_HISTORY')
      }
      backRoute={'/processes'}
      loading={isLoading || isInitLoading || isCreating || isUpdating || uploading}
      notFoundMessage={uid && notFound && t('PROCESS_NOT_FOUND')}
      controls={
        <>
          {!uid && (
            <CircleButton
              type={'create'}
              title={t('CONTROLS.TAKE_TO_WORK')}
              onClick={async () => {
                const { error, data: uid } = await initProcess({
                  ...fields,
                  ap_properties: fields.ap_properties.map((i) => i.value)
                });
                if (!error) navigate(`/processes/update-ap-history/${uid}`);
              }}
              disabled={
                !fields.ap_properties.length ||
                fields.ap_eic.length !== 16 ||
                fields.description.length < 10 ||
                fields.description.length > 200 ||
                !fields.ap_type
              }
            />
          )}
          {currentData?.can_cancel && (
            <CircleButton type={'remove'} title={t('CONTROLS.CANCEL_REQUEST')} onClick={() => setOpenCancel(true)} />
          )}
          {currentData?.can_upload && (
            <CircleButton type={'upload'} title={t('CONTROLS.IMPORT')} onClick={() => setOpenUpload(true)} />
          )}
          {currentData?.can_complete && (
            <CircleButton
              type={'done'}
              title={t('CONTROLS.DONE_PROCESS')}
              onClick={() => update({ uid, type: '/complete' })}
            />
          )}
        </>
      }
    >
      <Statuses statuses={['NEW', 'IN_PROCESS', 'DONE', 'CANCELED']} currentStatus={currentData?.status || 'NEW'} />
      <Box className={'boxShadow'} style={{ marginTop: 16, padding: '20px 24px' }}>
        <Grid container spacing={3} alignItems={'flex-start'}>
          <Grid item xs={12} md={6} lg={3}>
            {uid ? (
              <StyledInput
                label={t('FIELDS.AP_TYPE')}
                value={
                  i18n.exists(`PLATFORM.${currentData?.ap_type?.toUpperCase()}`) &&
                  t(`PLATFORM.${currentData?.ap_type?.toUpperCase()}`)
                }
                readOnly
              />
            ) : (
              <SelectField
                label={t('FIELDS.AP_TYPE')}
                value={fields?.ap_type}
                data={
                  initData?.ap_type.map((i) => ({
                    value: i.value,
                    label: `PLATFORM.${i?.value?.toUpperCase()}`
                  })) || []
                }
                onChange={handleApTypeChange}
                required
              />
            )}
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <StyledInput
              label={t('FIELDS.AP_EIC_CODE')}
              value={currentData?.ap_eic || fields?.ap_eic}
              onChange={handleFieldChange('ap_eic')}
              error={createError?.data?.ap_eic}
              readOnly={Boolean(currentData?.ap_eic)}
              required={!uid}
              disabled={!currentData && !fields.ap_type}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <StyledInput
              label={t('FIELDS.USER_INITIATOR')}
              value={currentData?.initiator?.username ?? full_name}
              readOnly
            />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <StyledInput
              label={t('FIELDS.START_WORK_DATE')}
              value={currentData?.created_at && moment(currentData?.created_at).format('DD.MM.yyyy • HH:mm')}
              readOnly
            />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <StyledInput
              label={
                currentData?.status?.startsWith('CANCELED') ? t('FIELDS.CANCELED_AT') : t('FIELDS.COMPLETE_DATETIME')
              }
              value={currentData?.finished_at && moment(currentData?.finished_at).format('DD.MM.yyyy • HH:mm')}
              readOnly
            />
          </Grid>
          <Grid item xs={12} md={6} lg={9}>
            <StyledInput
              label={t('FIELDS.INITIATOR_COMPANY')}
              value={currentData?.initiator_company?.short_name ?? initiator_company}
              readOnly
            />
          </Grid>
          <Grid item xs={12}>
            <StyledInput
              label={t('FIELDS.JUSTIFICATION')}
              value={currentData?.description || fields?.description}
              onChange={handleFieldChange('description')}
              error={
                createError?.data?.description ||
                (fields.description && (fields.description.length < 10 || fields.description.length > 200) && !uid
                  ? t('VERIFY_MSG.REQUIRED_FIELD_MIN_10_MAX_200_SYMBOLS')
                  : '')
              }
              readOnly={Boolean(uid)}
            />
          </Grid>
        </Grid>
      </Box>
      <section className={classes.table}>
        <h4 className={classes.tableHeader}>{t('LIST_OF_CHARACTERISTICS_TO_CHANGE')}</h4>
        <Box className={`${classes.tableBody} ${uid ? classes.tableBody__chips : ''}`}>
          <AutocompleteWithChips
            key={autocompleteKey}
            reusedValue={currentData?.ap_properties || fields.ap_properties}
            options={initData?.ap_properties}
            nameKey={'ap_properties'}
            label={t('FIELDS.CHARACTERISTICS_SHORT')}
            textNoMoreOption={t('NO_MORE_CAHRACTERISTICT_TO_SELECT')}
            handleChange={(ap_properties) => setFields({ ...fields, ap_properties })}
            disabled={!uid && !fields.ap_type}
          />
        </Box>
      </section>
      {currentData?.files?.length > 0 && (
        <>
          <h3
            style={{
              fontSize: 15,
              fontWeight: 'normal',
              color: '#0D244D',
              lineHeight: 1.2,
              paddingBottom: 16,
              paddingTop: 18
            }}
          >
            {t('LIST_OF_DOWNLOADED_FILES_BY_REQUEST')}:
          </h3>
          <Table
            files={currentData?.files || []}
            handleDownload={({ file_id, file_name }) => {
              downloadFile({ id: file_id, name: file_name });
              exportFileLog(uid);
            }}
            handleUpdateList={refetch}
          />
        </>
      )}
      <CancelModal
        text={t('CANCEL_PROCESS_CONFIRM_UNSAVING_CHANGES')}
        open={openCancel}
        onClose={() => setOpenCancel(false)}
        onSubmit={() => {
          setOpenCancel(false);
          update({ uid, type: '/cancel' });
        }}
      />
      <SimpleImportModal
        title={t('IMPORT_AP_FILES')}
        openUpload={openUpload}
        setOpenUpload={setOpenUpload}
        handleUpload={(formData, handleClose) => {
          uploadFile({ uid, formData }).then((res) => {
            if (!res?.error) handleClose();
          });
        }}
        layoutList={[
          {
            key: 'file_original',
            label: t('IMPORT_FILE.SELECT_FILE_IN_FORMAT_XLS_XLSX_XLSM'),
            accept: '.xls,.xlsx,.xlsm',
            maxSize: 26214400,
            sizeError: t('VERIFY_MSG.MAX_FILE_SIZE', { size: 25 })
          },
          {
            key: 'file_original_key',
            label: t('IMPORT_FILE.SELECT_DIGITAL_SIGNATURE_FILE'),
            accept: '.p7s',
            maxSize: 40960,
            sizeError: t('VERIFY_MSG.MAX_FILE_SIZE_KBYTE', { size: 40 })
          }
        ]}
        uploading={uploading}
        error={uploadingError?.data}
      />
    </Page>
  );
};

export default UpdateApHistory;
