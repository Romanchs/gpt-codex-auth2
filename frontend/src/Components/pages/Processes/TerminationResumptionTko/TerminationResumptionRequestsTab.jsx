import { TableCell, TableRow } from '@material-ui/core';
import TableBody from '@material-ui/core/TableBody';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import { getTerminationResumptionRequests } from '../../../../actions/processesActions';
import { checkPermissions } from '../../../../util/verifyRole';
import CircleButton from '../../../Theme/Buttons/CircleButton';
import NotResultRow from '../../../Theme/Table/NotResultRow';
import { Pagination } from '../../../Theme/Table/Pagination';
import { StyledTable } from '../../../Theme/Table/StyledTable';
import { useTranslation } from 'react-i18next';
import StickyTableHead from '../../../Theme/Table/StickyTableHead';

const columns = [
  { id: 'executor_company', label: 'FIELDS.PPKO_NAME', minWidth: 250 },
  { id: 'answer', label: 'FIELDS.IS_ANSWERED', minWidth: 200 },
  { id: 'created_at', label: 'FIELDS.DATE_TIME_OF_SENDING_REQUEST', minWidth: 200 },
  { id: 'completed_at', label: 'FIELDS.ANSWET_DATE', minWidth: 200 }
];

const TerminationResumptionRequestsTab = () => {
  const { t } = useTranslation();
  const { uid } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [params, setParams] = useState({ page: 1, size: 25 });
  const { currentProcess, loading } = useSelector(({ processes }) => processes);

  useEffect(() => {
    dispatch(getTerminationResumptionRequests(uid, params));
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
            {checkPermissions('PROCESSES.TERMINATION_RESUMPTION.MAIN.TABS.REQUESTS.TABLE_CELLS.LINK', 'АКО...') && (
              <TableCell className={'MuiTableCell-head'} style={{ minWidth: 100 }} align={'center'}>
                <p>{t('FIELDS.LINK')}</p>
              </TableCell>
            )}
          </TableRow>
        </StickyTableHead>
        <TableBody>
          {currentProcess?.subprocesses?.data?.length > 0 ? (
            currentProcess?.subprocesses?.data?.map((row) => (
              <TableRow tabIndex={-1} data-marker="table-row" className="body__table-row" key={row?.uid}>
                <TableCell data-marker={'executor_company'}>{row?.executor_company}</TableCell>
                <TableCell data-marker={'answer'}>
                  {row?.answer === '1' ? t('CONTROLS.YES') : t('CONTROLS.NO')}
                </TableCell>
                <TableCell data-marker={'created_at'}>
                  {row?.created_at && moment(row?.created_at).format('DD.MM.yyyy • HH:mm')}
                </TableCell>
                <TableCell data-marker={'completed_at'}>
                  {row?.completed_at && moment(row?.completed_at).format('DD.MM.yyyy • HH:mm')}
                </TableCell>
                {checkPermissions('PROCESSES.TERMINATION_RESUMPTION.MAIN.TABS.REQUESTS.TABLE_CELLS.LINK', 'АКО...') && (
                  <TableCell data-marker={'link'} align={'center'}>
                    <CircleButton
                      type={'link'}
                      size={'small'}
                      onClick={() => navigate(`/processes/connecting-disconnecting/${row?.uid}`)}
                      title={t('CONTROLS.LINK_TO_PROCESS')}
                    />
                  </TableCell>
                )}
              </TableRow>
            ))
          ) : (
            <NotResultRow span={5} text={t('REQUESTS_NOT_FOUND')} />
          )}
        </TableBody>
      </StyledTable>
      <Pagination
        {...currentProcess?.subprocesses}
        loading={loading}
        params={params}
        onPaginate={(v) => setParams({ ...params, ...v })}
      />
    </>
  );
};

export default TerminationResumptionRequestsTab;
