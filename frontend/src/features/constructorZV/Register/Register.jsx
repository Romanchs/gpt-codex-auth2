import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell/TableCell';
import TableRow from '@material-ui/core/TableRow';
import moment from 'moment';
import { useRef, useState } from 'react';
import TableSelect from '../../../Components/Tables/TableSelect';
import DatePicker from '../../../Components/Theme/Fields/DatePicker';
import NotResultRow from '../../../Components/Theme/Table/NotResultRow';
import { StyledTable } from '../../../Components/Theme/Table/StyledTable';
import { Pagination } from '../../../Components/Theme/Table/Pagination';
import { useRegTabStyles } from '../../pm/filterStyles';
import { useProcessesQuery } from '../api';
import CircleButton from '../../../Components/Theme/Buttons/CircleButton';
import { LightTooltip } from '../../../Components/Theme/Components/LightTooltip';
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';
import { useTranslation } from 'react-i18next';
import useViewCallbackLog from '../../../services/actionsLog/useViewCallbackLog';
import useSearchLog from '../../../services/actionsLog/useSearchLog';
import { CONSTRUCTOR_ZV_LOG_TAGS } from '../../../services/actionsLog/constants';
import StickyTableHead from '../../../Components/Theme/Table/StickyTableHead';

const columns = [
  { id: 'name', label: 'FIELDS.NAME', minWidth: 150, value: 'name' },
  { id: 'initiator', label: 'FIELDS.AUTOR', minWidth: 180 },
  { id: 'startup_type', label: 'FIELDS.STARTUP_TYPE', minWidth: 50 },
  { id: 'started_at', label: 'FIELDS.STARTUP_DATE', minWidth: 120 },
  { id: 'finished_at', label: 'FIELDS.FINISHED_DATE', minWidth: 120 },
  { id: 'period_from', label: 'FIELDS.PERIOD_FROM', minWidth: 80 },
  { id: 'period_to', label: 'FIELDS.PERIOD_TO', minWidth: 80 },
  { id: 'is_done', label: 'DONE', minWidth: 120 },
  { id: 'status', label: 'FIELDS.STATUS', minWidth: 80 }
];

const defaultOptions = [
  { value: '1', label: 'CONTROLS.YES' },
  { value: '0', label: 'CONTROLS.NO' }
];

const selectOptions = {
  startup_type: [
    {
      value: 'MANUAL',
      label: 'MANUAL'
    },
    {
      value: 'AUTO',
      label: 'AUTO'
    }
  ]
};

const Register = ({ params, setParams }) => {
  const { t } = useTranslation();
  const classes = useRegTabStyles();
  const timeout = useRef(null);
  const [search, setSearch] = useState(params);
  const { data, isFetching, refetch } = useProcessesQuery(params);
  const onPaginateLog = useViewCallbackLog(CONSTRUCTOR_ZV_LOG_TAGS);
  const searchlog = useSearchLog(CONSTRUCTOR_ZV_LOG_TAGS);

  const onSearch = (id, value) => {
    if (!value) value = '';
    setSearch({ ...search, [id]: value });
    if (value && (id === 'name' || id === 'initiator') && value.length < 3) return;
    clearTimeout(timeout.current);
    timeout.current = setTimeout(() => {
      setParams({ ...params, ...search, [id]: value, page: 1 });
      searchlog();
    }, 500);
  };

  const onPaginate = (v) => {
    setParams({ ...params, ...v });
    onPaginateLog();
  };

  const getSearch = (id) => {
    switch (id) {
      case 'is_done':
      case 'startup_type':
        return (
          <TableSelect
            value={search[id]}
            data={(selectOptions?.[id] || defaultOptions).map((i) => ({ ...i, label: t(i.label) }))}
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
      case 'status':
        return search[id];
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
    if (id === 'is_done') {
      return (
        <TableCell data-marker={id} key={'cell' + id} align={'center'}>
          {row[id] ? t('CONTROLS.YES') : t('CONTROLS.NO')}
        </TableCell>
      );
    }
    if (id === 'status') {
      if (row?.status === 'DONE') {
        return (
          <TableCell data-marker={id} key={'cell' + id} align={'center'}>
            <CircleButton type={'done'} title={t('DONE')} size={'small'} />
          </TableCell>
        );
      }
      if (row?.status === 'IN_PROCESS') {
        return (
          <TableCell data-marker={id} key={'cell' + id} align={'center'}>
            <CircleButton type={'loading'} title={t('IN_PROGRESS')} size={'small'} onClick={() => refetch()} />
          </TableCell>
        );
      }
      if (row?.status === 'SYSTEM_ERROR') {
        return (
          <TableCell data-marker={id} key={'cell' + id} align={'center'}>
            <LightTooltip title={t('SYSTEM_ERROR')} arrow>
              <WarningRoundedIcon data-marker={'error'} style={{ color: '#f90000', fontSize: 22, cursor: 'pointer' }} />
            </LightTooltip>
          </TableCell>
        );
      }
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
          {data?.data?.length > 0 ? (
            data.data?.map((row, index) => (
              <TableRow key={'row' + index} className="body__table-row" data-marker="table-row">
                {columns.map(({ id, value }) => getData(id, value ? row[value] : row[id], row))}
              </TableRow>
            ))
          ) : (
            <NotResultRow span={10} text={t('PROCESSES_NOT_FOUND')} />
          )}
        </TableBody>
      </StyledTable>
      <Pagination {...data} loading={isFetching} params={params} onPaginate={onPaginate} />
    </>
  );
};

export default Register;
