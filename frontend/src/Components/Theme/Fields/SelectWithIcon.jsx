import { FormHelperText } from '@material-ui/core';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import makeStyles from '@material-ui/core/styles/makeStyles';
import propTypes from 'prop-types';
import { forwardRef, useState } from 'react';

export const SelectWithIcon = forwardRef(
  ({ value, name, label, data, onChange, error, dataMarker, disabled, readOnly, required, ...props }, forwardedRef) => {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = useState(null);
    const [menuItemWidth, setMenuItemWidth] = useState(0);

    const handleOpen = (event) => {
      setAnchorEl(event.currentTarget);
      setMenuItemWidth(event.currentTarget.getBoundingClientRect().width.toFixed(0) - 2);
    };

    const handleClose = () => {
      setAnchorEl(null);
    };

    const handleChange = (value) => {
      handleClose();
      onChange(value);
    };

    return (
      <FormControl className={classes.root} variant="outlined" error={Boolean(error)}>
        <InputLabel className={classes.labels}>
          {label} {required && <span className={'danger'}>*</span>}
        </InputLabel>
        <OutlinedInput
          value={value || ''}
          name={name}
          title={(readOnly && value) || ''}
          type={'text'}
          ref={forwardedRef}
          className={classes.input}
          onClick={handleOpen}
          disabled={disabled}
          data-marker={dataMarker}
          {...props}
        />
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose} className={classes.menu}>
          {data
            .filter((i) => !i?.hidden)
            .map((item, index) => (
              <MenuItem style={{ width: menuItemWidth }} key={index} onClick={() => handleChange(item.value)}>
                {item.label}
              </MenuItem>
            ))}
        </Menu>
        <FormHelperText>{error}</FormHelperText>
      </FormControl>
    );
  }
);

SelectWithIcon.propTypes = {
  value: propTypes.string,
  name: propTypes.string,
  label: propTypes.string.isRequired,
  onChange: propTypes.func.isRequired,
  dataMarker: propTypes.string,
  disabled: propTypes.bool,
  data: propTypes.arrayOf(
    propTypes.shape({
      value: propTypes.oneOfType([propTypes.string, propTypes.number]).isRequired,
      label: propTypes.oneOfType([propTypes.string, propTypes.number]).isRequired,
      hidden: propTypes.bool
    })
  )
};

SelectWithIcon.defaultProps = {
  data: []
};

export default SelectWithIcon;

const useStyles = makeStyles(() => ({
  root: {
    width: '100%',
    position: 'relative'
  },
  labels: {
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
    position: 'relative',
    paddingRight: 25,
    '&::after': {
      content: "''",
      position: 'absolute',
      top: 18,
      right: 10,
      border: '5px solid transparent',
      borderWidth: '4px 4.3px',
      borderTopColor: 'rgba(0, 0, 0, 0.54)',
      cursor: 'pointer'
    },
    '&>input': {
      fontSize: 14,
      padding: 12,
      cursor: 'pointer',
      '&:read-only': {
        textOverflow: 'ellipsis'
      }
    },
    '&.Mui-focused': {
      border: '1px solid #567691',
      position: 'relative',
      '&::before': {
        content: "''",
        position: 'absolute',
        top: 10,
        left: 10,
        width: 10,
        height: 20,
        backgroundColor: '#fff',
        cursor: 'pointer'
      }
    },
    '&.Mui-disabled': {
      border: '1px solid #E9EDF6'
    },
    '&>fieldset': {
      display: 'none'
    },
    '&.Mui-error': {
      borderColor: '#f44336'
    },
    '&.MuiOutlinedInput-multiline': {
      padding: '12px 12px 6px',
      lineHeight: 1.6
    }
  },
  menu: {
    '&>.MuiPaper-root': {
      transform: 'translateX(1px) !important',
      '& .MuiListItem-root': {
        color: '#333',
        fontSize: 13
      }
    }
  }
}));
