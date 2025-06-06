import { useTranslation } from 'react-i18next';
import { useCompanyHistoryQuery, useCompanyHistorySettingsQuery } from './api';
import Page from '../../../Global/Page';
import { useMemo, useRef, useState } from 'react';
import { Pagination } from '../../../Theme/Table/Pagination';
import { StyledTable } from '../../../Theme/Table/StyledTable';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import NotResultRow from '../../../Theme/Table/NotResultRow';
import TableSelect from '../../../Tables/TableSelect';
import moment from 'moment';
import { useLocation, useParams } from 'react-router-dom';
import SearchDate from '../../../Tables/SearchDate';
import StickyTableHead from '../../../Theme/Table/StickyTableHead';

const columns = [
  { key: 'created_at', label: 'FIELDS.DATE', width: 120 },
  { key: 'group', label: 'FIELDS.CHARACTERISTICS_GROUP', width: 200 },
  { key: 'property_name', label: 'FIELDS.CHARACTERISTIC_NAME', width: 200 },
  { key: 'previous_value', label: 'FIELDS.VALUE_BEFORE_CHANGES' },
  { key: 'current_value', label: 'FIELDS.VALUE_AFTER_CHANGES' }
];

const CompanyHistory = () => {
  const { t, i18n } = useTranslation();
  const { uid } = useParams();
  const { state } = useLocation();

  const timeout = useRef(null);
  const [search, setSearch] = useState(columns.map((i) => ({ [i.key]: '' })));
  const [params, setParams] = useState({ page: 1, size: 25, group: state?.type ?? undefined });
  const { data: settings, isLoading, isSuccess } = useCompanyHistorySettingsQuery();
  const { data, isFetching } = useCompanyHistoryQuery({ uid, params });

  const properties = useMemo(() => {
    let result = settings?.property_name || [];
    if (params?.group) result = result.filter((i) => i.group === params.group);
    return result.map((i) => ({ value: i.code, label: i[`name_${i18n.language}`] }));
  }, [i18n.language, params?.group, settings?.property_name]);

  const onSearch = (key, value) => {
    setSearch({ ...search, [key]: value });
    clearTimeout(timeout.current);
    timeout.current = setTimeout(() => {
      setParams((p) => ({ ...p, [key]: value, page: 1 }));
    }, 500);
  };

  const getSearch = (key) => {
    switch (key) {
      case 'created_at':
        return (
          <SearchDate
            onSearch={(_, value) => setParams({ ...params, [key]: value || undefined })}
            formatDate={'YYYY-MM-DD'}
          />
        );
      case 'group':
        return (
          <TableSelect
            value={isSuccess ? params[key] || '' : ''}
            data={settings?.[key]?.map((i) => ({ value: i.code, label: i[`name_${i18n.language}`] }))}
            id={key}
            onChange={(key, value) => {
              setParams({ ...params, group: value || undefined, property_name: undefined });
            }}
          />
        );
      case 'property_name':
        return (
          <TableSelect
            value={params[key] || ''}
            data={properties}
            id={key}
            onChange={(key, value) => {
              setParams({ ...params, [key]: value || undefined });
            }}
          />
        );
      default:
        return <input type={'text'} value={search[key] || ''} onChange={({ target }) => onSearch(key, target.value)} />;
    }
  };

  return (
    <Page
      pageName={t('PAGES.HISTORY_OF_CHARACTERISTIC_CHANGES')}
      backRoute={`/directories/companies/${uid}`}
      loading={isFetching || isLoading}
      acceptPermisions={'DIRECTORIES.COMPANIES.ACCESS'}
      acceptRoles={['АКО', 'АКО_Процеси', 'АКО_Довідники', 'АКО_ППКО', 'АКО_Користувачі', 'АКО_Суперечки']}
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
              <TableRow key={i?.property_name + index} data-marker="table-row" className="body__table-row">
                {columns.map(({ key }) => (
                  <TableCell key={key} data-marker={key}>
                    {key === 'created_at' ? (i[key] ? moment(i[key]).format('DD.MM.YYYY') : '---') : i[key]}
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

export default CompanyHistory;
