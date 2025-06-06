import { Box, Grid, TableBody, TableRow } from '@mui/material';
import TableCell from '@material-ui/core/TableCell/TableCell';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { setTkoParams } from '../../../../actions/tkoActions';
import { useFuelListTKOQuery, useTkoDataTKOQuery, useVoltageListTKOQuery } from '../api';
import { checkPermissions } from '../../../../util/verifyRole';
import Page from '../../../Global/Page';
import TableSelect from '../../../Tables/TableSelect';
import SelectField from '../../../Theme/Fields/SelectField';
import NotResultRow from '../../../Theme/Table/NotResultRow';
import { Pagination } from '../../../Theme/Table/Pagination';
import { StyledTable } from '../../../Theme/Table/StyledTable';
import { CONNECTION_STATUSES } from '../TkoData';
import { useNavigate } from 'react-router-dom';
import TableAutocomplete from '../../../Tables/TableAutocomplete';
import { useTranslation } from 'react-i18next';
import { DISCREPANCIES, MARKERS_DATA, TYPE_OF_ACCOUNTING_POINT } from '../../../../util/directories';
import useSearchLog from '../../../../services/actionsLog/useSearchLog';
import useViewDataLog from '../../../../services/actionsLog/useViewDataLog';
import useViewDataCallbackLog from '../../../../services/actionsLog/useViewDataCallbackLog';
import { DEFAULT_SEARCH_START, defaultParams, pointTypeList } from './config';
import StickyTableHead from '../../../Theme/Table/StickyTableHead';

