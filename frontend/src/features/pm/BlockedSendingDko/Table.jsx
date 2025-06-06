import Box from '@mui/material/Box';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableHead from '@mui/material/TableHead';
import moment from 'moment';
import { useRef, useState } from 'react';
import IconButton from '@material-ui/core/IconButton';
import CheckCircleOutlineRounded from '@mui/icons-material/CheckCircleOutlineRounded';
import RadioButtonUncheckedRounded from '@mui/icons-material/RadioButtonUncheckedRounded';
import NotResultRow from '../../../Components/Theme/Table/NotResultRow';
import { StyledTable } from '../../../Components/Theme/Table/StyledTable';
import TableSelect from '../../../Components/Tables/TableSelect';
import DatePicker from '../../../Components/Theme/Fields/DatePicker';
import { Pagination } from '../../../Components/Theme/Table/Pagination';
import { useRegTabStyles } from '../filterStyles';
import { useBlockedSendingDkoQuery } from './api';
import Row from './Row';
import { useTranslation } from 'react-i18next';

const columns = [
  { id: 'zv_eic', label: 'FIELDS.EIC_CODE_ZV', minWidth: 125 },
  { id: 'zv_type', label: 'FIELDS.ZV_TYPE', minWidth: 90 },
  { id: 'ppko_eic', label: 'FIELDS.EIC_CODE_TYPE_X_ODKO', minWidth: 175 },
  { id: 'period_from', label: 'FIELDS.PERIOD_FROM', minWidth: 120 },
  { id: 'period_to', label: 'FIELDS.PERIOD_TO', minWidth: 120 },
  { id: 'locked', label: 'DISPATCH', minWidth: 90 },
  { id: 'mga_eic', label: 'FIELDS.EIC_CODE_TYPE_Y1', minWidth: 120 },
  { id: 'x1_eic', label: 'FIELDS.EIC_CODE_TYPE_X1', minWidth: 120 },
  { id: 'y_w2_eic', label: 'FIELDS.EIC_CODE_TYPE_Y_W2', minWidth: 130 },
  { id: 'x2_eic', label: 'FIELDS.EIC_CODE_TYPE_X2', minWidth: 125 }
];

const datePickerSx = { '.MuiFormControl-root .MuiInputBase-root': { borderRadius: 1, input: { p: '4px 7px 3.4px' } } };

const Table = ({ params, setParams, options, filters, setFilters }) => {
  const { t } = useTranslation();
  const classes = useRegTabStyles();
  const timeout = useRef(null);
  const [search, setSearch] = useState(params);
  const { currentData, isFetching } = useBlockedSendingDkoQuery(params);

  const onSearch = (id, value) => {
    if ((id === 'period_from' || id === 'period_to') && value === 'Invalid date') value = null;
    const newParams = { ...search, [id]: value };
    if (!value) delete newParams[id];
    if ((newParams['period_from'] || newParams['period_to']) && !newParams['locked']) {
      newParams['locked'] = '0';
    }

    setSearch(newParams);
    setFilters({ ...filters, points: [] });
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
      case 'locked':
        return (
          <TableSelect
            value={search[id]}
            data={options[id].map((i) => ({ ...i, label: t(i.label) }))}
            id={id}
            onChange={onSearch}
            minWidth={80}
          />
        );
      case 'period_from':
        return (
          <Box className={classes.picker} sx={datePickerSx}>
            <DatePicker
              label={''}
              value={search[id] || null}
              id={id}
              onChange={(value) => onSearch(id, moment(value).format())}
              minWidth={80}
              outFormat={'YYYY-MM-DD'}
              minDate={moment('2019-07-01')}
            />
          </Box>
        );
      case 'period_to':
        return (
          <Box className={classes.picker} sx={datePickerSx}>
            <DatePicker
              label={''}
              value={search[id] || null}
              id={id}
              onChange={(value) => onSearch(id, moment(value).format())}
              maxDate={new Date('9999-12-31')}
              minWidth={80}
              outFormat={'YYYY-MM-DD'}
            />
          </Box>
        );
      default:
        return <input value={search[id] || ''} onChange={({ target }) => onSearch(id, target.value)} />;
    }
  };

  const handleSelect = (zv_eic) => {
    setFilters({
      ...filters,
      points: filters.points.includes(zv_eic) ? filters.points.filter((i) => i !== zv_eic) : [...filters.points, zv_eic]
    });
  };

  const handleCheckedAll = () => {
    setFilters({
      ...filters,
      points: [],
      all: !filters.all
    });
  };

  return (
    <>
      <StyledTable spacing={0}>
        <TableHead>
          <TableRow>
            <TableCell style={{ minWidth: '55px', textAlign: 'center' }}>
              {currentData?.data?.length > 0 && (
                <Box sx={{ mr: 0.75 }}>
                  <p>{t('ALL').toUpperCase()}</p>
                  <IconButton
                    aria-label={'select row'}
                    size={'small'}
                    onClick={handleCheckedAll}
                    style={{ marginTop: 7, border: 'none' }}
                    data-marker={filters.all ? 'selected' : 'not-selected'}
                  >
                    {filters.all ? (
                      <CheckCircleOutlineRounded style={{ fontSize: 24, color: '#F28C60' }} />
                    ) : (
                      <RadioButtonUncheckedRounded style={{ fontSize: 24, color: '#FFF' }} />
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
            <TableCell></TableCell>
          </TableRow>
          <TableRow sx={{ height: 8 }} />
        </TableHead>
        <TableBody>
          {currentData?.data?.length > 0 ? (
            currentData?.data?.map((row) => (
              <Row
                key={row?.uid}
                data={row}
                columns={columns}
                innerColumns={[
                  { id: 'period_from', label: t('FIELDS.PERIOD_FROM') },
                  { id: 'period_to', label: t('FIELDS.PERIOD_TO') },
                  { id: 'cancel_button', label: t('CONTROLS.CANCEL'), width: 70, align: 'center' }
                ]}
                isSelect={filters.all ? !filters.points.includes(row.zv_eic) : filters.points.includes(row.zv_eic)}
                handleSelect={handleSelect}
              />
            ))
          ) : (
            <NotResultRow span={16} text={t('NO_RECORDS_FOUND')} />
          )}
        </TableBody>
      </StyledTable>
      <Pagination
        {...currentData}
        loading={isFetching}
        params={params}
        onPaginate={(v) => setParams({ ...params, ...v })}
      />
    </>
  );
};

export default Table;
