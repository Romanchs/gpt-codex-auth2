import makeStyles from '@material-ui/core/styles/makeStyles';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell/TableCell';
import TableRow from '@material-ui/core/TableRow';
import { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import moment from 'moment';

import Page from '../../../Components/Global/Page';
import CircleButton from '../../../Components/Theme/Buttons/CircleButton';
import DatePicker from '../../../Components/Theme/Fields/DatePicker';
import { Pagination } from '../../../Components/Theme/Table/Pagination';
import { StyledTable } from '../../../Components/Theme/Table/StyledTable';
import NotResultRow from '../../../Components/Theme/Table/NotResultRow';
import { useGetPPKOHistoryQuery, useLazyDownloadPPKOHistoryQuery } from './api';
import Row from './Row';
import SearchField from './SearchField';
import { enqueueSnackbar } from '../../../actions/notistackActions';
import i18n from '../../../i18n/i18n';
import { useTranslation } from 'react-i18next';
import StickyTableHead from '../../../Components/Theme/Table/StickyTableHead';

const defaultParams = { page: 1, size: 25 };

const columns = [
  {
    id: 'modified_at',
    title: i18n.t('FIELDS.CHANGE_DATE_TIME'),
    filter: 'modified_at_after',
    minWidth: 100
  },
  {
    id: 'eic',
    title: i18n.t('FIELDS.EIC_CODE_TYPE_X_PPKO'),
    filter: 'eic',
    minWidth: 100
  },
  {
    id: 'user_full_name',
    title: i18n.t('FIELDS.EDITOR'),
    filter: 'modified_by',
    minWidth: 230
  },
  {
    id: 'ppko_full_name',
    title: i18n.t('FIELDS.FULL_NAME'),
    filter: 'full_name',
    minWidth: 400
  }
];

const PpkoHistory = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const classes = useStyles();
  const { id } = useParams();
  const [params, setParams] = useState(id ? { ...defaultParams, ppko_id: id } : defaultParams);
  const timeout = useRef(null);
  const [search, setSearch] = useState(params);
  const { data, isFetching } = useGetPPKOHistoryQuery(params);
  const [downloadFile] = useLazyDownloadPPKOHistoryQuery();

  const onSearch = (id, value) => {
    if (!value) value = '';
    if (id === 'modified_at_after') {
      if (value === '' || value?.format() === 'Invalid date') value = '';
      else value = moment(value).startOf('day').utc().format();
    }
    setSearch({ ...search, [id]: value });
    clearTimeout(timeout.current);
    if (value.length === 0 || value.length >= 3) {
      timeout.current = setTimeout(() => {
        const newParams = { ...params, ...search, [id]: value, page: 1 };
        for (const id in newParams) {
          if (!newParams[id]) {
            delete newParams[id];
            if (id === 'modified_at_after') delete newParams.modified_at_before;
          } else if (id === 'modified_at_after') {
            newParams.modified_at_before = moment(newParams[id]).add(1, 'days').startOf('day').utc().format();
          }
        }
        setSearch(newParams);
        setParams(newParams);
      }, 500);
    }
  };

  const getField = (id, filter) => {
    if (id === 'modified_at')
      return (
        <DatePicker
          label={''}
          value={search[filter] || ''}
          onChange={(date) => onSearch(filter, date)}
          minDate={moment('1925-01-01')}
          maxDate={moment('2200-01-01')}
        />
      );
    if (id === 'user_full_name') return <SearchField params={params} setParams={setParams} />;
    return (
      <input type={'text'} value={search[filter] || ''} onChange={({ target }) => onSearch(filter, target.value)} />
    );
  };

  const handleDownloadFile = () => {
    dispatch(
      enqueueSnackbar({
        message: t('NOTIFICATIONS.FILE_GENERATION_STARTED'),
        options: {
          key: new Date().getTime() + Math.random(),
          variant: 'success',
          autoHideDuration: 5000
        }
      })
    );
    downloadFile({ params, name: t('FILENAMES.JOURNAL_OF_CHANGES_TO_PPKO_REGISTER_xlsx') });
  };

  return (
    <Page
      acceptPermisions={id ? 'PPKO.DETAIL.CONTROLS.HISTORY' : 'PPKO.HISTORY.ACCESS'}
      acceptRoles={['АКО_ППКО']}
      pageName={t('PAGES.HISTORY')}
      loading={isFetching}
      backRoute={'/ppko'}
      controls={<CircleButton type={'download'} title={t('CONTROLS.EXPORTATION')} onClick={handleDownloadFile} />}
    >
      <StyledTable spacing={0}>
        <StickyTableHead>
          <TableRow>
            {columns.map(({ id, filter, title, minWidth }) => (
              <TableCell
                style={{ minWidth }}
                className={'MuiTableCell-head' + (id === 'modified_at' ? ' ' + classes.datePicker : '')}
                key={filter}
              >
                <p>{title}</p>
                {getField(id, filter)}
              </TableCell>
            ))}
            <TableCell className={'MuiTableCell-head'}> </TableCell>
          </TableRow>
        </StickyTableHead>
        <TableBody>
          {data?.data?.length > 0 ? (
            data?.data?.filter(Boolean)?.map((rowData, index) => (
              <Row
                key={`row-${rowData?.id || index}`}
                data={rowData}
                columns={columns}
                innerColumns={[
                  { id: 'unit_name', title: t('EDITED_BLOCK') },
                  { id: 'field_name', title: t('EDITED_ATTRIBUTE') },
                  { id: 'changes.old_value', title: t('BEFORE_CHANGES') },
                  { id: 'changes.new_value', title: t('AFTER_CHANGES') }
                ]}
              />
            ))
          ) : (
            <NotResultRow span={5} text={t('HISTORY_NOT_FOUND')} loading={isFetching} />
          )}
        </TableBody>
      </StyledTable>
      <Pagination {...data} loading={isFetching} params={params} onPaginate={(v) => setParams({ ...params, ...v })} />
    </Page>
  );
};

export default PpkoHistory;

const useStyles = makeStyles(() => ({
  datePicker: {
    '&>p': {
      marginBottom: 5
    },
    '& .MuiInputBase-root.MuiOutlinedInput-root.MuiInputBase-formControl.MuiInputBase-adornedEnd.MuiOutlinedInput-adornedEnd':
      {
        borderRadius: 4,
        backgroundColor: '#fff',
        '&>input': {
          marginTop: 0,
          height: 20,
          border: 'none'
        }
      }
  }
}));
