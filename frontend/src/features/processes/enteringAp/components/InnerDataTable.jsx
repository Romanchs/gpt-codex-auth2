import Box from '@mui/material/Box';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableHead from '@mui/material/TableHead';
import { useRef, useState } from 'react';
import moment from 'moment';
import DatePicker from '../../../../Components/Theme/Fields/DatePicker';
import RadioButton from '../../../../Components/Theme/Fields/RadioButton';
import NotResultRow from '../../../../Components/Theme/Table/NotResultRow';
import { Pagination } from '../../../../Components/Theme/Table/Pagination';
import { StyledTable } from '../../../../Components/Theme/Table/StyledTable';
import i18n from "../../../../i18n/i18n";
import { useTranslation } from 'react-i18next';

const DEFAULT_SEARCH_START = 0;

// options for columns item -> readOnly, searchStart, dateFormat
// only columns + currentData + loading -> default type
// params + setParams -> search type
// selected + setSelected -> choose type

const InnerDataTable = ({
  columns,
  currentData,
  loading,
  params,
  setParams,
  selected,
  setSelected,
  emptyResult =  i18n.t('NO_POINTS_FOUND'),
  BodyRow = null,
  isPagination = true
}) => {
  const [search, setSearch] = useState({});
  const timeout = useRef(null);
  const {t} = useTranslation();

  const onSearch = (id, value) => {
    setSearch({ ...search, [id]: value });
    clearTimeout(timeout.current);

    if (!value || value?.trim()?.length >= (columns.find((i) => i.id === id)?.searchStart || DEFAULT_SEARCH_START)) {
      timeout.current = setTimeout(() => {
        const newParams = { ...params, page: 1 };
        if (value) newParams[id] = value;
        else delete newParams[id];
        setParams(newParams);
      }, 500);
    }
  };

  const onSelect = (uid) => {
    let items = [];
    if (selected.find((t) => t === uid)) {
      items = selected.filter((i) => i !== uid);
    } else {
      items = [...selected, uid];
    }
    setSelected(items);
  };

  const getHeader = ({ readOnly, renderHead, ...item }) => {
    if (renderHead) return renderHead(item);
    if (!item.dateFormat && (setParams || params)) {
      return (
        <>
          <Box component="p">{item.label}</Box>
          <input
            type="text"
            value={(readOnly ? params[item.id] : search[item.id]) || ''}
            onChange={({ target: { value } }) => onSearch(item.id, value)}
            readOnly={readOnly}
          />
        </>
      );
    }
    if (item.dateFormat) {
      return (
        <Box
          className={'date-wrapper'}
          sx={{
            marginTop: '5px',
            borderRadius: '1px',
        
            '& .MuiFormControl-root .MuiInputBase-root': {
              padding: '3px 0px 3px 4px',
              borderRadius: '4px',
              backgroundColor: '#FFFFFF',
        
              '&>input': {
                fontSize: '12px',
                padding: '5px'
              },
        
              '&.Mui-focused': {
                borderColor: 'transparent'
              },
        
              '& input': {
                marginTop: 0,
                border: 'none'
              }
            }
          }}
        >
          <Box component="p">{item.label}</Box>
          <DatePicker
            label={''}
            value={search?.[item.id]}
            onChange={(v) =>
              onSearch(item.id, moment(v, moment.ISO_8601).isValid() ? moment(v).format(item.dateFormat) : null)
            }
            data-marker={'date-search'}
            readOnly={readOnly}
          />
        </Box>
      );
    }
    if (!params) {
      return <Box component="p">{item.label || ''}</Box>;
    }
  };

  return (
    <>
      <StyledTable>
        <TableHead>
          <TableRow>
            {columns.map(({ width, minWidth, align, ...rest }, i) => (
              <TableCell
                key={rest.id + i}
                style={width ? (minWidth ? { width, minWidth } : { width }) : { minWidth }}
                align={align || 'left'}
              >
                {getHeader(rest)}
              </TableCell>
            ))}
            {selected && (
              <TableCell style={{ width: 70 }}>
                <Box component="p">{t('SELECTED')}</Box>
                <input type="text" value={selected?.length || 0} style={{ textAlign: 'center' }} readOnly />
              </TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {currentData?.data.length < 1 ? (
            <NotResultRow span={columns.length + Number(Boolean(selected))} text={emptyResult} />
          ) : (
            currentData?.data.map((row, index) =>
              BodyRow ? (
                BodyRow(row, index)
              ) : (
                <TableRow key={row?.uid} data-marker="table-row" className="body__table-row" tabIndex={-1}>
                  {columns.map(({ id, marker, align, renderBody }, i) => (
                    <TableCell key={id + i} data-marker={marker || id} align={align || 'left'}>
                      {renderBody ? renderBody(row[id], row) : row[id]}
                    </TableCell>
                  ))}
                  {selected && (
                    <TableCell data-marker={'radio-button-container'} align={'center'}>
                      <RadioButton
                        data-marker={'radio-button'}
                        checked={Boolean(selected.find((t) => t === row?.uid))}
                        onClick={() => onSelect(row?.uid)}
                      />
                    </TableCell>
                  )}
                </TableRow>
              )
            )
          )}
        </TableBody>
      </StyledTable>
      {isPagination && (
        <Pagination
          {...currentData}
          loading={loading}
          params={params || { page: 1, size: 25 }}
          onPaginate={(v) => setParams({ ...params, ...v })}
        />
      )}
    </>
  );
};

export default InnerDataTable;
