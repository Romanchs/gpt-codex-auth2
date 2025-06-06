import { Chip, styled } from '@material-ui/core';
import makeStyles from '@material-ui/core/styles/makeStyles';
import CancelRounded from '@mui/icons-material/CancelRounded';
import { useAutocomplete } from '@material-ui/lab';

import StyledInput from './StyledInput';
import { useEffect, useState } from 'react';
import { createFilterOptions } from '@mui/material';
import LinearProgress from '@material-ui/core/LinearProgress';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles(() => ({
  root: {
    width: '100%',
    position: 'relative'
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    columnGap: 8,
    rowGap: 8,
    marginBottom: 20
  },
  chip: {
    height: 32,
    gridRow: '1 / 2',
    display: 'flex',
    alignItems: 'center',
    paddingLeft: 12,
    background: '#223B82',
    borderRadius: 12,
    color: '#fff',
    fontSize: 12,
    '&:focus': {
      backgroundColor: '#223B82'
    },
    '& .MuiChip-deleteIcon': {
      color: '#fff'
    },
    '& .MuiChip-label': {
      padding: 0,
      marginRight: 12
    }
  }
}));

const Listbox = styled('ul')(({ theme }) => ({
  width: '100%',
  margin: 0,
  padding: 0,
  zIndex: 3,
  position: 'absolute',
  listStyle: 'none',
  backgroundColor: theme.palette.background.paper,
  overflow: 'auto',
  maxHeight: 200,
  borderRadius: 4,
  filter: 'drop-shadow(0px 4px 16px rgba(0, 0, 0, 0.12))',
  '& li': {
    width: '100%',
    minHeight: 32,
    display: 'flex',
    alignItems: 'center',
    padding: '9px 16px',
    color: '#567691',
    backgroundColor: '#fff'
  },
  '& li[data-focus="true"], & li:active': {
    backgroundColor: '#d1edf3',
    color: '#4A5B7A',
    cursor: 'pointer'
  },
  '& li.notData': {
    backgroundColor: '#fff',
    cursor: 'not-allowed'
  }
}));

export const AutocompleteWithChips = ({
  label,
  nameKey,
  options,
  isLoading,
  handleChange,
  textNoMoreOption,
  setClearProperties,
  error,
  disabled,
  getInputValue,
  reusedValue,
  defaultValue = []
}) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const [value, setValue] = useState(defaultValue);

  const filterOptions = createFilterOptions({
    matchFrom: 'any',
    stringify: (option) => (nameKey ? option[nameKey] + option?.label : option.label)
  });

  const defaultProps = {
    multiple: true,
    filterSelectedOptions: true,
    options: options?.length ? options : [],
    filterOptions: filterOptions,
    value: value,
    getOptionLabel: (option) => (nameKey ? option[nameKey] : option.label),
    getOptionSelected: (option, value) => option.value === value.value
  };

  const {
    getRootProps,
    getInputProps,
    getListboxProps,
    getOptionProps,
    groupedOptions,
    getTagProps,
    popupOpen,
    getClearProps
  } = useAutocomplete({
    ...defaultProps,
    onChange: (event, newValue) => {
      setValue(newValue);
      handleChange(newValue);
    },
    onInputChange: (event, value) => {
      if (getInputValue) {
        getInputValue(value);
      }
    }
  });

  useEffect(() => {
    if (reusedValue && reusedValue?.length) {
      setValue(reusedValue);
    }
  }, [setValue, reusedValue]);

  useEffect(() => {
    if (setClearProperties) {
      setClearProperties(getClearProps);
    }
  }, []);

  return (
    <div className={classes.root}>
      {value.length > 0 && (
        <div className={classes.chips}>
          {value.map((item, index) => {
            const isDefault = defaultValue.some((defaultItem) => defaultItem.value === item.value);
            return (
              <Chip
                className={classes.chip}
                label={item.label}
                {...(isDefault ? {} : getTagProps({ index }))}
                style={{ borderRadius: 30 }}
                key={'chip' + index}
                deleteIcon={!isDefault ? <CancelRounded data-marker={'remove-button'} /> : null}
              />
            );
          })}
        </div>
      )}
      <div {...getRootProps()}>
        <StyledInput {...getInputProps()} label={label} error={error} disabled={disabled} />
      </div>
      {popupOpen && (
        <Listbox {...getListboxProps()}>
          {groupedOptions.length > 0 && (
            <>
              {groupedOptions.map((option, index) => (
                <li {...getOptionProps({ option, index })} key={'option' + index}>
                  {option.label}
                </li>
              ))}
            </>
          )}
          {!groupedOptions.length && (
            <>
              {isLoading ? (
                <LinearProgress />
              ) : (
                <li className={'notData'}>{textNoMoreOption && options.length ? textNoMoreOption : t('NO_RESULTS')}</li>
              )}
            </>
          )}
        </Listbox>
      )}
    </div>
  );
};
