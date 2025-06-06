import React, { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { onDeleteSpFromApsData, onUpdateSpApsData, useAuditIsCanceled } from '../../slice';
import { checkPermissions } from '../../../../util/verifyRole';
import { AUDITS_WRITE_PERMISSION, AUDITS_WRITE_ROLES } from '../..';
import CircleButton from '../../../../Components/Theme/Buttons/CircleButton';
import StyledInput from '../../../../Components/Theme/Fields/StyledInput';
import SelectField from '../../../../Components/Theme/Fields/SelectField';
import RemoveApModal from './modals/RemoveApModal';
import { Accordion, AccordionDetails, AccordionSummary, Box, Grid } from '@mui/material';
import Typography from '@mui/material/Typography';
import { COUNTER_DUPLICATE, SEALING_REPORT_NUMBER, YES_NO_OPTIONS } from '../../data';
import { useUpdateAuditMutation } from '../../api';

const SpAccordion = ({ mpEic, index, mpIndex, data }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [isButtonsVisible, setIsButtonsVisible] = useState(false);
  const [isRemoveApModalOpen, setIsRemoveApModalOpen] = useState(false);
  const isCanceled = useAuditIsCanceled();
  const isEditable = !isCanceled && checkPermissions(AUDITS_WRITE_PERMISSION, AUDITS_WRITE_ROLES);
  const res = useUpdateAuditMutation({ fixedCacheKey: 'audit-update' });
  const error = res[1]?.error?.data?.aps?.[mpEic]?.sp_list?.[index];

  const updateInfo = (name, value) => {
    const eicInfo = { ...data, [name]: value || undefined };
    const nonEmptyInfo = Object.entries(eicInfo).reduce((acc, [k, v]) => (v ? { ...acc, [k]: v } : acc), {});
    dispatch(
      onUpdateSpApsData({
        mpEic,
        index,
        data: { ...(Object.keys(nonEmptyInfo).length > 0 ? nonEmptyInfo : null) }
      })
    );
  };

  const handleRemoveAp = () => {
    dispatch(onDeleteSpFromApsData({ mpEic, spEic: data.eic_z }));
    setIsRemoveApModalOpen(false);
  };

  const handleOpenRemoveApModal = (e) => {
    e.stopPropagation();
    setIsRemoveApModalOpen(true);
  };

  return (
    <>
      <Accordion key={index} onChange={(_, expanded) => setIsButtonsVisible(expanded)} className='childAccordion'>
        <AccordionSummary classes={{ expandIconWrapper: 'childAccordionExpandIconWrapper' }} sx={{ml: 1}}>
          <Box sx={{ width: '100%' }} display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
            <p>
              {t('AUDIT.AP_X', { number: index + 1 })} - {data?.eic_z}
            </p>
            {isEditable && isButtonsVisible && (
              <CircleButton
                size={'small'}
                type={'delete'}
                title={t('AUDIT.REMOVE_AP')}
                onClick={handleOpenRemoveApModal}
                dataMarker={'delete_tko'}
              />
            )}
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2} sx={{ py: 1 }} alignItems={'flex-start'}>
            <Grid item xs={12} sm={6} lg={2.4}>
              <StyledInput
                label={t('AUDIT.FIELDS.EICZ_CMP')}
                value={data?.eic_z}
                onChange={({ target }) => updateInfo('eic_z', target.value)}
                disabled={!isEditable}
                error={error?.eic_z}
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={2.4}>
              <StyledInput
                label={t('CHARACTERISTICS.INSTALLATION_PLACE')}
                value={data?.counter_place || ''}
                onChange={({ target }) => updateInfo('counter_place', target.value)}
                disabled={!isEditable}
                error={error?.counter_place}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography component="p" sx={{ fontSize: 16, color: '#567691', my: 1 }}>
                {t('AUDIT.MAIN_COUNTER')}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} lg={2.4}>
              <StyledInput
                label={t('AUDIT.FIELDS.COUNTER_NUMBER')}
                value={data?.counter_number || ''}
                onChange={({ target }) => updateInfo('counter_number', target.value)}
                disabled={!isEditable}
                error={error?.counter_number}
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={2.4}>
              <StyledInput
                label={t('AUDIT.FIELDS.COUNTER_TYPE')}
                value={data?.counter_type || ''}
                onChange={({ target }) => updateInfo('counter_type', target.value)}
                disabled={!isEditable}
                error={error?.counter_type}
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={2.4}>
              <StyledInput
                label={t('AUDIT.FIELDS.COUNTER_CHECK_DATE')}
                value={data?.counter_verify_date || ''}
                onChange={({ target }) => updateInfo('counter_verify_date', target.value)}
                disabled={!isEditable}
                error={error?.counter_verify_date}
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={2.4}>
              <StyledInput
                label={t('AUDIT.FIELDS.COUNTER_PREC')}
                value={data?.counter_prec || ''}
                onChange={({ target }) => updateInfo('counter_prec', target.value)}
                disabled={!isEditable}
                error={error?.counter_prec}
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={2.4}>
              <SelectField
                label={t('AUDIT.FIELDS.COUNTER_SEALED')}
                data={YES_NO_OPTIONS}
                value={data?.counter_sealed || ''}
                onChange={(value) => updateInfo('counter_sealed', value)}
                disabled={!isEditable}
                error={error?.counter_sealed}
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={3.2}>
              <StyledInput
                label={t('AUDIT.FIELDS.COUNTER_RANGES_DURATION')}
                value={data?.counter_ranges || ''}
                onChange={({ target }) => updateInfo('counter_ranges', target.value)}
                disabled={!isEditable}
                error={error?.counter_ranges}
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={2.4}>
              <StyledInput
                label={t('AUDIT.FIELDS.COUNTER_VOLTAGE_LEVEL')}
                value={data?.counter_v_range || ''}
                onChange={({ target }) => updateInfo('counter_v_range', target.value)}
                disabled={!isEditable}
                error={error?.counter_v_range}
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={2.4}>
              <StyledInput
                label={t('AUDIT.FIELDS.MEASUREMENT_INTERVAL')}
                value={data?.counter_periodicity || ''}
                onChange={({ target }) => updateInfo('counter_periodicity', target.value)}
                disabled={!isEditable}
                error={error?.counter_periodicity}
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={4}>
              <SelectField
                label={t('AUDIT.FIELDS.COUNTER_COMPLIES')}
                data={YES_NO_OPTIONS}
                value={data?.counter_complies || ''}
                onChange={(value) => updateInfo('counter_complies', value)}
                disabled={!isEditable}
                error={error?.counter_complies}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography component={'p'} sx={{ fontSize: 16, color: '#567691', my: 1 }}>
                {t('AUDIT.MAIN_TS')}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} lg={2.4}>
              <StyledInput
                label={t('AUDIT.FIELDS.TS_NUMBER')}
                value={data?.ts_number || ''}
                onChange={({ target }) => updateInfo('ts_number', target.value)}
                disabled={!isEditable}
                error={error?.ts_number}
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={2.4}>
              <StyledInput
                label={t('AUDIT.FIELDS.TS_TYPE')}
                value={data?.ts_type || ''}
                onChange={({ target }) => updateInfo('ts_type', target.value)}
                disabled={!isEditable}
                error={error?.ts_type}
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={2.4}>
              <StyledInput
                label={t('AUDIT.FIELDS.TS_VERIFY_DATE')}
                value={data?.ts_verify_date || ''}
                onChange={({ target }) => updateInfo('ts_verify_date', target.value)}
                disabled={!isEditable}
                error={error?.ts_verify_date}
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={2.4}>
              <StyledInput
                label={t('AUDIT.FIELDS.TS_PREC')}
                value={data?.ts_prec || ''}
                onChange={({ target }) => updateInfo('ts_prec', target.value)}
                disabled={!isEditable}
                error={error?.ts_prec}
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={2.4}>
              <StyledInput
                label={t('AUDIT.FIELDS.TS_MULTIPLIER')}
                value={data?.ts_multiplier || ''}
                onChange={({ target }) => updateInfo('ts_multiplier', target.value)}
                disabled={!isEditable}
                error={error?.ts_multiplier}
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={2.4}>
              <SelectField
                label={t('AUDIT.FIELDS.TS_SEALED')}
                data={YES_NO_OPTIONS}
                value={data?.ts_sealed || ''}
                onChange={(value) => updateInfo('ts_sealed', value)}
                disabled={!isEditable}
                error={error?.ts_sealed}
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={4}>
              <SelectField
                label={t('AUDIT.FIELDS.TS_COMPLIES')}
                data={YES_NO_OPTIONS}
                value={data?.ts_complies || ''}
                onChange={(value) => updateInfo('ts_complies', value)}
                disabled={!isEditable}
                error={error?.ts_complies}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography component={'p'} sx={{ fontSize: 16, color: '#567691', my: 1 }}>
                {t('AUDIT.MAIN_TN')}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} lg={2.4}>
              <StyledInput
                label={t('AUDIT.FIELDS.TN_NUMBER')}
                value={data?.tn_number || ''}
                onChange={({ target }) => updateInfo('tn_number', target.value)}
                disabled={!isEditable}
                error={error?.tn_number}
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={2.4}>
              <StyledInput
                label={t('AUDIT.FIELDS.TN_TYPE')}
                value={data?.tn_type || ''}
                onChange={({ target }) => updateInfo('tn_type', target.value)}
                disabled={!isEditable}
                error={error?.tn_type}
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={2.4}>
              <StyledInput
                label={t('AUDIT.FIELDS.TN_VERIFY_DATE')}
                value={data?.tn_verify_date || ''}
                onChange={({ target }) => updateInfo('tn_verify_date', target.value)}
                disabled={!isEditable}
                error={error?.tn_verify_date}
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={2.4}>
              <StyledInput
                label={t('AUDIT.FIELDS.TN_PREC')}
                value={data?.tn_prec || ''}
                onChange={({ target }) => updateInfo('tn_prec', target.value)}
                disabled={!isEditable}
                error={error?.tn_prec}
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={2.4}>
              <StyledInput
                label={t('AUDIT.FIELDS.TN_MULTIPLIER')}
                value={data?.tn_multiplier || ''}
                onChange={({ target }) => updateInfo('tn_multiplier', target.value)}
                disabled={!isEditable}
                error={error?.tn_multiplier}
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={2.4}>
              <SelectField
                label={t('AUDIT.FIELDS.TN_SEALED')}
                data={YES_NO_OPTIONS}
                value={data?.tn_sealed || ''}
                onChange={(value) => updateInfo('tn_sealed', value)}
                disabled={!isEditable}
                error={error?.tn_sealed}
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={4}>
              <SelectField
                label={t('AUDIT.FIELDS.TN_COMPLIES')}
                data={YES_NO_OPTIONS}
                value={data?.tn_complies || ''}
                onChange={(value) => updateInfo('tn_complies', value)}
                disabled={!isEditable}
                error={error?.tn_complies}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography component={'p'} sx={{ fontSize: 16, color: '#567691', my: 1 }}>
                {t('AUDIT.COUNTER_DUPLICATE')}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} lg={2.4}>
              <SelectField
                label={t('AUDIT.FIELDS.COUNTER_DUPLICATE')}
                data={COUNTER_DUPLICATE}
                value={data?.counter_dup_exist || ''}
                onChange={(value) => updateInfo('counter_dup_exist', value)}
                disabled={!isEditable}
                error={error?.counter_dup_exist}
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <StyledInput
                label={t('AUDIT.FIELDS.COUNTER_DUP_NUMBER')}
                value={data?.counter_dup_number || ''}
                onChange={({ target }) => updateInfo('counter_dup_number', target.value)}
                disabled={!isEditable}
                error={error?.counter_dup_number}
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <StyledInput
                label={t('AUDIT.FIELDS.COUNTER_DUP_TYPE')}
                value={data?.counter_dup_type || ''}
                onChange={({ target }) => updateInfo('counter_dup_type', target.value)}
                disabled={!isEditable}
                error={error?.counter_dup_type}
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={3.6}>
              <StyledInput
                label={t('AUDIT.FIELDS.COUNTER_DUP_VERIFY_DATE')}
                value={data?.counter_dup_verify_date || ''}
                onChange={({ target }) => updateInfo('counter_dup_verify_date', target.value)}
                disabled={!isEditable}
                error={error?.counter_dup_verify_date}
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <StyledInput
                label={t('AUDIT.FIELDS.COUNTER_DUP_PREC')}
                value={data?.counter_dup_prec || ''}
                onChange={({ target }) => updateInfo('counter_dup_prec', target.value)}
                disabled={!isEditable}
                error={error?.counter_dup_prec}
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <SelectField
                label={t('AUDIT.FIELDS.COUNTER_DUP_SEALED')}
                data={YES_NO_OPTIONS}
                value={data?.counter_dup_sealed || ''}
                onChange={(value) => updateInfo('counter_dup_sealed', value)}
                disabled={!isEditable}
                error={error?.counter_dup_sealed}
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={6}>
              <StyledInput
                label={t('AUDIT.FIELDS.COUNTER_DUP_DURATION')}
                value={data?.counter_dup_ranges || ''}
                onChange={({ target }) => updateInfo('counter_dup_ranges', target.value)}
                disabled={!isEditable}
                error={error?.counter_dup_ranges}
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <StyledInput
                label={t('AUDIT.FIELDS.COUNTER_DUP_VOLTAGE_LEVEL')}
                value={data?.counter_dup_v_range || ''}
                onChange={({ target }) => updateInfo('counter_dup_v_range', target.value)}
                disabled={!isEditable}
                error={error?.counter_dup_v_range}
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={4}>
              <StyledInput
                label={t('AUDIT.FIELDS.COUNTER_DUP_MEASUREMENT_INTERVAL')}
                value={data?.counter_dup_periodicity || ''}
                onChange={({ target }) => updateInfo('counter_dup_periodicity', target.value)}
                disabled={!isEditable}
                error={error?.counter_dup_periodicity}
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={4}>
              <SelectField
                label={t('AUDIT.FIELDS.COUNTER_DUP_COMPLIES')}
                data={YES_NO_OPTIONS}
                value={data?.counter_dup_complies || ''}
                onChange={(value) => updateInfo('counter_dup_complies', value)}
                disabled={!isEditable}
                error={error?.counter_dup_complies}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography component="p" sx={{ fontSize: 16, color: '#567691', my: 1 }}>
                {t('AUDIT.DUP_TS')}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} lg={2.4}>
              <StyledInput
                label={t('AUDIT.FIELDS.TS_DUP_NUMBER')}
                value={data?.ts_dup_number || ''}
                onChange={({ target }) => updateInfo('ts_dup_number', target.value)}
                disabled={!isEditable}
                error={error?.ts_dup_number}
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={2.4}>
              <StyledInput
                label={t('AUDIT.FIELDS.TS_DUP_TYPE')}
                value={data?.ts_dup_type || ''}
                onChange={({ target }) => updateInfo('ts_dup_type', target.value)}
                disabled={!isEditable}
                error={error?.ts_dup_type}
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={2.4}>
              <StyledInput
                label={t('AUDIT.FIELDS.TS_DUP_VERIFY_DATE')}
                value={data?.ts_dup_verify_date || ''}
                onChange={({ target }) => updateInfo('ts_dup_verify_date', target.value)}
                disabled={!isEditable}
                error={error?.ts_dup_verify_date}
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={2.4}>
              <StyledInput
                label={t('AUDIT.FIELDS.TS_DUP_PREC')}
                value={data?.ts_dup_prec || ''}
                onChange={({ target }) => updateInfo('ts_dup_prec', target.value)}
                disabled={!isEditable}
                error={error?.ts_dup_prec}
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={2.4}>
              <StyledInput
                label={t('AUDIT.FIELDS.TS_DUP_MULTIPLIER')}
                value={data?.ts_dup_multiplier || ''}
                onChange={({ target }) => updateInfo('ts_dup_multiplier', target.value)}
                disabled={!isEditable}
                error={error?.ts_dup_multiplier}
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={2.4}>
              <SelectField
                label={t('AUDIT.FIELDS.TS_DUP_SEALED')}
                data={YES_NO_OPTIONS}
                value={data?.ts_dup_sealed || ''}
                onChange={(value) => updateInfo('ts_dup_sealed', value)}
                disabled={!isEditable}
                error={error?.ts_dup_sealed}
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={4}>
              <SelectField
                label={t('AUDIT.FIELDS.TS_DUP_COMPLIES')}
                data={YES_NO_OPTIONS}
                value={data?.ts_dup_complies || ''}
                onChange={(value) => updateInfo('ts_dup_complies', value)}
                disabled={!isEditable}
                error={error?.ts_dup_complies}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography component={'p'} sx={{ fontSize: 16, color: '#567691', my: 1 }}>
                {t('AUDIT.DUP_TN')}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} lg={2.4}>
              <StyledInput
                label={t('AUDIT.FIELDS.TN_DUP_NUMBER')}
                value={data?.tn_dup_number || ''}
                onChange={({ target }) => updateInfo('tn_dup_number', target.value)}
                disabled={!isEditable}
                error={error?.tn_dup_number}
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={2.4}>
              <StyledInput
                label={t('AUDIT.FIELDS.TN_DUP_TYPE')}
                value={data?.tn_dup_type || ''}
                onChange={({ target }) => updateInfo('tn_dup_type', target.value)}
                disabled={!isEditable}
                error={error?.tn_dup_type}
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={2.4}>
              <StyledInput
                label={t('AUDIT.FIELDS.TN_DUP_VERIFY_DATE')}
                value={data?.tn_dup_verify_date || ''}
                onChange={({ target }) => updateInfo('tn_dup_verify_date', target.value)}
                disabled={!isEditable}
                error={error?.tn_dup_verify_date}
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={2.4}>
              <StyledInput
                label={t('AUDIT.FIELDS.TN_DUP_PREC')}
                value={data?.tn_dup_prec || ''}
                onChange={({ target }) => updateInfo('tn_dup_prec', target.value)}
                disabled={!isEditable}
                error={error?.tn_dup_prec}
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={2.4}>
              <StyledInput
                label={t('AUDIT.FIELDS.TN_DUP_MULTIPLIER')}
                value={data?.tn_dup_multiplier || ''}
                onChange={({ target }) => updateInfo('tn_dup_multiplier', target.value)}
                disabled={!isEditable}
                error={error?.tn_dup_multiplier}
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={2.4}>
              <SelectField
                label={t('AUDIT.FIELDS.TN_DUP_SEALED')}
                data={YES_NO_OPTIONS}
                value={data?.tn_dup_sealed || ''}
                onChange={(value) => updateInfo('tn_dup_sealed', value)}
                disabled={!isEditable}
                error={error?.tn_dup_sealed}
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={4}>
              <SelectField
                label={t('AUDIT.FIELDS.TN_DUP_COMPLIES')}
                data={YES_NO_OPTIONS}
                value={data?.tn_dup_complies || ''}
                onChange={(value) => updateInfo('tn_dup_complies', value)}
                disabled={!isEditable}
                error={error?.tn_dup_complies}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography component="p" sx={{ fontSize: 16, color: '#567691', my: 1 }}>
                {t('AUDIT.OTHER')}
              </Typography>
            </Grid>
            <Grid item xs={8.7}>
              <SelectField
                label={t('AUDIT.FIELDS.LIMITATIONS_SEALED')}
                data={YES_NO_OPTIONS}
                value={data?.limitations_sealed || ''}
                onChange={(value) => updateInfo('limitations_sealed', value)}
                disabled={!isEditable}
                error={error?.limitations_sealed}
              />
            </Grid>
            <Grid item xs={8.7}>
              <SelectField
                label={t('AUDIT.FIELDS.DUP_LIMITATIONS_SEALED')}
                data={YES_NO_OPTIONS}
                value={data?.limitations_dup_sealed || ''}
                onChange={(value) => updateInfo('limitations_dup_sealed', value)}
                disabled={!isEditable}
                error={error?.limitations_dup_sealed}
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={4}>
              <SelectField
                label={t('AUDIT.FIELDS.SEALING_REPORT_NUMBER')}
                value={data?.seal_cert || ''}
                onChange={(value) => updateInfo('seal_cert', value)}
                disabled={!isEditable}
                data={SEALING_REPORT_NUMBER}
                error={error?.seal_cert}
              />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
      <RemoveApModal
        title={t('MODALS.REMOVE_AP', { sp_number: index + 1, mp_number: mpIndex })}
        open={isRemoveApModalOpen}
        eic={data?.eic_z}
        onClose={() => setIsRemoveApModalOpen(false)}
        onSubmit={handleRemoveAp}
      />
    </>
  );
};

export default memo(
  SpAccordion,
  (oldProps, newProps) =>
    JSON.stringify(oldProps.data) === JSON.stringify(newProps.data) && oldProps.index === newProps.index
);
