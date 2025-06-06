import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell/TableCell';
import TableRow from '@material-ui/core/TableRow';
import WarningRounded from '@mui/icons-material/WarningRounded';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { downloadGtsReport, getGtsReports, revokeGtsReport } from '../../../actions/gtsActions';
import { checkPermissions } from '../../../util/verifyRole';
import Page from '../../Global/Page';
import CircleButton from '../../Theme/Buttons/CircleButton';
import { LightTooltip } from '../../Theme/Components/LightTooltip';
import NotResultRow from '../../Theme/Table/NotResultRow';
import { Pagination } from '../../Theme/Table/Pagination';
import { StyledTable } from '../../Theme/Table/StyledTable';
import CancelModal from '../../Modal/CancelModal';
import SearchDate from '../../Tables/SearchDate';
import TableSelect from '../../Tables/TableSelect';
import { GTS_REPORTS_ACCEPT_ROLES, REPORT_MARKET_DATA } from './constants';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import useExportFileLog from '../../../services/actionsLog/useEportFileLog';
import useSearchLog from '../../../services/actionsLog/useSearchLog';
import useViewCallbackLog from '../../../services/actionsLog/useViewCallbackLog';
import { GTS_LOG_TAGS } from '../../../services/actionsLog/constants';
import StickyTableHead from '../../Theme/Table/StickyTableHead';

const columns = [
  { id: 'filepath_id', label: '№', minWidth: 100, align: 'left' },
  { id: 'user', label: 'FIELDS.USER_FULL_NAME', minWidth: 250, align: 'left' },
  { id: 'started_at', label: 'FIELDS.STARTED_AT', minWidth: 250, align: 'left' },
  { id: 'finished_at', label: 'FIELDS.FINISHED_AT', minWidth: 250, align: 'left' },
  { id: 'filename', label: 'FIELDS.FILENAME', minWidth: 220, align: 'left' },
  { id: 'report_marker', label: 'FIELDS.REPORT_NAME', minWidth: 220, align: 'left' },
  { id: 'status', label: 'FIELDS.STATUS', minWidth: 50, align: 'center' }
];

