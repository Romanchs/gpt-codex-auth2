import { useRef, useState } from 'react';
import { TableCell, TableRow } from '@material-ui/core';
import TableBody from '@material-ui/core/TableBody';

import NotResultRow from '../../../Components/Theme/Table/NotResultRow';
import { StyledTable } from '../../../Components/Theme/Table/StyledTable';
import { Pagination } from '../../../Components/Theme/Table/Pagination';
import Row from './Row';
import { useZvGroupsQuery, useZvSettingsQuery } from '../api';
import TableSelect from '../../../Components/Tables/TableSelect';
import { useTranslation } from 'react-i18next';
import useViewCallbackLog from '../../../services/actionsLog/useViewCallbackLog';
import useSearchLog from '../../../services/actionsLog/useSearchLog';
import { CONSTRUCTOR_ZV_LOG_TAGS } from '../../../services/actionsLog/constants';
import StickyTableHead from '../../../Components/Theme/Table/StickyTableHead';

const columns = [
  { id: 'name', label: 'FIELDS.AGREGATION_NAME', minWidth: 800 },
  { id: 'dimension', label: 'FIELDS.DATA_DIMENSIONALITY', minWidth: 70 },
  { id: 'aggregation_type', label: 'FIELDS.AGREGATION_TYPE', minWidth: 70 }
];

const innerColumns = [
  { id: 'eic', label: 'FIELDS.EIC_CODE' },
  { id: 'properties', label: 'FIELDS.TKO_DETAIL' }
];

const CreateZVTable = ({ params, setParams, loading, aggregation }) => {
  const { t } = useTranslation();
  const timeout = useRef(null);
  const [search, setSearch] = useState(params);

  const { data: response } = useZvGroupsQuery(params);
  const { data: { aggregation_types = [] } = {} } = useZvSettingsQuery();
  const onPaginateLog = useViewCallbackLog(CONSTRUCTOR_ZV_LOG_TAGS);
  const searchLog = useSearchLog(CONSTRUCTOR_ZV_LOG_TAGS);

  const onSearch = (id, value) => {
    if (!value) value = '';
    setSearch({ ...search, [id]: value });
    clearTimeout(timeout.current);
    if (!value || value.length === 0 || value.length > 1) {
      timeout.current = setTimeout(() => {
        setParams({ ...params, ...search, [id]: value, page: 1 });
        searchLog();
      }, 500);
    }
  };

  const onPaginate = (v) => {
    setParams({ ...params, ...v });
    onPaginateLog();
  };

  const getSearch = (id) => {
    switch (id) {
      case 'aggregation_type':
        return <TableSelect value={search[id]} data={aggregation_types} id={id} onChange={onSearch} minWidth={80} />;
      case 'dimension':
        return <input value={'PT60M'} readOnly />;
      default:
        return <input value={search[id] || ''} onChange={({ target }) => onSearch(id, target.value)} />;
    }
  };

  return (
    <>
      <StyledTable spacing={0}>
        <StickyTableHead>
          <TableRow>
            {columns.map(({ id, label, minWidth }) => (
              <TableCell style={{ minWidth }} className={'MuiTableCell-head'} key={id}>
                <p>{`${t(label)}:`}</p>
                {getSearch(id)}
              </TableCell>
            ))}
            <TableCell className={'MuiTableCell-head'}></TableCell>
          </TableRow>
          <TableRow style={{ height: 8 }} />
        </StickyTableHead>
        <TableBody>
          {response?.data?.length < 1 ? (
            <NotResultRow span={10} text={t('NO_AGGREGATIONS_FOUND')} />
          ) : (
            <>
              {response?.data?.map((point, index) => (
                <Row
                  key={`row-${index}`}
                  data={point}
                  columns={columns}
                  innerColumns={innerColumns}
                  aggregation={aggregation}
                />
              ))}
            </>
          )}
        </TableBody>
      </StyledTable>
      <Pagination {...response} loading={loading} params={params} onPaginate={onPaginate} />
    </>
  );
};

export default CreateZVTable;
