import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { StyledTable } from '../../../Theme/Table/StyledTable';
import { TableCell, TableRow } from '@material-ui/core';
import TableBody from '@material-ui/core/TableBody';
import NotResultRow from '../../../Theme/Table/NotResultRow';
import moment from 'moment';
import CircleButton from '../../../Theme/Buttons/CircleButton';
import { getDisputeTkoSubprocesses } from '../../../../actions/processesActions';
import { Pagination } from '../../../Theme/Table/Pagination';
import { checkPermissions } from '../../../../util/verifyRole';
import { useTranslation } from 'react-i18next';
import StickyTableHead from '../../../Theme/Table/StickyTableHead';

const columns = [
  { id: 'executor_company', label: 'FIELDS.PPKO_NAME', minWidth: 250 },
  { id: 'in_work', label: 'FIELDS.TAKED_TO_WORK', minWidth: 200 },
  { id: 'is_answered', label: 'FIELDS.IS_ANSWERED', minWidth: 200 },
  { id: 'started_at', label: 'FIELDS.START_WORK_DATE', minWidth: 200 },
  { id: 'finished_at', label: 'FIELDS.ANSWET_DATE', minWidth: 200 }
];

const DisputeRequests = () => {
  const { t } = useTranslation();
  const { uid } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [params, setParams] = useState({ page: 1, size: 25 });

  const { loading } = useSelector(({ processes }) => processes);

  const [subprocesses, setSubprocess] = useState(null);

  useEffect(() => {
    dispatch(
      getDisputeTkoSubprocesses(uid, params, (data) => {
        setSubprocess(data?.subprocesses);
      })
    );
  }, [dispatch, uid, params]);

  return (
    <>
      <StyledTable>
        <StickyTableHead>
          <TableRow>
            {columns.map(({ id, label, minWidth, align }) => (
              <TableCell key={id} className={'MuiTableCell-head'} style={{ minWidth }} align={align || 'left'}>
                <p>{t(label)}</p>
              </TableCell>
            ))}
            {checkPermissions('PROCESSES.DISPUTE_TKO.MAIN.TABS.REQUESTS.TABLE_CELLS.LINK', 'АКО...') && (
              <TableCell className={'MuiTableCell-head'} style={{ minWidth: 100 }} align={'center'}>
                <p>{t('FIELDS.LINK')}</p>
              </TableCell>
            )}
          </TableRow>
        </StickyTableHead>
        <TableBody>
          {subprocesses?.data?.length < 1 ? (
            <NotResultRow span={4} text={t('REQUESTS_NOT_FOUND')} />
          ) : (
            subprocesses?.data?.map((row) => (
              <TableRow tabIndex={-1} data-marker="table-row" className="body__table-row" key={row?.uid}>
                <TableCell data-marker={'executor_company'}>{row?.executor_company}</TableCell>
                <TableCell data-marker={'in_work'}>{row?.in_work?.toUpperCase()}</TableCell>
                <TableCell data-marker={'is_answered'}>{row?.is_answered?.toUpperCase()}</TableCell>
                <TableCell data-marker={'started_at'}>
                  {row?.started_at ? moment(row?.started_at).format('DD.MM.yyyy • HH:mm') : '- • -'}
                </TableCell>
                <TableCell data-marker={'finished_at'}>
                  {row?.finished_at ? moment(row?.finished_at).format('DD.MM.yyyy • HH:mm') : '- • -'}
                </TableCell>
                {checkPermissions('PROCESSES.DISPUTE_TKO.MAIN.TABS.REQUESTS.TABLE_CELLS.LINK', 'АКО...') && (
                  <TableCell data-marker={'link'} align={'center'}>
                    <CircleButton
                      type={'link'}
                      size={'small'}
                      onClick={() => navigate(`/processes/dispute-tko/subprocess/${row?.uid}`)}
                      title={t('CONTROLS.LINK_TO_PROCESS')}
                    />
                  </TableCell>
                )}
              </TableRow>
            ))
          )}
        </TableBody>
      </StyledTable>
      <Pagination
        {...subprocesses}
        loading={loading}
        params={params}
        onPaginate={(v) => setParams({ ...params, ...v })}
      />
    </>
  );
};

export default DisputeRequests;
