import { Chip, TableRow } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import moment from 'moment';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ACTION_TYPES } from './data';
import {
  useActivateDeactivateApsQuery,
  useActivateDeactivateTkoProcessQuery,
  useFormedActivateDeactivateTkoMutation,
  useRemoveAccountingPointMutation
} from './api';
import StyledInput from '../../../Components/Theme/Fields/StyledInput';
import { Pagination } from '../../../Components/Theme/Table/Pagination';
import { StyledTable } from '../../../Components/Theme/Table/StyledTable';
import DatePicker from '../../../Components/Theme/Fields/DatePicker';
import NotResultRow from '../../../Components/Theme/Table/NotResultRow';
import CircleButton from '../../../Components/Theme/Buttons/CircleButton';
import { LightTooltip } from '../../../Components/Theme/Components/LightTooltip';
import { TableCell } from '@mui/material';
import CancelModal from '../../../Components/Modal/CancelModal';
import i18n from '../../../i18n/i18n';
import { useTranslation } from 'react-i18next';
import useSearchLog from '../../../services/actionsLog/useSearchLog';
import useViewCallbackLog from '../../../services/actionsLog/useViewCallbackLog';

const ProcessType = {
  [ACTION_TYPES.activating]: i18n.t('ACTIVATING_AP'),
  [ACTION_TYPES.deactivating]: i18n.t('DEACTIVATING_AP')
};

const DetailsTab = ({ mustBeFinishedAt, setMustBeFinishedAt, logTags }) => {
  const { t } = useTranslation();
  const { uid } = useParams();
  const { data: currentProcess } = useActivateDeactivateTkoProcessQuery(uid);
  const [params, setParams] = useState({ page: 1, size: 25 });
  const { data, isFetching } = useActivateDeactivateApsQuery({ uid, params });
  const [, { error: formingError }] = useFormedActivateDeactivateTkoMutation({
    fixedCacheKey: 'formActivateDeactivateTko'
  });

  const viewLog = useViewCallbackLog(logTags);

  return (
    <>
      <div className={'boxShadow'} style={{ padding: 24, marginTop: 16, marginBottom: 16 }}>
        <Grid container spacing={3} alignItems={'flex-start'}>
          <Grid item xs={12} md={6} lg={3}>
            <StyledInput label={t('FIELDS.USER_INITIATOR')} readOnly value={currentProcess?.initiator?.username} />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <StyledInput
              label={t('FIELDS.START_WORK_DATE')}
              readOnly
              value={currentProcess?.created_at && moment(currentProcess?.created_at).format('DD.MM.yyyy • HH:mm')}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <StyledInput
              label={t('FIELDS.FORMED_AT')}
              readOnly
              value={currentProcess?.formed_at && moment(currentProcess?.formed_at).format('DD.MM.yyyy • HH:mm')}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <StyledInput
              label={
                currentProcess?.status?.includes('CANCEL') ? t('FIELDS.CANCELED_AT') : t('FIELDS.COMPLETE_DATETIME')
              }
              readOnly
              value={currentProcess?.finished_at && moment(currentProcess?.finished_at).format('DD.MM.yyyy • HH:mm')}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <StyledInput label={'Тип дії'} readOnly value={ProcessType?.[currentProcess?.process_type]} />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            {currentProcess?.status === 'IN_PROCESS' ? (
              <DatePicker
                label={t('FIELDS.PLANNED_DATE_OF_ACTION_AP')}
                value={mustBeFinishedAt}
                onChange={(date) => setMustBeFinishedAt(date)}
                error={formingError?.data?.must_be_finished_at}
                outFormat={'YYYY-MM-DDTHH:mm:ssZ'}
              />
            ) : (
              <StyledInput
                label={t('FIELDS.PLANNED_DATE_OF_ACTION_AP')}
                readOnly
                value={
                  currentProcess?.must_be_finished_at &&
                  moment(currentProcess?.must_be_finished_at).format('DD.MM.yyyy')
                }
              />
            )}
          </Grid>
          <Grid item xs={12} md={6} lg={6}>
            <StyledInput
              label={t('FIELDS.INITIATOR_COMPANY')}
              readOnly
              value={currentProcess?.initiator_company?.short_name}
            />
          </Grid>
        </Grid>
      </div>
      {data?.aps?.data && (
        <>
          <DetailsTable
            data={data?.aps?.data || []}
            status={currentProcess?.status}
            setParams={setParams}
            params={params}
            logTags={logTags}
          />
          <Pagination
            {...data?.aps}
            loading={isFetching}
            params={params}
            onPaginate={(v) => {
              setParams({ ...params, ...v });
              viewLog();
            }}
          />
        </>
      )}
    </>
  );
};

export default DetailsTab;

