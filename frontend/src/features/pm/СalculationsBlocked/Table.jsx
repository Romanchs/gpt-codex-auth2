import moment from 'moment';
import { useRef, useState } from 'react';
import { TableCell, TableRow } from '@material-ui/core';
import TableBody from '@material-ui/core/TableBody';

import CircleButton from '../../../Components/Theme/Buttons/CircleButton';
import NotResultRow from '../../../Components/Theme/Table/NotResultRow';
import { StyledTable } from '../../../Components/Theme/Table/StyledTable';
import TableSelect from '../../../Components/Tables/TableSelect';
import DatePicker from '../../../Components/Theme/Fields/DatePicker';
import { Pagination } from '../../../Components/Theme/Table/Pagination';
import CancelModal from '../../../Components/Modal/CancelModal';
import { useRegTabStyles } from '../filterStyles';
import { useGetListPMBlockedQuery } from './api';
import { useTranslation } from 'react-i18next';
import { MAX_VERSION, MIN_VERSION } from './СalculationsBlockedTab';
import StickyTableHead from '../../../Components/Theme/Table/StickyTableHead';

const columns = [
  { id: 'version', label: 'FIELDS.CERTIFICATION_NUMBER', minWidth: 100 },
  { id: 'month', label: 'FIELDS.MONTH', minWidth: 100 },
  { id: 'year', label: 'FIELDS.YEAR', minWidth: 100 },
  { id: 'decade', label: 'FIELDS.DECADE_NUMBER', minWidth: 100 },
  {
    id: 'created_at',
    label: 'FIELDS.DATE_TIME',
    minWidth: 100,
    render: (date) => date && moment(date).format('DD.MM.yyyy • HH:mm')
  },
  { id: 'full_name', label: 'FIELDS.FULL_NAME_SHORT', minWidth: 150 }
];

const Table = ({ params, setParams, update, options }) => {
  const { t } = useTranslation();
  const classes = useRegTabStyles();
  const timeout = useRef(null);
  const [search, setSearch] = useState(params);
  const [approveModal, setApproveModal] = useState({ isOpen: false, handler: null });
  const { data: records, isFetching } = useGetListPMBlockedQuery(params);

  const onSearch = (id, value) => {
    if (id === 'created_at' && value === 'Invalid date') value = null;
    const newParams = { ...search, [id]: value };
    if (!value) delete newParams[id];
    if (id === 'year' && value === 2019 && search.month < 7) delete newParams.month;

    setSearch(newParams);
    clearTimeout(timeout.current);
    if (id !== 'full_name' || (id === 'full_name' && (!value || value.length === 0 || value.length > 3))) {
      timeout.current = setTimeout(() => {
        setParams({ ...newParams, page: 1 });
      }, 500);
    }
  };

  const onChangeVersion = ({ target }) => {
    const version = target.value;
    if (version && version < MIN_VERSION) {
      onSearch('version', MIN_VERSION);
      return;
    }
    if (version > MAX_VERSION) {
      onSearch('version', MAX_VERSION);
      return;
    }
    onSearch('version', version);
  };

  const getSearch = (id) => {
    switch (id) {
      case 'month':
      case 'year':
      case 'decade':
        return (
          <TableSelect
            value={search[id]}
            data={id === 'month' && search.year === 2019 ? options[id].filter(({ value }) => value >= 7) : options[id]}
            id={id}
            onChange={onSearch}
            minWidth={80}
          />
        );
      case 'created_at':
        return (
          <div className={classes.picker}>
            <DatePicker
              label={''}
              value={search[id] || null}
              id={id}
              onChange={(value) => onSearch(id, moment(value).utc().format())}
              minWidth={80}
              outFormat={'YYYY-MM-DD'}
            />
          </div>
        );
      case 'version':
        return (
          <input
            value={search[id] || ''}
            type="number"
            min={MIN_VERSION}
            max={MAX_VERSION}
            onChange={onChangeVersion}
          />
        );
      default:
        return <input value={search[id] || ''} onChange={({ target }) => onSearch(id, target.value)} />;
    }
  };

  const handleDelete = ({ version, month, year, decade }, isRun) => {
    if (!isRun) {
      setApproveModal({
        isOpen: true,
        handler: handleDelete.bind(null, { version, month, year, decade })
      });
      return;
    }
    update({ method: 'DELETE', body: { version, month, year, decade } });
  };

  return (
    <>
      <StyledTable>
        <StickyTableHead>
          <TableRow>
            {columns.map(({ id, label, minWidth }) => (
              <TableCell key={id} style={{ minWidth }} className={'MuiTableCell-head'} data-marker={`search-${id}`}>
                <p>{t(label)}</p>
                {getSearch(id)}
              </TableCell>
            ))}
            <TableCell></TableCell>
          </TableRow>
        </StickyTableHead>
        <TableBody>
          {records?.data?.length < 1 ? (
            <NotResultRow span={8} text={t('NO_RECORDS_FOUND')} />
          ) : (
            <>
              {records?.data?.map((row, index) => (
                <TableRow key={index} tabIndex={-1} data-marker={'table-row'} className={'body__table-row'}>
                  {columns.map(({ id, render }) => (
                    <TableCell key={`${index}-${id}`} data-marker={id}>
                      {render ? render(row?.[id]) : row?.[id]}
                    </TableCell>
                  ))}
                  <TableCell data-marker={'delete'} className={classes.cellDelete} align={'center'}>
                    <CircleButton
                      title={t('CONTROLS.UNDO')}
                      type={'remove'}
                      size={'small'}
                      color={'red'}
                      onClick={() => handleDelete(row)}
                    />
                  </TableCell>
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
      <CancelModal
        text={t('ARE_YOU_SURE_YOU_WANT_TO_UNBLOCK_PAYMENTS')}
        open={approveModal.isOpen}
        submitType={'green'}
        onClose={() => setApproveModal({ isOpen: false })}
        onSubmit={() => {
          approveModal.handler(true);
          setApproveModal({ isOpen: false });
        }}
      />
    </>
  );
};

export default Table;
