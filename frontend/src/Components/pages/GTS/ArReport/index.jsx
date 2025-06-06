import Grid from '@mui/material/Grid';
import { useEffect, useMemo, useState } from 'react';
import moment from 'moment';
import Page from '../../../Global/Page';
import CircleButton from '../../../Theme/Buttons/CircleButton';
import { useTranslation } from 'react-i18next';
import SelectField from '../../../Theme/Fields/SelectField';
import DatePicker from '../../../Theme/Fields/DatePicker';
import {
  useArGTSReportSettingsQuery,
  useCreateArGTSReportFileMutation,
  useIntiArGTSReportFileMutation,
  useUploadArGTSReportFileMutation
} from '../api';
import SimpleImportModal from '../../../Modal/SimpleImportModal';
import { useLazyMsFilesDownloadQuery } from '../../../../app/mainApi';
import StyledInput from '../../../Theme/Fields/StyledInput';
import AsyncAutocomplete from '../../../Theme/Fields/AsyncAutocomplete';
import { useNavigate } from 'react-router-dom';
import PaperWithAppBar from '../../../Theme/Components/PaperWithAppBar';
import VersionsByPeriod from '../../../../features/versionsByPeriod';

const MIN_DATE = moment('2019-07-01');

const SettingReport = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [params, setParams] = useState({});
  const [openUpload, setOpenUpload] = useState(false);
  const [fromDateError, setFromDateError] = useState(null);
  const [toDateError, setToDateError] = useState(null);

  const { data: settings, isFetching } = useArGTSReportSettingsQuery();
  const [uploadFile, { data: uploadData, isLoading: uploading, error: uploadError }] =
    useUploadArGTSReportFileMutation();
  const [init, { data: initData, isLoading: initing, error: initError }] = useIntiArGTSReportFileMutation();
  const [create, { isLoading: creating, error: createError }] = useCreateArGTSReportFileMutation();
  const [downloadFile] = useLazyMsFilesDownloadQuery();

  useEffect(() => {
    if (!settings) return;
    const defaultParams = {};

    settings.forEach((item) => {
      defaultParams[item.key] = item.default;
    });
    setParams(defaultParams);
  }, [settings]);

  const validFilters = useMemo(() => {
    let requiredParams = { ...params };
    delete requiredParams.metering_grid_area__eic;
    delete requiredParams.balance_supplier__eic;
    if (params.report_type === 'BY_LAST_RELEASE') {
      delete requiredParams.version;
    } else requiredParams.version = params.version;

    const pEntries = Object.entries(requiredParams);
    if (
      moment(params?.period_from).isAfter(moment()) ||
      moment(params?.period_to).isAfter(moment()) ||
      moment(params?.period_from).isBefore(MIN_DATE) ||
      moment(params?.period_to).isBefore(MIN_DATE) ||
      moment(params?.period_from).isAfter(moment(params?.period_to)) ||
      moment(params?.period_to).subtract(1, 'month').isAfter(params?.period_from)
    ) {
      return false;
    }
    return pEntries.filter((i) => !i[1]).length === 0;
  }, [params]);

  const handleFilterChange = (id) => (value) => {
    setParams({ ...params, [id]: value });
  };

  const handleCreateReport = (uid, body) => {
    create({ uid, body }).then((res) => {
      if (!res?.error) navigate('/gts/reports');
    });
  };

  const handleCreate = () => {
    const body = params.report_type === 'BY_LAST_RELEASE' ? { ...params, version: undefined } : params;
    if (initData?.uid) {
      handleCreateReport(initData?.uid, body);
      return;
    }

    init({ report_type: params.report_type }).then((res) => {
      if (res?.data?.uid) handleCreateReport(res?.data?.uid, body);
    });
  };

  const handleInitReport = () => {
    init({ report_type: params.report_type }).then((res) => {
      if (res?.data?.uid) setOpenUpload(true);
    });
  };

  const handleDateError = (name, error) => {
    if (name === 'period_from') setFromDateError(error);
    if (name === 'period_to') setToDateError(error);
  };

  return (
    <Page
      acceptPermisions={'GTS.REPORTS.CONTROLS.CREATE_AR_REPORT'}
      acceptRoles={['АР (перегляд розширено)']}
      pageName={t('PAGES.CREATE_GTS_REPORT')}
      backRoute={'/gts/reports'}
      loading={isFetching || initing || creating}
      controls={
        <>
          <CircleButton
            type={'upload'}
            component="span"
            title={t('CONTROLS.IMPORT_FILE')}
            disabled={!validFilters}
            onClick={handleInitReport}
          />
          <CircleButton
            type={'new'}
            title={t('CONTROLS.CREATE_REPORT')}
            disabled={initData?.uid ? uploadData?.count_fails_z > 0 || !validFilters : !validFilters}
            onClick={handleCreate}
          />
        </>
      }
    >
      <PaperWithAppBar header={t('FILTERS')}>
        <Grid container spacing={3}>
          {settings?.map((setting) => {
            if (setting.key === 'version') return null;
            return (
              <Grid item xs={12} sm={6} md={3} key={setting.key}>
                {getFields(
                  setting,
                  params,
                  handleFilterChange,
                  initError?.data?.[setting.key]?.[0] || createError?.data?.[setting.key]?.[0],
                  handleDateError
                )}
              </Grid>
            );
          })}
          {params.report_type !== 'BY_LAST_RELEASE' && settings?.some((i) => i.key === 'version') && (
            <Grid item xs={12} sm={6} md={3}>
              <VersionsByPeriod
                label={t('FIELDS.VERSION')}
                useEmptySting
                value={params.version}
                onChange={handleFilterChange('version')}
                from_date={params.period_from}
                to_date={params.period_to}
                datesError={{ from: fromDateError, to: toDateError }}
                useNull
              />
            </Grid>
          )}
        </Grid>
      </PaperWithAppBar>
      <SimpleImportModal
        title={t('IMPORT_AP_FILES')}
        openUpload={openUpload}
        setOpenUpload={setOpenUpload}
        canUploadWithoutKey
        handleUpload={(formData, handleClose) => {
          uploadFile({ uid: initData.uid, body: formData }).then((res) => {
            if (res?.data?.file_processed_id) {
              downloadFile({ id: res?.data?.file_processed_id, name: res?.data?.file_original_name });
            }
            handleClose();
          });
        }}
        layoutList={[
          {
            key: 'file_original',
            label: t('IMPORT_FILE.SELECT_FILE_WITH_AP_INFORMAT', { format: '.xlsx, .xlsm' }),
            accept: '.xlsx,.xlsm',
            maxSize: 15000000,
            sizeError: t('VERIFY_MSG.MAX_FILE_SIZE', { size: 15 })
          }
        ]}
        uploading={uploading}
        error={uploadError}
      />
    </Page>
  );
};

