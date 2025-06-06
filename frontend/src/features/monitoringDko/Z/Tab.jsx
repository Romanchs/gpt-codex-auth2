import Grid from '@mui/material/Grid';
import DoneRounded from '@mui/icons-material/DoneRounded';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { enqueueSnackbar } from '../../../actions/notistackActions';
import { GreenButton } from '../../../Components/Theme/Buttons/GreenButton';
import DatePicker from '../../../Components/Theme/Fields/DatePicker';
import MultiSelect from '../../../Components/Theme/Fields/MultiSelect';
import DateTimePicker from '../../../Components/Theme/Fields/DateTimePicker';
import Table from './Table';
import { mainApi } from '../../../app/mainApi';
import { useCreateMDZMutation } from './api';
import { useTranslation } from 'react-i18next';
import useSearchLog from '../../../services/actionsLog/useSearchLog';
import { MONITORING_DKO_LOG_TAGS } from '../../../services/actionsLog/constants';
import { Box } from '@mui/material';
import VersionsByPeriod from '../../versionsByPeriod';
import PaperWithAppBar from '../../../Components/Theme/Components/PaperWithAppBar';
import SelectField from '../../../Components/Theme/Fields/SelectField';
import { pointTypeList } from '../../../Components/pages/TKO/List/config';

const apGroupsList = [
  { label: 'А', value: 'a' },
  { label: 'Б', value: 'b' }
];

export const pointTypesList = [
  { value: 'Площадка (ТКО)', label: 'POINT_TYPE.InstallationAccountingPoint' },
  { value: 'Внутрішня точка', label: 'POINT_TYPE.SubmeteringPoint' }
];

const initialFilters = {
  period_from: null,
  period_to: null,
  version: '*',
  started_at: null,
  finished_at: null,
  ap_groups: [apGroupsList[0]],
  point_type: pointTypesList[0].value,
  point_species: [],
  is_active_connection_status: 'true'
};

