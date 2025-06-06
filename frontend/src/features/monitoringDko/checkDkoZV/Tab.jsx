import { Box, Grid } from '@mui/material';
import DoneRounded from '@mui/icons-material/DoneRounded';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { GreenButton } from '../../../Components/Theme/Buttons/GreenButton';
import { LightTooltip } from '../../../Components/Theme/Components/LightTooltip';
import { useTableStyles } from '../filterStyles';
import Table from './components/Table';
import { useCreateMDCHECKDKOZVMutation, useSettingsMDCHECKDKOZVQuery } from './api';
import { defaultParams, setParams, setShowHide } from '../slice';
import Filters from './components/Filters';
import { getDataForCreate, getPeriodToError } from './utils';
import useSearchLog from '../../../services/actionsLog/useSearchLog';
import { MONITORING_DKO_LOG_TAGS } from '../../../services/actionsLog/constants';

const CheckDkoZV = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const classes = useTableStyles();
  const [filters, setFilters] = useState({});
  const [resetFilters, setResetFilters] = useState({});

  const { currentData: settings } = useSettingsMDCHECKDKOZVQuery();
  const [create, { error }] = useCreateMDCHECKDKOZVMutation({ fixedCacheKey: 'MD_CHECKDKOZV_create' });
  const searchLog = useSearchLog(MONITORING_DKO_LOG_TAGS);

  useEffect(() => {
    if (!settings || Object.keys(resetFilters).length) return;
    const defaultFields = {};
    const resetFields = {};
    for (let i = 0; i < settings?.fields.length; i++) {
      defaultFields[settings?.fields[i].key] = settings?.fields[i].default;
      resetFields[settings?.fields[i].key] = settings?.fields[i].default;
      if (settings?.fields[i].type === 'multiselect' && !settings?.fields[i].default) {
        resetFields[settings?.fields[i].key] = [];
      }
    }
    setFilters(defaultFields);
    setResetFilters(resetFields);
  }, [dispatch, settings, resetFilters]);

  const handleOnChangeFilters = useCallback(
    (key) => (value) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const isAllFieldsFilled = (filters) =>
    Object.values(filters).every((value) => (Array.isArray(value) ? value.length > 0 : Boolean(value) || value === 0));

  useEffect(() => {
    const allFieldsFilled = isAllFieldsFilled(filters);
    dispatch(setShowHide(allFieldsFilled));
  }, [filters]);

  const fields = useMemo(() => {
    if (!settings?.fields) return [];
    const list = [];
    for (const i of settings.fields) {
      if (i.key === 'source' && filters.group === 'A') continue;
      const field = {
        ...i,
        label:
          i.key === 'period_from' || i.key === 'period_to'
            ? t(`FIELDS.REPORT_${i.label}`)
            : t(`CHECK_DKO_ZV.FIELDS.${i.label}`),
        default: filters[i.key] || null,
        error: error?.data?.[i.key]
      };
      if (i.key === 'source') {
        field.sm = 1.5;
      }
      if (i.key === 'version') {
        field.sm = 1.4;
        field.type = 'select_version';
      }
      if (i.key === 'checks') {
        field.sm = 2;
        field.values = [{ label: t('ALL'), value: 'all' }, ...field.values];
      }
      if (i.key === 'metering_grid_areas' && filters.group === 'B') {
        field.sm = 2.1;
        field.type = 'select';
      } else if (i.key === 'period_to' && filters.period_to) {
        field.sm = 1.5;
        field.error = getPeriodToError(t, filters.period_from, filters.period_to, field.error);
      } else if (i.key === 'period_from') {
        field.sm = 1.5;
      }
      field.onChange = handleOnChangeFilters(i.key);
      list.push(field);
    }
    return list;
  }, [t, settings, filters, error, handleOnChangeFilters]);

  const handleCreate = async () => {
    const response = await create(getDataForCreate(filters, settings.fields));
    if (!response?.error) dispatch(setParams(defaultParams));
    setFilters(resetFilters);
    searchLog();
  };

  return (
    <>
      <Filters title={t('BASIC_FILTERS')} list={fields}>
        <Grid item xs={12} sm={3} md={2} lg={1.5} align={'right'}>
          <LightTooltip
            title={!settings?.can_start ? t('ONLY_ONE_REPORT_CAN_START') : ''}
            disableTouchListener
            disableFocusListener
            arrow
          >
            <Box sx={{ display: 'inline-block' }}>
              <GreenButton
                data-marker={'create'}
                onClick={handleCreate}
                className={classes.saveButton}
                disabled={
                  !settings?.can_start ||
                  fields.find((f) => (f.key !== 'version' && !f.default) || (Array.isArray(f.default) && !f.default.length))
                }
              >
                <DoneRounded />
                {t('CONTROLS.ENGAGE')}
              </GreenButton>
            </Box>
          </LightTooltip>
        </Grid>
      </Filters>
      <Table />
    </>
  );
};

export default CheckDkoZV;
