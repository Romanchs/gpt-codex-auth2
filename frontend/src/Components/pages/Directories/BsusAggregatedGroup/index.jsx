import Page from '../../../Global/Page';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyledTable } from '../../../Theme/Table/StyledTable';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import { TableCell } from '@mui/material';
import { Pagination } from '../../../Theme/Table/Pagination';
import NotResultRow from '../../../Theme/Table/NotResultRow';
import { useBsusAggregatedGroupDirectoryQuery } from './api';
import Row from './Row';
import StickyTableHead from '../../../Theme/Table/StickyTableHead';

const columns = [
  { key: 'bsus', label: 'FIELDS.EIC_CODE_TYPE_Z_AGU_PUP' },
  { key: 'balance_supplier_id', label: 'FIELDS.EIC_CODE_TYPE_X_PUP' },
  { key: 'balance_supplier_name', label: 'FIELDS.PUP_NAME' },
  { key: 'metering_grid_area', label: 'FIELDS.AREA_NAME' },
  { key: 'fuel', label: 'CHARACTERISTICS.FUEL_TYPE' },
  { key: 'generation', label: 'CHARACTERISTICS.GENERATION_TYPE' }
];

const BsusAggregatedGroup = () => {
  const { t } = useTranslation();
  const timeout = useRef(null);
  const [params, setParams] = useState({ page: 1, size: 25 });
  const [search, setSearch] = useState(columns.map((i) => ({ [i.key]: '' })));
  const { data, isFetching } = useBsusAggregatedGroupDirectoryQuery(params);

  const onSearch = (key, value) => {
    setSearch({ ...search, [key]: value });
    clearTimeout(timeout.current);
    timeout.current = setTimeout(() => {
      setParams((p) => {
        const updatedParams = { ...p, page: 1, size: 25 };
        if (value === null || value === undefined) {
          delete updatedParams[key];
        } else {
          updatedParams[key] = value;
        }
        return updatedParams;
      });
    }, 500);
  };

  const getSearch = (key) => {
    if (key === 'fuel' || key === 'generation') {
      return null;
    }
    return (
      <input
        type={'text'}
        value={search[key] || ''}
        onChange={({ target }) => onSearch(key, target.value || undefined)}
      />
    );
  };

  return (
    <Page
      pageName={`106-80 ${t('PAGES.BSUS_AGGREGATED_GROUP')}`}
      backRoute={'/directories'}
      loading={isFetching}
      acceptPermisions={'DIRECTORIES.BSUS_AGGREGATED_GROUP.ACCESS'}
      acceptRoles={['АКО_Процеси', 'АКО_Довідники', 'СВБ']}
    >
      <StyledTable spacing={0}>
        <StickyTableHead>
          <TableRow>
            {columns.map(({ key, label, width = 'auto' }) => (
              <TableCell key={key} sx={{ width }} className={'MuiTableCell-head'}>
                <p>{t(label)}</p>
                {getSearch(key)}
              </TableCell>
            ))}
            <TableCell />
          </TableRow>
          <TableRow style={{ height: 8 }} />
        </StickyTableHead>
        <TableBody>
          {data?.data?.length > 0 ? (
            data.data.map((rowData) => (
              <Row
                key={`row-${rowData?.uid || rowData?.id}}`}
                data={rowData}
                columns={[
                  'bsus',
                  'balance_supplier_id',
                  'balance_supplier_name',
                  'metering_grid_area',
                  'fuel',
                  'generation'
                ]}
                innerColumns={[
                  { label: t('PLATFORM.TYPE_OF_SITE'), value: 'accounting_point_type', width: '25%' },
                  { label: t('CHARACTERISTICS.ACTIVE_CONSUMER'), value: 'active_consumer', width: '25%' },
                  { label: t('FIELDS.MARKET_SUPPORT_SCHEME'), value: 'support_scheme', width: '25%' },
                  { label: t('FIELDS.NOTE'), value: 'details', width: '25%' }
                ]}
              />
            ))
          ) : (
            <NotResultRow span={columns.length} text={t('NO_DATA')} />
          )}
        </TableBody>
      </StyledTable>
      <Pagination {...data} params={params} loading={isFetching} onPaginate={(p) => setParams({ ...params, ...p })} />
    </Page>
  );
};

export default BsusAggregatedGroup;
