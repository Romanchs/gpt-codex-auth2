import { StyledDialog } from '../../../../features/reports/ReportsModal';
import { DialogActions, DialogContent, DialogTitle, Stack } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import CloseRounded from '@mui/icons-material/CloseRounded';
import { BlueButton } from '../../../Theme/Buttons/BlueButton';
import { GreenButton } from '../../../Theme/Buttons/GreenButton';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import StyledInput from '../../../Theme/Fields/StyledInput';
import i18n from 'i18next';
import { useCreateSpecialMeteringGridAreaMutation } from './api';
import { useSelector } from 'react-redux';

const validationPatterns = {
  so_code: /^SO\d+$/,
  so_type: /^[A-Z]{1,3}$/,
  y_eic: /^[A-Z0-9-]{16}$/,
  short_name: /^[A-Z0-9-]{10}$/,
  full_name: /^.{1,300}$/,
  x_eic: /^[A-Z0-9-]{16}$/,
  usreou: /^\d{8}$/,
  functional_role: /^.*$/
};

const validationMessages = {
  so_code: i18n.t('VERIFY_MSG.CODE'),
  so_type: i18n.t('VERIFY_MSG.TYPE'),
  y_eic: i18n.t('VERIFY_MSG.EIC_CODE_Y'),
  short_name: i18n.t('VERIFY_MSG.SHORT_NAME'),
  full_name: i18n.t('VERIFY_MSG.NAME'),
  x_eic: i18n.t('VERIFY_MSG.BELONGS_TO_EIC_CODE_X'),
  usreou: i18n.t('VERIFY_MSG.EDRPOU_CODE'),
  functional_role: i18n.t('VERIFY_MSG.FUNCTIONAL_ROLE')
};

const defaultValues = {
  so_code: '',
  so_type: '',
  y_eic: '',
  short_name: '',
  full_name: '',
  x_eic: '',
  usreou: '',
  functional_role: ''
}

const AddSpecialMeteringGridAreaModal = ({ onClose, open }) => {
  const { t } = useTranslation();
  const [values, setValues] = useState(defaultValues);
  const [errors, setErrors] = useState({});
  const userUid = useSelector((s) => s.user.userUid);
  const [create, { error }] = useCreateSpecialMeteringGridAreaMutation();
  
  const handleSetValue = (id, value) => {
    setValues((prev) => ({ ...prev, [id]: value }));
    if (value.match(validationPatterns[id])) {
      const updatedErrors = errors;
      delete updatedErrors[id];
      setErrors(updatedErrors);
    } else {
      setErrors((prev) => ({ ...prev, [id]: validationMessages[id] }));
    }
  };

  const handleSubmit = () => {
    create({ ...values, created_by: userUid })
      .unwrap()
      .then(() => {
        onClose();
        setValues(defaultValues);
      })
      .catch(() => {});
  };

  const isDisabled = Object.keys(errors).length > 0 || !Object.values(values).every((v) => Boolean(v));

  return (
    <StyledDialog open={open} onClose={onClose}>
      <DialogTitle>Додати</DialogTitle>
      <IconButton
        onClick={onClose}
        sx={{
          position: 'absolute',
          right: 16,
          top: 16,
          '& svg': {
            fontSize: 19
          }
        }}
        data-marker={'close-dialog'}
      >
        <CloseRounded />
      </IconButton>
      <DialogContent sx={{ display: 'flex', gap: 2, width: 900 }}>
        <Stack spacing={2} sx={{ width: '100%' }}>
          <StyledInput
            id={'on_date'}
            label={t('FIELDS.CODE')}
            value={values.so_code}
            onChange={(e) => handleSetValue('so_code', e.target.value)}
            error={errors.so_code || error?.data?.so_code}
            dataMarker={'code'}
            required
          />
          <StyledInput
            id={'on_date'}
            label={t('FIELDS.TYPE')}
            value={values.so_type}
            onChange={(e) => handleSetValue('so_type', e.target.value)}
            error={errors.so_type || error?.data?.so_type}
            dataMarker={'so_type'}
            required
          />
          <StyledInput
            id={'on_date'}
            label={t('FIELDS.METERING_GRID_AREA_ID')}
            value={values.y_eic}
            onChange={(e) => handleSetValue('y_eic', e.target.value)}
            error={errors.y_eic || error?.data?.y_eic}
            dataMarker={'y_eic'}
            required
          />
          <StyledInput
            id={'on_date'}
            label={t('FIELDS.SHORT_NAME')}
            value={values.short_name}
            onChange={(e) => handleSetValue('short_name', e.target.value)}
            error={errors.short_name || error?.data?.short_name}
            dataMarker={'short_name'}
            required
          />
        </Stack>
        <Stack spacing={2} sx={{ width: '100%' }}>
          <StyledInput
            id={'on_date'}
            label={t('FIELDS.NAME')}
            value={values.full_name}
            onChange={(e) => handleSetValue('full_name', e.target.value)}
            error={errors.full_name || error?.data?.full_name}
            dataMarker={'full_name'}
            required
          />
          <StyledInput
            id={'on_date'}
            label={t('FIELDS.BELONGS_EIC_X')}
            value={values.x_eic}
            onChange={(e) => handleSetValue('x_eic', e.target.value)}
            error={errors.x_eic || error?.data?.x_eic}
            dataMarker={'x_eic'}
            required
          />
          <StyledInput
            id={'on_date'}
            label={t('FIELDS.USREOU')}
            value={values.usreou}
            onChange={(e) => handleSetValue('usreou', e.target.value)}
            error={errors.usreou || error?.data?.usreou}
            dataMarker={'usreou'}
            required
          />
          <StyledInput
            id={'on_date'}
            label={t('FIELDS.FUNCTIONAL_ROLE')}
            value={values.functional_role}
            onChange={(e) => handleSetValue('functional_role', e.target.value)}
            error={errors.functional_role || error?.data?.functional_role}
            dataMarker={'functional_role'}
            required
          />
        </Stack>
      </DialogContent>
      <DialogActions
        sx={{
          paddingTop: '0 !important',
          justifyContent: 'center',
          px: 3,
          '&>button': {
            minWidth: 204,
            textTransform: 'uppercase',
            fontSize: 12
          }
        }}
      >
        <BlueButton onClick={onClose}>{t('CONTROLS.CANCEL')}</BlueButton>
        <GreenButton onClick={handleSubmit} disabled={isDisabled}>
          {t('CONTROLS.FORM')}
        </GreenButton>
      </DialogActions>
    </StyledDialog>
  );
};

export default AddSpecialMeteringGridAreaModal;
