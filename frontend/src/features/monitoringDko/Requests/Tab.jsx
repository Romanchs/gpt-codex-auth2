import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import moment from 'moment/moment';
import DatePicker from '../../../Components/Theme/Fields/DatePicker';
import MultiSelect from '../../../Components/Theme/Fields/MultiSelect';
import SelectField from '../../../Components/Theme/Fields/SelectField';
import { GreenButton } from '../../../Components/Theme/Buttons/GreenButton';
import { enqueueSnackbar } from '../../../actions/notistackActions';
import { useTableStyles } from '../filterStyles';
import { useTranslation } from 'react-i18next';
import useSearchLog from '../../../services/actionsLog/useSearchLog';
import { MONITORING_DKO_LOG_TAGS } from '../../../services/actionsLog/constants';

const versionList = [
  { label: '1', value: '1' },
  { label: '2', value: '2' },
  { label: '3', value: '3' }
];

const typeList = [
  { label: 'Z', value: 'z' },
  { label: 'ZV', value: 'zv' }
];

const apGroupsList = [
  { label: 'А', value: 'a' },
  { label: 'Б', value: 'b' }
];

const POINT_TYPES = {
  Z: typeList[0].value,
  ZV: typeList[1].value
};

export const defaultRquestsParams = {
  type: 'z',
  period_from: moment(),
  period_to: moment(),
  version: 1,
  ap_groups: [{ label: 'А', value: 'a' }]
};

const Requests = ({ fetch }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const classes = useTableStyles();

  const [params, setParams] = useState(defaultRquestsParams);
  const searchLog = useSearchLog(MONITORING_DKO_LOG_TAGS);

  const handleOnChangeFilters = (filter) => (value) => {
    setParams({ ...params, [filter]: value });
    searchLog();
  };

  const handleDownloadRequests = async () => {
    const { type, ap_groups, version, ...body } = params;
    if (type === 'z') body.ap_groups = ap_groups.map((i) => i.value);
    else body.version = version;
    body.period_from = moment(body.period_from).startOf('day').utc().format();
    body.period_to = moment(body.period_to).startOf('day').utc().format();

    const { data, error } = await fetch({ type, body });
    if (!error && data.detail) {
      dispatch(
        enqueueSnackbar({
          message: data.detail,
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
    <Box component="section" className={classes.table}>
      <h4 className={classes.tableHeader}>{t('ADDITIONAL_INFO')}</h4>
      <Box className={classes.tableBody}>
        <Grid container spacing={2} alignItems={'center'}>
          <Grid item xs={12} sm={6} md={3}>
            <SelectField
              label={t('FIELDS.POINT_TYPE')}
              value={params.type}
              data={typeList}
              onChange={handleOnChangeFilters('type')}
            />
          </Grid>
          {params.type === POINT_TYPES.Z && (
            <Grid item xs={12} sm={6} md={2}>
              <Box sx={{ '& input': { p: '11px' }, '& div>fieldset': { borderWidth: '1px' } }}>
                <MultiSelect
                  label={t('FIELDS.AP_GROUP')}
                  value={params.ap_groups}
                  list={apGroupsList}
                  onChange={handleOnChangeFilters('ap_groups')}
                />
              </Box>
            </Grid>
          )}
          {params.type === POINT_TYPES.ZV && (
            <Grid item xs={12} sm={6} md={3}>
              <SelectField
                label={t('FIELDS.VERSION')}
                value={params.version}
                data={versionList}
                onChange={handleOnChangeFilters('version')}
              />
            </Grid>
          )}
          <Grid item xs={12} sm={6} md={2}>
            <DatePicker
              label={t('FIELDS.REPORT_PERIOD_FROM')}
              value={params.period_from}
              onChange={handleOnChangeFilters('period_from')}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <DatePicker
              label={t('FIELDS.REPORT_PERIOD_TO')}
              value={params.period_to}
              onChange={handleOnChangeFilters('period_to')}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3} sx={{ textAlign: 'right' }}>
            <GreenButton style={{ borderRadius: 20, padding: '0 16px', height: 32 }} onClick={handleDownloadRequests}>
              {t('CONTROLS.PERFORM')}
            </GreenButton>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Requests;
