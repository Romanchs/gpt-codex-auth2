import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Radio from '@mui/material/Radio';
import Checkbox from '@mui/material/Checkbox';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import FormGroup from '@mui/material/FormGroup';
import CheckCircleOutlineRounded from '@mui/icons-material/CheckCircleOutlineRounded';
import RadioButtonUncheckedRounded from '@mui/icons-material/RadioButtonUncheckedRounded';
import PropTypes from 'prop-types';
import { ModalWrapper } from '../../../Components/Modal/ModalWrapper';
import { BlueButton } from '../../../Components/Theme/Buttons/BlueButton';
import { GreenButton } from '../../../Components/Theme/Buttons/GreenButton';
import Toggle from '../../../Components/Theme/Fields/Toggle';
import { useEffect, useState } from 'react';
import i18n from '../../../i18n/i18n';

const BaseModal = ({ open, onClose, text, content, buttons }) => {
  return (
    <ModalWrapper header={text} open={open} onClose={onClose}>
      {content}
      <Stack direction={'row'} justifyContent={'space-between'} spacing={1}>
        <Grid container spacing={3}>
          {buttons.map((b, i) => {
            const Buttton = b.color === 'blue' ? BlueButton : GreenButton;
            return (
              <Grid key={`button-${i}`} item xs={6}>
                <Buttton onClick={b.onClick} style={{ width: '100%' }}>
                  {b.text}
                </Buttton>
              </Grid>
            );
          })}
        </Grid>
      </Stack>
    </ModalWrapper>
  );
};

const CancelModal = ({ open, onClose, onSubmit }) => {
  const [active, setActive] = useState(true);

  useEffect(() => {
    if (open) setActive(true);
  }, [open]);

  const handleSubmit = () => {
    onSubmit({ notify: active });
    onClose();
  };

  const content = (
    <Stack direction={'row'} sx={{ mt: 3, mb: 5, alignItems: 'center' }}>
      <Toggle
        title={active ? i18n.t('TECH_WORKS.FIELDS.TURN_OFF_NOTIFY') : i18n.t('TECH_WORKS.FIELDS.TURN_ON_NOTIFY')}
        dataMarker={'toggle-notify'}
        setSelected={setActive}
        selected={active}
      />
      <Typography
        component={'span'}
        data-marker={'toggleText'}
        sx={{ ml: '12px', fontWeight: 400, fontSize: 12, color: '#4A5B7A', cursor: 'pointer' }}
        onClick={() => setActive(!active)}
      >
        {i18n.t('TECH_WORKS.MODALS.CANCEL_NOTIFY_TEXT')}
      </Typography>
    </Stack>
  );
  return (
    <BaseModal
      open={open}
      onClose={onClose}
      text={i18n.t('TECH_WORKS.MODALS.CANCEL_APPROVED_TEXT') + '?'}
      content={content}
      buttons={[
        { color: 'blue', onClick: onClose, text: i18n.t('CONTROLS.NO') },
        { color: 'green', onClick: handleSubmit, text: i18n.t('CONTROLS.YES') }
      ]}
    />
  );
};

CancelModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
};

const styles = {
  title: {
    mb: '2px',
    fontSize: 12,
    fontWeight: 700,
    color: '#567691',
    '&.Mui-focused': {
      color: '#567691'
    }
  },
  text: {
    fontSize: 12,
    fontWeight: 400,
    color: '#567691',
    '&.Mui-disabled': {
      color: '#567691'
    }
  },
  radio: {
    '& .MuiRadio-root': {
      color: '#567691',
      p: 1,
      '&.Mui-checked': {
        color: '#F28C60'
      }
    }
  },
  checkbox: {
    '& .MuiCheckbox-root': {
      color: '#567691',
      p: 1,
      '&.Mui-checked': {
        color: '#F28C60'
      },
      '&.Mui-disabled': {
        opacity: '0.5'
      }
    }
  }
};

