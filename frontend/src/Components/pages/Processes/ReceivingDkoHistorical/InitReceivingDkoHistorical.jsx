import { Grid } from '@material-ui/core';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { clearCurrentProcess, initReceivingDkoHistorical } from '../../../../actions/processesActions';
import { checkPermissions } from '../../../../util/verifyRole';
import Page from '../../../Global/Page';
import CircleButton from '../../../Theme/Buttons/CircleButton';
import Statuses from '../../../Theme/Components/Statuses';
import DatePicker from '../../../Theme/Fields/DatePicker';
import StyledInput from '../../../Theme/Fields/StyledInput';
import {useTranslation} from "react-i18next";

const InitReceivingDkoHistorical = () => {
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    start_dko_data: null,
    end_dko_data: null,
    must_be_finished_at: null
  });
  const {
    activeOrganization,
    activeRoles: [{ relation_id }],
    full_name
  } = useSelector(({ user }) => user);
  const { loading, error } = useSelector(({ processes }) => processes);
  const [errors, setErrors] = useState({ start_dko_data: true, end_dko_data: true, must_be_finished_at: true });

  // Check roles & get data
  useEffect(() => {
    if (!checkPermissions('PROCESSES.RECEIVING_DKO_HISTORICAL.INITIALIZATION', ['СВБ', 'АКО_Процеси'])) {
      navigate('/processes');
    }
  }, [navigate, relation_id]);

  // Clear store after unmount
  useEffect(() => () => dispatch(clearCurrentProcess()), [dispatch]);

  const handleInit = () => {
    dispatch(initReceivingDkoHistorical(form, (uid) => navigate(`/processes/receiving-dko-historical/${uid}`)));
  };

  const verifyDateValue = (date) => Boolean(date == 'Invalid Date' ? false : date);

  const handleChange = (formKey) => (v) => {
    setForm({ ...form, [formKey]: v });
    setErrors({ ...errors, [formKey]: !verifyDateValue(v) });
  };

  const handleError = (formKey) => (error) => {
    setErrors({ ...errors, [formKey]: Boolean(error || !verifyDateValue(form[formKey])) });
  };

  return (
    <Page
      pageName={t('SUBPROCESSES.RECEIVING_DKO_HISTORICAL')}
      backRoute={'/processes'}
      loading={loading}
      controls={
        <>
          <CircleButton
            type={'create'}
            onClick={handleInit}
            title={t('CONTROLS.TAKE_TO_WORK')}
            disabled={Object.values(errors).includes(true)}
          />
        </>
      }
    >
      <Statuses statuses={['NEW', 'IN_PROCESS', 'FORMED', 'DONE', 'CANCELED']} currentStatus={'NEW'} />
      <div className={'boxShadow'} style={{ padding: 24, marginTop: 16, marginBottom: 16 }}>
        <Grid container spacing={3} alignItems={'flex-start'}>
          <Grid item xs={12} md={6} lg={3}>
            <StyledInput label={t('FIELDS.USER_INITIATOR')} readOnly value={full_name} />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <StyledInput label={t('FIELDS.INITIATOR_COMPANY')} readOnly value={activeOrganization?.name} />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <DatePicker
              label={t('FIELDS.INFORMATION_START_DATE')}
              value={form.start_dko_data}
              onChange={handleChange('start_dko_data')}
              minDate={moment('07.01.2019')}
              maxDate={form.end_dko_data ? moment(form.end_dko_data) : moment().subtract('1', 'days')}
              error={error?.end_dko_data}
              onError={handleError('start_dko_data')}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <DatePicker
              label={t('FIELDS.INFORMATION_END_DATE')}
              value={form.end_dko_data}
              onChange={handleChange('end_dko_data')}
              minDate={moment(form.start_dko_data)}
              error={error?.end_dko_data}
              onError={handleError('end_dko_data')}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <DatePicker
              label={t('FIELDS.DATE_OF_ANSWER')}
              value={form.must_be_finished_at}
              onChange={handleChange('must_be_finished_at')}
              minDate={moment()}
              error={error?.must_be_finished_at}
              onError={handleError('must_be_finished_at')}
            />
          </Grid>
        </Grid>
      </div>
    </Page>
  );
};
export default InitReceivingDkoHistorical;
