import SaveRounded from '@mui/icons-material/SaveRounded';
import Grid from '@material-ui/core/Grid';
import { useEffect, useState } from 'react';

import CircleButton from '../../../Components/Theme/Buttons/CircleButton';
import SelectField from '../../../Components/Theme/Fields/SelectField';
import { useTableStyles } from '../filterStyles';
import { useInitPMBlockedQuery, useLockPMBlockedMutation } from './api';
import Table from './Table';
import { useTranslation } from 'react-i18next';
import StyledInput from '../../../Components/Theme/Fields/StyledInput';

const initialFilters = {
  version: 1,
  month: 1,
  year: 2022,
  decade: 2
};

const defaultOptions = {
  month: [{ label: 'MONTHS.JANUARY', value: '1' }],
  year: [{ label: '2022', value: '2022' }],
  decade: [{ label: '2', value: '2' }]
};

const defaultParams = { page: 1, size: 25 };
export const MAX_VERSION = 1000;
export const MIN_VERSION = 1;

const СalculationsBlockedTab = () => {
  const { t } = useTranslation();
  const classes = useTableStyles();
  const [params, setParams] = useState(defaultParams);
  const [filters, setFilters] = useState(initialFilters);
  const { data: settings } = useInitPMBlockedQuery({ type: 'settings' });
  const [update, { error }] = useLockPMBlockedMutation({ fixedCacheKey: 'PMBlocked_update' });

  useEffect(() => {
    if (!settings) return;
    setFilters((prev) => ({ ...prev, ...settings.actives }));
  }, [settings]);

  const onChangeVersion = ({ target }) => {
    const version = target.value;
    if (version && version < MIN_VERSION) {
      setFilters({ ...filters, version: MIN_VERSION });
      return;
    }
    if (version > MAX_VERSION) {
      setFilters({ ...filters, version: MAX_VERSION });
      return;
    }
    setFilters({ ...filters, version });
  };

  return (
    <>
      <section className={classes.table}>
        <h4 className={classes.tableHeader}>{t('GLOBAL_LOCK_SETTINGS')}</h4>
        <div className={classes.tableBody}>
          <Grid item xs={12} sm={6} md={2}>
            <StyledInput
              label={t('FIELDS.CERTIFICATION_NUMBER')}
              value={filters.version}
              onChange={onChangeVersion}
              error={error?.data?.version}
              dataMarker={'blocked-version'}
              type={'number'}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <SelectField
              label={t('FIELDS.MONTH')}
              value={filters.month}
              data={
                settings?.month
                  ? filters.year === 2019
                    ? settings.month?.filter(({ value }) => value >= 7)
                    : settings.month
                  : defaultOptions.month
              }
              onChange={(v) => setFilters({ ...filters, month: v })}
              error={error?.data?.month}
              dataMarker={'blocked-month'}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <SelectField
              label={t('FIELDS.YEAR')}
              value={filters.year}
              data={settings?.year || defaultOptions.year}
              onChange={(v) => {
                const newFilters = { ...filters, year: v };
                if (v === 2019 && filters.month < 7) newFilters.month = 7;
                setFilters(newFilters);
              }}
              error={error?.data?.year}
              dataMarker={'blocked-year'}
              ignoreI18
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <SelectField
              label={t('FIELDS.DECADE_NUMBER')}
              value={filters.decade}
              data={settings?.decade || defaultOptions.decade}
              onChange={(v) => setFilters({ ...filters, decade: v })}
              error={error?.data?.decade}
              dataMarker={'blocked-decade'}
              ignoreI18
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} style={{ textAlign: 'right' }}>
            <CircleButton
              icon={<SaveRounded />}
              color={'green'}
              title={t('CONTROLS.SAVE')}
              dataMarker={'save'}
              onClick={() => update({ method: 'POST', body: filters })}
            />
          </Grid>
        </div>
      </section>
      <Table params={params} setParams={setParams} update={update} options={settings || defaultOptions} />
    </>
  );
};

export default СalculationsBlockedTab;
