import Grid from '@mui/material/Grid';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import { useMemo, useState } from 'react';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import NotResultRow from '../../../Components/Theme/Table/NotResultRow';
import { StyledTable } from '../../../Components/Theme/Table/StyledTable';
import TableHeadCell from '../../../Components/Tables/TableHeadCell';
import TableSelect from '../../../Components/Tables/TableSelect';
import TableDatePicker from '../../../Components/Tables/TableDatePicker';
import { Pagination } from '../../../Components/Theme/Table/Pagination';
import Filter from '../../../Components/Theme/Table/Filter';
import FormInput from '../../../Forms/fields/FormInput';
import FormDatePicker from '../../../Forms/fields/FormDatePicker';
import { usePmCorrectionTSQuery } from './api';
import Row from './Row';
import ArchivingAutocompleteFormField from '../Archiving/ArchivingAutocompleteFormField';
import StickyTableHead from '../../../Components/Theme/Table/StickyTableHead';
import { isIntegerOrNull } from '../../../util/helpers';
import SearchField from '../../../Components/Tables/SearchField';

const STATUSES = [
  { label: 'STATUSES.NEW', value: 'NEW' },
  { label: 'STATUSES.IN_PROCESS', value: 'IN_PROCESS' },
  { label: 'STATUSES.DONE', value: 'DONE' },
  { label: 'STATUSES.REJECTED', value: 'REJECTED' },
  { label: 'STATUSES.CANCELED', value: 'CANCELED' }
];

const LISTS_DATA = {
  status: STATUSES,
  ap_type: [
    { label: 'Z', value: 'Z' },
    { label: 'ZV', value: 'ZV' }
  ]
};

const defaultParams = { page: 1, size: 25 };

const columns = [
  { id: 'process_id', label: 'TECH_WORKS.TABLE.ID', width: 70 },
  { id: 'initiator_company', label: 'ODKO_SHORT_NAME', minWidth: 200, type: 'company' },
  { id: 'ap_type', label: 'FIELDS.TKO_TYPE', minWidth: 120, type: 'select' },
  { id: 'aps_count', label: 'FIELDS.AP_COUNT', minWidth: 120, type: 'title' },
  { id: 'status', label: 'FIELDS.REQUEST_STATUS', minWidth: 120, type: 'select' },
  { id: 'executor', label: 'FIELDS.USER_EXECUTOR', minWidth: 120, type: 'full_name' },
  { id: 'created_at', label: 'FIELDS.CREATION_DATE', minWidth: 120, type: 'date' }
];

const innerColumns = [
  { id: 'initiator', label: 'FIELDS.USER_INITIATOR', type: 'full_name' },
  { id: 'started_at', label: 'FIELDS.START_WORK_DATE', type: 'date' },
  { id: 'finished_at', label: 'FIELDS.DONE_DATETIME', type: 'date' }
];

const CorrectionTab = () => {
  const { t } = useTranslation();
  const FORM_NAME = 'correction-sub_filters';

  const [params, setParams] = useState(defaultParams);
  const [search, setSearch] = useState(params);

  const COLUMNS_TYPES = useMemo(
    () => Object.fromEntries([...columns, ...innerColumns].map((i) => [i.id, i.type || 'text'])),
    []
  );
  const { currentData, isFetching } = usePmCorrectionTSQuery(params);

  const handleUpdateParams = (newParams) => {
    for (const id in newParams) {
      if (!newParams[id]) delete newParams[id];
      else if (COLUMNS_TYPES[id] === 'date') {
        if (newParams[id] === 'Invalid date') delete newParams[id];
        else newParams[id] = moment(newParams[id]).endOf('day').utc().format();
      }
    }
    setParams(newParams);
  };

  const onSearch = (id, value, type) => {
    if (id === 'process_id' && !isIntegerOrNull(value)) {
      return
    }
    setSearch({ ...search, [id]: value });
    if (
      !value ||
      value.length === 0 ||
      type === 'full_name' ||
      type === 'company' ||
      type === 'select' ||
      (type === 'text' && value.length >= 1) ||
      moment(value, moment.ISO_8601).isValid()
    ) {
      handleUpdateParams({ ...params, ...search, [id]: value });
    }
  };

  const getSearch = (id, type, minWidth) => {
    switch (type) {
      case 'select':
        return (
          <TableSelect
            value={search[id]}
            data={id === 'status' ? LISTS_DATA[id].map((i) => ({ ...i, label: t(i.label) })) : LISTS_DATA[id]}
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
      case 'title':
        return null;
      default:
        return <SearchField name={id} onSearch={(i) => onSearch(id, i[id], 'text')} minSymbols={id === 'process_id' ? 1 : 3}/>;
    }
  };

  const handleFilter = (filters) => {
    const newFilters = Object.fromEntries(
      innerColumns.map((i) => (i.type === 'full_name' ? [i.id, filters?.[i.id]?.uid] : [i.id, filters?.[i.id]]))
    );
    handleUpdateParams({ ...params, page: 1, ...newFilters });
  };

  const getFilterSearch = (id, label, type) => {
    if (type === 'date') return <FormDatePicker label={t(label)} name={id} outFormat={'YYYY-MM-DD'} />;
    if (type === 'full_name') {
      return <ArchivingAutocompleteFormField label={t(label)} name={id} form_name={FORM_NAME} dataMarker={id} />;
    }
    return <FormInput label={t(label)} name={id} />;
  };

  return (
    <>
      <StyledTable spacing={0}>
        <StickyTableHead>
          <TableRow>
            {columns.map(({ id, label, type, minWidth, width }) => (
              <TableHeadCell sx={{ minWidth, width }} key={id} title={t(label)}>
                {getSearch(id, type, minWidth)}
              </TableHeadCell>
            ))}
            <Filter name={FORM_NAME} onChange={handleFilter} unmount={true} autoApply={false}>
              {innerColumns.map(({ id, label, type }) => (
                <Grid item xs={12} md={12} key={id}>
                  {getFilterSearch(id, label, type)}
                </Grid>
              ))}
            </Filter>
          </TableRow>
          <TableRow sx={{ height: 8 }} />
        </StickyTableHead>
        <TableBody>
          {currentData?.data?.length > 0 ? (
            currentData?.data?.map((row) => (
              <Row key={row?.process_id} data={row} columns={columns} innerColumns={innerColumns} />
            ))
          ) : (
            <NotResultRow span={columns.length + 1} text={t('NO_RECORDS_FOUND')} />
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

export default CorrectionTab;
