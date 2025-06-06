import Grid from '@material-ui/core/Grid';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { clearSearchPonSuppliers } from '../../../../actions/ponActions';
import { createDisputeTko, getDisputeAtkos, getDisputeBySideAko } from '../../../../actions/processesActions';
import { DropDownInput } from '../../../../Forms/fields/DropDownInput';
import { checkPermissions } from '../../../../util/verifyRole';
import Page from '../../../Global/Page';
import CircleButton from '../../../Theme/Buttons/CircleButton';
import Statuses from '../../../Theme/Components/Statuses';
import DatePicker from '../../../Theme/Fields/DatePicker';
import SelectField from '../../../Theme/Fields/SelectField';
import StyledInput from '../../../Theme/Fields/StyledInput';
import { types } from './disputeSideTypes';
import { useTranslation } from 'react-i18next';

const InitDisputeTko = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    activeOrganization,
    activeRoles: [{ relation_id }],
    full_name
  } = useSelector(({ user }) => user);
  const { loading, error } = useSelector(({ processes }) => processes);
  const [fetchForm, setFetchForm] = useState('');
  const [timeOut, setTimeOut] = useState(null);
  const [errors, setErrors] = useState();
  const [companies, setCompanies] = useState([]);

  const [form, setForm] = useState({
    dispute_request_type: types.UNSELECTED,
    deadline_response_at: null,
    process_description: '',
    side: ''
  });

  const [company, setCompany] = useState({
    short_name: '',
    eic: '',
    usreou: ''
  });

  const [atkos, setAtkos] = useState([]);

  // Check roles & get data
  useEffect(() => {
    if (
      !checkPermissions('PROCESSES.DISPUTE_TKO.INITIALIZATION', [
        'АКО_Процеси',
        'ВТКО',
        'СПМ',
        'ОДКО',
        'АДКО',
        'ОЗД',
        'ОЗКО'
      ])
    ) {
      navigate('/processes');
    }
  }, [navigate, relation_id]);

  useEffect(() => {
    if (form.dispute_request_type === types.BY_SIDE && !atkos.length) {
      dispatch(
        getDisputeAtkos(form.dispute_request_type, (values) => {
          setAtkos([
            {
              short_name: t('TO_EVERYONE'),
              value: ''
            },
            ...values.atko
          ]);
          if (values.company) {
            setCompany({
              ...company,
              eic: values.company?.eic,
              usreou: values.company?.usreou,
              short_name: values.company?.short_name
            });
            setForm((prev) => ({ ...prev, side: values.company?.uid }));
          }
        })
      );
    }
  }, [dispatch, company, atkos.length, form.dispute_request_type]);

  useEffect(() => {
    setFetchForm('');
    if (error) {
      setErrors(error?.response?.data);
    }
  }, [error]);

  const handleSearchApplicantBySide = ({ target: { name, value } }) => {
    setCompany({ ...company, [name]: value });
    clearTimeout(timeOut);
    if (value?.length >= 3) {
      setFetchForm(name);
      setTimeOut(
        setTimeout(() => {
          dispatch(getDisputeBySideAko({ [name]: value }, (data) => setCompanies(data)));
        }, 1000)
      );
    } else {
      setFetchForm('');
      dispatch(clearSearchPonSuppliers());
    }
  };

  const onSelectApplicantBySide = (company) => {
    setCompany({
      ...company,
      eic: company?.eic,
      usreou: company?.usreou,
      short_name: company?.short_name
    });
    setForm({ ...form, side: company?.uid });
    setFetchForm('');
    setErrors(null);
  };

  const handleStart = () => {
    dispatch(
      createDisputeTko(
        form.dispute_request_type === types.BY_SIDE
          ? form
          : {
              process_description: form.process_description,
              deadline_response_at: form.deadline_response_at,
              dispute_request_type: form.dispute_request_type
            },
        (uid) => navigate(`/processes/dispute-tko/${uid}`)
      )
    );
  };

  const handleChangeType = (newValue) => {
    setForm({
      ...form,
      dispute_request_type: newValue,
      deadline_response_at: null,
      process_description: ''
    });
  };

  const handleDisputeLayout = (requestType) => {
    switch (requestType) {
      case types.BY_TKO:
        return (
          <>
            <Grid item xs={12} md={6} lg={3}>
              <DatePicker
                label={t('FIELDS.MUST_BE_FINISHED_AT')}
                value={form.deadline_response_at}
                onChange={(date) => setForm({ ...form, deadline_response_at: date })}
                error={error?.deadline_response_at && String(error?.deadline_response_at)}
              />
            </Grid>
            <Grid item xs={12}>
              <StyledInput
                label={t('FIELDS.JUSTIFICATION')}
                value={form.process_description}
                onChange={({ target }) => setForm({ ...form, process_description: target.value })}
                multiline
                max={500}
                error={form.process_description?.length >= 500 && t('VERIFY_MSG.MAX_SYMBOLS_COUNT_500')}
              />
            </Grid>
          </>
        );
      case types.BY_SIDE:
        return (
          <>
            <Grid item xs={12} md={6} lg={3}>
              <DropDownInput
                label={t('FIELDS.EIC_CODE_TYPE_X_OF_PART')}
                name={'eic'}
                onChange={handleSearchApplicantBySide}
                value={company?.eic || ''}
                open={fetchForm === 'eic'}
                list={companies}
                onSelect={onSelectApplicantBySide}
                error={errors?.eic}
                readOnly={
                  !checkPermissions('PROCESSES.DISPUTE_TKO.INIT_PAGE.FUNCTIONS.CAN_SELECT_COMPANY', ['АКО_Процеси'])
                }
              />
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
              <DropDownInput
                label={t('FIELDS.PART_ID')}
                name={'usreou'}
                onChange={handleSearchApplicantBySide}
                value={company?.usreou || ''}
                open={fetchForm === 'usreou'}
                list={companies}
                onSelect={onSelectApplicantBySide}
                error={errors?.usreou}
                readOnly={
                  !checkPermissions('PROCESSES.DISPUTE_TKO.INIT_PAGE.FUNCTIONS.CAN_SELECT_COMPANY', ['АКО_Процеси'])
                }
              />
            </Grid>
            <Grid item xs={12} md={6} lg={6}>
              <DropDownInput
                label={t('FIELDS.PART_NAME')}
                name={'short_name'}
                onChange={handleSearchApplicantBySide}
                value={company?.short_name || ''}
                open={fetchForm === 'short_name'}
                list={companies}
                onSelect={onSelectApplicantBySide}
                error={errors?.short_name}
                readOnly={
                  !checkPermissions('PROCESSES.DISPUTE_TKO.INIT_PAGE.FUNCTIONS.CAN_SELECT_COMPANY', ['АКО_Процеси'])
                }
              />
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
              <DatePicker
                label={t('FIELDS.MUST_BE_FINISHED_AT')}
                value={form.deadline_response_at}
                onChange={(date) => setForm({ ...form, deadline_response_at: date })}
                error={error?.deadline_response_at && String(error?.deadline_response_at)}
              />
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
              <SelectField
                label={t('FIELDS.SELECT_OS')}
                value={form.atko || t('TO_EVERYONE')}
                error={error?.atko}
                data={atkos.map((tko) => ({ label: tko.short_name, value: tko.uid || 'Усім' }))}
                onChange={(v) => {
                  if (v === t('TO_EVERYONE')) {
                    const { atko, ...formWithoutAtko } = form;
                    setForm(formWithoutAtko);
                  } else {
                    setForm({ ...form, atko: v });
                  }
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <StyledInput
                label={t('FIELDS.JUSTIFICATION')}
                value={form.process_description}
                onChange={({ target }) => setForm({ ...form, process_description: target.value })}
                multiline
                max={500}
                error={form.process_description?.length >= 500 && t('VERIFY_MSG.MAX_SYMBOLS_COUNT_500')}
              />
            </Grid>
          </>
        );
      default:
        return null;
    }
  };

  const handleDisable = (requestType) => {
    switch (requestType) {
      case types.BY_TKO:
        return !form.deadline_response_at || !form.process_description.replaceAll(' ', '').length;
      case types.BY_SIDE:
        return !form.deadline_response_at || !form.side || !form.process_description.replaceAll(' ', '').length;
      default:
        return true;
    }
  };

  return (
    <Page
      pageName={t('PAGES.INIT_DISPUTE_TKO')}
      backRoute={'/processes'}
      loading={loading}
      controls={
        <CircleButton
          type={'create'}
          title={t('CONTROLS.INIT_PROCESS')}
          onClick={handleStart}
          disabled={loading || handleDisable(form.dispute_request_type)}
          dataMarker={'init-btn'}
        />
      }
    >
      <Statuses statuses={['NEW', 'IN_PROCESS', 'FORMED', 'DONE', 'CANCELED']} currentStatus={'NEW'} />
      <div className={'boxShadow'} style={{ padding: 24, marginTop: 16, marginBottom: 16 }}>
        <Grid container spacing={3} alignItems={'flex-start'}>
          <Grid item xs={12} md={6} lg={3}>
            <StyledInput label={t('FIELDS.USER_INITIATOR')} value={full_name} readOnly />
          </Grid>
          <Grid item xs={12} md={6} lg={9}>
            <StyledInput label={t('FIELDS.INITIATOR_COMPANY')} value={activeOrganization?.name} readOnly />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <SelectField
              onChange={handleChangeType}
              data={[
                { value: types.UNSELECTED, label: t('UNSELECTED') },
                { value: types.BY_SIDE, label: t('BY_SIDE') },
                { value: types.BY_TKO, label: t('BY_TKO') }
              ]}
              label={t('FIELDS.REQUEST_TYPE')}
              value={form.dispute_request_type}
            />
          </Grid>
          {handleDisputeLayout(form.dispute_request_type)}
        </Grid>
      </div>
    </Page>
  );
};

export default InitDisputeTko;
