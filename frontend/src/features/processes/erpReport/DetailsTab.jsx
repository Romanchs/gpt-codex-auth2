import React from 'react';
import { useParams } from 'react-router-dom';
import { useErpReportQuery } from './api';
import SendedFilesTable from './SendedFilesTable';
import { Grid } from '@material-ui/core';
import moment from 'moment';
import StyledInput from '../../../Components/Theme/Fields/StyledInput';
import { useTranslation } from 'react-i18next';

const DetailsTab = () => {
  const {t} = useTranslation();
  const { uid } = useParams();
  const { currentData: data } = useErpReportQuery(uid);

  return (
    <>
      <div className={'boxShadow'} style={{ padding: 24, marginTop: 16, marginBottom: 16 }}>
      <Grid container spacing={3} alignItems={'flex-start'}>
        <Grid item xs={12} md={6} lg={3}>
          <StyledInput
            value={data?.process_type || t('ALL')}
            label={t('FIELDS.REPORT_TYPE')}
            readOnly
          />
        </Grid>
        <Grid item xs={12} md={6} lg={2}>
          <StyledInput label={t('FIELDS.PERIOD_FROM')} value={data?.start_date ? moment(data?.start_date).format('DD.MM.yyyy') : ''} readOnly/>
        </Grid>
        <Grid item xs={12} md={6} lg={2}>
          <StyledInput label={t('FIELDS.PERIOD_TO')} value={data?.end_date ? moment(data?.end_date).format('DD.MM.yyyy') : ''} readOnly/>
        </Grid>
        <Grid item xs={12} md={6} lg={2}>
          <StyledInput
            value={data?.version}
            label={t('FIELDS.VERSION')}
            readOnly
          />
        </Grid>
        <Grid item xs={12} md={6} lg={2}>
          <StyledInput
            value={data?.subversion}
            label={t('FIELDS.SUBVERSION')}
            readOnly
          />
        </Grid>
      </Grid>
    </div>
      {data?.files?.data?.length > 0 && <SendedFilesTable files={data.files?.data} />}
    </>
  );
};

export default DetailsTab;
