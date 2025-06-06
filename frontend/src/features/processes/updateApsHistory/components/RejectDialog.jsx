import Grid from '@mui/material/Grid';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import CircleButton from '../../../../Components/Theme/Buttons/CircleButton';
import StyledInput from '../../../../Components/Theme/Fields/StyledInput';
import { ModalWrapper } from '../../../../Components/Modal/ModalWrapper';
import { BlueButton } from '../../../../Components/Theme/Buttons/BlueButton';
import { GreenButton } from '../../../../Components/Theme/Buttons/GreenButton';
import { useUpdateUpdateApsHistoryMutation } from '../api';
import { checkPermissions } from '../../../../util/verifyRole';
import { useTranslation } from 'react-i18next';

const RejectDialog = ({ isCancel, isReject }) => {
  const { uid } = useParams();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');
  const [update, { isFetching, error, reset }] = useUpdateUpdateApsHistoryMutation({
    fixedCacheKey: 'updateApsHistory_update'
  });
  const IS_AKO_PROCESSES =
    checkPermissions('PROCESSES.UPDATE_APS_HISTORY.IS_AKO_PROCESSES', ['АКО_Процеси']) && isReject && !isCancel;

  const handleClose = () => {
    setOpen(false);
    setValue('');
    reset();
  };

  const handleCancel = () => {
    update({ uid, type: '/cancel' });
  };

  const handleConfirm = () => {
    update({
      uid,
      type: '/reject',
      body: {
        reason: value
      }
    }).then((res) => {
      if (!res?.error) handleClose();
    });
  };

  return (
    <>
      <CircleButton
        type={'remove'}
        title={t(`CONTROLS.${IS_AKO_PROCESSES ? 'REJECT_REQUEST' : 'CANCEL_REQUEST'}`)}
        dataMarker={IS_AKO_PROCESSES ? 'reject' : 'cancel'}
        onClick={() => (IS_AKO_PROCESSES ? setOpen(true) : handleCancel())}
      />
      <ModalWrapper open={open} onClose={handleClose} header={t('REASON_FOR_REJECTING_APPLICATION')}>
        <Grid container spacing={2} sx={{ pt: 4 }}>
          <StyledInput
            label={t('FIELDS.REQUEST_REJECTED_REASON')}
            value={value || ''}
            error={error?.data?.reason}
            style={{ marginBottom: 16 }}
            onChange={({ target }) => {
              setValue(target.value);
              if (error) reset();
            }}
          />
          <Grid item xs={12} sm={6}>
            <BlueButton style={{ width: '100%' }} onClick={handleClose}>
              {t('CONTROLS.CANCEL')}
            </BlueButton>
          </Grid>
          <Grid item xs={12} sm={6}>
            <GreenButton style={{ width: '100%' }} onClick={handleConfirm} disabled={value?.length < 1 || isFetching}>
              {t('CONTROLS.SEND')}
            </GreenButton>
          </Grid>
        </Grid>
      </ModalWrapper>
    </>
  );
};

export default RejectDialog;
