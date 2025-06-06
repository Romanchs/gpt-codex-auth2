import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import { Box, Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { ModalWrapper } from '../../../../../Components/Modal/ModalWrapper';
import { BlueButton } from '../../../../../Components/Theme/Buttons/BlueButton';
import { GreenButton } from '../../../../../Components/Theme/Buttons/GreenButton';
import { useState } from 'react';
import { useLazySubmateringPointQuery } from '../../../api';
import StyledInput from '../../../../../Components/Theme/Fields/StyledInput';

const AddSpModal = ({ title, open, mpEic, onSubmit, onClose }) => {
  const { t } = useTranslation();
  const [eic, setEic] = useState('');
  const [eicError, setEicError] = useState('');
  const [getSubmateringPoint] = useLazySubmateringPointQuery();

  const isValidEic = (value) => {
    const pattern = /^\d{2}[zZ][0-9a-zA-Z-]{13}$/;
    return pattern.test(value);
  };

  const handleSubmit = () => {
    if (!isValidEic(eic)) {
      setEicError(t('VERIFY_MSG.ENTER_CORRECT_VALUE'));
      return;
    }
    getSubmateringPoint({ mp_eic: mpEic, sp_eic: eic }).then((res) => {
      if(!res.data){
        return handleClose();
      } 
      onSubmit(res.data, eic);
      setEic('');
      setEicError('');
    });
  };

  const handleClose = () => {
    setEic('');
    setEicError('');
    onClose();
  };

  return (
    <ModalWrapper header={title} open={open} onClose={handleClose}>
      <Box sx={{ mt: 3 }}>
        <StyledInput
          label={t('FIELDS.EICZ_CMP')}
          value={eic}
          onChange={({ target }) => setEic(target.value)}
          error={eicError}
        />
      </Box>
      <Stack direction={'row'} sx={{ pt: 3 }} justifyContent={'space-between'} spacing={1}>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <BlueButton onClick={handleClose} style={{ width: '100%' }}>
              {t('CONTROLS.CANCEL')}
            </BlueButton>
          </Grid>
          <Grid item xs={6}>
            <GreenButton onClick={handleSubmit} style={{ width: '100%' }}>
              {t('CONTROLS.ADD')}
            </GreenButton>
          </Grid>
        </Grid>
      </Stack>
    </ModalWrapper>
  );
};

AddSpModal.propTypes = {
  title: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  mpEic: PropTypes.string,
  onSubmit: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired
};

export default AddSpModal;
