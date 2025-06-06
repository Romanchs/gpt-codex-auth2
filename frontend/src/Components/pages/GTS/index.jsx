import { Box } from '@mui/material';
import Grid from '@material-ui/core/Grid';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell/TableCell';
import TableRow from '@material-ui/core/TableRow';
import FindInPageRounded from '@mui/icons-material/FindInPageRounded';
import DoneRounded from '@mui/icons-material/DoneRounded';
import CheckCircleOutlineRounded from '@mui/icons-material/CheckCircleOutlineRounded';
import RadioButtonUncheckedRounded from '@mui/icons-material/RadioButtonUncheckedRounded';
import AssignmentRounded from '@mui/icons-material/AssignmentRounded';
import IconButton from '@material-ui/core/IconButton';
import moment from 'moment';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import {
  clearGts,
  getListSuccess,
  gtsDownloadDKO,
  gtsDownloadFile,
  gtsGetList,
  setGtsParams
} from '../../../actions/gtsActions';
import { checkPermissions } from '../../../util/verifyRole';
import Page from '../../Global/Page';
import TableSelect from '../../Tables/TableSelect';
import CircleButton from '../../Theme/Buttons/CircleButton';
import { GreenButton } from '../../Theme/Buttons/GreenButton';
import DatePicker from '../../Theme/Fields/DatePicker';
import SelectField from '../../Theme/Fields/SelectField';
import NotResultRow from '../../Theme/Table/NotResultRow';
import { Pagination } from '../../Theme/Table/Pagination';
import { StyledTable } from '../../Theme/Table/StyledTable';
import MultiSelect from '../../../Components/Theme/Fields/MultiSelect';
import { useFilterStyles, useSelectIconStyles } from './filterStyles';
import { TYPE_OF_ACCOUNTING_POINT } from '../../../util/directories';
import { useTranslation } from 'react-i18next';
import { pointTypeList } from '../TKO/List/config';
import useSearchLog from '../../../services/actionsLog/useSearchLog';
import useExportFileLog from '../../../services/actionsLog/useEportFileLog';
import useViewCallbackLog from '../../../services/actionsLog/useViewCallbackLog';
import { GTS_LOG_TAGS } from '../../../services/actionsLog/constants';
import VersionsByPeriod from '../../../features/versionsByPeriod';
import TableAutocomplete from '../../Tables/TableAutocomplete';
import StickyTableHead from '../../Theme/Table/StickyTableHead';

const SELECTS_DATA = {
  PRODUCT_TYPE: [
    { value: 'active', label: 'FIELDS.ACTIVE' },
    { value: 'reactive', label: 'FIELDS.REACTIVE' }
  ],
  type_accounting_point: Object.entries(TYPE_OF_ACCOUNTING_POINT).map(([value, label]) => ({ value, label })),
  customer_status: [
    { value: 'Юрособа', label: 'LEGAL_ENTITY' },
    { value: 'Фізособа', label: 'INDIVIDUAL' }
  ],
  source_type: [
    { value: 'ppko', label: 'PPKO' },
    { value: 'dh', label: 'DATAHUB' }
  ],
  zv_type: [
    { value: 'generation', label: 'ZV_TYPE.GENERATION' },
    { value: 'consumption', label: 'ZV_TYPE.CONSUMPTION' },
    { value: 'interchange', label: 'ZV_TYPE.INTERCHANGE' }
  ],
  aggregation_type: [
    { value: 'saldo_gt', label: 'SALDO > 0' },
    { value: 'saldo_lt', label: 'SALDO < 0' },
    { value: 'sum_in', label: 'IN' },
    { value: 'sum_out', label: 'OUT' }
  ]
};

const TYPES = {
  Z: 'z',
  ZV: 'zv',
  ZV_INNER: 'zv-custom'
};

