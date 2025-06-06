import { TableCell, TableRow } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import TableBody from '@material-ui/core/TableBody';
import moment from 'moment';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import {
  getTerminationResumptionAccountingPoints,
  getTerminationResumptionDetails,
  removeTerminationResumptionPoint
} from '../../../../actions/processesActions';
import SearchDate from '../../../Tables/SearchDate';
import TableSelect from '../../../Tables/TableSelect';
import CircleButton from '../../../Theme/Buttons/CircleButton';
import DatePicker from '../../../Theme/Fields/DatePicker';
import StyledInput from '../../../Theme/Fields/StyledInput';
import NotResultRow from '../../../Theme/Table/NotResultRow';
import { Pagination } from '../../../Theme/Table/Pagination';
import { StyledTable } from '../../../Theme/Table/StyledTable';
import { CONNECTION_STATUSES } from './data';
import TerminationResumptionInitTable from './TerminationResumptionInitTable';
import CancelModal from '../../../Modal/CancelModal';
import DelegateInput from '../../../../features/delegate/delegateInput';
import { Box, Typography } from '@mui/material';
import { LightTooltip } from '../../../Theme/Components/LightTooltip';
import { useTranslation } from 'react-i18next';
import StickyTableHead from '../../../Theme/Table/StickyTableHead';

const columns = [
  { id: 'eic', label: 'FIELDS.AP_CODE_TYPE_Z', minWidth: 150, verify: (value) => value.length === 16 },
  { id: 'connection_status', label: 'FIELDS.CONNECTION_STATUS', minWidth: 200 },
  { id: 'customer', label: 'FIELDS.AP_CUSTOMER_CODE', minWidth: 200, verify: (value) => value.length >= 6 },
  { id: 'region', label: 'FIELDS.REGION_OF_ACTUAL_ADDRESS_OF_AP', minWidth: 200, verify: (value) => value.length >= 3 },
  { id: 'city', label: 'FIELDS.CITY_OF_ACTUAL_ADDRESS_OF_AP', minWidth: 200, verify: (value) => value.length >= 3 },
  { id: 'dropped_out', label: 'FIELDS.DROPPED_OUT_OF_PROCESS', minWidth: 100 },
  {
    id: 'supply_status_valid_from',
    label: (isTermination) => (isTermination ? 'FIELDS.DISCONNECT_TKO_DATE' : 'FIELDS.CONNECT_TKO_DATE'),
    minWidth: 100
  }
];

const processTypeMap = {
  TERMINATION_SUPPLY: 'termination',
  RESUMPTION_SUPPLY: 'resumption'
};

const reasons = {
  DEBT: 'DISCONNECTION_AP_REASONS.DEBT_FROM_PAYMENT',
  NON_ADMISSION: 'DISCONNECTION_AP_REASONS.NON_ADMISSION_TO_CALCULATION_MEANS_OF_COMMERCIAL_ACCOUNTING'
};

