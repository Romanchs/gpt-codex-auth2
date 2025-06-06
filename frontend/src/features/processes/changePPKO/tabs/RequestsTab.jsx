import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import moment from 'moment';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { checkPermissions } from '../../../../util/verifyRole';
import CircleButton from '../../../../Components/Theme/Buttons/CircleButton';
import { REQUESTS_LINKS } from '../data';
import { useChangePPKOSubprocessesQuery } from '../api';
import InnerDataTable from '../InnerDataTable';
import { useTranslation } from 'react-i18next';

const defaultColumns = [
  { id: 'id', label: 'FIELDS.SUBPROCESS_ID', minWidth: 150 },
  { id: 'name', label: 'FIELDS.SUBPROCESS_NAME', minWidth: 150, renderBody: (name, _, t) => t(REQUESTS_LINKS[name]?.text) },
  // {id: 'is_finished', label: 'Виконано', minWidth: 150, renderBody: is_finished => is_finished ? 'Так' : 'Ні'},
  {
    id: 'created_at',
    label: 'FIELDS.INITIALIZATION_DATE',
    minWidth: 150,
    renderBody: (date) => date && moment(date).format('DD.MM.yyyy • HH:mm')
  },
  {
    id: 'must_be_finished_at',
    label: 'FIELDS.DEADLINE',
    minWidth: 150,
    renderBody: (date) => date && moment(date).format('DD.MM.yyyy • HH:mm')
  }
  /*{
    id: 'finished_at',
    label: 'Дата та час виконання',
    minWidth: 150,
    renderBody: date => date && moment(date).format('DD.MM.yyyy • HH:mm')
  }*/
];

const RequestsTab = () => {
  const { uid } = useParams();
  const {t} = useTranslation();
  const navigate = useNavigate();
  const params = useSelector((store) => store.changePPKO.params);

  const { currentData, isFetching } = useChangePPKOSubprocessesQuery({ uid, params }, { skip: !uid });

  const columns = [...defaultColumns];
  if (checkPermissions('PROCESSES.CHANGE_PPKO.MAIN.TABLE_CELLS.LINK', ['АКО_ППКО'])) {
    columns.push({
      id: 'link',
      label: 'FIELDS.LINK',
      minWidth: 100,
      align: 'center',
      renderBody: (...args) =>
        args[1]?.uid && (
          <CircleButton
            type={'link'}
            size={'small'}
            title={t('FIELDS.LINK_TO', {name: t(REQUESTS_LINKS[args[1].name]?.text)})}
            onClick={() => navigate(REQUESTS_LINKS[args[1].name]?.link?.replace('{uid}', args[1]?.uid))}
          />
        )
    });
  }

  const renderRow = (row, index) => (
    <TableRow key={row?.id} data-marker={'table-row'} className={'body__table-row'} tabIndex={index}>
      {columns.map(({ id, align, renderBody }, i) => (
        <TableCell key={id + i} data-marker={id} align={align || 'left'}>
          {renderBody ? renderBody(row[id], row, t) : row[id]}
        </TableCell>
      ))}
    </TableRow>
  );

  return (
    <InnerDataTable
      columns={columns}
      currentData={currentData?.subprocesses}
      loading={isFetching}
      BodyRow={renderRow}
      isPagination={false}
      ignoreI18={false}
    />
  );
};

export default RequestsTab;
