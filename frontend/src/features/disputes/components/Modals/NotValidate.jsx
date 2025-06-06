import Grid from '@material-ui/core/Grid';
import { useEffect, useState } from 'react';

import { ModalWrapper } from '../../../../Components/Modal/ModalWrapper';
import { BlueButton } from '../../../../Components/Theme/Buttons/BlueButton';
import { GreenButton } from '../../../../Components/Theme/Buttons/GreenButton';
import { Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';

export const NotValidate = ({ open, onSubmit, onClose }) => {
  const {t} = useTranslation();
  const title = t('DISPUTE_NOT_VALIDATE_MODAL_TITLE');

  const [message, setMessage] = useState(null);

  const handleSubmit = () => onSubmit(message);

  useEffect(() => {
    return () => {
      setMessage(null);
    };
  }, [open]);

  return (
    <ModalWrapper header={title} open={open} onClose={onClose}>
      <Stack direction={'row'} sx={{ pt: 3 }} justifyContent={'space-between'} spacing={1}>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <BlueButton onClick={onClose} style={{ width: '100%' }}>
              {t('CONTROLS.CANCEL')}
            </BlueButton>
          </Grid>
          <Grid item xs={6}>
            <GreenButton onClick={handleSubmit} style={{ width: '100%' }}>
            {t('CONTROLS.DOWNLOAD')}
            </GreenButton>
          </Grid>
        </Grid>
      </Stack>
    </ModalWrapper>
  );
};
