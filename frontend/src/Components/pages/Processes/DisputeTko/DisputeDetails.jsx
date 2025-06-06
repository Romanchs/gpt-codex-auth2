import Grid from '@material-ui/core/Grid';
import moment from 'moment';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import {
  deleteFileDisputeDetails,
  getDisputeTko,
  uploadFileDisputeDetails
} from '../../../../actions/processesActions';
import { clearMmsUpload } from '../../../../actions/mmsActions';
import StyledInput from '../../../Theme/Fields/StyledInput';
import { types } from './disputeSideTypes';
import UploadInput from './UploadInput';
import DelegateInput from '../../../../features/delegate/delegateInput';
import InputAdornment from '@material-ui/core/InputAdornment';
import CircleButton from '../../../Theme/Buttons/CircleButton';
import { downloadFileById } from '../../../../actions/massLoadActions';
import { useTranslation } from 'react-i18next';
import useExportFileLog from '../../../../services/actionsLog/useEportFileLog';

const DisputeDetails = () => {
  const { t } = useTranslation();
  const { uid } = useParams();
  const dispatch = useDispatch();
  const { currentProcess } = useSelector(({ processes }) => processes);
  const exportFileLog = useExportFileLog(['Суперечка з основних даних ТКО']);

  const handleDownloadFile = () => {
    if (!currentProcess?.file_description?.file_description) return;

    dispatch(
      downloadFileById(currentProcess?.file_description?.file_description, currentProcess?.file_description?.file_name)
    );
    exportFileLog(uid);
  };

  const handleDisputeLayout = (requestType) => {
    switch (requestType) {
      case types.BY_TKO:
        return (
          <>
            <Grid item xs={12} md={6} lg={3}>
              <StyledInput label={t('FIELDS.UNIQUE_APS')} value={currentProcess?.successful?.toString()} readOnly />
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
              <StyledInput
                label={t('FIELDS.MUST_BE_FINISHED_AT')}
                value={
                  currentProcess?.deadline_response_at &&
                  moment(currentProcess?.deadline_response_at).format('DD.MM.yyyy • HH:mm')
                }
                readOnly
              />
            </Grid>
            <Grid item xs={12}>
              <StyledInput
                label={t('FIELDS.JUSTIFICATION')}
                value={currentProcess?.process_description}
                multiline
                readOnly
              />
            </Grid>
          </>
        );
      case types.BY_SIDE:
        return (
          <>
            <Grid item xs={12} md={6} lg={3}>
              <StyledInput
                label={t('FIELDS.EIC_CODE_TYPE_X_OF_PART')}
                value={currentProcess?.side_data?.eic}
                readOnly
              />
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
              <StyledInput label={t('FIELDS.PART_ID')} value={currentProcess?.side_data?.usreou} readOnly />
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
              <StyledInput label={t('FIELDS.PART_NAME')} value={currentProcess?.side_data?.short_name} readOnly />
            </Grid>
            <Grid item xs={12} md={3} lg={3}>
              <StyledInput
                label={t('FIELDS.MUST_BE_FINISHED_AT')}
                value={
                  currentProcess?.deadline_response_at &&
                  moment(currentProcess?.deadline_response_at).format('DD.MM.yyyy • HH:mm')
                }
                readOnly
              />
            </Grid>
            <Grid item xs={12} md={6} lg={6}>
              <StyledInput label={t('FIELDS.OS')} value={currentProcess?.atko?.short_name || 'Усім'} readOnly />
            </Grid>
            <Grid item xs={12}>
              <StyledInput
                label={t('FIELDS.JUSTIFICATION')}
                value={currentProcess?.process_description}
                multiline
                readOnly
              />
            </Grid>
          </>
        );
      default:
        return null;
    }
  };

  const handleUpload = (file) => {
    const formData = new FormData();
    formData.append('file_original', file);

    dispatch(
      uploadFileDisputeDetails(uid, formData, () => {
        dispatch(getDisputeTko(uid));
        dispatch(clearMmsUpload());
      })
    );
  };

  const handleClear = () => {
    dispatch(deleteFileDisputeDetails(uid));
  };

  return (
    <div className={'boxShadow'} style={{ padding: 24, marginTop: 16, marginBottom: 16 }}>
      <Grid container spacing={3} alignItems={'flex-start'}>
        <Grid item xs={12} md={6} lg={3}>
          <DelegateInput
            label={t('FIELDS.USER_INITIATOR')}
            readOnly
            value={currentProcess?.initiator?.username}
            data={currentProcess?.delegation_history || []}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <StyledInput
            label={t('FIELDS.INITIATOR_COMPANY')}
            value={currentProcess?.initiator_company?.full_name}
            readOnly
          />
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <StyledInput
            label={t('FIELDS.REQUEST_TYPE')}
            value={currentProcess?.dispute_request_type === 'BY_TKO' ? t('BY_TKO') : t('BY_SIDE')}
            readOnly
          />
        </Grid>
        {currentProcess?.status === 'CANCELED_BY_OWNER' && (
          <Grid item xs={12} md={6} lg={3}>
            <StyledInput
              label={t('FIELDS.CANCELED_AT')}
              value={currentProcess?.finished_at && moment(currentProcess?.finished_at).format('DD.MM.yyyy • HH:mm')}
              readOnly
            />
          </Grid>
        )}
        {currentProcess?.status === 'DONE' && (
          <Grid item xs={12} md={3}>
            <StyledInput
              label={t('FIELDS.COMPLETE_DATETIME')}
              value={currentProcess?.finished_at && moment(currentProcess?.finished_at).format('DD.MM.yyyy • HH:mm')}
              readOnly
            />
          </Grid>
        )}
        {handleDisputeLayout(currentProcess?.dispute_request_type)}
        {currentProcess?.status === 'IN_PROCESS' && (
          <Grid item xs={12}>
            <UploadInput
              initFile={
                currentProcess?.file_description && {
                  ...currentProcess.file_description,
                  name: currentProcess.file_description.file_name
                }
              }
              responseError={null}
              handleUpload={handleUpload}
              handleClear={handleClear}
            />
          </Grid>
        )}
        {currentProcess?.status !== 'IN_PROCESS' && currentProcess?.status !== 'NEW' && (
          <Grid item xs={12} md={12} lg={3}>
            <StyledInput
              label={t('FIELDS.DISPUTE_FILE')}
              value={currentProcess?.file_description?.file_name}
              readOnly
              endAdornment={
                <InputAdornment position="end">
                  <CircleButton
                    type="download"
                    size="small"
                    title={t('CONTROLS.DOWNLOAD')}
                    onClick={handleDownloadFile}
                    disabled={!currentProcess?.file_description}
                  />
                </InputAdornment>
              }
            />
          </Grid>
        )}
      </Grid>
    </div>
  );
};
export default DisputeDetails;
