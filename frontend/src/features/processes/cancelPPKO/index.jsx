import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { checkPermissions } from '../../../util/verifyRole';
import Page from '../../../Components/Global/Page';
import CancelModal from '../../../Components/Modal/CancelModal';
import CircleButton from '../../../Components/Theme/Buttons/CircleButton';
import Statuses from '../../../Components/Theme/Components/Statuses';
import DelegateBtn from '../../delegate/delegateBtn';
import { mainApi } from '../../../app/mainApi';
import {
  useCancelPPKORegistrationQuery,
  useInitCancelPPKORegistrationMutation,
  useUpdateCancelPPKORegistrationMutation
} from './api';
import LayoutAkoPPKO from './components/LayoutAkoPPKO';
import LayoutPPKO from './components/LayoutPPKO';
import { defaultParams, updateParams } from './slice';
import { useTranslation } from 'react-i18next';

export const CANCEL_PPKO_ACCEPT_ROLES = ['АКО','АКО_Процеси','АКО_ППКО','АКО_Користувачі','АКО_Довідники','АТКО','АДКО','ОЗКО','ОЗД','ОДКО'];

const CancelPPKO = () => {
  const { uid } = useParams();
  const {t} = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { params } = useSelector((store) => store.cancelPPKO);

  const [exitModalText, setExitModalText] = useState('');
  const [cancelModalText, setCancelModalText] = useState('');
  const [delegating, setDelegating] = useState(false);

  const { currentData: autocomplete, isFetching: isLoadingAutocomplete } =
    mainApi.endpoints.autocompleteCancelPPKORegistration.useQueryState(null);
  const [init, { isLoading: isCreating }] = useInitCancelPPKORegistrationMutation({
    fixedCacheKey: 'cancelPPKORegistration_init'
  });

  const { currentData, isFetching, isError } = useCancelPPKORegistrationQuery(uid, {
    skip: !uid
  });
  const [update, { isLoading }] = useUpdateCancelPPKORegistrationMutation();

  const IS_AKO_PPKO = uid
    ? currentData?.created_by_role === 'COMMERCIAL METERING ADMINISTRATOR COMMERCIAL METERING SERVICE'
    : checkPermissions('PROCESSES.CANCEL_PPKO_REGISTRATION.IS_PPKO', ['АКО_ППКО']);
  const loading = isLoadingAutocomplete || isCreating || isFetching || isLoading || delegating;

  useEffect(() => {
    if (uid) return;
    if (IS_AKO_PPKO) {
      dispatch(updateParams({ ...defaultParams, cancel_datetime: autocomplete?.cancel_datetime }));
    } else {
      dispatch(updateParams({ ...autocomplete }));
    }
  }, [dispatch, uid, autocomplete, IS_AKO_PPKO]);

  return (
    <Page
      acceptPermisions={
        uid ? 'PROCESSES.CANCEL_PPKO_REGISTRATION.ACCESS' : 'PROCESSES.CANCEL_PPKO_REGISTRATION.INITIALIZATION'
      }
      acceptRoles={
        uid
          ? CANCEL_PPKO_ACCEPT_ROLES
          : ['АКО_ППКО', 'АТКО', 'ОЗКО', 'ОЗД', 'ОДКО']
      }
      pageName={
        uid
          ? currentData?.id
            ? t('PAGES.CANCEL_PPKO', {id: currentData?.id}) 
            : `${t('LOADING')}...`
          : t('SUBPROCESSES.CANCEL_PPKO_REGISTRATION')
      }
      backRoute={
        uid
          ? '/processes'
          : () =>
              setExitModalText(
                t('EXIT_FROM_PROCESS_CONFIRMATION')
              )
      }
      loading={loading}
      faqKey={'PROCESSES__CANCEL_PPKO_REGISTRATION'}
      notFoundMessage={isError && t('PROCESS_NOT_FOUND')}
      controls={
        <>
          {!uid && (
            <CircleButton
              type={'create'}
              title={t('CONTROLS.FORM')}
              onClick={() =>
                init(params).then((res) => {
                  if (res?.data?.uid) {
                    navigate(res.data.uid, { replace: true });
                  }
                })
              }
              disabled={
                loading ||
                !(IS_AKO_PPKO
                  ? params?.short_name && params?.eic && params?.usreou && params?.cancel_datetime
                  : params?.cancel_datetime)
              }
              dataMarker={'forming'}
            />
          )}
          {!currentData?.request_cancel_approved_at && currentData?.can_cancel && (
            <CircleButton
              type={'remove'}
              title={t('CONTROLS.CANCEL_PROCESS')}
              onClick={() => setCancelModalText(t('CANCEL_PROCESS_CONFIRMATION'))}
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
        </>
      }
    >
      <Statuses
        statuses={
          IS_AKO_PPKO ? ['NEW', 'FORMED', 'DONE', 'CANCELED'] : ['NEW', 'FORMED', 'DONE', 'REJECTED', 'CANCELED']
        }
        currentStatus={currentData?.status || 'NEW'}
      />
      {IS_AKO_PPKO ? <LayoutAkoPPKO /> : <LayoutPPKO />}
      <CancelModal
        text={cancelModalText}
        open={Boolean(cancelModalText)}
        onClose={() => setCancelModalText('')}
        onSubmit={() => {
          setCancelModalText('');
          update({ uid, type: '/cancel' });
        }}
      />
      <CancelModal
        text={exitModalText}
        open={Boolean(exitModalText)}
        onClose={() => setExitModalText('')}
        onSubmit={() => navigate('/processes')}
      />
    </Page>
  );
};

export default CancelPPKO;