const COLUMNS = {
  [TYPES.Z]: [
    { id: 'mp', label: 'EIC_CODE_AP', minWidth: 150 },
    { id: 'customer_status', label: 'GRID_CUSTOMER__STATUS', minWidth: 100 },
    { id: 'mga_id', label: 'FIELDS.METERING_GRID_AREA_EIC', minWidth: 100 },
    { id: 'type_accounting_point', label: 'FIELDS.TYPE_ACCOUNTING_POINT', minWidth: 100 },
    { id: 'in_ts', label: 'IN', minWidth: 100 },
    { id: 'out_ts', label: 'OUT', minWidth: 100 }
  ],
  [TYPES.ZV]: [
    { id: 'zv_eic', label: 'FIELDS.EIC_CODE', minWidth: 150 },
    { id: 'source_type', label: 'FIELDS.SOURCE', minWidth: 100 },
    { id: 'zv_short_name', label: 'FIELDS.SHORT_NAME', minWidth: 100 },
    { id: 'mga_eic', label: 'FIELDS.MGA_EIC', minWidth: 100 },
    { id: 'y_w2_eic', label: 'FIELDS.Y_W2_EIC', minWidth: 100 },
    { id: 'zv_type', label: 'FIELDS.CODE_TYPE', minWidth: 100 },
    { id: 'in_ts', label: 'IN', minWidth: 100 },
    { id: 'out_ts', label: 'OUT', minWidth: 100 }
  ],
  [TYPES.ZV_INNER]: [
    { id: 'zv_eic', label: 'FIELDS.EIC_CODE', minWidth: 80 },
    { id: 'group_name', label: 'FIELDS.AGREGATION_NAME', minWidth: 300 },
    { id: 'description', label: 'FIELDS.ZV_CHARACTERISTICS', minWidth: 300 },
    { id: 'aggregation_type', label: 'FIELDS.AGREGATION_TYPE', minWidth: 50 },
    { id: 'in_ts', label: 'IN', minWidth: 100 },
    { id: 'out_ts', label: 'OUT', minWidth: 100 }
  ]
};

const defaultFilters = {
  type: TYPES.Z,
  point_type: pointTypeList[0].value,
  product_type: SELECTS_DATA.PRODUCT_TYPE[0].value,
  version: null,
  period_from: null,
  period_to: null,
  page: 1,
  size: 25
};

export const GTS_TKO_LIST_VIEW_ACCEPT_ROLES = [
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
  'ОМ'
];

