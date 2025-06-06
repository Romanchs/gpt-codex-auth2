import { TableCell } from '@material-ui/core';
import makeStyles from '@material-ui/core/styles/makeStyles';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { DatePicker } from '@material-ui/pickers';
import clsx from 'clsx';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { clearPonRequestDkoResults, getPonRequestHistoricalDkoResults } from '../../../../actions/ponActions';
import Page from '../../../Global/Page';
import NotResultRow from '../../../Theme/Table/NotResultRow';
import { Pagination } from '../../../Theme/Table/Pagination';
import { StyledTable } from '../../../Theme/Table/StyledTable';
import { useTranslation } from 'react-i18next';

const columns = [
  { key: 'eic', label: 'FIELDS.EIC_CODE', minWidth: 150, search: true },
  { key: 'year', label: 'FIELDS.YEAR', minWidth: 80, align: 'center' },
  { key: 'january', label: 'MONTHS.JANUARY', minWidth: 80, align: 'center' },
  { key: 'february', label: 'MONTHS.FEBRUARY', minWidth: 80, align: 'center' },
  { key: 'march', label: 'MONTHS.MARCH', minWidth: 80, align: 'center' },
  { key: 'april', label: 'MONTHS.APRIL', minWidth: 80, align: 'center' },
  { key: 'may', label: 'MONTHS.MAY', minWidth: 80, align: 'center' },
  { key: 'june', label: 'MONTHS.JUNE', minWidth: 80, align: 'center' },
  { key: 'july', label: 'MONTHS.JULY', minWidth: 80, align: 'center' },
  { key: 'august', label: 'MONTHS.AUGUST', minWidth: 80, align: 'center' },
  { key: 'september', label: 'MONTHS.SEPTEMBER', minWidth: 80, align: 'center' },
  { key: 'october', label: 'MONTHS.OCTOBER', minWidth: 80, align: 'center' },
  { key: 'november', label: 'MONTHS.NOVEMBER', minWidth: 80, align: 'center' },
  { key: 'december', label: 'MONTHS.DECEMBER', minWidth: 80, align: 'center' }
];

export const RequestHDResults = () => {
  const {t} = useTranslation();
  const { uid } = useParams();
  const dispatch = useDispatch();
  const { loading, data } = useSelector(({ pon }) => pon.requestDkoResults);
  const [filter, setFilter] = useState('');
  const [params, setParams] = useState({ page: 1, size: 25 });

  useEffect(() => {
    dispatch(getPonRequestHistoricalDkoResults(uid, params));
    return () => dispatch(clearPonRequestDkoResults());
  }, [dispatch, uid, params]);

  return (
    <Page
      pageName={t('PAGES.GTS_UPLOAD_RESULTS')}
      backRoute={`/processes/pon/request-historical-dko/${uid}`}
      loading={loading}
      faqKey={'GTS__GTS_UPLOAD_RESULTS'}
    >
      <StyledTable>
        <TableHead>
          <TableRow>
            {columns.map(({ key, label, minWidth, search, align }) => (
              <TableCell style={{ minWidth, paddingBottom: search ? 12 : 34 }} key={key} align={align}>
                {t(label)}
                {search && <input type="text" value={filter} onChange={({ target }) => setFilter(target.value)} />}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.data?.filter((i) => i?.eic?.includes(filter)).length === 0 ? (
            <NotResultRow text={t('AP_NOT_FOUND')} span={14} small />
          ) : (
            data?.data?.filter((i) => i?.eic?.includes(filter))?.map((d, index) => <Row {...d} key={'row-' + index} />)
          )}
        </TableBody>
      </StyledTable>
      <Pagination
        {...data}
        loading={loading}
        params={params}
        onPaginate={(p) => setParams({ ...params, ...p })}
        renderPagesSum={({ data, current_page, total }) => {
          return (
            <p>
              {data?.length > 0 ? (current_page - 1) * params.size + 1 : 0} -{' '}
              {(current_page - 1) * params.size + data?.length / 2 || 0} з {total || 0}
              {` ${t('PAGINATION.ELEMENTS')}`}
            </p>
          );
        }}
      />
    </Page>
  );
};

const rowStyles = makeStyles(() => ({
  status: {
    display: 'inline-block',
    verticalAlign: 'sub',
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 8
  },
  day: {
    width: 28,
    lineHeight: '28px',
    textAlign: 'center',
    margin: '4px 6px',
    padding: 0,
    fontSize: 12,
    fontWeight: 500,
    color: '#567691',
    borderRadius: 20,
    boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.2)',
    '&.danger': {
      color: '#fff',
      backgroundColor: '#FF0000'
    }
  }
}));

const Row = ({ eic, status, year, ...months }) => {
  const classes = rowStyles();
  const monthsColumns = columns.filter((i) => i.key !== 'eic' && i.key !== 'year');

  const cellStatus = (key) => {
    if (months[key]?.length === 0) {
      return 'done';
    }
    if (months[key]?.length < moment(`${key} ${year}`).daysInMonth()) {
      return 'partially_done';
    }
    return 'failed';
  };

  return (
    <>
      <TableRow data-marker="table-row" className="body__table-row">
        <TableCell data-marker="eic" data-status={`send_${status ? 'done' : 'failed'}`}>
          <span className={classes.status} style={{ backgroundColor: status ? '#008C0C' : '#FF0000' }}></span>
          {eic}
        </TableCell>
        <TableCell align={'center'} data-marker={'year'}>
          {year}
        </TableCell>
        {monthsColumns.map(({ key }) => (
          <TableCell align={'center'} key={'cell-' + key}>
            {!months[key] && <span className={classes.status} style={{ backgroundColor: '#fff' }}></span>}
            {months[key]?.length === 0 && (
              <span
                className={classes.status}
                style={{ backgroundColor: '#008C0C' }}
                data-marker={key}
                data-status={cellStatus(key)}
              ></span>
            )}
            {months[key]?.length > 0 && (
              <DatePicker
                variant="inline"
                views={['date']}
                value={moment(`${key} ${year} 01`)}
                onChange={() => null}
                minDate={moment(`${key} ${year} 01`)}
                maxDate={moment(`${key} ${year} 27`)}
                disableToolbar
                TextFieldComponent={({ inputRef, onClick, onKeyDown }) => {
                  const haveMissedDate = months[key]?.length < moment(`${key} ${year}`).daysInMonth();
                  return (
                    <span
                      ref={inputRef}
                      onClick={onClick}
                      onKeyDown={onKeyDown}
                      className={classes.status}
                      style={{
                        backgroundColor: haveMissedDate ? '#567691' : '#9DAAC2',
                        cursor: 'pointer'
                      }}
                      data-marker={key}
                      data-status={cellStatus(key)}
                    ></span>
                  );
                }}
                renderDay={(day, selectedDate, isInCurrentMonth) => {
                  const number = moment(day).format('D');
                  const danger = Boolean(months[key].find((d) => d.toString() === number));
                  return (
                    <div className={clsx(classes.day, danger && 'danger')} data-status={danger ? 'inactive' : 'active'}>
                      {isInCurrentMonth && number}
                    </div>
                  );
                }}
              />
            )}
          </TableCell>
        ))}
      </TableRow>
    </>
  );
};
