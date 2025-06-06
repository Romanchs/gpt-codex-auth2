import React from 'react';
import { useParams } from 'react-router-dom';
import { useRequestActivateApQuery } from './api';
import { Grid } from '@material-ui/core';
import moment from 'moment';
import StyledInput from '../../../../Components/Theme/Fields/StyledInput';
import { useTranslation } from 'react-i18next';

const ExecutorDetails = () => {
  const {t} = useTranslation();
  const { uid } = useParams();
  const { data } = useRequestActivateApQuery(uid);

  return (
    <div className={'boxShadow'} style={{ padding: 24, marginTop: 30, marginBottom: 30 }}>
      <Grid container spacing={3} alignItems={'flex-start'}>
        <Grid item xs={12} md={6} lg={6}>
          <StyledInput label={t('FIELDS.USER_EXECUTOR')} readOnly value={data?.executor?.username} />
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <StyledInput
            label={t('FIELDS.START_WORK_DATE')}
            readOnly
            value={data?.taken_at ? moment(data.taken_at).format('DD.MM.YYYY • HH:mm') : null}
          />
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <StyledInput
            label={t('FIELDS.COMPLETE_DATETIME')}
            readOnly
            value={data?.done_at ? moment(data.done_at).format('DD.MM.YYYY • HH:mm') : null}
          />
        </Grid>
        <Grid item xs={12} md={6} lg={12}>
          <StyledInput label={t('FIELDS.EXECUTOR_COMPANY')} readOnly value={data?.executor_company?.short_name} />
        </Grid>
      </Grid>
    </div>
  );
};

export default ExecutorDetails;
