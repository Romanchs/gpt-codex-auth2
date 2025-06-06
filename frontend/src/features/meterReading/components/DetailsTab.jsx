import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useMeterReadingProcessQuery, useMeterReadingProcessStartMutation } from '../api';
import { Box } from '@mui/material';
import Grid from '@mui/material/Grid';
import StyledInput from '../../../Components/Theme/Fields/StyledInput';
import DatePicker from '../../../Components/Theme/Fields/DatePicker';
import moment from 'moment/moment';
import { StyledTable } from '../../../Components/Theme/Table/StyledTable';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import NotResultRow from '../../../Components/Theme/Table/NotResultRow';
import { Pagination } from '../../../Components/Theme/Table/Pagination';
import { CONNECTION_STATUSES } from '../../../util/directories';
import { useTranslation } from 'react-i18next';

const columns = [
  { title: 'FIELDS.AP_CODE_TYPE_Z', key: 'eic' },
  { title: 'FIELDS.AP_CUSTOMER_CODE', key: 'customer' },
  { title: 'FIELDS.CITY', key: 'city' },
  { title: 'FIELDS.METER_DATA_COLLECTOR_NAME', key: 'metered_data_collector', minWidth: 200 },
  { title: 'FIELDS.CONNECTION_STATUS', key: 'connection_status' }
];

const DetailsTab = ({ date = null, handleDate, params, setParams }) => {
  const { t } = useTranslation();
  const { uid } = useParams();
  const {
    full_name,
    activeOrganization: { name, eic, usreou }
  } = useSelector((store) => store.user);
  const res = useMeterReadingProcessStartMutation({ fixedCacheKey: 'meter-reading-start' });
  const { data, isFetching } = useMeterReadingProcessQuery({ uid, params }, { skip: !uid });

  return (
    <>
      <Box className={'boxShadow'} sx={{ p: 3, mt: 2, mb: 2 }}>
        <Grid container spacing={2} alignItems={'flex-start'}>
          <Grid item xs={12} md={4.5}>
            <StyledInput
              label={t('FIELDS.USER_INITIATOR')}
              disabled
              value={uid ? data?.initiator?.username : full_name}
            />
          </Grid>
          <Grid item xs={12} md={2.5}>
            <StyledInput
              label={t('FIELDS.CREATE_REQUEST_DATE')}
              disabled
              value={uid && data?.created_at && moment(data?.created_at).format('DD.MM.yyyy • HH:mm')}
            />
          </Grid>
          <Grid item xs={12} md={2.5}>
            <DatePicker
              label={t('FIELDS.DATE_OF_METER_READING')}
              clearable
              value={uid ? data?.must_be_finished_at : date}
              onChange={handleDate}
              minDate={!uid && moment().add(3, 'days')}
              maxDate={!uid && moment().add(31, 'days')}
              disabled={Boolean(uid)}
              error={res[1].error?.data?.must_be_finished_at}
            />
          </Grid>
          <Grid item xs={12} md={2.5}>
            <StyledInput
              label={data?.status === 'CANCELED' ? t('FIELDS.DATE_OF_REQUEST_CANCELLATION') : t('FIELDS.DATE_OF_REQUEST_EXECUTION')}
              disabled
              value={data?.completed_at && moment(data?.completed_at).format('DD.MM.yyyy • HH:mm')}
            />
          </Grid>
          <Grid item xs={12} md={4.5}>
            <StyledInput
              label={t('FIELDS.INITIATOR_COMPANY_NAME')}
              disabled
              value={uid ? data?.initiator_company?.short_name : name}
            />
          </Grid>
          <Grid item xs={12} md={2.5}>
            <StyledInput label={t('FIELDS.EIC')} disabled value={uid ? data?.initiator_company?.eic : eic} />
          </Grid>
          <Grid item xs={12} md={2.5}>
            <StyledInput label={t('FIELDS.USREOU')} disabled value={uid ? data?.initiator_company?.usreou : usreou} />
          </Grid>
        </Grid>
      </Box>
      {uid && data?.info_ap?.data && (
        <>
          <StyledTable>
            <TableHead>
              <TableRow>
                {columns.map(({ title, key, minWidth = 0 }) => (
                  <TableCell key={key} sx={{ minWidth }}>
                    {t(title)}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.info_ap.data.length === 0 && <NotResultRow text={t('THERE_ARE_NO_AP')} span={columns.length} small />}
              {data.info_ap.data.map((item, index) => (
                <TableRow key={index} className="body__table-row">
                  {columns.map(({ key }) => (
                    <TableCell key={key} data-marker={key}>
                      {key === 'connection_status' ? t(CONNECTION_STATUSES[item[key]]) : item[key]}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </StyledTable>
          <Pagination
            {...data?.info_ap}
            loading={isFetching}
            params={params}
            onPaginate={(p) => setParams({ ...params, ...p })}
          />
        </>
      )}
    </>
  );
};

export default DetailsTab;
