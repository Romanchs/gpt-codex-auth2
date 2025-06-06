import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import makeStyles from '@material-ui/core/styles/makeStyles';
import PublishRounded from '@mui/icons-material/PublishRounded';
import * as moment from 'moment';
import {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigate, useParams} from 'react-router-dom';

import {
  clearPpkoDocumentResult,
  getPpkoById,
  savePpkoDocument,
  uploadPpkoDocument,
  uploadPpkoDocumentFile
} from '../../../actions/ppkoActions';
import Page from '../../Global/Page';
import {ModalWrapper} from '../../Modal/ModalWrapper';
import CircleButton from '../../Theme/Buttons/CircleButton';
import {LightTooltip} from '../../Theme/Components/LightTooltip';
import DatePicker from '../../Theme/Fields/DatePicker';
import StyledInput from '../../Theme/Fields/StyledInput';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles(() => ({
  root: {
    position: 'relative'
  },
  labelFile: {
    position: 'relative',
    width: '100%',
    height: '100%',
    display: 'block'
  },
  buttonFile: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: '50%',
    display: 'block',
    top: 0,
    left: 0,
    minWidth: 'auto'
  },
  controls: {
    marginTop: 16,

    '& button': {
      width: '100%'
    }
  },
  bodyInput: {
    position: 'relative',
    '&>svg': {
      position: 'absolute',
      right: 16,
      top: '50%',
      transform: 'translate(0, -75%)',
      color: '#223B82',
      cursor: 'pointer'
    }
  }
}));

