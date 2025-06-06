import { ModalWrapper } from '../../../../../../Components/Modal/ModalWrapper';
import { modalTypes } from '../../constants';
import { useTranslation } from 'react-i18next';
import { Stack } from '@mui/material';
import { BlueButton } from '../../../../../../Components/Theme/Buttons/BlueButton';
import { DangerButton } from '../../../../../../Components/Theme/Buttons/DangerButton';
import { useTechWorkProcessUpdateMutation } from '../../../../../techWork/api';

const DeleteTkoModal = ({ data, handleClose }) => {
  const { t } = useTranslation();
  const isOpen = data.modalType === modalTypes.restart && !!data.processData;
  const [restartProcess, { isLoading: isRestartLoading }] = useTechWorkProcessUpdateMutation({
    fixedCacheKey: 'processes-quality-monitoring'
  });

  const handleModalClose = () => {
    handleClose();
  };

  const onSubmit = () => {
    restartProcess({ uid: data.processData.uid, actionType: 'restart' })
      .unwrap()
      .then(() => handleModalClose())
      .catch(() => {});
  };

  return (
    <ModalWrapper
      open={isOpen}
      header={t('TECH_WORKS.MODALS.CONFIRM_PROCESS_RESTART', {
        processName: t(`GROUPS.${data.processData?.group}`),
        processId: data.processData?.id
      })}
      transitionDuration={{ enter: 225, exit: 0 }}
    >
      <Stack direction={'row'} sx={{ pt: 5 }} justifyContent={'space-between'} spacing={3}>
        <BlueButton onClick={handleModalClose} fullWidth>
          {t('CONTROLS.NO')}
        </BlueButton>
        <DangerButton onClick={onSubmit} disabled={isRestartLoading} fullWidth>
          {t('CONTROLS.YES')}
        </DangerButton>
      </Stack>
    </ModalWrapper>
  );
};

export default DeleteTkoModal;
