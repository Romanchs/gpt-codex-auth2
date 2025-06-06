import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import {useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';

import {getPpkoDistrictsList} from '../../../../actions/ppkoActions';
import SelectField from '../../../Theme/Fields/SelectField';
import StyledInput from '../../../Theme/Fields/StyledInput';
import { useTranslation } from 'react-i18next';

const PpkoAddressSection = ({selectsData, initialData, errors, onChange}) => {
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const [values, setValues] = useState(initialData);
  const [districts, setDistricts] = useState([]);

  useEffect(() => {
    if(initialData && !values) setValues({...initialData});
  }, [initialData, values]);

  useEffect(() => {
    if(!values?.region) return;
    dispatch(getPpkoDistrictsList(values.region, data => {
      setDistricts(data.map((label) => ({value: label, label})));
    }));
  }, [dispatch, values?.region]);

  const handleChange = (name, isValueSimple = false) => (event) => {
    const data = {...values, [name]: isValueSimple ? event : event?.target?.value};
    if(name === 'region') data.district = '';
    setValues(data);
    onChange && onChange(data);
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={2}>
        <StyledInput
          label={t('FIELDS.ZIP_CODE')}
          value={values?.zip_code}
          error={errors?.zip_code}
          onChange={handleChange('zip_code')}
          readOnly={!onChange}
          required
        />
      </Grid>
      <Grid item xs={12} md={2}>
        <SelectField
          label={t('FIELDS.REGION')}
          value={selectsData.REGION.length && values?.region}
          data={selectsData.REGION}
          error={errors?.region}
          onChange={handleChange('region', true)}
          readOnly={!onChange}
          required
        />
      </Grid>
      <Grid item xs={12} md={3}>
        <SelectField
          label={t('FIELDS.AREA')}
          value={districts.length && values?.district}
          data={districts}
          error={errors?.district}
          onChange={handleChange('district', true)}
          readOnly={!onChange || !districts.length}
        />
      </Grid>
      <Grid item xs={12} md={2}>
        <SelectField
          label={t('FIELDS.SETTLEMENT_TYPE')}
          value={selectsData.SETTLEMENT_TYPES.length && values?.settlement_type}
          data={selectsData.SETTLEMENT_TYPES}
          error={errors?.settlement_type}
          onChange={handleChange('settlement_type', true)}
          readOnly={!onChange}
          required
        />
      </Grid>
      <Grid item xs={12} md={3}>
        <StyledInput
          label={t('FIELDS.SETTLEMENT_NAME')}
          value={values?.settlement_name}
          error={errors?.settlement_name}
          onChange={handleChange('settlement_name')}
          readOnly={!onChange}
          required
        />
      </Grid>
      <Grid item xs={12} md={2}>
        <SelectField
          label={t('FIELDS.STREET_TYPE')}
          value={selectsData.STREET_TYPES.length && values?.street_type}
          data={selectsData.STREET_TYPES}
          error={errors?.street_type}
          onChange={handleChange('street_type', true)}
          readOnly={!onChange}
          required
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <StyledInput
          label={t('FIELDS.STREET_NAME')}
          value={values?.street_name}
          error={errors?.street_name}
          onChange={handleChange('street_name')}
          readOnly={!onChange}
          required
        />
      </Grid>
      <Grid item xs={12} md={2}>
        <StyledInput
          label={t('FIELDS.BUILDING_NUMBER')}
          value={values?.building_number}
          error={errors?.building_number}
          onChange={handleChange('building_number')}
          readOnly={!onChange}
          required
        />
      </Grid>
      <Grid item xs={12} md={2}>
        <SelectField
          label={t('FIELDS.ROOM_TYPE')}
          value={selectsData.ROOM_TYPES.length && values?.room_type}
          data={selectsData.ROOM_TYPES}
          error={errors?.room_type}
          onChange={handleChange('room_type', true)}
          readOnly={!onChange}
        />
      </Grid>
      <Grid item xs={12} md={2}>
        <StyledInput
          label={t('FIELDS.ROOM_NUMBER')}
          value={values?.room_number}
          error={errors?.room_number}
          onChange={handleChange('room_number')}
          readOnly={!onChange}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <StyledInput
          label={t('FIELDS.SPECIFYING_ADDRESS')}
          value={values?.note}
          error={errors?.note}
          onChange={handleChange('note')}
          readOnly={!onChange}
        />
      </Grid>
    </Grid>
  );
};

PpkoAddressSection.propTypes = {
  initialData: PropTypes.object,
  selectsData: PropTypes.shape({
    REGION: PropTypes.array.isRequired,
    SETTLEMENT_TYPES: PropTypes.array.isRequired,
    STREET_TYPES: PropTypes.array.isRequired,
    ROOM_TYPES: PropTypes.array.isRequired
  }).isRequired,
  errors: PropTypes.object,
  onChange: PropTypes.func
};

PpkoAddressSection.defaultProps = {
  selectsData: {
    REGION: [],
    SETTLEMENT_TYPES: [],
    STREET_TYPES: [],
    ROOM_TYPES: []
  },
  onChange: null
};

export default PpkoAddressSection;