const GTS = () => {
  const { t } = useTranslation();
  const classes = useFilterStyles();
  const iconClasses = useSelectIconStyles();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    activeRoles: [{ relation_id }]
  } = useSelector(({ user }) => user);
  const { loading, list, params } = useSelector(({ gts }) => gts);
  const [filters, setFilters] = useState(defaultFilters);
  const isInitialFilters = useRef(false);
  const timeout = useRef(null);
  const [search, setSearch] = useState({});
  const [isAll, setIsAll] = useState(false);
  const [downloadPoints, setDownloadPoints] = useState([]);
  const [downloadings, setDownloadings] = useState([]);
  const [datesError, setDatesError] = useState({ from: null, to: null });
  const searchLog = useSearchLog();
  const SHOW_DOWNLOAD_DKO = checkPermissions('GTS.TKO_LIST_VIEW.FUNCTIONS.DOWNLOAD_DKO', [
    'АКО_Процеси',
    'АКО',
    'ОДКО',
    'АДКО',
    'СВБ',
    'ОМ'
  ]);
  const IS_SHOW_JOURNAL =
    checkPermissions('GTS.TKO_LIST_VIEW.FUNCTIONS.SHOW_JOURNAL', ['АКО_Процеси', 'ОДКО']) && filters.type === TYPES.Z;

  const exportFileLog = useExportFileLog(GTS_LOG_TAGS);
  const onPaginateLog = useViewCallbackLog();

  const periodToMaxDate = useMemo(() => {
    let maxDate = moment().subtract('1', 'days');
    const maxDateFrom = filters.period_from ? moment(filters.period_from).add('1', 'years') : null;
    if (maxDateFrom && moment(maxDateFrom).isBefore(maxDate)) {
      maxDate = maxDateFrom;
    }
    return maxDate;
  }, [filters.period_from]);

  const isValidDates = useMemo(() => {
    const from = filters.period_from;
    const to = filters.period_to;
    if (!from || !to) return false;
    if (moment('2019-07-01').isAfter(from)) return false;
    if (moment(from).isAfter(to)) return false;
    if (moment(to).subtract(1, 'days').isAfter(periodToMaxDate)) return false;
    return !moment(to).isAfter(moment().subtract(1, 'days').endOf('day'));
  }, [filters.period_from, filters.period_to, periodToMaxDate]);

  useEffect(() => {
    if (!isInitialFilters.current) {
      isInitialFilters.current = true;
      setFilters((prev) => ({ ...prev, ...params }));
      setSearch(params);
    } else if (params.period_from && params.period_to) {
      dispatch(gtsGetList(params));
    }
  }, [dispatch, params, relation_id]);

  const handleOnChangeFilters = (filter) => {
    return (value) => {
      switch (filter) {
        case 'period_from':
          setFilters({ ...filters, [filter]: moment(value).startOf('day').toISOString() });
          break;
        case 'period_to':
          setFilters({ ...filters, [filter]: moment(value).endOf('day').toISOString() });
          break;
        case 'type':
          dispatch(clearGts());
          setFilters({ ...defaultFilters, [filter]: value });
          break;
        case 'pagination':
          dispatch(setGtsParams({ ...filters, ...value }));
          setFilters({ ...filters, ...value });
          onPaginateLog();
          break;
        default:
          setFilters({ ...filters, [filter]: value });
      }
    };
  };

  const prepareParams = (params) => {
    const { version, product_type, point_type, ...newParams } = params;
    if (filters.type === TYPES.Z) {
      return { ...newParams, product_type, point_type };
    }
    if (filters.type === TYPES.ZV) {
      newParams.version = version;
    }
    return newParams;
  };

  const onSearch = (id, value) => {
    setSearch({ ...search, [id]: value });
    clearTimeout(timeout.current);
    if (!value || value?.length === 0) {
      const { [id]: extraParam, ...newFilters } = prepareParams({ ...filters, page: 1 });
      dispatch(setGtsParams(newFilters));
      setFilters(newFilters);
      return;
    }
    if (id === 'mp' && value?.length !== 16) return;
    if (value.length >= 3 || id === 'source_type' || id === 'aggregation_type') {
      timeout.current = setTimeout(() => {
        if (value) {
          const newFilters = prepareParams({ ...filters, [id]: value, page: 1 });
          dispatch(setGtsParams(newFilters));
          setFilters(newFilters);
        }
        searchLog();
      }, 500);
    }
  };

  const getSearchField = (id) => {
    switch (id) {
      case 'in_ts':
      case 'out_ts':
        return null;
      case 'customer_status':
      case 'type_accounting_point':
      case 'source_type':
      case 'zv_type':
        return (
          <TableSelect
            value={search[id]}
            data={SELECTS_DATA[id].map((i) => ({ ...i, label: t(i.label) }))}
            id={id}
            onChange={onSearch}
            minWidth={80}
          />
        );
      case 'mga_id':
        return (
          <TableAutocomplete
            onSelect={(v) => onSearch(id, v?.value)}
            apiPath={'mgaEics'}
            searchBy={'mga_eic'}
            dataMarker={id}
            mapOptions={(data) =>
              data.map((i) => ({
                label: i?.metering_grid_area__eic,
                value: i?.metering_grid_area__eic,
                name: i?.metering_grid_area__name
              }))
            }
            renderOption={(props, option) => {
              const { key, ...optionProps } = props;
              return (
                <Box key={key} {...optionProps}>
                  {option.label} | {option.name}
                </Box>
              );
            }}
            filterOptions={(items, { inputValue }) =>
              items.filter((i) => i.value.toLocaleLowerCase().includes(inputValue.trim().toLocaleLowerCase()))
            }
            searchStart={1}
          />
        );
      case 'aggregation_type':
        return (
          <Box
            sx={{
              marginTop: '5px',
              '&>.MuiFormControl-root>.MuiOutlinedInput-root': {
                height: '31.6px',
                borderRadius: '4px',
                backgroundColor: '#ffffff',
                input: {
                  paddingBottom: '8px',
                  borderColor: 'transparent'
                },
                fieldset: {
                  borderWidth: 1,
                  borderRadius: '4px'
                }
              }
            }}
          >
            <MultiSelect
              label={''}
              value={SELECTS_DATA[id].filter((i) => search?.[id]?.includes(i.value))}
              list={SELECTS_DATA[id]}
              onChange={(value) =>
                onSearch(
                  id,
                  value.map((i) => i.value)
                )
              }
            />
          </Box>
        );
      default:
        return <input value={search[id] || ''} onChange={({ target }) => onSearch(id, target.value)} />;
    }
  };

  const getCellValue = (id, value) => {
    switch (id) {
      case 'type_accounting_point':
        return t(TYPE_OF_ACCOUNTING_POINT[value]);
      case 'customer_status':
      case 'source_type':
        return t(value);
      case 'zv_type':
        return t('ZV_TYPE.' + value);
      default:
        return value;
    }
  };

  const handleClickByRow = (row) => () => {
    if (checkPermissions('GTS.VIEW_DKO.ACCESS', GTS_TKO_LIST_VIEW_ACCEPT_ROLES)) {
      navigate(`/gts/${filters.type}/${row?.uid}`);
    }
  };

  const handleDownloadPoints = () => {
    const { type, product_type, ...filtersWithoutType } = filters;
    dispatch(
      gtsDownloadDKO(filters.type, {
        ...filtersWithoutType,
        included: isAll ? [] : downloadPoints,
        excluded: isAll ? downloadPoints : []
      })
    );
    setIsAll(false);
    setDownloadPoints([]);
    exportFileLog();
  };

  const handleDownload = (row) => () => {
    setDownloadings([...downloadings, row?.mp]);
    dispatch(
      gtsDownloadFile(row?.uid, row?.mp, filters, () =>
        setDownloadings((downloadings) => downloadings.filter((i) => i !== row?.mp))
      )
    );
    exportFileLog();
  };

  const handleSubmitFilters = () => {
    dispatch(setGtsParams(prepareParams(filters)));
    searchLog();
  };

  const handleSelect = (uid) => {
    setDownloadPoints(
      downloadPoints.includes(uid) ? downloadPoints.filter((i) => i !== uid) : [...downloadPoints, uid]
    );
  };
  const handleCheckedAll = () => {
    setDownloadPoints([]);
    setIsAll(!isAll);
  };
  const handleLinkButtons = (url) => {
    dispatch(setGtsParams({ page: 1, size: 25 }));
    dispatch(getListSuccess(null));
    navigate(url);
  };

  return (
    <Page
      acceptPermisions={'GTS.TKO_LIST_VIEW.ACCESS'}
      acceptRoles={GTS_TKO_LIST_VIEW_ACCEPT_ROLES}
      pageName={t('PAGES.GTS_AP')}
      faqKey={'GTS__AP'}
      backRoute={'/'}
      loading={loading}
      controls={
        <>
          {checkPermissions('GTS.TKO_LIST_VIEW.CONTROLS.UPLOAD_DKO', [
            'АКО',
            'АКО_Довідники',
            'АКО_Процеси',
            'АКО_Користувачі',
            'АКО_ППКО',
            'АКО_Суперечки',
            'ОДКО'
          ]) && (
            <CircleButton
              type={'upload'}
              title={t('CONTROLS.IMPORT_DKO')}
              dataMarker={'uploadDKO'}
              onClick={() => handleLinkButtons('/gts/files')}
            />
          )}
          {checkPermissions('GTS.REPORTS.ACCES', GTS_TKO_LIST_VIEW_ACCEPT_ROLES) && (
            <CircleButton
              type={'document'}
              title={t('PAGES.REPORTS')}
              onClick={() => handleLinkButtons('/gts/reports')}
            />
          )}

          {checkPermissions('GTS.TKO_LIST_VIEW.CONTROLS.REGION_BALANCE', ['АКО_Процеси', 'ОМ']) && (
            <CircleButton
              icon={<FindInPageRounded />}
              title={t('PAGES.REGION_BALANCE')}
              dataMarker={'regionBalance'}
              onClick={() => handleLinkButtons('/gts/region-balance/')}
            />
          )}
          {(filters.type === TYPES.ZV || filters.type === TYPES.ZV_INNER) && (
            <CircleButton
              type={'download'}
              title={t('CONTROLS.EXPORT_DKO')}
              dataMarker={'export'}
              onClick={handleDownloadPoints}
              disabled={!isAll && downloadPoints.length === 0}
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
              <SelectField
                label={t('FIELDS.TKO_TYPE')}
                value={filters.type}
                data={[
                  { value: TYPES.Z, label: 'FIELDS.EIC_Z', visible: true },
                  {
                    value: TYPES.ZV,
                    label: 'FIELDS.EIC_ZV',
                    visible: checkPermissions('GTS.TKO_LIST_VIEW.FUNCTIONS.SHOW_ZV', GTS_TKO_LIST_VIEW_ACCEPT_ROLES)
                  },
                  {
                    value: TYPES.ZV_INNER,
                    label: 'FIELDS.ZV_CUSTOM',
                    visible: checkPermissions('GTS.TKO_LIST_VIEW.FUNCTIONS.SHOW_ZV_CUSTOM', ['АКО_Процеси'])
                  }
                ].filter((i) => i.visible)}
                onChange={handleOnChangeFilters('type')}
              />
            </Grid>
            {filters.type === TYPES.Z && (
              <Grid item xs={12} sm={6} md={3}>
                <SelectField
                  label={t('FIELDS.AP_TYPE')}
                  value={filters.point_type}
                  data={[
                    { value: 'installation_ap', label: 'PLATFORM.INSTALLATION_AP', visible: true },
                    {
                      value: 'generation',
                      label: 'PLATFORM.GENERATION',
                      visible: checkPermissions(
                        'GTS.TKO_LIST_VIEW.FUNCTIONS.POINT_TYPE_LIST.GENERATION',
                        GTS_TKO_LIST_VIEW_ACCEPT_ROLES
                      )
                    },
                    {
                      value: 'own_consumption',
                      label: 'PLATFORM.OWN_CONSUMPTION',
                      visible: checkPermissions(
                        'GTS.TKO_LIST_VIEW.FUNCTIONS.POINT_TYPE_LIST.OWN_CONSUMPTION',
                        GTS_TKO_LIST_VIEW_ACCEPT_ROLES
                      )
                    },
                    {
                      value: 'accumulation_consumption',
                      label: 'CHARACTERISTICS.ACCUMULATION_FOR_PRODUCTION_NEEDS',
                      visible: checkPermissions(
                        'GTS.TKO_LIST_VIEW.FUNCTIONS.POINT_TYPE_LIST.ACCUMULATION_CONSUMPTION',
                        GTS_TKO_LIST_VIEW_ACCEPT_ROLES
                      )
                    },
                    {
                      value: 'generation_unit',
                      label: 'PLATFORM.GENERATION_UNIT',
                      visible: checkPermissions(
                        'GTS.TKO_LIST_VIEW.FUNCTIONS.POINT_TYPE_LIST.GENERATION_UNIT',
                        GTS_TKO_LIST_VIEW_ACCEPT_ROLES
                      )
                    },
                    {
                      value: 'by_voltage_level',
                      label: 'PLATFORM.BY_VOLTAGE_LEVEL',
                      visible: checkPermissions(
                        'GTS.TKO_LIST_VIEW.FUNCTIONS.POINT_TYPE_LIST.BY_VOLTAGE_LEVEL',
                        GTS_TKO_LIST_VIEW_ACCEPT_ROLES
                      )
                    },
                    {
                      value: 'by_grid_party',
                      label: 'PLATFORM.BY_GRID_PARTY',
                      visible: checkPermissions(
                        'GTS.TKO_LIST_VIEW.FUNCTIONS.POINT_TYPE_LIST.BY_GRID_PARTY',
                        GTS_TKO_LIST_VIEW_ACCEPT_ROLES
                      )
                    },
                    {
                      value: 'queue_generation',
                      label: 'PLATFORM.QUEUE_GENERATION',
                      visible: checkPermissions(
                        'GTS.TKO_LIST_VIEW.FUNCTIONS.POINT_TYPE_LIST.QUEUE_GENERATION',
                        GTS_TKO_LIST_VIEW_ACCEPT_ROLES
                      )
                    },
                    {
                      value: 'standard_unit',
                      label: 'PLATFORM.REFERENCE_UNIT_OF_RELEASE',
                      visible: checkPermissions(
                        'GTS.TKO_LIST_VIEW.FUNCTIONS.POINT_TYPE_LIST.STANDARD_UNIT',
                        GTS_TKO_LIST_VIEW_ACCEPT_ROLES
                      )
                    }
                  ].filter((i) => i.visible)}
                  onChange={handleOnChangeFilters('point_type')}
                />
              </Grid>
            )}
            {filters.type === TYPES.Z && (
              <Grid item xs={12} sm={6} md={2}>
                <SelectField
                  label={t('FIELDS.ENERGY_TYPE')}
                  value={filters.product_type}
                  data={SELECTS_DATA.PRODUCT_TYPE}
                  onChange={handleOnChangeFilters('product_type')}
                />
              </Grid>
            )}
            <Grid item xs={12} sm={6} md={2}>
              <DatePicker
                label={t('FIELDS.PERIOD_FROM')}
                onError={(from) => setDatesError({ ...datesError, from })}
                value={filters.period_from}
                minDate={moment('2019-07-01')}
                maxDate={filters.period_to || moment().subtract('1', 'days')}
                onChange={handleOnChangeFilters('period_from')}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <DatePicker
                label={t('FIELDS.PERIOD_TO')}
                onError={(to) => setDatesError({ ...datesError, to })}
                value={filters.period_to}
                minDate={filters.period_from || moment('2019-07-01')}
                maxDate={periodToMaxDate}
                onChange={handleOnChangeFilters('period_to')}
              />
            </Grid>
            {filters.type === TYPES.ZV && (
              <Grid item xs={12} sm={6} md={2}>
                <VersionsByPeriod
                  label={t('FIELDS.VERSION')}
                  value={filters.version}
                  onChange={handleOnChangeFilters('version')}
                  from_date={filters.period_from}
                  to_date={filters.period_to}
                  datesError={datesError}
                  useNull
                />
              </Grid>
            )}
          </Grid>
          <GreenButton
            style={{ borderRadius: 20, padding: '0 16px', height: 32 }}
            onClick={handleSubmitFilters}
            disabled={!isValidDates}
          >
            <DoneRounded />
            {t('CONTROLS.ENGAGE')}
          </GreenButton>
        </div>
      </div>
      <StyledTable>
        <StickyTableHead>
          <TableRow>
            {COLUMNS[filters.type].map(({ id, label, minWidth }) => (
              <TableCell style={{ minWidth }} className={'MuiTableCell-head'} key={id}>
                {id === 'in_ts' || id === 'out_ts' ? (
                  <p>
                    {t(label)} (
                    {filters.product_type === 'reactive'
                      ? t('FIELDS.REACTIVE_DIMENSION')
                      : t('FIELDS.ACTIVE_DIMENSION')}
                    )
                  </p>
                ) : (
                  <p>{t(label)}</p>
                )}
                {getSearchField(id)}
              </TableCell>
            ))}
            {(filters.type === TYPES.ZV || filters.type === TYPES.ZV_INNER) && (
              <TableCell className={'MuiTableCell-head'}>
                <div className={`${iconClasses.checkedField} ${isAll ? iconClasses.checkedField + '--checked' : ''}`}>
                  <p>{t('ALL')}</p>
                  <SelectIcon classes={iconClasses} isSelect={isAll} handleSelect={handleCheckedAll} />
                </div>
              </TableCell>
            )}
            {filters.type === TYPES.Z && SHOW_DOWNLOAD_DKO && <TableCell className={'MuiTableCell-head'}></TableCell>}
            {IS_SHOW_JOURNAL && <TableCell className={'MuiTableCell-head'}></TableCell>}
          </TableRow>
        </StickyTableHead>
        <TableBody>
          {list?.data?.length > 0 ? (
            list?.data?.map((row, index) => (
              <TableRow key={'row' + index} hover data-marker="table-row" className="body__table-row">
                {COLUMNS[filters.type].map(({ id }) => (
                  <TableCell key={'cell' + id} data-marker={id} onClick={handleClickByRow(row)}>
                    {getCellValue(id, row[id])}
                  </TableCell>
                ))}
                {(filters.type === TYPES.ZV || filters.type === TYPES.ZV_INNER) && (
                  <TableCell data-marker={'select'} align={'center'}>
                    <SelectIcon
                      classes={iconClasses}
                      isSelect={isAll ? !downloadPoints.includes(row.uid) : downloadPoints.includes(row.uid)}
                      handleSelect={() => handleSelect(row.uid)}
                    />
                  </TableCell>
                )}
                {IS_SHOW_JOURNAL && (
                  <TableCell data-marker={'info'}>
                    <CircleButton
                      title={t('PAGES.JOURNAL')}
                      color={'blue'}
                      size={'small'}
                      icon={<AssignmentRounded />}
                      onClick={() => navigate(`/gts/info-uploaded-dko/${row?.mp}`, { state: { filters } })}
                      dataMarker={'to-journal'}
                    />
                  </TableCell>
                )}
                {filters.type === TYPES.Z && SHOW_DOWNLOAD_DKO && (
                  <TableCell data-marker={'download'}>
                    {downloadings.find((i) => i === row?.mp) ? (
                      <CircleButton type={'loading'} size={'small'} title={`${t('FORMATTING_FILE')}...`} />
                    ) : (
                      <CircleButton
                        size={'small'}
                        type={'download'}
                        title={t('CONTROLS.EXPORT_DKO')}
                        onClick={handleDownload(row)}
                      />
                    )}
                  </TableCell>
                )}
              </TableRow>
            ))
          ) : (
            <NotResultRow span={10} text={t('NOTHING_FOUND')} />
          )}
        </TableBody>
      </StyledTable>
      <Pagination {...list} loading={loading} params={filters} onPaginate={handleOnChangeFilters('pagination')} />
    </Page>
  );
};

export default GTS;

const SelectIcon = ({ isSelect, handleSelect, classes }) => (
  <IconButton
    aria-label={'select row'}
    size={'small'}
    onClick={handleSelect}
    className={`${classes.selectIcon} ${isSelect ? classes.selectIcon + '--checked' : ''}`}
    data-marker={isSelect ? 'selected' : 'not-selected'}
  >
    {isSelect ? <CheckCircleOutlineRounded /> : <RadioButtonUncheckedRounded />}
  </IconButton>
);
