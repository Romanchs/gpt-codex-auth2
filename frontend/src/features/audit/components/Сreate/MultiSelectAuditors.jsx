import StyledInput from '../../../../Components/Theme/Fields/StyledInput';
import React, { Fragment, useEffect, useMemo, useState } from 'react';
import { ModalWrapper } from '../../../../Components/Modal/ModalWrapper';
import SearchAuditors from '../SearchAuditors';
import { useTranslation } from 'react-i18next';
import { Divider, ListItemText, Stack } from '@mui/material';
import CircleButton from '../../../../Components/Theme/Buttons/CircleButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import { GreenButton } from '../../../../Components/Theme/Buttons/GreenButton';

const MultiSelectAuditors = ({ value, label, onChange, solo = false, error, required = false, disabled }) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [inputValue, setValue] = useState('');
  const [list, setList] = useState(value || []);

  useEffect(() => {
    setList(value);
  }, [value]);

  const parsedValue = useMemo(() => {
    if (value?.length === 1) {
      return value[0];
    }
    if (value?.length > 1) {
      return `${value[0]}, +${value.length - 1}`;
    }
    return '';
  }, [value]);

  const handleClick = () => {
    if (disabled) return;
    if (window.getSelection().toString()) return;
    setOpen(true);
  };

  const handleAdd = () => {
    setList([...list, inputValue]);
    setValue('');
  };

  const handleClose = () => {
    setOpen(false);
    setValue('');
  };

  const handleSelect = () => {
    onChange(list);
    handleClose();
  };

  return (
    <>
      <StyledInput
        value={parsedValue}
        label={label}
        readOnly
        onClick={handleClick}
        error={error}
        required={required}
        disabled={disabled}
      />
      <ModalWrapper open={open} onClose={handleClose} header={label}>
        <Stack direction={'row'} spacing={2} sx={{ mt: 2, mb: 2 }} alignItems={'center'}>
          {solo ? (
            <StyledInput label={''} value={inputValue} onChange={(e) => setValue(e?.target?.value || '')} />
          ) : (
            <SearchAuditors label={t('SEARCH')} defaultValue={inputValue} onSelect={setValue} showAll clearable />
          )}
          <CircleButton type={'add'} onClick={handleAdd} disabled={list.includes(inputValue) || !inputValue} />
        </Stack>
        <List>
          {list.map((i, index) => (
            <Fragment key={index}>
              <ListItem
                secondaryAction={
                  <IconButton edge="end" aria-label="delete" onClick={() => setList(list.filter((li) => li !== i))}>
                    <DeleteIcon />
                  </IconButton>
                }
              >
                <ListItemText primary={i} />
              </ListItem>
              {index < list.length - 1 && <Divider />}
            </Fragment>
          ))}
        </List>
        <Stack direction={'row'} sx={{ mt: 2 }} alignItems={'center'} justifyContent={'center'}>
          <GreenButton onClick={handleSelect} disabled={list.length < 1}>
            {t('CONTROLS.APPLY')}
          </GreenButton>
        </Stack>
      </ModalWrapper>
    </>
  );
};

export default MultiSelectAuditors;
