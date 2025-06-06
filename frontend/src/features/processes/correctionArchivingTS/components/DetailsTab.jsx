import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { mainApi } from '../../../../app/mainApi';
import StyledInput from '../../../../Components/Theme/Fields/StyledInput';
import SelectField from '../../../../Components/Theme/Fields/SelectField';
import DelegateInput from '../../../delegate/delegateInput';
import {
  useChangeDescriptionFilesCorrectionArchivingTSMutation,
  useInitCorrectionArchivingTSMutation,
  useReasonsCorrectionArchivingTSQuery,
  useUpdateCorrectionArchivingTSMutation
} from '../api';
import { ACTION_TYPES, AP_TYPES, setInitData } from '../slice';
import Table from './Table';
import SelectFilesField from './SelectFilesField';
import Autocomplete from './Autocomplete';

const MAX_SIZE = {
  BYTES: 52428800,
  MBYTES: 50
};

const DetailsTab = () => {
  const { uid } = useParams();
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const [innerError, setInnerError] = useState('');
  const companyName = useSelector((store) => store.user.organizations.find((i) => i.active).name);
  const userName = useSelector((store) => store.user.full_name);
  const initData = useSelector((store) => store.correctionArchivingTS.initData);
  const params = useSelector((store) => store.correctionArchivingTS.params);

  const { currentData } = mainApi.endpoints.correctionArchivingTS.useQueryState({ uid, params });

  const [isFocus, setIsFocus] = useState(false);
  const { currentData: reasons } = useReasonsCorrectionArchivingTSQuery(null, {
    skip: !uid || currentData?.status !== 'IN_PROCESS'
  });

  const reasonsList = useMemo(() => {
    const r = reasons?.map((i) => ({ label: i[`name_${i18n.language}`], value: i[`name_${i18n.language}`] }));
    if (!initData.reason || !reasons) return r;
    const inputValue = initData.reason?.trim().toLocaleLowerCase();
    return r.filter((i) => i.label.toLocaleLowerCase().includes(inputValue));
  }, [reasons, initData.reason, i18n]);

  const [, { error }] = useInitCorrectionArchivingTSMutation({ fixedCacheKey: 'correctionArchivingTS_init' });
  const [, { error: updateError }] = useUpdateCorrectionArchivingTSMutation({
    fixedCacheKey: 'correctionArchivingTS_update'
  });
  const [changeDescriptionFiles, { error: fileDescriptionError, reset }] =
    useChangeDescriptionFilesCorrectionArchivingTSMutation({
      fixedCacheKey: 'correctionArchivingTS_descriptionFiles'
    });

  const IS_ARCHIVING = !uid
    ? initData.action_type === ACTION_TYPES.archiving
    : currentData?.additional_data?.process_type === ACTION_TYPES.archiving;

  const getCancelInputLabel = () => {
    if (currentData?.status?.startsWith('CANCELED')) return 'FIELDS.CANCELED_AT';
    if (currentData?.status === 'REJECTED') return 'FIELDS.REQUEST_CANCEL_REJECTED_DATE';
    return 'FIELDS.COMPLETE_DATETIME';
  };

  const handleChange = (key) => (value) => {
    dispatch(setInitData({ ...initData, [key]: value }));
  };

  const handleClickFiles = () => {
    setInnerError('');
    reset();
  };

  const handleChangeFiles = (files) => {
    if (files?.length > 5) {
      return setInnerError(t('VERIFY_MSG.MAX_FILES_COUNT', { count: 5 }));
    }
    const body = new FormData();
    let isError = false;
    for (const file of files) {
      if (file.size >= MAX_SIZE.BYTES) {
        isError = true;
        setInnerError(t('VERIFY_MSG.FILE_SIZE', { size: MAX_SIZE.MBYTES }));
        break;
      }
      body.append('files_original', file);
    }
    if (!isError) changeDescriptionFiles({ uid, body, method: 'POST' });
  };

  const handleClearFiles = () => {
    changeDescriptionFiles({ uid, method: 'DELETE' });
  };

  return (
    <>
      <Box className={'boxShadow'} sx={{ mt: 2, mb: 2, p: 3 }}>
        <Grid container spacing={2} alignItems={'flex-start'}>
          <Grid item xs={12} md={6} lg={3}>
            <DelegateInput
              label={t('FIELDS.USER_INITIATOR')}
              value={uid ? currentData?.initiator : userName}
              readOnly
              data={currentData?.delegation_history || []}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <StyledInput
              label={t('FIELDS.START_WORK_DATE')}
              value={currentData?.created_at && moment(currentData?.created_at).format('DD.MM.yyyy • HH:mm')}
              readOnly
            />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <StyledInput
              label={t('FIELDS.FORMED_AT')}
              value={currentData?.started_at && moment(currentData?.started_at).format('DD.MM.yyyy • HH:mm')}
              readOnly
            />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <StyledInput
              label={t(getCancelInputLabel())}
              readOnly
              value={currentData?.finished_at && moment(currentData?.finished_at).format('DD.MM.yyyy • HH:mm')}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={!IS_ARCHIVING && 3}>
            {!uid ? (
              <SelectField
                label={t('FIELDS.ACTION_TYPE')}
                value={initData.action_type}
                onChange={handleChange('action_type')}
                data={[
                  { value: ACTION_TYPES.correction, label: t('CORRECTION_TS') },
                  { value: ACTION_TYPES.archiving, label: t('ARCHIVING_TS') }
                ]}
                error={error?.data?.action_type}
                dataMarker={'action_type'}
              />
            ) : (
              <StyledInput
                label={t('FIELDS.ACTION_TYPE')}
                value={IS_ARCHIVING ? t('ARCHIVING_TS') : t('CORRECTION_TS')}
                readOnly
              />
            )}
          </Grid>
          {!IS_ARCHIVING && (
            <>
              <Grid item xs={12} md={6} lg={3}>
                {!uid ? (
                  <SelectField
                    label={t('FIELDS.TKO_TYPE')}
                    value={initData.ap_type}
                    onChange={handleChange('ap_type')}
                    data={[
                      { value: AP_TYPES.z, label: 'Z' },
                      { value: AP_TYPES.zv, label: 'ZV' }
                    ]}
                    error={error?.data?.ap_type}
                    dataMarker={'ap_type'}
                  />
                ) : (
                  <StyledInput label={t('FIELDS.TKO_TYPE')} value={currentData?.additional_data?.ap_type} readOnly />
                )}
              </Grid>
              <Grid item xs={12} md={6} lg={3}>
                <StyledInput
                  label={t('FIELDS.FINISHED_AT')}
                  value={currentData?.completed_at && moment(currentData?.completed_at).format('DD.MM.yyyy • HH:mm')}
                  readOnly
                />
              </Grid>
              <Grid item xs={12} md={6} lg={3}>
                <StyledInput
                  label={t('FIELDS.CLOSE_GATE_DATETIME')}
                  value={
                    currentData?.additional_data?.date_of_lock_ts &&
                    moment(currentData?.additional_data?.date_of_lock_ts).format('DD.MM.yyyy • HH:mm')
                  }
                  readOnly
                />
              </Grid>
            </>
          )}
          <Grid item xs={12} {...(IS_ARCHIVING ? { md: 6, lg: 9 } : { md: 12 })}>
            <StyledInput
              label={t('FIELDS.INITIATOR_COMPANY_NAME')}
              value={uid ? currentData?.initiator_company : companyName}
              readOnly
            />
          </Grid>
          <Grid item xs={12}>
            {!uid || currentData?.status !== 'IN_PROCESS' ? (
              <StyledInput
                label={IS_ARCHIVING ? t('FIELDS.ARCHIVE_REASON') : t('FIELDS.CORRECTION_DESCRIPTION')}
                value={currentData?.additional_data?.reason}
                readOnly
              />
            ) : (
              <Autocomplete
                label={IS_ARCHIVING ? t('FIELDS.ARCHIVE_REASON') : t('FIELDS.CORRECTION_DESCRIPTION')}
                value={initData.reason}
                list={reasonsList || []}
                onChange={handleChange('reason')}
                error={
                  initData.reason?.trim().length > 500
                    ? t('VERIFY_MSG.MAX_500_SYMBOLS')
                    : error?.data?.reason || updateError?.data?.reason
                }
                onFocus={() => setIsFocus(true)}
                onBlur={() => setIsFocus(false)}
                open={Boolean(isFocus && reasonsList?.length)}
              />
            )}
          </Grid>
          <Grid item xs={12}>
            <StyledInput label={t('FIELDS.AKO_COMMENT')} value={currentData?.additional_data?.comment} readOnly />
          </Grid>
          <Grid item xs={12}>
            <SelectFilesField
              value={currentData?.files_description?.map((f) => f.file_name)?.join(', ')}
              onClick={handleClickFiles}
              onChange={handleChangeFiles}
              onClear={handleClearFiles}
              error={innerError || fileDescriptionError?.data?.files_original}
              disabledUpload={!currentData?.can_upload_description}
              disabledRemove={!currentData?.can_delete_description}
            />
          </Grid>
        </Grid>
      </Box>
      {currentData?.status && currentData?.status !== 'NEW' && <Table />}
    </>
  );
};

export default DetailsTab;
