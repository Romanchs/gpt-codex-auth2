import Grid from '@mui/material/Grid';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import CircleButton from '../../../Components/Theme/Buttons/CircleButton';
import { ModalWrapper } from '../../../Components/Modal/ModalWrapper';
import { BlueButton } from '../../../Components/Theme/Buttons/BlueButton';
import { DangerButton } from '../../../Components/Theme/Buttons/DangerButton';
import { useUpdateUpdateSubApMeterMutation } from './api';
import { useTranslation } from 'react-i18next';

const RejectDialog = ({ setLoading }) => {
  const { uid } = useParams();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const [update, { isLoading }] = useUpdateUpdateSubApMeterMutation();

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading]);

  const handleConfirm = () => {
    update({ uid, body: {}, type: 'cancel' }).finally(() => setOpen(false));
  };

  return (
    <>
      <CircleButton type={'remove'} title={t('CONTROLS.CANCEL_REQUEST')} onClick={() => setOpen(true)} />
      <ModalWrapper
        open={open}
        onClose={() => setOpen(false)}
        header={t('PERMISSIONS.PROCESSES.UPDATE_SUB_AP_METER.CANCEL_CONFIRMATION')}
      >
        <Grid container spacing={2} sx={{ pt: 4 }}>
          <Grid item xs={12} sm={6}>
            <DangerButton style={{ width: '100%' }} onClick={() => setOpen(false)}>
              {t('CONTROLS.NO')}
            </DangerButton>
          </Grid>
          <Grid item xs={12} sm={6}>
            <BlueButton style={{ width: '100%' }} onClick={handleConfirm}>
              {t('CONTROLS.YES')}
            </BlueButton>
          </Grid>
        </Grid>
      </ModalWrapper>
    </>
  );
};

export default RejectDialog;
