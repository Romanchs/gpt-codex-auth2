import React from 'react';
import { useParams } from 'react-router-dom';
import { useRequestActivateApQuery } from './api';
import { Grid } from '@material-ui/core';
import moment from 'moment';
import StyledInput from '../../../../Components/Theme/Fields/StyledInput';
import { useTranslation } from 'react-i18next';

const InitiatorDetails = () => {
  const {t} = useTranslation();
  const { uid } = useParams();
  const { data } = useRequestActivateApQuery(uid);

  return (
    <div className={'boxShadow'} style={{ padding: 24, marginTop: 40, marginBottom: 30 }}>
      <Grid container spacing={3} alignItems={'flex-start'}>
        <Grid item xs={12} md={6} lg={3}>
          <StyledInput label={t('FIELDS.USER_INITIATOR')} readOnly value={data?.initiator?.username} />
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <StyledInput
            label={t('FIELDS.CREATED_AT')}
            readOnly
            value={data?.created_at ? moment(data.created_at).format('DD.MM.YYYY • HH:mm') : null}
          />
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <StyledInput label={t('FIELDS.UNIQUE_APS')} readOnly value={data?.unique_aps} />
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <StyledInput label={t('FIELDS.UPLOADED_APS_COUNT')} readOnly value={data?.uploaded_aps} />
        </Grid>
        <Grid item xs={12} md={6} lg={9}>
          <StyledInput label={t('FIELDS.INITIATOR_COMPANY')} readOnly value={data?.initiator_company?.short_name} />
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <StyledInput
            label={t('FIELDS.REQUEST_EXECUTION_TERM')}
            readOnly
            value={
              data?.parents_ap_activated_at ? moment(data?.parents_ap_activated_at).format('DD.MM.YYYY • HH:mm') : ''
            }
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default InitiatorDetails;
