import Grid from '@material-ui/core/Grid';
import { useEffect, useState } from 'react';

import { ModalWrapper } from '../../../../Components/Modal/ModalWrapper';
import { BlueButton } from '../../../../Components/Theme/Buttons/BlueButton';
import { GreenButton } from '../../../../Components/Theme/Buttons/GreenButton';
import StyledInput from '../../../../Components/Theme/Fields/StyledInput';
import { DATA_TYPES } from '../../constants';
import { Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';

export const ProcessedModal = ({ disputeEntity: { data_type }, open, onSubmit, onClose }) => {
  const { t } = useTranslation();
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = () => {
    if (!message) {
      return setError(t('VERIFY_MSG.ENTER_CORRECT_VALUE'));
    }
    onSubmit({ message });
    setMessage(null);
    onClose();
  };

  useEffect(() => {
    return () => {
      setMessage(null);
      setError(null);
    };
  }, [open]);

  return (
    <ModalWrapper
      maxWidth={'lg'}
      header={
        <p>
          {data_type === DATA_TYPES.FORMED_EXECUTOR
            ? t('DISPUTE_PROCESSED_MODAL_TITLE_INITIATOR')
            : t('DISPUTE_PROCESSED_MODAL_TITLE_EXECUTOR')}
          <br />
          {t('DISPUTE_PROCESSED_MODAL_ADD_DESCRIPTION')}
        </p>
      }
      open={open}
      onClose={onClose}
    >
      <Grid item style={{ width: 560, paddingTop: 40, paddingBottom: 30 }}>
        <StyledInput
          error={error}
          required
          label={t('FIELDS.INPUT_DESCRIPTION')}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          dataMarker={'input_description'}
        />
      </Grid>
      <Stack direction={'row'} sx={{ pt: 3 }} justifyContent={'space-between'} spacing={1}>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <BlueButton onClick={onClose} style={{ width: '100%' }}>
              {t('CONTROLS.CANCEL')}
            </BlueButton>
          </Grid>
          <Grid item xs={6}>
            <GreenButton onClick={handleSubmit} style={{ width: '100%' }}>
              {t('CONTROLS.SEND')}
            </GreenButton>
          </Grid>
        </Grid>
      </Stack>
    </ModalWrapper>
  );
};
