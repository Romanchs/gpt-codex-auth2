import { FormHelperText, InputLabel, lighten } from '@material-ui/core';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import makeStyles from '@material-ui/core/styles/makeStyles';
import propTypes from 'prop-types';
import { forwardRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import InputAdornment from '@mui/material/InputAdornment';
import { CircularProgress } from '@mui/material';

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
    maxWidth: '90%',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    '&.Mui-focused': {
      color: '#567691'
    },
    '&.Mui-error': {
      color: '#f44336'
    },
    '&.MuiInputLabel-shrink': {
      maxWidth: '100%'
    }
  },
  select: {
    borderRadius: 10,
    border: '1px solid #D1EDF3',
    outline: 'none',
    fontWeight: 500,
    color: '#567691',
    '&>.MuiSelect-root.MuiSelect-select': {
      fontSize: 14,
      padding: '12px 24px 12px 12px',
      '&:focus': {
        backgroundColor: 'transparent'
      }
    },
    '&>svg.MuiSelect-icon': {
      top: 'calc(50% - 11px)',
      zIndex: 1,
      background: 'white'
    },
    '&.Mui-disabled': {
      border: '1px solid #E9EDF6',
      color: lighten('#4A5B7A', 0.3)
    },
    '&>fieldset': {
      display: 'none'
    },
    '&.Mui-error': {
      borderColor: '#f44336'
    }
  },
  menuItem: {
    fontSize: 13,
    color: '#333',
    whiteSpace: 'normal'
  },
  menuItemSelected: {
    '&.MuiListItem-root.Mui-selected': {
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      color: '#fff'
    }
  }
}));

const SelectField = forwardRef(
  (
    {
      label,
      required,
      value,
      data,
      onChange,
      disabled,
      readOnly,
      name,
      error,
      dataMarker,
      multiple = false,
      ignoreI18 = false,
      withAll = false,
      loading = false
    },
    forwardedRef
  ) => {
    const { t } = useTranslation();
    const classes = useStyles();
    const [open, setOpen] = useState(false);

    const handleOpen = () => {
      setOpen(true);
    };

    const handleClose = () => {
      setOpen(false);
    };

    return (
      <FormControl className={classes.root} variant="outlined" error={Boolean(error)}>
        <InputLabel className={classes.labels}>
          {label} {required && <span className={'danger'}>*</span>}
        </InputLabel>
        <Select
          ref={forwardedRef}
          readOnly={readOnly}
          className={(error ? 'error-select ' : '') + classes.select}
          open={open}
          name={name}
          disabled={disabled}
          onClose={handleClose}
          onOpen={handleOpen}
          value={value || (multiple ? [] : '')}
          onChange={({ target }) => onChange(target.value)}
          variant={'outlined'}
          displayEmpty={true}
          label={label}
          multiple={multiple}
          data-marker={dataMarker}
          endAdornment={
            loading && (
              <InputAdornment position="start" sx={{ pr: 1 }}>
                <CircularProgress size={24} />
              </InputAdornment>
            )
          }
          inputProps={{
            'data-marker': `${dataMarker}_input`
          }}
        >
          {withAll && (
            <MenuItem
              className={classes.menuItem + (multiple ? ` ${classes.menuItemSelected}` : '')}
              style={{ fontStyle: 'italic', fontWeight: 700 }}
              value={'all'}
            >
              {t('ALL')}
            </MenuItem>
          )}
          {data
            .filter((i) => !i?.hidden)
            .map((item, index) => {
              return (
                <MenuItem
                  className={classes.menuItem + (multiple ? ` ${classes.menuItemSelected}` : '')}
                  key={index}
                  value={item.value}
                  disabled={item.disabled}
                  data-marker={dataMarker + index}
                >
                  {ignoreI18 ? item.label : t(item.label)}
                </MenuItem>
              );
            })}
        </Select>
        <FormHelperText>{Array.isArray(error) ? error.join(',') : typeof error === 'string' && error}</FormHelperText>
      </FormControl>
    );
  }
);

SelectField.propTypes = {
  onChange: propTypes.func.isRequired,
  value: propTypes.oneOfType([propTypes.string, propTypes.number, propTypes.array]),
  name: propTypes.string,
  disabled: propTypes.bool,
  error: propTypes.oneOfType([propTypes.string, propTypes.bool, propTypes.array]),
  dataMarker: propTypes.string.isRequired,
  multiple: propTypes.bool,
  data: propTypes.arrayOf(
    propTypes.shape({
      value: propTypes.oneOfType([propTypes.string, propTypes.number]).isRequired,
      label: propTypes.oneOfType([propTypes.string, propTypes.number]).isRequired,
      hidden: propTypes.bool
    })
  )
};

export default SelectField;
