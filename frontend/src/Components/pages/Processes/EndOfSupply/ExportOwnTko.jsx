import Grid from '@mui/material/Grid';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import WarningRounded from '@mui/icons-material/WarningRounded';
import LinearProgress from '@mui/material/LinearProgress';
import makeStyles from '@material-ui/core/styles/makeStyles';
import moment from 'moment';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { checkPermissions } from '../../../../util/verifyRole';
import Page from '../../../Global/Page';
import CircleButton from '../../../Theme/Buttons/CircleButton';
import { LightTooltip } from '../../../Theme/Components/LightTooltip';
import Statuses from '../../../Theme/Components/Statuses';
import DatePicker from '../../../Theme/Fields/DatePicker';
import SelectField from '../../../Theme/Fields/SelectField';
import Autocomplete from '../../../Theme/Fields/Autocomplete';
import StyledInput from '../../../Theme/Fields/StyledInput';
import NotResultRow from '../../../Theme/Table/NotResultRow';
import { Pagination } from '../../../Theme/Table/Pagination';
import { StyledTable } from '../../../Theme/Table/StyledTable';
import SimpleImportModal from '../../../../Components/Modal/SimpleImportModal';
import { mainApi, useLazyMsFilesDownloadQuery } from '../../../../app/mainApi';
import {
  TAGS,
  useExportTkoQuery,
  useInitExportTkoMutation,
  useOrganizationsExportTkoQuery,
  useSettingsExportTkoQuery
} from './api';
import { useTranslation } from 'react-i18next';
import useExportFileLog from '../../../../services/actionsLog/useEportFileLog';
import { StyledSwitch } from '../../../Theme/Fields/StyledSwitch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { ModalWrapper } from '../../../Modal/ModalWrapper';
import { Stack, Typography } from '@mui/material';
import { BlueButton } from '../../../Theme/Buttons/BlueButton';
import { GreenButton } from '../../../Theme/Buttons/GreenButton';
import StickyTableHead from '../../../Theme/Table/StickyTableHead';

const useStyles = makeStyles(() => ({
  header: {
    fontSize: 16,
    fontWeight: 'normal',
    color: '#0D244D',
    lineHeight: 1.2,
    paddingBottom: 12,
    paddingTop: 18
  }
}));

const defaultSettings = {
  count: [{ label: 10000, value: 10000 }],
  search_by: [
    { label: 'BALANCE_SUPPLIER', value: 'BALANCE_SUPPLIER' },
    {
      label: 'ACCOUNTING_POINT',
      value: 'ACCOUNTING_POINT'
    }
  ],
  ap_type: 'INSTALLATION_AP',
  templates: {
    BALANCE_SUPPLIER: { label: 'ATKO_EXTENDED' },
    TKO_HISTORY_BY_CHANGE: { label: 'TKO_HISTORY_BY_CHANGE' },
    ATKO_EXTENDED: { label: 'ATKO_EXTENDED' },
    GUARANTEED_BS: { label: 'ATKO_EXTENDED' }
  }
};

export const EXPORT_OWN_TKO_ACCESS_ACCEPT_ROLES = [
  'АКО',
  'АКО_Процеси',
  'АКО_ППКО',
  'АКО_Користувачі',
  'АКО_Довідники',
  'АТКО',
  'СВБ',
  'ГарПок'
];

