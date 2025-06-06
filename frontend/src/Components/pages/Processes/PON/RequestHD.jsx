import Grid from '@material-ui/core/Grid';
import moment from 'moment';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { clearPonRequestTko, downloadHistoricalDkoTkos, getPonHistoricalDko } from '../../../../actions/ponActions';
import { checkPermissions } from '../../../../util/verifyRole';
import Page from '../../../Global/Page';
import CircleButton from '../../../Theme/Buttons/CircleButton';
import StyledInput from '../../../Theme/Fields/StyledInput';
import { useTranslation } from 'react-i18next';

export const REQUEST_HISTORICAL_DKO_ACCEPT_ROLES = ['ОДКО', 'АКО...'];

const RequestHD = () => {
  const {t} = useTranslation();
  const location = useLocation();
  const { loading, data, notFound } = useSelector((store) => store.pon.requestTko);
  const activeRoles = useSelector((store) => store.user.activeRoles);
  const dispatch = useDispatch();
  const { uid } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (checkPermissions('PROCESSES.PON.REQUEST_HISTORICAL_DKO.ACCESS', REQUEST_HISTORICAL_DKO_ACCEPT_ROLES)) {
      dispatch(getPonHistoricalDko(uid));
    } else {
      navigate('/processes');
    }
    return () => dispatch(clearPonRequestTko());
  }, [dispatch, navigate, activeRoles, uid]);

  const handleDownloadAll = () => {
    dispatch(downloadHistoricalDkoTkos(uid));
  };

  const handleUpload = () => {
    navigate('/gts/files', {
      state: { from: location }
    });
  };

  return (
    <Page
      pageName={data?.id && !loading ? t('PAGES.REQUEST_HISTORICAL_DKO_ID', {id: data?.id}) : t('PAGES.REQUEST_HISTORICAL_DKO')}
      backRoute={'/processes'}
      faqKey={'PROCESSES__REQUEST_HISTORICAL_DKO'}
      notFoundMessage={notFound && t('REQUEST_NOT_FOUND')}
      loading={loading}
      controls={
        <>
          <CircleButton type={'download'} onClick={handleDownloadAll} title={t('CONTROLS.TKO_LIST')} />
          {checkPermissions('PROCESSES.PON.REQUEST_HISTORICAL_DKO.CONTROLS.UPLOAD', [
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
              label={t('FIELDS.PERIOD_PROVIDE_INFO_FROM')}
              disabled
              value={data?.period_get_info_from && moment(data?.period_get_info_from).format('DD.MM.yyyy')}
            />
          </Grid>
          <Grid item xs={12} md={4} lg={3}>
            <StyledInput
              label={t('FIELDS.PERIOD_PROVIDE_INFO_TO')}
              disabled
              value={data?.period_get_info_to && moment(data?.period_get_info_to).format('DD.MM.yyyy')}
            />
          </Grid>
          <Grid item xs={12} md={4} lg={3}>
            <StyledInput
              label={t('FIELDS.TKO_NUMBER_FOR_GET_INFO')}
              disabled
              value={data?.tko_number_for_get_info}
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

export default RequestHD;
