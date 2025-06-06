import { useState } from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { ModalWrapper } from './ModalWrapper';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import InsertDriveFileRounded from '@mui/icons-material/InsertDriveFileRounded';
import BackupRounded from '@mui/icons-material/BackupRounded';
import {useTranslation} from "react-i18next";
import {t} from "i18next";

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: 16
  },
  label: {
    width: '100%',
    paddingTop: 12,
    display: 'block',

    '& p': {
      color: '#555',
      marginBottom: 5,

      '&.error': {
        color: '#f90000',
        fontWeight: 500,
        fontSize: 12
      }
    }
  },
  button: {
    textTransform: 'none',
    width: '100%',
    color: theme.palette.primary.dark,
    borderColor: theme.palette.primary.dark,
    '& svg': {
      marginRight: 8,
      fontSize: 16
    }
  },
  buttonError: {
    textTransform: 'none',
    width: '100%',
    color: '#f90000',
    borderColor: '#f90000',
    '& svg': {
      marginRight: 8,
      fontSize: 16
    }
  },
  buttonLoading: {
    textTransform: 'none',
    width: '100%',
    color: '#f90000',
    borderColor: '#f90000'
  },
  controls: {
    marginTop: 16,

    '& button': {
      width: '100%'
    }
  },
  loading: {
    textAlign: 'center',
    '&>span': {
      marginTop: 8,
      display: 'block'
    }
  },
  response: {
    marginTop: 24
  },
  info: {
    margin: '36px 0 24px'
  }
}));

export const ImportModal = ({
  open,
  onClose,
  loading,
  onUpload,
  response,
  error,
  nameOfFirstField,
  mainHeadline,
  fileName,
  fileNameKey
}) => {
  const classes = useStyles();
  const {t} = useTranslation();

  const handleUpload = (files) => {
    const formData = new FormData();
    formData.append(fileName, files.file1.files[0]);
    if (files.file2) {
      formData.append(fileNameKey, files.file2.files[0]);
    }
    onUpload(formData);
    onClose();
  };

  const getHeader = (status, file_name) => {
    switch (status) {
      case 'DONE':
        return (
          <span>
            {`${t('IMPORT_FILE.IMPORT_FILENAME', {name: file_name})} `}
            <span className={'success'}>{`${t('IMPORT_FILE.SUCCESSFULLY')} `}</span>
            {t('IMPORT_FILE.DONE')}.
          </span>
        );
      case 'BAD_FILE_STRUCTURE':
        return (
          <span>
            {`${t('IMPORT_FILE.IMPORT_FILENAME', {name: file_name})} ${t('IMPORT_FILE.DONE')} `}
            <span className={'danger'}>{t('IMPORT_FILE.BAD_FILE_STRUCTURE')}</span>.
          </span>
        );
      default:
        return (
          <span>
            {`${t('IMPORT_FILE.IMPORT_FILENAME', {name: file_name})} ${t('IMPORT_FILE.DONE')} `}
            <span className={'danger'}>{t('IMPORT_FILE.UNSUCCESSFULLY')}</span>.
          </span>
        );
    }
  };

  return (
    <ModalWrapper
      open={open}
      onClose={onClose}
      header={response ? getHeader(response.status, response.file_name) : mainHeadline}
    >
      <div className={classes.root}>
        {!response && !loading && (
          <UploadForm
            handleUpload={handleUpload}
            onClose={onClose}
            errorApi={error}
            nameOfFirstField={nameOfFirstField}
          />
        )}
      </div>
    </ModalWrapper>
  );
};

const UploadForm = ({ handleUpload, onClose, errorApi, nameOfFirstField }) => {
  const classes = useStyles();

  const [error, setError] = useState({
    file1: false,
    file2: false
  });
  const [files, setFiles] = useState({
    file1: undefined,
    file2: undefined
  });

  const validate = (name, file) => {
    if (file.size >= 10485760) {
      return t('VERIFY_MSG.MAX_FILE_SIZE', {size: 10});
    }
    if (
      name === 'file1' &&
      !file.name.endsWith('.xls') &&
      !file.name.endsWith('.xlsm') &&
      !file.name.endsWith('.xlsx') &&
      !file.name.endsWith('.xml')
    ) {
      return t('VERIFY_MSG.UNCORRECT_FORMAT');
    }
    if (name === 'file2' && !file.name.endsWith('.p7s')) {
      return t('VERIFY_MSG.UNCORRECT_FORMAT');
    }
    return undefined;
  };

  const selectFile = (name, target) => {
    if (target.files.length === 0) {
      setFiles((files) => ({ ...files, [name]: null }));
      return;
    }
    setError((files) => ({ ...files, [name]: validate(name, target.files[0]) }));
    setFiles((files) => ({ ...files, [name]: target }));
  };

  const getMessage = () => {
    if (errorApi?.response?.data?.detail && typeof errorApi?.response?.data?.detail === 'string') {
      return errorApi?.response?.data?.detail;
    }
    if (Array.isArray(errorApi?.response?.data?.detail)) {
      return errorApi?.response?.data?.detail.join('\n');
    }
    if (
      errorApi?.response?.data?.detail?.file_original &&
      typeof errorApi?.response?.data?.detail?.file_original === 'string'
    ) {
      return errorApi?.response?.data?.detail?.file_original;
    }
    if (
      errorApi?.response?.data?.detail?.file_original &&
      Array.isArray(errorApi?.response?.data?.detail?.file_original)
    ) {
      return errorApi?.response?.data?.detail?.file_original[0];
    }
    return JSON.stringify(errorApi?.response?.data?.detail);
  };

  return (
    <>
      {errorApi && <p className={'danger'}>{getMessage()}</p>}
      <input
        accept="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/xml,application/vnd.ms-excel.sheet.macroenabled.12"
        className={classes.input}
        id="contained-button-file"
        type="file"
        onChange={({ target }) => selectFile('file1', target)}
      />
      <label htmlFor="contained-button-file" className={classes.label}>
        <p>{nameOfFirstField}</p>
        <Button
          variant="outlined"
          component="span"
          className={Boolean(error.file1) ? classes.buttonError : classes.button}
        >
          {files.file1 ? <InsertDriveFileRounded /> : <BackupRounded />}
          {files.file1?.files[0].name || `${t('SELECT')}...`}
        </Button>
        {Boolean(error.file1) && <p className={'error'}>{error.file1}</p>}
      </label>
      <input
        accept="application/pkcs7-signature"
        className={classes.input}
        id="contained-button-file2"
        type="file"
        onChange={({ target }) => selectFile('file2', target)}
      />
      <label htmlFor="contained-button-file2" className={classes.label}>
        <p>{t('IMPORT_FILE.DIGITALLY_SIGNED_FILE')}</p>
        <Button
          variant="outlined"
          component="span"
          className={Boolean(error.file2) ? classes.buttonError : classes.button}
        >
          {files.file2 ? <InsertDriveFileRounded /> : <BackupRounded />}
          {files.file2?.files[0].name || `${t('SELECT')}...`}
        </Button>
        {Boolean(error.file2) && <p className={'error'}>{error.file2}</p>}
      </label>
      <div className={classes.controls}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Button
              variant="outlined"
              color={'primary'}
              disabled={Boolean(error.file1) || Boolean(error.file2) || !files.file1}
              onClick={() => handleUpload(files)}
            >
              {t('CONTROLS.DOWNLOAD')}
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button variant="outlined" onClick={onClose}>
              {t('CONTROLS.CANCEL')}
            </Button>
          </Grid>
        </Grid>
      </div>
    </>
  );
};
