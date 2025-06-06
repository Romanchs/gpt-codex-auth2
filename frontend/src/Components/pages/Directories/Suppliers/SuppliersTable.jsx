import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse/Collapse';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import KeyboardArrowDownRounded from '@mui/icons-material/KeyboardArrowDownRounded';
import KeyboardArrowUpRounded from '@mui/icons-material/KeyboardArrowUpRounded';
import clsx from 'clsx';
import moment from 'moment';
import { useState } from 'react';
import { connect } from 'react-redux';

import { setDirectoryListParams } from '../../../../actions/directoriesActions';
import FormDatePicker from '../../../../Forms/fields/FormDatePicker';
import FormInput from '../../../../Forms/fields/FormInput';
import Filter from '../../../Theme/Table/Filter';
import NotResultRow from '../../../Theme/Table/NotResultRow';
import { StyledTable } from '../../../Theme/Table/StyledTable';
import { useRowStyles } from '../styles/RowStyles';
import { useTranslation } from 'react-i18next';
import StickyTableHead from '../../../Theme/Table/StickyTableHead';

const columns = [
  { title: 'FIELDS.USREOU', param: 'usreou', minWidth: 150 },
  { title: 'FIELDS.EIC', param: 'eic', minWidth: 150 },
  { title: 'FIELDS.NAME_OF_COMPANY', param: 'full_name', minWidth: 300 },
  { title: 'FIELDS.COMPANY_ADDRESS', param: 'address', minWidth: 200 },
  { title: 'FIELDS.PHONE', param: 'phone', minWidth: 180 }
];

const SuppliersTable = ({ dispatch, params, selectedDirectory }) => {
  const { t } = useTranslation();
  const [search, setSearch] = useState(params);
  const [timeOut, setTimeOut] = useState(null);

  const onSearch = (key, value) => {
    setSearch({ ...search, [key]: value });
    clearTimeout(timeOut);
    setTimeOut(
      setTimeout(() => {
        dispatch(setDirectoryListParams({ ...params, [key]: value, page: 1 }));
      }, 1000)
    );
  };

  const handleFilter = (filterValues) => {
    dispatch(
      setDirectoryListParams(
        filterValues ? { ...search, ...filterValues, page: 1, size: 25 } : { ...search, page: 1, size: 25 }
      )
    );
  };

  return (
    <StyledTable spacing={0}>
      <StickyTableHead>
        <TableRow>
          {columns.map(({ title, param, minWidth }) => (
            <TableCell style={{ minWidth: minWidth }} className={'MuiTableCell-head'} key={param}>
              <p>{t(title)}</p>
              <input type="text" value={search[param]} onChange={({ target }) => onSearch(param, target.value)} />
            </TableCell>
          ))}
          <Filter onChange={handleFilter} name={'suppliers-directory-filter-form'}>
            <Grid item xs={12}>
              <FormInput name={'short_name'} label={t('FIELDS.SHORT_NAME_OF_COMPANY')} />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormDatePicker
                label={t('FIELDS.START_DATE_REGISTRY')}
                name={'start_date_registry'}
                outFormat={'yyyy-MM-DD'}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormDatePicker
                label={t('FIELDS.END_DATE_REGISTRY')}
                name={'end_date_registry'}
                outFormat={'yyyy-MM-DD'}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormDatePicker
                label={t('FIELDS.DATE_ACQUISITION_STATUS_PON')}
                name={'date_acquisition_status_pon'}
                outFormat={'yyyy-MM-DD'}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormDatePicker
                label={t('FIELDS.DATE_LOSS_STATUS_PON')}
                name={'date_loss_status_pon'}
                outFormat={'yyyy-MM-DD'}
              />
            </Grid>
          </Filter>
        </TableRow>
        <TableRow style={{ height: 8 }}></TableRow>
      </StickyTableHead>
      <TableBody>
        {selectedDirectory?.data?.length > 0 ? (
          selectedDirectory?.data?.map((row, index) => <Row {...row} key={index} />)
        ) : (
          <NotResultRow span={8} text={t('NO_SUPPLIERS_DATA')} />
        )}
      </TableBody>
    </StyledTable>
  );
};

function Row(props) {
  const { short_name, start_date_registry, end_date_registry, date_acquisition_status_pon, date_loss_status_pon, uid } =
    props;
  const { t } = useTranslation();
  const classes = useRowStyles();
  const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow className={clsx(open && classes.rootOpen, classes.root)} data-marker={'table-row'}>
        {columns.map(({ param }) => (
          <TableCell data-marker={param} key={param}>
            {props[param]}
          </TableCell>
        ))}
        <TableCell align={'right'}>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
            className={classes.expand}
            data-marker={open ? 'expand' : 'collapse'}
          >
            {open ? <KeyboardArrowUpRounded /> : <KeyboardArrowDownRounded />}
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow className={classes.detail} data-marker={`table-row--detail id-${uid}`}>
        <TableCell style={{ paddingBottom: 8, paddingTop: 0, paddingLeft: 0, paddingRight: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1} className={classes.detailContainer}>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow className={classes.head}>
                    <TableCell style={{ minWidth: 400 }}>{t('FIELDS.SHORT_NAME_OF_COMPANY_SHORT')}</TableCell>
                    <TableCell style={{ minWidth: 100 }}>{t('FIELDS.START_DATE_REGISTRY')}</TableCell>
                    <TableCell style={{ minWidth: 100 }}>{t('FIELDS.END_DATE_REGISTRY')}</TableCell>
                    <TableCell style={{ minWidth: 100 }}>{t('FIELDS.DATE_ACQUISITION_STATUS_PON')}</TableCell>
                    <TableCell style={{ minWidth: 100 }}>{t('FIELDS.DATE_LOSS_STATUS_PON')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow className={classes.body}>
                    <TableCell data-marker={'short_name'}>{short_name}</TableCell>
                    <TableCell data-marker={'start_date_registry'}>
                      {start_date_registry && moment(start_date_registry, 'yyyy-MM-DD').format('DD.MM.yyyy')}
                    </TableCell>
                    <TableCell data-marker={'end_date_registry'}>
                      {end_date_registry && moment(end_date_registry, 'yyyy-MM-DD').format('DD.MM.yyyy')}
                    </TableCell>
                    <TableCell data-marker={'date_acquisition_status_pon'}>
                      {date_acquisition_status_pon &&
                        moment(date_acquisition_status_pon, 'yyyy-MM-DD').format('DD.MM.yyyy')}
                    </TableCell>
                    <TableCell data-marker={'date_loss_status_pon'}>
                      {date_loss_status_pon && moment(date_loss_status_pon, 'yyyy-MM-DD').format('DD.MM.yyyy')}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

const mapStateToProps = ({ directories }) => {
  return {
    params: directories.params,
    selectedDirectory: directories.selectedDirectory,
    error: directories.error
  };
};

export default connect(mapStateToProps)(SuppliersTable);
