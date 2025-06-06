import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import NotResultRow from '../../../../Components/Theme/Table/NotResultRow';
import { StyledTable } from '../../../../Components/Theme/Table/StyledTable';
import { Pagination } from '../../../../Components/Theme/Table/Pagination';
import TableHeadCell from '../../../../Components/Tables/TableHeadCell';
import { useRequestArchivingTSQuery } from '../api';
import StickyTableHead from '../../../../Components/Theme/Table/StickyTableHead';

const columns = [
  { id: 'eic', label: 'FIELDS.EIC_CODE' },
  { id: 'connection_status', label: 'FIELDS.CONNECTION_STATUS' },
  { id: 'customer', label: 'FIELDS.AP_CUSTOMER_CODE' },
  { id: 'city', label: 'FIELDS.CITY' },
  { id: 'eic_x', label: 'FIELDS.EIC_CODE_X_SUPPLIERS' },
  { id: 'eic_y', label: 'FIELDS.EIC_CODE_Y_REGION' },
  { id: 'period', label: 'FIELDS.ARCHIVING_PERIOD' },
  { id: 'reject_reason', label: 'FIELDS.REJECTED_REASON', minWidth: 180 }
];

const Table = () => {
  const { uid } = useParams();
  const { t, i18n } = useTranslation();
  const [params, setParams] = useState({ page: 1, size: 25 });
  const { currentData, isFetching } = useRequestArchivingTSQuery({ uid, params });

  const getData = (id, value) => {
    if (id === 'reject_reason' && !value) return '–';
    if (id === 'connection_status' && value && i18n.exists(`CONNECTION_STATUSES.${value.toUpperCase()}`))
      return t(`CONNECTION_STATUSES.${value.toUpperCase()}`);
    return i18n.exists(value) ? t(value) : value;
  };

  return (
    <>
      <StyledTable spacing={2}>
        <StickyTableHead>
          <TableRow>
            {columns.map(({ id, label, minWidth }) => (
              <TableHeadCell key={id} title={t(label)} sx={{ minWidth }} />
            ))}
          </TableRow>
        </StickyTableHead>
        <TableBody>
          {!currentData?.aps?.data?.length ? (
            <NotResultRow span={columns.length} text={t('NO_RECORDS_FOUND')} />
          ) : (
            <>
              {currentData?.aps?.data?.map((point) => (
                <TableRow key={`row-${point.uid}`} className={'body__table-row'} data-marker={'table-row'}>
                  {columns.map(({ id }) => (
                    <TableCell key={id + point.uid} data-marker={id}>
                      {getData(id, point[id])}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </>
          )}
        </TableBody>
      </StyledTable>
      <Pagination
        {...currentData?.aps}
        params={params}
        loading={isFetching}
        onPaginate={(p) => setParams({ ...params, ...p })}
      />
    </>
  );
};

export default Table;
