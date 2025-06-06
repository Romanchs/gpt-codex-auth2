import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { mainApi } from '../../../../app/mainApi';
import NotResultRow from '../../../../Components/Theme/Table/NotResultRow';
import { StyledTable } from '../../../../Components/Theme/Table/StyledTable';
import { Pagination } from '../../../../Components/Theme/Table/Pagination';
import TableHeadCell from '../../../../Components/Tables/TableHeadCell';
import { setParams } from '../slice';
import StickyTableHead from '../../../../Components/Theme/Table/StickyTableHead';

const defaultColumns = [
  { id: 'eic', label: 'FIELDS.EIC_CODE' },
  { id: 'connection_status', label: 'FIELDS.CONNECTION_STATUS' },
  { id: 'customer', label: 'FIELDS.AP_CUSTOMER_CODE' },
  { id: 'city', label: 'FIELDS.CITY' },
  { id: 'eic_x', label: 'FIELDS.EIC_CODE_X_SUPPLIERS' },
  { id: 'eic_y', label: 'FIELDS.EIC_CODE_Y_REGION' },
  { id: 'period', label: 'FIELDS.CORRECTION_PERIOD' },
  { id: 'reject_reason', label: 'FIELDS.REJECTED_REASON', minWidth: 180 }
];

const correctionZVColumns = [
  { id: 'eic', label: 'FIELDS.EIC_CODE' },
  { id: 'zv_short_name', label: 'FIELDS.SHORT_NAME' },
  { id: 'type_tko', label: 'FIELDS.TKO_TYPE' },
  { id: 'eic_y1', label: 'FIELDS.MGA_EIC' },
  { id: 'eic_y_w2', label: 'FIELDS.Y_W2_EIC' },
  { id: 'period', label: 'FIELDS.CORRECTION_PERIOD' },
  { id: 'reject_reason', label: 'FIELDS.REJECTED_REASON', minWidth: 180 }
];

export const TYPE_AP = {
  СПОЖИВАННЯ: 'TYPE_OF_ACCOUNTING_POINT.CONSUMPTION',
  'СПОЖИВАННЯ І ГЕНЕРАЦІЯ': 'TYPE_OF_ACCOUNTING_POINT.COMBINED',
  ГЕНЕРАЦІЯ: 'TYPE_OF_ACCOUNTING_POINT.PRODUCTION',
  ОБМІН: 'TYPE_OF_ACCOUNTING_POINT.EXCHANGE'
};

const Table = () => {
  const { uid } = useParams();
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const params = useSelector((store) => store.correctionArchivingTS.params);
  const { currentData, isFetching } = mainApi.endpoints.correctionArchivingTS.useQueryState({ uid, params });
  const columns = currentData?.additional_data?.ap_type === 'ZV' ? correctionZVColumns : defaultColumns;

  const getData = (id, value) => {
    if (id === 'reject_reason' && !value) return '–';
    if (id === 'type_tko' && value && TYPE_AP[value]) return t(TYPE_AP[value]);
    if (id === 'connection_status' && value && i18n.exists(`CONNECTION_STATUSES.${value.toUpperCase()}`))
      return t(`CONNECTION_STATUSES.${value.toUpperCase()}`);
    return i18n.exists(value) ? t(value) : value;
  };

  return (
    <>
      <StyledTable spacing={2}>
        <StickyTableHead>
          <TableRow>
            {columns.map(({ id, label, minWidth }) => (
              <TableHeadCell key={id} title={t(label)} sx={{ minWidth }} />
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
                      {getData(id, point[id])}
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