export default SettingReport;

const getFields = (setting, params, onChange, error, handleDateError) => {
  const { key: name, values: options, label, type, api_path: apiPath } = setting;
  switch (type) {
    case 'text':
      return (
        <Input name={name} label={label} int={type === 'int'} error={error} value={params[name]} onChange={onChange} />
      );
    case 'search':
      return (
        <SearchInput label={label} name={name} apiPath={apiPath} error={error} params={params} onChange={onChange} />
      );
    case 'select':
      return (
        <SelectField
          label={label}
          data={options || []}
          value={params[name]}
          dataMarker={name}
          error={error}
          onChange={onChange(name)}
        />
      );
    case 'datetime':
      return (
        <DatePicker
          label={label}
          value={params[name]}
          onChange={onChange(name)}
          onError={(e) => handleDateError(name, e)}
          maxDate={
            name === 'period_from'
              ? moment()
              : params?.period_from &&
                moment(params?.period_from).add(1, 'month') < moment() &&
                moment(params?.period_from).isSameOrAfter(MIN_DATE)
              ? moment(params?.period_from).add(1, 'month')
              : moment()
          }
          minDate={
            name === 'period_from'
              ? MIN_DATE
              : params?.period_from &&
                moment(params?.period_from).isSameOrAfter(MIN_DATE) &&
                moment(params?.period_to).isSameOrBefore(moment())
              ? params?.period_from
              : MIN_DATE
          }
          error={error}
        />
      );
    default:
      return (
        <StyledInput
          label={label}
          value={params[name]}
          onChange={(e) => onChange(name)(e.target.value)}
          error={error}
        />
      );
  }
};

const Input = ({ label, name, int, error, onChange, value }) => {
  const handleOnChange = ({ target: { value } }) => {
    if (value && int && !/^\d+$/.test(value)) {
      return;
    }
    onChange(name)(value);
  };

  return <StyledInput label={label} value={value} onChange={handleOnChange} error={error} />;
};

const SearchInput = ({ label, name, error, onChange, apiPath, params }) => {
  const value = params[name];

  const handleChange = (value) => {
    onChange(name)(value?.map((v) => v.value));
  };

  return (
    <AsyncAutocomplete
      label={label}
      value={value ?? []}
      onSelect={handleChange}
      error={error}
      apiPath={'searchReportByParams'}
      searchBy={'value'}
      dataMarker={name}
      searchStart={3}
      multiple
      disablePortal={false}
      freeSolo={false}
      isOptionEqualToValue={(o, v) => o.value === v.value}
      ChipProps={{ size: 'small', sx: { height: '17px', margin: '1px 0 0 0 !important' } }}
      searchParams={{ apiPath, name }}
      filterOptions={(items, { inputValue }) => {
        inputValue = inputValue.trim()?.toLocaleLowerCase();
        return items.filter((i) => i.label?.toLocaleLowerCase().includes(inputValue));
      }}
    />
  );
};
