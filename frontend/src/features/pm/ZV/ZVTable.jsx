import Grid from '@mui/material/Grid';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableHead from '@mui/material/TableHead';
import moment from 'moment';
import { useEffect, useRef, useState } from 'react';
import IconButton from '@material-ui/core/IconButton';
import CheckCircleOutlineRounded from '@mui/icons-material/CheckCircleOutlineRounded';
import RadioButtonUncheckedRounded from '@mui/icons-material/RadioButtonUncheckedRounded';
import NotResultRow from '../../../Components/Theme/Table/NotResultRow';
import { StyledTable } from '../../../Components/Theme/Table/StyledTable';
import DatePicker from '../../../Components/Theme/Fields/DatePicker';
import { Pagination } from '../../../Components/Theme/Table/Pagination';
import Filter from '../../../Components/Theme/Table/Filter';
import FormInput from '../../../Forms/fields/FormInput';
import { useRegTabStyles } from '../filterStyles';
import Row from '../Row';
import { useTranslation } from 'react-i18next';

const columns = [
  { id: 'eic', label: 'FIELDS.EIC_CODE_ZV', minWidth: 80 },
  { id: 'eic_odko', label: 'FIELDS.EIC_CODE_TYPE_X_PPKO_ODKO', minWidth: 180 },
  { id: 'interval_from', label: 'FIELDS.PERIOD_FROM', minWidth: 100 },
  { id: 'interval_to', label: 'FIELDS.PERIOD_TO', minWidth: 100 },
  { id: 'eic_y1', label: 'FIELDS.EIC_CODE_TYPE_Y1', minWidth: 100 },
  { id: 'eic_x1', label: 'FIELDS.EIC_CODE_TYPE_X1', minWidth: 100 },
  { id: 'eic_y_w2', label: 'FIELDS.EIC_CODE_TYPE_Y_W2', minWidth: 100 },
  { id: 'eic_x2', label: 'FIELDS.EIC_CODE_TYPE_X2', minWidth: 100 }
];

const filters = [
  { id: 'short_ppko', label: 'ODKO_SHORT_NAME' },
  { id: 'owner_name_1', label: 'OWNER_NAME_1' },
  { id: 'owner_name_2', label: 'OWNER_NAME_2' }
];

const ZVTable = ({ response, params, setParams, points, setPoints, loading, isAll, setIsAll }) => {
  const { t } = useTranslation();
  const classes = useRegTabStyles();
  const timeout = useRef(null);
  const [search, setSearch] = useState({});

  useEffect(() => {
    setParams((prev) => {
      const { context, ...newParams } = { ...prev, page: 1 };
      setSearch(newParams);
      return { context, ...newParams };
    });
  }, [setParams]);

  const onSearch = (id, value) => {
    if (!value || value === 'Invalid date') value = '';
    setSearch({ ...search, [id]: value });
    clearTimeout(timeout.current);
    if (!value || value.length === 0 || value.length >= 3) {
      timeout.current = setTimeout(() => {
        const { context, ...newParams } = { ...params, ...search, [id]: value, page: 1 };
        if (!value) delete newParams[id];
        setParams({ context, ...newParams });
        setSearch(newParams);
      }, 500);
    }
  };
  const getSearch = (id) => {
    switch (id) {
      case 'interval_from':
      case 'interval_to':
        return (
          <div className={classes.picker}>
            <DatePicker
              label={''}
              value={search[id] || null}
              id={id}
              onChange={(value) => onSearch(id, moment(value).startOf('day').utc().format())}
              minWidth={80}
              outFormat={'YYYY-MM-DD'}
              {...(id === 'interval_from' ? { minDate: moment('2019-07-01') } : {})}
            />
          </div>
        );
      default:
        return <input value={search[id] || ''} onChange={({ target }) => onSearch(id, target.value)} />;
    }
  };
  const handleFilter = (filters) => {
    setParams({ page: 1, size: params.size, context: params.context, ...filters });
  };
  const handleSelect = (eic) => {
    setPoints(points.includes(eic) ? points.filter((i) => i !== eic) : [...points, eic]);
  };
  const handleCheckedAll = () => {
    setPoints([]);
    setIsAll(!isAll);
  };

  return (
    <>
      <StyledTable spacing={0}>
        <TableHead>
          <TableRow>
            <TableCell>
              <div className={`${classes.checkedField} ${isAll ? classes.checkedField + '--checked' : ''}`}>
                <p>{t('ALL')}</p>
                <IconButton
                  aria-label={'select row'}
                  size={'small'}
                  onClick={handleCheckedAll}
                  data-marker={isAll ? 'selected' : 'not-selected'}
                >
                  {isAll ? <CheckCircleOutlineRounded /> : <RadioButtonUncheckedRounded />}
                </IconButton>
              </div>
            </TableCell>
            {columns.map(({ id, label, minWidth }) => (
              <TableCell style={{ minWidth }} key={id} data-marker={'table-cell-id'}>
                <p>{t(label)}</p>
                {getSearch(id)}
              </TableCell>
            ))}
            <Filter name={'pm_zvTab-filter-form'} onChange={handleFilter} unmount={true} autoApply={false}>
              {filters.map(({ id, label }) => (
                <Grid item xs={12} md={12} key={id}>
                  <FormInput label={t(label)} name={id} />
                </Grid>
              ))}
            </Filter>
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
                  innerColumns={filters}
                  isSelect={isAll ? !points.includes(point.eic) : points.includes(point.eic)}
                  handleSelect={handleSelect}
                />
              ))}
            </>
          )}
        </TableBody>
      </StyledTable>
      <Pagination {...response} loading={loading} params={params} onPaginate={(v) => setParams({ ...params, ...v })} />
    </>
  );
};

export default ZVTable;
