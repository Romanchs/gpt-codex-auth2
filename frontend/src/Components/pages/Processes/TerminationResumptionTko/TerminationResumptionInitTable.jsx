import { TableCell, TableRow } from '@material-ui/core';
import TableBody from '@material-ui/core/TableBody';
import { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getTerminationResumptionCheckedAccountPoints } from '../../../../actions/processesActions';

import TableSelect from '../../../Tables/TableSelect';
import CircleButton from '../../../Theme/Buttons/CircleButton';
import RadioButton from '../../../Theme/Fields/RadioButton';
import NotResultRow from '../../../Theme/Table/NotResultRow';
import { StyledTable } from '../../../Theme/Table/StyledTable';
import { CONNECTION_STATUSES } from './data';
import { useTranslation } from 'react-i18next';
import StickyTableHead from '../../../Theme/Table/StickyTableHead';

const columns = [
  { id: 'eic', label: 'FIELDS.AP_CODE_TYPE_Z', minWidth: 150 },
  { id: 'connection_status', label: 'FIELDS.CONNECTION_STATUS', minWidth: 200 },
  { id: 'customer', label: 'FIELDS.AP_CUSTOMER_ID', minWidth: 200 },
  { id: 'region', label: 'FIELDS.REGION_OF_ACTUAL_ADDRESS_OF_AP', minWidth: 200 },
  { id: 'city', label: 'FIELDS.CITY_OF_ACTUAL_ADDRESS_OF_AP', minWidth: 200 },
  { id: 'supply_status', label: 'CHARACTERISTICS.SUPPLY_STATUS', minWidth: 200 }
];

const resumptionSupplyStatusOptions = [
  { label: 'CHARACTERISTICS.SUPPLY_IS_VALID', value: 'Постачання дійсне' },
  { label: 'CHARACTERISTICS.SUPPLY_IS_DISCONTINUED', value: 'Постачання припинено' },
  { label: 'NOT_SPECIFIED', value: 'Не визначено' }
];

const terminationSupplyStatusOptions = [
  { label: 'CHARACTERISTICS.SUPPLY_IS_VALID', value: 'Постачання дійсне' },
  { label: 'NOT_SPECIFIED', value: 'Не визначено' }
];

const TerminationResumptionInitTable = ({ processType, data, params, searchReadOnly = [], setParams }) => {
  const { t } = useTranslation();
  const [search, setSearch] = useState({});
  const dispatch = useDispatch();
  const { currentProcess } = useSelector(({ processes }) => processes);
  const timeout = useRef(null);

  const onSearch = (id, value) => {
    setSearch({ ...search, [id]: value });
    clearTimeout(timeout.current);
    if (id === 'customer' && value.length < 6 && value.length !== 0) return;
    timeout.current = setTimeout(() => {
      const newParams = { ...params, [id]: value, page: 1 };
      if (!newParams[id]) delete newParams[id];
      setParams(newParams);
    }, 500);
  };

  const handleSelectTko = (pointId) => {
    dispatch(getTerminationResumptionCheckedAccountPoints(currentProcess.uid, pointId, params));
  };

  return (
    <StyledTable>
      <StickyTableHead>
        <TableRow>
          {columns.map(({ id, label, minWidth }) => (
            <TableCell key={id} className={'MuiTableCell-head'} style={{ minWidth }}>
              <p>{t(label)}</p>
              {id === 'connection_status' ? (
                <TableSelect
                  value={search['connection_status__in'] || null}
                  data={[
                    { label: t(CONNECTION_STATUSES.Connected), value: 'Connected' },
                    { label: t(CONNECTION_STATUSES.Disconnected), value: 'Disconnected' },
                    { label: t(CONNECTION_STATUSES['Disconnected by GAP']), value: 'Disconnected by GAP' },
                    { label: t(CONNECTION_STATUSES['Disconnected by Cust']), value: 'Disconnected by Cust' },
                    { label: t(CONNECTION_STATUSES['Disconnected by GAP&BS']), value: 'Disconnected by GAP&BS' }
                  ]}
                  id={'connection_status__in'}
                  onChange={onSearch}
                  minWidth={80}
                />
              ) : id === 'supply_status' ? (
                <TableSelect
                  value={search[id] || null}
                  data={processType === 'resumption' ? resumptionSupplyStatusOptions : terminationSupplyStatusOptions}
                  id={id}
                  onChange={onSearch}
                  minWidth={80}
                  ignoreI18={false}
                />
              ) : (
                <input
                  type="text"
                  value={searchReadOnly.find((i) => i === id) ? params[id] : search[id] || ''}
                  onChange={({ target: { value } }) => onSearch(id, value)}
                  readOnly={searchReadOnly.find((i) => i === id)}
                />
              )}
            </TableCell>
          ))}
          <TableCell className={'MuiTableCell-head'} style={{ width: 70 }}>
            <p>{t('SELECTED')}</p>
            <input type="text" value={currentProcess?.chosen_ap?.length} readOnly style={{ textAlign: 'center' }} />
          </TableCell>
        </TableRow>
      </StickyTableHead>
      <TableBody>
        {data.length < 1 ? (
          <NotResultRow span={8} text={t('NO_POINTS_FOUND')} />
        ) : (
          data.map((row) => (
            <Row
              key={row.uid}
              data={row}
              handleClick={() => handleSelectTko(row?.uid)}
              selected={Boolean(currentProcess?.chosen_ap?.find((t) => t === row?.uid))}
            />
          ))
        )}
      </TableBody>
    </StyledTable>
  );
};

export default TerminationResumptionInitTable;

const Row = ({ data, handleClick, selected }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <>
      <TableRow tabIndex={-1} data-marker="table-row" className="body__table-row">
        {columns.map(({ id, align }) => (
          <TableCell key={id} align={align} data-marker={id}>
            {id === 'connection_status' ? t(CONNECTION_STATUSES[data[id]]) : data[id]}
          </TableCell>
        ))}
        <TableCell align={'center'}>
          {data?.in_process ? (
            <CircleButton
              type={'link'}
              title={t('CONTROLS.LINK_TO_INITIALIZED_PROCESS')}
              size={'small'}
              onClick={() => navigate(`/processes/termination-resumption/${data?.in_process}`)}
            />
          ) : (
            <RadioButton
              data-marker={'radio-button'}
              checked={selected}
              value={selected ? 'checked' : 'unchecked'}
              onClick={handleClick}
            />
          )}
        </TableCell>
      </TableRow>
    </>
  );
};
