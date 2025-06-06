import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import SearchRounded from '@mui/icons-material/SearchRounded';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@mui/material/IconButton';
import CloseRounded from '@mui/icons-material/CloseRounded';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import StyledInput from '../../../../Components/Theme/Fields/StyledInput';
import { BlueButton } from '../../../../Components/Theme/Buttons/BlueButton';
import propTypes from 'prop-types';

const SelectFilesField = ({
  onClick,
  onChange,
  onClear,
  value = '',
  error,
  disabledUpload = false,
  disabledRemove = false
}) => {
  const { t } = useTranslation();
  const [files, setFiles] = useState([]);
  const DOCUMENTS_NAMES = value ?? files?.map((f) => f.name)?.join(', ');

  const handleClick = (event) => {
    event.currentTarget.value = null;
    setFiles(null);
    onClick(event);
  };

  const handleChangeFile = (event) => {
    const addedFiles = Array.prototype.slice.call(event.target.files);
    setFiles(addedFiles);
    onChange(addedFiles);
  };

  const handleRemoveFile = () => {
    setFiles(null);
    onClear();
  };

  return (
    <Box display={'flex'} gap={3} alignItems={error ? 'flex-start' : 'center'}>
      <StyledInput
        style={{ width: '320px' }}
        size={'small'}
        value={DOCUMENTS_NAMES}
        label={t('FIELDS.BASIS_DOCUMENT')}
        error={error}
        readOnly
        endAdornment={
          value && (
            <InputAdornment position="end">
              <IconButton
                size={'small'}
                onClick={handleRemoveFile}
                data-marker={'remove-document'}
                sx={{
                  ml: 2,
                  width: 36,
                  height: 36
                }}
                disabled={disabledRemove}
              >
                <CloseRounded />
              </IconButton>
            </InputAdornment>
          )
        }
      />
      <input
        id={'file'}
        disabled={disabledUpload}
        type="file"
        multiple
        onClick={handleClick}
        onChange={handleChangeFile}
      />
      <label htmlFor={'file'}>
        <BlueButton component={'span'} disabled={disabledUpload}>
          <SearchRounded data-status={disabledUpload ? 'disabled' : 'active'} />
          <Typography noWrap>{t('CONTROLS.SELECT_FILES')}</Typography>
        </BlueButton>
      </label>
    </Box>
  );
};

SelectFilesField.propTypes = {
  onClick: propTypes.func.isRequired,
  onChange: propTypes.func.isRequired,
  onClear: propTypes.func.isRequired,
  value: propTypes.string,
  error: propTypes.string,
  disabledUpload: propTypes.bool,
  disabledRemove: propTypes.bool
};

export default SelectFilesField;
