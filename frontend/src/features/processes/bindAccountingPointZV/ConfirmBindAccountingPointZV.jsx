import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import { Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { ModalWrapper } from '../../../Components/Modal/ModalWrapper';
import { BlueButton } from '../../../Components/Theme/Buttons/BlueButton';
import { DangerButton } from '../../../Components/Theme/Buttons/DangerButton';

const ConfirmBindAccountingPointZV = ({ open, setOpen, onSubmit, onCancel }) => {
  const {t} = useTranslation();

  return (
    <ModalWrapper header={t('CONFIRM_BIND_ACCOUNTING_POINT_ZV')} open={open} onClose={() => setOpen(false)}>
      <Stack direction={'row'} sx={{ pt: 3 }} justifyContent={'space-between'} spacing={1}>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <BlueButton onClick={onCancel} style={{ width: '100%' }} data-marker={'cancel-bind-point'}>
              {t('CONTROLS.NO')}
            </BlueButton>
          </Grid>
          <Grid item xs={6}>
            <DangerButton onClick={onSubmit} style={{ width: '100%' }} data-marker={'confirm-bind-point'}>
              {t('CONTROLS.YES')}
            </DangerButton>
          </Grid>
        </Grid>
      </Stack>
    </ModalWrapper>
  );
};

ConfirmBindAccountingPointZV.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};


export default ConfirmBindAccountingPointZV;
