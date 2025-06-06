import FormControlLabel from '@mui/material/FormControlLabel';
import ListItem from '@mui/material/ListItem';
import Radio from '@mui/material/Radio';
import TextField from '@mui/material/TextField';
import ArrowDropDownRounded from '@mui/icons-material/ArrowDropDownRounded';
import Popover from '@mui/material/Popover';
import PropTypes from 'prop-types';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

const MultiSelect = ({
  label,
  defaultValue,
  value,
  list,
  onChange,
  error = '',
  disabled = false,
  dataMarker = '',
  ignoreI18 = false,
  popoverHeight = 150,
  ...props
}) => {
  const ref = useRef();
  const [open, setOpen] = useState(false);
  const [localValues, setLocalValues] = useState(defaultValue || []);
  const { t } = useTranslation();
  const selected = value ?? localValues;

  const isSelectedAll = selected.length === list.length;
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = (values) => (e) => {
    e.preventDefault();
    !value?.length && setLocalValues(values);
    onChange(values);
  };

  return (
    <>
      <TextField
        ref={ref}
        label={label}
        value={selected ? selected.map((i) => i.label).join(', ') : ''}
        onFocus={handleOpen}
        data-marker={dataMarker}
        disabled={disabled}
        error={Boolean(error)}
        helperText={error}
        InputProps={{ endAdornment: <ArrowDropDownRounded /> }}
        size={'small'}
        fullWidth
        {...props}
      />
      <Popover
        open={open}
        anchorEl={ref.current}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: -36, horizontal: 'left' }}
        disableEnforceFocus
        disableRestoreFocus
        sx={{
          '> .MuiPopover-paper': {
            width: +ref.current?.clientWidth,
            height: 'auto',
            maxHeight: popoverHeight,
            overflowY: 'auto'
          }
        }}
        PaperProps={{ role: 'listbox' }}
      >
        {list.length > 2 && (
          <LItem
            label={t('ALL')}
            onChange={handleChange(isSelectedAll ? [] : list)}
            checked={isSelectedAll}
            sx={{
              color: '#2a4aa2',
              backgroundColor: 'transparent',
              ' .MuiFormControlLabel-label ': {
                fontStyle: 'italic',
                fontWeight: 600
              }
            }}
          />
        )}
        {list.map((item) => (
          <LItem
            key={item.value}
            label={ignoreI18 ? item.label : t(item.label)}
            onChange={handleChange(
              !selected
                ? ''
                : selected.find((i) => item.value === i.value)
                ? selected.filter((i) => i.value !== item.value)
                : [...selected, item]
            )}
            checked={Boolean(selected && selected.find((i) => item.value === i.value))}
          />
        ))}
      </Popover>
    </>
  );
};

const LItem = ({ label, onChange, checked, sx }) => (
  <ListItem
    onClick={onChange}
    sx={{
      cursor: 'pointer',
      padding: '0px 12px',
      color: checked ? '#223B82' : '#444444',
      backgroundColor: checked ? '#f2f2f2' : 'transparent',
      ' .MuiRadio-root': {
        marginRight: '5px'
      },
      ':hover': {
        backgroundColor: '#f7f7f7'
      },
      ...sx
    }}
    role="option"
    aria-selected={checked}
  >
    <FormControlLabel checked={checked} control={<Radio />} label={label} />
  </ListItem>
);

const listType = PropTypes.arrayOf(
  PropTypes.shape({
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
  })
);

MultiSelect.propTypes = {
  label: PropTypes.string.isRequired,
  defaultValue: listType,
  value: listType,
  list: listType.isRequired,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  disabled: PropTypes.bool,
  dataMarker: PropTypes.string,
  props: PropTypes.object
};

export default MultiSelect;
