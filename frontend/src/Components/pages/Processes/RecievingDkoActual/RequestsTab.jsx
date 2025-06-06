import { TableCell, TableRow } from '@material-ui/core';
import TableBody from '@material-ui/core/TableBody';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import { getReceivingDkoActualSubprocess } from '../../../../actions/processesActions';
import { checkPermissions } from '../../../../util/verifyRole';
import CircleButton from '../../../Theme/Buttons/CircleButton';
import NotResultRow from '../../../Theme/Table/NotResultRow';
import { Pagination } from '../../../Theme/Table/Pagination';
import { StyledTable } from '../../../Theme/Table/StyledTable';
import { useTranslation } from 'react-i18next';
import StickyTableHead from '../../../Theme/Table/StickyTableHead';

const columns = [
  { id: 'short_name', label: 'FIELDS.PPKO_NAME', minWidth: 250, canDisplay: () => true, align: 'left' },
  { id: 'in_work', label: 'FIELDS.TAKED_TO_WORK', minWidth: 150, canDisplay: () => true, align: 'left' },
  { id: 'answer', label: 'FIELDS.IS_ANSWERED', minWidth: 150, canDisplay: () => true, align: 'left' },
  {
    id: 'created_at',
    label: 'FIELDS.DATE_TIME_OF_SENDING_REQUEST',
    canDisplay: () => true,
    minWidth: 200,
    align: 'left'
  },
  {
    id: 'finished_at',
    label: 'FIELDS.ANSWET_DATE',
    canDisplay: () => true,
    minWidth: 200,
    align: 'left'
  },
  {
    id: 'link',
    label: 'FIELDS.LINK',
    minWidth: 200,
    canDisplay: () => false,
    align: 'center'
  }
];

const RequestsTab = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { uid } = useParams();
  const dispatch = useDispatch();
  const { currentProcess, loading } = useSelector(({ processes }) => processes);
  const [params, setParams] = useState({ page: 1, size: 25 });

  // Check roles & get data
  useEffect(() => {
    dispatch(getReceivingDkoActualSubprocess(uid, params));
  }, [dispatch, uid, params]);
  return (
    <>
      <StyledTable>
        <StickyTableHead>
          <TableRow>
            {columns.map(({ id, label, minWidth, canDisplay, align }) => {
              return canDisplay() ? (
                <TableCell key={id} className={'MuiTableCell-head'} style={{ minWidth }} align={align}>
                  <p>{t(label)}</p>
                </TableCell>
              ) : (
                checkPermissions('PROCESSES.RECEIVING_DKO_ACTUAL.MAIN.TABS.REQUESTS.TABLE_CELLS.LINK', [
                  'АКО',
                  'АКО_Процеси',
                  'АКО_Користувачі',
                  'АКО_Довідники'
                ]) && (
                  <TableCell key={id} className={'MuiTableCell-head'} style={{ minWidth }} align={align}>
                    <p>{label}</p>
                  </TableCell>
                )
              );
            })}
          </TableRow>
        </StickyTableHead>
        <TableBody>
          {currentProcess?.subprocesses?.data.length < 1 ? (
            <NotResultRow span={5} text={t('REQUESTS_NOT_FOUND')} />
          ) : (
            currentProcess?.subprocesses?.data.map((row, index) => (
              <>
                <TableRow data-marker="table-row" className="body__table-row" key={`row-${index}`}>
                  <TableCell data-marker={'short_name'}>{row?.executor_company?.short_name}</TableCell>
                  <TableCell data-marker={'in_work'}>{row?.in_work?.toUpperCase()}</TableCell>
                  <TableCell data-marker={'answer'}>{row?.answer?.toUpperCase()}</TableCell>
                  <TableCell data-marker={'created_at'}>
                    {row?.created_at && moment(row?.created_at).format('DD.MM.yyyy • HH:mm')}
                  </TableCell>
                  <TableCell data-marker={'finished_at'}>
                    {row?.finished_at && moment(row?.finished_at).format('DD.MM.yyyy • HH:mm')}
                  </TableCell>
                  {checkPermissions('PROCESSES.RECEIVING_DKO_ACTUAL.MAIN.TABS.REQUESTS.TABLE_CELLS.LINK', [
                    'АКО',
                    'АКО_Процеси',
                    'АКО_Користувачі',
                    'АКО_Довідники'
                  ]) && (
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
                <TableRow style={{ height: 8 }}></TableRow>
              </>
            ))
          )}
        </TableBody>
      </StyledTable>

      <Pagination
        loading={loading}
        params={params}
        onPaginate={(v) => setParams({ ...params, ...v })}
        {...currentProcess?.subprocesses}
      />
    </>
  );
};

export default RequestsTab;
