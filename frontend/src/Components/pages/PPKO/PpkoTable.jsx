import { makeStyles } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse/Collapse';
import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import KeyboardArrowDownRounded from '@mui/icons-material/KeyboardArrowDownRounded';
import KeyboardArrowUpRounded from '@mui/icons-material/KeyboardArrowUpRounded';
import PermContactCalendarRounded from '@mui/icons-material/PermContactCalendarRounded';
import moment from 'moment';
import propTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { setPpkoListParams } from '../../../actions/ppkoActions';
import FormInput from '../../../Forms/fields/FormInput';
import FormSelect from '../../../Forms/fields/FormSelect';
import SearchDate from '../../Tables/SearchDate';
import CircleButton from '../../Theme/Buttons/CircleButton';
import { LightTooltip } from '../../Theme/Components/LightTooltip';
import Filter from '../../Theme/Table/Filter';
import NotResultRow from '../../Theme/Table/NotResultRow';
import { StyledTable } from '../../Theme/Table/StyledTable';
import { useTranslation } from 'react-i18next';
import IconButton from '@mui/material/IconButton';
import StickyTableHead from '../../Theme/Table/StickyTableHead';

const PpkoTable = ({ dispatch, data, params }) => {
  const { t } = useTranslation();
  const [timeOut, setTimeOut] = useState(null);
  const [search, setSearch] = useState(params);
  const [updateRow, setUpdateRow] = useState(0);

  useEffect(() => {
    setUpdateRow((prev) => prev + 1);
  }, [params]);

  const onSearch = (key, value) => {
    setSearch({ ...search, [key]: value });
    clearTimeout(timeOut);
    setTimeOut(
      setTimeout(() => {
        dispatch(setPpkoListParams({ ...params, [key]: value, page: 1 }));
      }, 1000)
    );
  };

  const handleFilter = (filterValues) => {
    dispatch(
      setPpkoListParams(
        filterValues ? { ...search, ...filterValues, page: 1, size: 25 } : { ...search, page: 1, size: 25 }
      )
    );
  };

  const handleClearFilters = (formParams) => {
    let newParams = {};
    Object.entries(search).forEach(([id, oldValue]) => {
      newParams[id] = filters.find((i) => i.id === id) ? null : oldValue;
    });
    [
      'ra_roles__domain__eic_w__icontains',
      'ra_roles__domain__metering_grid_area_identification__icontains',
      'ra_roles__domain__metering_grid_area_name__icontains'
    ].forEach((id) => {
      if (id in search) newParams[id] = null;
    });
    newParams = { ...newParams, ...formParams, page: 1, size: 25 };
    dispatch(setPpkoListParams(newParams));
    setSearch(newParams);
  };

  const columns = [
    {
      id: 'ra_reference_book__eic__icontains',
      title: t('FIELDS.EIC_CODE_TYPE_X_PPKO'),
      minWidth: 150
    },
    {
      id: 'ra_reference_book__code_usreou__icontains',
      title: t('FIELDS.USREOU'),
      minWidth: 150
    },
    {
      id: 'ra_reference_book__full_name__icontains',
      title: t('FIELDS.FULL_NAME'),
      minWidth: 400
    }
  ];

  const filters = [
    { id: 'ra_roles__meter_operator__code__icontains', title: t('ROLES.METER_OPERATOR') },
    {
      id: 'ra_roles__meter_operator_func_design__code__icontains',
      title: t('METER_OPERATOR_FUNCTIONS.DESIGN_SHORT'),
      short: true
    },
    {
      id: 'ra_roles__meter_operator_func_commissioning__code__icontains',
      title: t('METER_OPERATOR_FUNCTIONS.COMMISSIONING_SHORT'),
      short: true
    },
    {
      id: 'ra_roles__meter_operator_func_calibration__code__icontains',
      title: t('METER_OPERATOR_FUNCTIONS.CALIBRATION_SHORT'),
      short: true
    },
    {
      id: 'ra_roles__meter_operator_func_repair__code__icontains',
      title: t('METER_OPERATOR_FUNCTIONS.REPAIR_SHORT'),
      short: true
    },
    { id: 'ra_roles__meter_point_admin__code__icontains', title: t('ROLES.METERING_POINT_ADMINISTRATOR') },
    { id: 'ra_roles__meter_data_collector__code__icontains', title: t('ROLES.METERED_DATA_COLLECTOR') },
    { id: 'ra_roles__meter_data_responsible__code__icontains', title: t('ROLES.METERED_DATA_RESPONSIBLE') }
  ];

  return (
    <StyledTable spacing={0}>
      <StickyTableHead>
        <TableRow>
          <TableCell
            style={{ minWidth: 70, lineHeight: '42px', textAlign: 'center' }}
            className={'MuiTableCell-head'}
            key={'header--1'}
          >
            <p>{t('FIELDS.CONTACTS')}</p>
          </TableCell>
          {columns.map((column, index) => (
            <TableCell
              style={{ minWidth: column.minWidth, width: column.width }}
              className={'MuiTableCell-head'}
              key={'header' + index}
            >
              <p>{column.title}</p>
              {column.id === 'date_of_change' ? (
                <SearchDate onSearch={onSearch} column={column} />
              ) : (
                <input
                  value={search[column.id] || ''}
                  onChange={({ target: { value } }) => {
                    if (column.id === 'ra_reference_book__code_usreou__icontains') {
                      onSearch(
                        column.id,
                        (/^\d+$/.test(value) || !value) && value.length < 11 ? value : search[column.id]
                      );
                      return;
                    }
                    onSearch(column.id, value);
                  }}
                />
              )}
            </TableCell>
          ))}
          <Filter name={'ppko-filter-form'} onChange={handleFilter} autoApply={false} onClear={handleClearFilters}>
            {filters.map((el) => (
              <Grid item xs={12} md={4} key={el.id}>
                <FormSelect
                  label={el.title}
                  name={el.id}
                  defaultIndex={0}
                  data={
                    el?.short
                      ? [
                          { value: '0', label: '0' },
                          { value: '1', label: '1' },
                          { value: '2', label: '2' },
                          { value: '3', label: '3' }
                        ]
                      : [
                          { value: '0', label: '0' },
                          { value: '1', label: '1' },
                          { value: '2', label: '2' },
                          { value: '3', label: '3' },
                          { value: '4', label: '4' }
                        ]
                  }
                />
              </Grid>
            ))}
            <Grid item xs={12} md={6}>
              <FormInput label={t('DOMAIN')} name={'ra_roles__domain__eic_w__icontains'} />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormInput
                label={t('FIELDS.METERING_GRID_AREA')}
                name={'ra_roles__domain__metering_grid_area_identification__icontains'}
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <FormInput label={t('FIELDS.AREA_NAME')} name={'ra_roles__domain__metering_grid_area_name__icontains'} />
            </Grid>
          </Filter>
        </TableRow>
        <TableRow style={{ height: 8 }}></TableRow>
      </StickyTableHead>
      <TableBody>
        {data?.length > 0 ? (
          data.map((row, index) => <Row {...row} key={`row-${index}-${updateRow}`} />)
        ) : (
          <NotResultRow span={6} text={t('PPKO_NOT_FOUND')} />
        )}
      </TableBody>
    </StyledTable>
  );
};

