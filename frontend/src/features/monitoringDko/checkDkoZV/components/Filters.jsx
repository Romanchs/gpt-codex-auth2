import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import React, { useMemo } from 'react';
import moment from 'moment';
import SelectField from '../../../../Components/Theme/Fields/SelectField';
import DatePicker from '../../../../Components/Theme/Fields/DatePicker';
import MultiSelect from '../../../../Components/Theme/Fields/MultiSelect';
import StyledInput from '../../../../Components/Theme/Fields/StyledInput';
import { LightTooltip } from '../../../../Components/Theme/Components/LightTooltip';
import VersionsByPeriod from '../../../versionsByPeriod';
import propTypes from 'prop-types';

const renderField = (field, list) => {
  const commonProps = {
    label: field.label,
    value: field.default,
    onChange: field.onChange,
    error: field.error,
    dataMarker: field.key
  };

  switch (field.type) {
    case 'select_version': {
      const period_from = list.find((item) => item.key === 'period_from')?.default;
      const period_to = list.find((item) => item.key === 'period_to')?.default;
      return (
        <Grid item xs={12} sm={3} md={3} lg={1.3}>
          <VersionsByPeriod {...commonProps} from_date={period_from} to_date={period_to} useNull />
        </Grid>
      );
    }
    case 'select':
      return (
        <Grid item xs={12} sm={3} md={3} lg={1.6}>
          <SelectField {...commonProps} data={field.values || []} ignoreI18 />
        </Grid>
      );
    case 'date':
      return (
        <Grid item xs={12} sm={3} md={3} lg={1.7}>
          <DatePicker
            {...commonProps}
            minDate={field.min ? moment(field.min) : undefined}
            maxDate={field.max ? moment(field.max) : undefined}
          />
        </Grid>
      );
    case 'multiselect':
      return (
        <Grid item xs={12} md={3} sm={3} lg={2.5}>
          <MultiSelect {...commonProps} list={field.values} disabled={!field.values?.length} ignoreI18 />
        </Grid>
      );
    default:
      return (
        <Grid item xs={12} sm={field.sm || 1.5}>
          <StyledInput label={field.label} value={field.default} readOnly />
        </Grid>
      );
  }
};

const Filters = ({ children, title, list }) => {
  const renderedFields = useMemo(
    () =>
      list.map((field) => {
        const fieldComponent = renderField(field, list);
        if (!fieldComponent) return null;

        return field.tooltip ? (
          <LightTooltip key={field.key} title={field.tooltip} disableTouchListener disableFocusListener arrow>
            {fieldComponent}
          </LightTooltip>
        ) : (
          fieldComponent
        );
      }),
    [list]
  );
  return (
    <Box
      component="section"
      sx={{
        mb: 2,
        borderRadius: 2,
        boxShadow: '0px 4px 24px rgba(0, 0, 0, 0.12)',
        overflow: 'hidden'
      }}
    >
      <Typography
        component="h4"
        variant="body2"
        sx={{
          pt: 2,
          pb: 2,
          pl: 4,
          fontSize: 12,
          color: 'blue.contrastText',
          bgcolor: 'blue.dark'
        }}
      >
        {title}
      </Typography>
      <Box sx={{ p: '20px 24px 18px', bgcolor: '#fff' }}>
        <Grid container spacing={2}>
          {renderedFields}
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
