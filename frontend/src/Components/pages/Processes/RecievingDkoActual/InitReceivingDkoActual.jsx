import { Grid } from '@material-ui/core';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import {
  clearCurrentProcess,
  getWorkdaysReceivingDkoActual,
  initReceivingDkoActual
} from '../../../../actions/processesActions';
import { checkPermissions } from '../../../../util/verifyRole';
import Page from '../../../Global/Page';
import CircleButton from '../../../Theme/Buttons/CircleButton';
import Statuses from '../../../Theme/Components/Statuses';
import DatePicker from '../../../Theme/Fields/DatePicker';
import StyledInput from '../../../Theme/Fields/StyledInput';
import {useTranslation} from "react-i18next";

const InitReceivingDkoActual = () => {
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    dko_data: null,
    must_be_finished_at: null
  });
  const {
    activeOrganization,
    activeRoles: [{ relation_id }],
    full_name
  } = useSelector(({ user }) => user);
  const { loading, error } = useSelector(({ processes }) => processes);
  const [errors, setErrors] = useState({});
  const [minFinished, setMinFinished] = useState(moment());

  // Check roles & get data
  useEffect(() => {
    if (!checkPermissions('PROCESSES.RECEIVING_DKO_ACTUAL.INITIALIZATION', ['СВБ', 'АКО_Процеси'])) {
      navigate('/processes');
    }
  }, [navigate, relation_id]);

  // Clear store after unmount
  useEffect(() => () => dispatch(clearCurrentProcess()), [dispatch]);

  useEffect(() => {
    dispatch(
      getWorkdaysReceivingDkoActual(
        {
          date: (moment().isBefore(form?.dko_data) ? moment(form?.dko_data) : moment()).format('YYYY-MM-DD'),
          days: 3
        },
        setMinFinished
      )
    );
  }, [dispatch, form?.dko_data]);

  const handleInit = () => {
    dispatch(initReceivingDkoActual(form, (uid) => navigate(`/processes/receiving-dko-actual/${uid}`)));
  };

  return (
    <Page
      pageName={t('SUBPROCESSES.RECEIVING_DKO_ACTUAL')}
      backRoute={'/processes'}
      loading={loading}
      controls={
        <>
          <CircleButton
            type={'create'}
            onClick={handleInit}
            title={t('CONTROLS.TAKE_TO_WORK')}
            disabled={Boolean(!form.dko_data || !form.must_be_finished_at || Object.values(errors).find((v) => v))}
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
              label={t('FIELDS.DATE_OF_SHOWINGS')}
              value={form.dko_data}
              onChange={(v) => setForm({ ...form, dko_data: v })}
              minDate={moment('07.01.2019')}
              error={error?.dko_data}
              onError={(error) => setErrors({ ...errors, dko_data: error })}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <DatePicker
              label={t('FIELDS.DATE_OF_ANSWER')}
              value={form.must_be_finished_at}
              onChange={(v) => setForm({ ...form, must_be_finished_at: v })}
              minDate={minFinished}
              error={error?.must_be_finished_at}
              onError={(error) => setErrors({ ...errors, must_be_finished_at: error })}
            />
          </Grid>
        </Grid>
      </div>
    </Page>
  );
};
export default InitReceivingDkoActual;
