import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse/Collapse';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import KeyboardArrowDownRounded from '@mui/icons-material/KeyboardArrowDownRounded';
import KeyboardArrowUpRounded from '@mui/icons-material/KeyboardArrowUpRounded';
import moment from 'moment';
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import FormDatePicker from '../../Forms/fields/FormDatePicker';
import FormInput from '../../Forms/fields/FormInput';
import FormSelect from '../../Forms/fields/FormSelect';
import { FIELDTYPE } from '../../Forms/fields/types';
import { useDebounce } from '../../Hooks/useDebounce';
import { checkPermissions } from '../../util/verifyRole';
import SearchDate from '../../Components/Tables/SearchDate';
import TableSelect from '../../Components/Tables/TableSelect';
import Statuses from '../../Components/Theme/Components/Statuses';
import Filter from '../../Components/Theme/Table/Filter';
import NotResultRow from '../../Components/Theme/Table/NotResultRow';
import { Pagination } from '../../Components/Theme/Table/Pagination';
import { StyledTable } from '../../Components/Theme/Table/StyledTable';
import { AKO_STATUSES, DISPUTE_AKO_ALLOWED_ROLES, DISPUTES_TYPE } from './constants';
import { disputesActions } from './disputes.slice';
import { useDisputeRowStyles } from './styles';
import { useTranslation } from 'react-i18next';
import useViewCallbackLog from '../../services/actionsLog/useViewCallbackLog';
import StickyTableHead from '../../Components/Theme/Table/StickyTableHead';

const getColumns = (statuses = []) => [
  {
    id: 'dispute_status',
    title: 'FIELDS.STATUS',
    minWidth: 150,
    searchType: FIELDTYPE.OPTION,
    options: statuses
  },
  { id: 'dispute_id', title: 'FIELDS.DISPUTES_ID', minWidth: 110, searchType: FIELDTYPE.TEXT },
  { id: 'tko_eic', title: 'FIELDS.TKO_EIC', minWidth: 170, searchType: FIELDTYPE.TEXT },
  { id: 'initiator_company', title: 'FIELDS.INITIATOR_COMPANY_NAME', minWidth: 530, searchType: FIELDTYPE.TEXT },
  { id: 'created_at', title: 'FIELDS.CREATION_DATE', minWidth: 160, searchType: FIELDTYPE.DATE }
];

const getOptionsByRow = (options) => {
  return options.map((value) => ({
    value: value,
    label: value
  }));
};

const getFilters = (disputeTypes = [], disputeContinued = []) => [
  { id: 'executor_company', title: 'FIELDS.EXECUTOR_SHORT', type: FIELDTYPE.TEXT, fullWidth: true, visible: true },
  {
    id: 'ako',
    title: 'FIELDS.NAME_OF_RESPONSIBLE_AKO',
    type: FIELDTYPE.TEXT,
    fullWidth: true,
    visible: checkPermissions('DISPUTES.LIST.FILTERS.AKO', DISPUTE_AKO_ALLOWED_ROLES)
  },
  {
    id: 'dispute_type',
    title: 'FIELDS.DISPUTES_TYPE',
    type: FIELDTYPE.OPTION,
    options: getOptionsByRow(disputeTypes),
    visible: true
  },
  { id: 'finished_at', title: 'FIELDS.DATE_OF_RESOLUTION', type: FIELDTYPE.DATE, visible: true },
  {
    id: 'must_be_finished_at',
    title: 'FIELDS.EXPECTED_DATE_OF_DISPUTE_RESOLUTION',
    type: FIELDTYPE.DATE,
    visible: true
  },
  {
    id: 'continued',
    title: 'FIELDS.CONTINUED',
    type: FIELDTYPE.OPTION,
    options: getOptionsByRow(disputeContinued),
    visible: true
  }
];

