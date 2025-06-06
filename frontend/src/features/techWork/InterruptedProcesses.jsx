import React, { useRef, useState } from 'react';
import { Box, Collapse, Grid, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import { styles } from '.';
import SelectField from '../../Components/Theme/Fields/SelectField';
import { Pagination } from '../../Components/Theme/Table/Pagination';
import { useTranslation } from 'react-i18next';
import {
  useInterruptedProcessesQuery,
  useInterruptedProcessesRestartMutation,
  useLazyInterruptedProcessesFilesQuery
} from './api';
import moment from 'moment';
import Page from '../../Components/Global/Page';
import { StyledTable } from '../../Components/Theme/Table/StyledTable';
import Filter from '../../Components/Theme/Table/Filter';
import SearchDate from '../../Components/Tables/SearchDate';
import TableSelect from '../../Components/Tables/TableSelect';
import { statuses } from '../processes/List';
import NotResultRow from '../../Components/Theme/Table/NotResultRow';
import FormDatePicker from '../../Forms/fields/FormDatePicker';
import FormInput from '../../Forms/fields/FormInput';
import Statuses from '../../Components/Theme/Components/Statuses';
import KeyboardArrowDownRounded from '@mui/icons-material/KeyboardArrowDownRounded';
import KeyboardArrowUpRounded from '@mui/icons-material/KeyboardArrowUpRounded';
import clsx from 'clsx';
import { useRowStyles } from '../tko/styles';
import IconButton from '@mui/material/IconButton';
import CircleButton from '../../Components/Theme/Buttons/CircleButton';
import StickyTableHead from '../../Components/Theme/Table/StickyTableHead';

const columns = [
  { id: 'name', label: 'FIELDS.PROCESS', align: 'left', minWidth: 150 },
  { id: 'id', label: 'FIELDS.PROCESS_ID', minWidth: 120, width: 120, align: 'left' },
  { id: 'status', label: 'FIELDS.STATUS', align: 'left', minWidth: 60 },
  { id: 'restarted_at', label: 'TECH_WORKS.FIELDS.RESTARTED_AT', width: 240, align: 'left' }
];

const filters = [
  { id: 'filepath_created_at', label: 'TECH_WORKS.FIELDS.FILEPATH_CREATED_AT', type: 'date', md: 12 },
  { id: 'filepath_name', label: 'TECH_WORKS.FIELDS.FILEPATH_NAME', md: 12 }
];

export const InterruptedProcesses = () => {
  const { t } = useTranslation();
  const [params, setParams] = useState({ page: 1, size: 25 });
  const { data, isFetching, refetch } = useInterruptedProcessesQuery(params);
  const [restartProcess, { isLoading }] = useInterruptedProcessesRestartMutation();
  const [search, setSearch] = useState(params);
  const timeOut = useRef(null);

  const onSearch = (key, value) => {
    if (key === 'id') value = value.replace(/[^0-9]/g, '').substring(0, 18);

    if ((value === '' && !search[key]) || (value && value.length < 3 && key !== 'id')) return;

    setSearch({ ...search, [key]: value || undefined });
    const data = { ...params, [key]: value || undefined, page: 1 };

    switch (key) {
      case 'id':
        clearTimeout(timeOut.current);
        timeOut.current = setTimeout(() => {
          setParams({ ...data });
        }, 1000);
        return;
      default:
        setParams({ ...data });
    }
  };

  const getSearch = (key) => {
    switch (key) {
      case 'restarted_at':
        return (
          <SearchDate
            onSearch={onSearch}
            column={{ id: key }}
            formatDate={'yyyy-MM-DD'}
            name={key}
            value={search[key] || null}
          />
        );
      case 'name':
        return (
          <TableSelect
            value={search[key] || null}
            data={data ? data?.names?.map((i) => ({ value: i, label: t(`SUBPROCESSES.${i}`) })) : []}
            onChange={onSearch}
            id={key}
            dataMarker={'process'}
            minWidth={80}
            maxWidth={670}
          />
        );
      case 'status':
        return (
          <TableSelect
            value={search[key] || null}
            data={statuses.map((i) => ({ ...i, label: t(i.label) }))}
            id={key}
            onChange={onSearch}
            minWidth={80}
          />
        );
      default:
        return <input type="text" value={search[key] || ''} onChange={({ target }) => onSearch(key, target.value)} />;
    }
  };

  const handleFilter = (filterValues) => {
    setParams({
      ...Object.fromEntries(Object.entries(params).filter(([key]) => !filters.find((i) => i.id === key))),
      ...filterValues,
      page: 1
    });
  };

  const handleClearFilters = (formParams) => {
    let newParams = {};
    Object.entries(search).forEach(([id, oldValue]) => {
      newParams[id] = filters.find((i) => i.id === id) ? undefined : oldValue;
    });
    newParams = { ...newParams, ...formParams, page: 1, size: 25 };
    setParams(newParams);
  };

  return (
    <Page
      acceptPermisions={'TECH_WORK.ACCESS'}
      acceptRoles={['АКО_Процеси']}
      pageName={t('TECH_WORKS.PAGE.FIELS_TITLE')}
      backRoute={'/tech/administration'}
      loading={isFetching || isLoading}
      controls={<CircleButton type={'autorenew'} title={t('TECH_WORKS.CONTROLS.REFETCH')} onClick={refetch} />}
    >
      <Box component={'section'} sx={styles.table}>
        <Typography component={'h4'} sx={styles.header}>
          {t('TECH_WORKS.PAGE.SELECT_CATEGORY')}
        </Typography>
        <Box sx={styles.body}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={3}>
              <SelectField
                label={t('TECH_WORKS.FIELDS.CATEGORY')}
                value={'process'}
                data={[{ value: 'process', label: 'FIELDS.PROCESS' }]}
              />
            </Grid>
          </Grid>
        </Box>
      </Box>
      <StyledTable spacing={0}>
        <StickyTableHead>
          <TableRow>
            <Filter
              name={'tech-work-file-status-form'}
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
            {columns.map(({ id, label, width, minWidth, align }) => (
              <TableCell
                sx={{ minWidth: minWidth, width: width || 'initial' }}
                className={'MuiTableCell-head'}
                key={id}
                align={align}
              >
                <p>{t(label)}</p>
                {getSearch(id)}
              </TableCell>
            ))}
            <TableCell sx={{ width: 40 }} />
          </TableRow>
          <TableRow style={{ height: 8 }}></TableRow>
        </StickyTableHead>
        <TableBody sx={{ borderSpacing: 0 }}>
          {data?.page?.data?.length > 0 ? (
            data?.page?.data?.map((row) => <Row {...row} key={row.uid} restartProcess={restartProcess} />)
          ) : (
            <NotResultRow span={6} text={t('PROCESSES_NOT_FOUND')} />
          )}
        </TableBody>
      </StyledTable>
      <Pagination
        {...data?.page}
        params={params}
        loading={isFetching}
        onPaginate={(p) => setParams({ ...params, ...p })}
      />
    </Page>
  );
};

const Row = (props) => {
  const { uid, can_restart, restartProcess } = props;
  const [getFiles, { data: files, isFetching }] = useLazyInterruptedProcessesFilesQuery();
  const { t } = useTranslation();
  const classes = useRowStyles();
  const [open, setOpen] = useState(false);

  const getRowData = (key) => {
    switch (key) {
      case 'name':
        return t(`SUBPROCESSES.${props[key]}`);
      case 'restarted_at':
        return props?.restarted_at ? moment(props.restarted_at).format('DD.MM.yyyy • HH:mm') : '';
      case 'status':
        return (
          props?.status && (
            <Box display={'flex'} justifyContent={'center'}>
              <Statuses currentStatus={props?.status} statuses={[props?.status]} />
            </Box>
          )
        );
      default:
        return props[key];
    }
  };

  return (
    <>
      <TableRow className={clsx(open && classes.rootOpen, classes.root)} data-marker={'table-row'}>
        <TableCell sx={{ width: 62 }}>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              !open && getFiles(uid);
              setOpen(!open);
            }}
            sx={{
              fontSize: 21,
              border: open ? '1px solid #F28C60' : '1px solid #223B82',
              color: open ? '#F28C60' : '#223B82'
            }}
            data-marker={open ? 'expand' : 'collapse'}
          >
            {open ? <KeyboardArrowUpRounded /> : <KeyboardArrowDownRounded />}
          </IconButton>
        </TableCell>
        {columns.map(({ id, minWidth, width }) => (
          <TableCell data-marker={id} key={id} sx={{ minWidth: minWidth, width: width || 'initial' }}>
            {getRowData(id)}
          </TableCell>
        ))}
        <TableCell sx={{ width: 40 }}>
          <CircleButton
            type={'create'}
            dataMarker={`restart-${uid}`}
            size={'small'}
            disabled={!can_restart}
            title={t('TECH_WORKS.CONTROLS.RESTART_PROCESS')}
            onClick={() => restartProcess(uid)}
          />
        </TableCell>
      </TableRow>
      <TableRow className={classes.detail} data-marker={`table-row--detail id-${uid}`}>
        <TableCell sx={{ pb: 1, pt: 0, pl: 0, pr: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            {isFetching ? (
              <Typography align={'center'} variant={'body1'} sx={{ fontSize: 12, color: '#567691', my: 1 }}>
                {t('LOADING') + '...'}
              </Typography>
            ) : (
              <Box className={classes.detailContainer}>
                <Table size="small" aria-label="purchases">
                  <TableHead>
                    <TableRow className={classes.head}>
                      <TableCell>{t('TECH_WORKS.FIELDS.FILEPATH_CREATED_DATE_TIME')}</TableCell>
                      <TableCell>{t('TECH_WORKS.FIELDS.FILEPATH_NAME')}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {files?.map((file) => (
                      <TableRow className={classes.body} key={file.uid}>
                        <TableCell data-marker={'started_at'}>
                          {file.created_at ? moment(file.created_at).format('DD.MM.YYYY • HH:mm') : '-'}
                        </TableCell>
                        <TableCell data-marker={'file_name'}>{file.name}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            )}
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};
