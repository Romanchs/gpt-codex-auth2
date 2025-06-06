import Grid from '@mui/material/Grid';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ModalWrapper } from '../../../../Components/Modal/ModalWrapper';
import { BlueButton } from '../../../../Components/Theme/Buttons/BlueButton';
import { GreenButton } from '../../../../Components/Theme/Buttons/GreenButton';
import StyledInput from '../../../../Components/Theme/Fields/StyledInput';
import { useUpdateRequestCancelPPKORegistrationMutation } from '../api';
import { toggleModal } from '../slice';
import { useTranslation } from 'react-i18next';

const ReasonModal = () => {
  const { uid } = useParams();
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const { openRejectModal } = useSelector(({ cancelPPKO }) => cancelPPKO);
  const [reason, setReason] = useState('');
  const [update, { error, reset }] = useUpdateRequestCancelPPKORegistrationMutation({
    fixedCacheKey: 'cancelPPKORegistration_finish'
  });

  const handleClose = () => dispatch(toggleModal(false));

  const handleInput = (e) => {
    setReason(e.target.value);
    if (e.target.value.length <= 250) {
      reset();
    }
  };

  const handleSubmit = () => {
    update({ uid, type: '/reject', body: { reject_reason: reason } }).then((res) => {
      if (res?.data?.status === 'REJECTED') {
        handleClose();
      }
    });
  };

  return (
    <ModalWrapper
      open={openRejectModal}
      header={t('REMOVE_PROCESS_REASON')}
      onClose={handleClose}
      maxWidth={'lg'}
    >
      <Grid container style={{ paddingTop: 30 }}>
        <Grid item xs={12}>
          <StyledInput
            label={t('FIELDS.REQUEST_REJECTED_REASON')}
            value={reason}
            onChange={handleInput}
            error={error?.data?.reject_reason}
          />
        </Grid>
      </Grid>
      <Grid container spacing={2} style={{ paddingTop: 40 }}>
        <Grid item xs={12} sm={6}>
          <BlueButton data-marker={'buttonModalClose'} style={{ width: '100%' }} onClick={handleClose}>
            {t('CONTROLS.CANCEL')}
          </BlueButton>
        </Grid>
        <Grid item xs={12} sm={6}>
          <GreenButton
            data-marker={'buttonModalSave'}
            style={{ width: '100%' }}
            onClick={handleSubmit}
            disabled={!reason}
          >
            {t('CONTROLS.SAVE')}
          </GreenButton>
        </Grid>
      </Grid>
    </ModalWrapper>
  );
};

export default ReasonModal;
