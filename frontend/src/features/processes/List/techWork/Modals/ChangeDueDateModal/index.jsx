import { ModalWrapper } from '../../../../../../Components/Modal/ModalWrapper';
import { modalTypes } from '../../constants';
import { useTranslation } from 'react-i18next';
import { Box, Stack } from '@mui/material';

import { useState } from 'react';
import DatePicker from '../../../../../../Components/Theme/Fields/DatePicker';
import { BlueButton } from '../../../../../../Components/Theme/Buttons/BlueButton';
import { GreenButton } from '../../../../../../Components/Theme/Buttons/GreenButton';
import { useTechWorkProcessUpdateMutation } from '../../../../../techWork/api';
import moment from 'moment';

const innitialValues = {
  must_be_finished_at: null
};

const ChangeDueDateModal = ({ data, handleClose }) => {
  const { t } = useTranslation();
  const isOpen = data.modalType === modalTypes.changeDueDate && !!data.processData;
  const [values, setValues] = useState(innitialValues);
  const [changeExecutionDate, { isLoading: isChangeExecutionDateLoading }] = useTechWorkProcessUpdateMutation({
    fixedCacheKey: 'processes-quality-monitoring'
  });

  const handleOnChange = (field, value) => {
    setValues({ ...values, [field]: value });
  };

  const handleModalClose = () => {
    handleClose();
    setValues(innitialValues);
  };

  const onSubmit = () => {
    changeExecutionDate({
      uid: data.processData.uid,
      data: values,
      actionType: 'change-must-be-finished-at'
    })
      .unwrap()
      .then(() => handleModalClose())
      .catch(() => {});
  };

  const isSubmitAllowed = Object.values(values).every((value) => !!value) && !isChangeExecutionDateLoading;

  return (
    <ModalWrapper
      open={isOpen}
      onClose={handleModalClose}
      header={t('TECH_WORKS.MODALS.SELECT_DESIRED_PROCESS_DURATION', {
        processName: t(`GROUPS.${data.processData?.group}`),
        processId: data.processData?.id
      })}
      transitionDuration={{ enter: 225, exit: 0 }}
    >
      <Box sx={{ pt: 5 }}>
        <DatePicker
          label={t('EXECUTION_DATE_PROCESS')}
          value={values.must_be_finished_at || ''}
          onChange={(value) => handleOnChange('must_be_finished_at', value)}
          outFormat={'yyyy-MM-DD'}
          minDate={moment().add(1, 'day')}
        />
      </Box>

      <Stack direction={'row'} sx={{ pt: 5 }} justifyContent={'space-between'} spacing={3}>
        <BlueButton onClick={handleModalClose} fullWidth>
          {t('CONTROLS.CANCEL')}
        </BlueButton>
        <GreenButton onClick={onSubmit} disabled={!isSubmitAllowed} fullWidth>
          {t('CONTROLS.SAVE')}
        </GreenButton>
      </Stack>
    </ModalWrapper>
  );
};

export default ChangeDueDateModal;
