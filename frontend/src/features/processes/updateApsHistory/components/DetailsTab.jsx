import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import SearchRounded from '@mui/icons-material/SearchRounded';
import InputAdornment from '@mui/material/InputAdornment';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useMemo, useState } from 'react';
import moment from 'moment';
import DatePicker from '../../../../Components/Theme/Fields/DatePicker';
import SelectField from '../../../../Components/Theme/Fields/SelectField';
import StyledInput from '../../../../Components/Theme/Fields/StyledInput';
import {
  useInitDataUpdateApsHistoryQuery,
  useInitUpdateApsHistoryMutation,
  useUpdateApsHistoryQuery,
  useUploadDescriptionUpdateApsHistoryMutation
} from '../api';
import { useTranslation } from 'react-i18next';
import { BlueButton } from '../../../../Components/Theme/Buttons/BlueButton';
import { AutocompleteWithChips } from '../../../../Components/Theme/Fields/AutocompleteWithChips';
import CircleButton from '../../../../Components/Theme/Buttons/CircleButton';
import { useLazyMsFilesDownloadQuery } from '../../../../app/mainApi';
import { setInitData } from '../slice';
import EditForm from './EditForm';
import PropertiesForm from './PropertiesForm';
import useExportFileLog from '../../../../services/actionsLog/useEportFileLog';
import { verifyRole } from '../../../../util/verifyRole';

