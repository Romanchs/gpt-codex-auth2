import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableHead from '@mui/material/TableHead';
import moment from 'moment';
import { useRef, useState } from 'react';
import NotResultRow from '../../../Components/Theme/Table/NotResultRow';
import { StyledTable } from '../../../Components/Theme/Table/StyledTable';
import { Pagination } from '../../../Components/Theme/Table/Pagination';
import Row from './Row';
import TableSelect from '../../../Components/Tables/TableSelect';
import TimePicker from '../../../Components/Theme/Fields/TimePicker';
import CircleButton from '../../../Components/Theme/Buttons/CircleButton';
import HighlightOffRoundedIcon from '@mui/icons-material/HighlightOffRounded';
import DatePicker from '../../../Components/Theme/Fields/DatePicker';
import { useRegTabStyles } from '../../pm/filterStyles';
import { usePmTasksQuery } from '../api';
import { useTranslation } from 'react-i18next';
import useViewCallbackLog from '../../../services/actionsLog/useViewCallbackLog';
import useSearchLog from '../../../services/actionsLog/useSearchLog';
import { CONSTRUCTOR_ZV_LOG_TAGS } from '../../../services/actionsLog/constants';

const columns = [
  { id: 'name', label: 'FIELDS.NAME', minWidth: 600 },
  { id: 'startup_type', label: 'FIELDS.STARTUP_TYPE', minWidth: 50 },
  { id: 'period_type', label: 'FIELDS.PERIOD', minWidth: 50 },
  { id: 'day', label: 'FIELDS.DAY_NUMBER', minWidth: 50 },
  { id: 'first_start', label: 'FIELDS.STARTUP_TIME_WITH_PARAM_1', minWidth: 50 },
  { id: 'second_start', label: 'FIELDS.STARTUP_TIME_WITH_PARAM_2', minWidth: 50 },
  { id: 'period_from', label: 'FIELDS.PERIOD_FROM', minWidth: 50 },
  { id: 'period_to', label: 'FIELDS.PERIOD_TO', minWidth: 50 }
];

const innerColumns = [
  { id: 'eic', label: 'FIELDS.EIC_CODE' },
  { id: 'properties', label: 'FIELDS.TKO_DETAIL' }
];

const selectOptions = [{ value: '1', label: '1' }];

const SettingsTable = ({ settingsData, settings, setSettings, params, setParams, handleDelete, setReusedValue }) => {
  const { t } = useTranslation();
  const classes = useRegTabStyles();
  const timeout = useRef(null);
  const [search, setSearch] = useState(params);

  const { data: response, isFetching } = usePmTasksQuery(params);
  const onPaginateLog = useViewCallbackLog(CONSTRUCTOR_ZV_LOG_TAGS);
  const searchlog = useSearchLog(CONSTRUCTOR_ZV_LOG_TAGS);

  const onSearch = (id, value) => {
    setSearch({ ...search, [id]: value });
    if (id === 'name' && value && value.length < 3) return;
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
      searchlog();
    }, 500);
  };

  const onPaginate = (v) => {
    setParams({ ...params, ...v })
    onPaginateLog();
  }

  const getOptions = (id) => {
    if (id === 'startup_type') return;
    if (id === 'period_type') return settingsData?.AUTO?.[id] || selectOptions;
    if (id === 'day') return settingsData?.AUTO?.MONTH?.day || selectOptions;
    return settingsData?.[id] || selectOptions;
  };

  const getSearch = (id) => {
    switch (id) {
      case 'startup_type':
        return (
          <TableSelect
            value={settingsData?.[id]?.[1]?.value || null}
            data={settingsData?.[id]?.[1] ? [settingsData?.[id]?.[1]] : selectOptions}
            id={id}
            onChange={onSearch}
            minWidth={80}
            disabled={true}
          />
        );
      case 'period_type':
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
                icon={<HighlightOffRoundedIcon />}
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
    <>
      <StyledTable spacing={0}>
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            {columns.map(({ id, label, minWidth }) => (
              <TableCell style={{ minWidth }} key={id}>
                <p>{t(label)}</p>
                {getSearch(id)}
              </TableCell>
            ))}
            <TableCell></TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {response?.data?.length < 1 ? (
            <NotResultRow span={10} text={t('THERE_ARE_NO_AP')} />
          ) : (
            <>
              {response?.data?.map((point, index) => (
                <Row
                  key={`row-${index}`}
                  data={point}
                  columns={columns}
                  innerColumns={innerColumns}
                  settings={settings}
                  setSettings={setSettings}
                  handleDelete={handleDelete}
                  setReusedValue={setReusedValue}
                />
              ))}
            </>
          )}
        </TableBody>
      </StyledTable>
      <Pagination
        {...response}
        loading={isFetching}
        params={params}
        onPaginate={onPaginate}
      />
    </>
  );
};

export default SettingsTable;
