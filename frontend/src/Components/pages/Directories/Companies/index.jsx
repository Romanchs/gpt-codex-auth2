import Page from '../../../Global/Page';
import { useTranslation } from 'react-i18next';
import { useCompaniesDirectoryQuery, useCompaniesSettingsQuery } from './api';
import { useRef, useState } from 'react';
import { StyledTable } from '../../../Theme/Table/StyledTable';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import TableSelect from '../../../Tables/TableSelect';
import { Pagination } from '../../../Theme/Table/Pagination';
import NotResultRow from '../../../Theme/Table/NotResultRow';
import { useNavigate } from 'react-router-dom';
import StickyTableHead from '../../../Theme/Table/StickyTableHead';

const columns = [
  { key: 'usreou', label: 'FIELDS.USREOU', width: 110 },
  { key: 'eic', label: 'FIELDS.EIC', width: 160 },
  { key: 'short_name', label: 'FIELDS.SHORT_NAME_OF_COMPANY' },
  { key: 'activity_type', label: 'FIELDS.ACTIVITY_TYPE' },
  { key: 'contract_status', label: 'FIELDS.CONTRACT_STATUS' }
];

const SELECTS = ['activity_type', 'contract_status'];

const Companies = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const timeout = useRef(null);
  const [search, setSearch] = useState(columns.map((i) => ({ [i.key]: '' })));
  const [params, setParams] = useState({ page: 1, size: 25 });
  const { data: settings, isLoading } = useCompaniesSettingsQuery();
  const { data, isFetching } = useCompaniesDirectoryQuery(params);

  const handleClickByRow = (uid) => () => {
    if (window.getSelection().toString()) return;
    navigate(`/directories/companies/${uid}`);
  };

  const onSearch = (key, value) => {
    setSearch({ ...search, [key]: value });
    if (SELECTS.includes(key)) {
      setParams((p) => ({ ...p, [key]: value }));
      return;
    }
    clearTimeout(timeout.current);
    timeout.current = setTimeout(() => {
      setParams((p) => ({ ...p, [key]: value }));
    }, 500);
  };

  const getSearch = (key) => {
    if (SELECTS.includes(key)) {
      return (
        <TableSelect
          value={search[key] || ''}
          data={settings?.[key].map((i) => ({ value: i.code, label: i[`name_${i18n.language}`] })) ?? []}
          id={key}
          onChange={(key, value) => {
            onSearch(key, value || undefined);
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
      pageName={t('PAGES.COMPANIES_DIRECTORY')}
      backRoute={'/directories'}
      loading={isFetching || isLoading}
      acceptPermisions={'DIRECTORIES.COMPANIES.ACCESS'}
      acceptRoles={['АКО', 'АКО_Процеси', 'АКО_Довідники', 'АКО_ППКО', 'АКО_Користувачі', 'АКО_Суперечки', 'ГапПок']}
      // controls={
      //   checkPermissions('DIRECTORIES.COMPANIES.CONTROLS.DOWNLOAD', 'АКО_Довідники') && (
      //     <CircleButton
      //       onClick={handleDownload}
      //       type={'download'}
      //       title={t('CONTROLS.DOWNLOAD_DIRECTORY')}
      //       disabled={downloading}
      //     />
      //   )
      // }
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
            data.data.map((i) => (
              <TableRow
                key={i.uid}
                data-marker="table-row"
                className="body__table-row"
                hover
                onClick={handleClickByRow(i.uid)}
              >
                {columns.map(({ key }) => (
                  <TableCell key={key} data-marker={key}>
                    {key === 'activity_type' ? i[key]?.map((t) => <p key={t}>{t}</p>) : i[key]}
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

export default Companies;
