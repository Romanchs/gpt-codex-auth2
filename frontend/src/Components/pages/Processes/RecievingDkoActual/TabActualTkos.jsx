import { TableCell, TableRow } from '@material-ui/core';
import TableBody from '@material-ui/core/TableBody';

import NotResultRow from '../../../Theme/Table/NotResultRow';
import { StyledTable } from '../../../Theme/Table/StyledTable';
import { useTranslation } from 'react-i18next';
import StickyTableHead from '../../../Theme/Table/StickyTableHead';

const columns = [
  { id: 'eic', label: 'FIELDS.EIC_CODE', minWidth: 150 },
  { id: 'connection_status', label: 'FIELDS.CONNECTION_STATUS', minWidth: 200 },
  { id: 'customer', label: 'FIELDS.AP_CUSTOMER_CODE', minWidth: 200 },
  { id: 'region', label: 'FIELDS.REGION', minWidth: 200 },
  { id: 'city', label: 'FIELDS.CITY', minWidth: 200 }
];

const TabActualTkos = ({ data }) => {
  const { t } = useTranslation();
  return (
    <StyledTable>
      <StickyTableHead>
        <TableRow>
          {columns.map(({ id, label, minWidth }) => (
            <TableCell key={id} className={'MuiTableCell-head'} style={{ minWidth }}>
              <p>{t(label)}</p>
            </TableCell>
          ))}
        </TableRow>
      </StickyTableHead>
      <TableBody>
        {data.length < 1 ? (
          <NotResultRow span={5} text={t('NO_POINTS_FOUND')} />
        ) : (
          data.map((row) => <Row key={row.uid} data={row} />)
        )}
      </TableBody>
    </StyledTable>
  );
};

export default TabActualTkos;

const Row = ({ data }) => {
  return (
    <>
      <TableRow tabIndex={-1} data-marker="table-row" className="body__table-row">
        {columns.map((column) => (
          <TableCell key={column.id} align={column.align} data-marker={column.id}>
            {data[column.id]}
          </TableCell>
        ))}
      </TableRow>
    </>
  );
};
