import { ModalWrapper } from '../../../Modal/ModalWrapper';
import { useCallback, useMemo, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Grid, makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import InsertDriveFileRounded from '@mui/icons-material/InsertDriveFileRounded';
import NotInterestedRounded from '@mui/icons-material/NotInterestedRounded';
import VpnKeyRounded from '@mui/icons-material/VpnKeyRounded';
import { WhiteButton } from '../../../Theme/Buttons/WhiteButton';
import { GreenButton } from '../../../Theme/Buttons/GreenButton';
import { Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';

const accept = 'text/xml,application/pkcs7-signature';

const DragDropFiles = ({ open, handleClose, onUpload, maxCount = 100, maxSize = 25, keyMaxSize }) => {
  const { t } = useTranslation();
  const classes = useDNDStyles();
  const [files, setFiles] = useState([]);

  const onClose = () => {
    setFiles([]);
    handleClose();
  };

  const onDrop = useCallback(
    (acceptedFiles) => {
      setFiles([...files, ...acceptedFiles]);
    },
    [files]
  );

  const validatorFiles = (file) => {
    if (files.find((f) => f.name === file.name)) {
      return {
        code: 'file-duplicate-name',
        message: t('VERIFY_MSG.THE_FILE_ALREADY_UPLOADED')
      };
    }
    if (keyMaxSize && file.type === 'application/pkcs7-signature' && file.size > 35 * 1024) {
      return {
        code: 'file-key-size-exceeded',
        message: t('IMPORT_FILE.FILE_KEY_SIZE_EXCEEDED')
      };
    }
    return null;
  };

  const { getRootProps, getInputProps, isDragAccept, isDragReject, fileRejections } = useDropzone({
    accept,
    onDrop,
    validator: validatorFiles
  });

  const sumSize = useMemo(() => files.reduce((a, b) => a + b.size, 0), [files]);

  const disableUpload =
    sumSize > maxSize * 1_048_576 ||
    files.length > maxCount ||
    files.filter((f) => f.type === 'application/pkcs7-signature')?.length >
      files.filter((f) => f.type === 'text/xml')?.length;

  const getErrorText = (errorCode) => {
    switch (errorCode) {
      case 'file-invalid-type':
        return t('VERIFY_MSG.FILE_INVALID_TYPE');
      case 'too-many-files':
        return t('VERIFY_MSG.TOO_MANY_FILES');
      case 'file-duplicate-name':
        return t('VERIFY_MSG.THE_FILE_ALREADY_UPLOADED');
      case 'file-key-size-exceeded':
        return t('IMPORT_FILE.FILE_KEY_SIZE_EXCEEDED');
      default:
        return '';
    }
  };

  const handleUpload = () => {
    const formData = new FormData();
    files.forEach((file) => formData.append('files_original', file));
    onUpload(formData);
    setFiles([]);
    handleClose();
  };

  return (
    <ModalWrapper open={open} maxWidth={'lg'} header={t('IMPORT_FILE.IMPORT_OR_DROP_DOWN_FILE')} onClose={onClose}>
      <div
        {...getRootProps()}
        className={clsx(classes.root, isDragAccept && classes.active, isDragReject && classes.reject)}
      >
        <input {...getInputProps()} accept={accept} />
        {isDragReject && (
          <div className={classes.error}>
            <span>
              <NotInterestedRounded />
            </span>
          </div>
        )}
        {files.length === 0 ? (
          <div className={classes.empty}>
            <p>{t('IMPORT_FILE.DROP_A_FILE')}</p>
          </div>
        ) : (
          <div className={classes.files}>
            <Grid container spacing={3}>
              {files.map((file, index) => (
                <Grid item xs={3} key={index}>
                  <div className={classes.file}>
                    {file?.name?.endsWith('.p7s') ? <VpnKeyRounded /> : <InsertDriveFileRounded />}
                    <span>{file?.name}</span>
                  </div>
                </Grid>
              ))}
            </Grid>
          </div>
        )}
      </div>
      {sumSize > 0.7 * maxSize * 1_048_576 || files.length > maxCount ? (
        <div className={classes.status} style={{ color: 'red' }}>
          <div>{sumSize > maxSize * 1_048_576 && t('VERIFY_MSG.MAX_TOTAL_SIZE_OF_FILES_MB', {size: maxSize})}</div>
          <div>{files.length > maxCount && t('VERIFY_MSG.MAX_FILES_COUNT', { count: maxCount })}</div>
        </div>
      ) : (
        <div
          className={classes.status}
          style={{ color: sumSize > 0.7 * maxSize * 1_048_576 || files.length > maxCount * 0.7 ? '#F2AF16' : '#00AA00' }}
        >
          {t('IMPORT_FILE.UPLOADED_FILES_SIZE_AND_COUNT', {
            size: (sumSize / 1_048_576).toFixed(2),
            maxSize,
            filesCount: files?.length,
            maxCount
          })}
        </div>
      )}
      {fileRejections.length > 0 && (
        <div
          style={{
            color: '#dd0000',
            paddingTop: 4
          }}
        >
          {getErrorText(fileRejections[0].errors[0].code)}
        </div>
      )}
      {files.length > 0 && (
        <Stack direction={'row'} sx={{ pt: 3 }} justifyContent={'space-between'} spacing={1}>
          <WhiteButton onClick={() => setFiles([])}>{t('CLEAN')}</WhiteButton>
          <GreenButton onClick={handleUpload} disabled={disableUpload}>
            {t('CONTROLS.DOWNLOAD')}
          </GreenButton>
        </Stack>
      )}
    </ModalWrapper>
  );
};

export default DragDropFiles;

export const useDNDStyles = makeStyles((theme) => ({
  root: {
    position: 'relative',
    width: 540,
    height: 347,
    maxWidth: '100%',
    maxHeight: 347,
    marginTop: 12,
    border: '3px dashed #7787ff',
    borderRadius: 16,
    cursor: 'pointer',
    userSelect: 'none',
    backgroundColor: '#f5f6ff',
    background: 'repeating-linear-gradient(135deg,#f5f6ff, #f5f6ff 20px, #ffffff 20px, #ffffff 40px)'
  },
  active: {
    background: 'repeating-linear-gradient(135deg,#e0f5e1, #e0f5e1 20px, #ffffff 20px, #ffffff 40px)',
    animation: `$active 5s infinite linear`,
    backgroundRepeat: 'repeat',
    border: '3px dashed #77f587'
  },
  reject: {
    background: 'repeating-linear-gradient(135deg,#f5e0e1, #f5e0e1 20px, #ffffff 20px, #ffffff 40px)',
    animation: `$active 5s infinite linear`,
    backgroundRepeat: 'repeat',
    border: '3px dashed #f57787'
  },
  empty: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    '&>p': {
      margin: 10,
      fontWeight: 700,
      fontSize: 15,
      color: '#7777aa'
    }
  },
  error: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    backdropFilter: 'blur(2px)',
    '& svg': {
      fontSize: 42,
      color: '#f57787'
    },
    '& p': {
      margin: '0 8px',
      fontWeight: 700,
      fontSize: 15,
      color: '#f57787'
    }
  },
  files: {
    padding: 12,
    maxHeight: 340,
    overflowX: 'hidden'
  },
  status: {
    color: theme.palette.text.main,
    fontSize: 15,
    fontWeight: 700,
    paddingTop: 4
  },
  file: {
    textAlign: 'center',
    '& svg': {
      fontSize: 36,
      color: theme.palette.primary.main
    },
    '&>span': {
      display: 'block',
      maxWidth: '100%',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      color: theme.palette.text.main,
      fontSize: 11,
      fontWeight: 500
    }
  },
  '@keyframes active': {
    from: { backgroundPosition: '0 0' },
    to: { backgroundPosition: '0 -345px' }
  }
}));