const ZTab = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const params = useSelector((store) => store.monitoringDko.params);
  const [filters, setFilters] = useState(initialFilters);
  const [datesError, setDatesError] = useState({ from: null, to: null });
  const { data } = mainApi.endpoints.getListMDZ.useQueryState(params);
  const [create, { error }] = useCreateMDZMutation({ fixedCacheKey: 'MDZ_create' });
  const searchLog = useSearchLog(MONITORING_DKO_LOG_TAGS);

  useEffect(() => {
    if (!data) return;
    const newFilters = {
      period_from: data.period_from,
      period_to: data.period_to,
      version: data.version,
      started_at: data.started_at,
      finished_at: data.finished_at
    };
    if (Array.isArray(data.ap_groups)) {
      newFilters.ap_groups = apGroupsList.filter((i) => data.ap_groups.includes(i.value));
    }
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, [data]);

  const handleOnChangeFilters = (filter) => (value) => {
    setFilters({ ...filters, [filter]: value });
  };

  const handleCreate = async () => {
    const { error } = await create({
      period_from: moment(filters.period_from).startOf('day').utc().format(),
      period_to: moment(filters.period_to).startOf('day').utc().format(),
      ap_groups: filters.ap_groups.map((i) => i.value),
      version: filters.version,
      point_type: filters.point_type,
      point_species: filters.point_species.map(i => i.value),
      is_active_connection_status: filters.is_active_connection_status === 'true'
    });
    searchLog();
    if (!error) {
      dispatch(
        enqueueSnackbar({
          message: t('FORMING_REPORT_STARTED'),
          options: {
            key: new Date().getTime() + Math.random(),
            variant: 'success',
            autoHideDuration: 5000
          }
        })
      );
    }
  };

  return (
    <>
      <PaperWithAppBar header={t('ADDITIONAL_INFO')}>
        <Grid container spacing={2} alignItems={'flex-start'}>
          <Grid item xs={12} md={6} lg={2}>
            <MultiSelect
              label={t('FIELDS.AP_GROUP')}
              value={filters.ap_groups}
              list={apGroupsList}
              onChange={handleOnChangeFilters('ap_groups')}
              error={error?.data?.ap_groups}
              disabled={!data?.can_start}
              ignoreI18
            />
          </Grid>
          <Grid item xs={12} md={6} lg={2}>
            <DatePicker
              label={t('FIELDS.REPORT_PERIOD_FROM')}
              onError={(from) => setDatesError({ ...datesError, from })}
              value={filters.period_from}
              onChange={handleOnChangeFilters('period_from')}
              maxDate={moment().subtract('1', 'days')}
              error={error?.data?.period_from}
              disabled={!data?.can_start}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={2}>
            <DatePicker
              label={t('FIELDS.REPORT_PERIOD_TO')}
              onError={(to) => setDatesError({ ...datesError, to })}
              value={filters.period_to}
              onChange={handleOnChangeFilters('period_to')}
              maxDate={moment().subtract('1', 'days')}
              error={error?.data?.period_to}
              disabled={!data?.can_start}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={2}>
            <VersionsByPeriod
              useEmptySting
              useNull
              label={t('FIELDS.VERSION')}
              value={filters.version}
              onChange={handleOnChangeFilters('version')}
              error={error?.data?.version}
              disabled={!data?.can_start}
              from_date={filters?.period_from}
              to_date={filters?.period_to}
              datesError={datesError}
              required
            />
          </Grid>
          <Grid item xs={12} md={6} lg={2}>
            <DateTimePicker
              label={t('FIELDS.REPORT_STARTED_AT')}
              value={filters.started_at}
              onChange={handleOnChangeFilters('started_at')}
              error={error?.data?.started_at}
              disabled
            />
          </Grid>
          <Grid item xs={12} md={6} lg={2}>
            <DateTimePicker
              label={t('FIELDS.REPORT_FORMED_AT')}
              value={filters.finished_at}
              onChange={handleOnChangeFilters('finished_at')}
              error={error?.data?.finished_at}
              disabled
            />
          </Grid>
          <Grid item xs={12} md={6} lg={2}>
            <SelectField
              dataMarker={'point_type'}
              label={t('FIELDS.POINT_TYPE')}
              data={pointTypesList}
              value={filters.point_type}
              onChange={handleOnChangeFilters('point_type')}
              error={error?.data?.point_type}
              disabled={!data?.can_start}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={2}>
            <MultiSelect
              dataMarker={'ap_type'}
              label={t('FIELDS.AP_TYPE')}
              value={filters.point_species}
              list={pointTypeList.map(({ label, value }) => ({ value, label: t(label) }))}
              onChange={handleOnChangeFilters('point_species')}
              error={error?.data?.point_species}
              disabled={!data?.can_start || filters.point_type === pointTypesList[0].value}
              ignoreI18
            />
          </Grid>
          <Grid item xs={12} md={6} lg={2}>
            <SelectField
              dataMarker={'connection_status'}
              label={t('FIELDS.CONNECTION_STATUS')}
              data={[
                {
                  value: 'true',
                  label: 'ON'
                },
                {
                  value: 'false',
                  label: 'OFF'
                }
              ]}
              value={filters.is_active_connection_status}
              onChange={handleOnChangeFilters('is_active_connection_status')}
              error={error?.data?.is_active_connection_status}
              disabled={!data?.can_start}
            />
          </Grid>
          <Box sx={{ flexGrow: 1 }} />
          <Grid item xs={12} sm={'auto'} sx={{ textAlign: 'right', mt: 0.5 }}>
            <GreenButton
              style={{ borderRadius: 24 }}
              data-marker={'create'}
              onClick={handleCreate}
              disabled={!data?.can_start || !filters.version || !filters.period_from || !filters.period_to || !filters.ap_groups?.length || (filters.point_type === pointTypesList[1].value && filters.point_species?.length === 0)}
            >
              <DoneRounded />
              {t('CONTROLS.ENGAGE')}
            </GreenButton>
          </Grid>
        </Grid>
      </PaperWithAppBar>
      <Table />
    </>
  );
};

export default ZTab;
