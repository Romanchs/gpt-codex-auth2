import makeStyles from '@material-ui/core/styles/makeStyles';
import SearchIcon from '@mui/icons-material/SearchRounded';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { getTSList, tsDialogOpen, uploadTSFile, uploadTSFileClear } from '../../../actions/timeSeriesActions';
import { ReactComponent as Logo } from '../../../images/logo_bg.svg';
import { getEnv } from '../../../util/getEnv';
import { ModalWrapper } from '../../Modal/ModalWrapper';
import TimeSeriesTable from '../../Tables/TimeSeriesTable';
import { BlueButton } from '../../Theme/Buttons/BlueButton';
import { GreenButton } from '../../Theme/Buttons/GreenButton';
import StyledInput from '../../Theme/Fields/StyledInput';
import { Box } from '@mui/material';
import i18n from '../../../i18n/i18n';
import { useTranslation } from 'react-i18next';
import useImportFileLog from '../../../services/actionsLog/useImportFileLog';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: 16
  },
  label: {
    width: '100%',
    marginTop: 8,
    display: 'block',
    paddingTop: 12,
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
  loading: {
    textAlign: 'center',
    marginTop: 16,
    minWidth: 480,
    '&>span': {
      marginTop: 8,
      display: 'block'
    }
  }
}));

const mimeTypes = {
  '.xls': 'application/vnd.ms-excel',
  '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  '.xml': 'text/xml',
  '.xlsm': 'application/vnd.ms-excel.sheet.macroenabled.12'
};

const dialogState = {
  upload: 0,
  failure: -1,
  success: 1
};

const getHeader = (state) => {
  switch (state) {
    case dialogState.upload:
      return i18n.t('IMPORT_FILE_WITH_DKO');
    case dialogState.success:
      // return `Імпорт файлу ${fileName} успішно виконано`;
      return i18n.t('IMPORT_FILE.FILE_WAS_SUCCESSFULLY_IMPORTED');
    case dialogState.failure:
      // return `Імпорт файлу ${fileName} не виконано`;
      return i18n.t('IMPORT_FILE.FILE_IMPORT_FAILED');
    default:
      return i18n.t('IMPORT_FILE_WITH_DKO');
  }
};

const TimeSeriesDialog = ({
  open,
  loading,
  response,
  params,
  error,
  types = ['.xls', '.xlsx'],
  canUploadWithoutKey = getEnv().env === 'dev'
}) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [state, setState] = useState(dialogState.upload);
  const [fileName, setFileName] = useState('');
  const importLog = useImportFileLog();

  useEffect(() => {
    if (!response) {
      return setState(dialogState.upload);
    }
    if (response?.success) {
      return setState(dialogState.success);
    } else {
      return setState(dialogState.failure);
    }
  }, [response]);

  const handleClose = () => {
    dispatch(tsDialogOpen(false));
    setTimeout(() => dispatch(uploadTSFileClear()), 150);
    if (state === dialogState.failure || state === dialogState.success || !!error) {
      dispatch(getTSList(params));
      setState(dialogState.upload);
    }
  };

  const handleUpload = (files) => {
    setFileName(files.file1.files[0].name);
    const formData = new FormData();
    formData.append('file_original', files.file1.files[0]);
    if (files.file2) {
      formData.append('file_original_key', files.file2.files[0]);
    }
    dispatch(uploadTSFile(formData));
    importLog();
  };

  return (
    <ModalWrapper open={open} onClose={handleClose} header={getHeader(state, fileName)} maxWidth={'lg'}>
      <div className={classes.root}>
        {!response && !loading && (
          <UploadForm
            handleUpload={handleUpload}
            onClose={handleClose}
            errorApi={error}
            canUploadWithoutKey={canUploadWithoutKey}
            types={types}
          />
        )}
        {loading && <LoadingForm />}
        {response && <ResponseForm data={response?.data || []} onClose={handleClose} />}
      </div>
    </ModalWrapper>
  );
};

const LoadingForm = () => {
  const classes = useStyles();
  return (
    <div className={classes.loading}>
      <Logo className={'pulse'} width={200} data-marker={'Loader_mask--logo'} />
      <span>{i18n.t('PROCESSING_FILES')}...</span>
    </div>
  );
};

const UploadForm = ({ handleUpload, onClose, errorApi, canUploadWithoutKey, types }) => {
  const { t } = useTranslation();
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
    if (file.size >= 26214400) {
      return t('VERIFY_MSG.MAX_FILE_SIZE', { size: 25 });
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
    return null;
  };
  const selectFile = (name, target) => {
    if (target.files.length === 0) {
      setFiles((files) => ({ ...files, [name]: null }));
      return;
    }
    setError((files) => ({ ...files, [name]: validate(name, target.files[0]) }));
    setFiles((files) => ({ ...files, [name]: target }));
  };

  return (
    <>
      <Box style={{ marginTop: 40 }}>
        {[
          {
            label: t('IMPORT_FILE.SELECT_FILE_DKO') + acceptTypes.map((ext) => ext.substring(1)).join(', '),
            key: 'file1',
            name: 'file_original',
            accept: acceptTypes.join(', ')
          },
          {
            label: t('IMPORT_FILE.SELECT_DIGITAL_SIGNATURE_FILE'),
            key: 'file2',
            name: 'file_original_key',
            accept: 'application/pkcs7-signature'
          }
        ].map(({ label, key, name, accept }, index, arr) => (
          <Box
            style={{ display: 'flex', minWidth: 540, gap: 24, marginBottom: index === arr.length - 1 ? 16 : 24 }}
            key={key}
          >
            <StyledInput
              size={'small'}
              value={files[key]?.files[0]?.name}
              label={label}
              placeholder={`${t('IMPORT_FILE.SELECT_FILE')}...`}
              shrink={true}
              error={error?.response?.data?.detail[key] || error[key] || (errorApi && errorApi[name])}
              readOnly
            />
            <input
              accept={accept}
              id={`contained-button-file${index}`}
              type="file"
              onChange={({ target }) => selectFile(key, target)}
            />
            <label htmlFor={`contained-button-file${index}`}>
              <BlueButton component="span" style={{ whiteSpace: 'nowrap', padding: '11.25px 12px', borderRadius: 8 }}>
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
          disabled={
            Boolean(error.file1) || Boolean(error.file2) || !files.file1 || !(canUploadWithoutKey || files.file2)
          }
        >
          {t('CONTROLS.DOWNLOAD')}
        </GreenButton>
      </Box>
    </>
  );
};

const ResponseForm = ({ data, onClose }) => {
  return (
    <>
      <TimeSeriesTable responseData={data} />
      <Box sx={{ pt: '40px' }}>
        <GreenButton onClick={onClose}>{i18n.t('CONTROLS.CONTINUE')}</GreenButton>
      </Box>
    </>
  );
};

export default TimeSeriesDialog;
