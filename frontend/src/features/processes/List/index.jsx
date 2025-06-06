import { makeStyles } from '@material-ui/core';
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
import { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { downloadExportProcesses, getProcesses, setCurrentProcessParams } from '../../../actions/processesActions';
import { useTechWorkProcessUpdateMutation } from '../../techWork/api';
import FormDatePicker from '../../../Forms/fields/FormDatePicker';
import FormInput from '../../../Forms/fields/FormInput';
import { checkPermissions, verifyRole } from '../../../util/verifyRole';
import Page from '../../../Components/Global/Page';
import SearchDate from '../../../Components/Tables/SearchDate';
import TableSelect from '../../../Components/Tables/TableSelect';
import CircleButton from '../../../Components/Theme/Buttons/CircleButton';
import { LightTooltip } from '../../../Components/Theme/Components/LightTooltip';
import Statuses from '../../../Components/Theme/Components/Statuses';
import Filter from '../../../Components/Theme/Table/Filter';
import NotResultRow from '../../../Components/Theme/Table/NotResultRow';
import { Pagination } from '../../../Components/Theme/Table/Pagination';
import { StyledTable } from '../../../Components/Theme/Table/StyledTable';
import TableAutocomplete from '../../../Components/Tables/TableAutocomplete';
import { useTranslation } from 'react-i18next';
import { COMPARE_CODES } from '../../../util/directories';
import { linkByProcessName } from '../../../util/linkByProcessName';
import useExportFileLog from '../../../services/actionsLog/useEportFileLog';
import useViewCallbackLog from '../../../services/actionsLog/useViewCallbackLog';
import useSearchLog from '../../../services/actionsLog/useSearchLog';
import TechModalHandler from './techWork/Modals';
import ActionsButton from './techWork/ActionsButton';
import StickyTableHead from '../../../Components/Theme/Table/StickyTableHead';

export const PROCESSES_LIST_ACCEPT_ROLES = [
  'АКО',
  'АКО_Процеси',
  'АКО_ППКО',
  'АКО_Користувачі',
  'АКО_Довідники',
  'СВБ',
  'АТКО',
  'ОМ',
  'ОЗКО',
  'ОЗД',
  'ОДКО',
  'АДКО',
  'ГарПок',
  'АКО/АР_ZV'
];

const columns = [
  { id: 'id', label: 'FIELDS.PROCESS_ID', minWidth: 100, width: 100, align: 'left' },
  { id: 'process', label: 'FIELDS.PROCESS', minWidth: 120, align: 'left' },
  { id: 'subprocess', label: 'FIELDS.SUBPROCESS', minWidth: 180, align: 'left' },
  { id: 'status', label: 'FIELDS.STATUS', minWidth: 60, align: 'left' },
  { id: 'executor_company', label: 'FIELDS.ORGANIZATION', minWidth: 120, align: 'left' }
];

const verifyInput = (value) =>
  !(value === 'Invalid date' || moment(value).isAfter('2100-01-01') || moment(value).isBefore('1925-01-01'));

const filters = [
  { id: 'initiator', label: 'FIELDS.AUTOR', md: 12 },
  { id: 'executor', label: 'FIELDS.EXECUTOR_SHORT', md: 12 },
  { id: 'ap', label: 'FIELDS.EIC_CODE_AP_TYPE_Z', md: 6 },
  { id: 'empty', md: 6 },
  { id: 'created_at', label: 'FIELDS.CREATED', type: 'date', md: 6, verifyInput },
  { id: 'started_at', label: 'FIELDS.STARTED', type: 'date', md: 6, verifyInput },
  { id: 'finished_at', label: 'FIELDS.COMPLETED', type: 'date', md: 6, verifyInput },
  { id: 'must_be_finished_at', label: 'FIELDS.DEADLINE', type: 'date', md: 6, verifyInput }
];

export const statuses = [
  { label: 'STATUSES.IN_PROCESS', value: 'IN_PROCESS' },
  { label: 'STATUSES.DONE', value: 'DONE' },
  { label: 'STATUSES.REJECTED', value: 'REJECTED' },
  { label: 'STATUSES.COMPLETED', value: 'COMPLETED' },
  { label: 'STATUSES.NEW', value: 'NEW' },
  { label: 'STATUSES.CANCELED', value: 'CANCELED' },
  { label: 'STATUSES.CANCELED_BY_OWNER', value: 'CANCELED_BY_OWNER' },
  { label: 'STATUSES.CANCELED_BY_CONCURRENT', value: 'CANCELED_BY_CONCURRENT' },
  { label: 'STATUSES.FORMED', value: 'FORMED' },
  { label: 'STATUSES.PARTIALLY_DONE', value: 'PARTIALLY_DONE' }
];

const defaultTechWorkData = { modalType: null, processData: null };

const ProcessesList = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { processesList, loading: loadingActions, params } = useSelector(({ processes }) => processes);
  const timeOut = useRef(null);
  const [search, setSearch] = useState(params);
  const exportFileLog = useExportFileLog(['Процеси']);
  const onPaginateLog = useViewCallbackLog();
  const searchLog = useSearchLog();
  const [techWorkData, setTechWorkData] = useState(defaultTechWorkData);
  const isTechWork = searchParams.get('mode') === 'tech-works';
  const [, { isLoading: isTechWorksUodateLoading }] = useTechWorkProcessUpdateMutation({
    fixedCacheKey: 'processes-quality-monitoring'
  });

  const loading = useMemo(() => loadingActions || isTechWorksUodateLoading, [isTechWorksUodateLoading, loadingActions]);

  useEffect(() => {
    if (searchParams.get('mode') && !params?.mode) {
      if (verifyRole(['АКО_Процеси'])) {
        dispatch(setCurrentProcessParams({ ...params, mode: searchParams.get('mode') }));
      } else {
        navigate('/');
      }
    }
  }, [dispatch, searchParams]);

  const GROUPS = useMemo(() => {
    if (!processesList?.groups) return [];
    let data = Object.keys(processesList.groups);
    if (search.subprocess) data = data.filter((i) => processesList.groups[i].includes(search.subprocess));
    return data
      .map((i) => ({
        value: i,
        label: `GROUPS.${i}`
      }))
      .sort((a, b) => t(a.label).localeCompare(t(b.label), COMPARE_CODES[i18n.language]));
  }, [processesList, search.subprocess]);

  const SUBPROCESSES = useMemo(() => {
    if (!processesList?.groups) return [];
    const data = search.process ? processesList.groups[search.process] : Object.values(processesList.groups).flat();
    return [...new Set(data)]
      .map((i) => ({
        value: i,
        label: `SUBPROCESSES.${i}`
      }))
      .sort((a, b) => t(a.label).localeCompare(t(b.label), COMPARE_CODES[i18n.language]));
  }, [processesList, search.process]);

  useEffect(() => {
    if (
      checkPermissions('PROCESSES.LIST.ACCESS', PROCESSES_LIST_ACCEPT_ROLES) &&
      (!isTechWork || verifyRole(['АКО_Процеси']))
    ) {
      dispatch(
        getProcesses({
          ...params,
          executor_company: params?.executor_company?.value || undefined
        })
      );
    }
  }, [dispatch, navigate, params]);

  const onClick = (data) => {
    navigate(linkByProcessName(data), {
      state: {
        processesList: {
          params,
          search
        },
        techMode: searchParams.get('mode')
      }
    });
  };

  const onSearch = (key, value) => {
    if (key === 'id') value = value.replace(/[^0-9]/g, '').substring(0, 18);
    if (value === '' && !search[key]) return;
    setSearch({ ...search, [key]: value });
    if (value && value.length < 3 && key !== 'id') return;
    if (key === 'id') {
      clearTimeout(timeOut.current);
      timeOut.current = setTimeout(() => {
        const data = { ...params, [key]: value, page: 1 };
        if (data[key] === '') delete data[key];
        dispatch(setCurrentProcessParams({ ...data }));
      }, 1000);
    } else {
      const data = { ...params, [key]: value, page: 1 };
      if (data[key] === '') delete data[key];
      dispatch(setCurrentProcessParams({ ...data }));
    }
    searchLog();
  };

  const getSearch = (key) => {
    if (key === 'executor_company') {
      return (
        <TableAutocomplete
          onSelect={(value) => onSearch(key, value)}
          apiPath={'publicCompaniesList'}
          defaultValue={params[key]?.label}
          searchBy={'name'}
          dataMarker={key}
          mapOptions={(data) => data.map((i) => ({ label: i.short_name, value: i.eic }))}
        />
      );
    }
    if (key === 'created_at' || key === 'started_at' || key === 'finished_at' || key === 'must_be_finished_at') {
      return (
        <SearchDate
          onSearch={onSearch}
          column={{ id: key }}
          formatDate={'yyyy-MM-DD'}
          name={key}
          value={search[key] || null}
        />
      );
    }
    if (key === 'process') {
      return (
        <TableSelect
          value={search[key] || null}
          data={GROUPS.map((i) => ({ ...i, label: t(i.label) }))}
          id={key}
          onChange={onSearch}
          minWidth={80}
          maxWidth={670}
        />
      );
    }
    if (key === 'subprocess') {
      return (
        <TableSelect
          value={search[key] || null}
          data={SUBPROCESSES.map((i) => ({ ...i, label: t(i.label) }))}
          id={key}
          onChange={onSearch}
          minWidth={80}
          maxWidth={670}
        />
      );
    }
    if (key === 'status') {
      return (
        <TableSelect
          value={search[key] || null}
          data={statuses.map((i) => ({ ...i, label: t(i.label) }))}
          id={key}
          onChange={onSearch}
          minWidth={80}
        />
      );
    }
    return <input type="text" value={search[key] || ''} onChange={({ target }) => onSearch(key, target.value)} />;
  };

  const handleFilter = (filterValues) => {
    dispatch(
      setCurrentProcessParams({
        ...Object.fromEntries(Object.entries(params).filter(([key]) => !filters.find((i) => i.id === key))),
        ...filterValues,
        page: 1
      })
    );
    searchLog();
  };

  const handleClearFilters = (formParams) => {
    let newParams = {};
    Object.entries(search).forEach(([id, oldValue]) => {
      newParams[id] = filters.find((i) => i.id === id) ? null : oldValue;
    });
    newParams = { ...newParams, ...formParams, page: 1, size: 25 };
    dispatch(setCurrentProcessParams(newParams));
    setSearch(newParams);
  };

  const handleDownload = () => {
    dispatch(downloadExportProcesses());
    exportFileLog();
  };

  const handleBack = () => {
    navigate(searchParams.get('mode') ? '/tech' : '/');
  };

  const clearTechWorkData = () => {
    setTechWorkData(defaultTechWorkData);
  };

  const selectTechAction = (data) => {
    setTechWorkData({ modalType: data.modalType, processData: data.processData });
  };

  return (
    <Page
      pageName={t('PAGES.PROCESSES')}
      loading={loading}
      faqKey={'PROCESSES__PROCESSES_LIST'}
      acceptRoles={PROCESSES_LIST_ACCEPT_ROLES}
      acceptPermisions={'PROCESSES.LIST.ACCESS'}
      backRoute={handleBack}
      controls={
        checkPermissions('PROCESSES.LIST.CONTROLS.EXPORT', ['ОДКО', 'АТКО', 'АКО_Процеси', 'СВБ', 'АКО_ППКО']) && (
          <CircleButton type={'download'} title={t('CONTROLS.EXPORT_PROCESSES')} onClick={handleDownload} />
        )
      }
    >
      <StyledTable spacing={0}>
        <StickyTableHead>
          <TableRow>
            {columns.map(({ id, label, width, minWidth, align }) => (
              <TableCell
                style={{ minWidth: minWidth, width: width || 'initial' }}
                className={'MuiTableCell-head'}
                key={id}
                align={align}
              >
                <p>{t(label)}</p>
                {getSearch(id)}
              </TableCell>
            ))}
            {isTechWork && <TableCell className={'MuiTableCell-head'} align={'center'} />}
            <Filter
              name={'processes-filter-form'}
              onChange={handleFilter}
              onClear={handleClearFilters}
              autoApply={false}
              clearByChangeRole={true}
              verifyInputs={filters}
            >
              {filters.map(({ id, label, type, format, md }) => (
                <Grid item xs={12} {...(md !== 12 && { md })} key={id}>
                  {type === 'date' ? (
                    <FormDatePicker label={t(label)} name={id} outFormat={format || 'YYYY-MM-DD'} />
                  ) : (
                    id && label && <FormInput label={t(label)} name={id} />
                  )}
                </Grid>
              ))}
            </Filter>
          </TableRow>
          <TableRow style={{ height: 8 }}></TableRow>
        </StickyTableHead>
        <TableBody>
          {processesList?.data?.length > 0 ? (
            processesList?.data?.map((rowData) => (
              <Row
                key={`row-${rowData?.uid || rowData?.id}}`}
                data={rowData}
                onClick={onClick}
                columns={['id', 'group', 'subprocess_name', 'status', 'executor_company']}
                selectTechAction={selectTechAction}
                isTechWork={isTechWork}
                innerColumns={[
                  { label: t('FIELDS.AUTOR'), value: 'initiator', width: '20%' },
                  { label: t('FIELDS.EXECUTOR_SHORT'), value: 'executor', width: '20%' },
                  { label: t('FIELDS.CREATED'), value: 'created_at', type: 'date', width: '15%' },
                  {
                    label: t('FIELDS.STARTED'),
                    value: 'started_at',
                    minWidth: 140,
                    type: 'date',
                    width: '15%'
                  },
                  {
                    label: t('FIELDS.COMPLETED'),
                    type: 'date',
                    width: '15%',
                    value: 'finished_at'
                  },
                  {
                    label: t('FIELDS.DEADLINE'),
                    minWidth: 120,
                    type: 'date',
                    width: '15%',
                    value: 'must_be_finished_at'
                  }
                ]}
              />
            ))
          ) : (
            <NotResultRow span={6} text={t('PROCESSES_NOT_FOUND')} loading={loading} />
          )}
        </TableBody>
      </StyledTable>
      {isTechWork && <TechModalHandler data={techWorkData} handleClose={clearTechWorkData} />}
      <Pagination
        {...processesList}
        onPaginate={(p) => {
          dispatch(setCurrentProcessParams({ ...params, ...p }));
          onPaginateLog();
        }}
        elementsName={t('PAGINATION.PROCESSES')}
        loading={loading}
        params={params}
        ignoreChangeRelation
      />
    </Page>
  );
};