export const DisputesTable = ({ disputeList, searchParams, loading }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [search, setSearch] = useState(searchParams);
  const { disputeContinued, disputeStatuses, disputeTypes } = useSelector(({ disputes }) => disputes);

  const onPaginateLog = useViewCallbackLog();

  const columns = useMemo(() => getColumns(disputeStatuses), [disputeStatuses]);
  const filters = getFilters(disputeTypes, disputeContinued);

  const debouncedSetDisputesParams = useDebounce((params) => dispatch(disputesActions.setSearchParams(params)));

  useEffect(() => {
    dispatch(disputesActions.getSettings());
  }, [dispatch]);

  const onSearch = (key, value) => {
    setSearch({ ...search, [key]: value });
    debouncedSetDisputesParams({ ...searchParams, [key]: value, page: 1 });
  };
  const handleFilter = (filterValues) => {
    dispatch(
      disputesActions.setSearchParams({
        ...search,
        executor_company: filterValues?.executor_company || null,
        ako: filterValues?.ako || null,
        dispute_type: filterValues?.dispute_type || null,
        finished_at: filterValues?.finished_at || null,
        must_be_finished_at: filterValues?.must_be_finished_at || null,
        continued: filterValues?.continued || null,
        page: 1,
        size: 25
      })
    );
  };
  const onPaginate = (param) => {
    dispatch(disputesActions.setSearchParams({ ...searchParams, ...param }));
    onPaginateLog();
  };
  const handleRowClick = (row) => {
    navigate(`/disputes/${row?.type === DISPUTES_TYPE.TKO ? 'tko/' : 'dko/'}${row?.uid}`);
  };

  return (
    <>
      <StyledTable spacing={0}>
        <StickyTableHead>
          <TableRow>
            {columns.map(({ minWidth, width, title, id, searchType, options }) => (
              <TableCell
                style={{ minWidth: minWidth, width: width }}
                className={'MuiTableCell-head'}
                key={'header' + id}
              >
                <p>{t(title)}</p>
                <SearchField
                  key={id}
                  id={id}
                  value={search[id]}
                  onSearch={onSearch}
                  type={searchType}
                  options={options}
                />
              </TableCell>
            ))}

            <Filter autoApply={false} onChange={handleFilter} name={'disputes-filter-form'} big>
              {filters
                ?.filter((filter) => filter.visible)
                ?.map(({ title, id, type, fullWidth, options }) => (
                  <Grid item xs={12} md={fullWidth ? 12 : 6} key={id}>
                    <FilterField title={t(title)} id={id} options={options} type={type} />
                  </Grid>
                ))}
            </Filter>
          </TableRow>
          <TableRow style={{ height: 8 }}></TableRow>
        </StickyTableHead>
        <TableBody>
          {disputeList?.data?.length > 0 ? (
            disputeList.data.map((row) => <Row {...row} key={'row' + row.id} onClick={() => handleRowClick(row)} />)
          ) : (
            <NotResultRow span={6} text={t('DISPUTES_NOT_FOUND')} />
          )}
        </TableBody>
      </StyledTable>
      <Pagination
        {...disputeList}
        params={searchParams}
        loading={loading}
        elementsName={t('PAGINATION.DISPUTES')}
        onPaginate={onPaginate}
      />
    </>
  );
};

const getColumnsDetail = (status) => [
  {
    id: 'executor_company',
    title: 'FIELDS.EXECUTOR_SHORT',
    minWidth: 530,
    width: 530,
    visible: !AKO_STATUSES.includes(status)
  },
  {
    id: 'ako',
    title: 'FIELDS.NAME_OF_RESPONSIBLE_AKO',
    minWidth: 530,
    width: 530,
    visible: AKO_STATUSES.includes(status)
  },
  { id: 'type', title: 'FIELDS.DISPUTES_TYPE', minWidth: 200, visible: true },
  { id: 'finished_at', title: 'FIELDS.RESOLUTION_DATE_TIME', minWidth: 200, visible: true },
  { id: 'must_be_finished_at', title: 'FIELDS.EXPECTED_DATE_OF_DISPUTE_RESOLUTION', minWidth: 220, visible: true },
  { id: 'continued', title: 'FIELDS.CONTINUED', minWidth: 80, visible: true }
];

