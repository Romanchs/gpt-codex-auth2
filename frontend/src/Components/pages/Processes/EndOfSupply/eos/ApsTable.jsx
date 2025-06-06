import { TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import React from 'react';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { StyledTable } from '../../../../Theme/Table/StyledTable';
import NotResultRow from '../../../../Theme/Table/NotResultRow';
import { Pagination } from '../../../../Theme/Table/Pagination';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { setParams } from '../slice';
import { useEndOfSupplyQuery } from '../api';
import { CONNECTION_STATUSES } from '../../../TKO/TkoData';

const columns = [
  { id: 'eic', label: 'FIELDS.EIC_CODE', minWidth: 150 },
  { id: 'connection_status', label: 'FIELDS.CONNECTION_STATUS', minWidth: 150 },
  { id: 'customer', label: 'FIELDS.AP_CUSTOMER_CODE', minWidth: 150 },
  { id: 'region', label: 'FIELDS.REGION_OF_ACTUAL_ADDRESS_OF_AP', minWidth: 200 },
  { id: 'city', label: 'FIELDS.CITY_OF_ACTUAL_ADDRESS_OF_AP', minWidth: 200 },
  { id: 'prolonged', label: 'FIELDS.DROPPED_OUT_OF_PROCESS', minWidth: 100 }
];

export const ApsTable = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { uid } = useParams();
  const { params } = useSelector((store) => store.endOfSupply);
  const { data, isFetching } = useEndOfSupplyQuery({ uid, params });
  const aps = data?.aps?.data || [];

  return (
    <>
      <StyledTable>
        <TableHead>
          <TableRow>
            {columns.map(({ id, label, minWidth }) => (
              <TableCell key={id} style={{ minWidth: minWidth }}>
                {t(label)}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {aps?.length > 0 ? (
            aps?.map((ap) => <ApRow ap={ap} key={ap.uid} />)
          ) : (
            <NotResultRow text={t('AP_NOT_FOUND')} span={columns.length + 1} small />
          )}
        </TableBody>
      </StyledTable>
      <Pagination
        {...data?.aps}
        params={params}
        loading={isFetching}
        onPaginate={(newParams) => dispatch(setParams({ ...params, ...newParams }))}
      />
    </>
  );
};

const ApRow = ({ ap }) => {
  const { t } = useTranslation();

  const prolonged = ap.prolonged_at
    ? moment(ap.prolonged_at).format('DD.MM.yyyy • HH:mm')
    : ap.is_prolonged
    ? t('CONTROLS.YES')
    : t('CONTROLS.NO');

  const renderCell = (id) => {
    switch (id) {
      case 'prolonged':
        return prolonged;
      case 'connection_status':
        return t(CONNECTION_STATUSES[ap[id]]);
      default:
        return ap[id] || '';
    }
  };

  return (
    <TableRow data-marker="table-row" className="body__table-row">
      {columns.map(({ id }) => (
        <TableCell data-marker={id} key={id}>
          {renderCell(id)}
        </TableCell>
      ))}
    </TableRow>
  );
};
