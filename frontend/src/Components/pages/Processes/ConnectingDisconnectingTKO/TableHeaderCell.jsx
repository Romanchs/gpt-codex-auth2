import { Box, TableCell } from '@material-ui/core';
import React from 'react';

const tableCellStyles = {
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  justifyContent: 'space-between'
};

const TableHeaderCell = ({ children, minWidth, maxWidth, align = 'left' }) => {
  return (
    <TableCell style={{ minWidth, maxWidth }} align={align} className={'MuiTableCell-head'}>
      <Box sx={tableCellStyles}>{children}</Box>
    </TableCell>
  );
};

export default TableHeaderCell;
