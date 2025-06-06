import CircleButton from '../../../Components/Theme/Buttons/CircleButton';
import { useState } from 'react';
import { ModalWrapper } from '../../../Components/Modal/ModalWrapper';
import Grid from '@material-ui/core/Grid';
import { BlueButton } from '../../../Components/Theme/Buttons/BlueButton';
import { GreenButton } from '../../../Components/Theme/Buttons/GreenButton';
import StyledInput from '../../../Components/Theme/Fields/StyledInput';
import { useParams } from 'react-router-dom';
import { useUpdateDeletingTkoMutation } from './deleting/api';
import { useTranslation } from 'react-i18next';

const RejectDialog = ({disabled = false}) => {
  const {t} = useTranslation();
  const { uid } = useParams();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');
  const [update, { isFetching, error, reset }] = useUpdateDeletingTkoMutation();

  const handleClose = () => {
    setOpen(false);
    setValue('');
    reset();
  };

  const handleConfirm = () => {
    update({
      uid,
      type: 'reject',
      body: {
        reason: value
      }
    }).then((res) => {
      if (res?.error) return;
      handleClose();
    });
  };

  return (
    <>
      <CircleButton
        type={'remove'}
        title={t('CONTROLS.REJECT_REQUEST')}
        dataMarker={'deleting-tko-reject'}
        onClick={() => setOpen(true)}
        disabled={disabled}
      />
      <ModalWrapper open={open} onClose={handleClose} header={t('REASON_FOR_REJECTING_APPLICATION')}>
        <Grid container spacing={2} style={{ paddingTop: 32 }}>
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
