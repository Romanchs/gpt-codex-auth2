import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';

import { BlueButton } from '../Theme/Buttons/BlueButton';
import { DangerButton } from '../Theme/Buttons/DangerButton';
import { GreenButton } from '../Theme/Buttons/GreenButton';
import { ModalWrapper } from './ModalWrapper';
import { Box, Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';

const CancelModal = ({
  text,
  open,
  onSubmit,
  onClose,
  submitType,
  minWidth,
  children,
  disabledSubmit = false,
  submitText,
  dataMarker
}) => {
  const { t } = useTranslation();
  const Button = submitType === 'danger' ? DangerButton : GreenButton;

  return (
    <ModalWrapper header={text} open={open} onClose={onClose} dataMarker={dataMarker}>
      {children && <Box sx={{ mt: text ? 3 : 0 }}>{children}</Box>}
      <Stack direction={'row'} sx={{ pt: 3, minWidth }} justifyContent={'space-between'} spacing={1}>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <BlueButton data-marker={'control-no'} onClick={onClose} style={{ width: '100%' }}>
              {t('CONTROLS.NO')}
            </BlueButton>
          </Grid>
          <Grid item xs={6}>
            <Button data-marker={'control-yes'} onClick={onSubmit} style={{ width: '100%' }} disabled={disabledSubmit}>
              {submitText || t('CONTROLS.YES')}
            </Button>
          </Grid>
        </Grid>
      </Stack>
    </ModalWrapper>
  );
};

CancelModal.propTypes = {
  text: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  submitType: PropTypes.oneOf(['danger', 'green']),
  submitText: PropTypes.string,
  dataMarker: PropTypes.string
};

CancelModal.defaultProps = {
  submitType: 'danger'
};

export default CancelModal;
