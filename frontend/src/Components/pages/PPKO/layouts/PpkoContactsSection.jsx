import Grid from '@material-ui/core/Grid';
// import {useEffect, useState} from 'react';
import PropTypes from 'prop-types';

import StyledInput from '../../../Theme/Fields/StyledInput';
import PpkoAddressSection from './PpkoAddressSection';
import DatePicker from '../../../Theme/Fields/DatePicker';
import { useTranslation } from 'react-i18next';

const PpkoContactsSection = ({ data, selectsData, errors, onChange }) => {
  const {t} = useTranslation();
  // const [visualData, setVisualData] = useState({});

  // useEffect(() => {
  //   if(Object.keys(visualData).length) return;
  //   setVisualData({
  //     'office.phone': phoneToTemplate(data?.office?.phone).visualPhone,
  //     'manager.phone': phoneToTemplate(data?.manager?.phone).visualPhone,
  //     'registrator.phone': phoneToTemplate(data?.registrator?.phone).visualPhone,
  //     'responsible.phone': phoneToTemplate(data?.responsible?.phone).visualPhone,
  //     'support.phone': phoneToTemplate(data?.support?.phone).visualPhone
  //   });
  // }, [data, visualData]);

  const handleInputChange =
    (prop, isValueSimple = false) =>
    (v) => {
      let piece;
      let value = isValueSimple ? v : v.target.value;
      if ((prop === 'office.working_hours' || prop === 'office.web') && !value) {
        value = null;
      }
      // if(prop.endsWith('.phone')) {
      //   const {phone, visualPhone} = phoneToTemplate(value);
      //   value = phone;
      //   setVisualData({...visualData, [prop]: visualPhone});
      // }

      if (prop.indexOf('.') === -1) {
        piece = { [prop]: value };
      } else {
        prop = prop.split('.');
        piece = { [prop[0]]: JSON.parse(JSON.stringify(data[prop[0]] || {})) };
        let temp = piece;

        let i;
        for (i = 1; i < prop.length - 1; i++) {
          temp = temp[prop[i]];
        }
        temp[prop[0]][prop[i]] = value;
      }
      onChange({ ...data, ...piece });
    };

  return (
    <section>
      <h4>{t("CONTACTS")}</h4>
      <div className={'form-section'}>
        <div>
          <h5 style={{ marginTop: 16 }}>{t('CONTACTS_DATA.MAILING_ADDRESS')}</h5>
          <PpkoAddressSection
            selectsData={selectsData}
            initialData={data?.postal_address}
            onChange={handleInputChange('postal_address', true)}
            errors={errors?.postal_address}
          />
        </div>
        <div>
          <h5 style={{ marginTop: 16 }}>{t('CONTACTS_DATA.ACTUAL_ADDRESS')}</h5>
          <PpkoAddressSection
            selectsData={selectsData}
            initialData={data?.actual_address}
            onChange={handleInputChange('actual_address', true)}
            errors={errors?.actual_address}
          />
        </div>
        <div>
          <h5 style={{ marginTop: 16 }}>Офіс</h5>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={2}>
              <StyledInput
                label={t('FIELDS.PHONE_NUM')}
                value={data?.office?.phone}
                error={errors?.office?.phone}
                onChange={handleInputChange('office.phone')}
                required
              />
            </Grid>
            <Grid item xs={12} md={6} lg={2}>
              <StyledInput
                label={t('FIELDS.WORKING_HOURS')}
                value={data?.office?.working_hours}
                error={errors?.office?.working_hours}
                onChange={handleInputChange('office.working_hours')}
                required
              />
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
              <StyledInput
                label={t('FIELDS.WEBSITE_ADDRESS')}
                value={data?.office?.web}
                error={errors?.office?.web}
                onChange={handleInputChange('office.web')}
              />
            </Grid>
            <Grid item xs={12} md={6} lg={2}>
              <StyledInput
                label={t('FIELDS.E_MAIL')}
                value={data?.office?.email}
                error={errors?.office?.email}
                onChange={handleInputChange('office.email')}
                required
              />
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
              <StyledInput
                label={t('FIELDS.ADDITIONAL_EMAIL')}
                value={data?.office?.email_addl}
                error={errors?.office?.email_addl}
                onChange={handleInputChange('office.email_addl')}
              />
            </Grid>
          </Grid>
        </div>
        <div>
          <h5 style={{ marginTop: 16 }}>{t('CONTACTS_DATA.HEAD')}</h5>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={3}>
              <StyledInput
                label={t('FIELDS.FULL_NAME_SHORT')}
                value={data?.manager?.full_name}
                error={errors?.manager?.full_name}
                onChange={handleInputChange('manager.full_name')}
                required
              />
            </Grid>
            <Grid item xs={12} md={6} lg={2}>
              <StyledInput
                label={t('FIELDS.PHONE_NUM')}
                value={data?.manager?.phone}
                error={errors?.manager?.phone}
                onChange={handleInputChange('manager.phone')}
                required
              />
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
              <StyledInput
                label={t('FIELDS.E_MAIL')}
                value={data?.manager?.email}
                error={errors?.manager?.email}
                onChange={handleInputChange('manager.email')}
                required
              />
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
              <StyledInput
                label={t('FIELDS.ADDITIONAL_EMAIL')}
                value={data?.manager?.email_addl}
                error={errors?.manager?.email_addl}
                onChange={handleInputChange('manager.email_addl')}
              />
            </Grid>
          </Grid>
        </div>
        <div>
          <h5 style={{ marginTop: 16 }}>{t('PERSON_AUTHORIZED_TO_REGISTER_PPKO')}</h5>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={3}>
              <StyledInput
                label={t('FIELDS.FULL_NAME_SHORT')}
                value={data?.registrator?.full_name}
                error={errors?.registrator?.full_name}
                onChange={handleInputChange('registrator.full_name')}
                required
              />
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
              <StyledInput
                label={t('FIELDS.PHONE_NUM')}
                value={data?.registrator?.phone}
                error={errors?.registrator?.phone}
                onChange={handleInputChange('registrator.phone')}
                required
              />
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
              <StyledInput
                label={t('FIELDS.E_MAIL')}
                value={data?.registrator?.email}
                error={errors?.registrator?.email}
                onChange={handleInputChange('registrator.email')}
                required
              />
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
              <StyledInput
                label={t('FIELDS.ADDITIONAL_EMAIL')}
                value={data?.registrator?.email_addl}
                error={errors?.registrator?.email_addl}
                onChange={handleInputChange('registrator.email_addl')}
              />
            </Grid>
          </Grid>
        </div>
        <div>
          <h5 style={{ marginTop: 16 }}>{t('CONTACTS_DATA.RECONCILIATION_ACCOUNTABLE_FUNC_USER')}</h5>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={3}>
              <StyledInput
                label={t('FIELDS.FULL_NAME_SHORT')}
                value={data?.responsible?.full_name}
                error={errors?.responsible?.full_name}
                onChange={handleInputChange('responsible.full_name')}
                required
              />
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
              <StyledInput
                label={t('FIELDS.PHONE_NUM')}
                value={data?.responsible?.phone}
                error={errors?.responsible?.phone}
                onChange={handleInputChange('responsible.phone')}
                required
              />
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
              <StyledInput
                label={t('FIELDS.E_MAIL')}
                value={data?.responsible?.email}
                error={errors?.responsible?.email}
                onChange={handleInputChange('responsible.email')}
                required
              />
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
              <StyledInput
                label={t('FIELDS.ADDITIONAL_EMAIL')}
                value={data?.responsible?.email_addl}
                error={errors?.responsible?.email_addl}
                onChange={handleInputChange('responsible.email_addl')}
              />
            </Grid>
          </Grid>
        </div>
        <div>
          <h5 style={{ marginTop: 16 }}>{t('CONTACTS_DATA.TECHNICAL_SUPPORT')}</h5>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={4}>
              <StyledInput
                label={t('CONTACTS_DATA.RECONCILIATION_ACCOUNTABLE_AUTOMATE_USER')}
                value={data?.support?.full_name}
                error={errors?.support?.full_name}
                onChange={handleInputChange('support.full_name')}
                required
              />
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
              <StyledInput
                label={t('FIELDS.PHONE_NUM')}
                value={data?.support?.phone}
                error={errors?.support?.phone}
                onChange={handleInputChange('support.phone')}
                required
              />
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
              <StyledInput
                label={t('FIELDS.WORKING_HOURS')}
                value={data?.support?.working_hours}
                error={errors?.support?.working_hours}
                onChange={handleInputChange('support.working_hours')}
                required
              />
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
              <StyledInput
                label={t('FIELDS.E_MAIL')}
                value={data?.support?.email}
                error={errors?.support?.email}
                onChange={handleInputChange('support.email')}
                required
              />
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
              <StyledInput
                label={t('FIELDS.ADDITIONAL_EMAIL')}
                value={data?.support?.email_addl}
                error={errors?.support?.email_addl}
                onChange={handleInputChange('support.email_addl')}
              />
            </Grid>
          </Grid>
        </div>
        <div>
          <h5 style={{ marginTop: 16 }}>{t('VALIDITY_PERIOD_OF_CONTACT_DATA')}</h5>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={2}>
              <DatePicker
                label={t('FIELDS.STARTED_DATE')}
                value={data?.valid_from}
                error={errors?.valid_from}
                minDate={new Date('01.01.1925')}
                maxDate={new Date('01.01.2200')}
                onChange={handleInputChange('valid_from', true)}
                required
              />
            </Grid>
            <Grid item xs={12} md={6} lg={2}>
              <DatePicker
                label={t('FIELDS.END_DATE')}
                value={data?.valid_to}
                error={errors?.valid_to}
                minDate={new Date('01.01.1925')}
                maxDate={new Date('01.01.2200')}
                onChange={handleInputChange('valid_to', true)}
                required
              />
            </Grid>
          </Grid>
        </div>
      </div>
    </section>
  );
};

