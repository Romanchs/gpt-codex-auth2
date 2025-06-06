import { Accordion, AccordionDetails, AccordionSummary, Grid } from '@mui/material';
import StyledInput from '../../../../Components/Theme/Fields/StyledInput';
import MultiSelectAuditors from '../Сreate/MultiSelectAuditors';
import DatePicker from '../../../../Components/Theme/Fields/DatePicker';
import SearchAuditors from '../SearchAuditors';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { onUpdateViewData, useAuditViewData } from '../../slice';
import { checkPermissions } from '../../../../util/verifyRole';
import { AUDITS_WRITE_PERMISSION, AUDITS_WRITE_ROLES } from '../../index';
import { useDispatch } from 'react-redux';
import { useUpdateAuditMutation } from '../../api';
import { Typography } from '@mui/material';

const MainAccordion = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const data = useAuditViewData();
  const isCanceled = data?.status === 'CANCELED';
  const isEditable = !isCanceled && checkPermissions(AUDITS_WRITE_PERMISSION, AUDITS_WRITE_ROLES);
  const res = useUpdateAuditMutation({ fixedCacheKey: 'audit-update' });
  const error = res[1]?.error?.data;

  const updateLegalInfo = (name, value) => {
    const legalInfo = { ...data?.legal_info, [name]: value || undefined };
    const nonEmptyLegalInfo = Object.entries(legalInfo).reduce((acc, [k, v]) => (v ? { ...acc, [k]: v } : acc), {});
    dispatch(
      onUpdateViewData({
        ...data,
        legal_info: Object.keys(nonEmptyLegalInfo).length > 0 ? nonEmptyLegalInfo : null
      })
    );
  };

  return (
    <Accordion>
      <AccordionSummary>{t('AUDIT_MAIN_DATA')}</AccordionSummary>
      <AccordionDetails>
        <Grid container spacing={2} sx={{ py: 1 }} alignItems={'flex-start'}>
          <Grid item xs={12} sm={6} lg={3}>
            <StyledInput
              label={t('FIELDS.AUDIT_TYPE')}
              value={t(`AUDIT_TYPES.${data?.audit_type || 'SCHEDULED'}`)}
              disabled
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <StyledInput label={t('FIELDS.USER_INITIATOR')} value={data?.initiator} disabled />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <StyledInput label={t('FIELDS.EVENT_TYPE')} value={data?.job_type} disabled />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <MultiSelectAuditors
              value={data?.auditor || []}
              label={t('FIELDS.INSPECTOR_FULL_NAME')}
              disabled={!isEditable}
              onChange={(auditor) => dispatch(onUpdateViewData({ ...data, auditor }))}
              error={error?.auditor}
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={2}>
            <DatePicker
              label={t('FIELDS.AUDIT_DKO_DATE_START')}
              value={data?.audit_period_start}
              onChange={(audit_period_start) => dispatch(onUpdateViewData({ ...data, audit_period_start }))}
              outFormat={'YYYY-MM-DD'}
              disabled={!isEditable}
              error={error?.audit_period_start}
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={2}>
            <DatePicker
              label={t('FIELDS.AUDIT_DKO_DATE_END')}
              value={data?.audit_period_end}
              onChange={(audit_period_end) => dispatch(onUpdateViewData({ ...data, audit_period_end }))}
              outFormat={'YYYY-MM-DD'}
              disabled={!isEditable}
              error={error?.audit_period_end}
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={4}>
            <SearchAuditors
              label={t('FIELDS.MANAGER_FULL_NAME')}
              showAll
              defaultValue={data?.manager}
              onSelect={(manager) => dispatch(onUpdateViewData({ ...data, manager }))}
              disabled={!isEditable}
              error={error?.manager}
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={2}>
            <DatePicker
              label={t('FIELDS.AUDIT_DATE_START')}
              value={data?.date_start}
              onChange={(date_start) => dispatch(onUpdateViewData({ ...data, date_start }))}
              outFormat={'YYYY-MM-DD'}
              disabled={!isEditable}
              error={error?.date_start}
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={2}>
            <DatePicker
              label={t('FIELDS.AUDIT_DATE_END')}
              value={data?.date_end}
              onChange={(date_end) => dispatch(onUpdateViewData({ ...data, date_end }))}
              outFormat={'YYYY-MM-DD'}
              disabled={!isEditable}
              error={error?.date_end}
            />
          </Grid>
          {data?.audit_type === 'UNSCHEDULED' && (
            <Grid item xs={12}>
              <StyledInput 
                label={t('FIELDS.JUSTIFICATION')} 
                value={data.rationale} 
                multiline  
                onChange={({ target }) => dispatch(onUpdateViewData({ ...data, rationale: target.value }))} 
                error={error?.rationale} />
            </Grid>
          )}
          <Grid item xs={12}>
          <Typography component={'p'} sx={{ fontSize: 16, color: '#567691', my: 1 }}>{t('PPKO')}</Typography>
          </Grid>
          <Grid item xs={12}>
            <StyledInput label={t('FIELDS.PPKO_NAME')} value={data?.name} disabled />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <StyledInput label={t('FIELDS.EIC_PPKO')} value={data?.eic_x} disabled />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <StyledInput label={t('FIELDS.USREOU')} value={data?.usreou} disabled />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <StyledInput 
              label={t('FIELDS.CITY')} 
              value={data?.city}  
              onChange={({ target }) => dispatch(onUpdateViewData({ ...data, city: target.value }))}
              error={error?.city} />
          </Grid>
          <Grid item xs={12} lg={9}>
            <StyledInput 
              label={t('CONTACTS_DATA.ADDRESS')} 
              value={data?.address} 
              onChange={({ target }) => dispatch(onUpdateViewData({ ...data, address: target.value }))}
              error={error?.address} />
          </Grid>
          <Grid item xs={12}>
          <Typography component={'p'} sx={{ fontSize: 16, color: '#567691', my: 1 }}>{t('NOTICE_AND_REFERRAL')}</Typography>
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <StyledInput
              label={t('AUDIT.FIELDS.NOTIFICATION_NUMBER')}
              value={data?.legal_info?.notification_number || ''}
              disabled={!isEditable}
              onChange={({ target }) => updateLegalInfo('notification_number', target.value)}
              error={error?.legal_info?.notification_number}
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <DatePicker
              label={t('AUDIT.FIELDS.NOTIFICATION_DATE')}
              value={data?.legal_info?.notification_date}
              onChange={(date) => updateLegalInfo('notification_date', date)}
              outFormat={'YYYY-MM-DD'}
              disabled={!isEditable}
              error={error?.legal_info?.notification_date}
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <StyledInput
              label={t('AUDIT.FIELDS.REFERRAL_NUMBER')}
              value={data?.legal_info?.referral_number || ''}
              disabled={!isEditable}
              onChange={({ target }) => updateLegalInfo('referral_number', target.value)}
              error={error?.legal_info?.referral_number}
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <DatePicker
              label={t('AUDIT.FIELDS.REFERRAL_DATE')}
              value={data?.legal_info?.referral_date}
              onChange={(date) => updateLegalInfo('referral_date', date)}
              outFormat={'YYYY-MM-DD'}
              disabled={!isEditable}
              error={error?.legal_info?.referral_date}
            />
          </Grid>
           <Grid item xs={12}>
            <Typography component={'p'} sx={{ fontSize: 16, color: '#567691', my: 1 }}>{t('AUDIT.INSPECTION_ACT')}</Typography>
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <StyledInput
              label={t('AUDIT.FIELDS.INSPECTION_NUMBER')}
              value={data?.legal_info?.inspection_number || ''}
              onChange={({ target }) => updateLegalInfo('inspection_number', target.value)}
              disabled={!isEditable}
              error={error?.legal_info?.inspection_number}
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <DatePicker
              label={t('AUDIT.FIELDS.INSPECTION_DATE')}
              value={data?.legal_info?.inspection_date}
              onChange={(date) => updateLegalInfo('inspection_date', date)}
              outFormat={'YYYY-MM-DD'}
              disabled={!isEditable}
              error={error?.legal_info?.inspection_date}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography component={'p'} sx={{ fontSize: 16, color: '#567691', my: 1 }}>{t('FIELDS.AUDIT_NOTIFICATION')}</Typography>
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <StyledInput
              label={t('AUDIT.FIELDS.NOTICE_NUMBER')}
              value={data?.legal_info?.notice_number || ''}
              onChange={({ target }) => updateLegalInfo('notice_number', target.value)}
              disabled={!isEditable}
              error={error?.legal_info?.notice_number}
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <DatePicker
              label={t('AUDIT.FIELDS.NOTICE_DATE')}
              value={data?.legal_info?.notice_date}
              onChange={(date) => updateLegalInfo('notice_date', date)}
              outFormat={'YYYY-MM-DD'}
              disabled={!isEditable}
              error={error?.legal_info?.notice_date}
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <DatePicker
              label={t('FIELDS.NOTIFICATION_COMPLETE_DATE')}
              value={data?.legal_info?.notice_executed}
              onChange={(date) => updateLegalInfo('notice_executed', date)}
              outFormat={'YYYY-MM-DD'}
              disabled={!isEditable}
              error={error?.legal_info?.notice_executed}
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <DatePicker
              label={t('FIELDS.NOTIFICATION_END_DATE')}
              value={data?.legal_info?.notice_closed}
              onChange={(date) => updateLegalInfo('notice_closed', date)}
              outFormat={'YYYY-MM-DD'}
              disabled={!isEditable}
              error={error?.legal_info?.notice_closed}
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <StyledInput
              label={t('AUDIT_COMPLETION.TAKEN_OUT')}
              value={data?.legal_info?.taken_out_reason || ''}
              onChange={({ target }) => updateLegalInfo('taken_out_reason', target.value)}
              disabled={!isEditable}
              max={50}
              error={error?.legal_info?.taken_out_reason}
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <DatePicker
              label={t('AUDIT.FIELDS.TAKE_OUT_DATE')}
              value={data?.legal_info?.taken_out_date}
              onChange={(date) => updateLegalInfo('taken_out_date', date)}
              outFormat={'YYYY-MM-DD'}
              disabled={!isEditable}
              error={error?.legal_info?.taken_out_date}
            />
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
};

export default MainAccordion;
