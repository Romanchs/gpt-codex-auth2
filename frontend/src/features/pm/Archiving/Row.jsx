import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableHead from '@mui/material/TableHead';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import KeyboardArrowDownRounded from '@mui/icons-material/KeyboardArrowDownRounded';
import KeyboardArrowUpRounded from '@mui/icons-material/KeyboardArrowUpRounded';
import Statuses from '../../../Components/Theme/Components/Statuses';
import moment from 'moment';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { linkByProcessName } from '../../../util/linkByProcessName';

const Row = ({ data, columns, innerColumns }) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  const getData = (id, type) => {
    if (type === 'date' && data[id]) {
      return moment(data[id]).format('DD.MM.yyyy • HH:mm');
    }
    if (id === 'status') {
      return <Statuses statuses={[data[id]]} currentStatus={data[id]} />;
    }
    return data[id];
  };

  const handleRowClick = () => {
    navigate(linkByProcessName(data), { state: { from: { pathname: '/process-manager?tab=archiving' } } });
  };

  return (
    <>
      <TableRow
        data-marker={'table-row'}
        sx={{ ...styles.row, ...(open && styles.rowOpened) }}
        onClick={handleRowClick}
      >
        {columns.map(({ id, type }) => (
          <TableCell key={`cell-${data?.process_id}--${id}`} data-marker={id}>
            {getData(id, type)}
          </TableCell>
        ))}
        <TableCell>
          <IconButton
            aria-label={'expand row'}
            size={'small'}
            onClick={(e) => {
              e.stopPropagation();
              setOpen(!open);
            }}
            sx={{ ...styles.detailsIcon, ...(open && styles.detailsIcon_opened) }}
            data-marker={open ? 'expand' : 'collapse'}
          >
            {open ? <KeyboardArrowUpRounded /> : <KeyboardArrowDownRounded />}
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow data-marker={'table-row--detail'}>
        <TableCell sx={styles.detail} colSpan={columns.length + 2}>
          <Collapse in={open} timeout={'auto'} unmountOnExit>
            <Box sx={styles.detailContainer}>
              <Table size={'small'} aria-label={'purchases'}>
                <TableHead>
                  <TableRow sx={styles.head}>
                    {innerColumns.map(({ label, id }) => (
                      <TableCell key={'head-cell--' + id} data-marker={'head--' + id}>
                        {t(label)}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    {innerColumns.map(({ id, type }) => (
                      <TableCell
                        key={`cell-${data?.process_id}--${id}`}
                        data-marker={'body--' + id}
                        sx={styles.bodyCell}
                      >
                        {getData(id, type)}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

export default Row;

const styles = {
  row: {
    boxShadow: '0px 4px 10px rgba(146, 146, 146, 0.1)',
    cursor: 'pointer',
    '& > td': {
      p: '12px',
      fontSize: 12,
      color: '#4A5B7A',
      borderTop: '1px solid #D1EDF3',
      borderBottom: '1px solid #D1EDF3',
      bgcolor: 'blue.contrastText',
      '&:first-of-type': {
        pl: 2,
        borderRadius: '10px 0 0 10px',
        borderLeft: '1px solid #D1EDF3'
      },
      '&:last-child': {
        borderRadius: '0 10px 10px 0',
        borderRight: '1px solid #D1EDF3'
      }
    },
    '&:hover > td': {
      bgcolor: '#F2F2F2'
    }
  },
  rowOpened: {
    '& > td': {
      borderBottomColor: '#D1EDF3',
      bgcolor: '#D1EDF3',
      '&:first-of-type': {
        borderRadius: '10px 0 0 0'
      },
      '&:last-child': {
        borderRadius: '0 10px 0 0'
      }
    },
    '&:hover > td': {
      borderBottomColor: '#C4E0E6',
      bgcolor: '#C4E0E6'
    }
  },
  detailsIcon: {
    p: '3px',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: 'blue.main',
    bgcolor: 'blue.contrastText',
    '& > svg': {
      color: 'blue.main',
      fontSize: 21
    }
  },
  detailsIcon_opened: {
    borderColor: 'orange.main',
    '& > svg': {
      color: 'orange.main'
    }
  },
  detail: {
    p: '0 0 8px',
    border: 'none'
  },
  detailContainer: {
    pl: 2,
    pr: 2,
    border: '1px solid #D1EDF3',
    borderTop: 'none',
    borderRadius: '0 0 10px 10px',
    bgcolor: 'blue.contrastText',
    '& > .MuiTable-root > .MuiTableHead-root > .MuiTableRow-head> .MuiTableCell-head': {
      p: '16px 0',
      color: '#567691',
      fontSize: 12,
      fontWeight: 700
    }
  },
  head: {
    borderBottom: '1px solid #4A5B7A'
  },
  bodyCell: {
    p: '16px 0',
    color: '#567691',
    fontSize: 12,
    border: 'none'
  }
};
