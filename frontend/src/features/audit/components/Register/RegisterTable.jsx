import { StyledTable } from '../../../../Components/Theme/Table/StyledTable';
import { TableBody, TableRow } from '@mui/material';
import TableHeadCell from '../../../../Components/Tables/TableHeadCell';
import { useTranslation } from 'react-i18next';
import SearchField from '../../../../Components/Tables/SearchField';
import SearchDate from '../../../../Components/Tables/SearchDate';
import React from 'react';
import TableSelect from '../../../../Components/Tables/TableSelect';
import NotResultRow from '../../../../Components/Theme/Table/NotResultRow';
import { useDispatch } from 'react-redux';
import TableCell from '@mui/material/TableCell';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import { AUDIT_COMPLETION, AUDIT_NOTICE, AUDIT_STATUSES, AUDIT_TYPES } from '../../data';
import { onChangeTableFilters, useAuditTableFilters } from '../../slice';
import StickyTableHead from '../../../../Components/Theme/Table/StickyTableHead';

const RegisterTable = ({ list = [] }) => {
  const { t } = useTranslation();
  const { name, status, eic_x, usreou, audit_type, city, date_start, notice, completion } = useAuditTableFilters();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <StyledTable>
      <StickyTableHead>
        <TableRow>
          <TableHeadCell title={t('FIELDS.SHORT_PPKO_NAME')}>
            <SearchField name={'name'} initValue={name || ''} onSearch={(v) => dispatch(onChangeTableFilters(v))} />
          </TableHeadCell>
          <TableHeadCell title={t('FIELDS.AUDIT_STATE')}>
            <TableSelect
              value={status}
              data={AUDIT_STATUSES}
              id={'status'}
              onChange={(id, value) => dispatch(onChangeTableFilters({ [id]: value || undefined }))}
              ignoreI18={false}
            />
          </TableHeadCell>
          <TableHeadCell title={t('FIELDS.EIC')}>
            <SearchField name={'eic_x'} initValue={eic_x || ''} onSearch={(v) => dispatch(onChangeTableFilters(v))} />
          </TableHeadCell>
          <TableHeadCell title={t('FIELDS.COMPANY_USREOU')}>
            <SearchField name={'usreou'} initValue={usreou || ''} onSearch={(v) => dispatch(onChangeTableFilters(v))} />
          </TableHeadCell>
          <TableHeadCell title={t('FIELDS.AUDIT_TYPE')}>
            <TableSelect
              value={audit_type}
              data={AUDIT_TYPES}
              id={'audit_type'}
              onChange={(id, value) => dispatch(onChangeTableFilters({ [id]: value || undefined }))}
              ignoreI18={false}
            />
          </TableHeadCell>
          <TableHeadCell title={t('FIELDS.CITY')}>
            <SearchField name={'city'} initValue={city || ''} onSearch={(v) => dispatch(onChangeTableFilters(v))} />
          </TableHeadCell>
          <TableHeadCell title={t('FIELDS.AUDIT_DATE')}>
            <SearchDate
              onSearch={(id, date) => dispatch(onChangeTableFilters({ [id]: date || undefined }))}
              column={{ id: 'date_start' }}
              formatDate={'YYYY-MM-DD'}
              value={date_start}
            />
          </TableHeadCell>
          <TableHeadCell title={t('FIELDS.AUDIT_NOTIFICATION')}>
            <TableSelect
              value={notice}
              data={AUDIT_NOTICE}
              ignoreI18={false}
              id={'notice'}
              onChange={(id, value) => dispatch(onChangeTableFilters({ [id]: value || undefined }))}
            />
          </TableHeadCell>
          <TableHeadCell title={t('FIELDS.AUDIT_NOTIFICATION_STATE')}>
            <TableSelect
              value={completion}
              data={AUDIT_COMPLETION}
              ignoreI18={false}
              id={'completion'}
              onChange={(id, value) => dispatch(onChangeTableFilters({ [id]: value || undefined }))}
            />
          </TableHeadCell>
        </TableRow>
      </StickyTableHead>
      <TableBody>
        {list.length === 0 && <NotResultRow span={9} text={t('NO_PPKO')} />}
        {list.map((i) => (
          <TableRow key={i.uid} className="body__table-row" hover onClick={() => navigate(i.uid)}>
            <TableCell data-marker={'name'}>{i?.name}</TableCell>
            <TableCell data-marker={'status'}>{i?.status && t(`AUDIT_STATUSES.${i.status}`)}</TableCell>
            <TableCell data-marker={'eic_x'}>{i?.eic_x}</TableCell>
            <TableCell data-marker={'usreou'}>{i?.usreou}</TableCell>
            <TableCell data-marker={'audit_type'}>{i?.audit_type && t(`AUDIT_TYPES.${i.audit_type}`)}</TableCell>
            <TableCell data-marker={'city'}>{i?.city}</TableCell>
            <TableCell data-marker={'date_start'}>{moment(i?.date_start).format('DD.MM.YYYY')}</TableCell>
            <TableCell data-marker={'notice'}>{i?.notice && t(`CONTROLS.${i.notice}`)}</TableCell>
            <TableCell data-marker={'completion'}>{i?.completion && t(`AUDIT_COMPLETION.${i.completion}`)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </StyledTable>
  );
};

export default RegisterTable;
