import { useEffect, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import StyledInputClear from '../../../Theme/Fields/StyledInputClear';
import { BlueButton } from '../../../Theme/Buttons/BlueButton';
import SearchRounded from '@mui/icons-material/SearchRounded';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles((theme) => ({
  label: {
    minWidth: 500,
    width: '100%',
    '& p': {
      color: '#555',
      '&.error': {
        color: '#f90000',
        fontWeight: 500,
        fontSize: 12
      }
    }
  },
  button: {
    textTransform: 'none',
    color: theme.palette.primary.white,
    borderColor: theme.palette.primary.white,
    '& svg': {
      marginRight: 8,
      fontSize: 16
    }
  },
  error: {
    color: '#f90000',
    fontWeight: 500,
    fontSize: 12
  }
}));

const UploadInput = ({ initFile = null, responseError, handleUpload, handleClear = null }) => {
  const {t} = useTranslation();
  const classes = useStyles();
  const [error, setError] = useState(null);
  const [file, selectFile] = useState(null);

  useEffect(() => {
    if (responseError) {
      setError(responseError);
    }
  }, [responseError]);

  useEffect(() => {
    if (initFile) {
      selectFile(initFile);
    }
  }, [initFile]);

  const validate = (file) => {
    if (file.size / 1024 / 1024 >= 25) {
      return t('VERIFY_MSG.MAX_FILE_SIZE', {size: 25});
    }
    return null;
  };

  const handleSelect = (target) => {
    if (target.files.length === 0) return;
    const validateError = validate(target.files[0]);
    setError(validateError);
    if(!validateError) {
      selectFile(target.files[0]);
      handleUpload(target.files[0]);
    }
  };

  const handleInnerClear = () => {
    selectFile((prevState) => {
      handleClear && handleClear(prevState);
      return null;
    });
  };

  const accepts = [
    'text/plain',
    'application/oxps',
    'application/vnd.ms-xpsdocument',
    'text/csv',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/pdf',
    'image/*'
  ];

  return (
    <>
      <Grid container spacing={2} alignItems={'center'}>
        <Grid item xs={6} lg={4} md={4}>
          <StyledInputClear label={t('FIELDS.DISPUTE_FILE')} value={file?.name} onClear={() => handleInnerClear()} readOnly />
        </Grid>
        <Grid item xs={6} lg={6} md={6}>
          <input
            id="ts-button-file"
            type="file"
            onChange={({ target }) => handleSelect(target)}
            accept={accepts.join(',')}
          />
          <label htmlFor="ts-button-file" className={classes.label}>
            <BlueButton component="span">
              <SearchRounded />
              {t('CONTROLS.CHOOSE_FILE')}
            </BlueButton>
          </label>
        </Grid>
      </Grid>
      {Boolean(error) && <p className={classes.error}>{error}</p>}
    </>
  );
};

export default UploadInput;
