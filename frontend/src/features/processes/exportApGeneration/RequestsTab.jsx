import { useParams } from 'react-router-dom';

import { TableCell, TableRow } from '@material-ui/core';
import TableBody from '@material-ui/core/TableBody';
import moment from 'moment';

import NotResultRow from '../../../Components/Theme/Table/NotResultRow';
import { StyledTable } from '../../../Components/Theme/Table/StyledTable';
import { useExportApGenQuery } from './api';
import { useTranslation } from 'react-i18next';
import StickyTableHead from '../../../Components/Theme/Table/StickyTableHead';

const columns = [
  {
    id: 'executor_company',
    label: 'FIELDS.DEFENDANT',
    minWidth: 250,
    render: (data) => data?.short_name || ''
  },
  { id: 'request', label: 'FIELDS.REQUEST_SENT', minWidth: 200, render: () => 'CONTROLS.YES' },
  {
    id: 'answer',
    label: 'FIELDS.IS_ANSWERED',
    minWidth: 200,
    render: (data) => (data?.toLowerCase() === 'так' ? 'CONTROLS.YES' : 'CONTROLS.NO')
  },
  {
    id: 'created_at',
    label: 'FIELDS.DATE_TIME_OF_SENDING_REQUEST',
    minWidth: 200,
    render: (data) => (data ? moment(data).format('DD.MM.yyyy • HH:mm') : '–      •      –')
  },
  {
    id: 'finished_at',
    label: 'FIELDS.ANSWET_DATE',
    minWidth: 200,
    render: (data) => (data ? moment(data).format('DD.MM.yyyy • HH:mm') : '–      •      –')
  }
];

const RequestsTab = () => {
  const { t, i18n } = useTranslation();
  const { uid } = useParams();
  const { currentData } = useExportApGenQuery({ uid, tab: 'subprocesses' });

  return (
    <StyledTable>
      <StickyTableHead>
        <TableRow>
          {columns.map(({ id, label, minWidth }) => (
            <TableCell key={id} className={'MuiTableCell-head'} style={{ minWidth }} align={'left'}>
              <p>{t(label)}</p>
            </TableCell>
          ))}
        </TableRow>
      </StickyTableHead>
      <TableBody>
        {currentData?.subprocesses?.data?.length < 1 ? (
          <NotResultRow span={5} text={t('REQUESTS_NOT_FOUND')} />
        ) : (
          currentData?.subprocesses?.data?.map((row) => (
            <TableRow key={row?.uid} data-marker="table-row" className="body__table-row">
              {columns.map(({ id, render }) => (
                <TableCell key={id} data-marker={id}>
                  {i18n.exists(render(row[id])) ? t(render(row[id])) : render(row[id])}
                </TableCell>
              ))}
            </TableRow>
          ))
        )}
      </TableBody>
    </StyledTable>
  );
};

export default RequestsTab;
