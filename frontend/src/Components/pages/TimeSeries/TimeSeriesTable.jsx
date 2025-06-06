import {useState} from 'react';
import {connect} from 'react-redux';
import {StyledTable} from '../../Theme/Table/StyledTable';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell/TableCell';
import SearchDate from '../../Tables/SearchDate';
import {getTSFileById, setTSListParams} from '../../../actions/timeSeriesActions';
import TableBody from '@material-ui/core/TableBody';
import GetAppRounded from '@mui/icons-material/GetAppRounded';
import IconButton from '@material-ui/core/IconButton';
import NotResultRow from '../../Theme/Table/NotResultRow';
import {useTranslation} from "react-i18next";
import useSearchLog from '../../../services/actionsLog/useSearchLog';

const columns = [
  {id: 'created_by', label: 'FIELDS.USER_FULL_NAME', minWidth: 250, align: 'left', search: true},
  {id: 'timestamp', label: 'FIELDS.DOWNLOAD_DATE', minWidth: 150, align: 'left', search: true},
  {id: 'file_name', label: 'FIELDS.FILENAME', minWidth: 220, align: 'left', search: true},
  {id: 'loaded', label: 'FIELDS.FILE_DOWNLOADED', minWidth: 150, align: 'center'},
  {id: 'load', label: 'FIELDS.FILE_RETURN_CODES', minWidth: 170, align: 'center'}
];

const TimeSeriesTable = ({dispatch, params, list}) => {
  const {t} = useTranslation();
  const [valueDate, setValueDate] = useState(null);
  const [timeOut, setTimeOut] = useState(null);
  const [search, setSearch] = useState(params);
  const searchLog = useSearchLog();

  const onSearch = (key, value) => {
    setSearch({...search, [key]: value});
    clearTimeout(timeOut);
    setTimeOut(
      setTimeout(() => {
        dispatch(setTSListParams({[key]: value, page: 1}));
        searchLog();
      }, 1000)
    );
  };

  return (
    <StyledTable>
      <TableHead>
        <TableRow>
          {columns.map((column) => (
            <TableCell
              key={column.id}
              align={column.align}
              style={{minWidth: column.minWidth}}
              className="body__table-header"
            >
              <p>{t(column.label)}</p>
              {column.id === 'timestamp' ? (
                <SearchDate
                  valueDate={valueDate}
                  setValueDate={setValueDate}
                  onSearch={onSearch}
                  column={column}
                  formatDate={'DD.MM.YYYY'}
                />
              ) : (
                column.search && (
                  <input
                    type="text"
                    value={search[column.id]}
                    onChange={({target: {value}}) => onSearch(column.id, value)}
                  />
                )
              )}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {list?.length > 0 ? (
          list?.map((row, rowIndex) => (
            <Row
              key={rowIndex}
              row={row}
              handleDownloadFile={() => dispatch(getTSFileById(row.file_id, row.file_name))}
            />
          ))
        ) : (
          <NotResultRow span={8} text={t('NO_DKO_FOUND')}/>
        )}
      </TableBody>
    </StyledTable>
  );
};

const Row = ({row, handleDownloadFile}) => {
  const {t} = useTranslation();

  return (
  <>
    <TableRow hover tabIndex={-1} key={row.id} data-marker="table-row" className="body__table-row">
      {columns.map((column) => {
        const value = row[column.id];
        if (column.id === 'load') {
          return (
            <TableCell key={column.id} align={column.align}>
              {
                <IconButton size={'small'} onClick={handleDownloadFile} disabled={!row.file_id}>
                  <GetAppRounded style={{color: row.file_id ? '#567691' : '#a6c6e1'}}/>
                </IconButton>
              }
            </TableCell>
          );
        }
        if (column.id === 'loaded') {
          return (
            <TableCell key={column.id} align={column.align} data-marker={row?.failed > 0 ? 'no' : 'yes'}>
              <span className={row?.failed > 0 ? 'danger' : 'success'} style={{fontSize: 12}}>
                {row?.failed > 0 ? t('CONTROLS.NO') : t('CONTROLS.YES')}
              </span>
            </TableCell>
          );
        }
        return (
          <TableCell key={column.id} align={column.align} data-marker={column.id}>
            {value}
          </TableCell>
        );
      })}
    </TableRow>
  </>
  )
};

const mapStateToProps = ({timeSeries}) => {
  return {
    params: timeSeries.params,
    list: timeSeries.list?.data
  };
};

export default connect(mapStateToProps)(TimeSeriesTable);
