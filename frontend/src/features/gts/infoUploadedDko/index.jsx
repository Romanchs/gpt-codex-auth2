import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import DoneRounded from '@mui/icons-material/DoneRounded';
import moment from 'moment';
import { useEffect, useMemo, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';

import Page from '../../../Components/Global/Page';
import StyledInput from '../../../Components/Theme/Fields/StyledInput';
import DatePicker from '../../../Components/Theme/Fields/DatePicker';
import CircleButton from '../../../Components/Theme/Buttons/CircleButton';
import { GreenButton } from '../../../Components/Theme/Buttons/GreenButton';
import { useFileInfoUploadedDkoMutation, useLazyInfoUploadedDkoQuery } from './api';
import { useFilterStyles } from '../../../Components/pages/GTS/filterStyles';
import SelectField from '../../../Components/Theme/Fields/SelectField';
import { useLazyMsFilesDownloadQuery } from '../../../app/mainApi';
import i18n from '../../../i18n/i18n';
import { useTranslation } from 'react-i18next';
import useExportFileLog from '../../../services/actionsLog/useEportFileLog';
import useViewCallbackLog from '../../../services/actionsLog/useViewCallbackLog';
import useSearchLog from '../../../services/actionsLog/useSearchLog';
import { GTS_LOG_TAGS } from '../../../services/actionsLog/constants';
import InnerDataTable from './InnerDataTable';

const columns = [
  { id: 'full_name', label: i18n.t('FIELDS.USER_FULL_NAME'), minWidth: 150 },
  { id: 'org_name', label: i18n.t('FIELDS.PPKO_NAME'), minWidth: 250 },
  { id: 'eic_x', label: i18n.t('FIELDS.EIC_X_PPKO'), minWidth: 100 },
  {
    id: 'start_period',
    label: i18n.t('FIELDS.PERIOD_FROM'),
    dateFormat: 'yyyy-MM-DD',
    minWidth: 80,
    renderBody: (start_period) => start_period && moment(start_period).format('DD.MM.yyyy')
  },
  {
    id: 'end_period',
    label: i18n.t('FIELDS.PERIOD_TO'),
    dateFormat: 'yyyy-MM-DD',
    minWidth: 80,
    renderBody: (end_period) => end_period && moment(end_period).format('DD.MM.yyyy')
  },
  {
    id: 'upload_at',
    label: i18n.t('FIELDS.SAVE_DATE'),
    dateFormat: 'yyyy-MM-DD',
    minWidth: 100,
    renderBody: (upload_at) => upload_at && moment(upload_at).format('DD.MM.yyyy • HH:mm')
  },
  { id: 'file_name', label: i18n.t('FIELDS.FILENAME'), minWidth: 100 }
];

const InfoUploadedDko = () => {
  const { t } = useTranslation();
  const { mp } = useParams();
  const { state } = useLocation();
  const classes = useFilterStyles();

  const [filters, setFilters] = useState({
    product_type: 'active',
    mp,
    start_at: state?.filters?.period_from ? moment(state.filters.period_from ).format('yyyy-MM-DD') : null,
    end_at: state?.filters?.period_to ? moment(state.filters.period_to ).format('yyyy-MM-DD') : null
  });
  const [params, setParams] = useState({});

  const [getData, { currentData, error, isFetching, isUninitialized }] = useLazyInfoUploadedDkoQuery();
  const [getFile, { error: downloadError, reset }] = useFileInfoUploadedDkoMutation();
  const exportFileLog = useExportFileLog(GTS_LOG_TAGS);
  const [downloadFile] = useLazyMsFilesDownloadQuery();

  const viewLog = useViewCallbackLog(GTS_LOG_TAGS);
  const searchLog = useSearchLog(GTS_LOG_TAGS);

  useEffect(() => viewLog(), []);

  const maxPeriodDate = moment().subtract('1', 'days');
  const innerColumns = [
    ...columns,

    {
      id: 'release',
      width: 65,
      minWidth: 65,
      renderHead: () => (
        <>
          <Box component="p">{t('FIELDS.RELEASE')}</Box>
          <input
            type="number"
            value={params?.release || ''}
            onChange={(event) => handleChange({ release: event.target.value || undefined })}
          />
        </>
      )
    },
    {
      id: 'download',
      width: 65,
      minWidth: 65,
      align: 'center',
      marker: 'action',
      renderHead: () => null,
      renderBody: (...args) => (
        <CircleButton
          type={'download'}
          size={'small'}
          onClick={() => {
            downloadFile({ id: args[1].file_id, name: args[1].file_name });
            exportFileLog();
          }}
          title={t('DOWNLOAD_RESULT')}
        />
      )
    }
  ];

  const isValidFilters = useMemo(() => {
    if (!filters.mp) return false;
    const from = filters.start_at;
    const to = filters.end_at;
    if (!from || !to) return false;
    if (from === 'Invalid date' || to === 'Invalid date') return false;
    if (moment(from).isAfter(to)) return false;
    if (moment(maxPeriodDate).isBefore(from) || moment(maxPeriodDate).isBefore(to)) return false;
    return true;
  }, [maxPeriodDate, filters.mp, filters.start_at, filters.end_at]);

  const handleOnChangeFilters = (filter) => {
    return (value) => {
      reset();
      switch (filter) {
        case 'start_at':
        case 'end_at':
          setFilters({ ...filters, [filter]: (value && moment(value).format('yyyy-MM-DD')) || value || undefined });
          break;
        default:
          setFilters({ ...filters, [filter]: value.target?.value ?? value });
      }
    };
  };

  const handleChange = (params) => {
    const { page, ...rest } = params;
    setParams(rest);
    if (isUninitialized) return;
    getData({ ...filters, ...rest });
    searchLog();
  };

  const handleApply = () => {
    getData({ ...filters, ...params });
    searchLog();
  };

  return (
    <Page
      acceptPermisions={'GTS.INFO_UPLOADED_DKO.ACCESS'}
      acceptRoles={['АКО_Процеси', 'ОДКО']}
      pageName={isFetching ? `${t('LOADING')}...` : t('PAGES.JOURNAL')}
      backRoute={'/gts'}
      loading={isFetching}
      controls={
        <CircleButton
          type={'download'}
          title={t('CONTROLS.DOWNLOAD_JOURNAL')}
          dataMarker={'export'}
          onClick={() => getFile({ ...filters, ...params })}
          disabled={!isValidFilters}
        />
      }
    >
      <Box className={classes.filter}>
        <Box className={classes.filterHeader}>{t('GENERAL_FILTERS')}</Box>
        <Box className={classes.filterBody}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <StyledInput label={t('FIELDS.TKO_EIC')} value={filters.mp} onChange={handleOnChangeFilters('mp')} />
            </Grid>
            <Grid item xs={12} sm={6} md={2.5}>
              <SelectField
                label={t('FIELDS.ENERGY_TYPE')}
                value={filters.product_type}
                data={[
                  { value: 'active', label: 'FIELDS.ACTIVE' },
                  { value: 'reactive', label: 'FIELDS.REACTIVE' }
                ]}
                onChange={handleOnChangeFilters('product_type')}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2.5}>
              <DatePicker
                label={t('FIELDS.PERIOD_DKO_FROM')}
                value={filters.start_at}
                maxDate={filters.end_at || maxPeriodDate}
                onChange={handleOnChangeFilters('start_at')}
                error={error?.data?.start_at || downloadError?.data?.start_at}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2.5}>
              <DatePicker
                label={t('FIELDS.PERIOD_DKO_TO')}
                value={filters.end_at}
                minDate={filters.start_at}
                maxDate={maxPeriodDate}
                onChange={handleOnChangeFilters('end_at')}
                error={error?.data?.end_at || downloadError?.data?.start_at}
              />
            </Grid>
          </Grid>
          <GreenButton
            style={{ borderRadius: 20, padding: '0 16px', height: 32 }}
            onClick={handleApply}
            disabled={!isValidFilters}
          >
            <DoneRounded />
            {t('CONTROLS.ENGAGE')}
          </GreenButton>
        </Box>
      </Box>
      <InnerDataTable
        columns={innerColumns}
        currentData={{ data: currentData || [] }}
        loading={isFetching}
        isPagination={false}
        params={params}
        setParams={handleChange}
      />
    </Page>
  );
};

export default InfoUploadedDko;
