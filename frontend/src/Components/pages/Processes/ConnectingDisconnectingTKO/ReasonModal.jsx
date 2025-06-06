import Grid from '@material-ui/core/Grid';
import {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';

import {ModalWrapper} from '../../../Modal/ModalWrapper';
import {BlueButton} from '../../../Theme/Buttons/BlueButton';
import {GreenButton} from '../../../Theme/Buttons/GreenButton';
import StyledInput from '../../../Theme/Fields/StyledInput';
import { useTranslation } from 'react-i18next';

const ReasonModal = ({text, open, onClose, onSubmit}) => {
  const {t} = useTranslation();
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

  const handleValidateReason = (value) => {
    if (value.length < 10 || value.length > 200 || /[a-z]/i.test(value)) {
      setIsValidReason(false);
      setInnerError(`*${t('VERIFY_MSG.CYRILLIC_TEXT_MAX_MIN_SIZE')}`);
      return;
    }
    setIsValidReason(true);
    setInnerError('');
  };

  return (
    <ModalWrapper 
      open={open}
      header={text}
      onClose={onClose}
      >
      <Grid container style={{paddingTop: 30}}>
        <Grid item xs={12}>
          <StyledInput
            label={t('FIELDS.COMMENT')}
            value={reason}
            onChange={handleChangeReason}
            error={innerError}
            multiline={true}
            rows={2}
            helperText={`*${t('VERIFY_MSG.CYRILLIC_TEXT_MAX_MIN_SIZE')}`}
          />
        </Grid>
      </Grid>
      <Grid container spacing={2} style={{paddingTop: 40}}>
        <Grid item xs={12} sm={6}>
          <BlueButton
            data-marker={'buttonModalClose'}
            style={{width: '100%', textTransform: 'uppercase'}}
            onClick={() => {
              onClose();
              setTimeout(() => setReason(''), 100);
            }}
          >
            {t('CONTROLS.CANCEL')}
          </BlueButton>
        </Grid>
        <Grid item xs={12} sm={6}>
          <GreenButton
            data-marker={'buttonModalSave'}
            style={{width: '100%', textTransform: 'uppercase'}}
            onClick={() => onSubmit(reason)}
            disabled={!isValidReason}
          >
            {t('CONTROLS.PERFORM')}
          </GreenButton>
        </Grid>
      </Grid>
    </ModalWrapper>
  );
};

export default ReasonModal;
