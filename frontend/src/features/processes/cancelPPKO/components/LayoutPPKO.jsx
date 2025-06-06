import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import moment from 'moment';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import StyledInput from '../../../../Components/Theme/Fields/StyledInput';
import DatePicker from '../../../../Components/Theme/Fields/DatePicker';
import { ERRORS, REASONS } from '../data';
import {
  useAutocompleteCancelPPKORegistrationQuery,
  useCancelPPKORegistrationQuery,
  useInitCancelPPKORegistrationMutation
} from '../api';
import { updateParams } from '../slice';
import { useTranslation } from 'react-i18next';

const LayoutPPKO = () => {
  const { uid } = useParams();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { full_name } = useSelector(({ user }) => user);
  const { params } = useSelector(({ cancelPPKO }) => cancelPPKO);
  const [errors, setErrors] = useState({});

  const { data: autocomplete } = useAutocompleteCancelPPKORegistrationQuery(null, { skip: uid });
  const [, { error, reset }] = useInitCancelPPKORegistrationMutation({ fixedCacheKey: 'cancelPPKORegistration_init' });

  const { currentData } = useCancelPPKORegistrationQuery(uid, { skip: !uid });

  const handleCancelDateChange = (v) => {
    setErrors({ ...errors, cancel_datetime: v ? null : ERRORS.REQUIRED_FIELD });
    dispatch(updateParams({ cancel_datetime: v ? moment(v).format() : null }));
  };

  const handleCommentChange = (e) => {
    setErrors({ ...errors, comment: null });
    dispatch(updateParams({ comment: e.target.value }));
    if (e.target.value.length <= 250) {
      reset();
    }
  };

  return (
    <>
      <Box className={'boxShadow'} sx={{ p: 3, mt: 2, mb: 2 }}>
        <Grid container spacing={3} alignItems={'flex-start'}>
          <Grid item xs={12} md={6}>
            <StyledInput
              label={t('FIELDS.SHORT_PPKO_NAME')}
              value={uid ? currentData?.ppko_company?.short_name : autocomplete?.short_name}
              readOnly
              required={!uid}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <StyledInput
              label={t('FIELDS.EIC_CODE_PPKO')}
              value={uid ? currentData?.ppko_company?.eic : autocomplete?.eic}
              readOnly
              required={!uid}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <StyledInput
              label={t('FIELDS.USREOU')}
              value={uid ? currentData?.ppko_company?.usreou : autocomplete?.usreou}
              readOnly
              required={!uid}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            {uid ? (
              <StyledInput
                label={t('FIELDS.ANUL_DATE')}
                value={
                  currentData?.ppko_company?.cancel_datetime &&
                  moment(currentData?.ppko_company?.cancel_datetime).format('DD.MM.yyyy')
                }
                readOnly
              />
            ) : (
              <DatePicker
                label={t('FIELDS.ANUL_DATE')}
                value={params.cancel_datetime}
                error={errors?.cancel_datetime || error?.data?.cancel_datetime}
                onChange={handleCancelDateChange}
                minDate={autocomplete?.cancel_datetime}
                minDateMessage={t('VERIFY_MSG.ANUL_REGISTRATION_BEFORE_25_DAYS')}
                outFormat={'YYYY-MM-DD'}
                required
              />
            )}
          </Grid>
          <Grid item xs={12} md={3}>
            <StyledInput
              label={t('FIELDS.ANUL_REASON')}
              value={REASONS[uid ? currentData?.ppko_company?.cancel_type : autocomplete?.cancel_type]}
              readOnly
              required={!uid}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <StyledInput
              label={t('FIELDS.CONSIDERATION_DATETIME')}
              value={currentData?.created_at && moment(currentData?.created_at).format('DD.MM.yyyy • HH:mm')}
              readOnly
            />
          </Grid>
          <Grid item xs={12} md={3}>
            {currentData?.request_cancel_rejected_at ? (
              <StyledInput
                label={t('FIELDS.REQUEST_CANCEL_REJECTED_DATE')}
                value={
                  currentData?.request_cancel_rejected_at &&
                  moment(currentData?.request_cancel_rejected_at).format('DD.MM.yyyy • HH:mm')
                }
                readOnly
              />
            ) : (
              <StyledInput
                label={t('FIELDS.REQUEST_CANCEL_APPROVED_DATE')}
                value={
                  currentData?.request_cancel_approved_at &&
                  moment(currentData?.request_cancel_approved_at).format('DD.MM.yyyy • HH:mm')
                }
                readOnly
              />
            )}
          </Grid>
          <Grid item xs={12}>
            <StyledInput
              label={t('FIELDS.NOTE')}
              value={uid ? currentData?.ppko_company?.comment : params.comment}
              error={errors?.comment || error?.data?.comment}
              onChange={handleCommentChange}
              readOnly={Boolean(uid)}
            />
          </Grid>
        </Grid>
      </Box>
      <Box className={'boxShadow'} sx={{ p: 3, mt: 2, mb: 2 }}>
        <Grid container spacing={3} alignItems={'flex-start'}>
          <Grid item xs={12} md={5}>
            <StyledInput
              label={t('FIELDS.USER_INITIATOR')}
              value={uid ? currentData?.initiator?.username : full_name}
              disabled
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <StyledInput
              label={t('FIELDS.CREATED_AT')}
              value={currentData?.created_at && moment(currentData?.created_at).format('DD.MM.yyyy • HH:mm')}
              disabled
            />
          </Grid>
          {currentData?.status?.startsWith('CANCELED') && currentData?.finished_at && (
            <Grid item xs={12} md={3}>
              <StyledInput
                label={t('FIELDS.CANCELED_AT')}
                value={currentData?.finished_at && moment(currentData?.finished_at).format('DD.MM.yyyy • HH:mm')}
                disabled
              />
            </Grid>
          )}
          <Grid item xs={12}>
            <StyledInput
              label={t('FIELDS.INITIATOR_COMPANY')}
              value={uid ? currentData?.initiator_company?.full_name : autocomplete?.short_name}
              disabled
            />
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default LayoutPPKO;
