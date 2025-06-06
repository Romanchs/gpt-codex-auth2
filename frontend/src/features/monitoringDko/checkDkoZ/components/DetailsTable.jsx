import Box from '@mui/material/Box';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import CheckCircleOutlineRounded from '@mui/icons-material/CheckCircleOutlineRounded';
import RadioButtonUncheckedRounded from '@mui/icons-material/RadioButtonUncheckedRounded';
import { useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setParams, setSelected } from '../../slice';
import moment from 'moment';
import NotResultRow from '../../../../Components/Theme/Table/NotResultRow';
import { StyledTable } from '../../../../Components/Theme/Table/StyledTable';
import TableSelect from '../../../../Components/Tables/TableSelect';
import { Pagination } from '../../../../Components/Theme/Table/Pagination';
import TableHeadCell from '../../../../Components/Tables/TableHeadCell';
import { mainApi } from '../../../../app/mainApi';
import { useDetailsMDCHECKDKOZQuery } from '../api';
import { useTranslation } from 'react-i18next';
import TableDatePicker from '../../../../Components/Tables/TableDatePicker';
import DetailsRow from './DetailsRow';
import useSearchLog from '../../../../services/actionsLog/useSearchLog';
import { MONITORING_DKO_LOG_TAGS } from '../../../../services/actionsLog/constants';
import { checkPermissions } from '../../../../util/verifyRole';
import StickyTableHead from '../../../../Components/Theme/Table/StickyTableHead';

const defaultLists = {
  is_sent: []
};

const columns = [
  { id: 'mdr_name', label: 'FIELDS.PPKO_NAME', minWidth: 300 },
  { id: 'mdr_eic', label: 'FIELDS.EIC_PPKO', minWidth: 120 },
  { id: 'ap_group', label: 'FIELDS.GROUP', minWidth: 50, type: 'title' },
  { id: 'mga_eic', label: 'FIELDS.METERING_GRID_AREA_EIC', minWidth: 120 },
  { id: 'aps_failed', label: 'CHECK_DKO_Z.FIELDS.TKO_WITH_VIOLATIONS', minWidth: 140, type: 'title' },
  { id: 'created_at', label: 'CHECK_DKO_Z.FIELDS.INITIATED', minWidth: 120, type: 'date' },
  { id: 'finished_at', label: 'FIELDS.FORMED', minWidth: 120, type: 'date' },
  { id: 'is_sent', label: 'FIELDS.SEND', type: 'select', minWidth: 70 }
];

