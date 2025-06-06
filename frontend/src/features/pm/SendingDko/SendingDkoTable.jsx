import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableHead from '@mui/material/TableHead';
import moment from 'moment';
import { useRef, useState } from 'react';
import NotResultRow from '../../../Components/Theme/Table/NotResultRow';
import { StyledTable } from '../../../Components/Theme/Table/StyledTable';
import TableSelect from '../../../Components/Tables/TableSelect';
import DatePicker from '../../../Components/Theme/Fields/DatePicker';
import { Pagination } from '../../../Components/Theme/Table/Pagination';
import { useRegTabStyles } from '../filterStyles';
import { useInitSendingDkoQuery } from './api';
import IconButton from '@mui/material/IconButton';
import CheckedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import UncheckedIcon from '@mui/icons-material/RadioButtonUncheckedRounded';
import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';

const columns = [
  { id: 'eic_zv', label: 'FIELDS.EIC_CODE_ZV', minWidth: 125 },
  { id: 'zv_type', label: 'FIELDS.ZV_TYPE', minWidth: 90 },
  { id: 'eic_odko', label: 'FIELDS.EIC_CODE_TYPE_X_ODKO', minWidth: 175 },
  { id: 'start_at', label: 'FIELDS.PERIOD_FROM', minWidth: 75 },
  { id: 'end_at', label: 'FIELDS.PERIOD_TO', minWidth: 75 },
  { id: 'source', label: 'FIELDS.SOURCE', minWidth: 90 },
  { id: 'eic_y1', label: 'FIELDS.EIC_CODE_TYPE_Y1', minWidth: 120 },
  { id: 'eic_x1', label: 'FIELDS.EIC_CODE_TYPE_X1', minWidth: 120 },
  { id: 'eic_y_w2', label: 'FIELDS.EIC_CODE_TYPE_Y_W2', minWidth: 130 },
  { id: 'eic_x2', label: 'FIELDS.EIC_CODE_TYPE_X2', minWidth: 125 }
];

const SendingDkoTable = ({ params, setParams, options, selected, excludes, filters, setFilters }) => {
  const { t } = useTranslation();
  const classes = useRegTabStyles();
  const timeout = useRef(null);
  const [search, setSearch] = useState(params);
  const { data: records, isFetching } = useInitSendingDkoQuery(params);

  const onSearch = (id, value) => {
    if ((id === 'start_at' || id === 'end_at') && value === 'Invalid date') value = null;
    const newParams = { ...search, [id]: value };
    if (!value) delete newParams[id];
    if ((newParams.start_at || newParams.end_at) && !newParams.source) {
      newParams.source = 'dhub';
    }

    setSearch(newParams);
    clearTimeout(timeout.current);
    if (!value || value.length === 0 || value.length > 0) {
      timeout.current = setTimeout(() => {
        setParams({ ...newParams, page: 1 });
      }, 500);
    }
  };

  const getSearch = (id) => {
    switch (id) {
      case 'zv_type':
      case 'source':
        return (
          <TableSelect
            value={search[id]}
            data={options[id].map((i) => ({ ...i, label: t(i.label) }))}
            id={id}
            onChange={onSearch}
            minWidth={80}
          />
        );
      case 'start_at':
        return (
          <div className={classes.picker}>
            <DatePicker
              label={''}
              value={search[id] || null}
              id={id}
              onChange={(value) => onSearch(id, moment(value).format())}
              minWidth={80}
              outFormat={'YYYY-MM-DD'}
              minDate={moment('2019-07-01')}
            />
          </div>
        );
      case 'end_at':
        return (
          <div className={classes.picker}>
            <DatePicker
              label={''}
              value={search[id] || null}
              id={id}
              onChange={(value) => onSearch(id, moment(value).format())}
              maxDate={new Date('9999-12-31')}
              minWidth={80}
              outFormat={'YYYY-MM-DD'}
            />
          </div>
        );
      default:
        return <input value={search[id] || ''} onChange={({ target }) => onSearch(id, target.value)} />;
    }
  };

  const handleSelectAll = () => {
    const isZv = (selected.includes('All') || selected.length === records?.total) && excludes.length !== records?.total;
    setFilters({ ...filters, zv: isZv ? [] : ['All'], excludes: [] });
  };

  const handleSelect = (eic_zv) => {
    if (selected.includes('All')) {
      setFilters({
        ...filters,
        excludes: excludes.includes(eic_zv) ? excludes.filter((eic) => eic !== eic_zv) : [...excludes, eic_zv]
      });
    } else {
      setFilters({
        ...filters,
        zv: selected.includes(eic_zv) ? selected.filter((eic) => eic !== eic_zv) : [...selected, eic_zv],
        excludes: []
      });
    }
  };

  const getData = (id, row) => {
    switch (id) {
      case 'zv_type':
        return row[id] ? t(`ZV_TYPE.${row[id]}`) : '–';
      case 'start_at':
      case 'end_at':
        return row[id] && moment(row[id]).format('DD.MM.yyyy');
      default:
        return row[id] || '–';
    }
  };

  return (
    <>
      <StyledTable>
        <TableHead>
          <TableRow>
            <TableCell style={{ minWidth: '55px', textAlign: 'center' }}>
              {records?.data?.length > 0 && (
                <Box sx={{ mr: 0.75 }}>
                  <p>{t('ALL').toUpperCase()}</p>
                  <IconButton
                    aria-label={'select row'}
                    size={'small'}
                    onClick={handleSelectAll}
                    style={{ marginTop: 7, border: 'none' }}
                    data-marker={selected.length ? 'selected' : 'not-selected'}
                  >
                    {(selected.includes('All') || selected.length === records?.total) && !excludes.length ? (
                      <CheckedIcon style={{ fontSize: 24, color: '#F28C60' }} />
                    ) : (
                      <UncheckedIcon style={{ fontSize: 24, color: '#FFF' }} />
                    )}
                  </IconButton>
                </Box>
              )}
            </TableCell>
            {columns.map(({ id, label, minWidth }) => (
              <TableCell style={{ minWidth }} key={id}>
                <p>{t(label)}</p>
                {getSearch(id)}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {records?.data?.length < 1 ? (
            <NotResultRow span={16} text={t('NO_RECORDS_FOUND')} />
          ) : (
            <>
              {records?.data?.map((row, index) => (
                <TableRow key={index} tabIndex={-1} data-marker={'table-row'} className={'body__table-row'}>
                  <TableCell>
                    <IconButton
                      aria-label={'select row'}
                      size={'small'}
                      onClick={() => handleSelect(row?.eic_zv)}
                      style={{ border: 'none' }}
                      data-marker={selected.includes(row?.eic_zv) ? 'selected' : 'not-selected'}
                    >
                      {(selected.includes('All') && !excludes.includes(row?.eic_zv)) ||
                      selected.includes(row?.eic_zv) ? (
                        <CheckedIcon style={{ fontSize: 24, color: '#F28C60' }} />
                      ) : (
                        <UncheckedIcon style={{ fontSize: 24, color: '#223B82' }} />
                      )}
                    </IconButton>
                  </TableCell>
                  {columns.map(({ id }) => (
                    <TableCell data-marker={id} key={'cell' + id}>
                      {getData(id, row)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </>
          )}
        </TableBody>
      </StyledTable>
      <Pagination
        {...records}
        loading={isFetching}
        params={params}
        onPaginate={(v) => setParams({ ...params, ...v })}
      />
    </>
  );
};

export default SendingDkoTable;
