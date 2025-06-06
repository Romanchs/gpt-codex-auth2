import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { ModalWrapper } from '../../../Components/Modal/ModalWrapper';
import { Grid } from '@material-ui/core';
import { BlueButton } from '../../../Components/Theme/Buttons/BlueButton';
import { GreenButton } from '../../../Components/Theme/Buttons/GreenButton';
import StyledInput from '../../../Components/Theme/Fields/StyledInput';
import { useUpdateRequestUpdateBasicApMutation } from './api';
import { useParams } from 'react-router-dom';
import { Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';

const DoneProcessModal = ({ open, onClose }) => {
  const { t } = useTranslation();
  const { uid } = useParams();
  const [comment, setComment] = useState('');
  const [update, { error, reset }] = useUpdateRequestUpdateBasicApMutation();

  const handleClose = () => {
    setComment('');
    reset();
    onClose();
  };

  const handleSubmit = () => {
    update({ uid, type: '/done', body: { comment } }).then((res) => {
      if (!res.error) handleClose();
    });
  };

  return (
    <ModalWrapper header={t('REQUEST_UPDATE_BASIC_AP_MODAL_TEXT')} open={open} onClose={handleClose}>
      <StyledInput
        style={{ marginTop: 25 }}
        label={`${t('FIELDS.COMMENT')}:`}
        value={comment}
        onChange={(event) => setComment(event.target.value)}
        error={error?.data?.comment}
        required
        data-marker={'modal-input'}
      />
      <Stack direction={'row'} sx={{ pt: 3 }} justifyContent={'space-between'} spacing={1}>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <BlueButton onClick={handleClose} style={{ width: '100%' }} data-marker={'button-modal-no'}>
              {t('CONTROLS.NO')}
            </BlueButton>
          </Grid>
          <Grid item xs={6}>
            <GreenButton onClick={handleSubmit} style={{ width: '100%' }} data-marker={'button-modal-yes'}>
              {t('CONTROLS.YES')}
            </GreenButton>
          </Grid>
        </Grid>
      </Stack>
    </ModalWrapper>
  );
};

DoneProcessModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired
};

export default DoneProcessModal;
