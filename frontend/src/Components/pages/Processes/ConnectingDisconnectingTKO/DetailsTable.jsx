import React, { useEffect, useMemo, useRef, useState } from 'react';
import { CONNECTION_STATUSES } from './data';
import { StyledTable } from '../../../Theme/Table/StyledTable';
import { TableBody, TableCell, TableRow } from '@material-ui/core';
import TableHeaderCell from './TableHeaderCell';
import TableSelect from '../../../Tables/TableSelect';
import DatePicker from '../../../Theme/Fields/DatePicker';
import NotResultRow from '../../../Theme/Table/NotResultRow';
import CircleButton from '../../../Theme/Buttons/CircleButton';
import PowerSettingsNewRounded from '@mui/icons-material/PowerSettingsNewRounded';
import { useRegTabStyles } from '../../../../features/pm/filterStyles';
import moment from 'moment';
import clsx from 'clsx';
import { LightTooltip } from '../../../Theme/Components/LightTooltip';
import Grid from '@material-ui/core/Grid';
import { useTranslation } from 'react-i18next';
import TableAutocomplete from '../../../Tables/TableAutocomplete';
import StickyTableHead from '../../../Theme/Table/StickyTableHead';

const DetailsTable = ({
  data,
  status,
  isCancel,
  isConfirm,
  isDisconnect,
  isReject,
  handleDelete,
  handleConfirm,
  handleReject,
  setParams,
  params
}) => {
  const { t } = useTranslation();
  const [search, setSearch] = useState({});
  const classes = useRegTabStyles();
  const timeout = useRef(null);
  const MIN_SEARCH_LENGHT = 3;
  const MIN_CUSTOMER_SEARCH_LENGHT = 6;

  useEffect(() => {
    setSearch({});
  }, [status]);

  const STATUSES = useMemo(() => {
    return Object.keys(CONNECTION_STATUSES)
      .filter((key) => key !== 'Underconstruction' && key !== 'Demolished')
      .map((key) => ({
        label: CONNECTION_STATUSES[key],
        value: key
      }));
  }, [data]);

  const columns = [
    'eic',
    'connection_status',
    'customer',
    'balance_supplier',
    'region',
    'city',
    'canceled_at',
    'confirmed_at'
  ];

  const onSearch = (key, value) => {
    if (value === 'Invalid date') return;
    if (key === 'balance_supplier') {
      setSearch({ ...search, [key]: value?.value || undefined });
      setParams({ ...search, [key]: value?.value || undefined, page: 1, size: params.size });
      return;
    }
    setSearch({ ...search, [key]: value || undefined });
    if (value && value.length < MIN_SEARCH_LENGHT) return;
    if (value && key === 'customer' && value.length < MIN_CUSTOMER_SEARCH_LENGHT) return;
    clearTimeout(timeout.current);
    timeout.current = setTimeout(() => {
      setParams({ ...search, page: 1, size: params.size, [key]: value || undefined });
    }, 1000);
  };

  return (
    <StyledTable>
      <StickyTableHead>
        <TableRow>
          <TableHeaderCell minWidth={150}>
            <p>{t('FIELDS.EIC_CODE')}</p>
            <input type="text" value={search.eic || ''} onChange={({ target }) => onSearch('eic', target.value)} />
          </TableHeaderCell>
          <TableHeaderCell minWidth={150} maxWidth={200}>
            <p>{t('FIELDS.CONNECTION_STATUS')}</p>
            <TableSelect
              value={search.connection_status}
              id={'connection_status'}
              data={STATUSES.map((i) => ({ ...i, label: t(i.label) }))}
              onChange={onSearch}
            />
          </TableHeaderCell>
          <TableHeaderCell minWidth={180}>
            <p>{t('FIELDS.AP_CUSTOMER_ID')}</p>
            <input
              type="text"
              value={search.customer || ''}
              onChange={({ target }) => onSearch('customer', target.value)}
            />
          </TableHeaderCell>
          <TableHeaderCell minWidth={230}>
            <p>{t('FIELDS.BALANCE_SUPPLIER')}</p>
            <TableAutocomplete
              onSelect={(v) => onSearch('balance_supplier', v)}
              apiPath={'publicCompaniesList'}
              searchBy={'name'}
              dataMarker={'balance_supplier'}
              mapOptions={(data) => data.map((i) => ({ label: i.short_name, value: i.eic }))}
              searchStart={3}
              filterOptions={(items) => items}
            />
          </TableHeaderCell>
          <TableHeaderCell minWidth={180}>
            <p>{t('FIELDS.REGION_OF_ACTUAL_ADDRESS_OF_AP')}</p>
            <input
              type="text"
              value={search.region || ''}
              onChange={({ target }) => onSearch('region', target.value)}
            />
          </TableHeaderCell>
          <TableHeaderCell minWidth={180}>
            <p>{t('FIELDS.CITY_OF_ACTUAL_ADDRESS_OF_AP')}</p>
            <input type="text" value={search.city || ''} onChange={({ target }) => onSearch('city', target.value)} />
          </TableHeaderCell>
          <TableHeaderCell minWidth={150}>
            <p>{t('FIELDS.DROPPED_OUT_OF_PROCESS')}</p>
            <div className={classes.picker || ''}>
              <DatePicker
                name={'canceled_at'}
                label={''}
                value={search.canceled_at || null}
                onChange={(date) => onSearch('canceled_at', date)}
                dataMarker={`canceled_at_datepicker`}
                outFormat={'YYYY-MM-DD'}
              />
            </div>
          </TableHeaderCell>
          <TableHeaderCell minWidth={150}>
            <p>{isDisconnect ? t('FIELDS.DISCONNECTED_AT') : t('FIELDS.CONNECTED_AT')}</p>
            <div className={classes.picker}>
              <DatePicker
                name={'confirmed_at'}
                label={''}
                value={search.confirmed_at || null}
                onChange={(date) => onSearch('confirmed_at', date)}
                dataMarker={`confirmed_at_datepicker`}
                outFormat={'YYYY-MM-DD'}
              />
            </div>
          </TableHeaderCell>
          {isCancel && (
            <TableHeaderCell minWidth={50} align={'center'}>
              <p>{t('CONTROLS.DELETE')}</p>
            </TableHeaderCell>
          )}
          {isReject && (
            <TableHeaderCell minWidth={50} align={'center'}>
              <p>{t('FIELDS.UNABLE_TO_DISCONNECT')}</p>
            </TableHeaderCell>
          )}
          {isConfirm && (
            <TableHeaderCell minWidth={50} align={'center'}>
              <p>{t('FIELDS.CONNECT_DISCONNECT')}</p>
            </TableHeaderCell>
          )}
        </TableRow>
      </StickyTableHead>
      <TableBody>
        {data?.length < 1 ? (
          <NotResultRow span={8} text={t('NO_POINTS_FOUND')} />
        ) : (
          data?.map((row) => (
            <TableRow tabIndex={-1} data-marker="table-row" className="body__table-row" key={row?.uid}>
              {columns.map((id) => (
                <TableCell key={id} data-marker={id} style={{ maxWidth: id === 'connection_status' && 200 }}>
                  {id === 'canceled_at' ? (
                    row?.rejected_at ? (
                      <LightTooltip
                        title={
                          <div className={classes.tooltip}>
                            <div>
                              {t('REASON')}: {row?.reject_reason}
                            </div>
                            <div>
                              {t('FIELDS.DATE_TIME')}: {moment(row?.rejected_at).format('DD.MM.yyyy • HH:mm')}
                            </div>
                          </div>
                        }
                        arrow
                        disableTouchListener
                        disableFocusListener
                      >
                        <div className={clsx(classes.chip, classes.warning)}>{t('IMPOSSIBLE')}</div>
                      </LightTooltip>
                    ) : row[id] ? (
                      <div className={clsx(classes.chip)}>{moment(row[id]).format('DD.MM.yyyy • HH:mm')}</div>
                    ) : (
                      '---'
                    )
                  ) : id === 'confirmed_at' ? (
                    row[id] ? (
                      <div className={clsx(classes.chip)}>{moment(row[id]).format('DD.MM.yyyy • HH:mm')}</div>
                    ) : (
                      '---'
                    )
                  ) : id === 'connection_status' ? (
                    row[id] && t(CONNECTION_STATUSES[row[id]])
                  ) : (
                    row[id]
                  )}
                </TableCell>
              ))}
              {isCancel && (
                <TableCell
                  data-marker={'delete'}
                  align={'center'}
                  data-status={!row?.can_cancel ? 'disabled' : 'active'}
                >
                  <CircleButton
                    type={'delete'}
                    title={t('CONTROLS.DELETE')}
                    size={'small'}
                    onClick={() => handleDelete(row?.uid)}
                    disabled={!row?.can_cancel}
                  />
                </TableCell>
              )}

              {isReject && (
                <TableCell
                  data-marker={'reject'}
                  align={'center'}
                  data-status={!row?.can_reject ? 'disabled' : 'active'}
                >
                  {isReject && (
                    <Grid item>
                      <CircleButton
                        type={'remove'}
                        color={'blue'}
                        size={'small'}
                        onClick={() => handleReject(row)}
                        title={t('CONTROLS.UNABLE_TO_DISCONNECT')}
                        disabled={!row?.can_reject}
                      />
                    </Grid>
                  )}
                </TableCell>
              )}

              {isConfirm && (
                <TableCell
                  data-marker={'connect-disconnect'}
                  align={'center'}
                  data-status={!row?.can_confirm ? 'disabled' : 'active'}
                >
                  <CircleButton
                    icon={<PowerSettingsNewRounded />}
                    color={isDisconnect ? 'red' : 'green'}
                    size={'small'}
                    onClick={() => handleConfirm(row)}
                    title={isDisconnect ? t('CONTROLS.DISCONNECT_AP') : t('CONTROLS.CONNECT_AP')}
                    disabled={!row?.can_confirm}
                  />
                </TableCell>
              )}
            </TableRow>
          ))
        )}
      </TableBody>
    </StyledTable>
  );
};

export default DetailsTable;
