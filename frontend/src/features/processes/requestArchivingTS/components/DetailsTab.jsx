import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import GetAppRounded from '@mui/icons-material/GetAppRounded';
import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import StyledInput from '../../../../Components/Theme/Fields/StyledInput';
import DelegateInput from '../../../delegate/delegateInput';
import { downloadFileById } from '../../../../actions/massLoadActions';
import Table from './Table';
import { setData } from '../slice';

const DetailsTab = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const comment = useSelector((store) => store.requestArchivingTS.data.comment);

  const queries = useSelector((store) =>
    Object.values(store.mainApi.queries).filter((q) => q.endpointName === 'requestArchivingTS')
  );
  const lastQuery = useMemo(
    () => queries.find((q) => q.startedTimeStamp === Math.max(...queries.map((q) => q.startedTimeStamp))),
    [queries]
  );
  const currentData = lastQuery?.data;

  const getCancelInputLabel = () => {
    if (currentData?.status?.startsWith('CANCELED')) return 'FIELDS.CANCELED_AT';
    if (currentData?.status === 'REJECTED') return 'FIELDS.REQUEST_CANCEL_REJECTED_DATE';
    return 'FIELDS.COMPLETE_DATETIME';
  };

  const handleDownload = () => {
    currentData?.files_description?.forEach((file) => {
      dispatch(downloadFileById(file?.file_uid, file?.file_name));
    });
  };

  return (
    <>
      <Box className={'boxShadow'} sx={{ mt: 2, mb: 2, p: 3 }}>
        <Grid container spacing={2} alignItems={'flex-start'}>
          <Grid item xs={12} md={6} lg={4}>
            <DelegateInput
              label={t('FIELDS.USER_INITIATOR')}
              value={currentData?.initiator}
              readOnly
              data={currentData?.delegation_history || []}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <StyledInput
              label={t('FIELDS.CREATED_AT')}
              value={currentData?.created_at && moment(currentData?.created_at).format('DD.MM.yyyy • HH:mm')}
              readOnly
            />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <Box display={'flex'} gap={2} alignItems={'center'}>
              <StyledInput
                label={t('FIELDS.BASIS_DOCUMENT')}
                value={currentData?.files_description?.map((f) => f.file_name)?.join(', ')}
                readOnly
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      size={'small'}
                      onClick={handleDownload}
                      data-marker={'download-documents'}
                      disabled={Boolean(!currentData?.files_description?.length)}
                    >
                      <GetAppRounded titleAccess={t('CONTROLS.DOWNLOAD_FILE')} />
                    </IconButton>
                  </InputAdornment>
                }
              />
            </Box>
          </Grid>
          <Grid item xs={12}>
            <StyledInput label={t('FIELDS.INITIATOR_COMPANY_NAME')} value={currentData?.initiator_company} readOnly />
          </Grid>
          <Grid item xs={12}>
            <StyledInput label={t('FIELDS.ARCHIVE_REASON')} value={currentData?.additional_data?.reason} readOnly />
          </Grid>
        </Grid>
      </Box>
      <Box className={'boxShadow'} sx={{ mt: 2, mb: 2, p: 3 }}>
        <Grid container spacing={2} alignItems={'flex-start'}>
          <Grid item xs={12} md={6} lg={4}>
            <StyledInput label={t('FIELDS.USER_EXECUTOR')} value={currentData?.executor} readOnly />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <StyledInput
              label={t('FIELDS.START_WORK_DATE')}
              value={currentData?.started_at && moment(currentData?.started_at).format('DD.MM.yyyy • HH:mm')}
              readOnly
            />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <StyledInput
              label={t(getCancelInputLabel())}
              readOnly
              value={currentData?.finished_at && moment(currentData?.finished_at).format('DD.MM.yyyy • HH:mm')}
            />
          </Grid>
          <Grid item xs={12}>
            <StyledInput label={t('FIELDS.EXECUTOR_COMPANY_NAME')} value={currentData?.executor_company} readOnly />
          </Grid>
          <Grid item xs={12}>
            <StyledInput
              label={t('FIELDS.COMMENT')}
              value={currentData?.can_done ? comment : currentData?.additional_data?.comment}
              onChange={(e) => dispatch(setData({ comment: e.target.value }))}
              readOnly={!currentData?.can_done}
              error={comment?.trim().length > 500 ? t('VERIFY_MSG.MAX_500_SYMBOLS') : null}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <StyledInput label={t('AUDIT.FIELDS.MAX_CORRECTION_PERIOD')} value={currentData?.max_period} readOnly />
          </Grid>
        </Grid>
      </Box>
      <Table />
    </>
  );
};

export default DetailsTab;
