import { useState } from 'react';
import propTypes from 'prop-types';
import fieldControl from '../fieldControl';
import makeStyles from '@material-ui/core/styles/makeStyles';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import VisibilityRounded from '@mui/icons-material/VisibilityRounded';
import VisibilityOffRounded from '@mui/icons-material/VisibilityOffRounded';
import { FormHelperText } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  root: {
    width: '100%',
    position: 'relative'
  },
  label: {
    display: 'block',
    transform: 'translate(14px, 14px) scale(1)',
    padding: '0 5px',
    marginLeft: -5,
    color: '#A9B9C6',
    '&.Mui-focused': {
      color: '#567691'
    },
    '&.Mui-error': {
      color: '#f44336'
    }
  },
  input: {
    borderRadius: 10,
    border: '1px solid #D1EDF3',
    outline: 'none',
    color: '#4A5B7A',
    '&>input': {
      fontSize: 14,
      padding: 12
    },
    '&.Mui-focused': {
      border: '1px solid #567691'
    },
    '&.Mui-disabled': {
      border: '1px solid #E9EDF6'
    },
    '&>fieldset': {
      display: 'none'
    },
    '&.Mui-error': {
      borderColor: '#f44336'
    }
  },
  btn: {
    width: 36,
    height: 36,
    '& svg': {
      color: '#6C7D9A'
    }
  }
}));

const PasswordField = ({ value, name, label, onChange, error, dataMarker }) => {
  const classes = useStyles();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <FormControl variant="outlined" className={classes.root} error={Boolean(error)}>
      <InputLabel className={classes.label} htmlFor={`outlined-adornment-${name}`}>
        {label}
      </InputLabel>
      <OutlinedInput
        className={classes.input}
        id={`outlined-adornment-${name}`}
        type={showPassword ? 'text' : 'password'}
        value={value || ''}
        name={name}
        onChange={onChange}
        data-marker={dataMarker}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              className={classes.btn}
              aria-label="toggle password visibility"
              onClick={() => setShowPassword(!showPassword)}
              onMouseDown={(e) => e.preventDefault()}
              edge="end"
            >
              {showPassword ? <VisibilityRounded /> : <VisibilityOffRounded />}
            </IconButton>
          </InputAdornment>
        }
      />
      <FormHelperText>{error}</FormHelperText>
    </FormControl>
  );
};

PasswordField.propTypes = {
  name: propTypes.string.isRequired,
  label: propTypes.string.isRequired
};

export default fieldControl(PasswordField);
