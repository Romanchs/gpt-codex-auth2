import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell/TableCell';
import TableRow from '@material-ui/core/TableRow';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import { getHistoryGrantingAuthority } from '../../../../actions/processesActions';
import CircleButton from '../../../Theme/Buttons/CircleButton';
import NotResultRow from '../../../Theme/Table/NotResultRow';
import { Pagination } from '../../../Theme/Table/Pagination';
import { StyledTable } from '../../../Theme/Table/StyledTable';
import { checkPermissions } from '../../../../util/verifyRole';
import TableChip from '../../../Tables/TableChip';
import { useTranslation } from 'react-i18next';
import StickyTableHead from '../../../Theme/Table/StickyTableHead';

const columns = [
  { key: 'short_name', title: 'ROLES.METERED_DATA_RESPONSIBLE', search: false, minWidth: 250 },
  { key: 'id', title: 'FIELDS.REQUEST_ID', search: false, minWidth: 200 },
  { key: 'started', title: 'FIELDS.TAKED_TO_WORK', search: false, minWidth: 100 },
  { key: 'answer', title: 'FIELDS.IS_ANSWERED', search: false, minWidth: 200 },
  { key: 'started_at', title: 'FIELDS.ANSWET_DATE', search: false, minWidth: 200 },
  { key: 'must_be_finished_at', title: 'FIELDS.MUST_BE_FINISHED_AT', search: false, minWidth: 200 }
];

const GrantingAuthorityTkoHistoryTab = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { uid } = useParams();
  const dispatch = useDispatch();
  const {
    activeRoles: [{ relation_id }]
  } = useSelector(({ user }) => user);
  const { currentProcess, loading } = useSelector(({ processes }) => processes);
  const [params, setParams] = useState({ page: 1, size: 25 });

  // Check roles & get data
  useEffect(() => {
    dispatch(getHistoryGrantingAuthority(uid, params));
  }, [dispatch, uid, relation_id, params]);

  const handleLink = (subprocess) => {
    navigate(`/processes/pon/request-historical-dko/${subprocess?.uid}`);
  };

  return (
    <>
      <StyledTable spacing={0}>
        <StickyTableHead>
          <TableRow>
            {columns.map((column, index) => (
              <TableCell
                style={{ minWidth: column.minWidth, width: column.width }}
                className={'MuiTableCell-head'}
                key={'header' + index}
              >
                <p>{t(column.title)}</p>
              </TableCell>
            ))}
            <TableCell colSpan={4}></TableCell>
          </TableRow>
          <TableRow style={{ height: 8 }}></TableRow>
        </StickyTableHead>
        <TableBody>
          {currentProcess?.dko_historical?.data?.length === 0 ? (
            <NotResultRow text={t('SORRY_NOTHING_FOUND')} span={7} small />
          ) : (
            currentProcess?.dko_historical?.data?.map((row, index) => (
              <>
                <TableRow data-marker="table-row" className="body__table-row" key={`row-${index}`}>
                  <TableCell data-marker={'short_name'}>{row?.executor_company?.short_name || ''}</TableCell>
                  <TableCell data-marker={'id'}>{row?.id || ''}</TableCell>
                  <TableCell data-marker={'started'} align={'center'}>
                    {row?.started && <TableChip label={row.started.toUpperCase()} isAnswer />}
                  </TableCell>
                  <TableCell data-marker={'answer'} align={'center'}>
                    {row?.answer && <TableChip label={row.answer.toUpperCase()} isAnswer />}
                  </TableCell>
                  <TableCell data-marker={'started_at'}>
                    {row?.started_at ? moment(row?.started_at).format('DD.MM.yyyy • HH:mm') : ''}
                  </TableCell>
                  <TableCell data-marker={'must_be_finished_at'}>
                    {row?.must_be_finished_at ? moment(row?.must_be_finished_at).format('DD.MM.yyyy • HH:mm') : ''}
                  </TableCell>
                  <TableCell data-marker={'customer'}>
                    {checkPermissions('PROCESSES.GRANTING_AUTHORITY.MAIN.TABS.HISTORICAL_DKO.TABLE_CELLS.LINK', [
                      'АКО_Процеси',
                      'АКО_Користувачі',
                      'АКО',
                      'АТКО',
                      'ОДКО',
                      'ОЗД',
                      'ОЗКО'
                    ]) && (
                      <CircleButton
                        type={'link'}
                        size={'small'}
                        onClick={() => handleLink(row)}
                        title={t('CONTROLS.LINK_TO_INITIALIZED_PROCESS')}
                      />
                    )}
                  </TableCell>
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
        {...currentProcess?.dko_historical}
      />
    </>
  );
};

export default GrantingAuthorityTkoHistoryTab;