const CompleteModal = ({ open, list, onClose, onSubmit }) => {
  const [state, setState] = useState({
    notify: true,
    todolist: []
  });
  const [inFull, setInFull] = useState(true);

  useEffect(() => {
    if (open) setState({ notify: true, todolist: list });
  }, [open, list]);

  const handleToggle = (notify) => {
    setState({ ...state, notify });
  };

  const handleSubmit = () => {
    onSubmit(state);
    onClose();
  };

  const handleIsFull = (active) => {
    if (active) setState({ ...state, todolist: state.todolist.map((i) => ({ ...i, is_completed: true })) });
    setInFull(active);
  };

  const handleListItemCheck = (index) => {
    setState({
      ...state,
      todolist: state.todolist.map((t, i) => ({ ...t, is_completed: i === index ? !t.is_completed : t.is_completed }))
    });
  };

  const content = (
    <>
      <FormControl sx={{ mt: 1, mb: 1, display: 'block' }}>
        <FormLabel sx={styles.title}>{i18n.t('TECH_WORKS.MODALS.COMPLETE_LABEL_1') + '?'}</FormLabel>
        <RadioGroup
          aria-label="tech-works-in-full"
          name="tech-works-in-full"
          sx={{
            ...styles.radio,
            '& .MuiTypography-root': styles.text
          }}
        >
          <FormControlLabel
            label={i18n.t('CONTROLS.YES')}
            onChange={() => handleIsFull(true)}
            control={<Radio checked={inFull === true} />}
          />
          <FormControlLabel
            label={i18n.t('CONTROLS.NO')}
            onChange={() => handleIsFull(false)}
            control={<Radio checked={inFull === false} />}
          />
        </RadioGroup>
      </FormControl>
      <FormControl sx={{ mb: 1 }}>
        <FormLabel sx={styles.title}>{i18n.t('TECH_WORKS.MODALS.COMPLETE_LABEL_2') + ':'}</FormLabel>
        <FormGroup
          sx={{
            ...styles.checkbox,
            '& .MuiTypography-root': styles.text
          }}
        >
          {state.todolist?.map((i, index) => (
            <FormControlLabel
              key={index}
              label={i.name}
              onChange={() => handleListItemCheck(index)}
              control={
                <Checkbox
                  icon={<RadioButtonUncheckedRounded />}
                  checkedIcon={<CheckCircleOutlineRounded />}
                  checked={state.todolist[index].is_completed}
                  disabled={inFull}
                  data-status={state.todolist[index].is_completed ? 'active' : 'inactive'}
                />
              }
            />
          ))}
        </FormGroup>
      </FormControl>
      <Box sx={{ mb: 2, height: '1px', backgroundColor: '#E5EAEE' }} />
      <Stack direction={'row'} sx={{ mb: 3, alignItems: 'center' }}>
        <Toggle
          title={
            state.notify ? i18n.t('TECH_WORKS.FIELDS.TURN_OFF_NOTIFY') : i18n.t('TECH_WORKS.FIELDS.TURN_ON_NOTIFY')
          }
          dataMarker={'toggle-notify'}
          setSelected={handleToggle}
          selected={state.notify}
        />
        <Typography
          component={'span'}
          data-marker={'toggleText'}
          sx={{ ml: '12px', fontWeight: 400, fontSize: 12, color: '#4A5B7A', cursor: 'pointer' }}
          onClick={() => handleToggle(!state.notify)}
        >
          {i18n.t('TECH_WORKS.MODALS.COMPLETE_NOTIFY_TEXT')}
        </Typography>
      </Stack>
    </>
  );
  return (
    <BaseModal
      open={open}
      onClose={onClose}
      text={i18n.t('TECH_WORKS.MODALS.COMPLETE_APPROVED_TEXT')}
      content={content}
      buttons={[
        { color: 'blue', onClick: onClose, text: i18n.t('TECH_WORKS.CONTROLS.CANCEL') },
        { color: 'green', onClick: handleSubmit, text: i18n.t('TECH_WORKS.CONTROLS.SAVE') }
      ]}
    />
  );
};

CompleteModal.propTypes = {
  open: PropTypes.bool.isRequired,
  list: PropTypes.array.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
};

export { CancelModal, CompleteModal };
