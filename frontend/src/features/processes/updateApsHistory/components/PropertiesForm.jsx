import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import React from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import moment from 'moment';
import StyledInput from '../../../../Components/Theme/Fields/StyledInput';
import { mainApi, useReferenceBookCompactQuery } from '../../../../app/mainApi';
import { useTranslation } from 'react-i18next';
import DatePicker from '../../../../Components/Theme/Fields/DatePicker';
import SelectField from '../../../../Components/Theme/Fields/SelectField';
import Autocomplete from '../../../../Components/Theme/Fields/Autocomplete';

const PROPERTIES_TYPE = {
  STR: 'str',
  DATE: 'date',
  LIST: 'list',
  AUTOCOMPLETE: 'autocomplete'
};

const PropertiesForm = ({ values, onChange, error, disabled }) => {
  const { uid } = useParams();
  const { t } = useTranslation();
  const styles = useSelector((store) => store.updateApsHistory.styles);

  const { currentData } = mainApi.endpoints.updateApsHistory.useQueryState(uid, { skip: !uid });

  return (
    <Box component={'section'} sx={styles.table}>
      <Box component={'header'} sx={styles.tableHeader}>
        <Grid container spacing={3} alignItems={'flex-start'}>
          <Grid item xs={6}>
            <Typography component={'h4'} sx={styles.tableTitle}>
              {t('UPDATE_APS_HISTORY.PAGE.LIST_OF_CHARACTERISTICS_TO_CHANGE')}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography component={'h4'} sx={styles.tableTitle}>
              {t('UPDATE_APS_HISTORY.PAGE.LIST_OF_CHARACTERISTICS_TO_CHANGE_VALUES')}
            </Typography>
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ ...styles.tableBody, pt: 3 }}>
        <Grid container spacing={3} alignItems={'flex-start'}>
          {currentData?.properties?.map((i) => (
            <React.Fragment key={i.code}>
              <Grid item xs={6} sx={{ pt: 2 }}>
                <StyledInput
                  label={t('UPDATE_APS_HISTORY.PAGE.LIST_OF_CHARACTERISTICS_TO_CHANGE__NAME')}
                  value={i.label}
                  dataMarker={'field_name--' + i.code}
                  disabled
                  showTooltipIfOverflow
                />
              </Grid>
              <Grid item xs={6} sx={{ pt: 2 }}>
                <Field
                  id={i.code}
                  type={i.data_type}
                  value={values[i.code]}
                  list={i.data_list}
                  onChange={onChange}
                  error={error}
                  disabled={disabled}
                  refBook={i.refbook}
                />
              </Grid>
            </React.Fragment>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default PropertiesForm;

const Field = ({ id, type, value, list, onChange, error, disabled, refBook }) => {
  const { t } = useTranslation();

  if (!disabled && type === PROPERTIES_TYPE.AUTOCOMPLETE) {
    return <AutocompleteField id={id} value={value} onChange={onChange} error={error} refBook={refBook} />;
  }
  if (!disabled && type === PROPERTIES_TYPE.DATE) {
    return (
      <DatePicker
        label={t('UPDATE_APS_HISTORY.PAGE.LIST_OF_CHARACTERISTICS_TO_CHANGE__VALUE')}
        value={value}
        onChange={(d) => onChange(id, moment(d).startOf('day').utc().format())}
        maxDate={new Date('9999-12-31')}
        error={error?.data?.[id]}
        dataMarker={'field_value--' + id}
      />
    );
  }
  if (!disabled && type === PROPERTIES_TYPE.LIST) {
    return (
      <SelectField
        label={t('UPDATE_APS_HISTORY.PAGE.LIST_OF_CHARACTERISTICS_TO_CHANGE__VALUE')}
        value={value}
        data={list?.map((p) => ({ label: p, value: p })) || []}
        onChange={(value) => onChange(id, value)}
        error={error?.data?.[id]}
        dataMarker={'field_value--' + id}
        ignoreI18
      />
    );
  }
  return (
    <StyledInput
      label={t('UPDATE_APS_HISTORY.PAGE.LIST_OF_CHARACTERISTICS_TO_CHANGE__VALUE')}
      value={type === PROPERTIES_TYPE.DATE ? (value ? moment(value).format('DD.MM.YYYY') : ' - ') : value}
      onChange={(e) => onChange(id, e.target.value)}
      error={error?.data?.[id]}
      dataMarker={'field_value--' + id}
      disabled={disabled}
    />
  );
};

const AutocompleteField = ({ id, value, onChange, error, refBook }) => {
  const { t } = useTranslation();
  const { data, isFetching } = useReferenceBookCompactQuery(refBook);
  const options = data ? data.map((k) => ({ label: k, value: k })) : [];

  return (
    <Autocomplete
      label={t('UPDATE_APS_HISTORY.PAGE.LIST_OF_CHARACTERISTICS_TO_CHANGE__VALUE')}
      defaultValue={value}
      list={options}
      onChange={(v) => onChange(id, v?.value || null)}
      error={error?.data?.[id]}
      data-marker={'field_value--' + id}
      loading={isFetching}
    />
  );
};
