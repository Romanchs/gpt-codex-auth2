import { Button, Divider, Grid, IconButton } from '@material-ui/core';
import React from 'react';
import ArrowLeftRounded from '@mui/icons-material/ArrowLeftRounded';
import ArrowRightRounded from '@mui/icons-material/ArrowRightRounded';
import moment from 'moment/moment';
import { usePropertiesTimelineDatesQuery } from './api';
import { useParams } from 'react-router-dom';
import { useTimelineStyles } from './styles';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentDate, setSelectedDay, setSelectedMonth, setSelectedYear } from './slice';
import { Box } from '@mui/material';
import useSearchLog from '../../services/actionsLog/useSearchLog';
import { useTranslation } from 'react-i18next';

function isMonthWasChanged(dateStrings, month, year) {
  for (let i = 0; i < dateStrings.length; i++) {
    const date = moment(dateStrings[i]);
    if (date.year() === year && date.month() === month) {
      return true;
    }
  }
  return false;
}

function isDayWasChanged(dateStrings, day, month, year) {
  for (let i = 0; i < dateStrings.length; i++) {
    const date = moment(dateStrings[i]);
    if (date.year() === year && date.month() === month && date.date() === day) {
      return true;
    }
  }
  return false;
}

const months = [
  'JANUARY',
  'FEBRUARY',
  'MARCH',
  'APRIL',
  'MAY',
  'JUNE',
  'JULY',
  'AUGUST',
  'SEPTEMBER',
  'OCTOBER',
  'NOVEMBER',
  'DECEMBER'
].map((name, number) => ({ name: `MONTHS_SHORT.${name}`, number }));

const TimelineSelector = ({ type }) => {
  const { id } = useParams();
  const { t } = useTranslation();
  const classes = useTimelineStyles();
  const dispatch = useDispatch();
  const currentDay = moment();
  const params = { by_validity: type === 'by_period' };
  const { data } = usePropertiesTimelineDatesQuery({ id, params });
  const { selectedYear, selectedMonth, selectedDay } = useSelector(({ timelineSelector }) => timelineSelector);

  const searchLog = useSearchLog(['Реєстр ТКО']);

  const handleSelectDay = (day) => {
    dispatch(setSelectedDay(day));
    searchLog();
  };

  const handleSelectCurrentDay = () => {
    dispatch(setCurrentDate());
    searchLog();
  };

  return (
    <div className={'boxShadow'} style={{ padding: 24, marginTop: 16, marginBottom: 16 }}>
      <Grid container spacing={3} alignItems={'center'} justifyContent={'space-between'}>
        <Grid item xs={3} md={2} lg={1}>
          <Box className={classes.yearButton}>
            <ArrowLeftRounded
              data-marker={'subtractYear'}
              onClick={() => dispatch(setSelectedYear(selectedYear - 1))}
            />
            {selectedYear}
            <ArrowRightRounded data-marker={'addYear'} onClick={() => dispatch(setSelectedYear(selectedYear + 1))} />
          </Box>
        </Grid>
        <Grid item xs={12} md={10} sm={6}>
          <Grid container spacing={3} alignItems={'center'} justifyContent={'space-around'}>
            {data &&
              months.map((month) => (
                <Grid item key={month.number}>
                  <IconButton
                    data-marker={`month-${month.number}`}
                    disabled={!isMonthWasChanged(data, month.number, selectedYear)}
                    onClick={() => dispatch(setSelectedMonth(month.number))}
                    className={`${classes.circleButton} 
                                        ${
                                          month.number === currentDay.month() && selectedYear === currentDay.year()
                                            ? classes.orangeBorder
                                            : ''
                                        } 
                                        ${month.number === selectedMonth ? classes.geenButton : ''}`}
                  >
                    {t(month.name)}
                  </IconButton>
                </Grid>
              ))}
          </Grid>
        </Grid>
        <Grid item xs={3} md={2} lg={1}>
          <Button data-marker={'currentDate'} onClick={handleSelectCurrentDay} className={classes.blueButton}>
            {currentDay.format('DD.MM.yyyy')}
          </Button>
        </Grid>
      </Grid>
      <Box width={'100%'} p={2}>
        <Divider />
      </Box>
      <Box display={'flex'} flexWrap={'wrap'} gap={1} justifyContent={'center'}>
        <Box display={'flex'} gap={1}>
          {data &&
            Array.from({ length: 16 }, (_, i) => i + 1).map((day) => (
              <IconButton
                key={day}
                data-marker={`day-${day}`}
                disabled={!isDayWasChanged(data, day, selectedMonth, selectedYear)}
                onClick={() => handleSelectDay(day)}
                className={`${classes.circleButton} 
                                    ${
                                      day === currentDay.date() &&
                                      selectedMonth &&
                                      selectedMonth === currentDay.month() &&
                                      selectedYear === currentDay.year()
                                        ? classes.orangeBorder
                                        : ''
                                    } 
                                    ${day === selectedDay ? classes.geenButton : ''}`}
              >
                {day}
              </IconButton>
            ))}
        </Box>
        <Box display={'flex'} gap={1}>
          {data &&
            Array.from({ length: 15 }, (_, i) => i + 17).map((day) => (
              <IconButton
                key={day}
                data-marker={`day-${day}`}
                disabled={!isDayWasChanged(data, day, selectedMonth, selectedYear)}
                onClick={() => handleSelectDay(day)}
                className={`${classes.circleButton} 
                                    ${
                                      day === currentDay.date() &&
                                      selectedMonth &&
                                      selectedMonth === currentDay.month() &&
                                      selectedYear === currentDay.year()
                                        ? classes.orangeBorder
                                        : ''
                                    } 
                                    ${day === selectedDay ? classes.geenButton : ''}`}
              >
                {day}
              </IconButton>
            ))}
        </Box>
      </Box>
    </div>
  );
};

export default TimelineSelector;
