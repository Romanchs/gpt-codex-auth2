import Box from '@material-ui/core/Box';
import Dialog from '@material-ui/core/Dialog';
import IconButton from '@material-ui/core/IconButton';
import makeStyles from '@material-ui/core/styles/makeStyles';
import CloseRounded from '@mui/icons-material/CloseRounded';
import SearchRounded from '@mui/icons-material/SearchRounded';
import PropTypes from 'prop-types';
import { useState } from 'react';

import { BlueButton } from '../Theme/Buttons/BlueButton';
import { GreenButton } from '../Theme/Buttons/GreenButton';
import StyledInput from '../Theme/Fields/StyledInput';
import { getEnv } from '../../util/getEnv';
import { Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

const SimpleImportModal = ({
  title,
  openUpload,
  setOpenUpload,
  handleUpload,
  layoutList,
  canUploadWithoutKey,
  uploading,
  error,
  warningMessage,
  children,
  disabledUpload,
  inOneLine,
  contentUp = false,
  keyFiles = ['file_original_key']
}) => {
  const classes = useStyles({ contentUp });
  const [files, setFiles] = useState({});
  const [inputsError, setInputsError] = useState({});
  const { t } = useTranslation();

  const handleClose = () => {
    if (uploading) return;
    setOpenUpload(false);
    setFiles({});
    setInputsError({});
  };

  const handleInnerUpload = () => {
    const formData = new FormData();
    Object.keys(files).forEach((key) => files[key]?.[0] && formData.append(key, files[key][0]));
    handleUpload(formData, handleClose);
    setFiles({});
  };

  const handleDisabledUpload = () => {
    if (uploading || disabledUpload) return true;
    if (Object.keys(inputsError).length > 0) {
      return true;
    }
    if (canUploadWithoutKey && files?.file_original) {
      return false;
    }
    return !(!canUploadWithoutKey && files?.file_original && !keyFiles.find(i => !files?.[i]));
  };

  const validateFile = (currentFiles, key, maxSize, sizeError, accept) => {
    const acceptTypes = accept.split(',');

    if (currentFiles[0].size >= maxSize) {
      setInputsError((inputsError) => ({ ...inputsError, [key]: sizeError }));
      return;
    }
    if (acceptTypes.filter((ext) => currentFiles[0].name.endsWith(ext)).length === 0) {
      setInputsError((inputsError) => ({ ...inputsError, [key]: t('VERIFY_MSG.UNCORRECT_FORMAT') }));
      return;
    }
    if (inputsError[key]) {
      const copy = { ...inputsError };
      delete copy[key];
      setInputsError(copy);
    }
  };

  const handleChangeFile = (currentFiles, key, maxSize, sizeError, accept) => {
    validateFile(currentFiles, key, maxSize, sizeError, accept);
    setFiles({ ...files, [key]: currentFiles.length ? currentFiles : null });
  };

  return (
    <Dialog open={openUpload} onClose={handleClose} maxWidth={'lg'} style={{ zIndex: 999 }}>
      <div className={classes.root}>
        <IconButton onClick={handleClose} className={classes.close_button} data-marker={'close-dialog'}>
          <CloseRounded />
        </IconButton>
        <h4 className={classes.header}>{title}</h4>
        {warningMessage && (
          <Box sx={{ pt: 2 }}>
            <Typography color="error">{warningMessage}</Typography>
          </Box>
        )}
        <Box className={classes.content}>
          {contentUp && <>{children}</>}
          {layoutList.map(({ label, key, accept, maxSize, sizeError }) => (
            <Box key={key} className={`${classes.field} ${inOneLine ? classes.field_w106 : ''}`}>
              <StyledInput
                className={classes.field__input}
                size={'small'}
                value={files[key]?.[0]?.name}
                label={label}
                placeholder={`${t('IMPORT_FILE.SELECT_FILE')}...`}
                shrink={true}
                error={error?.detail?.[key] || error?.[key] || inputsError?.[key]}
                readOnly
              />
              <input
                accept={accept}
                id={`importTko-${key}`}
                disabled={uploading}
                type="file"
                onClick={(event) => (event.currentTarget.value = null)}
                onChange={({ target }) => handleChangeFile(target.files, key, maxSize, sizeError, accept)}
              />
              <label htmlFor={`importTko-${key}`}>
                <BlueButton className={classes.field__button} component="span" disabled={uploading}>
                  <SearchRounded />
                  {t('CONTROLS.CHOOSE_FILE')}
                </BlueButton>
              </label>
            </Box>
          ))}
          {!contentUp && <>{children}</>}
        </Box>
        <Box className={classes.controls}>
          <BlueButton className={classes.controls__button} onClick={handleClose} disabled={uploading}>
            {t('CONTROLS.CANCEL')}
          </BlueButton>
          <GreenButton
            className={classes.controls__button}
            onClick={handleInnerUpload}
            disabled={handleDisabledUpload()}
          >
            {uploading ? `${t('LOADING')}...` : t('CONTROLS.DOWNLOAD')}
          </GreenButton>
        </Box>
      </div>
    </Dialog>
  );
};

SimpleImportModal.propTypes = {
  title: PropTypes.string.isRequired,
  openUpload: PropTypes.bool.isRequired,
  setOpenUpload: PropTypes.func.isRequired,
  handleUpload: PropTypes.func.isRequired,
  layoutList: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      key: PropTypes.string.isRequired,
      accept: PropTypes.string.isRequired
    })
  ).isRequired,
  canUploadWithoutKey: PropTypes.bool,
  uploading: PropTypes.bool,
  error: PropTypes.object,
  warningMessage: PropTypes.string,
  disabledUpload: PropTypes.bool,
  inOneLine: PropTypes.bool,
  contentUp: PropTypes.bool,
  keyFiles: PropTypes.arrayOf(PropTypes.string)
};

SimpleImportModal.defaultProps = {
  canUploadWithoutKey: getEnv().env === 'dev',
  keyFiles: ['file_original_key'],
  uploading: false,
  error: {},
  disabledUpload: false,
  inOneLine: false,
  contentUp: false
};

export default SimpleImportModal;

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'relative',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: '32px 40px 40px',
    [theme.breakpoints.down('md')]: {
      padding: '21px 20px 36px'
    }
  },
  close_button: {
    position: 'absolute',
    right: 12,
    top: 12,
    '& svg': {
      fontSize: 19
    }
  },
  header: {
    color: '#0D244D',
    fontSize: 15,
    fontWeight: 500,
    lineHeight: 1.4,
    paddingRight: 20,
    letterSpacing: 0.15,
    [theme.breakpoints.down('md')]: {
      paddingRight: 30,
      fontSize: 14
    }
  },
  content: (props) => ({
    marginTop: 40,
    ...(props.contentUp && {
      display: 'flex',
      flexDirection: 'column',
      gap: 30
    })
  }),
  field: {
    marginBottom: 24,
    display: 'flex',
    minWidth: 570,
    gap: 22
  },
  field_w106: {
    '& .MuiFormLabel-root.MuiInputLabel-root': {
      width: '106%'
    }
  },
  field__input: {
    borderRadius: 5,
    '&>input': {
      padding: '9px 12px'
    }
  },
  field__button: {
    padding: '8px 16px 8px 18px',
    whiteSpace: 'nowrap',
    borderRadius: 4
  },
  controls: {
    marginTop: 40,
    display: 'flex',
    justifyContent: 'center',
    gap: 24
  },
  controls__button: {
    minWidth: 204,
    textTransform: 'uppercase',
    fontSize: 12
  }
}));