const DetailsTab = () => {
  const { uid } = useParams();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const data = useSelector((store) => store.updateApsHistory.data);
  const styles = useSelector((store) => store.updateApsHistory.styles);
  const companyName = useSelector((store) => store.user.organizations.find((i) => i.active).name);
  const userName = useSelector((store) => store.user.full_name);

  const { data: initData } = useInitDataUpdateApsHistoryQuery({
    ap_type: data?.ap_type || undefined,
    edit_type: data?.edit_type || undefined
  });

  const [descriptionError, setDescriptionError] = useState('');
  const [, { error }] = useInitUpdateApsHistoryMutation({ fixedCacheKey: 'updateApsHistory_init' });
  const { currentData } = useUpdateApsHistoryQuery(uid, { skip: !uid });
  const [downloadFile] = useLazyMsFilesDownloadQuery();

  const [uploadFile, { isLoading: isUploading }] = useUploadDescriptionUpdateApsHistoryMutation();
  const exportFileLog = useExportFileLog(['Запит на редагування основних даних ТКО']);

  const isPropsType = useMemo(
    () => currentData?.edit_type && currentData?.edit_type !== 'AP_BEGINNING',
    [currentData?.edit_type, initData?.edit_type]
  );

  const getFinishedDateText = () => {
    if (currentData?.status === 'COMPLETED' || currentData?.status === 'PARTIALLY_DONE') return 'COMPLETED_AT';
    if (currentData?.status === 'REJECTED') return 'REQUEST_CANCEL_REJECTED_DATE';
    if (currentData?.status?.startsWith('CANCELED')) return 'CANCELED_AT';
    return 'COMPLETE_DATETIME';
  };

  const handleChange = (id) => (value) => {
    if (id === 'edit_type') {
      if (value === 'AP_MEASUREMENT_INTERVAL') {
        return dispatch(
          setInitData({
            ...data,
            period_end: null,
            ap_properties: [{ label: 'Інтервал вимірювання (106-6)', value: '106-6' }],
            [id]: value
          })
        );
      }
      return dispatch(setInitData({ ...data, period_end: null, ap_properties: [], [id]: value }));
    }
    if (id === 'period_begin' || id === 'period_end') {
      return dispatch(setInitData({ ...data, [id]: moment(value).startOf('day').utc().format() }));
    }
    if (id === 'ap_type') {
      return dispatch(setInitData({ ...data, [id]: value, edit_type: null }));
    }
    dispatch(setInitData({ ...data, [id]: value }));
  };

  const handleDescription = ({ target }) => {
    const description = target.value;
    if (description.length < 10 || description.length > 200) {
      setDescriptionError(t('VERIFY_MSG.REQUIRED_FIELD_MIN_10_MAX_200_SYMBOLS'));
    } else setDescriptionError('');
    dispatch(setInitData({ ...data, description }));
  };

  const handleUploadFile = ({ target }) => {
    if (!target.files.length) return;
    const body = new FormData();
    body.append('file_original', target.files[0]);
    uploadFile({ uid, type: '/file-description', body });
  };

  const handleDownloadFile = () => {
    if (!currentData?.description_file_uid) return;
    downloadFile({ id: currentData?.description_file_uid, name: currentData?.description_file_name });
    exportFileLog(currentData?.uid);
  };

  const AP_MEASUREMENT_INTERVAL_OPTIONS = [
    { label: 'Інтервал вимірювання (106-6)', value: '106-6' },
    { label: 'Кількість ТКО за площадкою комерційного обліку (101-31)', value: '101-31' },
    { label: 'Метод вимірювання (106-3)', value: '106-3' },
    { label: 'Метод розрахунку (106-4)', value: '106-4' },
    { label: 'Тип профілю ТКО (106-50)', value: '106-50' },
    { label: 'ЕІС код профільної ТКО (106-503)', value: '106-503' }
  ];

  return (
    <>
      <Box className={'boxShadow'} sx={{ p: 3, mt: 2, mb: 2 }}>
        <Grid container spacing={3} alignItems={'flex-start'}>
          <Grid item xs={12} md={6} lg={3}>
            {uid ? (
              <StyledInput
                label={t('FIELDS.AP_TYPE')}
                value={t(`PLATFORM.${currentData?.ap_type?.toUpperCase()}`)}
                disabled
              />
            ) : (
              <SelectField
                data={
                  initData?.ap_type.map((i) => ({
                    value: i.value,
                    label: `PLATFORM.${i.value?.toUpperCase()}`
                  })) || []
                }
                label={t('FIELDS.AP_TYPE')}
                value={data?.ap_type}
                onChange={handleChange('ap_type')}
                error={error?.data?.ap_type}
              />
            )}
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            {uid ? (
              <StyledInput
                label={t('UPDATE_APS_HISTORY.FIELDS.EDIT_TYPE')}
                value={currentData?.edit_type && t(`EDIT_TYPE.${currentData?.edit_type}`)}
                disabled
              />
            ) : (
              <SelectField
                data={initData?.edit_type.map((i) => ({ value: i.value, label: t(`EDIT_TYPE.${i?.value}`) })) || []}
                label={t('UPDATE_APS_HISTORY.FIELDS.EDIT_TYPE')}
                value={data?.edit_type}
                onChange={handleChange('edit_type')}
                error={error?.data?.edit_type}
                disabled={!data?.ap_type}
              />
            )}
          </Grid>
          {!uid && (
            <>
              <Grid item xs={12} md={6} lg={3}>
                <DatePicker
                  label={t('UPDATE_APS_HISTORY.FIELDS.PERIOD_BEGIN')}
                  value={data?.period_begin || null}
                  onChange={handleChange('period_begin')}
                  error={error?.data?.period_begin}
                />
              </Grid>
              {['AP_PROPERTIES', 'AP_COMPANIES', 'AP_MEASUREMENT_INTERVAL'].includes(data?.edit_type) && (
                <Grid item xs={12} md={6} lg={3}>
                  <DatePicker
                    label={t('UPDATE_APS_HISTORY.FIELDS.PERIOD_END')}
                    value={data?.period_end || null}
                    onChange={handleChange('period_end')}
                    error={error?.data?.period_end}
                  />
                </Grid>
              )}
            </>
          )}
        </Grid>
        <Grid container spacing={3} alignItems={'flex-start'} sx={{ mt: 1 }}>
          <Grid item xs={12} md={6} lg={3}>
            <StyledInput
              label={t('FIELDS.START_WORK_DATE')}
              value={currentData?.started_at && moment(currentData?.started_at).format('DD.MM.yyyy • HH:mm')}
              disabled
            />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <StyledInput
              label={t('FIELDS.FORMED_AT')}
              disabled
              value={currentData?.formed_at && moment(currentData?.formed_at).format('DD.MM.yyyy • HH:mm')}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <StyledInput
              label={t(`FIELDS.${getFinishedDateText()}`)}
              disabled
              value={currentData?.finished_at && moment(currentData?.finished_at).format('DD.MM.yyyy • HH:mm')}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={3}></Grid>
          <Grid item xs={12} md={6} lg={3}>
            <StyledInput
              label={t('FIELDS.USER_INITIATOR')}
              value={uid ? currentData?.initiator?.username : userName}
              disabled
            />
          </Grid>
          <Grid item xs={12} md={9}>
            <StyledInput
              label={t('FIELDS.INITIATOR_COMPANY_NAME')}
              value={uid ? currentData?.initiator_company?.short_name : companyName}
              disabled
            />
          </Grid>
          {uid && (
            <Grid item xs={12} md={6} lg={3}>
              <StyledInput label={t('UPDATE_APS_HISTORY.FIELDS.PERIOD')} value={currentData?.edit_period} disabled />
            </Grid>
          )}
          <Grid item xs={12}>
            <StyledInput
              label={t('FIELDS.JUSTIFICATION')}
              value={uid ? currentData?.description : data?.description}
              onChange={handleDescription}
              error={error?.data?.description || descriptionError}
              disabled={Boolean(uid)}
            />
          </Grid>
          {!currentData || currentData?.status === 'IN_PROCESS' ? (
            <Grid item xs={12} lg={3}>
              <Box style={{ display: 'flex', minWidth: 470, gap: 24 }}>
                <StyledInput
                  size={'small'}
                  value={currentData?.description_file_name}
                  label={`${t('UPDATE_APS_HISTORY.FIELDS.UPLOAD_FILE')}`}
                  shrink={true}
                  disabled
                />
                <input
                  accept={'.pdf,.png,.zip,.doc,.jpg,.rar'}
                  id={'process-file'}
                  type="file"
                  onChange={handleUploadFile}
                  disabled={currentData?.status !== 'IN_PROCESS' || isUploading}
                />
                <label htmlFor={'process-file'}>
                  <BlueButton
                    component="span"
                    data-marker={'upload_file_arg'}
                    style={{ whiteSpace: 'nowrap', padding: '11px 16px', borderRadius: 4 }}
                    disabled={currentData?.status !== 'IN_PROCESS' || isUploading}
                  >
                    <SearchRounded />
                    {t('CONTROLS.CHOOSE_FILE')}
                  </BlueButton>
                </label>
              </Box>
            </Grid>
          ) : (
            <Grid item xs={12} md={12} lg={3}>
              <StyledInput
                label={t('UPDATE_APS_HISTORY.FIELDS.UPLOAD_FILE')}
                value={currentData?.description_file_name}
                disabled
                endAdornment={
                  <InputAdornment position="end">
                    <CircleButton
                      type="download"
                      size="small"
                      title={t('CONTROLS.DOWNLOAD')}
                      onClick={handleDownloadFile}
                      disabled={!currentData?.description_file_uid}
                    />
                  </InputAdornment>
                }
              />
            </Grid>
          )}
          {currentData?.process_info && (
            <Grid item xs={24}>
              <Typography sx={{ color: 'text.secondary' }}>{currentData?.process_info}</Typography>
            </Grid>
          )}
        </Grid>
      </Box>

      {!uid && ['AP_PROPERTIES'].includes(data?.edit_type) && (
        <Box component={'section'} sx={styles.table}>
          <Typography component={'h4'} sx={{ ...styles.tableHeader, ...styles.tableTitle }}>
            {t('LIST_OF_CHARACTERISTICS_TO_CHANGE')}
          </Typography>
          <Box sx={styles.tableBody}>
            <AutocompleteWithChips
              reusedValue={currentData?.ap_properties || data?.ap_properties}
              defaultValue={
                data.edit_type === 'AP_MEASUREMENT_INTERVAL'
                  ? [{ label: 'Інтервал вимірювання (106-6)', value: '106-6' }]
                  : []
              }
              options={
                data.edit_type === 'AP_MEASUREMENT_INTERVAL'
                  ? AP_MEASUREMENT_INTERVAL_OPTIONS
                  : initData?.ap_properties || []
              }
              nameKey={'ap_properties'}
              label={t('FIELDS.CHARACTERISTICS_SHORT')}
              textNoMoreOption={t('NO_MORE_CAHRACTERISTICT_TO_SELECT')}
              handleChange={handleChange('ap_properties')}
            />
          </Box>
        </Box>
      )}
      {isPropsType && currentData?.status === 'IN_PROCESS' && <EditForm />}
      {isPropsType && currentData?.status !== 'IN_PROCESS' && (
        <PropertiesForm
          values={Object.fromEntries(currentData?.properties.map((i) => [i.code, i.value]) || [])}
          onChange={() => null}
          disabled
        />
      )}
      {!(verifyRole(['АТКО', 'СВБ']) && !currentData?.agree_person) &&
        currentData?.edit_type !== 'AP_COMPANIES' &&
        ['DONE', 'COMPLETED', 'PARTIALLY_DONE', 'REJECTED'].includes(currentData?.status) && (
          <Box className={'boxShadow'} sx={{ p: 3, mt: 2, mb: 2 }}>
            <Grid container spacing={3} alignItems={'flex-start'}>
              <Grid item xs={12} md={6}>
                <StyledInput label={t('FIELDS.APPROVED_BY')} value={currentData?.agree_person} disabled />
              </Grid>
              <Grid item xs={12} md={6} lg={3}>
                <StyledInput
                  label={t(
                    `UPDATE_APS_HISTORY.FIELDS.${currentData?.status === 'REJECTED' ? 'REJECTED_AT' : 'APPROVED_AT'}`
                  )}
                  value={
                    currentData?.agree_datetime && moment(currentData?.agree_datetime).format('DD.MM.yyyy • HH:mm')
                  }
                  disabled
                />
              </Grid>
              <Grid item xs={12}>
                <StyledInput
                  label={t(`FIELDS.JUSTIFICATION`)}
                  value={currentData?.agree_description}
                  disabled
                  dataMarker="agreeDescription"
                />
              </Grid>
            </Grid>
          </Box>
        )}
    </>
  );
};

export default DetailsTab;
