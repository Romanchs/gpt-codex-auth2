import { Grid } from '@material-ui/core';
import { Box } from '@mui/material';
import moment from 'moment';
import React from 'react';
import StyledInput from '../../../Components/Theme/Fields/StyledInput';
import { LightTooltip } from '../../../Components/Theme/Components/LightTooltip';
import { useTableStyles } from '../filterStyles';
import SubprocessesTable from './SubprocessesTable';
import { useTranslation } from 'react-i18next';

const SubprocessTab = ({ process }) => {
  const {t} = useTranslation();
  const classes = useTableStyles();
  return (
    <>
      <Box component='section' className={classes.table}>
        <Box className={classes.tableBody}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <StyledInput label={`${t('FIELDS.PROCESS')}:`} value={process?.parent_process_name} readOnly />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StyledInput label={`${t('FIELDS.AUTOR')}:`} value={process?.initiator} readOnly />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StyledInput label={`${t('FIELDS.PERIOD')}:`} value={process?.period_type} readOnly />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StyledInput label={`${t('FIELDS.DAY_NUMBER')}:`} value={process?.day} readOnly />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StyledInput label={`${t('FIELDS.STARTUP_TYPE')}:`} value={process?.startup_type} readOnly />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StyledInput label={`${t('FIELDS.ERRORS')}:`} value={process?.is_error ? t('CONTROLS.YES') : t('CONTROLS.NO')} readOnly
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StyledInput label={`${t('FIELDS.SEND_MMS')}:`} value={process?.send_to_mms ? t('CONTROLS.YES') : t('CONTROLS.NO')} readOnly />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <LightTooltip
                title={process?.metering_grid_areas?.join(', ') || ''}
                disableTouchListener
                disableFocusListener
                arrow
              >
                <Box>
                  <StyledInput
                    label={`${t('FIELDS.EIC_Y')}:`}
                    value={process?.metering_grid_areas?.join(', ')}
                    disableInputTitle
                    readOnly
                  />
                </Box>
              </LightTooltip>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StyledInput label={t('FIELDS.PERIOD_FROM')} value={process?.period_from && moment(process?.period_from).format('DD.MM.yyyy')} readOnly />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StyledInput label={t('FIELDS.PERIOD_TO')} value={process?.period_to && moment(process?.period_to).format('DD.MM.yyyy')} readOnly />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StyledInput label={t('FIELDS.STARTED_AT')} value={process?.started_at && moment(process?.started_at).format('DD.MM.yyyy • HH:mm')} readOnly />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StyledInput label={t('FIELDS.FINISHED_AT')} value={process?.finished_at && moment(process?.finished_at).format('DD.MM.yyyy • HH:mm')} readOnly />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StyledInput label={t('FIELDS.VERSION')} value={process?.version} readOnly />
            </Grid>
          </Grid>
        </Box>
      </Box>
      <SubprocessesTable list={process.processes} />
    </>
  );
};

export default SubprocessTab;
