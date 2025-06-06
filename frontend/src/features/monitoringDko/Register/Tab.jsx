import { TableBody, TableCell, TableRow } from '@material-ui/core';
import moment from 'moment';
import WarningRounded from '@mui/icons-material/WarningRounded';
import DoneRounded from '@mui/icons-material/DoneRounded';
import Grid from '@material-ui/core/Grid';
import { useMemo, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';

import { downloadFileById } from '../../../actions/massLoadActions';
import { StyledTable } from '../../../Components/Theme/Table/StyledTable';
import TableSelect from '../../../Components/Tables/TableSelect';
import DatePicker from '../../../Components/Theme/Fields/DatePicker';
import NotResultRow from '../../../Components/Theme/Table/NotResultRow';
import CircleButton from '../../../Components/Theme/Buttons/CircleButton';
import { GreenButton } from '../../../Components/Theme/Buttons/GreenButton';
import { LightTooltip } from '../../../Components/Theme/Components/LightTooltip';
import { Pagination } from '../../../Components/Theme/Table/Pagination';
import SelectField from '../../../Components/Theme/Fields/SelectField';
import { useTableStyles } from '../filterStyles';
import { useGetListMDRQuery } from './api';
import i18n from '../../../i18n/i18n';
import { useTranslation } from 'react-i18next';
import useExportFileLog from '../../../services/actionsLog/useEportFileLog';
import useViewCallbackLog from '../../../services/actionsLog/useViewCallbackLog';
import useSearchLog from '../../../services/actionsLog/useSearchLog';
import { MONITORING_DKO_LOG_TAGS } from '../../../services/actionsLog/constants';
import StickyTableHead from '../../../Components/Theme/Table/StickyTableHead';

const columns = [
  { id: 'mdr_name', label: 'FIELDS.PPKO_NAME', minWidth: 200 },
  { id: 'mdr_eic', label: 'FIELDS.EIC_PPKO', minWidth: 120 },
  { id: 'mga_name', label: 'FIELDS.AREA_NAME', minWidth: 200 },
  { id: 'mga_eic', label: 'FIELDS.METERING_GRID_AREA_EIC', minWidth: 120 },
  { id: 'initiator_name', label: 'FIELDS.AUTOR', minWidth: 140 },
  { id: 'finished_at', label: 'FIELDS.FORMED', minWidth: 110 },
  { id: 'ap_group', label: 'FIELDS.GROUP', minWidth: 80 },
  { id: 'part', label: 'FIELDS.PART', minWidth: 80 },
  { id: 'is_sent', label: 'FIELDS.FILE_TYPE', minWidth: 80 },
  { id: 'status', label: 'FIELDS.STATUS', minWidth: 80 }
];

const LISTS = {
  is_sent: [
    { label: 'DISPATCH', value: 'true' },
    { label: 'INTERNAL', value: 'false' }
  ],
  ap_group: [
    { label: 'А', value: 'a' },
    { label: 'Б', value: 'b' }
  ]
};

const defaultParams = {
  page: 1,
  size: 25,
  point_type: 'z',
  version: 1
};

const RegisterTab = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const classes = useTableStyles();
  const timeout = useRef(null);

  const [params, setParams] = useState(defaultParams);
  const [search, setSearch] = useState({});
  const [filters, setFilters] = useState({ point_type: params.point_type, version: params.version });
  const { data: points, isFetching, error, refetch } = useGetListMDRQuery(params);
  const exportFileLog = useExportFileLog(MONITORING_DKO_LOG_TAGS);
  const onPaginateLog = useViewCallbackLog();
  const searchLog = useSearchLog(MONITORING_DKO_LOG_TAGS);

  const onSearch = (id, value) => {
    setSearch({ ...search, [id]: value });
    clearTimeout(timeout.current);
    if (!value || value.length === 0 || value.length >= 3 || id === 'ap_group') {
      timeout.current = setTimeout(() => {
        setParams({ ...params, ...search, ...filters, [id]: value, page: 1 });
        searchLog();
      }, 500);
    }
  };

  const onPaginate = (p) => {
    setParams({ ...params, ...p });
    onPaginateLog();
  };

  const getSearch = (id) => {
    switch (id) {
      case 'is_sent':
      case 'ap_group':
        return (
          <TableSelect
            value={search[id]}
            data={LISTS[id].map((i) => ({ ...i, label: t(i.label) }))}
            id={id}
            onChange={onSearch}
            minWidth={80}
          />
        );
      case 'finished_at':
        return (
          <div className={classes.picker}>
            <DatePicker
              label={''}
              value={search[id] || null}
              id={id}
              onChange={(value) => (!value || value !== 'Invalid date') && onSearch(id, value)}
              minWidth={80}
              outFormat={'YYYY-MM-DD'}
            />
          </div>
        );
      case 'status':
      case 'part':
        return null;
      default:
        return <input value={search[id] || ''} onChange={({ target }) => onSearch(id, target.value)} />;
    }
  };

  const resultData = (row) => {
    if (row?.status === 'NEW' || row?.status === 'IN_PROCESS') {
      return <CircleButton type={'loading'} size={'small'} onClick={refetch} title={`${t('FILE_PROCESSING')}...`} />;
    }
    if (
      row?.status === 'NO_DATA' ||
      row?.status === 'SYSTEM_ERROR' ||
      row?.status === 'MMS_ERROR' ||
      row?.status === 'NO_MMS_RESPONSE' ||
      row?.status === 'DATA_ERROR'
    ) {
      return (
        <LightTooltip title={row?.description} arrow disableFocusListener>
          <WarningRounded
            data-marker={'error'}
            style={{
              color: '#f90000',
              fontSize: 22,
              cursor: 'pointer'
            }}
          />
        </LightTooltip>
      );
    }
    return '-';
  };

  const getData = (id, value, row) => {
    if (id === 'finished_at') {
      return value ? moment(value).format('DD.MM.yyyy • HH:mm') : '–';
    }
    if (id === 'is_sent') {
      return value ? i18n.t('DISPATCH') : i18n.t('INTERNAL');
    }
    if (id === 'status') {
      return row?.file_id ? (
        <CircleButton
          size={'small'}
          type={'download'}
          title={t('CONTROLS.DOWNLOAD')}
          onClick={() => {
            dispatch(downloadFileById(row?.file_id, row?.file_name));
            exportFileLog();
          }}
        />
      ) : (
        resultData(row)
      );
    }
    if (id === 'part') return row?.part === null && row?.parts === null ? '' : `${row?.part || 0}/${row?.parts || 0}`;
    return value || '-';
  };

  const versions = useMemo(
    () => new Array(1000).fill(null).map((i, index) => ({ label: index + 1, value: index + 1 })),
    []
  );

  return (
    <>
      <section className={classes.table}>
        <h4 className={classes.tableHeader}>Фільтри</h4>
        <div className={classes.tableBody}>
          <Grid item xs={12} sm={6} md={2}>
            <SelectField
              label={t('FIELDS.POINT_TYPE')}
              value={filters.point_type}
              data={[
                { label: 'ZV', value: 'zv' },
                { label: 'Z', value: 'z' }
              ]}
              onChange={(v) => setFilters({ ...filters, point_type: v })}
              error={error?.data?.type}
              ignoreI18
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <SelectField
              label={t('FIELDS.VERSION_TKO_ZV')}
              value={filters.version}
              data={versions}
              onChange={(v) => setFilters({ ...filters, version: v })}
              error={error?.data?.version}
              ignoreI18
            />
          </Grid>
          <Grid item xs={12} sm={8} style={{ textAlign: 'right' }}>
            <GreenButton
              data-marker={'search'}
              onClick={() => {
                setParams({ ...params, ...filters });
                searchLog();
              }}
              className={classes.saveButton}
            >
              <DoneRounded />
              {t('CONTROLS.ENGAGE')}
            </GreenButton>
          </Grid>
        </div>
      </section>
      <StyledTable>
        <StickyTableHead>
          <TableRow>
            {columns.map(({ id, label, minWidth }) => (
              <TableCell style={{ minWidth }} className={'MuiTableCell-head'} key={id}>
                <p>{t(label)}</p>
                {getSearch(id)}
              </TableCell>
            ))}
          </TableRow>
        </StickyTableHead>
        <TableBody>
          {points?.data?.length > 0 ? (
            points.data?.map((row, index) => (
              <TableRow key={'row' + index} data-marker="table-row" className="body__table-row">
                {columns.map(({ id, value }) => (
                  <TableCell data-marker={id} key={'cell' + id}>
                    {getData(id, value ? row[value] : row[id], row)}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <NotResultRow span={8} text={t('NO_PPKO')} />
          )}
        </TableBody>
      </StyledTable>
      <Pagination {...points} params={params} onPaginate={onPaginate} loading={isFetching} />
    </>
  );
};

export default RegisterTab;
