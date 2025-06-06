import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import makeStyles from '@material-ui/core/styles/makeStyles';
import BackupRounded from '@mui/icons-material/BackupRounded';
import InsertDriveFileRounded from '@mui/icons-material/InsertDriveFileRounded';
import { noop } from 'lodash';
import { useState } from 'react';

import { ReactComponent as Logo } from '../../../../images/logo_bg.svg';
import { ModalWrapper } from '../../../../Components/Modal/ModalWrapper';
import { getEnv } from '../../../../util/getEnv';
import { Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '500px',
    maxWidth: '100%',
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

const mimeTypes = {
  '.xls': 'application/vnd.ms-excel',
  '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  '.xml': 'text/xml',
  '.xlsm': 'application/vnd.ms-excel.sheet.macroenabled.12',
  '.zip': 'application/zip',
  '.rar': 'application/vnd.rar',
  '.png': 'image/png',
  '.pdf': 'application/pdf',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.doc': 'application/msword',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  '.txt': 'text/plain'
};

export const ImportModal = ({
  text,
  open,
  onClose,
  loading,
  onUpload,
  response,
  error,
  canUploadWithoutKey = getEnv().env === 'dev',
  types = ['.xls', '.xlsx', '.xlsm', '.xml', '.zip', '.rar', '.txt', '.pdf', '.doc', '.docx', '.png', '.jpg', '.jpeg']
}) => {
  const { t } = useTranslation();
  const classes = useStyles();

  const handleUpload = (files) => {
    const formData = new FormData();
    formData.append('file_original', files.file1.files[0]);
    if (files.file2) {
      formData.append('file_original_key', files.file2.files[0]);
    }
    onUpload(formData);
  };

  const getHeader = (status, file_name) => {
    switch (status) {
      case 'DONE':
        return (
          <span>
            {`${t('IMPORT_FILE.IMPORT_FILENAME', { name: file_name })} `}
            <span className={'success'}>{t('IMPORT_FILE.SUCCESSFULLY')} </span>
            {t('IMPORT_FILE.DONE')}.
          </span>
        );
      case 'BAD_FILE_STRUCTURE':
        return (
          <span>
            {`${t('IMPORT_FILE.IMPORT_FILENAME', { name: file_name })} ${t('IMPORT_FILE.DONE')} `}
            <span className={'danger'}>{t('IMPORT_FILE.BAD_FILE_STRUCTURE')}</span>.
          </span>
        );
      default:
        return (
          <span>
            {`${t('IMPORT_FILE.IMPORT_FILENAME', { name: file_name })} ${t('IMPORT_FILE.DONE')} `}
            <span className={'danger'}>{t('IMPORT_FILE.UNSUCCESSFULLY')}</span>.
          </span>
        );
    }
  };

  return (
    <ModalWrapper
      open={open}
      onClose={!loading ? onClose : noop}
      header={response ? getHeader(response.status, response.file_name) : t('IMPORT_FILE_FOE_DISPUTE')}
    >
      <div className={classes.root}>
        {text && (
          <Typography variant={'body2'} style={{ color: '#555555' }}>
            {text}
          </Typography>
        )}
        {!loading && (
          <UploadForm
            handleUpload={handleUpload}
            onClose={onClose}
            errorApi={error}
            canUploadWithoutKey={canUploadWithoutKey}
            types={types}
          />
        )}
        {loading && <LoadingForm />}
      </div>
    </ModalWrapper>
  );
};

const LoadingForm = () => {
  const { t } = useTranslation();
  const classes = useStyles();
  return (
    <div className={classes.loading}>
      <Logo className={'pulse'} width={110} data-marker={'Loader_mask--logo'} />
      <span>{t('PROCESSING_FILES')}...</span>
    </div>
  );
};

const UploadForm = ({ handleUpload, onClose, errorApi, canUploadWithoutKey, types }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const acceptTypes = Object.keys(mimeTypes).filter((ext) => types?.includes(ext));

  const [error, setError] = useState({
    file1: false
  });
  const [files, setFiles] = useState({
    file1: undefined
  });

  const validate = (name, file) => {
    if (file.size >= 20971520) {
      return t('VERIFY_MSG.MAX_FILE_SIZE', { size: 20 });
    }
    if (name === 'file1' && types && acceptTypes.filter((ext) => file.name.endsWith(ext)).length === 0) {
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
        accept={acceptTypes.join(',')}
        className={classes.input}
        id="contained-button-file"
        type="file"
        onChange={({ target }) => selectFile('file1', target)}
      />
      <label htmlFor="contained-button-file" className={classes.label}>
        <p>{t('FILE_WITH_DISPUTE')}</p>
        <Button variant="outlined" component="span" className={error.file1 ? classes.buttonError : classes.button}>
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
        <Button variant="outlined" component="span" className={error.file2 ? classes.buttonError : classes.button}>
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
              disabled={
                Boolean(error.file1) || Boolean(error.file2) || !files.file1 || !(canUploadWithoutKey || files.file2)
              }
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
