import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import React from 'react';
import moment from 'moment';
import SelectField from '../../../../Components/Theme/Fields/SelectField';
import DatePicker from '../../../../Components/Theme/Fields/DatePicker';
import MultiSelect from '../../../../Components/Theme/Fields/MultiSelect';
import StyledInput from '../../../../Components/Theme/Fields/StyledInput';
import { LightTooltip } from '../../../../Components/Theme/Components/LightTooltip';
import propTypes from 'prop-types';

const Filters = ({ children, title, list }) => {
  return (
    <Box
      component={'section'}
      sx={{ mb: 2, borderRadius: 2, boxShadow: '0px 4px 24px rgba(0, 0, 0, 0.12)', overflow: 'hidden' }}
    >
      <Typography
        component={'h4'}
        variant={'body2'}
        sx={{ pt: 2, pb: 2, pl: 4, fontSize: 12, color: 'blue.contrastText', bgcolor: 'blue.dark' }}
      >
        {title}
      </Typography>
      <Box sx={{ p: '20px 24px 18px', bgcolor: '#fff' }}>
        <Grid container spacing={2}>
          {list.map((field) => {
            let input = null;
            if (!field.type) input = <StyledInput label={field.label} value={field.default} readOnly />;
            else if (field.type === 'select') {
              input = (
                <SelectField
                  label={field.label}
                  value={field.default}
                  data={field.values || []}
                  onChange={field.onChange}
                  error={field.error}
                  dataMarker={field.key}
                  ignoreI18
                />
              );
            } else if (field.type === 'date') {
              input = (
                <DatePicker
                  label={field.label}
                  value={field.default}
                  onChange={field.onChange}
                  minDate={field.min ? moment(field.min) : undefined}
                  maxDate={field.max ? moment(field.max) : undefined}
                  error={field.error}
                  dataMarker={field.key}
                />
              );
            } else if (field.type === 'multiselect') {
              input = (
                <MultiSelect
                  label={field.label}
                  value={field.default}
                  list={field.values}
                  onChange={field.onChange}
                  error={field.error}
                  disabled={!field.values?.length}
                  dataMarker={field.key}
                  ignoreI18
                />
              );
            }
            if (!input) return;
            input = (
              <Grid item xs={12} sm={6} md={field.md || 3}>
                {input}
              </Grid>
            );
            return field.tooltip ? (
              <LightTooltip key={field.key} title={field.tooltip} disableTouchListener disableFocusListener arrow>
                {input}
              </LightTooltip>
            ) : (
              <React.Fragment key={field.key}>{input}</React.Fragment>
            );
          })}
          {children}
        </Grid>
      </Box>
    </Box>
  );
};

Filters.propTypes = {
  title: propTypes.string.isRequired,
  list: propTypes.arrayOf(
    propTypes.shape({
      key: propTypes.string.isRequired,
      label: propTypes.string,
      type: propTypes.string,
      values: propTypes.array,
      onChange: propTypes.func,
      tooltip: propTypes.string,
      error: propTypes.string,
      disabled: propTypes.bool
    })
  ).isRequired
};

export default Filters;
