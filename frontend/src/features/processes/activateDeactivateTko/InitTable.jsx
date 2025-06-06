import { TableCell, TableRow } from '@material-ui/core';
import TableBody from '@material-ui/core/TableBody';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TableSelect from '../../../Components/Tables/TableSelect';
import CircleButton from '../../../Components/Theme/Buttons/CircleButton';
import RadioButton from '../../../Components/Theme/Fields/RadioButton';
import NotResultRow from '../../../Components/Theme/Table/NotResultRow';
import { StyledTable } from '../../../Components/Theme/Table/StyledTable';
import { CONNECTION_STATUSES } from './data';
import { useTranslation } from 'react-i18next';
import useSearchLog from '../../../services/actionsLog/useSearchLog';
import StickyTableHead from '../../../Components/Theme/Table/StickyTableHead';

const columns = [
  { id: 'eic', label: 'FIELDS.EIC_CODE', minWidth: 150 },
  { id: 'connection_status', label: 'FIELDS.CONNECTION_STATUS', minWidth: 180 },
  { id: 'customer', label: 'FIELDS.AP_CUSTOMER_CODE', minWidth: 180 },
  { id: 'region', label: 'FIELDS.REGION', minWidth: 180 },
  { id: 'city', label: 'FIELDS.CITY', minWidth: 180 }
];

const STATUSES = [
  { label: CONNECTION_STATUSES['Disconnected by GAP'], value: 'Disconnected by GAP' },
  { label: CONNECTION_STATUSES['Disconnected'], value: 'Disconnected' },
  { label: CONNECTION_STATUSES['Disconnected by Cust'], value: 'Disconnected by Cust' }
];

const InitTable = ({
  data,
  selectedTkos,
  handleUpdateTkos,
  params,
  searchReadOnly = [],
  handleSetParams,
  isConnected
}) => {
  const { t } = useTranslation();
  const [search, setSearch] = useState({});
  const timeout = useRef(null);
  const searchLog = useSearchLog();

  const onSearch = (id, value) => {
    setSearch({ ...search, [id]: value });
    clearTimeout(timeout.current);
    timeout.current = setTimeout(() => {
      handleSetParams({ [id]: value });
      searchLog();
    }, 500);
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
                    value={search[id]}
                    id={id}
                    data={STATUSES.map((i) => ({ ...i, label: t(i.label) }))}
                    onChange={onSearch}
                    maxWidth={200}
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
                    readOnly={searchReadOnly.find((i) => i === id)}
                  />
                </>
              )}
            </TableCell>
          ))}
          <TableCell className={'MuiTableCell-head'} style={{ width: 70 }}>
            <p>{t('SELECTED')}</p>
            <input type="text" value={selectedTkos?.length} readOnly style={{ textAlign: 'center' }} />
          </TableCell>
        </TableRow>
      </StickyTableHead>
      <TableBody>
        {data.length < 1 ? (
          <NotResultRow span={5} text={t('NO_POINTS_FOUND')} />
        ) : (
          data.map((row) => (
            <Row
              key={row.uid}
              data={row}
              handleClick={() => handleUpdateTkos(row?.uid)}
              selected={Boolean(selectedTkos.find((t) => t === row?.uid))}
            />
          ))
        )}
      </TableBody>
    </StyledTable>
  );
};

export default InitTable;

const Row = ({ data, handleClick, selected }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <>
      <TableRow tabIndex={-1} data-marker="table-row" className="body__table-row">
        {columns.map(({ id, align }) => (
          <TableCell key={id} align={align} data-marker={id}>
            {id === 'connection_status' ? data[id] && t(CONNECTION_STATUSES[data[id]]) : data[id]}
          </TableCell>
        ))}
        <TableCell align={'center'}>
          {data?.in_process ? (
            <CircleButton
              type={'link'}
              title={t('CONTROLS.LINK_TO_INITIALIZED_PROCESS')}
              size={'small'}
              onClick={() => navigate(`/processes/activating-deactivating/${data?.in_process}`)}
            />
          ) : (
            <RadioButton data-marker={'radio-button'} checked={selected} onClick={handleClick} />
          )}
        </TableCell>
      </TableRow>
    </>
  );
};