const COLUMNS = {
  installation_ap: [
    { id: 'customer_status', label: 'PLATFORM.CONSUMER', minWidth: 62, optional: true, list: 'CUSTOMERS' },
    { id: 'type_accounting_point', label: 'PLATFORM.TYPE_OF_SITE', minWidth: 150, list: 'POINT_TYPES' },
    { id: 'mp', label: 'FIELDS.EIC_CODE', minWidth: 136, searchStart: 16 },
    { id: 'connection_status', label: 'FIELDS.CONNECTION_STATUS', minWidth: 92, list: 'STATUSES' },
    { id: 'customer', label: 'CHARACTERISTICS.CODE_OWNER_AP', minWidth: 98, searchStart: 6 },
    { id: 'region', label: 'CHARACTERISTICS.REGION', minWidth: 131, searchStart: 3 },
    { id: 'balance_supplier', label: 'CHARACTERISTICS.BALANCE_SUPPLIER', minWidth: 153, searchStart: 1 },
    {
      id: 'metered_data_responsible',
      label: 'CHARACTERISTICS.METERED_DATA_RESPONSIBLE',
      minWidth: 181,
      searchStart: 1
    },
    { id: 'metering_grid_area_name', label: 'CHARACTERISTICS.METERING_GRID_AREA_NAME', minWidth: 190, searchStart: 1 }
  ],
  generation: [
    { id: 'spid', label: 'FIELDS.EIC_CODE', minWidth: 150, searchStart: 16 },
    { id: 'apid', label: 'CHARACTERISTICS.EIC_CODE_OF_SITE', minWidth: 150, searchStart: 16 },
    { id: 'customer_idp', label: 'CHARACTERISTICS.EDRPOU_SPM_CONSUMER', minWidth: 150, searchStart: 8 },
    { id: 'metering_point_administrator', label: 'ROLES.METERING_POINT_ADMINISTRATOR', minWidth: 500, searchStart: 3 }
  ],
  own_consumption: [
    { id: 'spid', label: 'FIELDS.EIC_CODE', minWidth: 150, searchStart: 16 },
    { id: 'apid', label: 'CHARACTERISTICS.EIC_CODE_OF_SITE', minWidth: 150, searchStart: 16 },
    { id: 'customer_idp', label: 'CHARACTERISTICS.EDRPOU_SPM_CONSUMER', minWidth: 150, searchStart: 8 },
    { id: 'metering_point_administrator', label: 'ROLES.METERING_POINT_ADMINISTRATOR', minWidth: 500, searchStart: 3 }
  ],
  accumulation_consumption: [
    { id: 'spid', label: 'FIELDS.EIC_CODE', minWidth: 150, searchStart: 16 },
    { id: 'apid', label: 'CHARACTERISTICS.EIC_CODE_OF_SITE', minWidth: 150, searchStart: 16 },
    { id: 'customer_idp', label: 'CHARACTERISTICS.EDRPOU_SPM_CONSUMER', minWidth: 150, searchStart: 8 },
    { id: 'metering_point_administrator', label: 'ROLES.METERING_POINT_ADMINISTRATOR', minWidth: 500, searchStart: 3 }
  ],
  consumption_in_static_capacitor: [
    { id: 'spid', label: 'FIELDS.EIC_CODE', minWidth: 150, searchStart: 16 },
    { id: 'apid', label: 'CHARACTERISTICS.EIC_CODE_OF_SITE', minWidth: 150, searchStart: 16 },
    { id: 'customer_idp', label: 'CHARACTERISTICS.EDRPOU_SPM_CONSUMER', minWidth: 150, searchStart: 8 },
    { id: 'metering_point_administrator', label: 'ROLES.METERING_POINT_ADMINISTRATOR', minWidth: 500, searchStart: 3 }
  ],
  consumption: [
    { id: 'spid', label: 'FIELDS.EIC_CODE', minWidth: 150, searchStart: 16 },
    { id: 'apid', label: 'CHARACTERISTICS.EIC_CODE_OF_SITE', minWidth: 150, searchStart: 16 },
    { id: 'customer_idp', label: 'CHARACTERISTICS.EDRPOU_SPM_CONSUMER', minWidth: 150, searchStart: 8 },
    { id: 'metering_point_administrator', label: 'ROLES.METERING_POINT_ADMINISTRATOR', minWidth: 500, searchStart: 3 }
  ],
  release_generation_unit: [
    { id: 'spid', label: 'FIELDS.EIC_CODE', minWidth: 150, searchStart: 16 },
    { id: 'apid', label: 'CHARACTERISTICS.EIC_CODE_OF_SITE', minWidth: 150, searchStart: 16 },
    { id: 'customer_idp', label: 'CHARACTERISTICS.EDRPOU_SPM_CONSUMER', minWidth: 150, searchStart: 8 },
    { id: 'metering_point_administrator', label: 'ROLES.METERING_POINT_ADMINISTRATOR', minWidth: 500, searchStart: 3 }
  ],
  losses: [
    { id: 'spid', label: 'FIELDS.EIC_CODE', minWidth: 150, searchStart: 16 },
    { id: 'apid', label: 'CHARACTERISTICS.EIC_CODE_OF_SITE', minWidth: 150, searchStart: 16 },
    { id: 'customer_idp', label: 'CHARACTERISTICS.EDRPOU_SPM_CONSUMER', minWidth: 150, searchStart: 8 },
    { id: 'voltage_level', label: 'CHARACTERISTICS.VOLTAGE_LEVEL', minWidth: 150, list: 'VOLTAGE_LEVEL' },
    { id: 'metering_point_administrator', label: 'ROLES.METERING_POINT_ADMINISTRATOR', minWidth: 500, searchStart: 3 }
  ],
  generation_unit: [
    { id: 'spid', label: 'FIELDS.EIC_CODE', minWidth: 150, searchStart: 16 },
    { id: 'apid', label: 'CHARACTERISTICS.EIC_CODE_OF_SITE', minWidth: 150, searchStart: 16 },
    { id: 'customer_idp', label: 'CHARACTERISTICS.EDRPOU_SPM_CONSUMER', minWidth: 150, searchStart: 8 },
    { id: 'voltage_level', label: 'CHARACTERISTICS.VOLTAGE_LEVEL', minWidth: 150, list: 'VOLTAGE_LEVEL' },
    { id: 'metering_point_administrator', label: 'ROLES.METERING_POINT_ADMINISTRATOR', minWidth: 400, searchStart: 3 },
    { id: 'fuel', label: 'CHARACTERISTICS.FUEL_TYPE', minWidth: 100, list: 'FUEL' },
    { id: 'idsp_1', label: 'CHARACTERISTICS.EIC_QUEUE_CODE', minWidth: 150, searchStart: 16 }
  ],
  ts_generation_unit: [
    { id: 'spid', label: 'FIELDS.EIC_CODE', minWidth: 150, searchStart: 16 },
    { id: 'apid', label: 'CHARACTERISTICS.EIC_CODE_OF_SITE', minWidth: 150, searchStart: 16 },
    { id: 'customer_idp', label: 'CHARACTERISTICS.EDRPOU_SPM_CONSUMER', minWidth: 150, searchStart: 8 },
    { id: 'voltage_level', label: 'CHARACTERISTICS.VOLTAGE_LEVEL', minWidth: 150, list: 'VOLTAGE_LEVEL' },
    { id: 'metering_point_administrator', label: 'ROLES.METERING_POINT_ADMINISTRATOR', minWidth: 400, searchStart: 3 },
    { id: 'fuel', label: 'CHARACTERISTICS.FUEL_TYPE', minWidth: 100, list: 'FUEL' },
    { id: 'idsp_1', label: 'CHARACTERISTICS.EIC_QUEUE_CODE', minWidth: 150, searchStart: 16 }
  ],
  by_voltage_level: [
    { id: 'spid', label: 'FIELDS.EIC_CODE', minWidth: 150, searchStart: 16 },
    { id: 'apid', label: 'CHARACTERISTICS.EIC_CODE_OF_SITE', minWidth: 150, searchStart: 16 },
    { id: 'customer_idp', label: 'CHARACTERISTICS.EDRPOU_SPM_CONSUMER', minWidth: 150, searchStart: 8 },
    { id: 'voltage_level', label: 'CHARACTERISTICS.VOLTAGE_LEVEL', minWidth: 150, list: 'VOLTAGE_LEVEL' },
    { id: 'metering_point_administrator', label: 'ROLES.METERING_POINT_ADMINISTRATOR', minWidth: 500, searchStart: 3 }
  ],
  by_grid_party: [
    { id: 'spid', label: 'FIELDS.EIC_CODE', minWidth: 150, searchStart: 16 },
    { id: 'apid', label: 'CHARACTERISTICS.EIC_CODE_OF_SITE', minWidth: 150, searchStart: 16 },
    { id: 'customer_idp', label: 'CHARACTERISTICS.EDRPOU_SPM_CONSUMER', minWidth: 150, searchStart: 8 },
    { id: 'voltage_level', label: 'CHARACTERISTICS.VOLTAGE_LEVEL', minWidth: 150, list: 'VOLTAGE_LEVEL' },
    { id: 'metering_point_administrator', label: 'ROLES.METERING_POINT_ADMINISTRATOR', minWidth: 400, searchStart: 3 },
    { id: 'spid_communicating_side', label: 'CHARACTERISTICS.ADJACENT_SIDE', minWidth: 150, searchStart: 16 }
  ],
  queue_generation: [
    { id: 'spid', label: 'FIELDS.EIC_CODE', minWidth: 150, searchStart: 16 },
    { id: 'apid', label: 'CHARACTERISTICS.EIC_CODE_OF_SITE', minWidth: 150, searchStart: 16 },
    { id: 'customer_idp', label: 'CHARACTERISTICS.EDRPOU_SPM_CONSUMER', minWidth: 150, searchStart: 8 },
    { id: 'voltage_level', label: 'CHARACTERISTICS.VOLTAGE_LEVEL', minWidth: 150, list: 'VOLTAGE_LEVEL' },
    { id: 'metering_point_administrator', label: 'ROLES.METERING_POINT_ADMINISTRATOR', minWidth: 500, searchStart: 3 }
  ],
  standard_unit: [
    { id: 'spid', label: 'FIELDS.EIC_CODE', minWidth: 150, searchStart: 16 },
    { id: 'apid', label: 'CHARACTERISTICS.EIC_CODE_OF_SITE', minWidth: 150, searchStart: 16 },
    { id: 'customer_idp', label: 'CHARACTERISTICS.EDRPOU_SPM_CONSUMER', minWidth: 150, searchStart: 8 },
    { id: 'primary_spare', label: 'CHARACTERISTICS.PRIMARY_BACKUP', minWidth: 150, list: 'PRIMARY_SPARE' },
    { id: 'metering_point_administrator', label: 'ROLES.METERING_POINT_ADMINISTRATOR', minWidth: 500, searchStart: 3 }
  ],
  meter: [
    { id: 'spid', label: 'FIELDS.EIC_CODE', minWidth: 150, searchStart: 16 },
    { id: 'idsp_1', label: 'CHARACTERISTICS.EIC_CODE_OF_SITE', minWidth: 150, searchStart: 16 },
    {
      id: 'voltage_level',
      label: 'CHARACTERISTICS.VOLTAGE_LEVEL',
      minWidth: 150,
      searchStart: 8,
      list: 'VOLTAGE_LEVEL'
    },
    {
      id: 'mismatch_block',
      label: 'CHARACTERISTICS.DISCREPANCIES',
      minWidth: 150,
      searchStart: 16,
      list: 'DISCREPANCIES'
    }
  ],
  consumption_for_non_domestic_needs: [
    { id: 'spid', label: 'FIELDS.EIC_CODE', minWidth: 150, searchStart: 16 },
    { id: 'apid', label: 'CHARACTERISTICS.EIC_CODE_OF_SITE', minWidth: 150, searchStart: 16 },
    { id: 'customer_idp', label: 'CHARACTERISTICS.EDRPOU_SPM_CONSUMER', minWidth: 150, searchStart: 8 },
    { id: 'metering_point_administrator', label: 'ROLES.METERING_POINT_ADMINISTRATOR', minWidth: 500, searchStart: 3 }
  ],
  consumption_for_domestic_needs: [
    { id: 'spid', label: 'FIELDS.EIC_CODE', minWidth: 150, searchStart: 16 },
    { id: 'apid', label: 'CHARACTERISTICS.EIC_CODE_OF_SITE', minWidth: 150, searchStart: 16 },
    { id: 'customer_idp', label: 'CHARACTERISTICS.EDRPOU_SPM_CONSUMER', minWidth: 150, searchStart: 8 },
    { id: 'metering_point_administrator', label: 'ROLES.METERING_POINT_ADMINISTRATOR', minWidth: 500, searchStart: 3 }
  ]
};

