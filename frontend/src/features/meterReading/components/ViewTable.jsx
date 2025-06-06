import { StyledTable } from '../../../Components/Theme/Table/StyledTable';
import TableRow from '@mui/material/TableRow';
import SearchField from '../../../Components/Tables/SearchField';
import SearchDate from '../../../Components/Tables/SearchDate';
import Filter from '../../../Components/Theme/Table/Filter';
import Grid from '@mui/material/Grid';
import FormInput from '../../../Forms/fields/FormInput';
import TableBody from '@mui/material/TableBody';
import NotResultRow from '../../../Components/Theme/Table/NotResultRow';
import React, { useMemo, useState } from 'react';
import ViewTableRow from './ViewTableRow';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import TableCell from '@mui/material/TableCell';
import Checkbox from '@mui/material/Checkbox';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import TaskAltRoundedIcon from '@mui/icons-material/TaskAltRounded';
import { setSelectedMany, setUnselected } from '../slice';
import useSearchLog from '../../../services/actionsLog/useSearchLog';
import { ViewTableFilter } from './ViewTableFilter';
import { checkPermissions } from '../../../util/verifyRole';
import StickyTableHead from '../../../Components/Theme/Table/StickyTableHead';
import TableAutocomplete from '../../../Components/Tables/TableAutocomplete';
import FormAsyncAutocomplete from '../../../Forms/fields/FormAsyncAutocomplete';

const columns = [
  { title: 'FIELDS.EIC_X_METER_DATA_COLLECTOR', key: 'company_from_eic', width: 240 },
  { title: 'FIELDS.METER_DATA_COLLECTOR_NAME', key: 'company_from_eic_by_name' },
  { title: 'FIELDS.EIC_CODE_TYPE_Z', key: 'ap_eic', width: 240 },
  { title: 'FIELDS.DATE_OF_UPLOADING_METER_READINGS', key: 'created_at', width: 240 },
  { title: 'FIELDS.METER_READING_DATE', key: 'meter_reading_date', width: 240 },
  { title: 'FIELDS.FILENAME', key: 'filename' }
];

const ViewTable = ({ data, params, setParams }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const selected = useSelector((store) => store.meterReading.selected);
  const [showAll, setShowAll] = useState(false);
  const list = data?.data || [];
  const selectedCount = selected.length.toString();
  const logSearch = useSearchLog();

  const selectedAll = useMemo(() => {
    if (list.length === 0 || selected.length < list.length) return false;
    return !list.find((i) => !selected.includes(i.uid));
  }, [selected, list]);

  const handleFilter = (filters) => {
    const additionalFilters = {
      company_to_eic_by_name: filters?.company_to_eic_by_name?.value || undefined,
      company_to_eic: filters?.company_to_eic || undefined
    };
    setParams({ ...params, ...additionalFilters, page: 1 });
    logSearch();
  };

  const handleChangeDate = (id, date) => {
    setParams({ ...params, [id]: date || undefined, page: 1 });
    logSearch();
  };

  const handleSearch = (i) => {
    setParams({ ...params, ...i, page: 1 });
    logSearch();
  };

  const onSearch = (id, value) => {
    setParams({ ...params, [id]: value, page: 1 });
    logSearch();
  };

  return (
    <>
      {checkPermissions('METER_READING.VIEW_DATA.FUNCTIONS.FILTERS', ['СВБ']) && (
        <ViewTableFilter handleApply={handleSearch} />
      )}
      <StyledTable spacing={0}>
        <StickyTableHead>
          <TableRow>
            <TableCell
              className={'MuiTableCell-head'}
              style={{ width: 75 }}
              data-marker={showAll ? 'showAll' : 'selected'}
              align={'center'}
              onMouseOver={() => setShowAll(true)}
              onMouseLeave={() => setShowAll(false)}
            >
              <p>{t(showAll ? 'ALL' : 'SELECTED')}</p>
              {showAll ? (
                <Checkbox
                  sx={{ py: 1 }}
                  icon={<RadioButtonUncheckedIcon sx={{ fill: '#fff' }} />}
                  checkedIcon={<TaskAltRoundedIcon color={'orange'} />}
                  checked={selectedAll}
                  onChange={() => dispatch(selectedAll ? setUnselected(list) : setSelectedMany(list))}
                  data-marker={'checkbox--all'}
                  data-status={selectedAll ? 'active' : 'inactive'}
                />
              ) : (
                <input style={{ textAlign: 'center' }} value={selectedCount} readOnly onChange={() => null} />
              )}
            </TableCell>
            {columns.map(({ title, key, ...styles }) => (
              <TableCell key={key} className={'MuiTableCell-head'} style={{ ...styles }}>
                <p>{t(title)}</p>
                {key === 'created_at' || key === 'meter_reading_date' ? (
                  <SearchDate onSearch={handleChangeDate} column={{ id: key }} formatDate={'YYYY-MM-DD'} />
                ) : key === 'company_from_eic_by_name' ? (
                  <TableAutocomplete
                    onSelect={(v) => onSearch(key, v?.value)}
                    apiPath={'publicCompaniesList'}
                    defaultValue={params[key]?.label}
                    dataMarker={key}
                    searchBy={'name'}
                    mapOptions={(data) => data.map((i) => ({ label: i?.short_name ?? i.full_name, value: i.eic }))}
                    searchStart={1}
                    filterOptions={(items) => items}
                  />
                ) : (
                  <SearchField type={'text'} name={key} onSearch={handleSearch} />
                )}
              </TableCell>
            ))}
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
          </TableRow>
          <TableRow style={{ height: 8 }}></TableRow>
        </StickyTableHead>
        <TableBody>
          {list.length === 0 && <NotResultRow span={7} text={t('NO_DATA')} />}
          {list.map((point) => (
            <ViewTableRow key={`row-${point.uid}`} data={point} />
          ))}
        </TableBody>
      </StyledTable>
    </>
  );
};

export default ViewTable;
