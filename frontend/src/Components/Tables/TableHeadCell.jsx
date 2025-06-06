import TableCell from '@mui/material/TableCell';
import React from 'react';
import { Typography } from '@mui/material';
import propTypes from 'prop-types';

const TableHeadCell = ({ children, width, sx, title, ...props }) => (
  <TableCell className={'MuiTableCell-head'} style={{ width, ...sx }} {...props}>
    {title && (
      <Typography variant={'body1'} component={'p'}>
        {title}
      </Typography>
    )}
    {children}
  </TableCell>
);

TableHeadCell.propTypes = {
  title: propTypes.string.isRequired,
  width: propTypes.oneOfType([propTypes.number, propTypes.string]),
  sx: propTypes.object,
  align: propTypes.oneOf(['inherit', 'left', 'center', 'right', 'justify'])
};

export default TableHeadCell;
