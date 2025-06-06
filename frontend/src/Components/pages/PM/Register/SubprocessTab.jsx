import { Grid } from '@material-ui/core';
import React from 'react';
import DatePicker from '../../../Theme/Fields/DatePicker';
import SelectField from '../../../Theme/Fields/SelectField';
import StyledInput from '../../../Theme/Fields/StyledInput';
import { useTableStyles } from '../filterStyles';
import SubprocessesTable from './SubprocessesTable';
import { useTranslation } from 'react-i18next';

const SubprocessTab = () => {
  const {t} = useTranslation();
  const classes = useTableStyles();

  return (
    <>
    <section className={classes.table}>
      <div className={classes.tableBody}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={3} md={3}>
            <StyledInput label={`${t('FIELDS.PROCESS')}:`} />
          </Grid>
          <Grid item xs={12} sm={3} md={3}>
            <StyledInput label={`${t('FIELDS.AUTOR')}:`} />
          </Grid>
          <Grid item xs={12} sm={3} md={3}>
            <StyledInput label={`${t('FIELDS.PERIOD')}:`} />
          </Grid>
          <Grid item xs={12} sm={3} md={3}>
            <StyledInput label={`${t('FIELDS.DAY_NUMBER')}:`} />
          </Grid>
          <Grid item xs={12} sm={3} md={3}>
            <StyledInput label={`${t('FIELDS.STARTUP_TYPE')}:`} />
          </Grid>
          <Grid item xs={12} sm={3} md={3}>
            <SelectField
              label={`${t('FIELDS.ERRORS')}:`}
              data={[
                { label: t('CONTROLS.YES'), value: 1 },
                { label: t('CONTROLS.NO'), value: 2 }
              ]}
            />
          </Grid>
          <Grid item xs={12} sm={3} md={3}>
            <StyledInput label={`${t('FIELDS.SEND_MMS')}:`} />
          </Grid>
          <Grid item xs={12} sm={3} md={3}>
            <StyledInput label={`${t('FIELDS.EIC_Y')}:`} />
          </Grid>
          <Grid item xs={12} sm={3} md={3}>
            <DatePicker label={t('FIELDS.PERIOD_FROM')} />
          </Grid>
          <Grid item xs={12} sm={3} md={3}>
            <DatePicker label={t('FIELDS.PERIOD_TO')} />
          </Grid>
          <Grid item xs={12} sm={3} md={3}>
            <DatePicker label={t('FIELDS.STARTED_AT')} value={null} />
          </Grid>
          <Grid item xs={12} sm={3} md={3}>
            <DatePicker label={t('FIELDS.FINISHED_AT')} value={null} />
          </Grid>
          <Grid item xs={12} sm={3} md={3}>
            <StyledInput label={t('FIELDS.VERSION')} />
          </Grid>
        </Grid>
      </div>
    </section>
    <SubprocessesTable list={{data: [{subprocess: 'Test', progress: 15}, {subprocess: 'Test', progress: 100}]}}/>
    </>
  );
};

export default SubprocessTab;
