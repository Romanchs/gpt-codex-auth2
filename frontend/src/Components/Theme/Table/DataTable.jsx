import { TableCell, TableRow } from '@material-ui/core';
import TableBody from '@material-ui/core/TableBody';
import { useEffect, useRef, useState } from 'react';

import RadioButton from '../Fields/RadioButton';
import NotResultRow from './NotResultRow';
import { Pagination } from './Pagination';
import { StyledTable } from './StyledTable';
import i18n from '../../../i18n/i18n';
import StickyTableHead from './StickyTableHead';

const TableData = ({ label, render }) => {
  return render ? render(label || '') : <p>{label || ''}</p>;
};
const TableSearchData = ({ id, label, params, searchReadOnly, search, onSearch }) => {
  const findResult = Object.keys(searchReadOnly).find((i) => i === id);
  return (
    <>
      <p>{label}</p>
      <input
        type="text"
        value={findResult ? params[id] : search[id] || ''}
        onChange={({ target: { value } }) => onSearch(id, value)}
        readOnly={findResult}
      />
    </>
  );
};

const DataTable = ({
  loading,
  uploadData,
  columns,
  // optional params
  type = 'text',
  initialData = null,
  emptyResult = i18n.t('NO_POINTS_FOUND'),
  BodyRow = null,
  isPagination = true,
  // params for search
  searchReadOnly = {},
  searchCondition = null,
  // param for selected
  onSelect = null,
  // data for update inner state
  externalData = null
}) => {
  const innerColumns = [...columns];
  const [currentProcess, setCurrentProcess] = useState(null);
  const [params, setParams] = useState({ page: 1, size: 25, ...searchReadOnly });

  const [search, setSearch] = useState({});
  const timeout = useRef(null);

  const onSearch = (id, value) => {
    setSearch({ ...search, [id]: value });
    clearTimeout(timeout.current);
    if (!searchCondition || searchCondition(id, value, params)) {
      timeout.current = setTimeout(() => {
        setParams({ ...params, page: 1, [id]: value });
      }, 500);
    }
  };

  const [selectedItems, setSelectedItems] = useState([]);
  if (onSelect) {
    const handleRadioClick = (uid) => {
      let items = [];
      if (selectedItems.find((t) => t === uid)) {
        items = selectedItems.filter((i) => i !== uid);
      } else {
        items = [...selectedItems, uid];
      }
      setSelectedItems(items);
      onSelect(items);
    };
    innerColumns.push({
      marker: 'radio-button-container',
      label: i18n.t('SELECTED'),
      id: 'uid',
      width: 70,
      alignHead: 'left',
      alignBody: 'center',
      renderHead: (text) => (
        <>
          <p>{text}</p>
          <input type="text" value={selectedItems?.length} style={{ textAlign: 'center' }} readOnly />
        </>
      ),
      renderBody: (uid) => (
        <RadioButton
          data-marker={'radio-button'}
          checked={Boolean(selectedItems.find((t) => t === uid))}
          onClick={() => handleRadioClick(uid)}
        />
      )
    });
  }

  useEffect(() => {
    if (initialData && !currentProcess) {
      setCurrentProcess(initialData);
      return;
    }
    uploadData(params, setCurrentProcess);
  }, [params]);

  useEffect(() => {
    if (!externalData) return;
    setCurrentProcess(externalData);
  }, [externalData]);

  return (
    <>
      <StyledTable>
        <StickyTableHead>
          <TableRow>
            {innerColumns.map(({ id, label, width, minWidth, align, alignHead, renderHead }, i) => (
              <TableCell
                key={id + i}
                className={'MuiTableCell-head'}
                style={width ? (minWidth ? { width, minWidth } : { width }) : { minWidth }}
                align={alignHead || align || 'left'}
              >
                {type === 'text' || renderHead ? (
                  <TableData label={label} render={renderHead} />
                ) : (
                  <TableSearchData
                    id={id}
                    label={label}
                    params={params}
                    search={search}
                    onSearch={onSearch}
                    searchReadOnly={searchReadOnly}
                  />
                )}
              </TableCell>
            ))}
          </TableRow>
        </StickyTableHead>
        <TableBody>
          {currentProcess?.data.length < 1 ? (
            <NotResultRow span={5} text={emptyResult} />
          ) : (
            currentProcess?.data.map((row, index) =>
              BodyRow ? (
                BodyRow(row, index)
              ) : (
                <TableRow key={row?.uid} data-marker="table-row" className="body__table-row" tabIndex={-1}>
                  {innerColumns.map(({ id, marker, align, alignBody, renderBody }, i) => (
                    <TableCell key={id + i} data-marker={marker || id} align={alignBody || align || 'left'}>
                      {renderBody ? renderBody(row[id], row) : row[id]}
                    </TableCell>
                  ))}
                </TableRow>
              )
            )
          )}
        </TableBody>
      </StyledTable>
      {isPagination && (
        <Pagination
          {...currentProcess}
          loading={loading}
          params={params}
          onPaginate={(v) => setParams({ ...params, ...v })}
        />
      )}
    </>
  );
};

export default DataTable;
