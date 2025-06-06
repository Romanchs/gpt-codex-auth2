import React from 'react';
import PropTypes from 'prop-types';
import { ModalWrapper } from '../../../Components/Modal/ModalWrapper';
import { Grid } from '@material-ui/core';
import { BlueButton } from '../../../Components/Theme/Buttons/BlueButton';
import { GreenButton } from '../../../Components/Theme/Buttons/GreenButton';
import StyledInput from '../../../Components/Theme/Fields/StyledInput';
import { useParams } from 'react-router-dom';
import { Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useUpdateRequestToUpdateCustomersMutation } from './api';

const DoneProcessModal = ({ open, onClose, comment, setComment }) => {
  const { t } = useTranslation();
  const { uid } = useParams();
  const [update, { reset }] = useUpdateRequestToUpdateCustomersMutation();
  const isValidComment = comment && comment.length >= 10 && comment.length <= 200;

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = () => {
    update({ uid, type: '/done', body: { comment } }).then((res) => {
      if (!res.error) handleClose();
    });
  };

  return (
    <ModalWrapper header={t('REQUEST_TO_UPDATE_CUSTOMERS_MODAL_TEXT')} open={open} onClose={handleClose}>
      <StyledInput
        style={{ marginTop: 25 }}
        label={`${t('FIELDS.COMMENT')}:`}
        value={comment}
        onChange={({ target }) => setComment(target.value)}
        helperText={t('VERIFY_MSG.TEXT_MAX_MIN_SIZE')}
        required
        data-marker={'modal-input'}
      />
      <Stack direction={'row'} sx={{ pt: 3 }} justifyContent={'space-between'} spacing={1}>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <BlueButton onClick={handleClose} style={{ width: '100%' }} data-marker={'button-modal-no'}>
              {t('CONTROLS.CANCEL')}
            </BlueButton>
          </Grid>
          <Grid item xs={6}>
            <GreenButton
              onClick={handleSubmit}
              style={{ width: '100%' }}
              data-marker={'button-modal-yes'}
              disabled={!isValidComment}
            >
              {t('CONTROLS.DONE')}
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