const PpkoDocumentEdit = () => {
  const {t} = useTranslation();
  const classes = useStyles();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {selectedPpko, uploadDocumentResult, error, uploadDocumentLoading} = useSelector(
    ({ppko}) => ppko
  );
  const [openDialog, setOpenDialog] = useState(false);
  const [inputFile, setInputFile] = useState({
    file: null,
    value: null,
    accept: null,
    type: null
  });
  const [errors, setErrors] = useState({});
  const [result, setResult] = useState(null);
  const {id: ppkoId} = useParams();
  const {activeRoles} = useSelector(({user}) => user);

  useEffect(() => {
    if (!selectedPpko) {
      dispatch(getPpkoById(ppkoId));
    }
  }, [dispatch, ppkoId, activeRoles, selectedPpko]);

  useEffect(() => {
    if (!uploadDocumentResult) {
      dispatch(
        selectedPpko?.data?.ra_contract ? uploadPpkoDocument(selectedPpko?.data.ra_contract) : clearPpkoDocumentResult()
      );
    }
  }, [dispatch, selectedPpko]);

  useEffect(() => {
    setErrors({
      information_contract_start_date: error?.response?.data?.information_contract_start_date,
      information_contract_end_date: error?.response?.data?.information_contract_end_date
    });
  }, [error]);

  useEffect(() => {
    if (uploadDocumentResult) {
      setResult({...uploadDocumentResult});
    }
  }, [dispatch, uploadDocumentResult]);

  const handleChangeFile = (event, field, type) => {
    setResult({
      ...result,
      [`${type}_filename`]: event?.files[0]?.name ? event?.files[0]?.name : null
    });
    dispatch(uploadPpkoDocumentFile(event, type, event?.files[0]?.name));
    setOpenDialog(false);
  };

  const handleOpenModal = (value, type, accept) => {
    setInputFile({
      value: value,
      type: type,
      accept: accept
    });
    setOpenDialog(true);
  };

  const handleChangeText = (value, name) => {
    setResult({
      ...result,
      [name]: value
    });
  };

  const handleSaveFile = () => {
    const obj = {
      ...result,
      information_contract_end_date: result?.information_contract_end_date
        ? result?.information_contract_end_date
        : null,
      information_contract_start_date: result?.information_contract_start_date
        ? result?.information_contract_start_date
        : null,
      ra: uploadDocumentResult?.ra || ppkoId
    };

    dispatch(savePpkoDocument(obj, uploadDocumentResult?.id, () => navigate(`/ppko/documentation/${ppkoId}`)));
  };

  const handleRemoveFile = () => {
    setInputFile({...inputFile, file: null, value: null});
    setResult({...result, [`${inputFile.type}_filename`]: null, [`${inputFile.type}_fileid`]: null});
    setOpenDialog(false);
  };

  const handleDisabled = () => {
    return (
      Boolean(Object.values(errors).filter((i) => i).length) ||
      error?.response?.data?.details?.includes(t('FIELDS.FILE_TYPE')) ||
      uploadDocumentLoading
    );
  };

  return (
    <Page
      pageName={t('PAGES.PPKO_DOCUMENTATIONS')}
      backRoute={`/ppko/${ppkoId}`}
      loading={uploadDocumentLoading}
      controls={
        <CircleButton type={'create'} title={t('CONTROLS.SAVE')} onClick={handleSaveFile} disabled={handleDisabled()}/>
      }
    >
      <div className={'ppko-form'}>
        <section>
          <h4>{t('REGISTRATION_DATA')}</h4>
          <div className={'form-section'}>
            <Grid container spacing={3}>
              <Grid
                item
                xs={4}
                onClick={() =>
                  handleOpenModal(result?.readiness_inspection_report_filename, 'readiness_inspection_report', '.p7s')
                }
                className={classes.bodyInput}
              >
                <TextField
                  label={t('PPKO_DOCS.READINESS_INSPECTION_REPORT')}
                  dataMarker={'readiness_inspection_report_filename'}
                  value={result?.readiness_inspection_report_filename}
                  disabled={true}
                  error={error?.response?.data?.readiness_inspection_report_filename}
                />
                <PublishRounded
                  data-marker={'upload__readiness_inspection_report_filename'}
                  size={'small'}
                  title={t('CONTROLS.DOWNLOAD_FILE')}
                />
              </Grid>
              <Grid
                item
                xs={4}
                onClick={() => handleOpenModal(result?.information_contract_filename, 'information_contract', '.p7s')}
                className={classes.bodyInput}
              >
                <TextField
                  label={t('PPKO_DOCS.INFORMATION_CONTACT')}
                  dataMarker={'information_contract_filename'}
                  value={result?.information_contract_filename}
                  disabled={true}
                  error={error?.response?.data?.information_contract_filename}
                />
                <PublishRounded
                  data-marker={'upload__information_contract_filename'}
                  size={'small'}
                  title={t('CONTROLS.DOWNLOAD_FILE')}
                />
              </Grid>
              <Grid
                item
                xs={4}
                onClick={() =>
                  handleOpenModal(result?.readiness_protocol_filename, 'readiness_protocol', '.p7s,.doc,.docx')
                }
                className={classes.bodyInput}
              >
                <TextField
                  label={t('PPKO_DOCS.READINESS_PROTOCOL')}
                  value={result?.readiness_protocol_filename}
                  dataMarker={'readiness_protocol_filename'}
                  disabled={true}
                  error={error?.response?.data?.readiness_protocol_filename}
                />
                <PublishRounded
                  data-marker={'upload__readiness_protocol_filename'}
                  size={'small'}
                  title={t('CONTROLS.DOWNLOAD_FILE')}
                />
              </Grid>
              <Grid item xs={4}>
                <Picker
                  label={t('PPKO_DOCS.INFORMATION_CONTRACT_START_DATE')}
                  value={result?.information_contract_start_date}
                  maxDate={result?.information_contract_end_date}
                  onChange={(v) => {
                    setErrors({...errors, information_contract_start_date: null});
                    setResult({
                      ...result,
                      information_contract_start_date: v
                    });
                  }}
                  error={error?.response?.data?.information_contract_start_date}
                />
              </Grid>
              <Grid item xs={4}>
                <Picker
                  label={t('PPKO_DOCS.INFORMATION_CONTRACT_END_DATE')}
                  value={result?.information_contract_end_date}
                  minDate={result?.information_contract_start_date}
                  onChange={(v) => {
                    setErrors({...errors, information_contract_end_date: null});
                    setResult({
                      ...result,
                      information_contract_end_date: v
                    });
                  }}
                  error={error?.response?.data?.information_contract_end_date}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  label={t('PPKO_DOCS.INFORMATION_CONTRACT_NO')}
                  value={result?.information_contract_no}
                  onChange={handleChangeText}
                  name={'information_contract_no'}
                  error={error?.response?.data?.information_contract_no}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label={t('PPKO_DOCS.NOTE')}
                  value={result?.note}
                  max={500}
                  multiline
                  onChange={handleChangeText}
                  name={'note'}
                  error={error?.response?.data?.note}
                />
              </Grid>
            </Grid>
          </div>
        </section>
      </div>
      <ModalWrapper
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        header={t('IMPORT_FILE.SELECT_FILE_FOR_IMPORT')}
        maxWidth={'xl'}
      >
        <Grid container spacing={1} style={{marginTop: 24}}>
          <Grid item xs={12}>
            <Grid container spacing={1}>
              <Grid item xs={10}>
                <TextField
                  value={inputFile.value}
                  disabled={true}
                  label={t('IMPORT_FILE.SELECT_FILE_FORMAT', {format: inputFile.accept})}
                  dataMarker={'upload__field'}
                />
              </Grid>
              <Grid item xs={1}>
                <CircleButton type={'delete'} size={'medium'} title={t('CONTROLS.DELETE_FILE')} onClick={handleRemoveFile}/>
              </Grid>
              <Grid item xs={1}>
                <input
                  accept={inputFile.accept}
                  id={'inputFile'}
                  type="file"
                  onChange={({target}) => setInputFile({...inputFile, file: target, value: target.files[0].name})}
                />
                <label htmlFor={'inputFile'} className={classes.labelFile}>
                  <CircleButton type={'search'} size={'medium'} title={t('CONTROLS.CHOOSE_FILE')} dataMarker={'upload__btn'}/>
                  <LightTooltip title={t('CONTROLS.CHOOSE_FILE')} placement="top" arrow>
                    <Button component="span" className={classes.buttonFile}></Button>
                  </LightTooltip>
                </label>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <div className={classes.controls}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Button variant="outlined" onClick={() => setOpenDialog(false)}>
                    {t('CONTROLS.CANCEL')}
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    variant="outlined"
                    color={'primary'}
                    onClick={() =>
                      handleChangeFile(inputFile.file, inputFile.field ? inputFile.field : null, inputFile.type)
                    }
                  >
                    {t('CONTROLS.DOWNLOAD')}
                  </Button>
                </Grid>
              </Grid>
            </div>
          </Grid>
        </Grid>
      </ModalWrapper>
    </Page>
  );
};

const TextField = ({onChange, value, name, ...props}) => {
  return <StyledInput {...props} onChange={({target}) => onChange(target.value, name)} value={value}/>;
};

const Picker = ({onChange, value, ...props}) => {
  const handleOnChange = (v) => {
    if (v && moment(v).isValid()) {
      onChange(moment(v));
    }
    if (!v) {
      onChange(null);
    }
  };

  return <DatePicker {...props} value={value ? moment(value) : null} onChange={handleOnChange}/>;
};

export default PpkoDocumentEdit;
