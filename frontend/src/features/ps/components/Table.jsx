import Box from '@mui/material/Box';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import moment from 'moment';
import { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { checkPermissions } from '../../../util/verifyRole';
import DatePicker from '../../../Components/Theme/Fields/DatePicker';
import { StyledTable } from '../../../Components/Theme/Table/StyledTable';
import TableHeadCell from '../../../Components/Tables/TableHeadCell';
import NotResultRow from '../../../Components/Theme/Table/NotResultRow';
import { Pagination } from '../../../Components/Theme/Table/Pagination';
import { useProcessSettingsListQuery } from '../api';
import { setParams } from '../slice';
import StickyTableHead from '../../../Components/Theme/Table/StickyTableHead';
import TableSelect from '../../../Components/Tables/TableSelect';
import { styled } from '@mui/material/styles';
import { verifyRole } from '../../../util/verifyRole';

const columns = [
  { id: 'process', label: 'LIST_OF_PROCESSES', width: 330, keyData: 'process_ua' },
  { id: 'updated_at', label: 'FIELDS.LAST_CHANGE_DATE_TIME', width: 200 },
  { id: 'updated_by', label: 'FIELDS.USER_FULL_NAME' },
  {
    id: 'lock_historical_updates_availabil',
    label: 'FIELDS.DATE_RESTRICTION',
    visibleRoles: ['АКО_Процеси'],
    align: 'center'
  }
];

const Table = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const timeout = useRef(null);
  const params = useSelector((store) => store.processSettings.params);
  const [search, setSearch] = useState(params);
  const IS_AKO_USERS = checkPermissions('PROCESS_SETTINGS.IS_AKO_USERS', 'АКО_Користувачі');
  const { currentData, isFetching } = useProcessSettingsListQuery(params);

  const handleUpdateParams = (params) => dispatch(setParams(params));

  const onSearch = (id, value) => {
    const newParams = {
      ...search,
      [id]: value || value === 0 ? value : undefined
    };
    if ((!value && id !== 'lock_historical_updates_availabil') || (id === 'updated_at' && value === 'Invalid date'))
      delete newParams[id];

    setSearch(newParams);
    clearTimeout(timeout.current);
    if (!value || value.length === 0 || value.length >= 3 || id === 'lock_historical_updates_availabil') {
      timeout.current = setTimeout(() => {
        handleUpdateParams({ ...newParams, page: 1 });
      }, 500);
    }
  };

  const getSearch = (id) => {
    switch (id) {
      case 'updated_at':
        return (
          <Box sx={datePickerSx}>
            <DatePicker
              label={''}
              value={search[id]}
              onChange={(v) => onSearch(id, moment(v).format('yyyy-MM-DD'))}
              data-marker={'date-search'}
            />
          </Box>
        );
      case 'lock_historical_updates_availabil':
        return (
          <TableSelect
            value={search[id]}
            id={id}
            data={[
              { label: t('CONTROLS.YES'), value: 1 },
              { label: t('CONTROLS.NO'), value: 0 }
            ]}
            minWidth={80}
            onChange={(id, value) => onSearch(id, value?.value ?? value)}
            data-marker={'select-data'}
            renderValue={(value) => (value ? t('CONTROLS.YES') : t('CONTROLS.NO'))}
          />
        );
      default:
        return <input value={search[id] || ''} onChange={({ target }) => onSearch(id, target.value)} />;
    }
  };

  const getData = (id, row) => {
    if (id === 'updated_at') return row[id] && moment(row[id]).format('DD.MM.yyyy • HH:mm');
    if (id === 'lock_historical_updates_availabil')
      return (
        <RestrictBadge color={row[id] === 1 ? 'green' : 'red'}>
          {row[id] === 1 ? t('CONTROLS.YES') : t('CONTROLS.NO')}
        </RestrictBadge>
      );
    return row[id];
  };

  const handleClickByRow = (process) => {
    if (!IS_AKO_USERS) navigate(`/process-settings/${process?.toLowerCase()}`);
  };

  const actualColumns = columns.filter(({ visibleRoles }) => {
    return !visibleRoles || verifyRole(visibleRoles);
  });

  return (
    <>
      <StyledTable>
        <StickyTableHead>
          <TableRow>
            {actualColumns.map(({ id, label, width }) => (
              <TableHeadCell key={id} title={t(label)} width={width}>
                {getSearch(id)}
              </TableHeadCell>
            ))}
          </TableRow>
        </StickyTableHead>
        <TableBody>
          {currentData?.data?.length > 0 ? (
            currentData?.data?.map((row) => (
              <TableRow
                key={row?.process}
                data-marker={'table-row'}
                className={'body__table-row'}
                hover={!IS_AKO_USERS}
              >
                {actualColumns.map(({ id, keyData, align }) => (
                  <TableCell
                    key={row?.process + id}
                    data-marker={id}
                    onClick={() => handleClickByRow(row?.process)}
                    sx={{ textAlign: align }}
                  >
                    {getData(keyData || id, row)}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <NotResultRow span={columns.length} text={t('PROCESSES_NOT_FOUND')} />
          )}
        </TableBody>
      </StyledTable>
      <Pagination
        {...currentData}
        loading={isFetching}
        params={params}
        onPaginate={(v) => handleUpdateParams({ ...params, ...v })}
      />
    </>
  );
};

export default Table;

const datePickerSx = {
  marginTop: '5px',
  borderRadius: 1,
  backgroundColor: '#FFFFFF',

  '& .MuiFormControl-root .MuiInputBase-root': {
    padding: '3px 0px 2.9px 4px',
    borderRadius: 1,
    backgroundColor: '#FFFFFF',

    '&>input': {
      fontSize: 12,
      padding: '5px'
    },

    '&.Mui-focused': {
      borderColor: 'transparent'
    },

    '& input': {
      marginTop: 0,
      border: 'none'
    }
  }
};

const RestrictBadge = styled('span')(({ color }) => ({
  display: 'inline-block',
  minWidth: 120,
  borderRadius: 20,
  padding: '5px 12px',
  color,
  fontSize: 12,
  lineHeight: 1.1,
  textAlign: 'center',
  backgroundColor: '#D1EDF3',
  textTransform: 'uppercase',
  '.body__table-row:hover &': {
    backgroundColor: '#ffffff'
  }
}));
