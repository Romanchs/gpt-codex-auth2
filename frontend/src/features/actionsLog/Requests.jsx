import Page from '../../Components/Global/Page';
import { useTranslation } from 'react-i18next';
import CircleButton from '../../Components/Theme/Buttons/CircleButton';
import { StyledTable } from '../../Components/Theme/Table/StyledTable';
import { Box, Chip, TableBody, TableRow } from '@mui/material';
import TableCell from '@mui/material/TableCell';
import SearchField from '../../Components/Tables/SearchField';
import TableSelect from '../../Components/Tables/TableSelect';
import moment from 'moment';
import NotResultRow from '../../Components/Theme/Table/NotResultRow';
import { Pagination } from '../../Components/Theme/Table/Pagination';
import { useDownloadEventsDataMutation, useEventsDataQuery, useEventsInitQuery } from './api';
import { useMemo, useState } from 'react';
import { useLazyMsFilesDownloadQuery } from '../../app/mainApi';
import TableAutocomplete from '../../Components/Tables/TableAutocomplete';
import { ACTIONS_LOG_ACCEPT_ROLES, START_DATE } from './ActionsLog';
import { useRegTabStyles } from '../pm/filterStyles';
import DatePicker from '../../Components/Theme/Fields/DatePicker';
import StickyTableHead from '../../Components/Theme/Table/StickyTableHead';

