import Grid from '@mui/material/Grid';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setParams } from '../../slice';
import moment from 'moment';
import NotResultRow from '../../../../Components/Theme/Table/NotResultRow';
import { StyledTable } from '../../../../Components/Theme/Table/StyledTable';
import TableSelect from '../../../../Components/Tables/TableSelect';
import Filter from '../../../../Components/Theme/Table/Filter';
import FormMultiSelect from '../../../../Forms/fields/FormMultiSelect';
import TableHeadCell from '../../../../Components/Tables/TableHeadCell';
import { Pagination } from '../../../../Components/Theme/Table/Pagination';
import { mainApi } from '../../../../app/mainApi';
import { updateForm } from '../../../../Forms/formActions';
import { useListMDCHECKDKOZQuery } from '../api';
import { useTranslation } from 'react-i18next';
import TableDatePicker from '../../../../Components/Tables/TableDatePicker';
import Row from './Row';
import useViewCallbackLog from '../../../../services/actionsLog/useViewCallbackLog';
import useSearchLog from '../../../../services/actionsLog/useSearchLog';
import { MONITORING_DKO_LOG_TAGS } from '../../../../services/actionsLog/constants';
import { useNavigate } from 'react-router-dom';
import { getBlockOfChecksValues, getChecksValues } from '../utils';
import StickyTableHead from '../../../../Components/Theme/Table/StickyTableHead';

const defaultLists = { ap_group: [], source: [], block_of_checks: [], checks: {} };

const columns = [
  {
    id: 'finished_at',
    label: 'FIELDS.FORMED',
    minWidth: 80,
    type: 'date'
  },
  { id: 'file_name', label: 'CHECK_DKO_Z.FIELDS.RESULT_FILE_NAME', minWidth: 320 },
  { id: 'ap_group', label: 'FIELDS.GROUP', minWidth: 50, type: 'select' },
  { id: 'source', label: 'CHECK_DKO_Z.FIELDS.SOURCE', minWidth: 80, type: 'select' },
  { id: 'mga_eic', label: 'FIELDS.METERING_GRID_AREA_EIC', minWidth: 320, sx: { width: 320 } },
  { id: 'created_by', label: 'FIELDS.AUTOR', minWidth: 120 }
];

const innerColumns = [
  { id: 'checks', label: 'CHECK_DKO_Z.FIELDS.CHECK', type: 'select' },
  { id: 'block_of_checks', label: 'CHECK_DKO_Z.FIELDS.BLOCK', type: 'select' }
];

