import Grid from '@material-ui/core/Grid';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import {
  clearCurrentProcess,
  getConnectDisconnectDetails,
  getConnectionDisconnectionAps,
  rejectConnectionDisconnectionPoint,
  removeConnectionDisconnectionPoint
} from '../../../../actions/processesActions';
import CancelModal from '../../../Modal/CancelModal';
import DatePicker from '../../../Theme/Fields/DatePicker';
import StyledInput from '../../../Theme/Fields/StyledInput';
import { Pagination } from '../../../Theme/Table/Pagination';
import { DISCONNECTION_REASONS } from './data';
import { ACTION_TYPES } from '.';
import InitTable from './InitTable';
import DetailsTable from './DetailsTable';
import TerminationModal from './TerminationModal';
import { RejectModal } from './RejectModal';
import DelegateInput from '../../../../features/delegate/delegateInput';
import { useTranslation } from 'react-i18next';

const DetailsTab = ({ mustBeFinishedAt, setMustBeFinishedAt, selectedTko, setSelectedTko }) => {
  const { t } = useTranslation();
  const { uid } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [params, setParams] = useState({ page: 1, size: 25 });
  const [terminate, setTerminate] = useState(null);
  const [rejectModal, setRejectModal] = useState(null);
  const { currentProcess, loading, error } = useSelector(({ processes }) => processes);
  const [removePointModal, setRemovePointModal] = useState(null);
  const [accountingPointsParams, setAccountingPointsParams] = useState(null);
  const [apsCount, setApsCount] = useState(currentProcess?.aps_count || 0);

  useEffect(() => {
    dispatch(
      getConnectDisconnectDetails(
        uid,
        params,
        (data) => {
          if (data && data.status === 'IN_PROCESS') {
            setApsCount(data.aps_count);
            if (data?.aps?.data) {
              setSelectedTko(Object.fromEntries(data.aps.data.map(({ uid }) => [uid, true])));
            }
            setAccountingPointsParams({
              page: 1,
              size: 25,
              connection_status: undefined
            });
          }
        },
        (error) => {
          if (error?.status === 403) {
            dispatch(clearCurrentProcess());
            setTimeout(() => {
              navigate('/processes');
            }, 10);
          }
        }
      )
    );
  }, [dispatch, uid, params]);

  useEffect(() => {
    if (currentProcess && currentProcess.status === 'IN_PROCESS' && accountingPointsParams)
      dispatch(getConnectionDisconnectionAps(uid, accountingPointsParams));
  }, [dispatch, accountingPointsParams]);

  const handleDelete = () => {
    const point_uid = removePointModal;
    setRemovePointModal(null);
    dispatch(
      removeConnectionDisconnectionPoint(uid, point_uid, (status) => {
        if (status !== currentProcess?.status) {
          setParams({ size: 25, page: 1 });
          return;
        }
        dispatch(getConnectDisconnectDetails(uid, params));
      })
    );
  };

  const handleReject = (reason) => {
    setRejectModal(null);
    dispatch(
      rejectConnectionDisconnectionPoint(uid, { uid: rejectModal?.uid, reason }, () =>
        dispatch(getConnectDisconnectDetails(uid, params))
      )
    );
  };

  return (
    <>
      <div className={'boxShadow'} style={{ padding: 24, marginTop: 16, marginBottom: 16 }}>
        <Grid container spacing={3} alignItems={'flex-start'}>
          <Grid item xs={12} md={6} lg={3}>
            <DelegateInput
              label={t('FIELDS.USER_INITIATOR')}
              readOnly
              value={currentProcess?.initiator}
              data={currentProcess && !currentProcess.self_managed ? [] : currentProcess?.delegation_history || []}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <StyledInput
              label={t('FIELDS.CREATED_AT')}
              readOnly
              value={currentProcess?.created_at && moment(currentProcess?.created_at).format('DD.MM.yyyy • HH:mm')}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <StyledInput
              label={t('FIELDS.COMPLETE_DATETIME')}
              readOnly
              value={currentProcess?.finished_at && moment(currentProcess?.finished_at).format('DD.MM.yyyy • HH:mm')}
            />
          </Grid>
          {currentProcess?.action_type === 'DISCONNECT_TKO' && (
            <Grid item xs={12} md={6} lg={3}>
              <StyledInput
                label={t('FIELDS.DISCONNECTED_REASON')}
                value={
                  currentProcess?.reason &&
                  t(DISCONNECTION_REASONS.find((i) => i.value === currentProcess?.reason)?.label)
                }
                readOnly
              />
            </Grid>
          )}
          <Grid item xs={12} md={6} lg={3}>
            <StyledInput
              label={currentProcess?.status === 'CANCELED' ? t('FIELDS.CANCELED_AT') : t('FIELDS.COMPLETED_AT')}
              readOnly
              value={currentProcess?.completed_at && moment(currentProcess?.completed_at).format('DD.MM.yyyy • HH:mm')}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <StyledInput label={t('FIELDS.INITIATOR_COMPANY')} readOnly value={currentProcess?.initiator_company} />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            {currentProcess?.status === 'IN_PROCESS' ? (
              <DatePicker
                label={
                  currentProcess?.action_type === ACTION_TYPES.disconnect
                    ? t('FIELDS.MUST_BE_DISCONNECTED_AT')
                    : t('FIELDS.MUST_BE_CONNECTED_AT')
                }
                value={mustBeFinishedAt}
                onChange={setMustBeFinishedAt}
                error={error?.detail}
              />
            ) : (
              <StyledInput
                label={
                  currentProcess?.action_type === 'DISCONNECT_TKO'
                    ? t('FIELDS.MUST_BE_DISCONNECTED_AT')
                    : t('FIELDS.MUST_BE_CONNECTED_AT')
                }
                readOnly
                value={
                  currentProcess?.must_be_finished_at &&
                  moment(currentProcess?.must_be_finished_at).format('DD.MM.yyyy')
                }
              />
            )}
          </Grid>
          {currentProcess && !currentProcess.self_managed && (
            <>
              <Grid item xs={12} md={6} lg={3}>
                <DelegateInput
                  label={t('FIELDS.USER_EXECUTOR')}
                  readOnly
                  value={currentProcess?.executor}
                  data={currentProcess?.delegation_history || []}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <StyledInput label={t('FIELDS.EXECUTOR_COMPANY')} value={currentProcess?.executor_company} readOnly />
              </Grid>
              <Grid item xs={12} md={6} lg={3}>
                <StyledInput
                  label={t('FIELDS.FORMED_AT')}
                  value={currentProcess?.started_at && moment(currentProcess?.started_at).format('DD.MM.yyyy • HH:mm')}
                  readOnly
                />
              </Grid>
            </>
          )}
        </Grid>
      </div>
      {currentProcess?.status === 'COMPLETED' && !currentProcess?.self_managed && currentProcess?.complete_reason && (
        <div className={'boxShadow'} style={{ padding: 24, marginTop: 16, marginBottom: 16 }}>
          <Grid container spacing={3} alignItems={'flex-start'}>
            <Grid item xs={12}>
              <StyledInput label={t('FIELDS.COMMENT')} readOnly value={currentProcess?.complete_reason} />
            </Grid>
          </Grid>
        </div>
      )}
      {currentProcess?.status === 'IN_PROCESS' && accountingPointsParams ? (
        <>
          <InitTable
            uid={uid}
            data={currentProcess?.aps?.data || []}
            apsCount={apsCount}
            setApsCount={setApsCount}
            params={accountingPointsParams}
            selectedTkos={selectedTko}
            setSelectedTko={setSelectedTko}
            canChooseAp={currentProcess?.can_choose_aps}
            handleSetParams={(v) => setAccountingPointsParams({ ...accountingPointsParams, ...v, page: 1 })}
            searchReadOnly={accountingPointsParams.action_type === ACTION_TYPES.disconnect ? ['connection_status'] : []}
            isConnected={accountingPointsParams.action_type === ACTION_TYPES.disconnect}
            isConnectProcess={currentProcess?.action_type === ACTION_TYPES.connected}
          />
          <Pagination
            {...currentProcess?.aps}
            loading={loading}
            params={accountingPointsParams}
            onPaginate={(paginate) => setAccountingPointsParams({ ...accountingPointsParams, ...paginate })}
          />
        </>
      ) : (
        <>
          <DetailsTable
            data={currentProcess?.aps?.data || []}
            status={currentProcess?.status}
            isCancel={currentProcess?.can_cancel_aps}
            isConfirm={currentProcess?.can_confirm_aps}
            isReject={currentProcess?.can_reject_aps}
            isDisconnect={currentProcess?.action_type === 'DISCONNECT_TKO'}
            handleConfirm={setTerminate}
            handleDelete={setRemovePointModal}
            handleReject={setRejectModal}
            setParams={setParams}
            params={params}
          />
          <Pagination
            {...currentProcess?.aps}
            loading={loading}
            params={params}
            onPaginate={(v) => setParams({ ...params, ...v })}
          />
        </>
      )}
      <TerminationModal
        data={terminate}
        onClose={() => setTerminate(null)}
        uid={currentProcess?.uid}
        minDate={currentProcess?.must_be_finished_at}
        refetch={() => dispatch(getConnectDisconnectDetails(uid, params))}
      />
      <CancelModal
        text={t('ARE_YOU_SURE_YOU_WANT_TO_REMOVE_AP_FROM_PROCESS')}
        open={Boolean(removePointModal)}
        onClose={() => setRemovePointModal(null)}
        onSubmit={handleDelete}
      />
      <RejectModal
        data={rejectModal}
        open={Boolean(rejectModal)}
        onClose={() => setRejectModal(null)}
        onSubmit={handleReject}
      />
    </>
  );
};

export default DetailsTab;
