import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import { Box, Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { ModalWrapper } from '../../../../../Components/Modal/ModalWrapper';
import { BlueButton } from '../../../../../Components/Theme/Buttons/BlueButton';
import StyledInput from '../../../../../Components/Theme/Fields/StyledInput';
import { DangerButton } from '../../../../../Components/Theme/Buttons/DangerButton';

const RemoveApModal = ({ title, eic, open, onSubmit, onClose }) => {
  const { t } = useTranslation();

  return (
    <ModalWrapper header={title} open={open} onClose={onClose}>
      <Box sx={{ mt: 3 }}>
        <StyledInput
          label={t('FIELDS.EICZ_CMP')}
          value={eic}
          readOnly
        />
      </Box>
      <Stack direction={'row'} sx={{ pt: 3 }} justifyContent={'space-between'} spacing={1}>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <BlueButton onClick={onClose} style={{ width: '100%' }}>
              {t('CONTROLS.CANCEL')}
            </BlueButton>
          </Grid>
          <Grid item xs={6}>
            <DangerButton onClick={onSubmit} style={{ width: '100%' }}>
              {t('CONTROLS.DELETE')}
            </DangerButton>
          </Grid>
        </Grid>
      </Stack>
    </ModalWrapper>
  );
};

RemoveApModal.propTypes = {
  title: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default RemoveApModal;