const ExportOwnTko = () => {
  const { t, i18n } = useTranslation();
  const { uid } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { full_name, activeOrganization } = useSelector(({ user }) => user);
  const [params, setParams] = useState({ page: 1, size: 25 });
  const [errors, setErrors] = useState(null);
  const [byCompany, setByCompany] = useState('');
  const [selectedOrganization, setSelectedOrganization] = useState('');
  const [organizationsParams, setOrganizationsParams] = useState({});
  const [openList, setOpenList] = useState(false);
  const [loadingSelect, setLoadingSelect] = useState(false);
  const [settings, setSettings] = useState(defaultSettings);
  const { uploading, error: uploadError } = useSelector(({ massLoad }) => massLoad);
  const [openDialog, setOpenDialog] = useState(false);
  const isLoadingSettings = useRef(false);
  const [isAttentionModalOpen, setIsAttentionModalOpen] = useState(false);

  const [initProcess, { error, isLoading }] = useInitExportTkoMutation();
  const [download] = useLazyMsFilesDownloadQuery();
  const exportFileLog = useExportFileLog(['Експорт власних ТКО']);

  const { data: organizations } = useOrganizationsExportTkoQuery(organizationsParams, {
    skip: Object.keys(organizationsParams).length === 0
  });
  const {
    data,
    currentData,
    error: notFound,
    isFetching,
    refetch
  } = useExportTkoQuery({ uid, params }, { skip: !uid });
  const { currentData: settingsData, isFetching: isSettings } = useSettingsExportTkoQuery(uid && { uid });

  const getAutocomplete = () => {
    let autocomplete = {};
    if (checkPermissions('PROCESSES.EXPORT_OWN_TKO.FUNCTIONS.CREATE_PROCESS_AS__BALANCE_SUPPLIER', 'СВБ')) {
      autocomplete = { type_report: 'BALANCE_SUPPLIER' };
    } else if (checkPermissions('PROCESSES.EXPORT_OWN_TKO.FUNCTIONS.CREATE_PROCESS_AS__TKO_HISTORY', 'АКО_Процеси')) {
      autocomplete = {
        type_report: 'TKO_HISTORY_BY_CHANGE',
        search_by: 'UPLOADED_FILE'
      };
    } else if (checkPermissions('PROCESSES.EXPORT_OWN_TKO.FUNCTIONS.CREATE_PROCESS_AS__GARPOK', 'ГарПок')) {
      autocomplete = {
        type_report: 'GUARANTEED_BS'
      };
    } else {
      autocomplete = { type_report: 'ATKO_EXTENDED' };
    }
    return {
      ...autocomplete,
      capacity: 10_000,
      ap_type: defaultSettings.ap_type,
      is_certified: true
    };
  };
  const [formData, setFormData] = useState(getAutocomplete());

  const INIT_PROCESS_BY_UPLOAD =
    formData.type_report === 'TKO_HISTORY_BY_VALIDITY' ||
    formData.type_report === 'TKO_HISTORY_BY_CHANGE' ||
    ((formData.type_report === 'ATKO_EXTENDED' ||
      formData.type_report === 'GUARANTEED_BS' ||
      formData.type_report === 'BALANCE_SUPPLIER') &&
      formData.search_by === 'UPLOADED_FILE');
  const IS_DISABLED_INIT = Boolean(
    ('date_from' in (settings.templates[formData?.type_report]?.fields || {}) &&
      (!formData?.period_info_from || formData?.period_info_from === 'Invalid date')) ||
      ('date_to' in (settings.templates[formData?.type_report]?.fields || {}) &&
        (!formData?.period_info_to || formData?.period_info_to === 'Invalid date')) ||
      moment(
        formData?.type_report === 'TKO_HISTORY_WHEN_ADD_PROP_CHANGED' && formData?.period_info_from
          ? moment(formData.period_info_from).add(1, 'months')
          : new Date('9999-12-31')
      ).isBefore(formData.period_info_to) ||
      (formData?.type_report === 'TKO_HISTORY_WHEN_ADD_PROP_CHANGED' &&
        moment(formData?.period_info_from).isAfter(formData?.period_info_to || moment().subtract('1', 'days'))) ||
      (formData?.type_report === 'TKO_HISTORY_WHEN_ADD_PROP_CHANGED' &&
        moment(formData?.period_info_from).isBefore(moment('2022-09-01')))
  );

  useEffect(() => {
    if (currentData) {
      setFormData((prev) => ({
        ...prev,
        type_report: currentData?.additional_data?.type_report,
        search_by: currentData?.additional_data?.search_by
      }));
    }
  }, [currentData]);

  useEffect(() => {
    if (settingsData) {
      setSettings(settingsData);

      if (!isLoadingSettings.current) {
        isLoadingSettings.current = true;
        const search_by = settingsData?.templates?.[formData?.type_report]?.fields?.search_by?.[0]?.value;
        if (search_by && !uid) setFormData((prev) => ({ ...prev, search_by }));
      }
    }
  }, [uid, settingsData, formData?.type_report]);

  useEffect(() => {
    if (!uid && data) {
      isLoadingSettings.current = false;
      dispatch(mainApi.util.invalidateTags([TAGS.EXPORT_TKO_SETTINGS]));
      setFormData(getAutocomplete());
    }
  }, [dispatch, uid, data]);

  useEffect(() => {
    if (error) {
      setErrors(Object.fromEntries(Object.entries(error?.data).map(([k, v]) => [k, String(v)])));
    } else {
      setErrors(null);
    }
    if (error?.status === 403 || notFound?.status === 403) {
      navigate('/processes');
    }
  }, [navigate, error, notFound]);

  useEffect(() => {
    if (organizations) {
      setLoadingSelect(false);
    }
  }, [organizations]);

  const handleDownload = ({ file_type, file_processed_id, file_id, file_name }) => {
    const fileId = file_type === 'MASS_EXPORT' || file_type === 'UPLOAD_EXPORT_TKO' ? file_processed_id : file_id;
    download({
      id: fileId,
      name: file_name
    });
    exportFileLog(uid);
  };

  const handleUpload = (body) => {
    if (formData.period_info_from) body.append('period_info_from', formData.period_info_from);
    if (formData.period_info_to) body.append('period_info_to', formData.period_info_to);
    if (formData.sign) body.append('sign', formData.sign);
    body.append('ap_type', formData.ap_type);
    body.append('type_report', formData.type_report);
    body.append('capacity', formData.capacity);
    body.append('search_by', formData.search_by);

    initProcess({ type: 'upload', body }).then((res) => {
      if (res?.data?.uid) {
        navigate(res.data.uid, { replace: true });
      }
    });
  };

  const handleForm = () => {
    const body = { ...formData, by_company: selectedOrganization?.eic };
    if (
      formData?.properties &&
      formData[formData.properties] &&
      settingsData?.fields?.properties?.[formData.properties]?.type === 'search_select'
    ) {
      const item = settingsData.fields.properties[formData.properties].list.find(
        (i) => i.label === formData[formData.properties]
      );
      if (item?.value) body[body.properties] = item.value;
    }
    initProcess({ type: '', body }).then((res) => {
      if (res?.data?.uid) {
        navigate(res.data.uid, { replace: true });
      }
    });
  };

  const handleCreateProcess = () => {
    if (formData?.sign) {
      setIsAttentionModalOpen(true);
    } else {
      handleForm();
    }
  };

  const handleApproveAttention = () => {
    setIsAttentionModalOpen(false);
    if (INIT_PROCESS_BY_UPLOAD) {
      setOpenDialog(true);
    } else {
      handleForm();
    }
  };

  const handleChangeForm = (value, name, isClearAdditionalInputs) => {
    const newData = { ...formData, [name]: value };
    if (name === 'type_report') {
      newData.search_by = settings?.templates?.[value]?.fields?.search_by?.[0]?.value;
    }
    if (name === 'properties') {
      delete newData[newData.properties];
    }
    if (isClearAdditionalInputs) {
      delete newData[newData.properties];
      delete newData.properties;
    }
    setFormData(newData);
  };

  const handleOnChange = ({ target }) => {
    setByCompany(target.value);
    setSelectedOrganization(null);

    if (target.value.length >= 3) {
      const params = {
        limit: 50,
        any_info: target.value,
        role: formData.search_by === 'BALANCE_SUPPLIER' ? 'BalanceSupplier' : 'MeteringPointAdministrator'
      };

      setLoadingSelect(true);
      setOpenList(true);
      setOrganizationsParams(params);
    } else {
      setOpenList(false);
    }
  };

  const onSelectOrg = (org) => {
    setSelectedOrganization(org);
    setByCompany(org.short_name);
    setOpenList(false);
  };

  const inputField = (field) => {
    const gridSize = field.name === 'properties' ? { md: 4, lg: 2 } : { md: 4 };
    if (field.name === 'payment_type') gridSize.md = 5;
    const label = field.name.toUpperCase();
    const localizedLabel = i18n.exists(`EXPORT_OWN_TKO_FIELDS.${label}`)
      ? t(`EXPORT_OWN_TKO_FIELDS.${label}`)
      : field.name;
    let list = field.list;
    if (['payment_type', 'settlement_method', 'type_of_accounting_point', 'properties'].includes(field.name)) {
      list = field.list.map((item) => {
        let itemLabel = `${label}_LIST.${item.value?.toUpperCase()}`;
        return { value: item.value, label: i18n.exists(itemLabel) ? t(itemLabel) : item.value };
      });
    }
    if (field.type === 'select') {
      let value = currentData?.additional_data?.[field.name];
      if (currentData?.additional_data?.properties === field.name) {
        value = currentData?.additional_data?.original_property_value;
      }
      return (
        <Grid item xs={12} {...gridSize} key={field.name}>
          <SelectField
            label={localizedLabel}
            data={list}
            dataMarker={field.name}
            value={uid ? value : formData?.[field.name]}
            onChange={(v) => handleChangeForm(v, field.name)}
            disabled={Boolean(uid)}
            error={error?.data?.[field.name]}
            ignoreI18
          />
        </Grid>
      );
    }
    return (
      <Grid item xs={12} {...gridSize} key={field.name}>
        <Autocomplete
          label={localizedLabel}
          dataMarker={field.name}
          defaultValue={
            uid &&
            settingsData?.fields?.properties[field.name]?.list?.find(
              (i) => i.value === currentData?.additional_data?.[field.name]
            )?.label
          }
          list={list}
          onChange={(v) => handleChangeForm(v?.value, field.name)}
          error={error?.data?.[field.name]}
          disabled={Boolean(uid)}
        />
      </Grid>
    );
  };

  const additionalInputs = () => {
    if ((uid && !currentData?.additional_data) || !settingsData?.fields) return;
    const fields = [];
    const dataList = uid ? currentData.additional_data : formData;
    for (const name in dataList) {
      if (name in settingsData.fields && dataList[name] in settingsData.fields[name]) {
        fields.push(inputField(settingsData.fields[name][dataList[name]]));
      }
    }
    return fields;
  };

  return (
    <Page
      acceptPermisions={uid ? 'PROCESSES.EXPORT_OWN_TKO.ACCESS' : 'PROCESSES.EXPORT_OWN_TKO.INITIALIZATION'}
      acceptRoles={uid ? EXPORT_OWN_TKO_ACCESS_ACCEPT_ROLES : ['АТКО', 'СВБ', 'АКО_Процеси', 'ГарПок']}
      faqKey={'PROCESSES__EXPORT_TKO'}
      pageName={currentData?.id ? t('PAGES.EXPORT_OWN_TKO_ID', { id: currentData?.id }) : t('PAGES.EXPORT_OWN_TKO')}
      backRoute={'/processes'}
      notFoundMessage={notFound && t('REQUEST_NOT_FOUND')}
      loading={isLoading || isSettings || isFetching || uploading}
      controls={
        currentData?.can_start ||
        currentData?.status === 'FORMED' ||
        currentData?.status === 'DONE' ||
        (!uid &&
          checkPermissions('PROCESSES.EXPORT_OWN_TKO.CONTROLS.CREATE', ['СВБ', 'АКО_Процеси', 'АТКО', 'ГарПок']) && (
            <>
              {INIT_PROCESS_BY_UPLOAD && (
                <CircleButton
                  type={'upload'}
                  onClick={() => (formData?.sign ? setIsAttentionModalOpen(true) : setOpenDialog(true))}
                  title={t('CONTROLS.DOWNLOADING_FILE')}
                  disabled={IS_DISABLED_INIT}
                />
              )}
              {!INIT_PROCESS_BY_UPLOAD && (
                <CircleButton
                  type={'create'}
                  onClick={handleCreateProcess}
                  title={t('CONTROLS.FORM')}
                  disabled={IS_DISABLED_INIT}
                />
              )}
            </>
          ))
      }
    >
      <Statuses statuses={['NEW', 'FORMED', 'DONE']} currentStatus={currentData?.status || 'NEW'} />
      <div className={'boxShadow'} style={{ padding: 24, marginTop: 16 }}>
        <Grid container spacing={3} alignItems={'flex-start'}>
          <Grid item xs={12} lg={4}>
            <StyledInput
              label={t('FIELDS.USER_INITIATOR')}
              readOnly
              value={uid ? currentData?.executor?.username : full_name}
            />
          </Grid>
          <Grid item xs={12} lg={3}>
            <StyledInput
              label={t('FIELDS.EIC_CODE_TYPE_X_OF_INITIATOR')}
              readOnly
              value={uid ? currentData?.eic : activeOrganization?.eic}
            />
          </Grid>
          <Grid item xs={12} lg={2}>
            <StyledInput
              label={t('FIELDS.USREOU')}
              readOnly
              value={uid ? currentData?.usreou : activeOrganization?.usreou}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <StyledInput
              label={t('FIELDS.FORMED_AT')}
              readOnly
              value={currentData?.created_at && moment(currentData?.created_at).format('DD.MM.yyyy • HH:mm')}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <StyledInput
              label={t('FIELDS.COMPLETE_DATETIME')}
              readOnly
              value={currentData?.finished_at && moment(currentData?.finished_at).format('DD.MM.yyyy • HH:mm')}
            />
          </Grid>
          <Grid item xs={12}>
            <StyledInput
              label={t('FIELDS.INITIATOR_COMPANY')}
              readOnly
              value={uid ? currentData?.executor_company?.short_name : activeOrganization?.name}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <SelectField
              label={t('FIELDS.TEMPLATES')}
              data={Object.entries(settings.templates)
                .map(([value]) => ({
                  label: value,
                  value
                }))
                .sort((a, b) => (b.label > a.label ? 1 : -1))}
              value={uid ? currentData?.additional_data?.type_report : formData?.type_report}
              onChange={(v) => handleChangeForm(v, 'type_report', true)}
              disabled={Boolean(uid)}
              dataMarker={'type_report'}
            />
          </Grid>
          {settings.templates[formData?.type_report]?.fields?.ap_type !== undefined && (
            <Grid item xs={12} md={4} lg={2}>
              <SelectField
                label={t('FIELDS.AP_TYPE')}
                value={uid ? currentData?.additional_data?.ap_type : formData?.ap_type}
                data={
                  settings?.templates?.[formData?.type_report]?.fields?.ap_type?.map(({ value }) => ({
                    value,
                    label: `PLATFORM.${value}`
                  })) || []
                }
                onChange={(v) => handleChangeForm(v, 'ap_type')}
                disabled={Boolean(uid)}
                dataMarker={'ap_type'}
              />
            </Grid>
          )}
          {settings.templates[formData?.type_report]?.fields?.count !== undefined && (
            <Grid item xs={12} md={4} lg={2}>
              <SelectField
                label={t('FIELDS.CAPACITY')}
                value={uid ? currentData?.additional_data?.capacity : formData?.capacity}
                data={settings.templates[formData?.type_report]?.fields?.count}
                onChange={(v) => handleChangeForm(v, 'capacity')}
                disabled={Boolean(uid)}
                dataMarker={'capacity'}
              />
            </Grid>
          )}
          {settings.templates[formData?.type_report]?.fields?.search_by !== undefined &&
            formData?.type_report !== 'TKO_HISTORY' && (
              <Grid item xs={12} md={4} lg={2}>
                <SelectField
                  label={t('FIELDS.SEARCH_BY')}
                  value={uid ? currentData?.additional_data?.search_by : formData.search_by}
                  error={errors?.search_by}
                  data={settings.templates[formData?.type_report]?.fields.search_by?.map(({ value }) => ({
                    value,
                    label: `EXPORT_OWN_TKO_SEARCH_BY.${value}`
                  }))}
                  onChange={(v) => handleChangeForm(v, 'search_by', true)}
                  disabled={Boolean(uid)}
                  dataMarker={'search_by'}
                />
              </Grid>
            )}
          {settingsData?.sign && (
            <Grid
              item
              xs={12}
              md={4}
              lg={2}
              sx={{
                mt: 0.875
              }}
            >
              <FormControlLabel
                control={
                  <StyledSwitch
                    data-marker={`swich-sign`}
                    disabled={Boolean(uid)}
                    checked={uid ? Boolean(currentData?.additional_data?.sign) : Boolean(formData?.sign)}
                    onChange={(v) => handleChangeForm(v.target.checked, 'sign')}
                  />
                }
                label={t('FIELDS.DIGITAL_SIGNATURE')}
              />
            </Grid>
          )}

          {additionalInputs()}
          {settings.templates[formData?.type_report]?.fields?.date_from !== undefined && (
            <Grid item xs={12} md={4} lg={2}>
              <DatePicker
                label={t('FIELDS.PERIOD_FROM')}
                value={uid ? currentData?.additional_data?.period_info_from : formData.period_info_from}
                maxDate={formData?.period_info_to || moment().subtract('1', 'days')}
                minDate={formData?.type_report === 'TKO_HISTORY_WHEN_ADD_PROP_CHANGED' ? moment('2022-09-01') : false}
                onChange={(d) => handleChangeForm(moment(d).startOf('day').utc().format(), 'period_info_from')}
                error={errors?.period_info_from}
                disabled={Boolean(uid)}
                required
              />
            </Grid>
          )}
          {settings.templates[formData?.type_report]?.fields?.date_to !== undefined && (
            <Grid item xs={12} md={4} lg={2}>
              <DatePicker
                label={t('FIELDS.PERIOD_TO')}
                value={uid ? currentData?.additional_data?.period_info_to : formData.period_info_to}
                minDate={
                  formData?.type_report === 'TKO_HISTORY_WHEN_ADD_PROP_CHANGED'
                    ? moment('2022-09-01')
                    : formData?.period_info_from
                    ? moment(formData.period_info_from)
                    : false
                }
                maxDate={
                  formData?.type_report === 'TKO_HISTORY_WHEN_ADD_PROP_CHANGED' && formData?.period_info_from
                    ? moment(formData.period_info_from).add(1, 'months')
                    : new Date('9999-12-31')
                }
                onChange={(d) => handleChangeForm(moment(d).startOf('day').utc().format(), 'period_info_to')}
                error={errors?.period_info_to}
                disabled={Boolean(uid)}
                required
              />
            </Grid>
          )}

          {(formData?.type_report === 'TKO_HISTORY' ||
            formData?.type_report === 'TKO_HISTORY_BY_CHANGE' ||
            formData?.type_report === 'TKO_HISTORY_BY_VALIDITY') && (
            <>
              {checkPermissions('PROCESSES.EXPORT_OWN_TKO.FIELDS.TKO_LIST', ['СВБ', 'АТКО', 'АКО...']) &&
                formData?.search_by === 'ACCOUNTING_POINT' && (
                  <Grid item xs={12}>
                    <StyledInput
                      dataMarker={'ap-list'}
                      label={t('FIELDS.AP_LIST')}
                      value={uid ? currentData?.additional_data?.by_tko_eic?.join(', ') : formData?.by_tko_eic}
                      error={errors?.by_tko_eic}
                      readOnly={Boolean(uid)}
                      onChange={(e) => {
                        handleChangeForm(e.target.value, 'by_tko_eic');
                      }}
                    />
                  </Grid>
                )}
              {((checkPermissions('PROCESSES.EXPORT_OWN_TKO.FIELDS.SELECT_ATKO', ['СВБ', 'АКО...']) &&
                formData?.search_by === 'ATKO') ||
                (checkPermissions('PROCESSES.EXPORT_OWN_TKO.FIELDS.SELECT_SUPPLIER', ['АТКО', 'АКО...']) &&
                  formData?.search_by === 'BALANCE_SUPPLIER')) && (
                <Grid item xs={12}>
                  <div className={'drop-down-menu'}>
                    <StyledInput
                      dataMarker={'by-company-select'}
                      label={formData?.search_by === 'ATKO' ? t('FIELDS.SELECT_ATKO') : t('FIELDS.SELECT_SUPPLIER')}
                      value={uid ? currentData?.by_company : byCompany}
                      error={errors?.by_company}
                      readOnly={Boolean(uid)}
                      onChange={handleOnChange}
                    />
                    <div className={`drop-down ${openList ? 'open' : ''}`} role={'listbox'}>
                      {loadingSelect ? (
                        <LinearProgress sx={{ backgroundColor: '#abb4cf', '>span': { backgroundColor: '#223B82' } }} />
                      ) : organizations?.length === 0 ? (
                        <div className={'empty'}>{t('ORGANIZATION_NOT_FOUND')}</div>
                      ) : (
                        <div className={'supplier-list'}>
                          {organizations?.map((org) => (
                            <div key={org.uid} className={'supplier-list--item'} onClick={() => onSelectOrg(org)}>
                              {org.short_name}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </Grid>
              )}
            </>
          )}

          {/*<Grid item xs={12} md={6} lg={3}>*/}
          {/*  <SelectField*/}
          {/*    label={'Тип ТКО'}*/}
          {/*    value={uid ? currentData?.additional_data?.is_certified?.toString() : valueSelect.is_certified}*/}
          {/*    data={[*/}
          {/*      { label: 'Сертифіковані ТКО', value: 'true' },*/}
          {/*      { label: 'Не сертифіковані ТКО', value: 'false' }*/}
          {/*    ]}*/}
          {/*    disabled={verifyRole(['СВБ']) || Boolean(uid)}*/}
          {/*    onChange={(v) => handleChangeForm(v, 'is_certified')}*/}
          {/*  />*/}
          {/*</Grid>*/}
        </Grid>
      </div>
      {uid && (
        <UploadedFilesTable
          files={currentData?.files?.data || []}
          handleDownload={handleDownload}
          handleUpdateList={refetch}
        />
      )}
      {uid && (
        <Pagination
          {...currentData?.files}
          loading={isFetching}
          params={params}
          onPaginate={(v) => setParams({ ...params, ...v })}
        />
      )}
      <SimpleImportModal
        title={t('IMPORT_AP_FILES')}
        openUpload={openDialog}
        canUploadWithoutKey
        setOpenUpload={setOpenDialog}
        handleUpload={(formData, handleClose) => {
          handleUpload(formData);
          handleClose();
        }}
        layoutList={[
          {
            key: 'file_original',
            label: t('IMPORT_FILE.SELECT_FILE_WITH_AP_INFORMAT', { format: '.xls, .xlsx, .xlsm' }),
            accept: '.xls,.xlsx,.xlsm',
            maxSize: 15000000,
            sizeError: t('VERIFY_MSG.MAX_FILE_SIZE', { size: 15 })
          }
        ]}
        uploading={uploading}
        error={uploadError}
      />
      <ModalWrapper open={isAttentionModalOpen}>
        <Typography>{t('MODALS.REPORT_NOTICE', { date: moment().format('HH:mm DD.MM.YYYY') })}</Typography>
        <Stack direction={'row'} sx={{ pt: 3 }} justifyContent={'space-between'} spacing={3}>
          <BlueButton onClick={() => setIsAttentionModalOpen(false)} fullWidth>
            {t('CONTROLS.NO')}
          </BlueButton>
          <GreenButton onClick={handleApproveAttention} fullWidth>
            {t('CONTROLS.YES')}
          </GreenButton>
        </Stack>
      </ModalWrapper>
    </Page>
  );
};

const UploadedFilesTable = ({ files, handleDownload, handleUpdateList }) => {
  const { t } = useTranslation();
  const classes = useStyles();

  return (
    <>
      <h3 className={classes.header}>{t('LIST_OF_GENERATED_FILES')}:</h3>
      <StyledTable>
        <StickyTableHead>
          <TableRow>
            <TableCell style={{ minWidth: 122 }} className={'MuiTableCell-head'}>
              {t('FIELDS.GENERATE_FILE_DATE')}
            </TableCell>
            <TableCell style={{ minWidth: 100 }} className={'MuiTableCell-head'}>
              {t('FIELDS.FILENAME')}
            </TableCell>
            <TableCell style={{ minWidth: 410 }} colSpan={4} className={'MuiTableCell-head'}>
              {t('FIELDS.AP_COUNT_IN_FILE')}
            </TableCell>
          </TableRow>
        </StickyTableHead>
        <TableBody>
          {files.length === 0 ? (
            <NotResultRow text={t('NO_AVAILABLE_AP')} span={6} small />
          ) : (
            files.map((file) => (
              <UploadedFilesRow
                key={file.uid}
                {...file}
                handleDownloadFile={() => handleDownload(file)}
                handleUpdateList={handleUpdateList}
              />
            ))
          )}
        </TableBody>
      </StyledTable>
    </>
  );
};

const UploadedFilesRow = ({
  created_at,
  file_name,
  all_tko_count,
  success,
  failed,
  status,
  file_type,
  handleDownloadFile,
  handleUpdateList
}) => {
  const { t } = useTranslation();
  return (
    <>
      <TableRow data-marker={'table-row'} className={'body__table-row'}>
        <TableCell data-marker={'created_at'}>
          {created_at ? moment(created_at).format('DD.MM.yyyy • HH:mm') : ''}
        </TableCell>
        <TableCell data-marker={'file_name'}>{file_name || ''}</TableCell>
        {file_type === 'UPLOAD_EXPORT_TKO' ? (
          <>
            <TableCell data-marker={'all_tko_count'}>
              {t('IN_TOTAL')}: {all_tko_count || 0}
            </TableCell>
            <TableCell data-marker={'success'}>
              <span className={'success'}>
                {t('FILE_PROCESSING_STATUSES.DONE')}: {success || 0}
              </span>
            </TableCell>
            <TableCell data-marker={'failed'}>
              <span className={'danger'}>
                {t('NOT_DOWNLOADED')}: {failed || 0}
              </span>
            </TableCell>
          </>
        ) : (
          <TableCell data-marker={'all_tko_count'} style={{ minWidth: 410 }} colSpan={3}>
            {all_tko_count || 0}
          </TableCell>
        )}
        <TableCell data-marker={'status'} style={{ position: 'relative' }}>
          {(status === 'FAILED' || status === 'BAD_FILE_STRUCTURE') && (
            <LightTooltip
              title={
                status === 'BAD_FILE_STRUCTURE'
                  ? t('FILE_PROCESSING_STATUSES.BAD_FILE_STRUCTURE')
                  : t('FILE_PROCESSING_STATUSES.FAILED')
              }
              arrow
              disableTouchListener
              disableFocusListener
            >
              <WarningRounded
                style={{
                  color: '#f90000',
                  fontSize: 22,
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  cursor: 'pointer'
                }}
              />
            </LightTooltip>
          )}
          {file_name && status !== 'FAILED' && status !== 'BAD_FILE_STRUCTURE' && (
            <CircleButton
              type={status === 'IN_PROCESS' ? 'loading' : 'download'}
              size={'small'}
              onClick={status === 'IN_PROCESS' ? handleUpdateList : handleDownloadFile}
              title={status === 'IN_PROCESS' ? `${t('FILE_PROCESSING')}...` : t('DOWNLOAD_RESULT')}
            />
          )}
        </TableCell>
      </TableRow>
    </>
  );
};

export default ExportOwnTko;
