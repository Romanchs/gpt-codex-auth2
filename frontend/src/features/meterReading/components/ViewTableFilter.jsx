import React, { useMemo, useState } from 'react';
import { AppBar, Box, Grid, Paper } from '@mui/material';
import { Typography } from '@material-ui/core';
import DatePicker from '../../../Components/Theme/Fields/DatePicker';
import moment from 'moment';
import { GreenButton } from '../../../Components/Theme/Buttons/GreenButton';
import { DoneRounded } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

const OUT_FORMAT = 'YYYY-MM-DD';

export const ViewTableFilter = ({handleApply}) => {
  const { t } = useTranslation();
  const [filters, setFilters] = useState({ period_from: null, period_to: null });

  const isValidDateRange = (periodFrom, periodTo) => {
    const startDate = moment(periodFrom);
    const endDate = moment(periodTo);

    return (
      startDate.isValid() &&
      endDate.isValid() &&
      startDate.isBefore(moment()) &&
      endDate.isBefore(moment()) &&
      !(startDate.isAfter(periodTo) || moment(periodFrom).add(31, 'days').isBefore(periodTo))
    );
  };

  const disabledApply = useMemo(() => !isValidDateRange(filters.period_from, filters.period_to), [filters]);

  const periodToMaxDate = useMemo(() => {
    const currentDate = moment();
    if (!filters.period_from) return currentDate;

    const maxDate = moment(filters.period_from).add(31, 'days');
    return maxDate > currentDate ? currentDate : maxDate;
  }, [filters.period_from]);

  const periodToMinDate = useMemo(() => {
    const periodFrom = moment(filters.period_from);
    if (!filters.period_from) return null;
    return periodFrom;
  }, [filters.period_from]);

  const onChangeStartDate = (date) => {
    if (filters.period_to && !isValidDateRange(date, filters.period_to)) {
      setFilters({ ...filters, period_from: moment(date).format(OUT_FORMAT), period_to: moment(date).format(OUT_FORMAT) });
    } else {
      setFilters({ ...filters, period_from: moment(date).format(OUT_FORMAT) });
    }
  };


  return (
    <Paper elevation={4} sx={{ borderRadius: 3, overflow: 'hidden', mb: 2 }}>
      <AppBar sx={{ position: 'relative', px: 3, py: 1.75, zIndex: 2 }} color={'blue'} elevation={0}>
        <Typography variant={'body1'}>{t('GENERAL_FILTERS')}</Typography>
      </AppBar>
      <Grid container spacing={2} sx={{ px: 3, py: 2 }} alignItems={'center'}>
        <Grid item xs={12} sm={3}>
          <DatePicker
            label={t('FIELDS.PERIOD_FROM')}
            value={filters.period_from || null}
            maxDate={moment()}
            onChange={onChangeStartDate}
            outFormat={OUT_FORMAT}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <DatePicker
            label={t('FIELDS.PERIOD_TO')}
            value={filters.period_to || null}
            maxDate={periodToMaxDate}
            minDate={periodToMinDate}
            onChange={(date) => setFilters({ ...filters, period_to: moment(date).format(OUT_FORMAT) })}
            outFormat={OUT_FORMAT}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <GreenButton
              style={{ borderRadius: 20, padding: '0 16px', height: 32 }}
              onClick={() => handleApply(filters)}
              disabled={disabledApply}
              data-marker={'apply'}
              data-status={disabledApply ? 'disabled' : 'active'}
            >
              <DoneRounded />
              {t('CONTROLS.ENGAGE')}
            </GreenButton>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};