PpkoContactsSection.propTypes = {
  data: PropTypes.object,
  selectsData: PropTypes.shape({
    REGION: PropTypes.array.isRequired,
    SETTLEMENT_TYPES: PropTypes.array.isRequired,
    STREET_TYPES: PropTypes.array.isRequired,
    ROOM_TYPES: PropTypes.array.isRequired
  }).isRequired,
  errors: PropTypes.object,
  onChange: PropTypes.func.isRequired
};

PpkoContactsSection.defaultProps = {
  selectsData: {
    REGION: [],
    SETTLEMENT_TYPES: [],
    STREET_TYPES: [],
    ROOM_TYPES: []
  },
  data: {}
};

export default PpkoContactsSection;

// const phoneToTemplate = value => {
//   if(!value) value = '';
//   let visualPhone = '';
//   let phone = '+' + value.replace(/\D/g, '');

//   if(phone === '+380' || !phone.startsWith('+380')) {
//     visualPhone = '+380' + (value.endsWith(' ') ? ' ' : '');
//     phone = '';
//   } else {
//     phone = phone.substring(0, 80);
//     const template = [4, 2, 3, 2, 2];
//     let symbols = 0;
//     for (let i = 0; i < template.length; i++) {
//       visualPhone += phone.substring(symbols, symbols + template[i]) + ' ';
//       symbols += template[i];

//       if(symbols >= phone.length) {
//         visualPhone += phone.substring(symbols);
//         break;
//       }
//     }
//     if(symbols <= phone.length) {
//       visualPhone += phone.substring(symbols);
//     }
//     if(!value.endsWith(' ') || phone.length >= 80) visualPhone = visualPhone.trim();
//   }
//   return {phone, visualPhone};
// };
