import Grid from '@material-ui/core/Grid';
import { useEffect, useState } from 'react';

import { ModalWrapper } from '../../../../Components/Modal/ModalWrapper';
import { BlueButton } from '../../../../Components/Theme/Buttons/BlueButton';
import { DangerButton } from '../../../../Components/Theme/Buttons/DangerButton';
import StyledInput from '../../../../Components/Theme/Fields/StyledInput';
import { Box, Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';

export const TransferToAko = ({ open, onSubmit, onClose }) => {
  const {t} = useTranslation();
  const title = t('DISPUTE_TRANSFER_TO_AKO_MODAL_TITLE');
  const warning = t('DISPUTE_TRANSFER_TO_AKO_MODAL_WARNING');
  const [message, setMessage] = useState(null);

  const handleChange = (e) => setMessage(e.target.value);

  const handleSubmit = () => onSubmit({ message });

  useEffect(() => {
    return () => {
      setMessage(null);
    };
  }, [open]);

  return (
    <ModalWrapper header={title} open={open} onClose={onClose}>
      <Box sx={{ pt: 3 }}>
        <Grid container style={{ fontSize: 12, lineHeight: '20px', marginBottom: 32, color: '#ff1c1c' }}>
          {warning.toUpperCase()}
        </Grid>
        <Grid container>
          <StyledInput
            name={'message'}
            label={t('FIELDS.COMMENT')}
            value={message}
            multiline
            minRows={5}
            onChange={handleChange}
            dataMarker={'input_message'}
          />
        </Grid>
      </Box>
      <Stack direction={'row'} sx={{ pt: 3 }} justifyContent={'space-between'} spacing={1}>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <DangerButton onClick={onClose} style={{ width: '100%' }}>
              {t('CONTROLS.CANCEL')}
            </DangerButton>
          </Grid>
          <Grid item xs={6}>
            <BlueButton onClick={handleSubmit} style={{ width: '100%' }}>
              {t('CONTROLS.SEND')}
            </BlueButton>
          </Grid>
        </Grid>
      </Stack>
    </ModalWrapper>
  );
};