const Requests = () => {
  const { t } = useTranslation();
  const [params, setParams] = useState({ page: 1, size: 25 });
  const [errorText, setErrorText] = useState({});
  const { data: options, isFetching: isFetchingOptions } = useEventsInitQuery();
  const { data: list, isFetching, refetch } = useEventsDataQuery(params);
  const [download, { isLoading }] = useDownloadEventsDataMutation();
  const [downloadFile] = useLazyMsFilesDownloadQuery();
  const classes = useRegTabStyles();

  const STATUSES_OPTIONS = useMemo(() => {
    return [
      { value: 'false', label: 'ACTIONS_LOG.EVENTS_REQUEST_STATUS.ACTIVE' },
      { value: 'true', label: 'ACTIONS_LOG.EVENTS_REQUEST_STATUS.ARCHIVE' }
    ];
  }, []);

  const handleDownloadRequests = () => {
    download();
  };

  const onSearch = (param) => {
    setParams({ ...params, ...param, page: 1 });
  };

  const handleOnDateChange = (id, value, maxDate, minDate) => {
    if (!value) {
      onSearch({ [id]: undefined });
      setErrorText({ ...errorText, [id]: null });
      return;
    }
    const date = moment(value);
    if (date.isValid() && date.isBetween(moment(minDate), moment(maxDate), 'days', '[]')) {
      onSearch({ [id]: date.format() });
      setErrorText({ ...errorText, [id]: null });
    } else {
      setErrorText({ ...errorText, [id]: t('VERIFY_MSG.UNCORRECT_DATE') });
    }
  };

  return (
    <Page
      pageName={t('PAGES.FORMED_REQUESTS')}
      backRoute={'/actions-log/'}
      loading={isLoading || isFetching}
      acceptPermisions={'ACTIONS_LOG.ACCESS'}
      acceptRoles={ACTIONS_LOG_ACCEPT_ROLES}
      faqKey={'INFORMATION_BASE__USER_ACTIONS_LOG'}
      disableLogging
      controls={<CircleButton type={'download'} title={t('CONTROLS.DOWNLOAD')} onClick={handleDownloadRequests} />}
    >
      <StyledTable>
        <StickyTableHead>
          <TableRow data-marker={'table-header-row'}>
            <TableCell className={'MuiTableCell-head'} style={{ width: 150 }}>
              <p>{t('FIELDS.DATE_OF_FORMATION')}</p>
              <div className={classes.picker || ''}>
                <DatePicker
                  value={params['formed_at']}
                  onChange={(date) => handleOnDateChange('formed_at', date, moment(), START_DATE)}
                  maxDate={moment()}
                  minDate={START_DATE}
                  error={errorText?.formed_at}
                />
              </div>
            </TableCell>
            <TableCell className={'MuiTableCell-head'} style={{ width: 220 }}>
              <p>{t('FIELDS.USER_FULL_NAME')}</p>
              <TableAutocomplete
                onSelect={(v) => onSearch({ user: v?.value || '' })}
                apiPath={'usersList'}
                searchBy={'full_name'}
                dataMarker={'user'}
                mapOptions={(data) => data.map((i) => ({ label: i.full_name, value: i.full_name }))}
                searchStart={3}
                filterOptions={(items) => items}
              />
            </TableCell>
            <TableCell className={'MuiTableCell-head'} style={{ width: 300 }}>
              <p>{t('FIELDS.SECTION_PROCESS')}</p>
              <TableSelect
                onChange={(id, v) => onSearch({ [id]: v || undefined })}
                id={'tag'}
                loading={isFetchingOptions}
                value={params.tag}
                data={options?.tags || []}
              />
            </TableCell>
            <TableCell className={'MuiTableCell-head'} width={120}>
              <p>{t('FIELDS.ID')}</p>
              <SearchField name={'id'} onSearch={onSearch} type="number" />
            </TableCell>
            <TableCell className={'MuiTableCell-head'} style={{ width: 300 }}>
              <p>{t('FIELDS.REQUEST_PERIOD')}</p>
              <Box display={'flex'} gap={1}>
                <div className={classes.picker || ''}>
                  <DatePicker
                    dataMarker={'period_from'}
                    value={params['period_from']}
                    onChange={(date) =>
                      handleOnDateChange('period_from', date, params.period_to || moment(), START_DATE)
                    }
                    maxDate={moment()}
                    minDate={START_DATE}
                    error={errorText?.period_from}
                  />
                </div>
                <div className={classes.picker || ''}>
                  <DatePicker
                    dataMarker={'period_to'}
                    value={params['period_to']}
                    onChange={(date) =>
                      handleOnDateChange('period_to', date, moment(), params.period_from || START_DATE)
                    }
                    maxDate={moment()}
                    minDate={START_DATE}
                    error={errorText?.period_to}
                  />
                </div>
              </Box>
            </TableCell>
            <TableCell className={'MuiTableCell-head'}>
              <p>{t('FIELDS.AUTOR')}</p>
              <TableAutocomplete
                onSelect={(v) => onSearch({ initiator: v?.value || '' })}
                apiPath={'usersList'}
                searchBy={'full_name'}
                dataMarker={'initiator'}
                mapOptions={(data) => data.map((i) => ({ label: i.full_name, value: i.full_name }))}
                searchStart={3}
                filterOptions={(items) => items}
              />
            </TableCell>
            <TableCell className={'MuiTableCell-head'} style={{ width: 120 }}>
              <p>{t('FIELDS.REQUESTS_STATUS')}</p>
              <TableSelect
                value={params['status']}
                data={STATUSES_OPTIONS}
                onChange={(id, value) => onSearch({ [id]: value === '' ? undefined : value })}
                id={'status'}
                ignoreI18={false}
              />
            </TableCell>
            <TableCell className={'MuiTableCell-head'} style={{ width: 50 }} align="center"></TableCell>
          </TableRow>
        </StickyTableHead>
        <TableBody>
          {list?.data?.map((data, index) => (
            <TableRow key={index} className="body__table-row" data-marker={'table-row'}>
              <TableCell data-marker={'formed_at'}>
                {data?.formed_at ? moment(data.formed_at).format('DD.MM.yyyy') : '-'}
              </TableCell>
              <TableCell data-marker={'user'}>{data?.user || ''}</TableCell>
              <TableCell data-marker={'tag'}>{data?.tag}</TableCell>
              <TableCell data-marker={'id'}>{data?.id}</TableCell>
              <TableCell data-marker={'period'} align="center">
                {data?.period || '-'}
              </TableCell>
              <TableCell data-marker={'initiator'}>{data?.initiator || ''}</TableCell>
              <TableCell data-marker={'status'}>{<StatusChip isArchive={data?.status} />}</TableCell>
              <TableCell align={'center'} data-marker={'action'}>
                <CircleButton
                  type={
                    data?.filepath?.status === 'IN_PROCESS' || data?.filepath?.status === 'NEW' ? 'loading' : 'download'
                  }
                  size={'small'}
                  onClick={() =>
                    data?.filepath?.status === 'DONE' || data?.filepath?.status === 'FAILED'
                      ? downloadFile({ id: data?.filepath?.file_id, name: data?.filepath?.file_original_name })
                      : refetch()
                  }
                  title={
                    data?.filepath?.status === 'DONE' || data?.filepath?.status === 'FAILED'
                      ? t('DOWNLOAD_RESULT')
                      : `${t('FILE_PROCESSING')}...`
                  }
                />
              </TableCell>
            </TableRow>
          ))}
          {list?.data?.length === 0 && <NotResultRow span={7} text={t('NO_DATA')} />}
        </TableBody>
      </StyledTable>
      <Pagination
        {...list}
        params={params}
        loading={isFetching}
        onPaginate={(p) => setParams((params) => ({ ...params, ...p }))}
      />
    </Page>
  );
};

export default Requests;

const StatusChip = ({ isArchive }) => {
  const { t } = useTranslation();

  return (
    <Chip
      label={isArchive ? t('ACTIONS_LOG.EVENTS_REQUEST_STATUS.ARCHIVE') : t('ACTIONS_LOG.EVENTS_REQUEST_STATUS.ACTIVE')}
      size="small"
      sx={{
        background: 'rgba(209, 237, 243, 0.49)',
        padding: '0 10px',
        textTransform: 'uppercase',
        color: isArchive ? '#FF4850' : '#008C0C'
      }}
    />
  );
};
