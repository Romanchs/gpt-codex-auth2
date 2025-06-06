import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import { Box, Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { ModalWrapper } from '../../../../../Components/Modal/ModalWrapper';
import { BlueButton } from '../../../../../Components/Theme/Buttons/BlueButton';
import { GreenButton } from '../../../../../Components/Theme/Buttons/GreenButton';
import { useState } from 'react';
import AsyncAutocomplete from '../../../../../Components/Theme/Fields/AsyncAutocomplete';
import { useLazyMateringPointQuery } from '../../../api';

const AddMpModal = ({ title, open, onSubmit, onClose }) => {
  const { t } = useTranslation();
  const [eic, setEic] = useState('');
  const [eicError, setEicError] = useState('');
  const [getMateringPoint] = useLazyMateringPointQuery();

  const isValidEic = (value) => {
    const pattern = /^\d{2}[zZ][0-9a-zA-Z-]{13}$/;
    return pattern.test(value);
  };

  const handleSubmit = () => {
    if (!isValidEic(eic)) {
      setEicError(t('VERIFY_MSG.ENTER_CORRECT_VALUE'));
      return;
    }
    getMateringPoint({ mp_eic: eic }).then((res) => {
      const data = {
        [eic]: res.data
      };
      onSubmit(data);
      setEic('');
      setEicError('');
    });
  };

  const handleClose = () => {
    setEic('');
    setEicError('');
    onClose();
  }

  return (
    <ModalWrapper header={title} open={open} onClose={handleClose}>
      <Box sx={{ mt: 3 }}>
          <AsyncAutocomplete
            label={t('FIELDS.EICZ_CMP')}
            defaultValue={eic}
            onSelect={(v) => setEic(v.value)}
            apiPath={'auditMeteringPoints'}
            searchBy={'mp_eic'}
            mapOptions={(data) => data.map((i) => ({ label: i, value: i }))}
            searchStart={3}
            disablePortal={false}
            error={eicError}
            selectInputValue
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

AddMpModal.propTypes = {
  title: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired
};

export default AddMpModal;
