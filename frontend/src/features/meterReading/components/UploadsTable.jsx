import { StyledTable } from '../../../Components/Theme/Table/StyledTable';
import TableRow from '@mui/material/TableRow';
import SearchField from '../../../Components/Tables/SearchField';
import SearchDate from '../../../Components/Tables/SearchDate';
import Filter from '../../../Components/Theme/Table/Filter';
import Grid from '@mui/material/Grid';
import FormInput from '../../../Forms/fields/FormInput';
import TableBody from '@mui/material/TableBody';
import NotResultRow from '../../../Components/Theme/Table/NotResultRow';
import React from 'react';
import { useTranslation } from 'react-i18next';
import TableCell from '@mui/material/TableCell';
import UploadsTableRow from './UploadsTableRow';
import TableSelect from '../../../Components/Tables/TableSelect';
import StickyTableHead from '../../../Components/Theme/Table/StickyTableHead';
import TableAutocomplete from '../../../Components/Tables/TableAutocomplete';
import FormAsyncAutocomplete from '../../../Forms/fields/FormAsyncAutocomplete';

const columns = [
  { title: 'FIELDS.EIC_X_METER_DATA_COLLECTOR', key: 'company_from_eic', width: 240 },
  { title: 'FIELDS.METER_DATA_COLLECTOR_NAME', key: 'company_from_eic_by_name', width: 240 },
  { title: 'FIELDS.EIC_CODE_TYPE_Z', key: 'ap_eic', width: 240 },
  { title: 'FIELDS.DATE_OF_UPLOADING_METER_READINGS', key: 'created_at', width: 240 },
  { title: 'FIELDS.METER_READING_DATE', key: 'meter_reading_date', width: 240 },
  { title: 'FIELDS.FILENAME', key: 'filename' }
];

const UploadsTable = ({ data, params, setParams }) => {
  const { t } = useTranslation();
  const list = data?.data || [];

  const handleFilter = (filters) => {
    const additionalFilters = {
      company_to_eic_by_name: filters?.company_to_eic_by_name?.value || undefined,
      company_to_eic: filters?.company_to_eic || undefined
    };
    setParams({ ...params, ...additionalFilters, page: 1 });
  };

  return (
    <StyledTable spacing={0}>
      <StickyTableHead>
        <TableRow>
          <Filter name={'meter-reading-view'} onChange={handleFilter} unmount>
            <Grid item xs={12}>
              <FormInput label={t('FIELDS.EIC_CODE_X_OF_THE_ADDRESSEE')} name={'company_to_eic'} />
            </Grid>
            <Grid item xs={12}>
              <FormAsyncAutocomplete
                apiPath={'publicCompaniesList'}
                searchBy={'name'}
                searchStart={1}
                mapOptions={(data) => data.map((i) => ({ label: i?.short_name ?? i.full_name, value: i.eic }))}
                label={t('FIELDS.RECIPIENT_COMPANY_NAME')}
                name={'company_to_eic_by_name'}
                form_name={'meter-reading-view'}
              />
            </Grid>
          </Filter>
          {columns.map(({ title, key, ...styles }) => (
            <TableCell key={key} className={'MuiTableCell-head'} style={{ ...styles }}>
              <p>{t(title)}</p>
              {key === 'created_at' || key === 'meter_reading_date' ? (
                <SearchDate
                  onSearch={(id, date) => setParams({ ...params, [id]: date || undefined, page: 1 })}
                  column={{ id: key }}
                  formatDate={'YYYY-MM-DD'}
                />
              ) : key === 'company_from_eic_by_name' ? (
                <TableAutocomplete
                  onSelect={(v) => setParams({ ...params, [key]: v?.value || undefined, page: 1 })}
                  apiPath={'publicCompaniesList'}
                  defaultValue={params[key]?.label}
                  dataMarker={key}
                  searchBy={'name'}
                  mapOptions={(data) => data.map((i) => ({ label: i?.short_name ?? i.full_name, value: i.eic }))}
                  searchStart={1}
                  filterOptions={(items) => items}
                />
              ) : (
                <SearchField type={'text'} name={key} onSearch={(i) => setParams({ ...params, ...i, page: 1 })} />
              )}
            </TableCell>
          ))}
          <TableCell className={'MuiTableCell-head'} style={{ width: 180 }}>
            <p>{t('FIELDS.FILE_RETURN_CODES')}</p>
            <TableSelect
              id={'status'}
              value={params.status || ''}
              data={[
                { value: 'DONE', label: t('SUCCESSFULLY') },
                { value: 'FAILED', label: t('UNSUCCESS') }
              ]}
              onChange={(id, value) => setParams({ ...params, [id]: value || undefined, page: 1 })}
            />
          </TableCell>
          <TableCell style={{ width: 80 }} />
        </TableRow>
        <TableRow style={{ height: 8 }}></TableRow>
      </StickyTableHead>
      <TableBody>
        {list.length === 0 && <NotResultRow span={7} text={t('NO_DATA')} />}
        {list.map((point) => (
          <UploadsTableRow key={`row-${point.uid}`} data={point} />
        ))}
      </TableBody>
    </StyledTable>
  );
};

export default UploadsTable;