PpkoTable.propTypes = {
  data: propTypes.array,
  params: propTypes.object.isRequired
};

export default connect()(PpkoTable);

const usePpkoRowStyles = makeStyles({
  root: {
    boxShadow: '0px 4px 10px rgba(146, 146, 146, 0.1)',
    borderRadius: 10,
    '& > *': {
      paddingTop: 12,
      paddingBottom: 12,
      borderBottom: '1px solid #D1EDF3',
      borderTop: '1px solid #D1EDF3',
      backgroundColor: '#fff',
      fontSize: 12,
      color: '#567691',
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
    '& > *': {
      paddingTop: 12,
      paddingBottom: 12,
      borderBottom: '1px solid #D1EDF3',
      borderTop: '1px solid #D1EDF3',
      backgroundColor: '#D1EDF3',
      fontSize: 12,
      color: '#567691',
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
  detail: {
    '& > *': {
      borderBottom: 'none'
    }
  },
  detailContainer: {
    backgroundColor: '#fff',
    margin: 0,
    padding: '8px 16px 16px',
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
      borderBottom: '1px solid #567691 !important',
      padding: '10px !important',
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
      padding: 10
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

const getDate = (date) => {
  if (!date) return date;
  if (!moment(date, moment.ISO_8601).isValid()) {
    date = date.slice(0, -3);
  }
  return moment(date).format('DD.MM.yyyy');
};

const Row = ({ id, eic, code_usreou, full_name, ra_roles }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const classes = usePpkoRowStyles();
  const [open, setOpen] = useState(false);
  return (
    <>
      <TableRow className={open ? classes.rootOpen : classes.root} data-marker={'table-row'}>
        <TableCell align={'center'}>
          <CircleButton
            title={t('CONTROLS.SHOW_PPKO_CONTACTS')}
            size={'small'}
            icon={<PermContactCalendarRounded />}
            onClick={() => navigate(`/ppko/${id}`)}
            dataMarker={'contacts-btn'}
          />
        </TableCell>
        <TableCell data-marker={'eic'}>{eic}</TableCell>
        <TableCell data-marker={'code_usreou'}>{code_usreou}</TableCell>
        <TableCell data-marker={'full_name'}>{full_name}</TableCell>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
            sx={{
              fontSize: 21,
              border: open ? '1px solid #F28C60' : '1px solid #223B82',
              color: open ? '#F28C60' : '#223B82'
            }}
            data-marker={open ? 'expand' : 'collapse'}
          >
            {open ? <KeyboardArrowUpRounded /> : <KeyboardArrowDownRounded />}
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow className={classes.detail} data-marker={`table-row--detail id-${id}`}>
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
            <Box className={classes.detailContainer}>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow className={classes.head}>
                    <TableCell style={{ minWidth: 50 }} align={'center'}>
                      {t('ROLES.METERING_POINT_ADMINISTRATOR')}
                    </TableCell>
                    <TableCell style={{ minWidth: 50 }} align={'center'}>
                      {t('ROLES.METERED_DATA_COLLECTOR')}
                    </TableCell>
                    <TableCell style={{ minWidth: 50 }} align={'center'}>
                      {t('ROLES.METERED_DATA_RESPONSIBLE')}
                    </TableCell>
                    <TableCell style={{ minWidth: 50 }} align={'center'}>
                      {t('ROLES.METER_OPERATOR')}
                    </TableCell>
                    <TableCell style={{ minWidth: 50 }} align={'center'}>
                      <LightTooltip title={t('METER_OPERATOR_FUNCTIONS.DESIGN')} placement="top" arrow>
                        <span>{t('METER_OPERATOR_FUNCTIONS.DESIGN_SHORT')}</span>
                      </LightTooltip>
                    </TableCell>
                    <TableCell style={{ minWidth: 50 }} align={'center'}>
                      <LightTooltip title={t('METER_OPERATOR_FUNCTIONS.COMMISSIONING')} placement="top" arrow>
                        <span>{t('METER_OPERATOR_FUNCTIONS.COMMISSIONING_SHORT')}</span>
                      </LightTooltip>
                    </TableCell>
                    <TableCell style={{ minWidth: 50 }} align={'center'}>
                      <LightTooltip title={t('METER_OPERATOR_FUNCTIONS.CALIBRATION')} placement="top" arrow>
                        <span>{t('METER_OPERATOR_FUNCTIONS.CALIBRATION_SHORT')}</span>
                      </LightTooltip>
                    </TableCell>
                    <TableCell style={{ minWidth: 50 }} align={'center'}>
                      <LightTooltip title={t('METER_OPERATOR_FUNCTIONS.REPAIR')} placement="top" arrow>
                        <span>{t('METER_OPERATOR_FUNCTIONS.REPAIR_SHORT')}</span>
                      </LightTooltip>
                    </TableCell>
                    <TableCell style={{ minWidth: 120 }}>{t('DOMAIN')}</TableCell>
                    <TableCell style={{ width: 120 }}>{t('START_DATE_PPKO_ROLES')}</TableCell>
                    <TableCell style={{ width: 120 }}>{t('END_DATE_PPKO_ROLES')}</TableCell>
                    <TableCell style={{ minWidth: 120 }}>{t('FIELDS.METERING_GRID_AREA')}</TableCell>
                    <TableCell style={{ width: 260 }}>{t('FIELDS.AREA_NAME')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {ra_roles.map((roles, index) => {
                    return (
                      <TableRow key={'cell' + index} className={classes.body}>
                        <TableCell data-marker={'meter_point_admin'} align={'center'}>
                          {roles.meter_point_admin}
                        </TableCell>
                        <TableCell data-marker={'meter_data_collector'} align={'center'}>
                          {roles.meter_data_collector}
                        </TableCell>
                        <TableCell data-marker={'meter_data_responsible'} align={'center'}>
                          {roles.meter_data_responsible}
                        </TableCell>
                        <TableCell data-marker={'meter_operator'} align={'center'}>
                          {roles.meter_operator}
                        </TableCell>
                        <TableCell data-marker={'meter_operator_design_code'} align={'center'}>
                          {roles.meter_operator_design_code ? roles.meter_operator_design_code : 0}
                        </TableCell>
                        <TableCell data-marker={'meter_operator_commissioning_code'} align={'center'}>
                          {roles.meter_operator_commissioning_code ? roles.meter_operator_commissioning_code : 0}
                        </TableCell>
                        <TableCell data-marker={'meter_operator_calibration_code'} align={'center'}>
                          {roles.meter_operator_calibration_code ? roles.meter_operator_calibration_code : 0}
                        </TableCell>
                        <TableCell data-marker={'meter_operator_repair_code'} align={'center'}>
                          {roles.meter_operator_repair_code ? roles.meter_operator_repair_code : 0}
                        </TableCell>
                        <TableCell data-marker={'eic_w'}>{roles.domain?.eic_w}</TableCell>
                        <TableCell data-marker={'start_date_roles'}>{getDate(roles.start_date_roles)}</TableCell>
                        <TableCell data-marker={'end_date_roles'}>{getDate(roles.end_date_roles)}</TableCell>
                        <TableCell data-marker={'metering_grid_area_identification'}>
                          {roles.domain?.metering_grid_area_identification}
                        </TableCell>
                        <TableCell data-marker={'metering_grid_area_name'}>
                          {roles.domain?.metering_grid_area_name}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};
