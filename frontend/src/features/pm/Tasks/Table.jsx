import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableHead from '@mui/material/TableHead';
import moment from 'moment';
import { useRef, useState } from 'react';
import HighlightOffRounded from '@mui/icons-material/HighlightOffRounded';
import CircleButton from '../../../Components/Theme/Buttons/CircleButton';
import DatePicker from '../../../Components/Theme/Fields/DatePicker';
import TimePicker from '../../../Components/Theme/Fields/TimePicker';
import TableSelect from '../../../Components/Tables/TableSelect';
import NotResultRow from '../../../Components/Theme/Table/NotResultRow';
import { StyledTable } from '../../../Components/Theme/Table/StyledTable';
import { useRegTabStyles } from '../filterStyles';
import { useGetDataProcessManagerQuery } from './api';
import { useTranslation } from 'react-i18next';

const columns = [
  { id: 'parent_process_name', label: 'FIELDS.NAME', minWidth: 100 },
  { id: 'processes', label: 'FIELDS.PROCESS_BEFORE_START', minWidth: 150 },
  { id: 'startup_type', label: 'FIELDS.STARTUP_TYPE', minWidth: 50 },
  { id: 'period_type', label: 'FIELDS.PERIOD', minWidth: 50 },
  { id: 'day', label: 'FIELDS.DAY_NUMBER', minWidth: 50 },
  { id: 'send_to_mms', label: 'FIELDS.SEND_TO_MMS', minWidth: 50 },
  { id: 'first_start', label: 'FIELDS.STARTUP_TIME_WITH_PARAM_1', minWidth: 50 },
  { id: 'second_start', label: 'FIELDS.STARTUP_TIME_WITH_PARAM_2', minWidth: 50 },
  { id: 'period_from', label: 'FIELDS.PERIOD_FROM', minWidth: 50 },
  { id: 'period_to', label: 'FIELDS.PERIOD_TO', minWidth: 50 },
  { id: 'unique_time_series', label: 'FIELDS.UNIQUE_TIME_SERIES', minWidth: 120 }
];

const selectOptions = [{ value: '1', label: '1' }];

const mmsOptions = [
  { value: '0', label: 'CONTROLS.NO' },
  { value: '1', label: 'CONTROLS.YES' }
];

const Table = ({ params, setParams, handleDelete, settings }) => {
  const { t } = useTranslation();
  const classes = useRegTabStyles();
  const timeout = useRef(null);
  const [search, setSearch] = useState(params);
  const { data: tasks } = useGetDataProcessManagerQuery({ type: 'tasks', params });

  const onSearch = (id, value) => {
    setSearch({ ...search, [id]: value });
    if (id === 'parent_process_name' && value && value.length < 3) return;
    clearTimeout(timeout.current);
    timeout.current = setTimeout(() => {
      const newParams = { ...params, ...search, [id]: value };
      const times = {};
      for (const k in newParams) {
        if (k === 'first_start' || k === 'second_start') {
          if (newParams[k]) {
            newParams[k] = moment(newParams[k]).format('HH:mm:00');
            const time = newParams[k].split(':');
            times[k] = moment().set({ hour: time[0], minute: time[1] });
          } else delete newParams[k];
        } else if (newParams.period_type === 'DAY') {
          delete newParams.day;
        } else if (!newParams[id]) {
          delete newParams[id];
        }
      }
      setParams(newParams);
      setSearch({ ...newParams, ...times });
    }, 500);
  };

  const getOptions = (id) => {
    if (id === 'startup_type') return;
    if (id === 'period_type') return settings?.AUTO?.[id] || selectOptions;
    if (id === 'send_to_mms') return mmsOptions.map((i) => ({ ...i, label: t(i.label) }));
    if (id === 'day') return settings?.AUTO?.MONTH?.day || selectOptions;
    return settings?.[id] || selectOptions;
  };

  const getSearch = (id) => {
    switch (id) {
      case 'startup_type':
        return (
          <TableSelect
            value={settings?.[id]?.[1]?.value || null}
            data={settings?.[id]?.[1] ? [settings?.[id]?.[1]] : selectOptions}
            id={id}
            onChange={onSearch}
            minWidth={80}
            disabled={true}
          />
        );
      case 'processes':
      case 'period_type':
      case 'send_to_mms':
      case 'unique_time_series':
      case 'day':
        return (
          <TableSelect
            value={search[id]}
            data={getOptions(id)}
            id={id}
            onChange={onSearch}
            minWidth={80}
            disabled={id === 'day' && search.period_type === 'DAY'}
          />
        );
      case 'first_start':
      case 'second_start':
        return (
          <div className={classes.picker + ' ' + classes.timePicker}>
            <TimePicker label={''} value={search[id] || null} onChange={(value) => onSearch(id, value)} />
            <div className={classes.clearTimeButton}>
              <CircleButton
                title={t('CONTROLS.DELETE')}
                size={'small'}
                icon={<HighlightOffRounded />}
                onClick={() => onSearch(id, null)}
                dataMarker={'clear-time'}
              />
            </div>
          </div>
        );
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

  return (
    <StyledTable>
      <TableHead>
        <TableRow>
          {columns.map(({ id, label, minWidth }) => (
            <TableCell data-marker={id} style={{ minWidth }} key={id}>
              <p>{t(label)}</p>
              {getSearch(id)}
            </TableCell>
          ))}
          <TableCell></TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {tasks?.length < 1 ? (
          <NotResultRow span={12} text={t('PROCESSES_NOT_FOUND')} />
        ) : (
          <>
            {tasks?.map((row) => (
              <TableRow key={row?.id} tabIndex={-1} data-marker={'table-row'} className={'body__table-row'}>
                {columns.map(({ id }) => (
                  <TableCell
                    key={`${row?.id}-${id}`}
                    data-marker={id}
                    className={id === 'processes' ? classes.preText : ''}
                  >
                    {id === 'processes'
                      ? row?.[id]?.join('\n')
                      : (id === 'period_from' || id === 'period_to') && row?.[id]
                      ? moment(row?.[id]).format('DD.MM.YYYY')
                      : row?.[id]}
                  </TableCell>
                ))}
                {row?.can_deleted && (
                  <TableCell data-marker={'delete'} className={classes.cellDelete}>
                    <CircleButton
                      title={t('CONTROLS.CANCEL_PROCESS')}
                      type={'remove'}
                      size={'small'}
                      color={'red'}
                      onClick={() => handleDelete(row)}
                    />
                  </TableCell>
                )}
              </TableRow>
            ))}
          </>
        )}
      </TableBody>
    </StyledTable>
  );
};

export default Table;
