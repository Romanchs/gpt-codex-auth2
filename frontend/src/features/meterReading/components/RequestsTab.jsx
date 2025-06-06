import { StyledTable } from '../../../Components/Theme/Table/StyledTable';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import NotResultRow from '../../../Components/Theme/Table/NotResultRow';
import { useMeterReadingProcessQuery } from '../api';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import SearchField from '../../../Components/Tables/SearchField';

const columns = [
  { title: 'FIELDS.METER_DATA_COLLECTOR_NAME', key: 'full_name', minWidth: 200 },
  { title: 'FIELDS.DATE_TIME_OF_SENDING_REQUEST', key: 'date_complete' },
  { title: 'FIELDS.DATE_MDC_COMPLETE', key: 'date_mdc_complete' }
];

const RequestsTab = ({ params, handleFilter }) => {
  const { t } = useTranslation();
  const { uid } = useParams();
  const { currentData } = useMeterReadingProcessQuery({ uid, params });

  return (
    <StyledTable>
      <TableHead>
        <TableRow>
          {columns.map(({ title, key, minWidth = 0 }) => (
            <TableCell key={key} sx={{ minWidth }} data-marker={'head--' + key}>
              {t(title)}
              {key === 'full_name' && <SearchField name={'mdc_company'} onSearch={handleFilter} />}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {currentData?.mdc_data?.length === 0 && (
          <NotResultRow text={t('THERE_ARE_NO_REQUESTS')} span={columns.length} small />
        )}
        {currentData?.mdc_data?.map((item, index) => (
          <TableRow key={index} className="body__table-row">
            {columns.map(({ key }) => (
              <TableCell key={key} data-marker={'row--' + key}>
                {key === 'full_name'
                  ? item[key]
                  : (item[key] && moment(item[key]).format('DD.MM.yyyy • HH:mm')) || ' - '}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </StyledTable>
  );
};

export default RequestsTab;
