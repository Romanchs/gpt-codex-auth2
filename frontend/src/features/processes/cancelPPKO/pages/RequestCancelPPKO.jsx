import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Page from '../../../../Components/Global/Page';
import Statuses from '../../../../Components/Theme/Components/Statuses';
import CircleButton from '../../../../Components/Theme/Buttons/CircleButton';
import LayoutPPKO from '../components/LayoutPPKO';
import ReasonModal from '../components/ReasonModal';
import { mainApi } from '../../../../app/mainApi';
import { useUpdateRequestCancelPPKORegistrationMutation } from '../api';
import { toggleModal } from '../slice';
import { useTranslation } from 'react-i18next';

export const REQUEST_CANCEL_PPKO_REGISTRATION_ACCEPT_ROLES = ['АКО_ППКО', 'АКО_Довідники', 'АКО_Процеси', 'АКО_Користувачі', 'АКО'];

const RequestCancelPPKO = () => {
  const { uid } = useParams();
  const {t} = useTranslation();
  const dispatch = useDispatch();

  const { data, isFetching, isError } = mainApi.endpoints.cancelPPKORegistration.useQueryState(uid);
  const [update, { isLoading }] = useUpdateRequestCancelPPKORegistrationMutation({
    fixedCacheKey: 'cancelPPKORegistration_finish'
  });

  return (
    <Page
      acceptPermisions={'PROCESSES.CANCEL_PPKO_REGISTRATION.REQUEST_BY_PPKO.ACCESS'}
      acceptRoles={REQUEST_CANCEL_PPKO_REGISTRATION_ACCEPT_ROLES}
      faqKey={'PROCESSES__REQUEST_CANCEL_PPKO_REGISTRATION'}
      pageName={
        data?.id ? t('PAGES.REQUEST_CANCEL_PPKO', {id: data?.id}) : `${t('LOADING')}...`
      }
      backRoute={'/processes'}
      loading={isFetching || isLoading}
      notFoundMessage={isError && t('REQUEST_NOT_FOUND')}
      controls={
        <>
          {data?.can_reject && (
            <CircleButton
              type={'remove'}
              title={t('CONTROLS.REMOVE_PROCESS')}
              onClick={() => dispatch(toggleModal(true))}
              dataMarker={'reject'}
            />
          )}
          {data?.can_finish && (
            <CircleButton
              type={'done'}
              title={t('CONTROLS.APPROVE_PROCESS')}
              onClick={() => update({ uid, type: '/done' })}
              dataMarker={'done'}
            />
          )}
        </>
      }
    >
      <Statuses statuses={['NEW', 'DONE', 'REJECTED', 'CANCELED']} currentStatus={data?.status} />
      <LayoutPPKO />
      <ReasonModal />
    </Page>
  );
};

export default RequestCancelPPKO;
