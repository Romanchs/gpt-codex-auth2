import { useState } from 'react';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell/TableCell';
import IconButton from '@material-ui/core/IconButton';
import KeyboardArrowUpRounded from '@mui/icons-material/KeyboardArrowUpRounded';
import KeyboardArrowDownRounded from '@mui/icons-material/KeyboardArrowDownRounded';
import Collapse from '@material-ui/core/Collapse/Collapse';
import Box from '@material-ui/core/Box';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import moment from 'moment/moment';
import { makeStyles } from '@material-ui/core';

const Row = ({ data, columns, innerColumns }) => {
  const classes = useRowStyles();
  const [open, setOpen] = useState(false);
  const [tooltip, setTooltip] = useState({ open: false, disable: false });

  return (
    <>
      <TableRow className={open ? classes.rootOpen : classes.root} data-marker={'table-row'}>
        {columns.map((key, index) => (
          <TableCell key={'cell-' + index} data-marker={key} align={key === 'status' ? 'center' : 'left'}>
            {data[key]}
          </TableCell>
        ))}
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onMouseEnter={() => setTooltip({ open: false, disable: true })}
            onMouseLeave={() => setTooltip({ ...tooltip, disable: false })}
            onClick={(e) => {
              e.stopPropagation();
              setOpen(!open);
            }}
            className={open ? classes.expand : classes.collapse}
            data-marker={open ? 'expand' : 'collapse'}
          >
            {open ? <KeyboardArrowUpRounded /> : <KeyboardArrowDownRounded />}
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow className={classes.detail} data-marker={`table-row--detail id-${data?.bsus}`}>
        <TableCell
          style={{
            paddingBottom: 8,
            paddingTop: 0,
            paddingLeft: 0,
            paddingRight: 0
          }}
          colSpan={7}
        >
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1} className={classes.detailContainer}>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow className={classes.head}>
                    {innerColumns.map(({ label, value, width }, index) => (
                      <TableCell key={'head-cell' + index} data-marker={'head--' + value} style={{ width }}>
                        {label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow className={classes.body}>
                    {innerColumns.map(({ value, type }, index) => (
                      <TableCell key={'cell' + index} data-marker={'body--' + value}>
                        {type === 'date'
                          ? data[value] && moment(data[value]).format('DD.MM.yyyy • HH:mm')
                          : data[value]}
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

export const useRowStyles = makeStyles({
  root: {
    boxShadow: '0px 4px 10px rgba(146, 146, 146, 0.1)',
    borderRadius: 10,
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.04)',
      '& > *': {
        backgroundColor: '#f2f2f2',
        cursor: 'pointer'
      }
    },
    '& > *': {
      paddingTop: 12,
      paddingBottom: 12,
      borderBottom: '1px solid #D1EDF3',
      borderTop: '1px solid #D1EDF3',
      backgroundColor: '#fff',
      fontSize: 12,
      color: '#4A5B7A',
      '&:first-child': {
        borderRadius: '10px 0 0 10px',
        borderLeft: '1px solid #D1EDF3'
      },
      '&:last-child': {
        borderRadius: '0 10px 10px 0',
        borderRight: '1px solid #D1EDF3'
      }
    }
  },
  rootOpen: {
    boxShadow: '0px 4px 10px rgba(146, 146, 146, 0.1)',
    borderRadius: '10px 10px 0 0',
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.04)',
      '& > *': {
        backgroundColor: '#C4E0E6',
        cursor: 'pointer'
      }
    },
    '& > *': {
      paddingTop: 12,
      paddingBottom: 12,
      borderBottom: '1px solid #D1EDF3',
      borderTop: '1px solid #D1EDF3',
      backgroundColor: '#D1EDF3',
      fontSize: 12,
      color: '#4A5B7A',
      '&:first-child': {
        borderRadius: '10px 0 0 0',
        borderLeft: '1px solid #D1EDF3'
      },
      '&:last-child': {
        borderRadius: '0 10px 0 0',
        borderRight: '1px solid #D1EDF3'
      }
    }
  },
  expand: {
    border: '1px solid #F28C60',

    '& svg': {
      color: '#F28C60',
      fontSize: 21
    }
  },
  collapse: {
    border: '1px solid #223B82',

    '& svg': {
      color: '#223B82',
      fontSize: 21
    }
  },
  detail: {
    '& > *': {
      borderBottom: 'none'
    }
  },
  detailContainer: {
    backgroundColor: '#fff',
    margin: 0,
    padding: '8px 16px 0',
    borderTop: 'none',
    border: '1px solid #D1EDF3',
    borderRadius: '0 0 10px 10px',
    overflow: 'hidden',
    position: 'relative'
  },
  head: {
    '& > *': {
      color: '#567691',
      fontSize: 12,
      fontWeight: 700,
      borderBottom: '1px solid #4A5B7A !important',
      padding: '12px !important',
      '&:first-child': {
        paddingLeft: 0
      },
      '&:last-child': {
        paddingRight: 0
      }
    }
  },
  body: {
    '& > *': {
      color: '#567691',
      fontSize: 12,
      fontWeight: 400,
      padding: 13,
      border: 'none'
    }
  }
});
