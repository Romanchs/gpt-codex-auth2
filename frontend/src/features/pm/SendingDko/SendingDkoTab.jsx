import SaveRounded from '@mui/icons-material/SaveRounded';
import Grid from '@material-ui/core/Grid';
import { useState } from 'react';

import CircleButton from '../../../Components/Theme/Buttons/CircleButton';
import SelectField from '../../../Components/Theme/Fields/SelectField';
import { useTableStyles } from '../filterStyles';
import DatePicker from '../../../Components/Theme/Fields/DatePicker';
import moment from 'moment/moment';
import { useUpdateSendingDkoMutation, useInitSendingDkoQuery } from './api';
import SendingDkoTable from './SendingDkoTable';
import { useTranslation } from 'react-i18next';

const initialFilters = {
  zv: [],
  update_start_at: moment(),
  update_end_at: moment('9999-12-31'),
  update_source: 'dhub',
  excludes: []
};

const defaultOptions = {
  zv_type: [
    { label: 'ZV_TYPE.CONSUMPTION', value: 'CONSUMPTION' },
    { label: 'ZV_TYPE.INTERCHANGE', value: 'INTERCHANGE' },
    { label: 'ZV_TYPE.GENERATION', value: 'GENERATION' }
  ],
  source: [
    { label: 'DATAHUB', value: 'dhub' },
    { label: 'PPKO', value: 'ppko' }
  ]
};

const defaultParams = { page: 1, size: 25 };

const SendingDkoTab = () => {
  const { t } = useTranslation();
  const classes = useTableStyles();
  const [params, setParams] = useState(defaultParams);
  const [filters, setFilters] = useState(initialFilters);
  const [update, { error }] = useUpdateSendingDkoMutation({ fixedCacheKey: 'SendingDko_update' });
  const { data: records } = useInitSendingDkoQuery(params);

  const handleOnChangeFilters = (filter) => {
    return (value) => {
      switch (filter) {
        case 'update_start_at':
        case 'update_end_at':
          setFilters({ ...filters, [filter]: moment(value).format('yyyy-MM-DD') });
          break;
        default:
          setFilters({ ...filters, [filter]: value });
      }
    };
  };

  const handleSaveLock = () => {
    let body = {};
    const { page, size, start_at, end_at, ...rest } = params;
    if (filters.update_source === 'dhub') {
      body = {
        ...filters,
        zv: filters.zv.includes('All') ? [] : filters.zv,
        update_start_at: moment(filters.update_start_at).startOf('day').format(),
        update_end_at: moment(filters.update_end_at).endOf('day').format(),
        start_at,
        end_at,
        ...rest
      };
    } else if (filters.update_source === 'ppko') {
      body = {
        zv: filters.zv.includes('All') ? [] : filters.zv,
        update_source: filters.update_source,
        excludes: filters.excludes,
        ...rest
      };
    }
    update(body);
  };

  return (
    <>
      <section className={classes.table}>
        <h4 className={classes.tableHeader}>{t('POINT_ADJUSTMENT')}</h4>
        <div className={classes.tableBody}>
          <Grid item xs={12} sm={6} md={2}>
            <DatePicker
              label={t('FIELDS.PERIOD_FROM')}
              value={filters.update_start_at}
              onChange={handleOnChangeFilters('update_start_at')}
              minDate={moment('2019-07-01')}
              minDateMessage={t('VERIFY_MSG.MIN_DATE_MESSAGE_WITH_PARAM', { param: '01.07.2019' })}
              error={error?.data?.update_start_at}
              disabled={filters.update_source === 'ppko'}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <DatePicker
              label={t('FIELDS.PERIOD_TO')}
              value={filters.update_end_at}
              maxDate={new Date('9999-12-31')}
              onChange={handleOnChangeFilters('update_end_at')}
              error={error?.data?.update_end_at}
              disabled={filters.update_source === 'ppko'}
              minDate={
                moment(filters.update_start_at).isValid() ? moment(filters.update_start_at) : moment('2019-07-01')
              }
              minDateMessage={
                moment(filters.update_start_at).isValid()
                  ? t('VERIFY_MSG.DATE_FROM_SHOULD_BE_MORE_THEN_DATE_TO')
                  : t('VERIFY_MSG.MIN_DATE_MESSAGE_WITH_PARAM', { param: '01.07.2019' })
              }
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <SelectField
              label={`${t('FIELDS.AGGREGATION_SIDE_ZV')}:`}
              value={filters?.update_source}
              data={[
                { label: t('DATAHUB'), value: 'dhub' },
                { label: t('PPKO'), value: 'ppko' }
              ]}
              onChange={handleOnChangeFilters('update_source')}
              ignoreI18
              dataMarker={'update_source'}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6} style={{ textAlign: 'right' }}>
            <CircleButton
              icon={<SaveRounded />}
              color={'green'}
              title={t('CONTROLS.SAVE')}
              dataMarker={'saveLock'}
              onClick={handleSaveLock}
              disabled={filters.zv.length === 0 || filters.excludes.length === records?.total}
            />
          </Grid>
        </div>
      </section>
      <SendingDkoTable
        params={params}
        setParams={setParams}
        options={defaultOptions}
        selected={filters.zv}
        excludes={filters.excludes}
        filters={filters}
        setFilters={setFilters}
      />
    </>
  );
};

export default SendingDkoTab;
