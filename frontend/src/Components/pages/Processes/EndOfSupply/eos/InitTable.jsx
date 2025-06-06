import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyledTable } from '../../../../Theme/Table/StyledTable';
import TableSelect from '../../../../Tables/TableSelect';
import { TableBody, TableCell, TableRow } from '@mui/material';
import { CONNECTION_STATUSES } from '../../../../../util/directories';
import NotResultRow from '../../../../Theme/Table/NotResultRow';
import RadioButton from '../../../../Theme/Fields/RadioButton';
import { useUpdateApMutation } from '../api';
import { Pagination } from '../../../../Theme/Table/Pagination';
import { setParams } from '../slice';
import { useDispatch, useSelector } from 'react-redux';
import { mainApi } from '../../../../../app/mainApi';
import { useParams } from 'react-router-dom';
import StickyTableHead from '../../../../Theme/Table/StickyTableHead';

const columns = [
  { id: 'eic', label: 'FIELDS.EIC_CODE', minWidth: 150 },
  { id: 'connection_status', label: 'FIELDS.CONNECTION_STATUS', minWidth: 150 },
  { id: 'customer', label: 'FIELDS.AP_CUSTOMER_CODE', minWidth: 200 },
  { id: 'region', label: 'FIELDS.REGION_OF_ACTUAL_ADDRESS_OF_AP', minWidth: 200 },
  { id: 'city', label: 'FIELDS.CITY_OF_ACTUAL_ADDRESS_OF_AP', minWidth: 200 }
];

export const InintTable = ({ data, loading }) => {
  const { uid } = useParams();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const timeOut = useRef(null);
  const { params } = useSelector((store) => store.endOfSupply);
  const [search, setSearch] = useState(params);
  const [updateAp, { isLoading: updating }] = useUpdateApMutation();

  const onSearch = (key, value) => {
    setSearch({ ...search, [key]: value });
    clearTimeout(timeOut.current);
    timeOut.current = setTimeout(() => {
      dispatch(setParams({ ...params, [key]: value, page: 1 }));
    }, 1000);
  };

  const handleUpdatePoints = (ap_uid, chosen) => {
    updateAp({ uid: data.uid, body: { ap_uid }, params, check: !chosen });
  };

  const onPaginate = (values) => {
    dispatch(setParams({ ...params, ...values }));
    dispatch(
      mainApi.endpoints.endOfSupply.initiate(
        { uid, params: { ...params, ...values } },
        { subscribe: false, forceRefetch: true }
      )
    );
  };

  return (
    <>
      <StyledTable>
        <StickyTableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell key={column.id} className={'MuiTableCell-head'} style={{ minWidth: column.minWidth }}>
                <p>{t(column.label)}</p>
                {column.id === 'connection_status' ? (
                  <TableSelect
                    value={search.connection_status}
                    id={'connection_status'}
                    data={Object.entries(CONNECTION_STATUSES)
                      .filter((i) => i[0] !== 'Underconstruction' && i[0] !== 'Demolished')
                      .map((i) => ({
                        value: i[0],
                        label: t(i[1])
                      }))}
                    onChange={onSearch}
                  />
                ) : (
                  <input
                    type="text"
                    value={search[column.id] || ''}
                    onChange={({ target: { value } }) => onSearch(column.id, value)}
                  />
                )}
              </TableCell>
            ))}
            <TableCell className={'MuiTableCell-head'} style={{ width: 70 }}>
              <p>{t('SELECTED')}</p>
              <input type="text" value={data?.move_to_slr_aps_amount} readOnly style={{ textAlign: 'center' }} />
            </TableCell>
          </TableRow>
        </StickyTableHead>
        <TableBody>
          {data?.aps?.data?.length > 0 ? (
            data?.aps?.data?.map((row) => (
              <Row
                key={row.uid}
                data={row}
                handleClick={() => handleUpdatePoints(row?.uid, row?.is_checked)}
                selected={row?.is_checked}
              />
            ))
          ) : (
            <NotResultRow span={columns.length + 1} text={t('NO_POINTS_FOUND')} />
          )}
        </TableBody>
      </StyledTable>
      <Pagination
        {...data?.aps}
        loading={loading || updating}
        params={params}
        onPaginate={onPaginate}
        elementsName={t('PAGINATION.POINTS')}
      />
    </>
  );
};

const Row = ({ data, handleClick, selected }) => {
  const { t } = useTranslation();

  return (
    <>
      <TableRow tabIndex={-1} data-marker="table-row" className="body__table-row">
        {columns.map((column) => (
          <TableCell key={column.id} align={column.align} data-marker={column.id}>
            {column.id === 'connection_status' ? t(CONNECTION_STATUSES[data[column.id]]) : data[column.id]}
          </TableCell>
        ))}
        <TableCell align={'center'}>
          <RadioButton data-marker={'radio-button'} checked={selected} onClick={handleClick} />
        </TableCell>
      </TableRow>
    </>
  );
};
