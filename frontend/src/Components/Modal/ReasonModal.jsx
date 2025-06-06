import Grid from '@material-ui/core/Grid';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { ModalWrapper } from './ModalWrapper';
import { BlueButton } from '../Theme/Buttons/BlueButton';
import { GreenButton } from '../Theme/Buttons/GreenButton';
import StyledInput from '../Theme/Fields/StyledInput';

const ReasonModal = ({
  text,
  open,
  onClose,
  onSubmit,
  errorMessage = 'VERIFY_MSG.CYRILLIC_TEXT_MAX_MIN_SIZE',
  cancelText = 'CONTROLS.CANCEL',
  applyText = 'CONTROLS.PERFORM',
  minLength = 10,
  maxLength = 100
}) => {
  const { t } = useTranslation();
  const [reason, setReason] = useState('');
  const [isValidReason, setIsValidReason] = useState(false);
  const { error } = useSelector(({ processes }) => processes);
  const [innerError, setInnerError] = useState('');

  useEffect(() => setInnerError(error?.reason), [error]);

  const handleChangeReason = (e) => {
    const { value } = e.target;
    setReason(value);
    handleValidateReason(value);
  };

  const resetFormState = () => {
    setInnerError('');
    setReason('');
    setIsValidReason(false);
  };

  const handleValidateReason = (value) => {
    if (value.length < minLength || value.length > maxLength) {
      setIsValidReason(false);
      setInnerError(`${t(errorMessage)}`);
      return;
    }
    setIsValidReason(true);
    setInnerError('');
  };

  return (
    <ModalWrapper
      open={open}
      header={text}
      onClose={() => {
        resetFormState();
        onClose();
      }}
    >
      <Grid container style={{ paddingTop: 30 }}>
        <Grid item xs={12}>
          <StyledInput
            label={t('FIELDS.COMMENT')}
            value={reason}
            onChange={handleChangeReason}
            error={innerError}
            multiline={true}
            rows={2}
            required
          />
        </Grid>
      </Grid>
      <Grid container spacing={2} style={{ paddingTop: 40, paddingLeft: 40, paddingRight: 40 }}>
        <Grid item xs={12} sm={6}>
          <BlueButton
            data-marker={'buttonModalClose'}
            style={{ width: '100%', textTransform: 'uppercase' }}
            onClick={() => {
              onClose();
              resetFormState();
            }}
          >
            {t(cancelText)}
          </BlueButton>
        </Grid>
        <Grid item xs={12} sm={6}>
          <GreenButton
            data-marker={'buttonModalSave'}
            style={{ width: '100%', textTransform: 'uppercase' }}
            onClick={() => {
              onSubmit(reason);
              resetFormState();
            }}
            disabled={!isValidReason}
          >
            {t(applyText)}
          </GreenButton>
        </Grid>
      </Grid>
    </ModalWrapper>
  );
};

export default ReasonModal;
