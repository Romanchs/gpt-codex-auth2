import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Stack, Button, IconButton, TextField } from '@mui/material';
import { InputAdornment } from '@material-ui/core';
import { EditRounded, AddRounded } from '@mui/icons-material';
import DeleteRounded from '@mui/icons-material/DeleteRounded';

import { useProcessSettingsUsersQuery, useProcessSettingsUsersUpdateMutation } from '../api';
import { BaseSettingsDialog } from './BaseSettingsDialog';

export const ExcludesModal = ({ open, onClose }) => {
  const { t } = useTranslation();
  const { currentData } = useProcessSettingsUsersQuery();

  const [updateValues, { isLoading }] = useProcessSettingsUsersUpdateMutation({
    fixedCacheKey: 'process-settings-updating-users'
  });

  const [companies, setCompanies] = useState([]);
  const [inputs, setInputs] = useState(['']);

  useEffect(() => {
    if (open && currentData?.companies) {
      setInputs(currentData.companies);
    }
  }, [open, currentData?.companies]);

  const handleAdd = () => {
    const updatedInputs = [...inputs, ''];
    setInputs(updatedInputs);
    setCompanies(updatedInputs);
  };

  const handleDelete = (index) => {
    const updatedInputs = inputs.filter((_, i) => i !== index);
    setInputs(updatedInputs);
    setCompanies(updatedInputs);
  };

  const handleChange = (index, newValue) => {
    const updated = inputs.map((input, i) => (i === index ? newValue : input));
    setInputs(updated);
    setCompanies(updated);
  };

  return (
    <BaseSettingsDialog
      title={t('EXCLUSIONS_SETTINGS')}
      open={open}
      onClose={onClose}
      isLoading={isLoading}
      handleSave={() => {
        updateValues({ values: companies, type: 'companies' }).then((res) => {
          if (!res.error) onClose();
        });
      }}
    >
      <Stack spacing={3}>
        {inputs?.map((input, index) => (
          <Stack key={index} direction={'row'} spacing={3} alignItems={'center'}>
            <TextField
              label={t('FIELDS.EIC') + ' №' + (index + 1)}
              value={input}
              onChange={(e) => handleChange(index, e.target.value)}
              size={'small'}
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <EditRounded sx={{ fill: '#C6C6C6' }} data-marker={'edit'} />
                  </InputAdornment>
                )
              }}
            />
            <IconButton
              sx={(theme) => ({ boxShadow: theme.shadows[3] })}
              onClick={() => handleDelete(index)}
              data-marker={'delete'}
            >
              <DeleteRounded sx={{ fill: '#FF4850' }} />
            </IconButton>
          </Stack>
        ))}

        <Stack alignItems={'flex-end'} mb={5} mt={2}>
          <Button
            color={'success'}
            variant="contained"
            startIcon={<AddRounded />}
            sx={{ borderRadius: 4, fontWeight: 400 }}
            onClick={handleAdd}
          >
            {t('CONTROLS.ADD')}
          </Button>
        </Stack>
      </Stack>
    </BaseSettingsDialog>
  );
};