const GtsReports = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    activeRoles: [{ relation_id }]
  } = useSelector(({ user }) => user);
  const { loading, reports } = useSelector(({ gts }) => gts);
  const [params, setParams] = useState({ page: 1, size: 25 });
  const [search, setSearch] = useState({});
  const timeout = useRef(null);

  const [revokeUid, setRevokeUid] = useState(false);
  const exportFileLog = useExportFileLog(GTS_LOG_TAGS);
  const searchLog = useSearchLog();
  const onPaginateLog = useViewCallbackLog();

  const getData = useCallback(() => {
    dispatch(getGtsReports(params));
  }, [params, dispatch]);

  useEffect(() => {
    if (checkPermissions('GTS.REPORTS.ACCESS', GTS_REPORTS_ACCEPT_ROLES)) {
      getData();
    } else {
      navigate('/');
    }
  }, [navigate, relation_id, getData]);

  const onPaginate = useCallback(
    (newParams) => {
      setParams({ ...params, ...newParams });
      onPaginateLog();
    },
    [params]
  );

  const onSearch = useCallback(
    (id, value) => {
      setSearch({ ...search, [id]: value });
      clearTimeout(timeout.current);
      timeout.current = setTimeout(() => {
        if (value) {
          setParams({ ...params, [id]: value, page: 1 });
        } else {
          const { [id]: value, ...newParams } = params;
          setParams({ ...newParams, page: 1 });
        }
        searchLog();
      }, 500);
    },
    [search, params]
  );

  const getSearchField = useCallback(
    (id) => {
      switch (id) {
        case 'filepath_id':
        case 'user':
        case 'filename':
          return <input value={search[id] || ''} onChange={({ target }) => onSearch(id, target.value)} />;
        case 'started_at':
        case 'finished_at':
          return <SearchDate name={id} onSearch={onSearch} column={{ id }} formatDate={'YYYY-MM-DD'} />;
        case 'report_marker':
          return (
            <TableSelect
              value={search[id]}
              data={REPORT_MARKET_DATA.filter((i) => checkPermissions(i.permission, i.roles)).map((i) => ({
                ...i,
                label: t(i.label)
              }))}
              id={id}
              onChange={onSearch}
              minWidth={80}
              dataMarker={id}
            />
          );
        default:
          return null;
      }
    },
    [search, onSearch]
  );

  const onDownload = (data) => () => {
    dispatch(downloadGtsReport(data?.file, data?.filename));
    exportFileLog();
  };

  const onRevoke = () => {
    dispatch(revokeGtsReport(revokeUid)).then(() => {
      dispatch(getGtsReports(params));
    });
    setRevokeUid(false);
  };

  return (
    <Page
      pageName={t('PAGES.REPORTS')}
      backRoute={'/gts'}
      acceptPermisions={'GTS.REPORTS.ACCESS'}
      faqKey={'GTS__REPORTS'}
      acceptRoles={GTS_REPORTS_ACCEPT_ROLES}
      loading={loading}
      controls={
        <>
          {checkPermissions(
            'GTS.REPORTS.CONTROLS.CREATE_REPORT',
            ['АР (перегляд розширено)', 'АКО_Суперечки'],
            true
          ) && (
            <CircleButton
              type={'settings'}
              title={t('CONTROLS.CREATING_REPORT')}
              onClick={() => navigate('/gts/reports/settings')}
            />
          )}
          {checkPermissions('GTS.REPORTS.CONTROLS.CREATE_AR_REPORT', 'АР (перегляд розширено)') && (
            <CircleButton
              type={'settings'}
              title={t('CONTROLS.CREATING_REPORT')}
              onClick={() => navigate('/gts/reports/setting')}
            />
          )}
        </>
      }
    >
      <StyledTable>
        <StickyTableHead>
          <TableRow>
            {columns.map(({ id, label, minWidth, align }) => (
              <TableCell style={{ minWidth }} className={'MuiTableCell-head'} key={id} align={align}>
                <p>{t(label)}</p>
                {getSearchField(id)}
              </TableCell>
            ))}
            {checkPermissions('GTS.REPORTS.TABLE_CELLS.CANCEL', ['АР (перегляд розширено)'], true) && (
              <TableCell style={{ minWidth: 50 }} className={'MuiTableCell-head'} key={'cancel'} align={'center'}>
                <p>{t('ABOLITION')}</p>
                {getSearchField('cancel')}
              </TableCell>
            )}
          </TableRow>
        </StickyTableHead>
        <TableBody>
          {reports?.data?.length > 0 ? (
            reports?.data?.map((row, index) => (
              <TableRow key={'row' + index} data-marker="table-row" className="body__table-row">
                <TableCell data-marker={'filepath_id'}>{row?.filepath_id || '-'}</TableCell>
                <TableCell data-marker={'user'}>{row?.user || '-'}</TableCell>
                <TableCell data-marker={'started_at'}>
                  {row?.started_at ? moment(row?.started_at).format('DD.MM.YYYY • HH:mm') : '-'}
                </TableCell>
                <TableCell data-marker={'finished_at'}>
                  {' '}
                  {row?.finished_at ? moment(row?.finished_at).format('DD.MM.YYYY • HH:mm') : '-'}
                </TableCell>
                <TableCell data-marker={'filename'}>{row?.filename || '-'}</TableCell>
                <TableCell data-marker={'report_marker'}>{row?.report_marker || '-'}</TableCell>
                <TableCell data-marker={'status'} align={'center'}>
                  {row?.status === 'DONE' && (
                    <CircleButton
                      type={'download'}
                      title={t('CONTROLS.DOWNLOAD')}
                      size={'small'}
                      onClick={onDownload(row)}
                    />
                  )}
                  {row?.status === 'IN_PROCESS' && (
                    <CircleButton
                      type={'loading'}
                      title={`${t('FILE_IN_PROCESS')}...`}
                      size={'small'}
                      onClick={getData}
                    />
                  )}
                  {row?.status === 'FAILED' && (
                    <LightTooltip title={t('SYSTEM_ERROR')} arrow>
                      <WarningRounded
                        data-marker={'error'}
                        style={{ color: '#f90000', fontSize: 22, cursor: 'pointer' }}
                      />
                    </LightTooltip>
                  )}
                  {row?.status === 'CANCELED' && (
                    <LightTooltip title={t('CANCELED')} arrow>
                      <WarningRounded
                        data-marker={'error'}
                        style={{ color: '#f90000', fontSize: 22, cursor: 'pointer' }}
                      />
                    </LightTooltip>
                  )}
                </TableCell>
                {checkPermissions('GTS.REPORTS.TABLE_CELLS.CANCEL', ['АР (перегляд розширено)'], true) && (
                  <TableCell data-marker={'cancel'} align={'center'}>
                    {row?.status === 'IN_PROCESS' && (
                      <CircleButton
                        type={'remove'}
                        title={t('CONTROLS.UNDO')}
                        size={'small'}
                        onClick={() => setRevokeUid(row?.filepath_uid)}
                      />
                    )}
                  </TableCell>
                )}
              </TableRow>
            ))
          ) : (
            <NotResultRow span={8} text={t('REPORTS_NOT_FOUND')} />
          )}
        </TableBody>
      </StyledTable>
      <Pagination {...reports} loading={loading} params={params} onPaginate={onPaginate} />

      <CancelModal
        text={t('CANCEL_REPORT_FORMING_WARNING')}
        open={!!revokeUid}
        onClose={() => setRevokeUid(false)}
        onSubmit={onRevoke}
      />
    </Page>
  );
};

export default GtsReports;
