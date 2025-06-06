import SaveRounded from '@mui/icons-material/SaveRounded';
import Grid from '@material-ui/core/Grid';
import { useState } from 'react';

import CircleButton from '../../../Components/Theme/Buttons/CircleButton';
import SelectField from '../../../Components/Theme/Fields/SelectField';
import { useTableStyles } from '../filterStyles';
import DatePicker from '../../../Components/Theme/Fields/DatePicker';
import moment from 'moment/moment';
import { useUpdateBlockedSendingDkoMutation } from './api';
import Table from './Table';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';

const initialFilters = {
  interval_from: moment(),
  interval_to: moment('9999-12-31'),
  action: 'lock',
  all: false,
  points: []
};

export const ZV_TYPES = [
  { label: 'ZV_TYPE.CONSUMPTION', value: 'CONSUMPTION' },
  { label: 'ZV_TYPE.INTERCHANGE', value: 'INTERCHANGE' },
  { label: 'ZV_TYPE.GENERATION', value: 'GENERATION' }
];

const defaultOptions = {
  zv_type: ZV_TYPES,
  locked: [
    { label: 'CONTROLS.YES', value: '0' },
    { label: 'CONTROLS.NO', value: '1' }
  ]
};

const defaultParams = { page: 1, size: 25 };

const BlockedSendingDkoTab = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();
  const classes = useTableStyles();
  const [params, setParams] = useState(defaultParams);
  const [filters, setFilters] = useState(initialFilters);
  const [update, { error }] = useUpdateBlockedSendingDkoMutation({ fixedCacheKey: 'BlockedSendingDko_update' });

  const handleOnChangeFilters = (filter) => {
    return (value) => {
      switch (filter) {
        case 'interval_from':
        case 'interval_to':
          setFilters({ ...filters, [filter]: moment(value).format('yyyy-MM-DD') });
          break;
        default:
          setFilters({ ...filters, [filter]: value });
      }
    };
  };

  const handleSaveLock = () => {
    const { points, ...restFilters } = filters;
    const body = {
      ...restFilters,
      interval_from: moment(filters.interval_from).startOf('day').format(),
      interval_to: moment(filters.interval_to).endOf('day').format(),
      include: filters.all ? [] : points,
      exclude: filters.all ? points : []
    };
    enqueueSnackbar(t('NOTIFICATIONS.CHANGES_STARTED'), {
      key: new Date().getTime() + Math.random(),
      variant: 'success',
      autoHideDuration: 5000
    });
    update({ type: 'block-cad-sending', method: 'POST', body, params });
  };

  return (
    <>
      <section className={classes.table}>
        <h4 className={classes.tableHeader}>{t('POINT_ADJUSTMENT')}</h4>
        <div className={classes.tableBody}>
          <Grid item xs={12} sm={6} md={2}>
            <DatePicker
              label={t('FIELDS.PERIOD_FROM')}
              value={filters.interval_from}
              onChange={handleOnChangeFilters('interval_from')}
              minDate={moment('2019-07-01')}
              minDateMessage={t('VERIFY_MSG.MIN_DATE_MESSAGE_WITH_PARAM', { param: '01.07.2019' })}
              error={error?.data?.interval_from}
              // disabled={filters.action === 'lock'}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <DatePicker
              label={t('FIELDS.PERIOD_TO')}
              value={filters.interval_to}
              maxDate={new Date('9999-12-31')}
              onChange={handleOnChangeFilters('interval_to')}
              error={error?.data?.interval_to}
              // disabled={filters.action === 'lock'}
              minDate={moment(filters.interval_from).isValid() ? moment(filters.interval_from) : moment('2019-07-01')}
              minDateMessage={
                moment(filters.interval_from).isValid()
                  ? t('VERIFY_MSG.DATE_FROM_SHOULD_BE_MORE_THEN_DATE_TO')
                  : t('VERIFY_MSG.MIN_DATE_MESSAGE_WITH_PARAM', { param: '01.07.2019' })
              }
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <SelectField
              label={t('FIELDS.SEND_DKO')}
              value={filters?.action}
              data={[
                { label: t('CONTROLS.YES'), value: 'unlock' },
                { label: t('CONTROLS.NO'), value: 'lock' }
              ]}
              onChange={handleOnChangeFilters('action')}
              ignoreI18
              dataMarker={'action'}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6} style={{ textAlign: 'right' }}>
            <CircleButton
              icon={<SaveRounded />}
              color={'green'}
              title={t('CONTROLS.SAVE')}
              dataMarker={'saveLock'}
              onClick={handleSaveLock}
              disabled={!(filters.all || filters.points.length > 0)}
            />
          </Grid>
        </div>
      </section>
      <Table params={params} setParams={setParams} options={defaultOptions} filters={filters} setFilters={setFilters} />
    </>
  );
};

export default BlockedSendingDkoTab;
