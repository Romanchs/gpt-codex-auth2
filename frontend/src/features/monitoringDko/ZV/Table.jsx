import { Grid, TableCell, TableRow } from '@material-ui/core';
import { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import TableBody from '@material-ui/core/TableBody';

import NotResultRow from '../../../Components/Theme/Table/NotResultRow';
import { StyledTable } from '../../../Components/Theme/Table/StyledTable';
import TableSelect from '../../../Components/Tables/TableSelect';
import Filter from '../../../Components/Theme/Table/Filter';
import FormInput from '../../../Forms/fields/FormInput';
import { Pagination } from '../../../Components/Theme/Table/Pagination';
import Row from './Row';
import { useGetListMDZVQuery } from './api';
import { useTranslation } from 'react-i18next';
import { setParams, setPoints } from '../slice';
import useViewCallbackLog from '../../../services/actionsLog/useViewCallbackLog';
import useSearchLog from '../../../services/actionsLog/useSearchLog';
import { MONITORING_DKO_LOG_TAGS } from '../../../services/actionsLog/constants';
import StickyTableHead from '../../../Components/Theme/Table/StickyTableHead';

const columns = [
  { id: 'mdr_name', label: 'FIELDS.PPKO_NAME', minWidth: 280 },
  { id: 'mdr_eic', label: 'FIELDS.EIC_PPKO', minWidth: 100 },
  { id: 'all_aps', label: 'FIELDS.AP_COUNT', minWidth: 100 },
  { id: 'upl_aps', label: 'FIELDS.UPLOADED_APS', minWidth: 120 },
  { id: 'not_upl', label: 'FIELDS.NOT_UPLOADED_APS', minWidth: 140 },
  { id: 'not_in_mms', label: 'FIELDS.NOT_IN_MMS', minWidth: 100 },
  { id: 'is_sent', label: 'FIELDS.SEND', minWidth: 100, render: (value) => (value ? 'CONTROLS.YES' : 'CONTROLS.NO') }
];

const filters = [
  { id: 'mga_name', label: 'FIELDS.AREA_NAME' },
  { id: 'mga_eic', label: 'FIELDS.EIC_TYPE_Y_MGA' }
];

const Table = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const points = useSelector((store) => store.monitoringDko.points);
  const params = useSelector((store) => store.monitoringDko.params);
  const [search, setSearch] = useState({});
  const { data, isFetching } = useGetListMDZVQuery(params);
  const timeout = useRef(null);
  const onPaginateLog = useViewCallbackLog();
  const searchLog = useSearchLog(MONITORING_DKO_LOG_TAGS);

  const handleUpdateParams = (newParams) => {
    for (const id in newParams) if (!newParams[id]) delete newParams[id];
    dispatch(setParams(newParams));
  };

  const onPaginate = (p) => {
    handleUpdateParams({ ...params, ...p });
    onPaginateLog();
  };

  const onSearch = (id, value) => {
    setSearch({ ...search, [id]: value });
    clearTimeout(timeout.current);
    if (!value || value.length === 0 || (id !== 'mdr_name' && id !== 'mdr_eic') || value.length >= 3) {
      timeout.current = setTimeout(() => {
        handleUpdateParams({ ...params, ...search, [id]: value, page: 1 });
        searchLog();
      }, 500);
    }
  };

  const getSearch = (id) => {
    switch (id) {
      case 'all_aps':
      case 'upl_aps':
      case 'not_upl':
      case 'not_in_mms':
      case 'is_sent':
        return (
          <TableSelect
            value={search[id]}
            data={[
              { label: t('CONTROLS.YES'), value: '1' },
              { label: t('CONTROLS.NO'), value: '0' }
            ]}
            id={id}
            onChange={onSearch}
            minWidth={80}
          />
        );
      default:
        return <input value={search[id] || ''} onChange={({ target }) => onSearch(id, target.value)} />;
    }
  };

  const handleFilter = (filters) => {
    const { mga_name, mga_eic, ...newParams } = params;
    handleUpdateParams({ ...newParams, ...filters });
    searchLog();
  };

  const handleSelect = (eic_zv) => {
    dispatch(setPoints(points.includes(eic_zv) ? points.filter((eic) => eic !== eic_zv) : [...points, eic_zv]));
  };

  return (
    <>
      <StyledTable spacing={0}>
        <StickyTableHead>
          <TableRow>
            <Filter name={'md_zvTab-filter-form'} onChange={handleFilter} unmount={true} autoApply={false}>
              {filters.map(({ id, label }) => (
                <Grid item xs={12} md={12} key={id}>
                  <FormInput label={t(label)} name={id} />
                </Grid>
              ))}
            </Filter>
            {columns.map(({ id, label, minWidth }) => (
              <TableCell style={{ minWidth }} className={'MuiTableCell-head'} key={id}>
                <p>{t(label)}</p>
                {getSearch(id)}
              </TableCell>
            ))}
            <TableCell className={'MuiTableCell-head'} />
          </TableRow>
          <TableRow style={{ height: 8 }} />
        </StickyTableHead>
        <TableBody>
          {!data?.data?.length ? (
            <NotResultRow span={11} text={t('NO_PPKO')} />
          ) : (
            <>
              {data?.data?.map((point, index) => (
                <Row
                  key={`row-${index}`}
                  data={point}
                  columns={columns}
                  innerColumns={filters}
                  isSelect={points.includes(point.uid)}
                  handleSelect={handleSelect}
                />
              ))}
            </>
          )}
        </TableBody>
      </StyledTable>
      <Pagination {...data} params={params} onPaginate={onPaginate} loading={isFetching} />
    </>
  );
};

export default Table;