const DetailsTable = () => {
  const { t } = useTranslation();
  const { uid } = useParams();
  const dispatch = useDispatch();
  const params = useSelector((store) => store.monitoringDko.params);
  const selected = useSelector((store) => store.monitoringDko.selected);
  const [search, setSearch] = useState({});
  const timeout = useRef(null);
  const COLUMNS_TYPES = useMemo(() => Object.fromEntries(columns.map((i) => [i.id, i.type || 'text'])), []);
  const searchLog = useSearchLog(MONITORING_DKO_LOG_TAGS);
  const { currentData: settings } = mainApi.endpoints.settingsMDCHECKDKOZ.useQueryState();

  const LISTS_DATA = useMemo(() => {
    if (!settings?.fields) return defaultLists;
    return {
      ...defaultLists,
      is_sent: [
        { label: t('CONTROLS.YES'), value: '1' },
        { label: t('CONTROLS.NO'), value: '0' }
      ]
    };
  }, [t, settings]);
  const { currentData, isFetching } = useDetailsMDCHECKDKOZQuery({ uid, params });

  const handleUpdateParams = (newParams) => {
    for (const id in newParams) {
      if (!newParams[id] || (COLUMNS_TYPES[id] !== 'select' && newParams[id]?.length < 3)) delete newParams[id];
      else if (COLUMNS_TYPES[id] === 'date') {
        newParams[id] = moment(newParams[id]).endOf('day').utc().format();
        if (newParams[id] === 'Invalid date') delete newParams[id];
      }
    }
    dispatch(setParams(newParams));
  };

  const onSearch = (id, value, type) => {
    setSearch({ ...search, [id]: value });
    clearTimeout(timeout.current);
    if (
      !value ||
      value.length === 0 ||
      (type === 'text' && value.length >= 3) ||
      type === 'select' ||
      moment(value, moment.ISO_8601).isValid()
    ) {
      timeout.current = setTimeout(() => {
        handleUpdateParams({ ...params, ...search, [id]: value, page: 1 });
        searchLog();
      }, 500);
    }
  };

  const getSearch = (id, type, minWidth) => {
    switch (type) {
      case 'select':
        return (
          <TableSelect
            value={search[id]}
            data={LISTS_DATA[id]}
            id={id}
            onChange={(id, value) => onSearch(id, value, type)}
            minWidth={minWidth}
          />
        );
      case 'date':
        return (
          <TableDatePicker
            id={id}
            value={search[id]}
            onChange={(value) => onSearch(id, value, type)}
            minWidth={minWidth}
          />
        );
      case 'title':
        return null;
      default:
        return <input value={search[id] || ''} onChange={({ target }) => onSearch(id, target.value, 'text')} />;
    }
  };

  const handleCheckedAll = () => {
    dispatch(
      setSelected({
        isAll: !selected.isAll,
        points: []
      })
    );
  };

  const handleSelect = (uid) => {
    dispatch(
      setSelected({
        ...selected,
        points: selected.points.includes(uid) ? selected.points.filter((id) => id !== uid) : [...selected.points, uid]
      })
    );
  };

  return (
    <>
      <StyledTable spacing={2}>
        <StickyTableHead>
          <TableRow>
            {checkPermissions('MONITORING_DKO.DETAILS.TABLE_CELLS.SELECT', ['АКО_Процеси']) && (
              <TableCell sx={{ pl: '12px !important', pr: '12px !important', textAlign: 'center' }}>
                {currentData?.data?.length > 0 && (
                  <Box>
                    <p>{t('ALL').toUpperCase()}</p>
                    <IconButton
                      aria-label={'select row'}
                      size={'small'}
                      onClick={handleCheckedAll}
                      sx={{ mt: '2px', border: 'none' }}
                      data-marker={selected.isAll ? 'selected' : 'not-selected'}
                    >
                      {selected.isAll ? (
                        <CheckCircleOutlineRounded style={{ fontSize: 24, color: '#F28C60' }} />
                      ) : (
                        <RadioButtonUncheckedRounded style={{ fontSize: 24, color: '#FFF' }} />
                      )}
                    </IconButton>
                  </Box>
                )}
              </TableCell>
            )}
            {columns.map(({ id, type, label, minWidth }) => {
              if (id === 'is_sent' && !checkPermissions('MONITORING_DKO.DETAILS.TABLE_CELLS.SEND', ['АКО_Процеси']))
                return;
              return (
                <TableHeadCell key={id} style={{ minWidth }} title={t(label)}>
                  {getSearch(id, type, minWidth)}
                </TableHeadCell>
              );
            })}
            <TableHeadCell title={''} />
          </TableRow>
        </StickyTableHead>
        <TableBody>
          {!currentData?.data?.length ? (
            <NotResultRow span={columns.length + 2} text={t('NO_RECORDS_FOUND')} />
          ) : (
            currentData?.data?.map((point) => (
              <DetailsRow
                key={`row-${point.uid}`}
                data={point}
                columns={columns}
                isSelect={selected.isAll ? !selected.points.includes(point.uid) : selected.points.includes(point.uid)}
                handleSelect={handleSelect}
              />
            ))
          )}
        </TableBody>
      </StyledTable>
      <Pagination
        {...currentData}
        params={params}
        onPaginate={(p) => handleUpdateParams({ ...params, ...p })}
        loading={isFetching}
      />
    </>
  );
};

export default DetailsTable;
