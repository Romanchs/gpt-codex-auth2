import React, { useState } from 'react';
import { StyledTable } from '../../Components/Theme/Table/StyledTable';
import StickyTableHead from '../../Components/Theme/Table/StickyTableHead';
import TableRow from '@material-ui/core/TableRow';
import { TableCell } from '@material-ui/core';
import TableBody from '@material-ui/core/TableBody';
import NotResultRow from '../../Components/Theme/Table/NotResultRow';
import { Pagination } from '../../Components/Theme/Table/Pagination';
import { useTranslation } from 'react-i18next';
import SearchDate from '../../Components/Tables/SearchDate';
import SearchField from '../../Components/Tables/SearchField';
import { checkPermissions } from '../../util/verifyRole';
import { useTermsFiltersQuery, useTermsQuery } from './api';
import TableSelect from '../../Components/Tables/TableSelect';
import { monthData } from '../reports/data';
import moment from 'moment/moment';
import { LightTooltip } from '../../Components/Theme/Components/LightTooltip';

const COLUMNS = [
  { key: 'certification_date', label: 'FIELDS.DATE', width: 120 },
  { key: 'reporting_month', label: 'FIELDS.MONTH', width: 120 },
  { key: 'reporting_year', label: 'FIELDS.YEAR', width: 100 },
  { key: 'version', label: 'FIELDS.VERSION_CERT_CMD', width: 130 },
  { key: 'certification_update_date', label: 'FIELDS.DATE_CERT_CMD', width: 200 },
  { key: 'event_description', label: 'FIELDS.EVENT', width: 300, forAKO: true },
  { key: 'notified_ar', label: 'FIELDS.AR_MESSAGE', width: 100 },
  { key: 'ts_reception_date', label: 'FIELDS.CMD_RECEIVED_DATE', width: 120 },
  { key: 'author', label: 'FIELDS.USER', width: 150, forAKO: true },
  { key: 'note', label: 'FIELDS.NOTE', width: 300, forAKO: true }
];

const MAX_NOTE_SIMBOLS = 20;

const Terms = () => {
  const { t } = useTranslation();
  const [params, setParams] = useState({ page: 1, size: 25 });
  const { currentData: filters, isFetching: isFetchingFilters } = useTermsFiltersQuery();
  const { isFetching, currentData } = useTermsQuery(params);

  const columns =
    COLUMNS.filter((c) => checkPermissions('PUBLICATION_CMD.TABS.FILES', ['АКО_Процеси']) || !c.forAKO) || [];

  const getSearch = (key) => {
    switch (key) {
      case 'certification_date':
      case 'certification_update_date':
      case 'ts_reception_date':
        return (
          <SearchDate
            onSearch={(id, date) => setParams({ ...params, [id]: date || undefined, page: 1 })}
            column={{ id: key }}
            formatDate={'YYYY-MM-DD'}
          />
        );
      case 'reporting_month':
        return (
          <TableSelect
            minWidth={100}
            onChange={(id, v) => setParams({ ...params, [id]: v || undefined, page: 1})}
            id={key}
            loading={false}
            value={params?.[key] || ''}
            withAll
            ignoreI18={false}
            data={monthData || []}
          />
        )
      case 'reporting_year':
      case 'author':
      case 'version':
        return (
          <TableSelect
            minWidth={key === 'reporting_year' ? 80 : 120}
            onChange={(id, v) => setParams({ ...params, [id]: v || undefined, page: 1 })}
            id={key}
            loading={isFetchingFilters}
            value={params?.[key] || ''}
            withAll
            data={filters?.[key + 's'] || []}
          />
        );
      default:
        return <SearchField type={'text'} name={key} onSearch={(i) => setParams({ ...params, ...i, page: 1 })} />;
    }
  };

  const getField = (item, key) => {
    switch (key) {
      case 'certification_date':
      case 'certification_update_date':
      case 'ts_reception_date':
        return moment(item[key]).format('DD.MM.YYYY');
      case 'reporting_month':{
        return t(monthData.find((i) => i.value === item[key])?.label) || '-';
      }
      case 'event_description':
      case 'note':
        return (
          <LightTooltip
            title={item[key]}
            arrow
            disableTouchListener
            disableFocusListener
            data-marker={'tooltip'}
            disableHoverListener={!item[key] || item[key]?.length <= MAX_NOTE_SIMBOLS}
          >
            <span>{!item[key] || item[key]?.length <= MAX_NOTE_SIMBOLS ? item[key] : item[key]?.slice(0, MAX_NOTE_SIMBOLS) + '...'}</span>
          </LightTooltip>
        );
      default:
        return item[key];
    }
  };

  return (
    <>
      <StyledTable>
        <StickyTableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell className={'MuiTableCell-head'} key={column.key} sx={{ minWidth: column.width }}>
                <p>{t(column.label)}</p>
                {getSearch(column.key)}
              </TableCell>
            ))}
          </TableRow>
        </StickyTableHead>
        <TableBody>
          {!currentData?.data?.length ? (
            <NotResultRow text={t('NO_DATA')} span={10} small />
          ) : (
            currentData?.data?.map((i) => (
              <TableRow key={i?.id} data-marker="table-row" className="body__table-row">
                {columns.map(({ key }) => (
                  <TableCell key={key}>{getField(i, key)}</TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </StyledTable>
      {currentData?.data?.length > 0 && (
        <Pagination
          {...currentData}
          loading={isFetching}
          params={params}
          onPaginate={(v) => setParams({ ...params, ...v })}
        />
      )}
    </>
  );
};

export default Terms;
