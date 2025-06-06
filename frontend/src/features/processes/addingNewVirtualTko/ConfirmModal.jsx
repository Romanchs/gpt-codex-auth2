import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import CancelModal from '../../../Components/Modal/CancelModal';
import StyledInput from '../../../Components/Theme/Fields/StyledInput';
import { useState } from 'react';

const ConfirmModal = ({ text, fieldLabel, open, onSubmit, onClose}) => {
  const { t } = useTranslation();
  const [comment, setComment] = useState('');

  const handleClose = () => {
    setComment('');
    onClose();
  }

  const handleSubmit = () => {
    onSubmit(comment);
  }

  return (
    <CancelModal
        text={text}
        open={open}
        onClose={handleClose}
        onSubmit={handleSubmit}
        disabledSubmit={!comment || comment.length < 3}
        submitType={"green"}
        submitText={t('CONTROLS.SEND')}
      >
        <StyledInput
          label={fieldLabel}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          helperText={t('VERIFY_MSG.MIN_MAX_SYMBOLS', { min: 3, max: 200 })}
          max={200}
        />
      </CancelModal>
  );
};

ConfirmModal.propTypes = {
  text: PropTypes.string.isRequired,
  fieldLabel: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};


export default ConfirmModal;
