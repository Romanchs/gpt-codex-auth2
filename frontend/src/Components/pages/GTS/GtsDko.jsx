import Grid from '@material-ui/core/Grid';
import makeStyles from '@material-ui/core/styles/makeStyles';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell/TableCell';
import TableRow from '@material-ui/core/TableRow';
import moment from 'moment';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { clearDkoData, getDkoData } from '../../../actions/gtsActions';
import { checkPermissions } from '../../../util/verifyRole';
import Page from '../../Global/Page';
import CircleButton from '../../Theme/Buttons/CircleButton';
import DatePicker from '../../Theme/Fields/DatePicker';
import SelectField from '../../Theme/Fields/SelectField';
import StyledInput from '../../Theme/Fields/StyledInput';
import NotResultRow from '../../Theme/Table/NotResultRow';
import { StyledTable } from '../../Theme/Table/StyledTable';
import { useFilterStyles } from './filterStyles';
import { disputesActions } from '../../../features/disputes/disputes.slice';
import { useTranslation } from 'react-i18next';
import useViewDataLog from '../../../services/actionsLog/useViewDataLog';
import { GTS_LOG_TAGS } from '../../../services/actionsLog/constants';
import StickyTableHead from '../../Theme/Table/StickyTableHead';

const columns = [
  { id: 'period', label: 'FIELDS.PERIOD', minWidth: 150 },
  { id: 'in_energy', label: 'FIELDS.ENERGY_IN', minWidth: 150 },
  { id: 'in_quality', label: 'FIELDS.DKO_QUELITY_CODE', minWidth: 100 },
  { id: 'out_energy', label: 'FIELDS.ENERGY_OUT', minWidth: 150 },
  { id: 'out_quality', label: 'FIELDS.DKO_QUELITY_CODE', minWidth: 100 }
];

const PERIOD_BY_HOUR = 'day-period-by-hour';
const defaultParams = {
  z: { energy_type: 'active' },
  zv: { source_type: 'ppko' }
};

