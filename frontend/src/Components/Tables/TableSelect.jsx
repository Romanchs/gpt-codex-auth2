import { lighten } from '@material-ui/core';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import makeStyles from '@material-ui/core/styles/makeStyles';
import propTypes from 'prop-types';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles(() => ({
  root: {
    width: '100%',
    position: 'relative'
  },
  select: {
    borderRadius: 4,
    border: '1px solid #D1EDF3',
    outline: 'none',
    color: '#555',
    backgroundColor: '#fff',
    marginTop: 5,
    fontWeight: 700,
    '&>.MuiSelect-root.MuiSelect-select': {
      fontSize: 12,
      padding: '6px 16px 7px 7px',
      '&:focus': {
        backgroundColor: 'transparent'
      }
    },
    '&>svg.MuiSelect-icon': {
      top: 'calc(50% - 10px)',
      right: 0
    },
    '&.Mui-disabled': {
      border: '1px solid #E9EDF6',
      color: lighten('#4A5B7A', 0.3)
    },
    '&>fieldset': {
      display: 'none'
    }
  },
  menuItem: {
    fontSize: 12,
    color: '#333',
    fontWeight: 700,
    whiteSpace: 'normal'
  },
  menuItemSelected: {
    '&.MuiListItem-root.Mui-selected': {
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      color: '#fff'
    }
  }
}));

const TableSelect = ({
  value,
  data,
  onChange,
  id,
  minWidth,
  maxWidth,
  dataMarker = '',
  withAll = true,
  loading = false,
  disabled = false,
  multiple = false,
  readOnly = false,
  ignoreI18 = true,
  renderValue
}) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <FormControl className={classes.root} variant="outlined" disabled={disabled}>
      <Select
        style={{ minWidth, maxWidth }}
        className={classes.select}
        open={open}
        onClose={handleClose}
        onOpen={handleOpen}
        readOnly={readOnly}
        value={value ?? ''}
        onChange={({ target }) => onChange(id, target.value)}
        variant={'outlined'}
        multiple={multiple}
        data-marker={dataMarker}
        renderValue={renderValue}
      >
        {withAll && (
          <MenuItem
            className={classes.menuItem}
            value={''}
            disabled={loading}
            style={{
              fontWeight: 500,
              color: '#777',
              fontStyle: 'italic'
            }}
          >
            {loading ? `${t('LOADING')}...` : t('ALL')}
          </MenuItem>
        )}
        {data &&
          data.map((item, key) => {
            return (
              <MenuItem
                className={classes.menuItem + (multiple ? ` ${classes.menuItemSelected}` : '')}
                value={item?.value || item}
                key={key}
              >
                {ignoreI18 ? item?.label || item : t(item?.label || item)}
              </MenuItem>
            );
          })}
      </Select>
    </FormControl>
  );
};

TableSelect.propTypes = {
  onChange: propTypes.func.isRequired,
  value: propTypes.oneOfType([propTypes.string, propTypes.number, propTypes.array]),
  data: propTypes.array,
  id: propTypes.string.isRequired,
  minWidth: propTypes.number,
  disabled: propTypes.bool,
  multiple: propTypes.bool,
  dataMarker: propTypes.string,
  renderValue: propTypes.func
};

export default TableSelect;
