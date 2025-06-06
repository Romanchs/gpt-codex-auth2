import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell/TableCell';
import TableRow from '@material-ui/core/TableRow';
import moment from 'moment';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TableSelect from '../../../Components/Tables/TableSelect';
import DatePicker from '../../../Components/Theme/Fields/DatePicker';
import NotResultRow from '../../../Components/Theme/Table/NotResultRow';
import { StyledTable } from '../../../Components/Theme/Table/StyledTable';
import { Pagination } from '../../../Components/Theme/Table/Pagination';
import { useRegTabStyles } from '../filterStyles';
import { useGetListPMQuery, useGetRequestsSettingsPMQuery } from './api';
import { useTranslation } from 'react-i18next';
import StickyTableHead from '../../../Components/Theme/Table/StickyTableHead';

const columns = [
  { id: 'parent_process_name', label: 'FIELDS.NAME', minWidth: 150, value: 'parent_process_name' },
  { id: 'initiator', label: 'FIELDS.AUTOR', minWidth: 180 },
  { id: 'startup_type', label: 'FIELDS.STARTUP_TYPE', minWidth: 50 },
  { id: 'started_at', label: 'FIELDS.STARTUP_DATE', minWidth: 120 },
  { id: 'finished_at', label: 'FIELDS.FINISHED_DATE', minWidth: 120 },
  { id: 'period_from', label: 'FIELDS.PERIOD_FROM', minWidth: 80 },
  { id: 'period_to', label: 'FIELDS.PERIOD_TO', minWidth: 80 },
  { id: 'version', label: 'FIELDS.VERSION', minWidth: 80 },
  { id: 'unique_time_series', label: 'FIELDS.UNIQUE_TIME_SERIES', minWidth: 80 },
  { id: 'is_send', label: 'FIELDS.SENT', minWidth: 100, value: 'mms_status_label' },
  { id: 'is_error', label: 'FIELDS.ERRORS', minWidth: 50 },
  { id: 'is_done', label: 'DONE', minWidth: 120 }
];

const defaultOptions = [
  { value: '1', label: 'CONTROLS.YES' },
  { value: '0', label: 'CONTROLS.NO' }
];

const defaultParams = { page: 1, size: 25 };

const RegisterTab = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const classes = useRegTabStyles();
  const [params, setParams] = useState(defaultParams);
  const timeout = useRef(null);
  const [search, setSearch] = useState(params);
  const { data: list, isFetching } = useGetListPMQuery({ params });
  const { data: selectOptions } = useGetRequestsSettingsPMQuery();

  const onSearch = (id, value) => {
    if (!value) value = '';
    setSearch({ ...search, [id]: value });
    if (value && (id === 'parent_process_name' || id === 'initiator') && value.length < 3) return;
    clearTimeout(timeout.current);
    timeout.current = setTimeout(() => {
      setParams({ ...params, ...search, [id]: value, page: 1 });
    }, 500);
  };

  const getSearch = (id) => {
    switch (id) {
      case 'result':
      case 'process_count_aps':
      case 'percent_completed':
        return null;
      case 'is_send':
      case 'is_error':
      case 'is_done':
      case 'startup_type':
      case 'unique_time_series':
        return (
          <TableSelect
            value={search[id]}
            data={selectOptions?.[id] || defaultOptions.map((i) => ({ ...i, label: t(i.label) }))}
            id={id}
            onChange={onSearch}
            minWidth={80}
          />
        );
      case 'started_at':
      case 'finished_at':
      case 'period_from':
      case 'period_to':
        return (
          <div className={classes.picker}>
            <DatePicker
              label={''}
              value={search[id] || null}
              id={id}
              onChange={(value) => onSearch(id, value)}
              minWidth={80}
              outFormat={'YYYY-MM-DD'}
              {...(id === 'period_from' ? { minDate: moment('2019-07-01') } : {})}
            />
          </div>
        );
      default:
        return <input value={search[id] || ''} onChange={({ target }) => onSearch(id, target.value)} />;
    }
  };

  const getData = (id, value, row) => {
    if (id === 'started_at' || id === 'finished_at') {
      return (
        <TableCell data-marker={id} key={'cell' + id}>
          {value && moment(value).format('DD.MM.yyyy • HH:mm')}
        </TableCell>
      );
    }
    if (id === 'period_from' || id === 'period_to') {
      return (
        <TableCell data-marker={id} key={'cell' + id}>
          {value && moment(value).format('DD.MM.yyyy')}
        </TableCell>
      );
    }
    if (id === 'is_error') {
      return (
        <TableCell data-marker={id} key={'cell' + id} style={{ color: !row[id] ? 'green' : 'red' }} align={'center'}>
          {row[id] ? t('CONTROLS.YES') : t('CONTROLS.NO')}
        </TableCell>
      );
    }
    if (id === 'is_send' || id === 'is_done') {
      return (
        <TableCell data-marker={id} key={'cell' + id} style={{ color: row[id] ? 'green' : 'red' }} align={'center'}>
          {row[id] ? t('CONTROLS.YES') : t('CONTROLS.NO')}
        </TableCell>
      );
    }
    if (id === 'unique_time_series') {
      return (
        <TableCell data-marker={id} key={'cell' + id} align={'center'}>
          {row[id] ? t('ON') : t('OFF')}
        </TableCell>
      );
    }
    return (
      <TableCell data-marker={id} key={'cell' + id}>
        {value || '-'}
      </TableCell>
    );
  };

  return (
    <>
      <StyledTable>
        <StickyTableHead>
          <TableRow>
            {columns.map(({ id, label, minWidth }) => (
              <TableCell style={{ minWidth }} className={'MuiTableCell-head'} key={id}>
                <p>{t(label)}</p>
                {getSearch(id)}
              </TableCell>
            ))}
          </TableRow>
        </StickyTableHead>
        <TableBody>
          {list?.data?.length > 0 ? (
            list.data?.map((row, index) => (
              <TableRow
                key={'row' + index}
                className="body__table-row"
                onClick={() => navigate(`/process-manager/${row.uid}`)}
                data-marker="table-row"
                hover
              >
                {columns.map(({ id, value }) => getData(id, value ? row[value] : row[id], row))}
              </TableRow>
            ))
          ) : (
            <NotResultRow span={10} text={t('PROCESSES_NOT_FOUND')} />
          )}
        </TableBody>
      </StyledTable>
      <Pagination {...list} loading={isFetching} params={params} onPaginate={(v) => setParams({ ...params, ...v })} />
    </>
  );
};

export default RegisterTab;