const DetailsTable = ({ data, status, setParams, params, logTags }) => {
  const { t } = useTranslation();
  const { uid } = useParams();
  const [search, setSearch] = useState({});
  const timeout = useRef(null);
  const MIN_SEARCH_LENGHT = 3;
  const [remove] = useRemoveAccountingPointMutation();
  const [removePointModal, setRemovePointModal] = useState(null);
  const searchLog = useSearchLog(logTags, 'process', uid);

  useEffect(() => {
    setSearch({});
  }, [status]);

  const columns = ['eic', 'balance_supplier', 'customer', 'region', 'city'];

  const onSearch = (key, value) => {
    setSearch({ ...search, [key]: value });
    if (value && value.length < MIN_SEARCH_LENGHT) return;
    clearTimeout(timeout.current);
    timeout.current = setTimeout(() => {
      setParams({ ...search, [key]: value, page: 1, size: params.size });
      searchLog();
    }, 1000);
  };

  const onRemoveAccountingPoint = () => {
    remove({ uid, ap_uid: removePointModal });
    setRemovePointModal(null);
  };

  return (
    <>
      <StyledTable>
        <TableHead>
          <TableRow>
            <TableCell>
              <p>{t('FIELDS.EIC_CODE')}</p>
              <input type="text" value={search.eic || ''} onChange={({ target }) => onSearch('eic', target.value)} />
            </TableCell>
            <TableCell>
              <p>{t('FIELDS.SUPPLIER')}</p>
              <input
                type="text"
                value={search.balance_supplier || ''}
                onChange={({ target }) => onSearch('balance_supplier', target.value)}
              />
            </TableCell>
            <TableCell>
              <p>{t('FIELDS.AP_CUSTOMER_CODE')}</p>
              <input
                type="text"
                value={search.customer_id || ''}
                onChange={({ target }) => onSearch('customer_id', target.value)}
              />
            </TableCell>
            <TableCell>
              <p>{t('FIELDS.REGION')}</p>
              <input
                type="text"
                value={search.region || ''}
                onChange={({ target }) => onSearch('region', target.value)}
              />
            </TableCell>
            <TableCell>
              <p>{t('FIELDS.CITY')}</p>
              <input type="text" value={search.city || ''} onChange={({ target }) => onSearch('city', target.value)} />
            </TableCell>
            {status !== 'IN_PROCESS' && (
              <TableCell data-marker="is-dropped-out">{t('FIELDS.DROPPED_OUT_OF_PROCESS')}</TableCell>
            )}
            {(status === 'IN_PROCESS' || status === 'FORMED') && (
              <TableCell data-marker="delete-accounting-point"></TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.length < 1 ? (
            <NotResultRow span={8} text={t('NO_POINTS_FOUND')} />
          ) : (
            data?.map((row) => (
              <TableRow tabIndex={-1} data-marker="table-row" className="body__table-row" key={row?.uid}>
                {columns.map((id) => (
                  <TableCell key={id} data-marker={id}>
                    {row[id]}
                  </TableCell>
                ))}
                {status !== 'IN_PROCESS' && (
                  <TableCell data-marker="dropped-out" align="center">
                    {row?.dropped_out ? (
                      <LightTooltip title={row.dropped_at ? moment(row.dropped_at).format('DD.MM.yyyy • HH:mm') : ''}>
                        <Chip
                          label={t('CONTROLS.YES')}
                          size="small"
                          style={{ color: '#008C0C', backgroundColor: 'rgba(209, 237, 243, 0.49)' }}
                        />
                      </LightTooltip>
                    ) : (
                      <LightTooltip title={row.dropped_at ? moment(row.dropped_at).format('DD.MM.yyyy • HH:mm') : ''}>
                        <Chip
                          label={t('CONTROLS.NO')}
                          size="small"
                          style={{ color: '#FC1F1F', backgroundColor: 'rgba(209, 237, 243, 0.49)' }}
                        />
                      </LightTooltip>
                    )}
                  </TableCell>
                )}
                {(status === 'IN_PROCESS' || status === 'FORMED') && (
                  <TableCell data-marker={'delete'}>
                    <CircleButton
                      data-marker="delete-accounting-point-button"
                      type={'delete'}
                      size={'small'}
                      title={t('CONTROLS.REMOVE_AP_FROM_PROCESS')}
                      disabled={row?.dropped_out}
                      onClick={() => setRemovePointModal(row.uid)}
                    />
                  </TableCell>
                )}
              </TableRow>
            ))
          )}
        </TableBody>
      </StyledTable>
      <CancelModal
        text={t('ARE_YOU_SURE_YOU_WANT_TO_REMOVE_AP_FROM_PROCESS')}
        open={Boolean(removePointModal)}
        onClose={() => setRemovePointModal(null)}
        onSubmit={onRemoveAccountingPoint}
      />
    </>
  );
};