const DetailsTab = ({ dataForInit, setDataForInit }) => {
  const { t } = useTranslation();
  const { uid } = useParams();
  const dispatch = useDispatch();
  const [params, setParams] = useState({ page: 1, size: 25 });
  const [accountingPointsParams, setAccountingPointsParams] = useState(null);
  const { currentProcess, loading, error } = useSelector(({ processes }) => processes);
  const [errors, setErrors] = useState(null);
  const [removePointModal, setRemovePointModal] = useState(null);

  useEffect(() => {
    setErrors(error);
  }, [error]);

  useEffect(() => {
    dispatch(
      getTerminationResumptionDetails(uid, params, (process) => {
        if (process && process.status === 'IN_PROCESS') {
          setAccountingPointsParams({
            page: 1,
            size: 25
          });
        }
      })
    );
  }, [dispatch, uid, params]);

  useEffect(() => {
    if (currentProcess && currentProcess.status === 'IN_PROCESS' && accountingPointsParams) {
      dispatch(getTerminationResumptionAccountingPoints(uid, accountingPointsParams));
    }
  }, [dispatch, accountingPointsParams]);

  useEffect(() => {
    if (currentProcess && currentProcess.status === 'IN_PROCESS' && currentProcess.chosen_ap)
      setDataForInit({
        ...dataForInit,
        accounting_points: [...currentProcess.chosen_ap],
        name: currentProcess.action_type
      });
  }, [currentProcess]);

  const handleDeleteTKO = () => {
    dispatch(removeTerminationResumptionPoint(uid, removePointModal, params));
    setRemovePointModal(null);
  };

  return (
    <>
      <div className={'boxShadow'} style={{ padding: 24, marginTop: 16, marginBottom: 16 }}>
        <Grid container spacing={3} alignItems={'flex-start'}>
          <Grid item xs={12} md={6} lg={3}>
            <DelegateInput
              label={t('FIELDS.USER_INITIATOR')}
              disabled
              value={currentProcess?.initiator}
              data={currentProcess?.delegation_history || []}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <StyledInput
              label={t('FIELDS.FORMED_AT')}
              disabled
              value={currentProcess?.formed_at && moment(currentProcess?.formed_at).format('DD.MM.yyyy • HH:mm')}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <StyledInput
              label={currentProcess?.status === 'CANCELED' ? t('FIELDS.CANCELED_AT') : t('FIELDS.COMPLETE_DATETIME')}
              value={currentProcess?.finished_at && moment(currentProcess?.finished_at).format('DD.MM.yyyy • HH:mm')}
              disabled
            />
          </Grid>
          {currentProcess?.status === 'COMPLETED' && (
            <Grid item xs={12} md={6} lg={3}>
              <StyledInput
                label={t('FIELDS.COMPLETED_AT')}
                disabled
                value={
                  currentProcess?.completed_at && moment(currentProcess?.completed_at).format('DD.MM.yyyy • HH:mm')
                }
              />
            </Grid>
          )}
          {currentProcess?.status === 'IN_PROCESS' && (
            <Grid item xs={12} md={6} lg={3}>
              {currentProcess?.action_type === 'TERMINATION_SUPPLY' ? (
                <DatePicker
                  label={t('FIELDS.DELIVERY_STATUS_CHANGE_DATE')}
                  value={dataForInit.must_be_finished_at}
                  onChange={(date) => setDataForInit({ ...dataForInit, must_be_finished_at: date })}
                  error={errors?.detail?.must_be_finished_at}
                  minDate={currentProcess?.status === 'IN_PROCESS' ? moment() : null}
                />
              ) : (
                <DatePicker
                  label={t('FIELDS.RESUMPTION_SUPPLY_DATE')}
                  value={dataForInit.must_be_finished_at}
                  onChange={(date) => setDataForInit({ ...dataForInit, must_be_finished_at: date })}
                  error={errors?.detail?.must_be_finished_at}
                  maxDate={moment()}
                />
              )}
            </Grid>
          )}
          {currentProcess?.status !== 'IN_PROCESS' && (
            <Grid item xs={12} md={6} lg={3}>
              <StyledInput
                label={
                  currentProcess?.action_type === 'TERMINATION_SUPPLY'
                    ? t('FIELDS.DELIVERY_STATUS_CHANGE_DATE')
                    : t('FIELDS.RESUMPTION_SUPPLY_DATE')
                }
                disabled
                value={
                  currentProcess?.must_be_finished_at
                    ? moment(currentProcess?.must_be_finished_at).format('DD.MM.yyyy')
                    : ''
                }
              />
            </Grid>
          )}
          <Grid item xs={12} md={6} lg={3}>
            <StyledInput
              label={t('FIELDS.ACTION_TYPE')}
              disabled
              value={currentProcess?.action_type && t(`SUBPROCESSES.${currentProcess?.action_type}`)}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <StyledInput label={t('FIELDS.INITIATOR_COMPANY')} disabled value={currentProcess?.initiator_company} />
          </Grid>
          {currentProcess?.action_type === 'TERMINATION_SUPPLY' && (
            <Grid item xs={12} md={6} lg={3}>
              <StyledInput
                label={t('DISCONNECTION_AP_REASONS.REASON_FOR_TERMINATION_OF_SUPPLY')}
                disabled
                value={t(reasons[currentProcess?.reason])}
              />
            </Grid>
          )}
        </Grid>
      </div>
      {currentProcess?.status === 'IN_PROCESS' && accountingPointsParams ? (
        <>
          <TerminationResumptionInitTable
            processType={processTypeMap[dataForInit?.name]}
            data={currentProcess?.accounting_points?.data || []}
            params={accountingPointsParams}
            selectedTkos={dataForInit.accounting_points}
            setParams={setAccountingPointsParams}
          />
          <Pagination
            {...currentProcess?.accounting_points}
            loading={loading}
            params={accountingPointsParams}
            onPaginate={(v) => setAccountingPointsParams({ ...accountingPointsParams, ...v })}
          />
        </>
      ) : (
        <>
          <DetailsTable
            data={currentProcess?.accounting_points?.data || []}
            isCancel={currentProcess?.can_cancel}
            isTermination={currentProcess?.action_type === 'TERMINATION_SUPPLY'}
            handleDeleteTKO={setRemovePointModal}
            handleSearch={setParams}
            params={params}
          />
          <Pagination
            {...currentProcess?.accounting_points}
            loading={loading}
            params={params}
            onPaginate={(v) => setParams({ ...params, ...v })}
          />
        </>
      )}
      <CancelModal
        text={t('ARE_YOU_SURE_YOU_WANT_TO_REMOVE_AP_FROM_PROCESS')}
        open={Boolean(removePointModal)}
        onClose={() => setRemovePointModal(null)}
        onSubmit={handleDeleteTKO}
      />
    </>
  );
};

export default DetailsTab;

