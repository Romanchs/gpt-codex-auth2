import { TableCell, TableRow } from '@material-ui/core';
import TableBody from '@material-ui/core/TableBody';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import { getConnectDisconnectSubprocesses } from '../../../../actions/processesActions';
import { verifyRole } from '../../../../util/verifyRole';
import CircleButton from '../../../Theme/Buttons/CircleButton';
import NotResultRow from '../../../Theme/Table/NotResultRow';
import { Pagination } from '../../../Theme/Table/Pagination';
import { StyledTable } from '../../../Theme/Table/StyledTable';
import { useTranslation } from 'react-i18next';
import StickyTableHead from '../../../Theme/Table/StickyTableHead';

const defaultColumns = [
  { id: 'executor_company', label: 'FIELDS.PPKO_NAME', minWidth: 250 },
  { id: 'answer', label: 'FIELDS.IS_ANSWERED', minWidth: 200 },
  { id: 'created_at', label: 'FIELDS.DATE_TIME_OF_SENDING_REQUEST', minWidth: 200 },
  { id: 'finished_at', label: 'FIELDS.ANSWET_DATE', minWidth: 200 }
];

const RequestsTab = () => {
  const { t } = useTranslation();
  const { uid } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [params, setParams] = useState({ page: 1, size: 25 });
  const { currentProcess, loading } = useSelector(({ processes }) => processes);

  const columns = [...defaultColumns];
  if (!verifyRole(['АТКО'])) {
    columns.push({ id: 'link', label: 'FIELDS.LINK', minWidth: 100, align: 'center' });
  }

  useEffect(() => {
    dispatch(getConnectDisconnectSubprocesses(uid, params));
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
          </TableRow>
        </StickyTableHead>
        <TableBody>
          {currentProcess?.subprocesses?.data?.length < 1 ? (
            <NotResultRow span={4} text={t('NO_POINTS_FOUND')} />
          ) : (
            currentProcess?.subprocesses?.data?.map((row) => (
              <TableRow tabIndex={-1} data-marker="table-row" className="body__table-row" key={row?.uid}>
                <TableCell data-marker={'executor_company'}>{row?.executor_company}</TableCell>
                <TableCell data-marker={'answer'}>{row?.answer?.toUpperCase()}</TableCell>
                <TableCell data-marker={'created_at'}>
                  {row?.created_at && moment(row?.created_at).format('DD.MM.yyyy • HH:mm')}
                </TableCell>
                <TableCell data-marker={'finished_at'}>
                  {row?.finished_at && moment(row?.finished_at).format('DD.MM.yyyy • HH:mm')}
                </TableCell>
                {!verifyRole(['АТКО']) && (
                  <TableCell data-marker={'link'} align={'center'}>
                    <CircleButton
                      type={'link'}
                      size={'small'}
                      onClick={() => navigate(`/processes/pon/request-actual-dko/${row?.uid}`)}
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
        {...currentProcess?.subprocesses}
        loading={loading}
        params={params}
        onPaginate={(v) => setParams({ ...params, ...v })}
      />
    </>
  );
};

export default RequestsTab;
