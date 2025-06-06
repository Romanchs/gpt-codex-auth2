import Grid from '@mui/material/Grid';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ModalWrapper } from '../../../../Components/Modal/ModalWrapper';
import { BlueButton } from '../../../../Components/Theme/Buttons/BlueButton';
import { GreenButton } from '../../../../Components/Theme/Buttons/GreenButton';
import StyledInput from '../../../../Components/Theme/Fields/StyledInput';
import { useUpdateRequestArchivingTSMutation, useRequestArchivingTSReasonsQuery } from '../api';
import propTypes from 'prop-types';
import Autocomplete from '../../correctionArchivingTS/components/Autocomplete';

const defaultData = {
  reject_reason: '',
  reject_comment: ''
};

const RejectModal = ({ text = '', open = false, onClose, onSubmit }) => {
  const { t } = useTranslation();
  const [data, setData] = useState(defaultData);
  const REASON_ERROR = data.reject_reason?.trim().length > 500;
  const COMMENT_ERROR = data.reject_comment?.trim().length > 500;

  const [, { error }] = useUpdateRequestArchivingTSMutation({
    fixedCacheKey: 'requestArchivingTS_update'
  });
  const { currentData: reasons = [] } = useRequestArchivingTSReasonsQuery();
  const [isFocus, setIsFocus] = useState(false);

  const list = useMemo(() => {
    const inputValue = data.reject_reason?.trim().toLocaleLowerCase();
    return !inputValue ? reasons : reasons.filter((i) => i.label.toLocaleLowerCase().includes(inputValue));
  }, [data.reject_reason, reasons]);

  const handleClose = () => onClose();

  const handleSubmit = () => onSubmit(data);

  const handleChange = (key) => (value) => {
    if (key === 'reject_comment') {
      return setData({ ...data, [key]: value.target.value });
    }
    setData({ ...data, [key]: value });
  };

  return (
    <ModalWrapper open={open} header={text} onClose={handleClose}>
      <Grid container sx={{ pt: 4 }} spacing={2}>
        <Grid item xs={12}>
          <Autocomplete
            label={t('FIELDS.REJECTED_REASON')}
            value={data.reject_reason}
            onChange={handleChange('reject_reason')}
            error={REASON_ERROR ? t('VERIFY_MSG.MAX_500_SYMBOLS') : error?.data?.reject_reason}
            list={list}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            open={Boolean(isFocus && list.length)}
          />
        </Grid>
        <Grid item xs={12}>
          <StyledInput
            label={t('FIELDS.COMMENT')}
            value={data.reject_comment}
            onChange={handleChange('reject_comment')}
            error={COMMENT_ERROR ? t('VERIFY_MSG.MAX_500_SYMBOLS') : error?.data?.reject_comment}
            rows={3}
            multiline
          />
        </Grid>
      </Grid>
      <Grid container spacing={2} sx={{ pt: 5 }}>
        <Grid item xs={12} sm={6}>
          <BlueButton
            style={{ width: '100%', textTransform: 'uppercase' }}
            onClick={handleClose}
            data-marker={'cancel'}
          >
            {t('CONTROLS.CANCEL')}
          </BlueButton>
        </Grid>
        <Grid item xs={12} sm={6}>
          <GreenButton
            style={{ width: '100%', textTransform: 'uppercase' }}
            onClick={handleSubmit}
            data-marker={'approve'}
            disabled={!data.reject_reason || !data.reject_comment || REASON_ERROR || COMMENT_ERROR}
          >
            {t('CONTROLS.APPROVE')}
          </GreenButton>
        </Grid>
      </Grid>
    </ModalWrapper>
  );
};

RejectModal.propTypes = {
  text: propTypes.string,
  open: propTypes.bool,
  onClose: propTypes.func.isRequired,
  onSubmit: propTypes.func.isRequired
};

export default RejectModal;
