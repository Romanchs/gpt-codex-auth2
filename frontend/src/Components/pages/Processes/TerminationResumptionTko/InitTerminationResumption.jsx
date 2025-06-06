import Grid from '@material-ui/core/Grid';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { clearCurrentProcess, initTerminationResumption } from '../../../../actions/processesActions';
import { checkPermissions } from '../../../../util/verifyRole';
import Page from '../../../Global/Page';
import CircleButton from '../../../Theme/Buttons/CircleButton';
import Statuses from '../../../Theme/Components/Statuses';
import SelectField from '../../../Theme/Fields/SelectField';
import StyledInput from '../../../Theme/Fields/StyledInput';
import { DHTab, DHTabs } from '../Components/Tabs';
import {useTranslation} from "react-i18next";

const actionType = {
  TERMINATION_SUPPLY: 'TERMINATION_SUPPLY',
  RESUMPTION_SUPPLY: 'RESUMPTION_SUPPLY'
};

const reasons = [
  { value: 'DEBT', label: 'DISCONNECTION_AP_REASONS.DEBT_FROM_PAYMENT' },
  { value: 'NON_ADMISSION', label: 'DISCONNECTION_AP_REASONS.NON_ADMISSION_TO_CALCULATION_MEANS_OF_COMMERCIAL_ACCOUNTING'}
]

export const INIT_TERMINATION_RESUMPTION_ACCEPT_ROLES = ['СВБ'];

const InitTerminationResumption = () => {
  const {t} = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    activeOrganization,
    activeRoles: [{ relation_id }],
    full_name
  } = useSelector(({ user }) => user);
  const { loading, currentProcess, error } = useSelector(({ processes }) => processes);
  const [errors, setErrors] = useState(null);
  const [dataForInit, setDataForInit] = useState({
    action_type: '',
    reason: ''
  });

  useEffect(() => {
    setErrors(error);
  }, [error]);

  // Check roles & get data
  useEffect(() => {
    if (!checkPermissions('PROCESSES.TERMINATION_RESUMPTION.INITIALIZATION', INIT_TERMINATION_RESUMPTION_ACCEPT_ROLES)) {
      navigate('/processes');
    }
  }, [dispatch, navigate, relation_id]);

  // Clear store after unmount
  useEffect(() => () => dispatch(clearCurrentProcess()), [dispatch]);

  const handleInit = () => {
    dispatch(
      initTerminationResumption(
        dataForInit.action_type === actionType.TERMINATION_SUPPLY
          ? dataForInit
          : {
              action_type: dataForInit.action_type
            },
        (uid) => navigate(`/processes/termination-resumption/${uid}`)
      )
    );
  };

  const handleChangeReason = (status) => {
    setDataForInit({ ...dataForInit, reason: status });
  };

  const handleChangeStatus = (status) => {
    setErrors(null);
    setDataForInit({ ...dataForInit, action_type: status });
  };

  return (
    <>
      <Page
        pageName={t('PAGES.APPLICATION_FOR_CHANGE_OF_STATUS')}
        backRoute={'/processes'}
        loading={loading}
        faqKey={'PROCESSES__CHANGE_SUPPLY_STATUS'}
        controls={
          <CircleButton
            type={'create'}
            title={t('CONTROLS.TAKE_TO_WORK')}
            onClick={handleInit}
            disabled={loading || !dataForInit.action_type}
          />
        }
      >
        <Statuses
          statuses={['NEW', 'IN_PROCESS', 'FORMED', 'DONE', 'COMPLETED', 'CANCELED']}
          currentStatus={currentProcess?.status || 'NEW'}
        />
        <div className={'boxShadow'} style={{ paddingLeft: 24, paddingRight: 24, marginTop: 16, marginBottom: 16 }}>
          <DHTabs value={'details'}>
            <DHTab label={t('REQUEST_DETAILS')} value={'details'} />
          </DHTabs>
        </div>
        <div className={'boxShadow'} style={{ padding: 24, marginTop: 16, marginBottom: 16 }}>
          <Grid container spacing={3} alignItems={'flex-start'}>
            <Grid item xs={12} md={6} lg={3}>
              <StyledInput label={t('FIELDS.USER_INITIATOR')} disabled value={full_name} />
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
              <StyledInput label={t('FIELDS.FORMED_AT')} disabled value={null} />
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
              <StyledInput label={t('FIELDS.COMPLETE_DATETIME')} disabled value={null} />
            </Grid>
            <Grid item xs={12} md={6}>
              <StyledInput label={t('FIELDS.INITIATOR_COMPANY')} disabled value={activeOrganization?.name} />
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
              <SelectField
                onChange={handleChangeStatus}
                data={[
                  { value: actionType.TERMINATION_SUPPLY, label: t('DISCONNECTION_AP_REASONS.TERMINATION_OF_SUPPLY') },
                  { value: actionType.RESUMPTION_SUPPLY, label: t('DISCONNECTION_AP_REASONS.RESUMPTION_OF_SUPPLY') }
                ]}
                label={t('FIELDS.ACTION_TYPE')}
                value={dataForInit?.action_type}
                error={errors?.action_type}
              />
            </Grid>
            {dataForInit?.action_type === actionType.TERMINATION_SUPPLY && (
              <Grid item xs={12} md={6} lg={3}>
                <SelectField
                  onChange={handleChangeReason}
                  data={reasons}
                  label={t('DISCONNECTION_AP_REASONS.REASON_FOR_TERMINATION_OF_SUPPLY')}
                  value={dataForInit?.reason}
                  error={errors?.reason}
                />
              </Grid>
            )}
          </Grid>
        </div>
      </Page>
    </>
  );
};

export default InitTerminationResumption;
