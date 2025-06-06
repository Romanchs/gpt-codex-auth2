import TableBody from '@mui/material/TableBody';
import { StyledTable } from '../../../Components/Theme/Table/StyledTable';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { useTranslation } from 'react-i18next';
import NotResultRow from '../../../Components/Theme/Table/NotResultRow';
import moment from 'moment/moment';
import CircleButton from '../../../Components/Theme/Buttons/CircleButton';
import { useLocation, useNavigate } from 'react-router-dom';

const columns = [
  {
    label: 'FIELDS.PPKO_NAME',
    key: 'company_name',
    minWidth: 400
  },
  {
    label: 'FIELDS.REQUEST_NUMBER',
    key: 'process_id'
  },
  {
    label: 'FIELDS.IS_ANSWERED',
    key: 'answer'
  },
  {
    label: 'FIELDS.DATE_TIME_OF_SENDING_REQUEST',
    key: 'created_at'
  },
  {
    label: 'FIELDS.ANSWET_DATE',
    key: 'completed_at'
  },
  {
    label: 'FIELDS.LINK',
    key: 'link',
    width: 90
  }
];

const DisputesEntityChangeRequest = ({ list = [] }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const formatData = (key, data) => {
    switch (key) {
      case 'answer':
        return t(data[key] === 1 ? 'CONTROLS.YES' : 'CONTROLS.NO');
      case 'created_at':
      case 'completed_at':
        return data[key] ? moment(data[key]).format('DD.MM.yyyy • HH:mm') : '-';
      case 'link':
        return (
          <CircleButton
            type={'link'}
            onClick={() =>
              navigate(data[key], {
                state: { from: location }
              })
            }
            size={'small'}
          />
        );
      default:
        return data[key];
    }
  };

  return (
    <StyledTable>
      <TableHead>
        <TableRow>
          {columns.map(({ key, label, minWidth = 'auto', width = 'auto' }) => (
            <TableCell key={`HeadCell-${key}`} style={{ minWidth, width }}>
              <p>{t(label)}</p>
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {list.map((row, index) => (
          <TableRow key={row.process_id + index} data-marker="table-row" className="body__table-row">
            {columns.map(({ key }) => (
              <TableCell key={key} align={key === 'link' ? 'center' : 'left'} data-marker={key}>
                {formatData(key, row)}
              </TableCell>
            ))}
          </TableRow>
        ))}
        {list.length === 0 && <NotResultRow span={columns.length} text={t('THERE_ARE_NO_REQUESTS')} />}
      </TableBody>
    </StyledTable>
  );
};

export default DisputesEntityChangeRequest;
