import React, { useEffect, useRef, useState } from 'react';
import { StyledTable } from '../../Components/Theme/Table/StyledTable';
import Collapse from '@material-ui/core/Collapse/Collapse';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TimelineSelector from './TimelineSelector';
import DatePicker from '../../Components/Theme/Fields/DatePicker';
import NotResultRow from '../../Components/Theme/Table/NotResultRow';
import { useParams } from 'react-router-dom';
import { mainApi } from '../../app/mainApi';
import { usePropertiesTimelineQuery } from './api';
import { useDatePickerStyles, useRowStyles } from './styles';
import Loading from '../../Components/Loadings/Loading';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { Box } from '@mui/material';
import CloseRounded from '@mui/icons-material/CloseRounded';
import ImportExportRounded from '@mui/icons-material/ImportExportRounded';
import KeyboardArrowUpRounded from '@mui/icons-material/KeyboardArrowUpRounded';
import KeyboardArrowDownRounded from '@mui/icons-material/KeyboardArrowDownRounded';
import { setCurrentDate, setSelectedDay, setSelectedMonth, setSelectedYear } from './slice';
import IconButton from '@mui/material/IconButton';
import { useTranslation } from 'react-i18next';
import useSearchLog from '../../services/actionsLog/useSearchLog';
import { COMPARE_CODES } from '../../util/directories';
import StickyTableHead from '../../Components/Theme/Table/StickyTableHead';

const columns = [
  { id: 'date', label: 'FIELDS.TIME', minWidth: 300, width: 100, align: 'left' },
  { id: 'name', label: 'FIELDS.CHARACTERISTICS_SHORT_NAME', minWidth: 120, align: 'left' },
  { id: 'value_prev', label: 'FIELDS.PREVIOUS', minWidth: 180, align: 'left' },
  { id: 'value', label: 'FIELDS.CURRENT', minWidth: 60, align: 'left' }
];

const MAX_DAYS_RANGE = 30;

const buttonSx = {
  background: 'white',
  fontSize: 16,
  width: '30px',
  height: '30px',
  marginTop: '8px',
  '&:hover': {
    backgroundColor: '#fff',
    borderColor: '#fff'
  }
};

const TimelineTab = ({ type }) => {
  const isByPeriod = type === 'by_period';
  const { t } = useTranslation();
  const { id } = useParams();
  const dispatch = useDispatch();
  const classes = useDatePickerStyles();
  const [search, setSearch] = useState({});
  const [params, setParams] = useState({
    date: moment().format('yyyy-MM-DD'),
    date_to: moment().format('yyyy-MM-DD'),
    by_validity: isByPeriod
  });
  const timeOut = useRef(null);
  const { selectedYear, selectedMonth, selectedDay } = useSelector(({ timelineSelector }) => timelineSelector);
  const { data: timeLineData } = mainApi.endpoints.propertiesTimelineDates.useQueryState({
    id,
    params: { by_validity: isByPeriod }
  });
  const { data, isFetching } = usePropertiesTimelineQuery({ id, params }, { skip: !(timeLineData?.length > 0) });

  const searchLog = useSearchLog(['Реєстр ТКО']);

  useEffect(() => {
    if (selectedYear !== null && selectedMonth !== null && selectedDay !== null) {
      const date = moment([selectedYear, selectedMonth, selectedDay]).format('yyyy-MM-DD');
      setParams((params) => ({ ...params, date: date, date_to: date, by_validity: isByPeriod }));
    }
  }, [selectedYear, selectedMonth, selectedDay, isByPeriod]);

  useEffect(() => {
    return () => dispatch(setCurrentDate());
  }, [dispatch]);

  const onSearch = (key, value) => {
    setSearch((prevSearch) => ({ ...prevSearch, [key]: value ?? '' }));
    clearTimeout(timeOut.current);
    timeOut.current = setTimeout(() => {
      setParams({ ...params, [key]: value ?? '' });
      searchLog();
    }, 1000);
  };

  const handleChangeDate = (date) => {
    if (!date || !moment(date).isValid()) return;

    const daysInRange = moment(params.date_to).diff(moment(date), 'days');

    const isDateOutOfRange = daysInRange > MAX_DAYS_RANGE || daysInRange < 0;

    setParams((params) => ({
      ...params,
      date,
      date_to: isDateOutOfRange ? moment(date).add(MAX_DAYS_RANGE, 'days').format('yyyy-MM-DD') : params.date_to
    }));
    searchLog();
  };

  const handleChangeDateTo = (date) => {
    if (!date || !moment(date).isValid()) return;

    const daysInRange = moment(date).diff(moment(params.date), 'days');

    const isDateOutOfRange = daysInRange > MAX_DAYS_RANGE || daysInRange < 0;

    setParams((params) => ({
      ...params,
      date: isDateOutOfRange ? moment(date).subtract(MAX_DAYS_RANGE, 'days').format('yyyy-MM-DD') : params.date,
      date_to: date
    }));
    searchLog();
  };

  const getSearch = (key) => {
    if (key === 'date') {
      return (
        <Box display={'flex'} gap={1} className={classes.picker}>
          <DatePicker
            onChange={handleChangeDate}
            value={params.date || null}
            outFormat={'yyyy-MM-DD'}
            maxDate={moment()}
            dataMarker={'date_from'}
          />
          <DatePicker
            onChange={handleChangeDateTo}
            value={params.date_to || null}
            outFormat={'yyyy-MM-DD'}
            minDate={params.date || null}
            maxDate={moment(params.date).add(30, 'days')}
            dataMarker={'date_to'}
          />
        </Box>
      );
    }
    return <input type="text" value={search[key] || ''} onChange={({ target }) => onSearch(key, target.value)} />;
  };

  const onSort = () => {
    setParams((params) => ({ ...params, sort: params.sort === 'asc' ? 'desc' : 'asc' }));
  };

  const clearFilters = () => {
    setSearch({});
    setParams({ date: moment().format('yyyy-MM-DD'), date_to: moment().format('yyyy-MM-DD') });
    dispatch(setSelectedYear(moment().year()));
    dispatch(setSelectedMonth(null));
    dispatch(setSelectedDay(null));
  };

  return (
    <>
      <Loading loading={isFetching} />
      <TimelineSelector type={type} />
      <StyledTable spacing={0}>
        <StickyTableHead>
          <TableRow>
            <TableCell
              style={{ minWidth: 50, lineHeight: '42px', textAlign: 'center' }}
              className={'MuiTableCell-head'}
              key={'header--1'}
            >
              <IconButton sx={buttonSx} onClick={onSort} data-marker={'sort'}>
                <ImportExportRounded style={{ color: '#233A81' }} />
              </IconButton>
            </TableCell>
            {columns.map((column) => (
              <TableCell
                style={{ minWidth: column.minWidth, width: column.width || 'initial' }}
                className={'MuiTableCell-head'}
                key={column.id}
                align={column.align}
              >
                <p>{t(column.label)}</p>
                {getSearch(column.id)}
              </TableCell>
            ))}
            <TableCell
              style={{ minWidth: 50, lineHeight: '42px', textAlign: 'center' }}
              className={'MuiTableCell-head'}
              key={'header--6'}
            >
              <IconButton sx={buttonSx} onClick={clearFilters} data-marker={'clearFilters'}>
                <CloseRounded style={{ color: '#233A81' }} />
              </IconButton>
            </TableCell>
          </TableRow>
          <TableRow style={{ height: 8 }}></TableRow>
        </StickyTableHead>
        <TableBody>
          {data?.length > 0 ? (
            data?.map((row, index) => (
              <Row
                key={`row-${index}`}
                isByPeriod={isByPeriod}
                data={row}
                columns={['created_at', 'name', 'value_prev', 'value']}
                innerColumns={[
                  { label: t('FIELDS.PROCESS'), value: 'name', width: '20%' },
                  { label: t('FIELDS.INITIATOR_LOGIN'), value: 'initiator', width: '20%' }
                ]}
              />
            ))
          ) : (
            <NotResultRow span={6} text={t('NO_CHANGES_FOUND_FOR_PERIOD')} />
          )}
        </TableBody>
      </StyledTable>
    </>
  );
};

