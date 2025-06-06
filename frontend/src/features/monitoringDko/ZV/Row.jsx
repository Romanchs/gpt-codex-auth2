import { makeStyles, TableBody } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import KeyboardArrowDownRounded from '@mui/icons-material/KeyboardArrowDownRounded';
import KeyboardArrowUpRounded from '@mui/icons-material/KeyboardArrowUpRounded';
import CheckCircleOutlineRounded from '@mui/icons-material/CheckCircleOutlineRounded';
import RadioButtonUncheckedRounded from '@mui/icons-material/RadioButtonUncheckedRounded';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const Row = ({ data, columns, innerColumns, isSelect, handleSelect }) => {
  const classes = useRowStyles();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  return (
    <>
      <TableRow className={`${classes.root} ${classes[open ? 'rootOpen' : 'rootClose']}`} data-marker={'table-row'}>
        <TableCell>
          <IconButton
            aria-label={'select row'}
            size={'small'}
            onClick={() => handleSelect(data.uid)}
            className={`${open ? classes.expand : classes.collapse} ${classes.selectIcon}`}
            data-marker={isSelect ? 'selected' : 'not-selected'}
          >
            {isSelect ? <CheckCircleOutlineRounded /> : <RadioButtonUncheckedRounded />}
          </IconButton>
        </TableCell>
        {columns.map(({ id, render }, index) => (
          <TableCell key={'cell-' + index} data-marker={id} {...colorText(id, data[id], classes)}>
            {render ? t(render(data[id])) : data[id]}
          </TableCell>
        ))}
        <TableCell>
          <IconButton
            aria-label={'expand row'}
            size={'small'}
            onClick={() => setOpen(!open)}
            className={open ? classes.expand : classes.collapse}
            data-marker={open ? 'expand' : 'collapse'}
          >
            {open ? <KeyboardArrowUpRounded /> : <KeyboardArrowDownRounded />}
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow className={classes.detail} data-marker={'table-row--detail'}>
        <TableCell
          style={{
            paddingBottom: 8,
            paddingTop: 0,
            paddingLeft: 0,
            paddingRight: 0
          }}
          colSpan={columns.length + 2}
        >
          <Collapse in={open} timeout={'auto'} unmountOnExit>
            <Box margin={1} className={classes.detailContainer}>
              <Table size={'small'} aria-label={'purchases'}>
                <TableHead>
                  <TableRow className={`${classes.head} ${classes.splitter}`}>
                    {innerColumns.map(({ label, id }, index) => (
                      <TableCell key={'head-cell' + index} data-marker={'head--' + id}>
                        <pre style={{ font: 'inherit' }}>{t(label)}</pre>
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow className={`${classes.body} ${classes.innerTableRow}`}>
                    {innerColumns.map(({ id }, index) => (
                      <TableCell key={'cell' + index} data-marker={'body--' + id}>
                        <pre style={{ font: 'inherit' }}>{data[id]}</pre>
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

const colorText = (id, value, classes) => {
  if (id === 'intervals_false' || id === 'agr_false' || id === 'mms_false') {
    return value > 0 ? { className: classes.redText } : { className: classes.greenText };
  }
  if (id === 'intervals_true' || id === 'is_send') {
    return value > 0 ? { className: classes.greenText } : { className: classes.redText };
  }
  return {};
};

const useRowStyles = makeStyles({
  root: {
    boxShadow: '0px 4px 10px rgba(146, 146, 146, 0.1)',
    '& > *': {
      padding: '12px 8px',
      borderBottom: '1px solid #D1EDF3',
      borderTop: '1px solid #D1EDF3',
      fontSize: 12,
      color: '#4A5B7A',
      '&:first-child': {
        borderLeft: '1px solid #D1EDF3',
        paddingLeft: '16px'
      },
      '&:last-child': {
        borderRight: '1px solid #D1EDF3'
      },
      '&:nth-child(n+4)': {
        fontWeight: 500
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
  selectIcon: {
    border: 'none',
    '& svg': {
      fontSize: 24
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
    padding: '8px 15px 0',
    borderTop: 'none',
    border: '1px solid #D1EDF3',
    borderRadius: '0 0 10px 10px',
    overflow: 'hidden',
    position: 'relative'
  },
  head: {
    '& > *': {
      color: '#567691',
      fontSize: 11,
      fontWeight: 700,
      padding: '8px 1px 16px !important',
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
      padding: 12,
      border: 'none'
    }
  },
  splitter: {
    borderBottom: '1px solid #4A5B7A !important'
  },
  innerTableRow: {
    '& > td': {
      padding: '16px 1px'
    }
  },
  redText: {
    color: '#FF0000'
  },
  greenText: {
    color: '#008C0C'
  }
});
