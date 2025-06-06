import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import Page from '../../../../Components/Global/Page';
import Statuses from '../../../../Components/Theme/Components/Statuses';
import StyledInput from '../../../../Components/Theme/Fields/StyledInput';
import { useExpireCancelPPKORegistrationQuery } from '../api';
import { useTranslation } from 'react-i18next';

export const EXPIRE_CANCEL_PPKO_ACCEPT_ROLES = [
  'АКО',
  'АКО_Процеси',
  'АКО_ППКО',
  'АКО_Користувачі',
  'АКО_Довідники',
  'АТКО',
  'АДКО',
  'ОЗКО',
  'ОЗД',
  'ОДКО'
];

const ExpireCancelPPKO = () => {
  const { uid } = useParams();
  const { t } = useTranslation();
  const { currentData, isFetching } = useExpireCancelPPKORegistrationQuery(uid);

  return (
    <Page
      acceptPermisions={'PROCESSES.CANCEL_PPKO_REGISTRATION.EXPIRE.ACCESS'}
      faqKey={'PROCESSES__CANCEL_PPKO_REGISTRATION_ON_EXPIRE'}
      acceptRoles={EXPIRE_CANCEL_PPKO_ACCEPT_ROLES}
      pageName={t('PAGES.EXPIRE_CANCEL_PPKO', { id: currentData?.id })}
      backRoute={'/processes'}
      loading={isFetching}
    >
      <Statuses statuses={['FORMED', 'DONE', 'CANCELED']} currentStatus={currentData?.status} />
      <Box className={'boxShadow'} sx={{ p: 3, mt: 2, mb: 2 }}>
        <Grid container spacing={3} alignItems={'flex-start'}>
          <Grid item xs={12} md={6}>
            <StyledInput label={t('FIELDS.SHORT_PPKO_NAME')} value={currentData?.ppko_company?.short_name} readOnly />
          </Grid>
          <Grid item xs={12} md={3}>
            <StyledInput label={t('FIELDS.EIC_CODE_PPKO')} value={currentData?.ppko_company?.eic} readOnly />
          </Grid>
          <Grid item xs={12} md={3}>
            <StyledInput label={t('FIELDS.USREOU')} value={currentData?.ppko_company?.usreou} readOnly />
          </Grid>
          <Grid item xs={12} md={2}>
            <StyledInput
              label={t('FIELDS.ANUL_DATE')}
              value={
                currentData?.ppko_company?.cancel_datetime &&
                moment(currentData?.ppko_company?.cancel_datetime).format('DD.MM.yyyy')
              }
              readOnly
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <StyledInput label={t('FIELDS.ANUL_REASON')} value={t('EXPIRE_CANCEL_PPKO_REASON')} readOnly />
          </Grid>
        </Grid>
      </Box>
      <Box className={'boxShadow'} sx={{ p: 3, mt: 2, mb: 2 }}>
        <Grid container spacing={3} alignItems={'flex-start'}>
          <Grid item xs={12} md={2}>
            <StyledInput label={t('FIELDS.USER_INITIATOR')} value={t('SYSTEM_USER')} disabled />
          </Grid>
          <Grid item xs={12} md={5}>
            <StyledInput
              label={t('FIELDS.INITIATOR_COMPANY')}
              value={currentData?.initiator_company?.full_name}
              disabled
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <StyledInput
              label={t('FIELDS.CREATED_AT')}
              value={currentData?.created_at && moment(currentData?.created_at).format('DD.MM.yyyy • HH:mm')}
              disabled
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <StyledInput
              label={currentData?.status === 'CANCELED' ? t('FIELDS.CANCELED_AT') : t('FIELDS.COMPLETE_DATETIME')}
              value={currentData?.finished_at && moment(currentData?.finished_at).format('DD.MM.yyyy • HH:mm')}
              disabled
            />
          </Grid>
        </Grid>
      </Box>
    </Page>
  );
};

export default ExpireCancelPPKO;