const GtsDko = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const relation_id = useSelector(({ user }) => user.activeRoles[0]?.relation_id);
  const { state } = useLocation();
  const navigate = useNavigate();
  const classes = useFilterStyles();
  const { rowSx } = rowStyles();
  const { uid, type } = useParams();
  const { loading, notFound, dkoData } = useSelector(({ gts }) => gts);
  const [period, setPeriod] = useState(PERIOD_BY_HOUR);
  const [params, setParams] = useState(defaultParams[type]);

  const viewDataLog = useViewDataLog(GTS_LOG_TAGS);

  useEffect(() => {
    if (
      checkPermissions('GTS.VIEW_DKO.ACCESS', [
        'АКО',
        'АКО_Довідники',
        'АКО_Процеси',
        'АКО_Користувачі',
        'АКО_ППКО',
        'АКО_Суперечки',
        'ОДКО',
        'АДКО',
        'ВТКО',
        'СВБ',
        'ОМ',
        'АТКО',
        'ОЗД',
        'ОЗКО'
      ])
    ) {
      dispatch(getDkoData(uid, type, PERIOD_BY_HOUR, defaultParams[type]));
      viewDataLog();
    } else {
      navigate('/');
    }
  }, [relation_id, navigate, dispatch, uid, type]);

  useEffect(() => {
    if (dkoData?.filters) {
      if (dkoData?.filters?.period_code?.length === 1) {
        setPeriod(dkoData?.filters?.period_code[0]?.value);
      }
      let newParams = {};
      Object.entries(dkoData.filters)
        .filter(([key]) => key !== 'period_code')
        .forEach(([key, value]) => {
          newParams[key] = typeof value === 'string' ? value : value?.find((i) => i?.active)?.value;
        });
      setParams({ ...newParams });
    }
  }, [dkoData]);

  useEffect(() => () => dispatch(clearDkoData()), [dispatch]);

  const filters = useMemo(() => dkoData?.filters, [dkoData]);

  const updateParams = (name) => (value) => {
    if (name !== 'period_code') {
      const v = name === 'version' && value === '*' ? null : value;
      setParams({ ...params, [name]: v });
      if (name === 'datetime_ts' && !moment(value)?.isValid()) return;
      dispatch(
        getDkoData(uid, type, period, {
          ...params,
          [name]: name === 'datetime_ts' ? moment.utc(value).format() : v
        })
      );
    } else {
      setPeriod(value);
      dispatch(getDkoData(uid, type, value, params));
    }
  };

  const onDispute = () => {
    dispatch(
      disputesActions.createDko({
        tko_eic: dkoData?.eic,
        energy_type: params?.energy_type?.toUpperCase(),
        period_begin: params?.datetime_ts || moment.utc(`${params?.year}-01-01`).format('yyyy-MM-DDTHH:mm:ss+02:00'),
        version: params?.version
      })
    )
      .unwrap()
      .then(({ uid }) => navigate(`/disputes/dko/${uid}/create`));
  };

  return (
    <Page
      pageName={t('PAGES.GTS_DKO')}
      backRoute={state?.subprocess_uid ? () => navigate(-1) : '/gts'}
      loading={loading}
      notFoundMessage={notFound && t('NO_DKO_FOUND')}
      controls={
        <>
          {checkPermissions('GTS.VIEW_DKO.CONTROLS.INIT_DISPUTE', ['ОМ', 'СВБ', 'АКО_Суперечки']) && (
            <CircleButton
              type={'dispute'}
              title={t('CONTROLS.INIT_DISPUTE')}
              dataMarker={'dko-disputes'}
              onClick={onDispute}
            />
          )}
        </>
      }
    >
      <div className={classes.filter}>
        <div className={classes.filterHeader}>{t('GENERAL_FILTERS')}</div>
        <div className={classes.filterBody}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={2}>
              <StyledInput label={t('FIELDS.AP_EIC_CODE')} value={dkoData?.eic || ''} readOnly />
            </Grid>
            {type === 'z' && (
              <Grid item xs={12} sm={6} md={2}>
                <SelectField
                  label={t('FIELDS.ENERGY_TYPE')}
                  value={params.energy_type}
                  data={
                    filters?.energy_type.map((i) => ({ ...i, label: t(i.label) })) || [
                      {
                        value: 'active',
                        label: t('FIELDS.ACTIVE')
                      }
                    ]
                  }
                  onChange={updateParams('energy_type')}
                />
              </Grid>
            )}
            {filters?.source_type && (
              <Grid item xs={12} sm={6} md={2}>
                <SelectField
                  label={t('FIELDS.SOURCE')}
                  value={params?.source_type || ''}
                  data={filters?.source_type.map((i) => ({ ...i, label: t(i.label) })) || []}
                  onChange={updateParams('source_type')}
                />
              </Grid>
            )}
            <Grid item xs={12} sm={6} md={2}>
              <SelectField
                label={t('FIELDS.DIMENSION')}
                value={period}
                disabled={filters?.period_code?.length < 2}
                data={
                  filters?.period_code.map((i) => ({ ...i, label: t(i.label) })) || [
                    {
                      value: 'day-period-by-hour',
                      label: t('FIELDS.DAY')
                    }
                  ]
                }
                onChange={updateParams('period_code')}
              />
            </Grid>
            {filters?.year && (
              <Grid item xs={12} sm={6} md={type === 'zv' && period === 'decade-period-by-day' ? 1 : 2}>
                <SelectField
                  label={t('FIELDS.YEAR')}
                  value={params?.year || ''}
                  data={filters?.year || []}
                  onChange={updateParams('year')}
                />
              </Grid>
            )}
            {filters?.month && (
              <Grid item xs={12} sm={6} md={2}>
                <SelectField
                  label={t('FIELDS.MONTH')}
                  value={params?.month || ''}
                  data={filters?.month.map((i) => ({ ...i, label: t(i.label) })) || []}
                  onChange={updateParams('month')}
                />
              </Grid>
            )}
            {filters?.decade && (
              <Grid item xs={12} sm={6} md={2}>
                <SelectField
                  label={t('FIELDS.DECADE')}
                  value={params?.decade || ''}
                  data={filters?.decade || []}
                  onChange={updateParams('decade')}
                />
              </Grid>
            )}
            {filters?.datetime_ts && (
              <Grid item xs={12} sm={6} md={2}>
                <DatePicker
                  label={t('FIELDS.DATE')}
                  value={params?.datetime_ts || null}
                  onChange={updateParams('datetime_ts')}
                />
              </Grid>
            )}
            {filters?.version && type !== 'zv-custom' && (
              <Grid item xs={12} sm={6} md={period === 'decade-period-by-day' ? 1 : 2}>
                <SelectField
                  label={t('FIELDS.VERSION')}
                  value={params?.version?.toString() || '*'}
                  data={
                    filters?.version?.map((i) => ({
                      ...i,
                      value: i.value !== null ? i.value?.toString() : '*'
                    })) || []
                  }
                  onChange={updateParams('version')}
                />
              </Grid>
            )}
          </Grid>
        </div>
      </div>
      <StyledTable spacing={0}>
        <StickyTableHead>
          <TableRow>
            {columns.map(({ id, label, minWidth }) => (
              <TableCell style={{ minWidth }} className={'MuiTableCell-head'} key={id}>
                {id === 'in_energy' || id === 'out_energy' ? (
                  <p>
                    {params?.energy_type === 'reactive' ? t('FIELDS.REACTIVE') : t('FIELDS.ACTIVE')} {t(label)} (
                    {params?.energy_type === 'reactive' ? t('FIELDS.REACTIVE_DIMENSION') : t('FIELDS.ACTIVE_DIMENSION')}
                    )
                  </p>
                ) : (
                  <p>{t(label)}</p>
                )}
              </TableCell>
            ))}
          </TableRow>
          <TableRow style={{ height: 8 }}></TableRow>
        </StickyTableHead>
        <TableBody>
          {dkoData?.content?.length > 0 ? (
            <>
              {dkoData?.content?.map((row, index) => (
                <TableRow key={'row' + index} hover data-marker="table-row" className={rowSx}>
                  <TableCell data-marker={'period'}>{row?.period || ''}</TableCell>
                  <TableCell data-marker={'in_energy'}>{row?.in_energy || 0}</TableCell>
                  <TableCell data-marker={'in_quality'}>{row?.in_quality || ''}</TableCell>
                  <TableCell data-marker={'out_energy'}>{row?.out_energy || 0}</TableCell>
                  <TableCell data-marker={'out_quality'}>{row?.out_quality || ''}</TableCell>
                </TableRow>
              ))}
              <TableRow data-marker="summ" className={rowSx}>
                <TableCell>{t('IN_TOTAL')}:</TableCell>
                <TableCell data-marker={'sum_in'}>{dkoData?.content_sums?.sum_in || 0}</TableCell>
                <TableCell data-marker={'spacing'}></TableCell>
                <TableCell data-marker={'sum_out'}>{dkoData?.content_sums?.sum_out || 0}</TableCell>
                <TableCell data-marker={'spacing'}></TableCell>
              </TableRow>
            </>
          ) : (
            <NotResultRow span={8} text={t('NOTHING_FOUND')} />
          )}
        </TableBody>
      </StyledTable>
    </Page>
  );
};

export default GtsDko;

const rowStyles = makeStyles(() => ({
  rowSx: {
    '&>td': {
      backgroundColor: '#fff',
      borderColor: '#D1EDF3',
      padding: '12px 24px',
      '&:first-child': {
        borderRight: '1px solid #D1EDF3',
        borderLeft: '1px solid #D1EDF3'
      }
    },
    '&:last-child': {
      '&>td': {
        padding: '20px 24px',
        fontSize: 14,
        fontWeight: 700,
        color: '#F28C60',
        '&:first-child': {
          color: '#4A5B7A',
          borderRadius: '0 0 0 16px'
        },
        '&:last-child': {
          color: '#4A5B7A',
          borderRadius: '0 0 16px 0'
        }
      }
    },
    '&:first-child': {
      '&>td': {
        borderTop: '1px solid #D1EDF3'
      },
      '&>td:first-child': {
        borderRadius: '16px 0 0 0'
      },
      '&>td:last-child': {
        borderRadius: '0 16px 0 0'
      }
    }
  }
}));