const Row = ({ data, columns, innerColumns, isByPeriod }) => {
  const { i18n, t } = useTranslation();
  const classes = useRowStyles();
  const [open, setOpen] = useState(false);
  const [tooltip, setTooltip] = useState({ open: false, disable: false });

  function isIsoDate(value) {
    const isoDateTimeRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/;
    return isoDateTimeRegex.test(value);
  }

  const getProcessData = (key, data) => {
    if (key === 'created_at') {
      return moment(data[key]).locale(COMPARE_CODES[i18n.language]).format('dd • HH:mm • DD.MM.yyyy');
    }
    if (isIsoDate(data[key])) {
      return moment(data[key]).format(data?.code === '101-5' ? 'DD.MM.yyyy • HH:mm' : 'DD.MM.yyyy');
    }
    return data[key];
  };

  const getSubprocessData = (key, data) => {
    if (key === 'name') {
      const translation = [`SUBPROCESSES.${data[key]}`, `PROCESSES.${data[key]}`].find(i18n.exists);
      const name = translation ? t(translation) : data[key];
      return `${name}: id ${data.id}`;
    }
    return data[key];
  };

  useEffect(() => {
    if (isByPeriod) setOpen(false);
  }, [isByPeriod]);

  return (
    <>
      <TableRow className={open ? classes.rootOpen : classes.root} data-marker={'table-row'}>
        <TableCell style={{ fontSize: 0 }} data-marker={'id'}>
          {data?.process_id}
        </TableCell>
        {columns?.map((key, index) => (
          <TableCell key={'cell-' + index} data-marker={key}>
            {getProcessData(key, data)}
          </TableCell>
        ))}
        <TableCell align={'center'}>
          {!isByPeriod && (
            <IconButton
              aria-label="expand row"
              size="small"
              onMouseEnter={() => setTooltip({ open: false, disable: true })}
              onMouseLeave={() => setTooltip({ ...tooltip, disable: false })}
              onClick={(e) => {
                e.stopPropagation();
                setOpen(!open);
              }}
              sx={{
                fontSize: 21,
                border: open ? '1px solid #F28C60' : '1px solid #223B82',
                color: open ? '#F28C60' : '#223B82'
              }}
              data-marker={open ? 'expand' : 'collapse'}
            >
              {open ? <KeyboardArrowUpRounded /> : <KeyboardArrowDownRounded />}
            </IconButton>
          )}
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
            <Box className={classes.detailContainer}>
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
                    {innerColumns.map(({ value }, index) => (
                      <TableCell key={'cell' + index} data-marker={'body--' + value}>
                        {getSubprocessData(value, data.subprocess)}
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

export default TimelineTab;
