import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { onUpdateViewData, useAuditViewData } from '../../slice';
import { checkPermissions } from '../../../../util/verifyRole';
import { AUDITS_WRITE_PERMISSION, AUDITS_WRITE_ROLES } from '../../index';
import { Accordion, AccordionDetails, AccordionSummary, Grid } from '@mui/material';
import StyledInput from '../../../../Components/Theme/Fields/StyledInput';
import React from 'react';
import DatePicker from '../../../../Components/Theme/Fields/DatePicker';
import { useUpdateAuditMutation } from '../../api';

const GeneralInfoAccordion = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const data = useAuditViewData();
  const general_info = data?.general_info || {};
  const isCanceled = data?.status === 'CANCELED';
  const isEditable = !isCanceled && checkPermissions(AUDITS_WRITE_PERMISSION, AUDITS_WRITE_ROLES);
  const res = useUpdateAuditMutation({ fixedCacheKey: 'audit-update' });
  const error = res[1]?.error?.data?.general_info;

  const updateInfo = (name, value) => {
    const generalInfo = { ...general_info, [name]: value || undefined };
    const nonEmptyInfo = Object.entries(generalInfo).reduce((acc, [k, v]) => (v ? { ...acc, [k]: v } : acc), {});
    dispatch(
      onUpdateViewData({
        ...data,
        general_info: Object.keys(nonEmptyInfo).length > 0 ? nonEmptyInfo : null
      })
    );
  };

  return (
    <Accordion>
      <AccordionSummary>{t('AUDIT.PPKO_GENERAL_INFO')}</AccordionSummary>
      <AccordionDetails>
        <Grid container spacing={2} sx={{ py: 1 }} alignItems={'flex-start'}>
          <Grid item xs={12} sm={6} lg={3}>
            <StyledInput
              label={t('AUDIT.FIELDS.PPKO_MANAGER')}
              value={general_info?.manager || ''}
              onChange={({ target }) => updateInfo('manager', target.value)}
              disabled={!isEditable}
              error={error?.manager}
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <StyledInput
              label={t('AUDIT.FIELDS.PPKO_RESPONSIBLE')}
              value={general_info?.responsible || ''}
              onChange={({ target }) => updateInfo('responsible', target.value)}
              disabled={!isEditable}
              error={error?.responsible}
            />
          </Grid>
          <Grid item xs={12} lg={6}>
            <StyledInput
              label={t('AUDIT.FIELDS.POWER_OF_ATTORNEY')}
              value={general_info?.power_of_attorney || ''}
              onChange={({ target }) => updateInfo('power_of_attorney', target.value)}
              disabled={!isEditable}
              error={error?.power_of_attorney}
            />
          </Grid>
          <Grid item xs={12}>
            <StyledInput
              label={t('AUDIT.FIELDS.OTHER_RESPONSIBLES')}
              value={general_info?.other_responsibles || ''}
              onChange={({ target }) => updateInfo('other_responsibles', target.value)}
              disabled={!isEditable}
              error={error?.other_responsibles}
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <DatePicker
              label={t('PPKO_REGISTRATION_DATA.DATE_REGISTRATION_RA')}
              value={general_info?.registered}
              onChange={(date) => updateInfo('registered', date)}
              outFormat={'YYYY-MM-DD'}
              disabled={!isEditable}
              error={error?.registered}
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={9}>
            <StyledInput
              label={t('AUDIT.FIELDS.ROLES')}
              value={general_info?.roles}
              onChange={({ target }) => updateInfo('roles', target.value)}
              disabled={!isEditable}
              error={error?.roles}
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <StyledInput
              label={t('AUDIT.FIELDS.AS_DEVELOPER')}
              value={general_info?.as_developer}
              onChange={({ target }) => updateInfo('as_developer', target.value)}
              disabled={!isEditable}
              error={error?.as_developer}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <StyledInput
              label={t('AUDIT.FIELDS.AS_COMMISSIONING_NUMBER')}
              value={general_info?.as_commissioning_number}
              onChange={({ target }) => updateInfo('as_commissioning_number', target.value)}
              disabled={!isEditable}
              error={error?.as_commissioning_number}
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <DatePicker
              label={t('AUDIT.FIELDS.AS_COMMISSIONING_DATE')}
              value={general_info?.as_commissioning_date}
              onChange={(date) => updateInfo('as_commissioning_date', date)}
              outFormat={'YYYY-MM-DD'}
              disabled={!isEditable}
              error={error?.as_commissioning_date}
            />
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
};

export default GeneralInfoAccordion;
