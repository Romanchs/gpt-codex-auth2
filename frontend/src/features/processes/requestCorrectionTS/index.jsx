import StopRounded from '@mui/icons-material/StopRounded';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Page from '../../../Components/Global/Page';
import CircleButton from '../../../Components/Theme/Buttons/CircleButton';
import DelegateBtn from '../../delegate/delegateBtn';
import Statuses from '../../../Components/Theme/Components/Statuses';
import CancelModal from '../../../Components/Modal/CancelModal';
import { mainApi } from '../../../app/mainApi';
import { useUpdateRequestCorrectionTSMutation } from './api';
import { setData } from './slice';
import DetailsTab from './components/DetailsTab';
import RejectModal from './components/RejectModal';
import { clearState } from './slice';

const RequestCorrectionTS = () => {
  const { uid } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const body = useSelector((store) => store.requestCorrectionTS.data);
  const [rejectModal, setRejectModal] = useState(false);
  const [delegating, setDelegating] = useState(false);
  const [lockingModal, setLockingModal] = useState(false);

  const queries = useSelector((store) =>
    Object.values(store.mainApi.queries).filter((q) => q.endpointName === 'requestCorrectionTS')
  );
  const lastQuery = useMemo(
    () => queries.find((q) => q.startedTimeStamp === Math.max(...queries.map((q) => q.startedTimeStamp))),
    [queries]
  );
  const { currentData, isFetching, isError, error } = mainApi.endpoints.requestCorrectionTS.useQueryState(
    lastQuery?.originalArgs
  );
  const [update, { isLoading: isUpdating, error: updateError }] = useUpdateRequestCorrectionTSMutation({
    fixedCacheKey: 'requestCorrectionTS_update'
  });

  const loading = isFetching || isUpdating || delegating;

  useEffect(() => {
    if (error?.data?.detail === 'У вас немає дозволу на виконання цієї дії.') {
      navigate('/processes');
    }
  }, [navigate, error]);

  useEffect(() => {
    if (!uid) dispatch(setData({}));
  }, [dispatch, uid]);

  useEffect(() => () => dispatch(clearState()), [dispatch]);

  return (
    <Page
      acceptPermisions={'PROCESSES.CORRECTION_ARCHIVING_TS.SUBPROCESS.ACCESS'}
      acceptRoles={['АКО_Процеси']}
      pageName={loading ? `${t('LOADING')}...` : t('PAGES.REQUEST_CORRECTION_TS_ID', { id: currentData?.id })}
      backRoute={'/processes'}
      loading={loading}
      notFoundMessage={isError && t('PROCESS_NOT_FOUND')}
      controls={
        <>
          {currentData?.can_take_to_work && (
            <CircleButton
              type={'create'}
              title={t('CONTROLS.TAKE_TO_WORK')}
              onClick={() => update({ uid, type: '/take-to-work' })}
              dataMarker={'take_to_work'}
            />
          )}
          {currentData?.can_reject && (
            <CircleButton
              type={'remove'}
              title={t('CONTROLS.REMOVE_PROCESS')}
              onClick={() => setRejectModal(true)}
              dataMarker={'cancel'}
            />
          )}
          {currentData?.can_delegate && (
            <DelegateBtn
              process_uid={uid}
              onStarted={() => setDelegating(true)}
              onFinished={() => setDelegating(false)}
              onSuccess={() => window.location.reload()}
            />
          )}
          {currentData?.can_done && (
            <CircleButton
              type={'done'}
              title={t('CONTROLS.DONE_PROCESS')}
              onClick={() => update({ uid, type: '/done', body })}
              dataMarker={'form'}
              disabled={body?.comment?.trim().length > 500}
            />
          )}
          {currentData?.can_locked && (
            <CircleButton
              color={'orange'}
              title={t('CONTROLS.CLOSE_GATE')}
              icon={<StopRounded />}
              onClick={() => setLockingModal(true)}
              dataMarker={'lock'}
            />
          )}
        </>
      }
    >
      <Statuses
        statuses={['NEW', 'IN_PROCESS', 'DONE', 'REJECTED', 'CANCELED']}
        currentStatus={currentData?.status || 'NEW'}
      />
      <DetailsTab error={updateError} />
      <RejectModal
        text={t('REJECT_PROCESS_REASON')}
        open={rejectModal}
        onClose={() => setRejectModal(false)}
        onSubmit={(body) => {
          setRejectModal(false);
          update({ uid, type: '/reject', body });
        }}
      />
      <CancelModal
        text={t('ARE_U_SURE_U_WANT_TO_CLOSED_GATE')}
        open={lockingModal}
        submitType={'green'}
        onClose={() => setLockingModal(false)}
        onSubmit={() => {
          setLockingModal(false);
          update({ uid, type: '/locked' });
        }}
      />
    </Page>
  );
};

export default RequestCorrectionTS;
