import { TableBody, TableRow, TableCell } from '@mui/material';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import { setParams } from '../../slice';
import NotResultRow from '../../../../Components/Theme/Table/NotResultRow';
import { StyledTable } from '../../../../Components/Theme/Table/StyledTable';
import TableSelect from '../../../../Components/Tables/TableSelect';
import TableHeadCell from '../../../../Components/Tables/TableHeadCell';
import { Pagination } from '../../../../Components/Theme/Table/Pagination';
import { mainApi } from '../../../../app/mainApi';
import { updateForm } from '../../../../Forms/formActions';
import { useListMDCHECKDKOZVQuery } from '../api';
import TableDatePicker from '../../../../Components/Tables/TableDatePicker';
import Row from './Row';
import useViewCallbackLog from '../../../../services/actionsLog/useViewCallbackLog';
import useSearchLog from '../../../../services/actionsLog/useSearchLog';
import { MONITORING_DKO_LOG_TAGS } from '../../../../services/actionsLog/constants';
import StickyTableHead from '../../../../Components/Theme/Table/StickyTableHead';

const defaultLists = { source: [], checks: [] };

const columns = [
  {
    id: 'created_at',
    label: 'FIELDS.FORMED',
    minWidth: 150,
    type: 'date'
  },
  { id: 'file_name', label: 'CHECK_DKO_ZV.FIELDS.RESULT_FILE_NAME', minWidth: 200 },
  { id: 'source', label: 'CHECK_DKO_ZV.FIELDS.SOURCE', minWidth: 120, type: 'select' },
  { id: 'version', label: 'CHECK_DKO_ZV.FIELDS.VERSION', minWidth: 80, sx: { width: 100 } },
  { id: 'metering_grid_areas', label: 'FIELDS.EIC_Y_CODE_Y_REGION', minWidth: 220 },
  { id: 'checks', label: 'CHECK_DKO_ZV.FIELDS.CHECKS', minWidth: 150, type: 'select' },
  { id: 'created_by', label: 'FIELDS.AUTOR', minWidth: 120 }
];

const Table = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useSelector((store) => store.monitoringDko.params);
  const [search, setSearch] = useState({});
  const timeout = useRef(null);
  const COLUMNS_TYPES = useMemo(() => Object.fromEntries([...columns].map((i) => [i.id, i.type || 'text'])), []);

  const FORM_NAME = 'monitorinkDko_checkDkoZV-filter-form';
  const formActiveField = useSelector((store) => store.forms.activeField);
  const formData = useSelector((store) => store.forms[FORM_NAME]);

  const onPaginateLog = useViewCallbackLog();
  const searchLog = useSearchLog(MONITORING_DKO_LOG_TAGS);

  const { currentData: settings } = mainApi.endpoints.settingsMDCHECKDKOZV.useQueryState();

  const LISTS_DATA = useMemo(() => {
    if (!settings?.fields) return defaultLists;
    return {
      source: settings.fields.find((i) => i.key === 'source')?.values,
      version: settings.fields.find((i) => i.key === 'version')?.values,
      checks: settings.fields.find((i) => i.key === 'checks')?.values
    };
  }, [settings, params]);

  const { currentData, isFetching, error } = useListMDCHECKDKOZVQuery(params);

  useEffect(() => {
    if (error?.status === 403) navigate('/');
  }, [error]);

  useEffect(() => {
    if (!formData || formActiveField !== 'checks') return;
    dispatch(updateForm(FORM_NAME, 'checks', null));
  }, [dispatch, LISTS_DATA, formData, formActiveField, params]);

  const handleUpdateParams = (newParams) => {
    for (const id in newParams) {
      if (id === 'version') {
        if (newParams[id] === undefined || newParams[id] === '') {
          delete newParams[id];
        }
      } else if (!newParams[id] || (COLUMNS_TYPES[id] !== 'select' && newParams[id]?.length < 3)) {
        delete newParams[id];
      } else if (COLUMNS_TYPES[id] === 'date') {
        newParams[id] = moment(newParams[id]).endOf('day').utc().format();
        if (newParams[id] === 'Invalid date') {
          delete newParams[id];
        }
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
    setSearch({ ...search, [id]: value });
    clearTimeout(timeout.current);
    if (id === 'version') {
      timeout.current = setTimeout(() => {
        handleUpdateParams({ ...params, ...search, [id]: value === '*' ? null : value, page: 1 });
        searchLog();
      }, 500);
    } else if (
      (id !== 'version' && !value) ||
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
            data={LISTS_DATA[id] || []}
            id={id}
            onChange={(id, value) => onSearch(id, value, type)}
            minWidth={minWidth}
            dataMarker={'table-' + id}
          />
        );
      case 'date':
        return (
          <TableDatePicker
            id={id}
            value={search[id]}
            onChange={(value) => onSearch(id, value, type)}
            minWidth={minWidth}
            dataMarker={'table-' + id}
          />
        );
      default:
        return (
          <input
            value={search[id] || ''}
            onChange={({ target }) => onSearch(id, target.value, 'text')}
            data-marker={'table-' + id}
          />
        );
    }
  };

  return (
    <>
      <StyledTable spacing={0}>
        <StickyTableHead>
          <TableRow>
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
                <>
                  <Row key={`row-${point.uid}`} data={point} columns={columns} />
                  <TableRow>
                    <TableCell sx={{ p: 0.5, border: 'none' }} />
                  </TableRow>
                </>
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
