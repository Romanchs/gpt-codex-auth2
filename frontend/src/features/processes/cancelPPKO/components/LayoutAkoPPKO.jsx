import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import moment from 'moment';
import { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import StyledInput from '../../../../Components/Theme/Fields/StyledInput';
import DelegateInput from '../../../delegate/delegateInput';
import { DropDownInput } from '../../../../Forms/fields/DropDownInput';
import DatePicker from '../../../../Components/Theme/Fields/DatePicker';
import SelectField from '../../../../Components/Theme/Fields/SelectField';
import { ERRORS, REASONS } from '../data';
import {
  useAutocompleteCancelPPKORegistrationQuery,
  useCancelPPKORegistrationQuery,
  useCompaniesCancelPPKORegistrationQuery,
  useInitCancelPPKORegistrationMutation
} from '../api';
import { updateParams } from '../slice';
import { useTranslation } from 'react-i18next';

const LayoutAkoPPKO = () => {
  const { uid } = useParams();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { full_name } = useSelector(({ user }) => user);
  const { params } = useSelector(({ cancelPPKO }) => cancelPPKO);
  const [search, setSearch] = useState({});
  const [errors, setErrors] = useState({});
  const timerID = useRef(null);
  const [searchParam, setSearchParam] = useState();

  const { data: autocomplete } = useAutocompleteCancelPPKORegistrationQuery(null, { skip: uid });
  const { data: companies } = useCompaniesCancelPPKORegistrationQuery(search, {
    skip: uid || !Object.keys(search).length
  });
  const [, { error, reset }] = useInitCancelPPKORegistrationMutation({ fixedCacheKey: 'cancelPPKORegistration_init' });

  const { currentData } = useCancelPPKORegistrationQuery(uid, { skip: !uid });

  const handleCancelDateChange = (v) => {
    setErrors({ ...errors, cancel_datetime: v ? null : ERRORS.REQUIRED_FIELD });
    dispatch(updateParams({ cancel_datetime: v ? moment(v).format() : null }));
  };

  const handleInputChange = (name, isRequired, isSearchParam) => (event) => {
    const value = event.target.value;
    setErrors({ ...errors, [name]: !value && isRequired ? ERRORS.REQUIRED_FIELD : null });

    if (isSearchParam) {
      clearTimeout(timerID.current);
      if (value.trim().length >= 3) {
        setSearchParam(name);
        timerID.current = setTimeout(() => setSearch({ [name]: value }), 1000);
      } else {
        setSearchParam('');
      }
    }
    dispatch(updateParams({ [name]: value }));
    if (name === 'comment' && value.length <= 250) {
      reset();
    }
  };

  const handleSelect = (company) => {
    dispatch(updateParams({ eic: company?.eic, usreou: company?.usreou, short_name: company?.short_name }));
    setErrors(
      Object.fromEntries(Object.entries(errors).filter(([k]) => k !== 'eic' && k !== 'usreou' && k !== 'short_name'))
    );
    setSearchParam('');
  };

  return (
    <>
      <Box className={'boxShadow'} sx={{ p: 3, mt: 2, mb: 2 }}>
        <Grid container spacing={3} alignItems={'flex-start'}>
          <Grid item xs={12} md={6}>
            <DropDownInput
              label={t('FIELDS.SHORT_PPKO_NAME')}
              value={uid ? currentData?.ppko_company?.short_name : params?.short_name}
              error={errors?.short_name || error?.data?.short_name}
              onChange={handleInputChange('short_name', true, true)}
              open={searchParam === 'short_name'}
              list={companies}
              onSelect={handleSelect}
              emptyMessage={t('NO_PPKO')}
              required={!uid}
              readOnly={Boolean(uid)}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <DropDownInput
              label={t('FIELDS.EIC_CODE_PPKO')}
              value={uid ? currentData?.ppko_company?.eic : params?.eic}
              error={errors?.eic || error?.data?.eic}
              onChange={handleInputChange('eic', true, true)}
              open={searchParam === 'eic'}
              list={companies}
              onSelect={handleSelect}
              emptyMessage={t('NO_PPKO')}
              required={!uid}
              readOnly={Boolean(uid)}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <DropDownInput
              label={t('FIELDS.USREOU')}
              value={uid ? currentData?.ppko_company?.usreou : params?.usreou}
              error={errors?.usreou || error?.data?.usreou}
              onChange={handleInputChange('usreou', true, true)}
              open={searchParam === 'usreou'}
              list={companies}
              onSelect={handleSelect}
              emptyMessage={t('NO_PPKO')}
              required={!uid}
              readOnly={Boolean(uid)}
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
                value={params?.cancel_datetime}
                error={errors?.cancel_datetime || error?.data?.cancel_datetime}
                onChange={handleCancelDateChange}
                minDate={autocomplete?.cancel_datetime}
                minDateMessage={t('VERIFY_MSG.ANUL_REGISTRATION_BEFORE_25_DAYS')}
                outFormat={'YYYY-MM-DD'}
                required
              />
            )}
          </Grid>
          <Grid item xs={12} md={4}>
            {uid ? (
              <StyledInput
                label={t('FIELDS.ANUL_REASON')}
                value={REASONS[currentData?.ppko_company?.cancel_type]}
                readOnly
              />
            ) : (
              <SelectField
                label={t('FIELDS.ANUL_REASON')}
                value={params?.cancel_type}
                data={Object.keys(REASONS).map((value) => ({ value, label: REASONS[value] }))}
                onChange={(value) => handleInputChange('cancel_type')({ target: { value } })}
              />
            )}
          </Grid>
          <Grid item xs={12}>
            <StyledInput
              label={t('FIELDS.NOTE')}
              value={uid ? currentData?.ppko_company?.comment : params?.comment}
              error={errors?.comment || error?.data?.comment}
              onChange={handleInputChange('comment')}
              readOnly={Boolean(uid)}
            />
          </Grid>
        </Grid>
      </Box>
      <Box className={'boxShadow'} sx={{ p: 3, mt: 2, mb: 2 }}>
        <Grid container spacing={3} alignItems={'flex-start'}>
          <Grid item xs={12} md={5}>
            <DelegateInput
              label={t('FIELDS.USER_INITIATOR')}
              disabled
              value={uid ? currentData?.initiator?.username : full_name}
              data={currentData?.delegation_history || []}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <StyledInput
              label={t('FIELDS.FORMED_AT')}
              value={currentData?.formed_at && moment(currentData?.formed_at).format('DD.MM.yyyy • HH:mm')}
              disabled
            />
          </Grid>
          <Grid item xs={12} md={5}>
            <StyledInput
              label={t('FIELDS.INITIATOR_COMPANY')}
              value={currentData?.initiator_company?.full_name}
              disabled
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <StyledInput
              label={currentData?.status === 'DONE' ? t('FIELDS.COMPLETE_DATETIME') : t('FIELDS.CANCELED_AT')}
              value={currentData?.finished_at && moment(currentData?.finished_at).format('DD.MM.yyyy • HH:mm')}
              disabled
            />
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default LayoutAkoPPKO;
