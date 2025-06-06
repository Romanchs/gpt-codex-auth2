import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import DoneRounded from '@mui/icons-material/DoneRounded';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { GreenButton } from '../../../Components/Theme/Buttons/GreenButton';
import { LightTooltip } from '../../../Components/Theme/Components/LightTooltip';
import { useTableStyles } from '../filterStyles';
import Table from './components/Table';
import { useCreateMDCHECKDKOZMutation, useSettingsMDCHECKDKOZQuery } from './api';
import { useTranslation } from 'react-i18next';
import { defaultParams, setParams } from '../slice';
import Filters from './components/Filters';
import { getBlockOfChecksValues, getChecksValues, getDataForCreate, getPeriodToError } from './utils';
import useSearchLog from '../../../services/actionsLog/useSearchLog';
import { MONITORING_DKO_LOG_TAGS } from '../../../services/actionsLog/constants';
import { verifyRole } from '../../../util/verifyRole';

const CheckDkoZ = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const classes = useTableStyles();
  const [filters, setFilters] = useState({});
  const [resetFilters, setResetFilters] = useState({});

  const { currentData: settingsData } = useSettingsMDCHECKDKOZQuery();
  const [create, { error }] = useCreateMDCHECKDKOZMutation({ fixedCacheKey: 'MD_CHECKDKOZ_create' });
  const searchLog = useSearchLog(MONITORING_DKO_LOG_TAGS);

  const settings = {...settingsData, fields: settingsData?.fields?.filter(i => {
      if (filters.group === 'A' && verifyRole(['ОДКО'])) {
        return i.key !== 'metering_grid_areas'
      }
      return true;
    }) || []};

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
      if (key === 'block_of_checks') {
        return setFilters((prev) => ({ ...prev, [key]: value, checks: [] }));
      }
      if (key === 'group') {
        return setFilters((prev) => ({ ...prev, [key]: value, source: settings?.fields?.find(i => i.key === 'source')?.default, metering_grid_areas: [], checks: [], block_of_checks: [] }));
      }
      setFilters((prev) => ({ ...prev, [key]: value }));
    },
    [settings]
  );

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
            : t(`CHECK_DKO_Z.FIELDS.${i.label}`),
        default: filters[i.key] || null,
        error: error?.data?.[i.key]
      };
      if (i.key === 'checks') {
        field.md = 10;
        field.values = getChecksValues(settings?.settings?.checks, filters.block_of_checks, filters.group);
      } else if (i.key === 'block_of_checks') {
        field.values = getBlockOfChecksValues(field?.values, filters.group);
      }
       else if (i.key === 'metering_grid_areas' && filters.group === 'B') {
        field.type = 'select';
      } else if (i.key === 'period_to' && filters.period_to) {
        field.error = getPeriodToError(t, filters.period_from, filters.period_to, field.error);
      }
      field.onChange = handleOnChangeFilters(i.key);
      list.push(field);
    }
    return list;
  }, [t, settings, filters, error, handleOnChangeFilters]);

  const handleCreate = async () => {
    const response = await create(getDataForCreate(filters));
    if (!response?.error) dispatch(setParams(defaultParams));
    setFilters(resetFilters);
    searchLog();
  };

  return (
    <>
      <Filters title={t('BASIC_FILTERS')} list={fields}>
        <Grid item xs={12} sm={2} align={'right'}>
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
                disabled={!settings?.can_start || Boolean(fields.find(f => !f.default || (Array.isArray(f.default) && !f.default.length)) )}
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

export default CheckDkoZ;
