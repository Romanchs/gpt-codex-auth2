import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import makeStyles from '@material-ui/core/styles/makeStyles';
import InsertDriveFileRounded from '@mui/icons-material/InsertDriveFileRounded';
import BackupRounded from '@mui/icons-material/BackupRounded';
import { noop } from 'lodash';
import { useState } from 'react';

import { ReactComponent as Logo } from '../../images/logo_bg.svg';
import api from '../../util/api';
import { saveAsFile } from '../../util/files';
import { getEnv } from '../../util/getEnv';
import { ModalWrapper } from './ModalWrapper';
import { useTranslation } from 'react-i18next';
import { t } from 'i18next';

export const useImportStyles = makeStyles((theme) => ({
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

const mimeTypes = {
  '.xls': 'application/vnd.ms-excel',
  '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  '.xml': 'text/xml',
  '.xlsm': 'application/vnd.ms-excel.sheet.macroenabled.12'
};

export const ImportTkoModal = ({
  open,
  onClose,
  loading,
  onUpload,
  response,
  error,
  canUploadWithoutKey = getEnv().env === 'dev',
  types = ['.xls', '.xlsx', '.xlsm'],
  customVerify
}) => {
  const classes = useImportStyles();
  const { t } = useTranslation();

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
            <span className={'success'}>{`${t('IMPORT_FILE.SUCCESSFULLY')} `}</span>
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
      header={response ? getHeader(response.status, response.file_name) : t('IMPORT_AP_FILES')}
    >
      <div className={classes.root}>
        {!response && !loading && (
          <UploadForm
            handleUpload={handleUpload}
            onClose={onClose}
            errorApi={error}
            canUploadWithoutKey={canUploadWithoutKey}
            types={types}
            customVerify={customVerify}
          />
        )}
        {loading && <LoadingForm />}
        {response && <ResponseForm data={response} onClose={onClose} />}
      </div>
    </ModalWrapper>
  );
};

const LoadingForm = () => {
  const classes = useImportStyles();
  const { t } = useTranslation();

  return (
    <div className={classes.loading}>
      <Logo className={'pulse'} width={110} data-marker={'Loader_mask--logo'} />
      <span>{t('PROCESSING_FILES')}...</span>
    </div>
  );
};

const UploadForm = ({ handleUpload, onClose, errorApi, canUploadWithoutKey, types, customVerify }) => {
  const classes = useImportStyles();
  const acceptTypes = Object.keys(mimeTypes).filter((ext) => types.includes(ext));

  const [error, setError] = useState({
    file1: false,
    file2: false
  });
  const [files, setFiles] = useState({
    file1: undefined,
    file2: undefined
  });

  const validate = (name, file) => {
    if (customVerify) {
      const result = customVerify(file, name);
      if (result) return result;
    }
    if (file.size >= 15000000) {
      return t('VERIFY_MSG.MAX_FILE_SIZE', { size: 15 });
    }
    if (name === 'file1' && acceptTypes.filter((ext) => file.name.endsWith(ext)).length === 0) {
      return t('VERIFY_MSG.UNCORRECT_FORMAT');
    }
    if (name === 'file2' && !file.name.endsWith('.p7s')) {
      return t('VERIFY_MSG.UNCORRECT_FORMAT');
    }
    if (name === 'file2' && file.size > 40960) {
      return t('VERIFY_MSG.UNCORRECT_SIGNATURE');
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
      {errorApi && <p className={'danger'}>{errorApi.detail?.file_original ?? errorApi.detail ?? getMessage()}</p>}
      <input
        accept={acceptTypes.join(',')}
        className={classes.input}
        id="contained-button-file"
        type="file"
        onChange={({ target }) => selectFile('file1', target)}
      />
      <label htmlFor="contained-button-file" className={classes.label}>
        <p>{t('IMPORT_FILE.FILE_WITH_AP_IN_FORMAT', { format: acceptTypes.join(', ') })}</p>
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

export const ResponseForm = ({ data, onClose }) => {
  const classes = useImportStyles();

  const { failed, uid, file_id, file_name, key_processed, success, summary, is_downloaded } = data;

  const handleDownload = () => {
    api.files
      .downloadByUid(file_id)
      .then((res) => {
        if (res.status === 200) {
          saveAsFile(res.data, file_name, res.headers['content-type'] || '');
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className={classes.response}>
      <Grid container spacing={2}>
        {/*<Grid item xs={8}>*/}
        {/*  {t('IMPORT_FILE.DIGITAL_SIGNATURE_VERIFICATION')}:*/}
        {/*</Grid>*/}
        {/*<Grid item xs={4} className={'text-right'}>*/}
        {/*  <p className={key_processed ? 'success' : 'danger'}>{key_processed ? t('SUCCESSFUL') : t('UNSUCCESSFUL')}</p>*/}
        {/*</Grid>*/}
        {summary > -1 && (
          <>
            <Grid item xs={8}>
              {t('IMPORT_FILE.TOTAL_RECORDS_IN_FILE')}:
            </Grid>
            <Grid item xs={4} className={'text-right'} data-marker="note-summary">
              {summary}
            </Grid>
          </>
        )}
        {success > -1 && (
          <>
            <Grid item xs={8}>
              {t('IMPORT_FILE.CORRECT_RECORDS')}:
            </Grid>
            <Grid item xs={4} className={'text-right'} data-marker="note-success">
              {success}
            </Grid>
          </>
        )}
        {failed > -1 && (
          <>
            <Grid item xs={8}>
              {t('IMPORT_FILE.INCORRECT_RECORDS')}:
            </Grid>
            <Grid item xs={4} className={'text-right'} data-marker="note-failed">
              {failed}
            </Grid>
          </>
        )}
        {is_downloaded && (
          <>
            <Grid item xs={8}>
              {t('IMPORT_FILE.FILE_DOWNLOADED')}:
            </Grid>
            <Grid item xs={4} className={'text-right'} data-marker="note-failed">
              {is_downloaded}
            </Grid>
          </>
        )}
      </Grid>
      {!key_processed && (
        <div className={classes.info}>
          <p className={'danger'}>{t('IMPORT_FILE.INVALID_DIGITAL_SIGNATURE')}.</p>
          <br />
          <p>{t('IMPORT_FILE.DIGITAL_SIGNATURE_VERIFICATION_AND_RELOAD')}.</p>
        </div>
      )}
      {key_processed && failed > 0 && (
        <div className={classes.info}>
          <p>
            {`${t('IMPORT_FILE.UPLOADED_APS_COUNT_TO_SYSTEM')}:`} <span className={'success'}>{success}</span>
          </p>
          <p>
            {`${t('IMPORT_FILE.NUMBER_NECESSARY_TO_ADJUST_DATA')}:`} <span className={'danger'}>{failed}</span>
          </p>
          <br />
          <p>{t('IMPORT_FILE.CREATE_LIST_ENTRIES_PATCH_RE_UPLOAD_DATA')}</p>
        </div>
      )}
      <div className={classes.controls}>
        <Grid container spacing={2} justifyContent={'center'}>
          {Boolean(uid) && Number(summary) > 0 && (
            <Grid item xs={12}>
              <Button variant="outlined" color={'primary'} onClick={handleDownload}>
                {t('CONTROLS.DOWNLOAD_DATA_IMPORT_RESULT')}
              </Button>
            </Grid>
          )}
          <Grid item xs={12}>
            <Button variant="outlined" onClick={onClose}>
              {t('CONTROLS.CLOSE')}
            </Button>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};
