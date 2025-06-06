import Grid from '@material-ui/core/Grid';
import moment from 'moment';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { clearPonRequestTko, downloadActualDkoTkos, getPonActualDko } from '../../../../actions/ponActions';
import { checkPermissions } from '../../../../util/verifyRole';
import Page from '../../../Global/Page';
import CircleButton from '../../../Theme/Buttons/CircleButton';
import StyledInput from '../../../Theme/Fields/StyledInput';
import { useTranslation } from 'react-i18next';

export const REQUEST_ACTUAL_DKO_ACCEPT_ROLES = ['АКО','АКО_Процеси','АКО_ППКО','АКО_Користувачі','АКО_Довідники','ОДКО'];

const RequestAD = () => {
  const {t} = useTranslation();
  const location = useLocation();
  const dispatch = useDispatch();
  const { loading, data, notFound } = useSelector((store) => store.pon.requestTko);
  const activeRoles = useSelector((store) => store.user.activeRoles);
  const { uid } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (
      checkPermissions('PROCESSES.PON.REQUEST_ACTUAL_DKO.ACCESS', REQUEST_ACTUAL_DKO_ACCEPT_ROLES)
    ) {
      dispatch(getPonActualDko(uid));
    } else {
      navigate('/processes');
    }
    return () => dispatch(clearPonRequestTko());
  }, [dispatch, navigate, activeRoles, uid]);

  const handleDownloadAll = () => {
    dispatch(downloadActualDkoTkos(uid));
  };

  const handleUpload = () => {
    navigate('/gts/files', {
      state: { from: location }
    });
  };

  return (
    <Page
      pageName={data?.id && !loading ? t('PAGES.PON_REQUEST_AD_ID', {id: data?.id}) : t('PAGES.PON_REQUEST_AD')}
      backRoute={'/processes'}
      faqKey={'PROCESSES__REQUEST_ACTUAL_DKO'}
      notFoundMessage={notFound && t('REQUEST_NOT_FOUND')}
      loading={loading}
      controls={
        <>
          <CircleButton type={'download'} onClick={handleDownloadAll} title={t('CONTROLS.TKO_LIST')} />
          {checkPermissions('PROCESSES.PON.REQUEST_ACTUAL_DKO.CONTROLS.UPLOAD', [
            'АКО',
            'АКО_Процеси',
            'АКО_Користувачі',
            'ОДКО'
          ]) && <CircleButton type={'upload'} onClick={handleUpload} title={t('CONTROLS.IMPORT_DKO')} />}
        </>
      }
    >
      <div className={'boxShadow'} style={{ padding: 24, marginTop: 16, marginBottom: 16 }}>
        <Grid container spacing={3} alignItems={'center'}>
          <Grid item xs={12} md={4} lg={3}>
            <StyledInput
              label={t('FIELDS.PERIOD_PROVIDE_INFO')}
              disabled
              value={data?.period_provide_info && moment(data?.period_provide_info).format('DD.MM.yyy')}
            />
          </Grid>
          <Grid item xs={12} md={4} lg={3}>
            <StyledInput
              label={t('FIELDS.TKO_NUMBER_FOR_GET_INFO')}
              disabled
              value={data?.tko_number_for_get_info?.toString()}
            />
          </Grid>
          <Grid item xs={12} md={4} lg={3}>
            <StyledInput
              label={t('FIELDS.MUST_BE_FINISHED_AT')}
              disabled
              value={data?.must_be_finished_at && moment(data?.must_be_finished_at).format('DD.MM.yyyy • HH:mm')}
            />
          </Grid>
        </Grid>
      </div>
      <div className={'boxShadow'} style={{ padding: 24, marginTop: 16 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <StyledInput label={t('FIELDS.USER_INITIATOR')} disabled value={data?.initiator} />
          </Grid>
          <Grid item xs={12} md={3}>
            <StyledInput
              label={t('FIELDS.CREATED_AT')}
              disabled
              value={data?.created_at && moment(data?.created_at).format('DD.MM.yyyy • HH:mm')}
            />
          </Grid>
          <Grid item xs={12}>
            <StyledInput label={t('FIELDS.INITIATOR_COMPANY')} disabled value={data?.initiator_company} />
          </Grid>
        </Grid>
      </div>
    </Page>
  );
};

export default RequestAD;