const DetailsTable = ({ data, isCancel, isTermination, handleDeleteTKO, handleSearch, params }) => {
  const { t } = useTranslation();
  const timeout = useRef(null);
  const [search, setSearch] = useState({});
  const verifyColumns = useMemo(() => Object.fromEntries(columns.filter((i) => i.verify).map((i) => [i.id, i])), []);

  const onSearch = (id, value) => {
    if (!value) value = '';
    setSearch({ ...search, [id]: value || undefined });
    clearTimeout(timeout.current);
    if (value.length !== 0 && id in verifyColumns && !verifyColumns[id].verify(value)) return;
    timeout.current = setTimeout(() => {
      handleSearch({ ...params, ...search, [id]: value || undefined, page: 1 });
    }, 500);
  };

  const getSearch = (key) => {
    if (key === 'dropped_out' || key === 'supply_status_valid_from') {
      return (
        <SearchDate
          onSearch={onSearch}
          column={{ id: key }}
          formatDate={'yyyy-MM-DD'}
          name={key}
          value={search[key] || null}
        />
      );
    }
    if (key === 'connection_status') {
      return (
        <TableSelect
          value={search[key] || null}
          data={[
            { label: t(CONNECTION_STATUSES.Connected), value: 'Connected' },
            { label: t(CONNECTION_STATUSES.Disconnected), value: 'Disconnected' },
            { label: t(CONNECTION_STATUSES['Disconnected by GAP']), value: 'Disconnected by GAP' },
            { label: t(CONNECTION_STATUSES['Disconnected by Cust']), value: 'Disconnected by Cust' },
            { label: t(CONNECTION_STATUSES['Disconnected by GAP&BS']), value: 'Disconnected by GAP&BS' }
          ]}
          id={key}
          onChange={onSearch}
          minWidth={80}
        />
      );
    }
    return (
      <input
        type="text"
        value={search[key] || ''}
        onChange={({ target }) => onSearch(key, target.value)}
        {...(key === 'eic' ? { maxLength: 16 } : {})}
      />
    );
  };

  const getValidFrom = ({ impossible_data, supply_status_valid_from }) => {
    if (!impossible_data) {
      return supply_status_valid_from ? moment(supply_status_valid_from).format('DD.MM.yyyy • HH:mm') : '—';
    }
    return (
      <LightTooltip
        title={
          <>
            <Typography component={'p'} variant={'helper'} align={'center'}>
              {t('REASON')}: {impossible_data?.reason}
            </Typography>
            <Typography component={'p'} variant={'helper'} align={'center'}>
              {t('FIELDS.DATE_TIME')}: {moment(impossible_data?.datetime).format('DD.MM.yyyy • HH:mm')}
            </Typography>
          </>
        }
        arrow
      >
        <Box
          sx={{
            display: 'inline',
            bgcolor: 'orange.main',
            py: 0.5,
            px: 3,
            my: -0.5,
            borderRadius: 5,
            color: 'white',
            fontWeight: 700,
            textTransform: 'uppercase'
          }}
        >
          {t('IMPOSSIBLE')}
        </Box>
      </LightTooltip>
    );
  };

  return (
    <StyledTable>
      <StickyTableHead>
        <TableRow>
          {columns.map(({ id, label, minWidth }) => (
            <TableCell key={id} className={'MuiTableCell-head'} style={{ minWidth }}>
              <p>{typeof label === 'string' ? t(label) : t(label(isTermination))}</p>
              {getSearch(id)}
            </TableCell>
          ))}
          {isCancel && (
            <TableCell className={'MuiTableCell-head'} minWidth={50} align={'center'}>
              <p>{t('CONTROLS.DELETE')}</p>
            </TableCell>
          )}
        </TableRow>
      </StickyTableHead>
      <TableBody>
        {data.length < 1 ? (
          <NotResultRow span={8} text={t('NO_POINTS_FOUND')} />
        ) : (
          data.map((row) => (
            <TableRow tabIndex={-1} data-marker="table-row" className="body__table-row" key={row?.uid}>
              {columns.map(({ id }) => (
                <TableCell key={id} data-marker={id}>
                  {id === 'dropped_out' && (!row[id] ? 'Ні' : moment(row[id]).format('DD.MM.yyyy • HH:mm'))}
                  {id === 'supply_status_valid_from' && getValidFrom(row)}
                  {id === 'connection_status' && t(CONNECTION_STATUSES[row[id]])}
                  {id !== 'dropped_out' && id !== 'supply_status_valid_from' && id !== 'connection_status' && row[id]}
                </TableCell>
              ))}
              {isCancel && (
                <TableCell data-marker={'delete'} align={'center'}>
                  <CircleButton
                    type={'delete'}
                    title={t('CONTROLS.DELETE')}
                    size={'small'}
                    onClick={() => handleDeleteTKO(row?.uid)}
                    disabled={!row?.can_cancel}
                    dataMarker={'delete_btn'}
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
