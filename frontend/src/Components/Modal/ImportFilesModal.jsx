import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import makeStyles from '@material-ui/core/styles/makeStyles';
import SearchIcon from '@mui/icons-material/SearchRounded';
import { noop } from 'lodash';
import PropTypes from 'prop-types';
import { useState } from 'react';

import { ReactComponent as Logo } from '../../images/logo_bg.svg';
import api from '../../util/api';
import { saveAsFile } from '../../util/files';
import { getEnv } from '../../util/getEnv';
import { BlueButton } from '../Theme/Buttons/BlueButton';
import { GreenButton } from '../Theme/Buttons/GreenButton';
import StyledInput from '../Theme/Fields/StyledInput';
import { ModalWrapper } from './ModalWrapper';
import { useTranslation } from 'react-i18next';
import { t } from 'i18next';

const ImportFilesModal = ({
  title,
  content,
  open,
  onClose,
  loading,
  onUpload,
  response,
  error,
  signKey,
  canUploadWithoutKey,
  customVerify
}) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const handleUpload = (files) => {
    const formData = new FormData();
    for (const name in files) {
      if (files[name]?.files[0]) {
        formData.append(name, files[name].files[0]);
      }
    }
    onUpload(formData);
  };

  const getHeader = (status, file_name) => {
    switch (status) {
      case 'DONE':
        return <span>{t('IMPORT_FILE.IMPORT_FILENAME_SUCCESSFULLY_DONE')}.</span>;
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
      header={response ? getHeader(response.status, response.file_name) : title}
      maxWidth={'lg'}
    >
      <div className={classes.root}>
        {!response && !loading && (
          <UploadForm
            content={content}
            handleUpload={handleUpload}
            onClose={onClose}
            errorApi={error}
            signKey={signKey}
            canUploadWithoutKey={canUploadWithoutKey}
            customVerify={customVerify}
            loading={loading}
          />
        )}
        {loading && <LoadingForm />}
        {response && <ResponseForm data={response} onClose={onClose} />}
      </div>
    </ModalWrapper>
  );
};

const LoadingForm = () => {
  const classes = useStyles();
  const { t } = useTranslation();
  return (
    <div className={classes.loading}>
      <Logo className={'pulse'} width={110} data-marker={'Loader_mask--logo'} />
      <span>{t('PROCESSING_FILES')}...</span>
    </div>
  );
};

const UploadForm = ({
  content,
  handleUpload,
  onClose,
  errorApi,
  signKey,
  canUploadWithoutKey,
  customVerify,
  loading
}) => {
  const [error, setError] = useState(Object.fromEntries(content.map((i) => [i.key, false])));
  const [files, setFiles] = useState(Object.fromEntries(content.map((i) => [i.key, null])));
  const types = Object.fromEntries(content.map((i) => [i.key, i.accept]));

  const validate = (name, file) => {
    if (customVerify) {
      const result = customVerify(file, name);
      if (result) return result;
    }
    if (file.size >= 26214400) {
      return t('VERIFY_MSG.MAX_FILE_SIZE', { size: 25 });
    }
    if (name === signKey) {
      if (!file.name.endsWith('.p7s')) {
        return t('VERIFY_MSG.UNCORRECT_FORMAT');
      }
      if (file.size > 40960) {
        return t('VERIFY_MSG.UNCORRECT_SIGNATURE');
      }
    } else if (name in types && types[name].split(',').filter((ext) => file.name.endsWith(ext)).length === 0) {
      return t('VERIFY_MSG.UNCORRECT_FORMAT');
    }
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
    if (errorApi?.response?.data?.detail && errorApi?.response?.data?.detail[signKey]) {
      if (typeof errorApi?.response?.data?.detail[signKey] === 'string') {
        return errorApi?.response?.data?.detail[signKey];
      }
      if (Array.isArray(errorApi?.response?.data?.detail[signKey])) {
        return errorApi?.response?.data?.detail[signKey][0];
      }
    }
    return JSON.stringify(errorApi?.response?.data?.detail);
  };

  return (
    <>
      {errorApi && <p className={'danger'}>{getMessage()}</p>}
      <Box style={{ marginTop: 40 }}>
        {content.map(({ label, key, accept }, index) => (
          <Box
            style={{ display: 'flex', minWidth: 540, gap: 24, marginBottom: index === content.length - 1 ? 16 : 24 }}
            key={key}
          >
            <StyledInput
              size={'small'}
              value={files[key]?.files[0]?.name}
              label={label}
              placeholder={`${t('IMPORT_FILE.SELECT_FILE')}...`}
              shrink={true}
              error={error?.response?.data?.detail[key] || error[key]}
              readOnly
            />
            <input
              accept={accept}
              id={`changeSupplier-${key}`}
              disabled={loading}
              type="file"
              onChange={({ target }) => selectFile(key, target)}
            />
            <label htmlFor={`changeSupplier-${key}`}>
              <BlueButton
                component="span"
                disabled={loading}
                style={{ whiteSpace: 'nowrap', padding: '11.25px 12px', borderRadius: 8 }}
              >
                <SearchIcon />
                {t('CONTROLS.CHOOSE_FILE')}
              </BlueButton>
            </label>
          </Box>
        ))}
      </Box>
      <Box style={{ display: 'flex', justifyContent: 'center', gap: 24, marginTop: 40 }}>
        <BlueButton style={{ minWidth: 204, textTransform: 'uppercase' }} onClick={onClose}>
          {t('CONTROLS.CANCEL')}
        </BlueButton>
        <GreenButton
          style={{ minWidth: 204, textTransform: 'uppercase' }}
          onClick={() => handleUpload(files)}
          disabled={Boolean(
            content.filter((i) => error[i.key]).length ||
              content.filter((i) => (canUploadWithoutKey && i.key === signKey ? false : !files[i.key])).length
          )}
        >
          {loading ? `${t('LOADING')}...` : t('CONTROLS.DOWNLOAD')}
        </GreenButton>
      </Box>
    </>
  );
};

const ResponseForm = ({ data, onClose }) => {
  const classes = useStyles();

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
            {`${t('IMPORT_FILE.UPLOADED_APS_COUNT_TO_SYSTEM')}:`}
            <span className={'success'}>{success}</span>
          </p>
          <p>
            {`${t('IMPORT_FILE.NUMBER_NECESSARY_TO_ADJUST_DATA')}:`}
            <span className={'danger'}>{failed}</span>
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

ImportFilesModal.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.array.isRequired,
  open: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onUpload: PropTypes.func.isRequired,
  response: PropTypes.object,
  error: PropTypes.object,
  signKey: PropTypes.string,
  canUploadWithoutKey: PropTypes.bool,
  customVerify: PropTypes.func
};

ImportFilesModal.defaultProps = {
  response: null,
  error: null,
  signKey: 'file_original_key',
  canUploadWithoutKey: getEnv().env === 'dev',
  customVerify: null
};

export { ImportFilesModal };

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
