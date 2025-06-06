import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { onUpdateViewData, useAuditViewData } from '../../slice';
import { checkPermissions } from '../../../../util/verifyRole';
import { AUDITS_WRITE_PERMISSION, AUDITS_WRITE_ROLES } from '../../index';
import { Accordion, AccordionDetails, AccordionSummary, Grid } from '@mui/material';
import StyledInput from '../../../../Components/Theme/Fields/StyledInput';
import React from 'react';
import { useUpdateAuditMutation } from '../../api';
import { AUDIT_NOTICE, AUDIT_ORDER, EXIST_DEPART } from '../../data';
import SelectField from '../../../../Components/Theme/Fields/SelectField';

const ActivityAccordion = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const data = useAuditViewData();
  const activity = data?.activity || {};
  const isCanceled = data?.status === 'CANCELED';
  const isEditable = !isCanceled && checkPermissions(AUDITS_WRITE_PERMISSION, AUDITS_WRITE_ROLES);
  const res = useUpdateAuditMutation({ fixedCacheKey: 'audit-update' });
  const error = res[1]?.error?.data;

  const updateInfo = (name, value) => {
    const activityInfo = { ...activity, [name]: value || undefined };
    const nonEmptyInfo = Object.entries(activityInfo).reduce((acc, [k, v]) => (v ? { ...acc, [k]: v } : acc), {});
    dispatch(
      onUpdateViewData({
        ...data,
        activity: Object.keys(nonEmptyInfo).length > 0 ? nonEmptyInfo : null
      })
    );
  };

  return (
    <Accordion>
      <AccordionSummary>{t('AUDIT.PPKO_ACTIVITY')}</AccordionSummary>
      <AccordionDetails>
        <Grid container spacing={2} sx={{ py: 1 }} alignItems={'flex-start'}>
          <Grid item xs={12} sm={6} lg={2.8}>
            <StyledInput
              label={t('AUDIT.FIELDS.AGREEMENT_AKO')}
              value={activity?.agreement_ako || ''}
              onChange={({ target }) => updateInfo('agreement_ako', target.value)}
              disabled={!isEditable}
              error={error?.activity?.agreement_ako}
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3.6}>
            <StyledInput
              label={t('AUDIT.FIELDS.AGREEMENT_OS')}
              value={activity?.agreement_os || ''}
              onChange={({ target }) => updateInfo('agreement_os', target.value)}
              disabled={!isEditable}
              error={error?.activity?.agreement_os}
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={2.8}>
            <StyledInput
              label={t('AUDIT.FIELDS.AGREEMENT_VTKO')}
              value={activity?.agreement_vtko || ''}
              onChange={({ target }) => updateInfo('agreement_vtko', target.value)}
              disabled={!isEditable}
              error={error?.activity?.agreement_vtko}
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={2.8}>
            <StyledInput
              label={t('AUDIT.FIELDS.AGREEMENT_PPKO')}
              value={activity?.agreement_ppko || ''}
              onChange={({ target }) => updateInfo('agreement_ppko', target.value)}
              disabled={!isEditable}
              error={error?.activity?.agreement_ppko}
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3.6}>
              <SelectField
                label={t('AUDIT.FIELDS.PPKO_APPLICATION')}
                value={activity?.ppko_application || ''}
                data={AUDIT_NOTICE}
                ignoreI18={false}
                onChange={(value) => updateInfo('ppko_application', value)}
                disabled={!isEditable}
                error={error?.activity?.ppko_application}
              />
          </Grid>
          <Grid item xs={12} sm={6} lg={2.8}>
            <SelectField
              label={t('AUDIT.FIELDS.DKO_WRITE')}
              data={EXIST_DEPART}
              ignoreI18={false}
              value={activity?.dko_write || ''}
              onChange={(value) => updateInfo('dko_write', value)}
              disabled={!isEditable}
              error={error?.activity?.dko_write}
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={2.8}>
            <SelectField
              label={t('AUDIT.FIELDS.DKO_READ')}
              data={AUDIT_ORDER}
              ignoreI18={false}
              value={activity?.dko_read || ''}
              onChange={(value) => updateInfo('dko_read', value)}
              disabled={!isEditable}
              error={error?.activity?.dko_read}
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={2.8}>
            <SelectField
              label={t('AUDIT.FIELDS.DKO_PROCESS')}
              data={AUDIT_ORDER}
              ignoreI18={false}
              value={activity?.dko_process || ''}
              onChange={(value) => updateInfo('dko_process', value)}
              disabled={!isEditable}
              error={error?.activity?.dko_process}
            />
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
};

export default ActivityAccordion;
