import { TableBody, TableCell, TableRow, Typography } from '@material-ui/core';
import React from 'react';
import NotResultRow from '../../../Theme/Table/NotResultRow';
import { Pagination } from '../../../Theme/Table/Pagination';
import { StyledTable } from '../../../Theme/Table/StyledTable';
import { useTranslation } from 'react-i18next';
import StickyTableHead from '../../../Theme/Table/StickyTableHead';

const SubprocessesTable = ({ list }) => {
  const { t } = useTranslation();

  return (
    <>
      <StyledTable>
        <StickyTableHead>
          <TableRow>
            <TableCell className={'MuiTableCell-head'}>{t('SUBPROCESS')}</TableCell>
            <TableCell style={{ width: 100 }} className={'MuiTableCell-head'}>
              {t('PROGRESS')}
            </TableCell>
          </TableRow>
        </StickyTableHead>
        <TableBody>
          {list?.data?.length > 0 ? (
            list?.data?.map((row, index) => (
              <TableRow key={'row' + index} hover data-marker="table-row" className="body__table-row">
                <TableCell className={'MuiTableCell-head'}>{row.subprocess}</TableCell>
                <TableCell style={{ width: 100 }} className={'MuiTableCell-head'}>
                  <Typography style={{ fontWeight: 500, color: row.progress < 50 ? 'red' : 'green' }}>
                    {row.progress}%
                  </Typography>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <NotResultRow span={8} text={t('NOTHING_FOUND')} />
          )}
        </TableBody>
      </StyledTable>
      <Pagination data={list?.data} params={{}} onPaginate={() => {}} />
    </>
  );
};

export default SubprocessesTable;
