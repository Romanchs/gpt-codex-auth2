import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { mainApi } from '../../../../app/mainApi';
import StyledInput from '../../../../Components/Theme/Fields/StyledInput';
import DatePicker from '../../../../Components/Theme/Fields/DatePicker';
import DelegateInput from '../../../delegate/delegateInput';
import { useInitChangePaymentTypeMutation } from '../api';
import { setData } from '../slice';
import Table from './Table';

const DetailsTab = () => {
  const { uid } = useParams();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const companyName = useSelector((store) => store.user.organizations.find((i) => i.active).name);
  const userName = useSelector((store) => store.user.full_name);
  const payment_change_date = useSelector((store) => store.changePaymentType.payment_change_date);
  const params = useSelector((store) => store.changePaymentType.params);

  const { currentData } = mainApi.endpoints.changePaymentType.useQueryState({ uid, params });
  const [, { error }] = useInitChangePaymentTypeMutation({ fixedCacheKey: 'changePaymentType_init' });

  const paymentMinDate = useMemo(() => moment(), []);
  // const paymentMinDate = useMemo(() => {
  //   const plusMonth = moment().daysInMonth() - moment().format('DD') >= 20 ? 1 : 2;
  //   return `2024-${moment().add(plusMonth, 'months').format('MM')}-01`;
  // }, []);

  return (
    <>
      <Box className={'boxShadow'} sx={{ mt: 2, mb: 2, p: 3 }}>
        <Grid container spacing={2} alignItems={'flex-start'}>
          <Grid item xs={12} md={6} lg={3}>
            <DelegateInput
              label={t('FIELDS.USER_INITIATOR')}
              value={uid ? currentData?.initiator : userName}
              readOnly
              data={currentData?.delegation_history || []}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <StyledInput
              label={t('FIELDS.CREATED_AT')}
              value={currentData?.created_at && moment(currentData?.created_at).format('DD.MM.yyyy • HH:mm')}
              readOnly
            />
          </Grid>

          <Grid item xs={12} md={6} lg={3}>
            <StyledInput
              label={
                currentData?.status?.startsWith('CANCELED') ? t('FIELDS.CANCELED_AT') : t('FIELDS.COMPLETE_DATETIME')
              }
              readOnly
              value={currentData?.finished_at && moment(currentData?.finished_at).format('DD.MM.yyyy • HH:mm')}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <StyledInput label={t('FIELDS.UNIQUE_APS')} readOnly value={currentData?.unique_aps?.toString()} />
          </Grid>
          <Grid item xs={12} md={6}>
            <StyledInput
              label={t('FIELDS.INITIATOR_COMPANY_NAME')}
              value={uid ? currentData?.initiator_company : companyName}
              readOnly
            />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            {!uid || currentData?.status === 'NEW' ? (
              <DatePicker
                label={t('FIELDS.PAYMENT_TYPE_CHANGE_DATE')}
                value={payment_change_date}
                onChange={(payment_change_date) => dispatch(setData(payment_change_date))}
                error={error?.data?.payment_change_date}
                minDate={moment(paymentMinDate)}
                minDateMessage={t('VERIFY_MSG.MIN_DATE_MESSAGE_WITH_PARAM', {
                  param: moment(paymentMinDate).format('DD.MM.yyyy')
                })}
              />
            ) : (
              <StyledInput
                label={t('FIELDS.PAYMENT_TYPE_CHANGE_DATE')}
                value={
                  !uid
                    ? moment().format('DD.MM.yyyy')
                    : currentData?.payment_change_date && moment(currentData?.payment_change_date).format('DD.MM.yyyy')
                }
                readOnly
              />
            )}
          </Grid>
        </Grid>
      </Box>
      {currentData?.status && currentData?.status !== 'NEW' && <Table />}
    </>
  );
};

export default DetailsTab;
