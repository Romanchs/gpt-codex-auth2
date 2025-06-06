import React from 'react';
import { StyledTable } from '../../../Components/Theme/Table/StyledTable';
import { TableBody, TableCell, TableRow } from '@material-ui/core';
import { useNavigate, useParams } from 'react-router-dom';
import NotResultRow from '../../../Components/Theme/Table/NotResultRow';
import moment from 'moment';
import { useRequestForProviderQuery } from './api';
import CircleButton from '../../../Components/Theme/Buttons/CircleButton';
import Loading from '../../../Components/Loadings/Loading';
import i18n from '../../../i18n/i18n';
import { useTranslation } from 'react-i18next';
import StickyTableHead from '../../../Components/Theme/Table/StickyTableHead';

const columns = [
  { id: 'balance_supplier', label: i18n.t('FIELDS.SUPPLIER_NAME'), minWidth: 180 },
  { id: 'submitted_request', label: i18n.t('FIELDS.TAKED_TO_WORK'), minWidth: 100 },
  { id: 'answer', label: i18n.t('FIELDS.IS_ANSWERED'), minWidth: 100 },
  { id: 'taken_at', label: i18n.t('FIELDS.START_WORK_DATE'), minWidth: 180 },
  { id: 'done_at', label: i18n.t('FIELDS.ANSWET_DATE'), minWidth: 180 },
  { id: 'subprocess_uid', label: i18n.t('FIELDS.LINK') }
];

const ProviderRequest = () => {
  const { t } = useTranslation();
  const { uid } = useParams();
  const { data, isFetching } = useRequestForProviderQuery({ uid });

  return (
    <>
      <Loading loading={isFetching} />
      <StyledTable>
        <StickyTableHead>
          <TableRow>
            {columns.map(({ id, label, minWidth }) => (
              <TableCell key={id} className={'MuiTableCell-head'} style={{ minWidth }}>
                {label}
              </TableCell>
            ))}
          </TableRow>
        </StickyTableHead>
        <TableBody>
          {!data || data?.subprocesses?.length < 1 ? (
            <NotResultRow span={6} text={t('REQUESTS_NOT_FOUND')} />
          ) : (
            data?.subprocesses?.map((row) => <Row key={row.uid} data={row} />)
          )}
        </TableBody>
      </StyledTable>
    </>
  );
};

export default ProviderRequest;

const Row = ({ data }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const getCellContent = (id, value) => {
    if (id === 'taken_at' || id === 'done_at') {
      return value ? moment(value).format('DD.MM.yyyy • HH:mm') : '-';
    }
    if (id === 'subprocess_uid') {
      return (
        <CircleButton
          type={'link'}
          title={t('CONTROLS.LINK_TO_INITIALIZED_PROCESS')}
          size={'small'}
          onClick={() => navigate(`/processes/activating-request/${value}`)}
        />
      );
    }

    return value;
  };

  return (
    <>
      <TableRow tabIndex={-1} data-marker="table-row" className="body__table-row">
        {columns.map(({ id, align }) => (
          <TableCell key={id} align={align} data-marker={id}>
            {getCellContent(id, data[id])}
          </TableCell>
        ))}
      </TableRow>
    </>
  );
};
