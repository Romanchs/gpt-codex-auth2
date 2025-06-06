import Page from '../../../Global/Page';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyledTable } from '../../../Theme/Table/StyledTable';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import { TableCell } from '@mui/material';
import { Pagination } from '../../../Theme/Table/Pagination';
import NotResultRow from '../../../Theme/Table/NotResultRow';
import {
  useZBindingDirectoryQuery,
  useLazyZBindingDirectoryExportQuery,
  useReferenceBookSubTypeQuery,
  useReferenceBookTypePointQuery
} from './api';
import CircleButton from '../../../Theme/Buttons/CircleButton';
import moment from 'moment';
import { useRef } from 'react';
import TableDatePicker from '../../../Tables/TableDatePicker';
import TableSelect from '../../../Tables/TableSelect';
import StickyTableHead from '../../../Theme/Table/StickyTableHead';

const columns = [
  { key: 'valid_from', label: 'FIELDS.BINDING_DATE' },
  { key: 'valid_to', label: 'FIELDS.UNBINDING_DATE' },
  { key: 'eic_z', label: 'FIELDS.EIC_TKO_Z' },
  { key: 'eic_zv', label: 'FIELDS.EIC_TKO_ZV' },
  { key: 'grid_customer_id', label: 'FIELDS.GRID_CUSTOMER_ID' },
  { key: 'balance_supplier_eic', label: 'FIELDS.BALANCE_SUPPLIER_EIC' },
  { key: 'ap_type', label: 'FIELDS.POINT_TYPE' },
  { key: 'eic_w', label: 'FIELDS.EIC_W' },
  { key: 'eic_x_w', label: 'FIELDS.EIC_X_W' },
  { key: 'sub_type', label: 'FIELDS.AP_TYPE' }
];

const ZBinding = () => {
  const { t } = useTranslation();
  const timeout = useRef(null);
  const [params, setParams] = useState({ page: 1, size: 25 });
  const [search, setSearch] = useState(columns.map((i) => ({ [i.key]: '' })));
  const { data, isFetching } = useZBindingDirectoryQuery(params);
  const [download, { isLoading }] = useLazyZBindingDirectoryExportQuery();
  const { data: subTypeData } = useReferenceBookSubTypeQuery();
  const { data: typePointData } = useReferenceBookTypePointQuery();

  const getValue = (key, value) => {
    if (key === 'valid_from' || key === 'valid_to') {
      return moment(value).format('DD.MM.YYYY');
    }
    return value;
  };

  const onSearch = (key, value) => {
    setSearch({ ...search, [key]: value });
    clearTimeout(timeout.current);
    timeout.current = setTimeout(() => {
      setParams((p) => {
        const updatedParams = { ...p };
        if (value === null || value === undefined) {
          delete updatedParams[key];
        } else if (key === 'valid_from' || key === 'valid_to') {
          if (moment(value, 'YYYY-MM-DD', true).isValid()) {
            updatedParams[key] = moment(value).format('YYYY-MM-DD');
          }
        } else {
          updatedParams[key] = value;
        }
        return updatedParams;
      });
    }, 500);
  };

  const getSearch = (key) => {
    if (key === 'valid_from' || key === 'valid_to') {
      return <TableDatePicker id={key} value={search[key]} onChange={(value) => onSearch(key, value)} />;
    }
    if (key === 'sub_type') {
      return (
        <TableSelect
          value={search[key]}
          id={key}
          data={(subTypeData && Object.entries(subTypeData).map(([key, value]) => ({ label: key, value }))) || []}
          onChange={(e, value) => {
            onSearch(e, value || undefined);
          }}
        />
      );
    }
    if (key === 'ap_type') {
      return (
        <TableSelect
          value={search[key]}
          id={key}
          data={(typePointData && Object.entries(typePointData).map(([key, value]) => ({ label: key, value }))) || []}
          onChange={(e, value) => {
            onSearch(e, value || undefined);
          }}
        />
      );
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
      pageName={t('PAGES.Z_BINDING')}
      backRoute={'/directories'}
      loading={isFetching || isLoading}
      acceptPermisions={'DIRECTORIES.Z_BINDING.ACCESS'}
      acceptRoles={['АКО_Процеси', 'АКО_Довідники', 'АКО/АР_ZV']}
      controls={
        <CircleButton
          onClick={() => download(params)}
          type={'download'}
          title={t('CONTROLS.DOWNLOAD_DIRECTORY')}
          disabled={isLoading}
        />
      }
    >
      <StyledTable>
        <StickyTableHead>
          <TableRow>
            {columns.map(({ key, label, width = 'auto' }) => (
              <TableCell key={key} sx={{ width }} className={'MuiTableCell-head'}>
                <p>{t(label)}</p>
                {getSearch(key)}
              </TableCell>
            ))}
          </TableRow>
        </StickyTableHead>
        <TableBody>
          {data?.data?.length > 0 ? (
            data.data.map((i, index) => (
              <TableRow key={index} data-marker="table-row" className="body__table-row">
                {columns.map(({ key }) => (
                  <TableCell key={key} data-marker={key}>
                    {getValue(key, i[key])}
                  </TableCell>
                ))}
              </TableRow>
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

export default ZBinding;
