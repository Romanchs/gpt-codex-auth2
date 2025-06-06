import Grid from '@material-ui/core/Grid';
import propTypes from 'prop-types';
import {useEffect, useState} from 'react';

import {BlueButton} from '../Theme/Buttons/BlueButton';
import {GreenButton} from '../Theme/Buttons/GreenButton';
import SelectField from "../Theme/Fields/SelectField";
import {ModalWrapper} from './ModalWrapper';
import { useTranslation } from 'react-i18next';

const SelectModal = ({text, label, open, list, resetAfterClose, onSubmit, onClose, closeText, submitText}) => {
  const {t} = useTranslation();
  const [item, setItem] = useState('');

  useEffect(() => {
    if(!open && resetAfterClose) {
      setItem('');
    }
  }, [open, resetAfterClose]);

  return (
    <ModalWrapper
      open={open}
      header={text}
      onClose={onClose}
      maxWidth={'lg'}
    >
      <Grid container style={{paddingTop: 30}}>
        <Grid item xs={12}>
          <SelectField
            label={label}
            value={item}
            data={Object.entries(list).map(([k, v]) => ({value: k, label: v}))}
            onChange={setItem}
          />
        </Grid>
      </Grid>
      <Grid container spacing={2} style={{paddingTop: 40}}>
        <Grid item xs={12} sm={6}>
          <BlueButton data-marker={"buttonModalClose"} style={{width: '100%'}} onClick={onClose}>
            {closeText ? closeText : t('CONTROLS.CANCEL')}
          </BlueButton>
        </Grid>
        <Grid item xs={12} sm={6}>
          <GreenButton
            data-marker={"buttonModalSave"}
            style={{width: '100%'}}
            onClick={() => onSubmit(item)}
            disabled={!item}
          >
            {submitText ? submitText : t('CONTROLS.SAVE')}
          </GreenButton>
        </Grid>
      </Grid>
    </ModalWrapper>
  );
};

SelectModal.propTypes = {
  text: propTypes.string,
  label: propTypes.string,
  open: propTypes.bool.isRequired,
  list: propTypes.object.isRequired,
  resetAfterClose: propTypes.bool,
  onSubmit: propTypes.func.isRequired,
  onClose: propTypes.func.isRequired,
  closeText: propTypes.string,
  submitText: propTypes.string
};

SelectModal.defaultProps = {
  text: '',
  label: '',
  resetAfterClose: false
};

export default SelectModal;
