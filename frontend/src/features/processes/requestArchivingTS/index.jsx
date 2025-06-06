import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Page from '../../../Components/Global/Page';
import CircleButton from '../../../Components/Theme/Buttons/CircleButton';
import DelegateBtn from '../../delegate/delegateBtn';
import Statuses from '../../../Components/Theme/Components/Statuses';
import { mainApi } from '../../../app/mainApi';
import { useUpdateRequestArchivingTSMutation } from './api';
import { setData } from './slice';
import DetailsTab from './components/DetailsTab';
import RejectModal from './components/RejectModal';

const RequestArchivingTS = () => {
  const { uid } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const body = useSelector((store) => store.requestArchivingTS.data);
  const [rejectModal, setRejectModal] = useState(false);
  const [delegating, setDelegating] = useState(false);

  const queries = useSelector((store) =>
    Object.values(store.mainApi.queries).filter((q) => q.endpointName === 'requestArchivingTS')
  );
  const lastQuery = useMemo(
    () => queries.find((q) => q.startedTimeStamp === Math.max(...queries.map((q) => q.startedTimeStamp))),
    [queries]
  );
  const { currentData, isFetching, isError, error } = mainApi.endpoints.requestArchivingTS.useQueryState(
    lastQuery?.originalArgs
  );
  const [update, { isLoading: isUpdating }] = useUpdateRequestArchivingTSMutation({
    fixedCacheKey: 'requestArchivingTS_update'
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

  return (
    <Page
      acceptPermisions={'PROCESSES.CORRECTION_ARCHIVING_TS.SUBPROCESS.ACCESS'}
      acceptRoles={['АКО_Процеси']}
      pageName={loading ? `${t('LOADING')}...` : t('PAGES.REQUEST_ARCHIVING_TS_ID', { id: currentData?.id })}
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
        </>
      }
    >
      <Statuses
        statuses={['NEW', 'IN_PROCESS', 'DONE', 'REJECTED', 'CANCELED']}
        currentStatus={currentData?.status || 'NEW'}
      />
      <DetailsTab />
      <RejectModal
        text={t('REJECT_PROCESS_REASON')}
        open={rejectModal}
        onClose={() => setRejectModal(false)}
        onSubmit={(body) => {
          setRejectModal(false);
          update({ uid, type: '/reject', body });
        }}
      />
    </Page>
  );
};

export default RequestArchivingTS;
