import { StyledTable } from '../../Components/Theme/Table/StyledTable';
import { TableBody, TableRow } from '@mui/material';
import TableCell from '@mui/material/TableCell';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import NotResultRow from '../../Components/Theme/Table/NotResultRow';
import CircleButton from '../../Components/Theme/Buttons/CircleButton';
import moment from 'moment';
import SearchField from '../../Components/Tables/SearchField';
import TableSelect from '../../Components/Tables/TableSelect';
import { COMPARE_CODES, ROLES } from '../../util/directories';
import TableHeadCell from '../../Components/Tables/TableHeadCell';
import TableAutocomplete from '../../Components/Tables/TableAutocomplete';
import { linkByProcessName } from '../../util/linkByProcessName';
import { useLazyMsFilesDownloadQuery } from '../../app/mainApi';
import { useEventsInitQuery } from './api';
import DatePicker from '../../Components/Theme/Fields/DatePicker';
import { useRegTabStyles } from '../pm/filterStyles';
import StickyTableHead from '../../Components/Theme/Table/StickyTableHead';

const ActionsLogTable = ({ list = [], onSearch, params }) => {
  const { t, i18n } = useTranslation();
  const classes = useRegTabStyles();
  const { data: options, isFetching } = useEventsInitQuery();
  const [downloadFile] = useLazyMsFilesDownloadQuery();
  const [errorText, setErrorText] = useState('');

  const ROLES_OPTOINS = useMemo(() => {
    return Object.keys(ROLES)
      .map((key) => ({ value: key, label: t(`ROLES.${key.replaceAll(' ', '_')}`) }))
      .sort((a, b) => a.label.localeCompare(b.label, COMPARE_CODES[i18n.language]));
  }, [t]);

  const handleDownload = (file) => downloadFile({ id: file.uid, name: file.name });

  const getLink = (row) => {
    if (row?.process) {
      const link = linkByProcessName({
        uid: row?.process?.uid,
        status: row?.process?.status,
        subprocess_name: row?.process?.name
      });
      return <CircleButton type={'link'} size={'small'} onClick={() => window.open(link, '_blank')} />;
    }
    if (row?.file) {
      return <CircleButton type={'download'} size={'small'} onClick={() => handleDownload(row?.file)} />;
    }
    if (row?.ap) {
      return <CircleButton type={'link'} size={'small'} onClick={() => window.open(`/tko/${row.ap.uid}`, '_blank')} />;
    }
    return (
      <CircleButton
        disabled={!row.referer}
        type={'link'}
        size={'small'}
        onClick={() => window.open(row.referer, '_blank')}
      />
    );
  };

  const handleOnDateChange = (id, value) => {
    if (!value) {
      onSearch({ [id]: null });
      setErrorText(t('VERIFY_MSG.UNCORRECT_DATE'));
      return;
    }
    const date = moment(value);
    if (date.isValid() && date.isBetween(moment(params.period_from), moment(params.period_to), 'days', '[]')) {
      onSearch({ [id]: date.format() });
      setErrorText('');
    } else {
      setErrorText(t('VERIFY_MSG.UNCORRECT_DATE'));
    }
  };

  return (
    <StyledTable>
      <StickyTableHead>
        <TableRow data-marker={'table-header-row'}>
          <TableHeadCell title={t('FIELDS.DATE_TIME')} width={150}>
            <div className={classes.picker || ''}>
              <DatePicker
                value={params['created_at']}
                onChange={(date) => handleOnDateChange('created_at', date)}
                minDate={params.period_from}
                maxDate={params.period_to}
                error={errorText}
              />
            </div>
          </TableHeadCell>
          <TableHeadCell title={t('FIELDS.USER_FULL_NAME')} width={200}>
            <TableAutocomplete
              onSelect={(v) => onSearch({ user: v?.value })}
              apiPath={'usersList'}
              searchBy={'full_name'}
              dataMarker={'user'}
              mapOptions={(data) => data.map((i) => ({ label: i.full_name, value: i.full_name }))}
              searchStart={3}
              filterOptions={(items) => items}
            />
          </TableHeadCell>
          <TableHeadCell title={t('FIELDS.ORGANIZATION')}>
            <TableAutocomplete
              onSelect={(v) => onSearch({ company: v?.value })}
              apiPath={'publicCompaniesList'}
              searchBy={'name'}
              dataMarker={'company'}
              mapOptions={(data) => data.map((i) => ({ label: i.short_name, value: i.eic }))}
              searchStart={3}
              filterOptions={(items) => items}
            />
          </TableHeadCell>
          <TableHeadCell title={t('FIELDS.SECTION_PROCESS')} width={300}>
            <TableSelect
              onChange={(id, v) => onSearch({ [id]: v })}
              id={'tag'}
              loading={isFetching}
              value={params.tag}
              data={options?.tags || []}
            />
          </TableHeadCell>
          <TableHeadCell title={t('FIELDS.ID')} width={120}>
            <SearchField name={'id'} onSearch={onSearch} isInt />
          </TableHeadCell>
          <TableHeadCell title={t('FIELDS.ROLE')} width={120}>
            <TableSelect
              value={params['role'] || null}
              data={ROLES_OPTOINS}
              onChange={(id, v) => onSearch({ [id]: v })}
              id={'role'}
            />
          </TableHeadCell>
          <TableHeadCell title={t('FIELDS.ACTION_TYPE')} width={120}>
            <TableSelect
              value={params['action'] || null}
              loading={isFetching}
              data={options?.actions || []}
              onChange={(id, v) => onSearch({ [id]: v })}
              id={'action'}
            />
          </TableHeadCell>
          <TableHeadCell title={t('FIELDS.LINK')} width={120} align={'center'} />
        </TableRow>
      </StickyTableHead>
      <TableBody>
        {list.map((data, index) => (
          <TableRow key={index} className="body__table-row" data-marker={'table-row'}>
            <TableCell data-marker={'created_at'}>
              {data?.created_at ? moment(data.created_at).format('DD.MM.yyyy • HH:mm') : '-'}
            </TableCell>
            <TableCell data-marker={'user'}>{data?.user || '-'}</TableCell>
            <TableCell data-marker={'company'}>{data?.company || '-'}</TableCell>
            <TableCell data-marker={'tag'}>{data?.tag || '-'}</TableCell>
            <TableCell data-marker={'process_id'}>{data?.process?.id || '-'}</TableCell>
            <TableCell data-marker={'role'}>
              {data?.role ? t(`ROLES.${data.role.replaceAll(' ', '_')}`) : '-'}
            </TableCell>
            <TableCell data-marker={'action'}>{data?.action || '-'}</TableCell>
            <TableCell align={'center'} data-marker={'link'}>
              {getLink(data)}
            </TableCell>
          </TableRow>
        ))}
        {list.length === 0 && <NotResultRow span={8} text={t('NO_DATA')} />}
      </TableBody>
    </StyledTable>
  );
};

export default ActionsLogTable;
