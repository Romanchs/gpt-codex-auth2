import Box from '@mui/material/Box';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { mainApi } from '../../../../app/mainApi';
import NotResultRow from '../../../../Components/Theme/Table/NotResultRow';
import { StyledTable } from '../../../../Components/Theme/Table/StyledTable';
import { Pagination } from '../../../../Components/Theme/Table/Pagination';
import TableHeadCell from '../../../../Components/Tables/TableHeadCell';
import { setParams } from '../slice';
import transitions from '../../../../i18n/ua/ua.json';
import StickyTableHead from '../../../../Components/Theme/Table/StickyTableHead';

const columns = [
  { id: 'eic', label: 'FIELDS.EIC_CODE' },
  { id: 'connection_status', label: 'FIELDS.CONNECTION_STATUS' },
  { id: 'customer', label: 'FIELDS.AP_CUSTOMER_CODE' },
  { id: 'region', label: 'FIELDS.REGION_OF_ACTUAL_ADDRESS_OF_AP' },
  { id: 'city', label: 'FIELDS.CITY_OF_ACTUAL_ADDRESS_OF_AP' },
  { id: 'dropped_out_at', label: 'FIELDS.DROPPED_OUT_OF_PROCESS' }
];

const Table = () => {
  const { uid } = useParams();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const params = useSelector((store) => store.changePaymentType.params);
  const { currentData, isFetching } = mainApi.endpoints.changePaymentType.useQueryState({ uid, params });
  const connectionStatuses = transitions.CONNECTION_STATUSES;

  const getData = (id, value, point) => {
    if (id === 'dropped_out_at') {
      const date = value || point.canceled_at;
      return date ? (
        <Box component={'span'} sx={{ color: 'blue.contrastText', borderRadius: 4, p: '5px 16px', bgcolor: '#567691' }}>
          {moment(date).format('DD.MM.yyyy • HH:mm')}
        </Box>
      ) : (
        t('CONTROLS.NO')
      );
    }
    if (id === 'connection_status' && value) {
      const transitionKey = Object.keys(connectionStatuses).find(
        (key) => connectionStatuses[key].toLowerCase() === value.toLowerCase()
      );
      return transitionKey ? t(`CONNECTION_STATUSES.${transitionKey}`) : value;
    }
    return value;
  };

  return (
    <>
      <StyledTable spacing={2}>
        <StickyTableHead>
          <TableRow>
            {columns.map(({ id, label }) => (
              <TableHeadCell key={id} title={t(label)} />
            ))}
          </TableRow>
        </StickyTableHead>
        <TableBody>
          {!currentData?.aps?.data?.length ? (
            <NotResultRow span={columns.length} text={t('NO_RECORDS_FOUND')} />
          ) : (
            <>
              {currentData?.aps?.data?.map((point) => (
                <TableRow key={`row-${point.uid}`} className={'body__table-row'} data-marker={'table-row'}>
                  {columns.map(({ id }) => (
                    <TableCell key={id + point.uid} data-marker={id}>
                      {getData(id, point[id], point)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </>
          )}
        </TableBody>
      </StyledTable>
      <Pagination
        {...currentData?.aps}
        params={params}
        loading={isFetching}
        onPaginate={(p) => dispatch(setParams({ ...params, ...p }))}
      />
    </>
  );
};

export default Table;
