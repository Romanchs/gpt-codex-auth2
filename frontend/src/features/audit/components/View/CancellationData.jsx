import { useAuditViewData } from '../../slice';
import { AppBar, Grid, Paper, Typography } from '@mui/material';
import React from 'react';
import StyledInput from '../../../../Components/Theme/Fields/StyledInput';
import { useTranslation } from 'react-i18next';
import moment from 'moment';

const CancellationData = () => {
  const { t } = useTranslation();
  const data = useAuditViewData();
  const cancellation = data?.cancellation_data || {};

  return (
    <Paper elevation={4} sx={{ borderRadius: 3, overflow: 'hidden', mb: 2 }}>
      <AppBar sx={{ position: 'relative', px: 3, py: 1.75, zIndex: 2 }} color={'blue'} elevation={0}>
        <Typography variant={'body1'}>{t('AUDIT.CANCELLATION_DATA')}</Typography>
      </AppBar>
      <Grid container spacing={2} sx={{ px: 3, py: 3 }} alignItems={'center'}>
        <Grid item xs={12} sm={4}>
          <StyledInput disabled label={t('FIELDS.USER_INITIATOR')} value={cancellation?.initiator} />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StyledInput
            disabled
            label={t('FIELDS.AUDIT_DATE_START')}
            value={cancellation?.date_start && moment(cancellation?.date_start).format('DD.MM.YYYY')}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StyledInput
            disabled
            label={t('AUDIT.FIELDS.DATE_CANCELL')}
            value={cancellation?.date_cancelled && moment(cancellation?.date_cancelled).format('DD.MM.YYYY')}
          />
        </Grid>
        <Grid item xs={12}>
          <StyledInput disabled multiline label={t('AUDIT.FIELDS.CANCELLATION_REASON')} value={cancellation?.reason} />
        </Grid>
      </Grid>
    </Paper>
  );
};

export default CancellationData;
