import Grid from '@material-ui/core/Grid';
import { useEffect, useState } from 'react';

import { ModalWrapper } from '../../../../Components/Modal/ModalWrapper';
import { BlueButton } from '../../../../Components/Theme/Buttons/BlueButton';
import { GreenButton } from '../../../../Components/Theme/Buttons/GreenButton';
import StyledInput from '../../../../Components/Theme/Fields/StyledInput';
import { Box, Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { SearchRounded } from '@mui/icons-material';

export const AkoReprocessing = ({ open, addFile = false, fileMaxSize, acceptTypes, onSubmit, onClose }) => {
  const { t } = useTranslation();
  const title = t('ARE_YOU_SURE_YOU_WANT_TO_CLOSE_DISPUTE');
  const warning = t('ARE_YOU_SURE_YOU_WANT_TO_CLOSE_DISPUTE_WARNING');
  const [message, setMessage] = useState(null);
  const [file, setFile] = useState(null);
  const [inputsError, setInputsError] = useState();

  const handleChange = (e) => setMessage(e.target.value);

  const handleSubmit = () => {
    if (!addFile || !file) return onSubmit(message);
    const formData = new FormData();
    formData.append('file_original', file);
    onSubmit(message, formData);
  };

  const validateFile = (currentFiles) => {
    if (currentFiles[0].size >= fileMaxSize) {
      setInputsError(t('VERIFY_MSG.MAX_FILE_SIZE', { size: 25 }));
      return;
    }
  };

  const handleChangeFile = (currentFiles) => {
    validateFile(currentFiles);
    setFile(currentFiles[0]);
  };

  useEffect(() => {
    return () => {
      setMessage(null);
      setInputsError(null);
      setFile(null);
    };
  }, [open]);

  return (
    <ModalWrapper header={title} open={open} onClose={onClose}>
      <Box sx={{ pt: 3 }}>
        <Grid
          container
          style={{ fontSize: 12, lineHeight: '20px', marginBottom: 32, color: '#ff1c1c', whiteSpace: 'pre-line' }}
        >
          {warning.toUpperCase()}
        </Grid>
        <Grid container>
          {addFile && (
            <Box sx={{ mb: 3, display: 'flex', width: '106%', gap: 2, alignItems: 'center' }}>
              <StyledInput
                size={'small'}
                value={file?.name}
                label={t('IMPORT_FILE.SELECT_FILE')}
                placeholder={`${t('IMPORT_FILE.SELECT_FILE')}...`}
                shrink={true}
                error={inputsError}
                readOnly
              />
              <input
                accept={acceptTypes?.join()}
                id={`importTko`}
                type="file"
                onClick={(event) => (event.currentTarget.value = null)}
                onChange={({ target }) => handleChangeFile(target.files)}
              />
              <label htmlFor={`importTko`}>
                <BlueButton component="span" style={{ padding: '8px 16px 8px 18px', width: 175 }}>
                  <SearchRounded />
                  {t('CONTROLS.CHOOSE_FILE')}
                </BlueButton>
              </label>
            </Box>
          )}
          <StyledInput
            name={'message'}
            label={t('FIELDS.COMMENT')}
            value={message}
            multiline
            minRows={5}
            onChange={handleChange}
            dataMarker={'input_message'}
          />
        </Grid>
      </Box>
      <Stack direction={'row'} sx={{ pt: 3 }} justifyContent={'space-between'} spacing={1}>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <BlueButton onClick={onClose} style={{ width: '100%' }}>
              {t('CONTROLS.CANCEL')}
            </BlueButton>
          </Grid>
          <Grid item xs={6}>
            <GreenButton onClick={handleSubmit} style={{ width: '100%' }}>
              {t('CONTROLS.ENGAGE')}
            </GreenButton>
          </Grid>
        </Grid>
      </Stack>
    </ModalWrapper>
  );
};
