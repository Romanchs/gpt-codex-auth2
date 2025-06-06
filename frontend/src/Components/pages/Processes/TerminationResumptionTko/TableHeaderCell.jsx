import { Box, TableCell } from '@material-ui/core';
import React from 'react';

const tableCellStyles = {
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  justifyContent: 'space-between'
};

const TableHeaderCell = ({ children, style, ...props }) => {
  return (
    <TableCell style={style} props={props}>
      <Box sx={tableCellStyles}>{children}</Box>
    </TableCell>
  );
};

export default TableHeaderCell;
