import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell/TableCell';
import TableRow from '@material-ui/core/TableRow';
import moment from 'moment';

import Statuses from '../../../Components/Theme/Components/Statuses';
import NotResultRow from '../../../Components/Theme/Table/NotResultRow';
import { StyledTable } from '../../../Components/Theme/Table/StyledTable';
import { useTranslation } from 'react-i18next';
import StickyTableHead from '../../../Components/Theme/Table/StickyTableHead';

const columns = [
  {
    id: 'created_at',
    title: 'FIELDS.DATE_TIME',
    minWidth: 140,
    cols: 3
  },
  {
    id: 'dispute_status',
    title: 'FIELDS.STATUS',
    minWidth: 100,
    cols: 3
  },
  {
    id: 'description',
    title: 'FIELDS.DESCRIPTION',
    minWidth: 310,
    cols: 4
  },
  {
    id: 'user_role',
    title: 'FIELDS.USER_ROLE',
    minWidth: 140,
    cols: 1
  }
];

export const DisputesEntityDkoHistory = ({ data }) => {
  const { t } = useTranslation();

  return (
    <>
      <StyledTable>
        <StickyTableHead>
          <TableRow>
            {columns.map(({ id, title, minWidth, cols }) => (
              <TableCell key={id} style={{ minWidth }} colSpan={cols} className={'MuiTableCell-head'}>
                {t(title)}
              </TableCell>
            ))}
          </TableRow>
        </StickyTableHead>
        <TableBody>
          {!data?.length && <NotResultRow span={12} text={t('STATUSES_HISTORY_NOT_FOUND')} small />}
          {data?.map((history, index) => (
            <TableRow data-marker="table-row" className="body__table-row" key={`row-${index}`}>
              <TableCell data-marker={'created_at'} colSpan={3}>
                {moment(history.created_at).format('DD.MM.YYYY  •  HH:mm')}
              </TableCell>
              <TableCell data-marker={'dispute_status'} colSpan={3}>
                <Statuses statuses={[history.dispute_status]} currentStatus={history.dispute_status} />
              </TableCell>
              <TableCell data-marker={'description'} colSpan={4}>
                {history.description || '-'}
              </TableCell>
              <TableCell data-marker={'user_role'} colSpan={1}>
                {history.user_role || '-'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </StyledTable>
    </>
  );
};
