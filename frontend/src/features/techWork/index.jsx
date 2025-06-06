import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import FormControlLabel from '@mui/material/FormControlLabel';
import { useMemo, useState } from 'react';
import moment from 'moment';
import Page from '../../Components/Global/Page';
import DateTimePicker from './components/DateTimePicker';
import StyledInput from '../../Components/Theme/Fields/StyledInput';
import SelectField from '../../Components/Theme/Fields/SelectField';
import Toggle from '../../Components/Theme/Fields/Toggle';
import Table from './components/Table';
import CircleButton from '../../Components/Theme/Buttons/CircleButton';
import { useMaintenanceByIdMutation, useMaintenanceListQuery, useMaintenanceMutation } from './api';
import { Pagination } from '../../Components/Theme/Table/Pagination';
import i18n from '../../i18n/i18n';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const WORK_TYPES = [
  { value: 'PLANNED', label: i18n.t('TECH_WORKS.TYPES_LIST.PLANNED') },
  { value: 'UNPLANNED', label: i18n.t('TECH_WORKS.TYPES_LIST.UNPLANNED') }
];

const defaultFilters = {
  start_dt: undefined,
  planned_end_dt: undefined,
  type: WORK_TYPES[0].value,
  notify_dt: undefined,
  notify_authorized_users: true,
  notify: '1',
  todolist: ['']
};

