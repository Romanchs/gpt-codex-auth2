import {TableBody} from '@material-ui/core';
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
import moment from 'moment';
import {useState} from 'react';
import {useRowStyles} from './filterStyles';
import { useTranslation } from 'react-i18next';

const Row = ({data, columns, innerColumns, isSelect, handleSelect}) => {
  const {t} = useTranslation();
  const classes = useRowStyles();
  const [open, setOpen] = useState(false);
  return (
    <>
      <TableRow className={open ? classes.rootOpen : classes.root} data-marker={'table-row'}>
        <TableCell>
          <IconButton
            aria-label={'select row'}
            size={'small'}
            onClick={() => handleSelect(data.eic)}
            className={`${open ? classes.expand : classes.collapse} ${classes.selectIcon}`}
            data-marker={isSelect ? 'selected' : 'not-selected'}
          >
            {isSelect ? <CheckCircleOutlineRounded/> : <RadioButtonUncheckedRounded/>}
          </IconButton>
        </TableCell>
        {columns.map(({id}, index) => (
          <TableCell key={'cell-' + index} data-marker={id}>
            {(id === 'interval_from' || id === 'interval_to') && data[id] ? moment(data[id]).format('DD.MM.yyyy') : data[id]}
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
            {open ? <KeyboardArrowUpRounded/> : <KeyboardArrowDownRounded/>}
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
                    {innerColumns.map(({label, id}, index) => (
                      <TableCell key={'head-cell' + index} data-marker={'head--' + id}>
                        <pre style={{'font': 'inherit'}}>{t(label)}</pre>
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow className={`${classes.body} ${classes.innerTableRow}`}>
                    {innerColumns.map(({id}, index) => (
                      <TableCell key={'cell' + index} data-marker={'body--' + id}>
                        <pre style={{'font': 'inherit'}}>{data[id]}</pre>
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