const LISTS = {
  CUSTOMERS: Object.entries(MARKERS_DATA).map(([value, label]) => ({ value, label })),
  STATUSES: Object.entries(CONNECTION_STATUSES)
    .map(([value, label]) => ({ value, label }))
    .sort((a, b) => a.label.localeCompare(b.label)),
  FUEL: [],
  VOLTAGE_LEVEL: [],
  DISCREPANCIES: Object.entries(DISCREPANCIES).map(([value, label]) => ({ value, label })),
  POINT_TYPES: Object.entries(TYPE_OF_ACCOUNTING_POINT).map(([value, label]) => ({ value, label })),
  PRIMARY_SPARE: ['PRIMARY', 'BACKUP'].map((value) => ({ value, label: `CHARACTERISTICS.${value}` }))
};

const TkoList = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const { params } = useSelector((store) => store.tko);
  const [timeOut, setTimeOut] = useState(null);
  const [search, setSearch] = useState(params);
  const searchLog = useSearchLog(['Реєстр ТКО']);

  const viewDataLog = useViewDataLog(['Реєстр ТКО'], 'ap');
  const onPaginateLog = useViewDataCallbackLog(['Реєстр ТКО'], 'ap');

  useEffect(() => viewDataLog(), [viewDataLog]);

  const showOptionCell = checkPermissions('TKO.LIST.TABLE_CELLS.CUSTOMER_STATUS', [
    'АКО',
    'АКО_Користувачі',
    'АКО_Процеси',
    'АТКО'
  ]);

  const isDisabledApType = pointTypeList.filter((i) => i.visible()).length < 2;

  const { currentData, isFetching } = useTkoDataTKOQuery({
    ...params,
    metering_grid_area_name: params?.metering_grid_area_name?.value || undefined,
    balance_supplier: params?.balance_supplier?.value || undefined,
    metered_data_responsible: params?.metered_data_responsible?.value || undefined,
    metering_point_administrator: params?.metering_point_administrator?.value || undefined
  });

  const { currentData: fuelList, isFetching: isLoadingFuel } = useFuelListTKOQuery();

  if (fuelList) {
    LISTS.FUEL = fuelList?.map((i) => ({
      value: i.value.name_ua,
      label: i18n.language === 'ua' ? i.value.name_ua : i.value.name_en
    }));
  }

  const { currentData: voltageList, isFetching: isLoadingVoltage } = useVoltageListTKOQuery();

  if (voltageList) LISTS.VOLTAGE_LEVEL = voltageList;

  const onSearch = (key, value, isListValue) => {
    setSearch({ ...search, [key]: value });
    clearTimeout(timeOut);

    if (
      value &&
      !isListValue &&
      value.length !== 0 &&
      value.length < (COLUMNS[params.point_type].find((i) => i.id === key)?.searchStart || DEFAULT_SEARCH_START)
    )
      return;

    setTimeOut(
      setTimeout(() => {
        const newParams = { ...params, ...search, page: 1 };
        if (value) newParams[key] = value;
        else delete newParams[key];

        dispatch(setTkoParams(newParams));
        setSearch(newParams);
        searchLog();
      }, 500)
    );
  };

  const renderCellFilter = (id, list) => {
    if (list) {
      return (
        <TableSelect
          id={id}
          value={search[id]}
          data={LISTS[list]?.map((i) => ({ ...i, label: t(i.label) }))}
          onChange={(k, v) => onSearch(k, v, true)}
        />
      );
    }
    if (id === 'balance_supplier' || id === 'metered_data_responsible' || id === 'metering_point_administrator') {
      return (
        <TableAutocomplete
          onSelect={(v) => onSearch(id, v)}
          apiPath={'publicCompaniesList'}
          defaultValue={params[id]?.label}
          searchBy={'name'}
          dataMarker={id}
          mapOptions={(data) => data.map((i) => ({ label: i.short_name, value: i.eic }))}
          searchStart={COLUMNS[params.point_type].find((i) => i.id === id).searchStart}
          filterOptions={(items) => items}
        />
      );
    }
    if (id === 'metering_grid_area_name') {
      return (
        <TableAutocomplete
          onSelect={(v) => onSearch(id, v)}
          apiPath={'referenceBookKV'}
          defaultValue={params[id]?.label}
          prefetchAll
          dataMarker={id}
          mapOptions={(data) => data.map((i) => ({ label: i.label, value: i.eic }))}
          searchStart={COLUMNS[params.point_type].find((i) => i.id === 'metering_grid_area_name').searchStart}
        />
      );
    }

    return <input type="text" value={search[id] || ''} onChange={({ target }) => onSearch(id, target.value)} />;
  };

  return (
    <Page
      pageName={t('PAGES.AP')}
      backRoute={'/'}
      loading={isFetching || isLoadingFuel || isLoadingVoltage}
      faqKey={'INFORMATION_BASE__AP'}
      acceptPermisions={'TKO.ACCESS'}
      rejectRoles={['АР (перегляд розширено)', 'АР', 'Адміністратор АР', 'АКО/АР_ZV', 'Третя сторона']}
    >
      <Box className={'boxShadow'} style={{ padding: '20px 24px 16px', marginBottom: 16 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} xl={3}>
            <SelectField
              label={t('CHARACTERISTICS.AP_TYPE')}
              value={params.point_type}
              data={pointTypeList.filter((i) => i.visible())}
              onChange={(v) => {
                const newParams = { ...defaultParams, point_type: v };
                setSearch(newParams);
                dispatch(setTkoParams(newParams));
                searchLog();
              }}
              disabled={isDisabledApType}
            />
          </Grid>
        </Grid>
      </Box>
      <StyledTable>
        <StickyTableHead>
          <TableRow>
            {COLUMNS[params.point_type]?.map(
              ({ id, label, minWidth, optional, list }) =>
                (!optional || (optional && showOptionCell)) && (
                  <TableCell
                    style={{ minWidth: minWidth }}
                    className={'MuiTableCell-head'}
                    key={`${params.point_type}-${id}`}
                    align={'left'}
                  >
                    <p>{t(label)}</p>
                    {renderCellFilter(id, list)}
                  </TableCell>
                )
            )}
          </TableRow>
        </StickyTableHead>
        <TableBody>
          {currentData?.data?.length > 0 ? (
            currentData?.data?.map((rowData, rowIndex) => <Row key={`row-${rowIndex}`} data={rowData} />)
          ) : (
            <NotResultRow span={COLUMNS[params.point_type]?.length} text={t('NO_AP_FOUND')} />
          )}
        </TableBody>
      </StyledTable>
      <Pagination
        {...currentData}
        loading={isFetching}
        params={params}
        elementsName={t('CHARACTERISTICS.AP')}
        onPaginate={(v) => {
          dispatch(setTkoParams({ ...params, ...v }));
          onPaginateLog();
        }}
      />
    </Page>
  );
};

