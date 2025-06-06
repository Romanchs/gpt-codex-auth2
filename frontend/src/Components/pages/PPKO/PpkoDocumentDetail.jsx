import { Grid } from '@material-ui/core';
import makeStyles from '@material-ui/core/styles/makeStyles';
import EditRounded from '@mui/icons-material/EditRounded';
import GetAppRounded from '@mui/icons-material/GetAppRounded';
import * as moment from 'moment';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import {
  clearPpkoDocumentResult,
  downloadPpkoDocumentFile,
  getPpkoById,
  uploadPpkoDocument
} from '../../../actions/ppkoActions';
import Page from '../../Global/Page';
import CircleButton from '../../Theme/Buttons/CircleButton';
import StyledInput from '../../Theme/Fields/StyledInput';
import { useTranslation } from 'react-i18next';
import i18n from '../../../i18n/i18n';
import useExportFileLog from '../../../services/actionsLog/useEportFileLog';

const {t} = i18n;

const useStyles = makeStyles(() => ({
  bodyInput: {
    position: 'relative',
    '&>svg': {
      position: 'absolute',
      right: 16,
      top: '50%',
      transform: 'translate(0, -50%)',
      color: '#223B82',
      cursor: 'pointer'
    }
  }
}));

const PpkoDocumentDetail = () => {
  const {t} = useTranslation();
  const classes = useStyles();
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();
  const [accordion, setAccordion] = useState([]);
  const { selectedPpko, uploadDocumentResult, uploadDocumentLoading, loading } = useSelector(({ ppko }) => ppko);
  const { activeRoles } = useSelector(({ user }) => user);
  const exportFileLog = useExportFileLog(['Документація ППКО']);

  useEffect(() => {
    if (!selectedPpko) {
      dispatch(getPpkoById(id));
    }
  }, [dispatch, id, activeRoles, selectedPpko]);

  useEffect(() => {
    dispatch(
      selectedPpko?.data?.ra_contract ? uploadPpkoDocument(selectedPpko?.data.ra_contract) : clearPpkoDocumentResult()
    );
  }, [dispatch, selectedPpko]);

  useEffect(() => {
    if (uploadDocumentResult) {
      setAccordion(getList(uploadDocumentResult));
    } else {
      setAccordion(getList());
    }
  }, [uploadDocumentResult]);

  const handleDownloadFile = (id, name) => {
    dispatch(downloadPpkoDocumentFile(id, name));
    exportFileLog();
  };

  const handleEdit = () => {
    navigate(`/ppko/edit/documentation/${id}`);
  };

  return (
    <Page
      pageName={t('PAGES.PPKO_DOCUMENTATIONS')}
      backRoute={`/ppko/${id}`}
      loading={uploadDocumentLoading || loading}
      controls={
        <CircleButton
          title={t('CONTROLS.EDIT')}
          color={'green'}
          icon={<EditRounded />}
          onClick={handleEdit}
          dataMarker={'edit'}
        />
      }
    >
      <div className={'boxShadow'} style={{ padding: '72px 24px 24px', position: 'relative', marginBottom: 24 }}>
        <h3
          style={{
            position: 'absolute',
            display: 'block',
            left: 0,
            top: 0,
            width: '100%',
            backgroundColor: '#223B82',
            borderRadius: '8px 8px 0 0',
            color: '#fff',
            padding: '16px 32px'
          }}
        >
          {t('REGISTRATION_DATA')}
        </h3>
        <Grid container spacing={3} alignItems={'center'}>
          {accordion.map((item, key) => (
            <Grid item xs={12} lg={item.wd} key={key} className={classes.bodyInput}>
              <StyledInput
                label={item.label}
                readOnly
                value={item.value ? item.value : '---'}
                dataMarker={item.dataMarkerInput}
              />
              {item.download && item.value && (
                <GetAppRounded
                  data-marker={item.dataMarkerIcon}
                  size={'small'}
                  onClick={() => handleDownloadFile(item.id, item.value)}
                  title={t('CONTROLS.DOWNLOAD_FILE')}
                />
              )}
            </Grid>
          ))}
        </Grid>
      </div>
    </Page>
  );
};

export default PpkoDocumentDetail;

const getList = (data) => {
  return [
    {
      label: `${t('PPKO_DOCS.READINESS_INSPECTION_REPORT')}:`,
      value: data?.readiness_inspection_report_filename,
      download: true,
      id: data?.readiness_inspection_report_fileid,
      wd: 4,
      dataMarkerIcon: 'download__readiness_inspection_report_filename',
      dataMarkerInput: 'readiness_inspection_report_filename'
    },
    {
      label: `${t('PPKO_DOCS.INFORMATION_CONTACT')}:`,
      value: data?.information_contract_filename,
      download: true,
      id: data?.information_contract_fileid,
      wd: 4,
      dataMarkerIcon: 'download__information_contract_filename',
      dataMarkerInput: 'information_contract_filename'
    },
    {
      label: `${t('PPKO_DOCS.READINESS_PROTOCOL')}:`,
      value: data?.readiness_protocol_filename,
      download: true,
      id: data?.readiness_protocol_fileid,
      wd: 4,
      dataMarkerIcon: 'download__readiness_protocol_filename',
      dataMarkerInput: 'readiness_protocol_filename'
    },
    {
      label: t('PPKO_DOCS.INFORMATION_CONTRACT_START_DATE'),
      value:
        data?.information_contract_start_date && moment(data?.information_contract_start_date).format('DD.MM.yyyy'),
      wd: 4,
      dataMarkerInput: 'information_contract_start_date'
    },
    {
      label: t('PPKO_DOCS.INFORMATION_CONTRACT_END_DATE'),
      value: data?.information_contract_end_date && moment(data?.information_contract_end_date).format('DD.MM.yyyy'),
      wd: 4,
      dataMarkerInput: 'information_contract_end_date'
    },
    {
      label: t('PPKO_DOCS.INFORMATION_CONTRACT_NO'),
      value: data?.information_contract_no,
      wd: 4,
      dataMarkerInput: 'information_contract_no'
    },
    {
      label: `${t('PPKO_DOCS.NOTES')}:`,
      value: data?.note,
      wd: 12,
      dataMarkerInput: 'note'
    }
  ];
};