const Row = ({ data, onClick, columns, innerColumns, selectTechAction, isTechWork }) => {
  const { t } = useTranslation();
  const classes = useRowStyles();
  const [open, setOpen] = useState(false);
  const [tooltip, setTooltip] = useState({ open: false, disable: false });

  const getRowData = (data, key) => {
    switch (key) {
      case 'subprocess_name':
        return t(`SUBPROCESSES.${data[key]}`);
      case 'group':
        return t(`GROUPS.${data[key]}`);
      case 'status':
        return data?.status && <Statuses currentStatus={data?.status} statuses={[data?.status]} />;
      default:
        return data[key];
    }
  };

  return (
    <>
      <LightTooltip
        title={t('PARENT_PROCESS_NUMBER', { id: data?.parent_id })}
        placement="bottom"
        arrow
        open={data?.parent_id ? tooltip.open : false}
        onOpen={() => setTooltip({ ...tooltip, open: true })}
        onClose={() => setTooltip({ ...tooltip, open: false })}
        disableHoverListener={tooltip.disable}
      >
        <TableRow
          className={open ? classes.rootOpen : classes.root}
          data-marker={'table-row'}
          onClick={() => onClick(data)}
        >
          {columns.map((key, index) => (
            <TableCell key={'cell-' + index} data-marker={key} align={key === 'status' ? 'center' : 'left'}>
              {getRowData(data, key)}
            </TableCell>
          ))}
          {isTechWork && (
            <TableCell align="center" style={{ padding: 0 }}>
              {data?.can_admin && <ActionsButton processData={data} selectTechAction={selectTechAction} />}
            </TableCell>
          )}
          <TableCell>
            <IconButton
              aria-label="expand row"
              size="small"
              onMouseEnter={() => setTooltip({ open: false, disable: true })}
              onMouseLeave={() => setTooltip({ ...tooltip, disable: false })}
              onClick={(e) => {
                e.stopPropagation();
                setOpen(!open);
              }}
              className={open ? classes.expand : classes.collapse}
              data-marker={open ? 'expand' : 'collapse'}
            >
              {open ? <KeyboardArrowUpRounded /> : <KeyboardArrowDownRounded />}
            </IconButton>
          </TableCell>
        </TableRow>
      </LightTooltip>
      <TableRow className={classes.detail} data-marker={`table-row--detail id-${data?.id}`}>
        <TableCell
          style={{
            paddingBottom: 8,
            paddingTop: 0,
            paddingLeft: 0,
            paddingRight: 0
          }}
          colSpan={isTechWork ? 7 : 6}
        >
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1} className={classes.detailContainer}>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow className={classes.head}>
                    {innerColumns.map(({ label, value, width }, index) => (
                      <TableCell key={'head-cell' + index} data-marker={'head--' + value} style={{ width }}>
                        {label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow className={classes.body}>
                    {innerColumns.map(({ value, type }, index) => (
                      <TableCell key={'cell' + index} data-marker={'body--' + value}>
                        {type === 'date'
                          ? data[value] && moment(data[value]).format('DD.MM.yyyy • HH:mm')
                          : data[value]}
                      </TableCell>
                    ))}
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

export default ProcessesList;

export const useRowStyles = makeStyles({
  root: {
    boxShadow: '0px 4px 10px rgba(146, 146, 146, 0.1)',
    borderRadius: 10,
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.04)',
      '& > *': {
        backgroundColor: '#f2f2f2',
        cursor: 'pointer'
      }
    },
    '& > *': {
      paddingTop: 12,
      paddingBottom: 12,
      borderBottom: '1px solid #D1EDF3',
      borderTop: '1px solid #D1EDF3',
      backgroundColor: '#fff',
      fontSize: 12,
      color: '#4A5B7A',
      '&:first-child': {
        borderRadius: '10px 0 0 10px',
        borderLeft: '1px solid #D1EDF3'
      },
      '&:last-child': {
        borderRadius: '0 10px 10px 0',
        borderRight: '1px solid #D1EDF3'
      }
    }
  },
  rootOpen: {
    boxShadow: '0px 4px 10px rgba(146, 146, 146, 0.1)',
    borderRadius: '10px 10px 0 0',
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.04)',
      '& > *': {
        backgroundColor: '#C4E0E6',
        cursor: 'pointer'
      }
    },
    '& > *': {
      paddingTop: 12,
      paddingBottom: 12,
      borderBottom: '1px solid #D1EDF3',
      borderTop: '1px solid #D1EDF3',
      backgroundColor: '#D1EDF3',
      fontSize: 12,
      color: '#4A5B7A',
      '&:first-child': {
        borderRadius: '10px 0 0 0',
        borderLeft: '1px solid #D1EDF3'
      },
      '&:last-child': {
        borderRadius: '0 10px 0 0',
        borderRight: '1px solid #D1EDF3'
      }
    }
  },
  expand: {
    border: '1px solid #F28C60',

    '& svg': {
      color: '#F28C60',
      fontSize: 21
    }
  },
  collapse: {
    border: '1px solid #223B82',

    '& svg': {
      color: '#223B82',
      fontSize: 21
    }
  },
  detail: {
    '& > *': {
      borderBottom: 'none'
    }
  },
  detailContainer: {
    backgroundColor: '#fff',
    margin: 0,
    padding: '8px 16px 0',
    borderTop: 'none',
    border: '1px solid #D1EDF3',
    borderRadius: '0 0 10px 10px',
    overflow: 'hidden',
    position: 'relative'
  },
  head: {
    '& > *': {
      color: '#567691',
      fontSize: 11,
      fontWeight: 700,
      borderBottom: '1px solid #4A5B7A !important',
      padding: '12px !important',
      '&:first-child': {
        paddingLeft: 0
      },
      '&:last-child': {
        paddingRight: 0
      }
    }
  },
  body: {
    '& > *': {
      color: '#567691',
      fontSize: 10,
      fontWeight: 400,
      padding: 13,
      border: 'none'
    }
  },
  controls: {
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-end',
    paddingTop: 16,
    '& > *': {
      marginLeft: 16,
      padding: '3px 12px',
      '& > *': {
        fontSize: 11
      },
      '& svg': {
        fontSize: 12
      }
    }
  }
});