const Row = ({ data }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { params } = useSelector((store) => store.tko);
  const showOptionCell = checkPermissions('TKO.LIST.TABLE_CELLS.CUSTOMER_STATUS', [
    'АКО',
    'АКО_Користувачі',
    'АКО_Процеси',
    'АТКО'
  ]);

  const handleClick = () => {
    if (window.getSelection().toString()) return;
    navigate(`/tko/${data.uid}`);
  };

  const renderCellValue = (id, value) => {
    switch (id) {
      case 'connection_status':
        return t(CONNECTION_STATUSES[value]);
      case 'primary_spare':
        return t(`CHARACTERISTICS.${value.toUpperCase()}`);
      case 'customer_status':
        return value ? t(`MARKERS_DATA.${value?.toUpperCase()}`) : '-';
      case 'type_accounting_point': {
        return t(`TYPE_OF_ACCOUNTING_POINT.${value?.toUpperCase()}`);
      }
      default:
        return value;
    }
  };

  return (
    <>
      <TableRow hover data-marker="table-row" className="body__table-row" onClick={handleClick}>
        {COLUMNS[params.point_type]?.map(
          ({ id, optional, minWidth }) =>
            (!optional || (optional && showOptionCell)) && (
              <TableCell
                data-marker={id}
                key={'cell-' + id}
                style={{ maxWidth: minWidth + 3, overflow: 'hidden', textOverflow: 'ellipsis' }}
              >
                {renderCellValue(id, data[id])}
              </TableCell>
            )
        )}
      </TableRow>
    </>
  );
};

export default TkoList;
