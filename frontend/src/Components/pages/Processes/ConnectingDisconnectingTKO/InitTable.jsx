import { TableCell, TableRow } from '@material-ui/core';
import TableBody from '@material-ui/core/TableBody';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import TableSelect from '../../../Tables/TableSelect';
import CircleButton from '../../../Theme/Buttons/CircleButton';
import RadioButton from '../../../Theme/Fields/RadioButton';
import NotResultRow from '../../../Theme/Table/NotResultRow';
import { StyledTable } from '../../../Theme/Table/StyledTable';
import { CONNECTION_STATUSES } from './data';
import { useDispatch, useSelector } from 'react-redux';
import { checkConnectionDisconnectionAp, uncheckConnectionDisconnectionAp } from '../../../../actions/processesActions';
import { useTranslation } from 'react-i18next';
import StickyTableHead from '../../../Theme/Table/StickyTableHead';

const columns = [
  { id: 'eic', label: 'FIELDS.EIC_CODE', minWidth: 150 },
  { id: 'connection_status', label: 'FIELDS.CONNECTION_STATUS', minWidth: 180 },
  { id: 'customer', label: 'FIELDS.AP_CUSTOMER_ID', minWidth: 180 },
  { id: 'balance_supplier', label: 'FIELDS.BALANCE_SUPPLIER', minWidth: 300 },
  { id: 'region', label: 'FIELDS.REGION_OF_ACTUAL_ADDRESS_OF_AP', minWidth: 180 },
  { id: 'city', label: 'FIELDS.CITY_OF_ACTUAL_ADDRESS_OF_AP', minWidth: 180 }
];

const STATUSES = [
  // { label: CONNECTION_STATUSES['Disconnected by GAP'], value: 'Disconnected by GAP' },
  // { label: CONNECTION_STATUSES['Disconnected'], value: 'Disconnected' },
  // { label: CONNECTION_STATUSES['Disconnected by Cust'], value: 'Disconnected by Cust' }

  { label: CONNECTION_STATUSES['Disconnected by GAP'], value: 'Disconnected by GAP' },
  { label: CONNECTION_STATUSES['Disconnected by GAP&BS'], value: 'Disconnected by GAP&BS' },
  { label: CONNECTION_STATUSES['Disconnected by Cust'], value: 'Disconnected by Cust' }
];

const InitTable = ({
  uid,
  params,
  data,
  apsCount,
  setApsCount,
  selectedTkos,
  setSelectedTko,
  searchReadOnly = [],
  handleSetParams,
  isConnected,
  isConnectProcess,
  canChooseAp
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [search, setSearch] = useState({});
  const [checking, setChecking] = useState(false);
  const loading = useSelector((store) => store.processes.loading);
  const timeout = useRef(null);

  const onSearch = (id, value) => {
    setSearch({ ...search, [id]: value });
    clearTimeout(timeout.current);
    timeout.current = setTimeout(() => {
      handleSetParams({ [id]: value || undefined });
    }, 500);
  };

  const handleUpdatePoints = (point_uid, chosen) => {
    const points = JSON.parse(JSON.stringify(selectedTkos));
    if (!(point_uid in points)) points[point_uid] = chosen;
    setChecking(true);
    if (points[point_uid]) {
      dispatch(
        uncheckConnectionDisconnectionAp(
          uid,
          { uid: point_uid },
          () => {
            points[point_uid] = false;
            setSelectedTko(points);
            setApsCount((prev) => prev - 1);
          },
          () => setChecking(false)
        )
      );
    } else {
      dispatch(
        checkConnectionDisconnectionAp(
          uid,
          { uid: point_uid },
          () => {
            points[point_uid] = true;
            setSelectedTko(points);
            setApsCount((prev) => prev + 1);
          },
          () => setChecking(false)
        )
      );
    }
  };

  return (
    <StyledTable>
      <StickyTableHead>
        <TableRow>
          {columns.map(({ id, label, minWidth }) => (
            <TableCell key={id} className={'MuiTableCell-head'} style={{ minWidth }}>
              {!isConnected && id === 'connection_status' ? (
                <>
                  <p>{t(label)}</p>
                  <TableSelect
                    // value={params[id]}
                    value={params[id]}
                    id={id}
                    data={
                      isConnectProcess
                        ? STATUSES.map((i) => ({ ...i, label: t(i.label) }))
                        : [
                            {
                              label: t(CONNECTION_STATUSES['Connected']),
                              value: 'Connected'
                            },
                            { label: t(CONNECTION_STATUSES['Disconnected']), value: 'Disconnected' }
                          ]
                    }
                    onChange={onSearch}
                    readOnly={loading}
                    maxWidth={280}
                  />
                </>
              ) : (
                <>
                  <p>{t(label)}</p>
                  <input
                    type="text"
                    value={
                      searchReadOnly.find((i) => i === id)
                        ? params[id] && t(CONNECTION_STATUSES[params[id]])
                        : search[id] || ''
                    }
                    onChange={({ target: { value } }) => onSearch(id, value)}
                    readOnly={searchReadOnly.find((i) => i === id) || loading}
                  />
                </>
              )}
            </TableCell>
          ))}
          {canChooseAp && (
            <TableCell className={'MuiTableCell-head'} style={{ width: 70 }}>
              <p>{t('SELECTED')}</p>
              <input type="text" value={apsCount} readOnly style={{ textAlign: 'center' }} />
            </TableCell>
          )}
        </TableRow>
      </StickyTableHead>
      <TableBody>
        {data?.length < 1 ? (
          <NotResultRow span={7} text={t('NO_POINTS_FOUND')} />
        ) : (
          data?.map((row) => (
            <Row
              disabled={checking}
              key={row.uid}
              data={row}
              canChooseAp={canChooseAp}
              handleClick={() => handleUpdatePoints(row?.uid, row?.chosen)}
              selected={Boolean(row?.uid in selectedTkos ? selectedTkos[row?.uid] : row?.chosen)}
            />
          ))
        )}
      </TableBody>
    </StyledTable>
  );
};

export default InitTable;

const Row = ({ data, handleClick, selected, canChooseAp, disabled }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <>
      <TableRow tabIndex={-1} data-marker="table-row" className="body__table-row">
        {columns.map(({ id, align }) => (
          <TableCell key={id} align={align} data-marker={id}>
            {id === 'connection_status' ? data[id] && t(CONNECTION_STATUSES[data[id]]) : data[id]}
          </TableCell>
        ))}
        {canChooseAp && (
          <TableCell align={'center'}>
            {data?.in_process ? (
              <CircleButton
                type={'link'}
                title={t('CONTROLS.LINK_TO_INITIALIZED_PROCESS')}
                size={'small'}
                onClick={() => navigate(`/processes/connecting-disconnecting/${data?.in_process}`)}
              />
            ) : (
              <RadioButton data-marker={'radio-button'} checked={selected} onClick={handleClick} disabled={disabled} />
            )}
          </TableCell>
        )}
      </TableRow>
    </>
  );
};