const TechWork = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [params, setParams] = useState({ page: 1, size: 25 });
  const [filter, setFilter] = useState(defaultFilters);
  const [error, setError] = useState(null);
  const { data, isFetching } = useMaintenanceListQuery(params);
  const [create, { isLoading }] = useMaintenanceMutation();
  const [, { isLoading: isUpdating }] = useMaintenanceByIdMutation({ fixedCacheKey: 'Maintenance_update' });

  const handleChange = (id) => (value) => {
    const newFilters = { ...filter, [id]: value };
    if (id === 'type') newFilters.notify = '0';
    else if (id === 'notify') newFilters.notify_dt = undefined;
    setFilter(newFilters);
  };

  const handleInput = (index, value) => {
    const todolist = filter.todolist.slice(0);
    todolist[index] = value;

    if (index === todolist.length - 1 && todolist.at(-1).length > 2) todolist.push('');
    else if (index === todolist.length - 2 && todolist.at(-2).length < 3 && todolist.at(-1).length === 0)
      todolist.pop();

    setFilter({ ...filter, todolist });
  };

  const isValidFilters = useMemo(() => {
    if (
      !filter.start_dt ||
      !filter.planned_end_dt ||
      !moment(filter.start_dt).isValid() ||
      !moment(filter.planned_end_dt).isValid()
    ) {
      return false;
    }
    if (
      (filter.type === WORK_TYPES[0].value || filter.notify === '1') &&
      (!filter.notify_dt || !moment(filter.notify_dt).isValid())
    ) {
      return false;
    }
    return filter.todolist.find((t) => t);
  }, [filter.start_dt, filter.planned_end_dt, filter.type, filter.notify, filter.notify_dt, filter.todolist]);

  return (
    <Page
      acceptPermisions={'TECH_WORK.ACCESS'}
      acceptRoles={['АКО_Процеси']}
      pageName={t('PAGES.TECHNICAL_WORK_ADMINISTRATION')}
      backRoute={'/tech'}
      loading={isFetching || isLoading || isUpdating}
      controls={
        <>
          <CircleButton
            type={'document'}
            title={t('TECH_WORKS.CONTROLS.DOCUMENTATION')}
            onClick={() => navigate('files')}
          />
          <CircleButton
            type={'create'}
            title={t('TECH_WORKS.CONTROLS.PLANNED')}
            onClick={() => {
              if (moment(filter.start_dt).isBefore(moment().add(1, 'minutes').startOf('minutes'))) {
                setError({
                  ...error,
                  start_dt:
                    WORK_TYPES[0].value === filter.type
                      ? t('TECH_WORKS.ERRORS.PLANNED_START_DT')
                      : t('TECH_WORKS.ERRORS.UNPLANNED_START_DT')
                });
                return;
              }
              setError(null);
              create({
                ...filter,
                todolist: filter.todolist.filter((i) => i.length),
                notify: filter.notify === '1'
              }).then((response) => {
                if (response?.error?.data) setError(response.error.data);
                else setFilter(defaultFilters);
              });
            }}
            disabled={!isValidFilters}
          />
        </>
      }
    >
      <Box component={'section'} sx={styles.table}>
        <Typography component={'h4'} sx={styles.header}>
          {t('TECH_WORKS.PAGE.FIELDS_TITLE')}
        </Typography>
        <Box sx={styles.body}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={3}>
              <DateTimePicker
                label={t('TECH_WORKS.FIELDS.START')}
                value={filter.start_dt}
                onChange={handleChange('start_dt')}
                error={error?.start_dt}
                minDate={moment()}
                maxDate={moment().add(7, 'days')}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <DateTimePicker
                label={t('TECH_WORKS.FIELDS.PLANNED_END')}
                value={filter.planned_end_dt}
                minDate={moment(filter.start_dt).isValid() ? filter.start_dt : undefined}
                onChange={handleChange('planned_end_dt')}
                error={error?.planned_end_dt}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <SelectField
                label={t('TECH_WORKS.FIELDS.WORK_TYPE')}
                value={filter.type}
                data={WORK_TYPES}
                onChange={handleChange('type')}
                dataMarker={'works-type'}
                ignoreI18
              />
            </Grid>
            {filter.type === WORK_TYPES[1].value && (
              <Grid item xs={12} md={3}>
                <SelectField
                  label={t('TECH_WORKS.FIELDS.NOTIFY')}
                  value={filter.notify}
                  data={[
                    { value: '1', label: t('CONTROLS.YES') },
                    { value: '0', label: t('CONTROLS.NO') }
                  ]}
                  onChange={handleChange('notify')}
                  dataMarker={'is-send-notify'}
                  ignoreI18
                />
              </Grid>
            )}
            {(filter.type === WORK_TYPES[0].value || filter.notify === '1') && (
              <Grid item xs={12} md={3}>
                <DateTimePicker
                  label={t('TECH_WORKS.FIELDS.NOTIFY_DATE')}
                  value={filter.notify_dt}
                  onChange={handleChange('notify_dt')}
                  error={error?.notify_dt}
                  minDate={moment()}
                  maxDate={filter.start_dt ? moment(filter.start_dt) : undefined}
                />
              </Grid>
            )}
            <Grid item xs={12}>
              <FormControlLabel
                label={t('TECH_WORKS.FIELDS.NOTIFY_AUTHORIZED_USERS')}
                sx={{
                  margin: '0px 0 0px 0',
                  color: '#4A5B7A',
                  '&>.MuiTypography-root': { ml: '10px', fontSize: '14px', fontWeight: 400 }
                }}
                control={
                  <Toggle
                    title={
                      filter.notify_authorized_users
                        ? t('TECH_WORKS.FIELDS.TURN_OFF_NOTIFY')
                        : t('TECH_WORKS.FIELDS.TURN_ON_NOTIFY')
                    }
                    setSelected={handleChange('notify_authorized_users')}
                    selected={Boolean(filter.notify_authorized_users)}
                    dataMarker={'toggle-notify'}
                  />
                }
              />
            </Grid>
            <Grid item xs={12}>
              <Box
                component={'h3'}
                sx={{
                  fontSize: 15,
                  fontWeight: '700',
                  color: '#4A5B7A',
                  lineHeight: '18px',
                  pb: '25px'
                }}
              >
                {t('TECH_WORKS.PAGE.TODOLIST_TITLE') + ':'}
              </Box>
              {filter.todolist.map((value, i) => (
                <Stack key={i} direction={'row'} sx={{ mb: 3, alignItems: 'center', gap: 1 }}>
                  <Box component={'span'} sx={{ color: '#4A5B7A', fontSize: 14 }}>
                    {i + 1}.
                  </Box>
                  <StyledInput
                    label={t('TECH_WORKS.FIELDS.TODO_ITEM')}
                    value={value}
                    onChange={(event) => handleInput(i, event.target.value)}
                    dataMarker={`todoitem-${i}`}
                  />
                </Stack>
              ))}
            </Grid>
          </Grid>
        </Box>
        <Box sx={styles.body}>
          <Grid container spacing={3}></Grid>
        </Box>
      </Box>
      <Table data={data?.data} />
      <Pagination {...data} params={params} loading={isFetching} onPaginate={(p) => setParams({ ...params, ...p })} />
    </Page>
  );
};

export default TechWork;

export const styles = {
  table: {
    mb: 2,
    borderRadius: 2,
    boxShadow: '0px 4px 24px rgba(0, 0, 0, 0.12)',
    overflow: 'hidden'
  },
  header: {
    color: '#FFFFFF',
    padding: '17px 24px',
    fontSize: 12,
    fontWeight: 400,
    backgroundColor: '#223B82'
  },
  body: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 16,
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: '20px 24px 18px'
  }
};