const Table = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useSelector((store) => store.monitoringDko.params);
  const [search, setSearch] = useState({});
  const timeout = useRef(null);
  const COLUMNS_TYPES = useMemo(
    () => Object.fromEntries([...columns, ...innerColumns].map((i) => [i.id, i.type || 'text'])),
    []
  );

  const FORM_NAME = 'monitorinkDko_checkDkoZ-filter-form';
  const formActiveField = useSelector((store) => store.forms.activeField);
  const formData = useSelector((store) => store.forms[FORM_NAME]);
  const [checksList, setChecksList] = useState([]);
  const [unmountForm, setUnmountForm] = useState(1);

  const onPaginateLog = useViewCallbackLog();
  const searchLog = useSearchLog(MONITORING_DKO_LOG_TAGS);

  const { currentData: settings } = mainApi.endpoints.settingsMDCHECKDKOZ.useQueryState();

  const LISTS_DATA = useMemo(() => {
    if (!settings?.fields) return defaultLists;
    return {
      ap_group: settings.fields.find((i) => i.key === 'group')?.values,
      source: settings.fields.find((i) => i.key === 'source')?.values,
      block_of_checks: getBlockOfChecksValues(
        settings.fields.find((i) => i.key === 'block_of_checks')?.values,
        params?.ap_group
      ),
      checks: []
    };
  }, [settings, params]);

  const { currentData, isFetching, error } = useListMDCHECKDKOZQuery(params);

  useEffect(() => {
    if (error?.status === 403) navigate('/');
  }, [error]);

  useEffect(() => {
    if (params?.ap_group)
      setChecksList(getChecksValues(settings?.settings?.checks, formData?.block_of_checks, params?.ap_group));
    if (!formData || formActiveField !== 'block_of_checks') return;
    dispatch(updateForm(FORM_NAME, 'checks', null));
  }, [dispatch, LISTS_DATA, formData, formActiveField, params]);

  const handleUpdateParams = (newParams) => {
    for (const id in newParams) {
      if (!newParams[id] || (COLUMNS_TYPES[id] !== 'select' && newParams[id]?.length < 3)) delete newParams[id];
      else if (COLUMNS_TYPES[id] === 'date') {
        newParams[id] = moment(newParams[id]).endOf('day').utc().format();
        if (newParams[id] === 'Invalid date') delete newParams[id];
      }
    }
    dispatch(setParams(newParams));
    searchLog();
  };

  const onPaginate = (p) => {
    handleUpdateParams({ ...params, ...p });
    onPaginateLog();
  };

  const onSearch = (id, value, type) => {
    if (id === 'ap_group') {
      setUnmountForm((prev) => prev + 1);
      setSearch({ ...search, [id]: value, block_of_checks: undefined, checks: undefined });
    } else setSearch({ ...search, [id]: value });
    clearTimeout(timeout.current);
    if (
      !value ||
      value.length === 0 ||
      (type === 'text' && value.length >= 3) ||
      type === 'select' ||
      moment(value, moment.ISO_8601).isValid()
    ) {
      timeout.current = setTimeout(() => {
        handleUpdateParams({ ...params, ...search, [id]: value, page: 1 });
      }, 500);
    }
  };

  const getSearch = (id, type, minWidth) => {
    switch (type) {
      case 'select':
        return (
          <TableSelect
            value={search[id]}
            data={LISTS_DATA[id]}
            id={id}
            onChange={(id, value) => onSearch(id, value, type)}
            minWidth={minWidth}
          />
        );
      case 'date':
        return (
          <TableDatePicker
            id={id}
            value={search[id]}
            onChange={(value) => onSearch(id, value, type)}
            minWidth={minWidth}
          />
        );
      default:
        return <input value={search[id] || ''} onChange={({ target }) => onSearch(id, target.value, 'text')} />;
    }
  };

  const handleFilter = (filters) => {
    let checks = null;
    if (!filters?.checks?.length && filters?.block_of_checks?.length) {
      checks = getChecksValues(settings?.settings?.checks, filters?.block_of_checks, params?.ap_group)?.map(
        (v) => v.value
      );
    }
    if (filters?.checks?.length) {
      checks = filters.checks.map((i) => i.value);
    }
    handleUpdateParams({ ...params, checks });
  };

  const handleClearFilter = () => {
    handleUpdateParams({ ...params, block_of_checks: undefined, checks: undefined });
  };

  return (
    <>
      <StyledTable spacing={0}>
        <StickyTableHead>
          <TableRow>
            <Filter
              name={FORM_NAME}
              onChange={handleFilter}
              unmount={unmountForm}
              autoApply={false}
              onClear={handleClearFilter}
            >
              {innerColumns.toReversed().map(({ id, label }) => (
                <Grid item xs={12} key={id}>
                  <FormMultiSelect
                    name={id}
                    label={t(label)}
                    value={formData?.[id]}
                    list={id === 'checks' ? checksList : LISTS_DATA[id]}
                    disabled={Boolean(id === 'checks' && !checksList.length) || !params?.ap_group}
                    ignoreI18
                  />
                </Grid>
              ))}
            </Filter>
            {columns.map(({ id, type, label, minWidth }) => (
              <TableHeadCell key={id} style={{ minWidth }} title={t(label)}>
                {getSearch(id, type, minWidth)}
              </TableHeadCell>
            ))}
            <TableHeadCell title={t('FIELDS.LINK')} align={'center'} />
          </TableRow>
        </StickyTableHead>
        <TableBody>
          {!currentData?.data?.length ? (
            <NotResultRow span={columns.length + 2} text={t('NO_RECORDS_FOUND')} />
          ) : (
            <>
              <TableRow>
                <TableCell sx={{ p: 0.5, border: 'none' }} />
              </TableRow>
              {currentData?.data?.map((point) => (
                <Row key={`row-${point.uid}`} data={point} columns={columns} innerColumns={innerColumns} />
              ))}
            </>
          )}
        </TableBody>
      </StyledTable>
      <Pagination {...currentData} params={params} onPaginate={onPaginate} loading={isFetching} />
    </>
  );
};

export default Table;
