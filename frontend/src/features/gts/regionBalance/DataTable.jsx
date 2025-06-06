import { TableBody, TableCell, TableRow } from '@material-ui/core';
import React from 'react';
import NotResultRow from '../../../Components/Theme/Table/NotResultRow';
import { StyledTable } from '../../../Components/Theme/Table/StyledTable';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { useTranslation } from 'react-i18next';
import i18n from '../../../i18n/i18n';
import { verifyRole } from '../../../util/verifyRole';
import StickyTableHead from '../../../Components/Theme/Table/StickyTableHead';

const DataTable = ({ data }) => {
  const { t } = useTranslation();
  const { rowSx } = rowStyles();

  return (
    <StyledTable spacing={0}>
      <StickyTableHead>
        <TableRow>
          {columns
            .filter((i) => (verifyRole(['ОМ']) ? i.param !== 'income' : true))
            .map(({ title, param, minWidth }) => (
              <TableCell style={{ minWidth: minWidth }} className={'MuiTableCell-head'} key={param}>
                <p>{title}</p>
              </TableCell>
            ))}
        </TableRow>
        <TableRow style={{ height: 8 }}></TableRow>
      </StickyTableHead>
      <TableBody>
        {data?.balance?.length > 0 ? (
          <>
            {data?.balance?.map((row, rowIndex) => (
              <TableRow key={row.id} data-marker="table-row" className={rowSx}>
                {columns
                  .filter((i) => (verifyRole(['ОМ']) ? i.param !== 'income' : true))
                  .map((cell, index) => (
                    <TableCell
                      data-marker={`table-cell-${cell.param}-${rowIndex}`}
                      key={index}
                      style={{ minWidth: cell.minWidth }}
                    >
                      {row[cell?.param]?.toString()}
                    </TableCell>
                  ))}
              </TableRow>
            ))}
            <TableRow data-marker="summ" className={rowSx}>
              <TableCell>{t('IN_TOTAL')}:</TableCell>
              {!verifyRole(['ОМ']) && (
                <TableCell data-marker={'sum_income'}>{data?.sum_balance?.sum_income || 0}</TableCell>
              )}
              <TableCell data-marker={'sum_interchange_in'}>{data?.sum_balance?.sum_interchange_in || 0}</TableCell>
              <TableCell data-marker={'sum_interchange_out'}>{data?.sum_balance?.sum_interchange_out || 0}</TableCell>
              <TableCell data-marker={'sum_generation'}>{data?.sum_balance?.sum_generation || 0}</TableCell>
              <TableCell data-marker={'sum_consumption'}>{data?.sum_balance?.sum_consumption || 0}</TableCell>
              <TableCell data-marker={'sum_consumption_a'}>{data?.sum_balance?.sum_consumption_a || 0}</TableCell>
              <TableCell data-marker={'sum_consumption_b'}>{data?.sum_balance?.sum_consumption_b || 0}</TableCell>
              <TableCell data-marker={'sum_losses'}>{data?.sum_balance?.sum_losses || 0}</TableCell>
            </TableRow>
          </>
        ) : (
          <NotResultRow span={columns.length} text={t('NO_DATA')} />
        )}
      </TableBody>
    </StyledTable>
  );
};

export default DataTable;

const columns = [
  { title: i18n.t('FIELDS.PERIOD'), param: 'period', minWidth: 150 },
  { title: i18n.t('FIELDS.INCOME_SHORT'), param: 'income', minWidth: 150 },
  { title: i18n.t('FIELDS.INTERCHANGE_IN'), param: 'interchange_in', minWidth: 150 },
  { title: i18n.t('FIELDS.INTERCHANGE_OUT'), param: 'interchange_out', minWidth: 150 },
  { title: i18n.t('FIELDS.GENERATION'), param: 'generation', minWidth: 150 },
  { title: i18n.t('FIELDS.CONSUMPTION'), param: 'consumption', minWidth: 150 },
  { title: i18n.t('FIELDS.CONSUMPTION_A'), param: 'consumption_a', minWidth: 150 },
  { title: i18n.t('FIELDS.CONSUMPTION_B'), param: 'consumption_b', minWidth: 150 },
  { title: i18n.t('FIELDS.LOSSES'), param: 'losses', minWidth: 150 }
];

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
          color: '#567691',
          borderRadius: '0 0 0 16px'
        },
        '&:last-child': {
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
