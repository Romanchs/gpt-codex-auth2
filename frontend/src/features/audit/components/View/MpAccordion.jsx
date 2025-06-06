import React, { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Grid, Box, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { onUpdateApsData, useAuditApsData, useAuditIsCanceled } from '../../slice';
import { checkPermissions } from '../../../../util/verifyRole';
import CircleButton from '../../../../Components/Theme/Buttons/CircleButton';
import StyledInput from '../../../../Components/Theme/Fields/StyledInput';
import DatePicker from '../../../../Components/Theme/Fields/DatePicker';
import SelectField from '../../../../Components/Theme/Fields/SelectField';
import RemoveApModal from './modals/RemoveApModal';
import { AUDITS_WRITE_PERMISSION, AUDITS_WRITE_ROLES } from '../../index';
import { AUDIT_ORDER, MP_TYPES, SITE_ACCOUNTING_SCHEME, VERIFICATION_VO, YES_NO_OPTIONS } from '../../data';
import SpAccordion from './SpAccordion';
import { useUpdateAuditMutation } from '../../api';
import AddSpModal from './modals/AddSpModal';

const MpAccordion = ({ eic, index, data }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [isButtonsVisible, setIsButtonsVisible] = useState(false);
  const [isAddSpModalOpen, setIsAddSpModalOpen] = useState(false);
  const [isRemoveMpModalOpen, setIsRemoveMpModalOpen] = useState(false);
  const res = useUpdateAuditMutation({ fixedCacheKey: 'audit-update' });
  const error = res[1]?.error?.data?.aps?.[eic];
  const viewData = useAuditApsData();
  const isCanceled = useAuditIsCanceled();
  const isEditable = !isCanceled && checkPermissions(AUDITS_WRITE_PERMISSION, AUDITS_WRITE_ROLES);

  const updateInfo = (name, value) => {
    const eicInfo = { ...data, [name]: value || undefined };
    const nonEmptyInfo = Object.entries(eicInfo).reduce((acc, [k, v]) => (v ? { ...acc, [k]: v } : acc), {});
    dispatch(onUpdateApsData({ ...viewData, [eic]: Object.keys(nonEmptyInfo).length > 0 ? nonEmptyInfo : null }));
  };

  const handleAddSp = (ap) => {
    dispatch(
      onUpdateApsData({
        ...viewData,
        [eic]: {
          ...data,
          sp_list: [
            ...data.sp_list,
            ap
          ]
        }
      })
    );
    setIsAddSpModalOpen(false);
  };

  const handleRemoveMp = () => {
    dispatch(onUpdateApsData(Object.fromEntries(Object.entries(viewData).filter(([key]) => key !== eic))));
    setIsRemoveMpModalOpen(false);
  };

  const handleOpenRemoveApModal = (e) => {
    e.stopPropagation();
    setIsRemoveMpModalOpen(true);
  }

  const handleOpenAddSpModal = (e) => {
    e.stopPropagation();
    setIsAddSpModalOpen(true);
  }

  return (
    <>
      <Accordion key={eic} onChange={(_, expanded) => setIsButtonsVisible(expanded)} className='childAccordion'>
        <AccordionSummary classes={{ expandIconWrapper: 'childAccordionExpandIconWrapper' }}>
          <Box sx={{ width: '100%' }} display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
            <p>
              {t('AUDIT.PLATFORM_X', { number: index })} - {eic}
            </p>
            {isEditable && isButtonsVisible && (
              <Box display={'flex'} gap={1}>
                <CircleButton
                  size={'small'}
                  type={'delete'}
                  title={t('AUDIT.REMOVE_SITE')}
                  onClick={handleOpenRemoveApModal}
                  dataMarker={'delete_platform'}
                />
                <CircleButton
                  size={'small'}
                  type={'add'}
                  title={t('AUDIT.ADD_AP_TO_SITE')}
                  onClick={handleOpenAddSpModal}
                  dataMarker={'add_to_platform'}
                />
              </Box>
            )}
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2} sx={{ py: 1 }} alignItems={'flex-start'}>
            <Grid item xs={12} sm={4} lg={3}>
              <StyledInput label={t('AUDIT.FIELDS.EICZ_CMP')} value={data?.eic_z} error={error?.eic_z} readOnly />
            </Grid>
            <Grid item xs={6}>
              <StyledInput
                label={t('AUDIT.FIELDS.ACCOUNTING_AREA_NAME')}
                value={data?.oc_name}
                error={error?.oc_name}
                onChange={({ target }) => updateInfo('oc_name', target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={4} lg={3}>
              <StyledInput 
                label={t('AUDIT.FIELDS.ACCOUNTING_AREA_EICY')} 
                value={data?.oc_eic} 
                onChange={({ target }) => updateInfo('oc_eic', target.value)}
                error={error?.oc_eic} />
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <SelectField
                label={t('AUDIT.FIELDS.TYPE_OF_SITE')}
                value={data?.mp_type || ''}
                data={MP_TYPES}
                onChange={(value) => updateInfo('mp_type', value)}
                disabled={!isEditable}
                error={error?.mp_type}
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <StyledInput
                label={t('AUDIT.FIELDS.TU_NUMBER')}
                value={data?.tu_number || ''}
                onChange={({ target }) => updateInfo('tu_number', target.value)}
                disabled={!isEditable}
                error={error?.tu_number}
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <DatePicker
                label={t('AUDIT.FIELDS.TU_DATE')}
                value={data?.tu_date}
                onChange={(date) => updateInfo('tu_date', date)}
                outFormat={'YYYY-MM-DD'}
                disabled={!isEditable}
                error={error?.tu_date}
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <SelectField
                label={t('AUDIT.FIELDS.VERIFICATION_VO')}
                data={VERIFICATION_VO}
                value={data?.vo_verifier || ''}
                onChange={(value) => updateInfo('vo_verifier', value)}
                disabled={!isEditable}
                error={error?.vo_verifier}
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={3.4}>
              <SelectField
                label={t('AUDIT.FIELDS.VO_VERIFIER_COMPLIES')}
                data={YES_NO_OPTIONS}
                value={data?.vo_verifier_complies || ''}
                onChange={(value) => updateInfo('vo_verifier_complies', value)}
                disabled={!isEditable}
                error={error?.vo_verifier_complies}
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <SelectField
                label={t('AUDIT.FIELDS.DKO_FORM')}
                data={AUDIT_ORDER}
                value={data?.dko_form || ''}
                onChange={(value) => updateInfo('dko_form', value)}
                disabled={!isEditable}
                error={error?.dko_form}
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <StyledInput
                label={t('CHARACTERISTICS.CONTRACTED_CONNECTION_CAPACITY')}
                value={data?.max_power || ''}
                onChange={({ target }) => updateInfo('max_power', target.value)}
                error={error?.max_power}
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={2.6}>
              <SelectField
                label={t('AUDIT.FIELDS.SITE_ACCOUNTING_SCHEME')}
                data={SITE_ACCOUNTING_SCHEME}
                value={data?.acc_scheme || ''}
                onChange={(value) => updateInfo('acc_scheme', value)}
                disabled={!isEditable}
                error={error?.acc_scheme}
              />
            </Grid>
          </Grid>
        </AccordionDetails>
        {data?.sp_list &&
          data?.sp_list?.map((sp, spIndex) => (
            <SpAccordion
              key={spIndex}
              index={spIndex}
              mpIndex={index}
              mpEic={eic}
              data={sp}
            />
          ))}
      </Accordion>
      <AddSpModal
        title={t('MODALS.ADD_AP_TO_THE_SITE', { number: index })}
        open={isAddSpModalOpen}
        onClose={() => setIsAddSpModalOpen(false)}
        onSubmit={handleAddSp}
        mpEic={eic}
      />
      <RemoveApModal
        title={t('MODALS.REMOVE_SITE', { number: index })}
        open={isRemoveMpModalOpen}
        eic={eic}
        onClose={() => setIsRemoveMpModalOpen(false)}
        onSubmit={handleRemoveMp}
      />
    </>
  );
};

export default memo(
  MpAccordion,
  (oldProps, newProps) =>
    JSON.stringify(oldProps.data) === JSON.stringify(newProps.data) && oldProps.index === newProps.index
);
