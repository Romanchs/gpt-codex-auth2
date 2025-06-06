import { makeStyles } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell/TableCell';
import KeyboardArrowDownRounded from '@mui/icons-material/KeyboardArrowDownRounded';
import KeyboardArrowUpRounded from '@mui/icons-material/KeyboardArrowUpRounded';
import { LightTooltip } from '../../../Components/Theme/Components/LightTooltip';
import { useState } from 'react';
import moment from 'moment';

const Row = ({ data, columns, innerColumns }) => {
  const classes = useRowStyles();
  const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow className={`${classes.root} ${classes[open ? 'rootOpen' : 'rootClose']}`} data-marker={'table-row'}>
        {columns.map(({ id }, index) => (
          <TableCell key={'cell-' + index} data-marker={id}>
            {getValue(id, data, 'DD.MM.yyyy • HH:mm')}
          </TableCell>
        ))}
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
            className={open ? classes.expand : classes.collapse}
            data-marker={open ? 'expand' : 'collapse'}
          >
            {open ? <KeyboardArrowUpRounded /> : <KeyboardArrowDownRounded />}
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow className={classes.detail} data-marker={`table-row--detail id-${data?.id}`}>
        <TableCell
          style={{
            paddingBottom: 8,
            paddingTop: 0,
            paddingLeft: 0,
            paddingRight: 0
          }}
          colSpan={6}
        >
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1} className={classes.detailContainer}>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow className={classes.head}>
                    {innerColumns.map(({ title, id }, index) => (
                      <TableCell key={'head-cell' + index} data-marker={'head--' + id}>
                        {title}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data?.user_friendly_changes?.map((item, rowIndex) => (
                    <TableRow key={`row-${data?.id}-${rowIndex}`} className={classes.body}>
                      {innerColumns.map(({ id }) => {
                        if (!item) return;
                        const value = getValue(id, item);
                        return (
                          <LightTooltip
                            key={`cell-${data?.id}-${rowIndex}-${id}`}
                            title={value || ''}
                            placement="bottom"
                            arrow
                            disableHoverListener={!value}
                          >
                            <TableCell data-marker={'body--' + id}>{value}</TableCell>
                          </LightTooltip>
                        );
                      })}
                    </TableRow>
                  ))}
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

const getValue = (id, item, format = 'DD.MM.yyyy') => {
  if (!item) return item;
  if (id.indexOf('.') > 0) {
    id = id.split('.');
    while (id.length) item = item?.[id.shift()];
  } else {
    item = item?.[id];
  }
  if (item) {
    if (moment(item, moment.ISO_8601).isValid() && parseInt(item) !== +item) {
      item = moment(item).format(format);
    } else if (
      typeof item === 'string' &&
      moment(item?.slice(0, -3), moment.ISO_8601).isValid() &&
      parseInt(item) !== +item
    ) {
      item = moment(item?.slice(0, -3)).format(format);
    }
  }
  return item;
};

const useRowStyles = makeStyles({
  root: {
    boxShadow: '0px 4px 10px rgba(146, 146, 146, 0.1)',
    '& > *': {
      paddingTop: 12,
      paddingBottom: 12,
      borderBottom: '1px solid #D1EDF3',
      borderTop: '1px solid #D1EDF3',
      fontSize: 12,
      color: '#4A5B7A',
      '&:first-child': {
        borderLeft: '1px solid #D1EDF3'
      },
      '&:last-child': {
        borderRight: '1px solid #D1EDF3'
      }
    }
  },
  rootClose: {
    borderRadius: 10,
    '& > *': {
      backgroundColor: '#fff',
      '&:first-child': {
        borderRadius: '10px 0 0 10px'
      },
      '&:last-child': {
        borderRadius: '0 10px 10px 0'
      }
    }
  },
  rootOpen: {
    borderRadius: '10px 10px 0 0',
    '& > *': {
      backgroundColor: '#D1EDF3',
      '&:first-child': {
        borderRadius: '10px 0 0 0'
      },
      '&:last-child': {
        borderRadius: '0 10px 0 0'
      }
    }
  },
  expand: {
    border: '1px solid #F28C60',
    backgroundColor: '#fff',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
    '&:hover': {
      backgroundColor: '#f5f5f5'
    },
    '& svg': {
      color: '#F28C60',
      fontSize: 21
    }
  },
  collapse: {
    border: '1px solid #223B82',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
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
    border: 'none',
    borderRadius: '0 0 10px 10px',
    overflow: 'hidden',
    position: 'relative'
  },
  head: {
    '& > *': {
      color: '#567691',
      fontSize: 11,
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
      fontSize: 10,
      fontWeight: 400,
      padding: 13,
      borderBottom: '1px solid #4A5B7A',
      maxWidth: 400,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    },
    '&:last-child > *': {
      borderBottom: 'none'
    }
  },
  controls: {
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-end',
    paddingTop: 16,
    '& > *': {
      marginLeft: 16,
      padding: '3px 12px',
      '& > *': {
        fontSize: 11
      },
      '& svg': {
        fontSize: 12
      }
    }
  }
});
