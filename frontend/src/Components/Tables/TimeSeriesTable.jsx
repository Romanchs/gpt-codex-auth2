import {makeStyles} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import PropTypes from 'prop-types';

import NotResultRow from '../Theme/Table/NotResultRow';
import {useTranslation} from "react-i18next";

const useStyles = makeStyles({
  root: {
    minWidth: '100%',
    opacity: 0.8
  },
  inner: {
    marginTop: 20,
    overflowY: 'auto',
    border: 0,
    minWidth: 480
  },
  head: {
    padding: '9px',
    fontSize: 10.5,
    fontWeight: 500,
    color: '#6C7D9A'
  },
  cell: {
    padding: '12px 0',
    fontSize: 12,
    fontWeight: 400,
    height: 40,
    color: '#567691',
    borderBottom: '1px solid #E5EAEE',
    backgroundColor: 'transparent'
  },
  empty: {
    padding: 16,
    fontSize: 11,
    fontWeight: 500
  }
});

const columns = [
  {id: 'zv_eic', label: 'RESOURCE_OBJECT_CODE', minWidth: 100, align: 'justify'},
  {id: 'zfd_in_quantity', label: 'TOTAL_IN_MONTH', minWidth: 100, align: 'justify'},
  {
    id: 'zfd_out_quantity',
    label: 'TOTAL_OUT_MONTH',
    minWidth: 100,
    align: 'justify'
  }
];

const TimeSeriesTable = ({responseData}) => {
  const {t} = useTranslation();
  const classes = useStyles();

  return (
    <>
      <TableContainer className={classes.inner}>
        <Table aria-label="table">
          <TableBody>
            {responseData?.length > 0 ? (
              responseData.map((row, rowIndex) => (
                columns.map(({id, label, align}, columnIndex) => (
                  <TableRow
                    tabIndex={-1}
                    key={`${row.zv_eic}-${rowIndex}-${columnIndex}`}
                    className={classes.row}
                    data-marker="table-row"
                  >
                    <TableCell className={classes.cell} align={align} data-marker={`label-${id}`}>{t(label)}</TableCell>
                    <TableCell className={classes.cell} align={'right'}
                               data-marker={`value-${id}`}>{row[id]}</TableCell>
                  </TableRow>
                ))
              ))
            ) : (
              <NotResultRow span={11} text={t('NO_DATA')}/>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

TimeSeriesTable.propTypes = {
  responseData: PropTypes.array.isRequired
};

export default TimeSeriesTable;