const Row = ({
  id,
  tko,
  type,
  status,
  created_at,
  continued,
  executor_company,
  finished_at,
  initiator_company,
  must_be_finished_at,
  ako,
  onClick
}) => {
  const { t } = useTranslation();
  const classes = useDisputeRowStyles();
  const [open, setOpen] = useState(false);
  const columnsDetail = getColumnsDetail(status);

  const handleExpandClick = (e) => {
    setOpen(!open);
    e.stopPropagation();
  };

  return (
    <>
      <TableRow
        hover
        className={'body__table-row ' + (open ? classes.rootOpen : classes.root)}
        data-marker={'table-row'}
        onClick={onClick}
      >
        <TableCell data-marker={'status'}>
          <Statuses currentStatus={status} statuses={[status]} />
        </TableCell>
        <TableCell data-marker={'id'}>{id || '-'}</TableCell>
        <TableCell data-marker={'uid'}>{tko || '-'}</TableCell>
        <TableCell data-marker={'initiator_company'}>{initiator_company || '-'}</TableCell>
        <TableCell data-marker={'created_at'}>{moment(created_at).format('DD.MM.yyyy') || '-'}</TableCell>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={handleExpandClick}
            className={classes.expand}
            data-marker={open ? 'expand' : 'collapse'}
          >
            {open ? <KeyboardArrowUpRounded /> : <KeyboardArrowDownRounded />}
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow className={classes.detail} data-marker={`table-row--detail id-${id}`}>
        <TableCell
          style={{
            paddingBottom: 8,
            paddingTop: 0,
            paddingLeft: 0,
            paddingRight: 0
          }}
          colSpan={6}
        >
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1} className={classes.detailContainer}>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow hover className={classes.head}>
                    {columnsDetail
                      ?.filter((column) => column.visible)
                      ?.map(({ id, title, minWidth, width }) => (
                        <TableCell style={{ minWidth: minWidth, width: width }} key={id}>
                          {t(title)}
                        </TableCell>
                      ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow className={classes.body}>
                    {!AKO_STATUSES.includes(status) && (
                      <TableCell data-marker={'executor_company'}>{executor_company || '-'}</TableCell>
                    )}
                    {AKO_STATUSES.includes(status) && <TableCell data-marker={'ako'}>{ako || '-'}</TableCell>}
                    <TableCell data-marker={'type'}>{type}</TableCell>
                    <TableCell data-marker={'finished_at'}>
                      {(finished_at && moment(finished_at).format('DD.MM.yyyy • HH:mm')) || '-'}
                    </TableCell>
                    <TableCell data-marker={'must_be_finished_at'}>
                      {(must_be_finished_at && moment(must_be_finished_at).format('DD.MM.yyyy')) || '-'}
                    </TableCell>
                    <TableCell data-marker={'continued'}>{continued?.toUpperCase() || '-'}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

const SearchField = ({ id, value, type, onSearch, options }) => (
  <>
    {type === FIELDTYPE.DATE && <SearchDate name={id} onSearch={onSearch} column={{ id }} formatDate={'YYYY-MM-DD'} />}
    {type === FIELDTYPE.OPTION && <TableSelect value={value} data={options} id={id} onChange={onSearch} />}
    {type === FIELDTYPE.TEXT && (
      <input name={id} type={'text'} value={value || ''} onChange={({ target }) => onSearch(id, target.value)} />
    )}
  </>
);

const FilterField = ({ id, type, options, title }) => (
  <>
    {(type === FIELDTYPE.TEXT || !type) && <FormInput label={title} name={id} />}
    {type === FIELDTYPE.OPTION && <FormSelect label={title} name={id} data={options} />}
    {type === FIELDTYPE.DATE && <FormDatePicker label={title} name={id} outFormat={'YYYY-MM-DD'} />}
  </>
);
