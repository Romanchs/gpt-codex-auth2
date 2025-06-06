import { useMemo, useState } from 'react';
import moment from 'moment';
import { Box, Grid, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import Page from '../../../Components/Global/Page';
import Statuses from '../../../Components/Theme/Components/Statuses';
import StyledInput from '../../../Components/Theme/Fields/StyledInput';
import SelectField from '../../../Components/Theme/Fields/SelectField';
import CircleButton from '../../../Components/Theme/Buttons/CircleButton';
import { useNavigate, useParams } from 'react-router-dom';
import {
  useCreateUpdateSubApMeterMutation,
  useUpdateSubApMeterQuery,
  useUpdateSubApMeterReasonsQuery,
  useUpdateUpdateSubApMeterMutation
} from './api';
import RejectDialog from './RejectModal';
import UploadDialog from './UploadDialog';
import DelegateBtn from '../../delegate/delegateBtn';
import { UploadedFilesTable } from '../../../Components/pages/Processes/Components/UploadedFilesTable';
import { useTranslation } from 'react-i18next';

const UPDATE_TYPES = {
  CHARACTERISTICS_CORRECTION: [
    'MRP',
    'VOLTAGE_LEVEL',
    'COUNTER',
    'CURRENT_TRANSFORMER',
    'VOLTAGE_TRANSFORMER',
    'OTHER_INCONSISTENCIES'
  ],
  CLOSING_INCONSISTENCIES: [
    'COUNTER',
    'CURRENT_TRANSFORMER',
    'VOLTAGE_TRANSFORMER',
    'OTHER_INCONSISTENCIES',
    'ALL_INCONSISTENCIES'
  ],
  NEW_INCONSISTENCIES: ['ALL_INCONSISTENCIES']
};

const UpdateSubApMeter = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [data, setData] = useState({
    action_type: '',
    update_type: undefined,
    reason: undefined
  });
  const [loading, setLoading] = useState(false);
  const [delegating, setDelegating] = useState(false);
  const { uid } = useParams();
  const companyName = useSelector((store) => store.user.organizations.find((i) => i.active).name);
  const userName = useSelector((store) => store.user.full_name);

  const { data: reasons } = useUpdateSubApMeterReasonsQuery();
  const { currentData, isFetching, refetch } = useUpdateSubApMeterQuery(uid, { skip: !uid });
  const [createUpdateSubApMeter, { isLoading }] = useCreateUpdateSubApMeterMutation();
  const [update, { isLoading: isCompleteLoading }] = useUpdateUpdateSubApMeterMutation();

  const handleChange = (id) => (value) => {
    let newData = { ...data, [id]: value };
    if (id === 'action_type') {
      newData.update_type = undefined;
      newData.reason = undefined;
    }
    if (id === 'update_type') {
      newData.reason = undefined;
    }
    setData(newData);
  };

  const formatDate = (date) => date && moment(date).format('DD.MM.yyyy • HH:mm');

  const disableReason = useMemo(() => {
    if (data?.action_type !== 'CHARACTERISTICS_CORRECTION') return true;
    return !['COUNTER', 'CURRENT_TRANSFORMER', 'VOLTAGE_TRANSFORMER', 'OTHER_INCONSISTENCIES'].find(
      (i) => i === data?.update_type
    );
  }, [data?.update_type, data?.action_type]);

  return (
    <Page
      pageName={
        currentData?.id
          ? t('PERMISSIONS.PROCESSES.UPDATE_SUB_AP_METER.HEADER_TITLE_DETAIL', { id: currentData?.id })
          : t('PERMISSIONS.PROCESSES.UPDATE_SUB_AP_METER.HEADER_TITLE')
      }
      backRoute={'/processes'}
      loading={isFetching || isLoading || delegating || loading || isCompleteLoading}
      acceptPermisions={uid ? 'PROCESSES.UPDATE_SUB_AP_METER.ACCESS' : 'PROCESSES.UPDATE_SUB_AP_METER.INITIALIZATION'}
      acceptRoles={uid ? ['АТКО', 'АКО_Процеси', 'АКО'] : ['АТКО']}
      controls={
        <>
          {!uid && (
            <CircleButton
              type={'create'}
              title={t('CONTROLS.TAKE_TO_WORK')}
              disabled={!data.action_type || !data.update_type || (!data.reason && !disableReason)}
              onClick={() => {
                createUpdateSubApMeter(data).then(({ data }) => {
                  if (data?.uid) {
                    navigate(data.uid, { replace: true });
                  }
                });
              }}
            />
          )}
          {currentData?.can_cancel && <RejectDialog setLoading={setLoading} />}
          {currentData?.can_delegate && (
            <DelegateBtn
              process_uid={uid}
              onStarted={() => setDelegating(true)}
              onFinished={() => setDelegating(false)}
              onSuccess={() => window.location.reload()}
            />
          )}
          {currentData?.can_upload && <UploadDialog setLoading={setLoading} />}
          {currentData?.can_complete && (
            <CircleButton
              type={'done'}
              title={t('CONTROLS.DONE')}
              onClick={() => {
                update({ uid, body: {}, type: 'complete' });
              }}
            />
          )}
        </>
      }
    >
      <Statuses
        statuses={['NEW', 'IN_PROCESS', 'DONE', 'PARTIALLY_DONE', 'CANCELED']}
        currentStatus={currentData?.status || 'NEW'}
      />
      <Box className={'boxShadow'} sx={{ p: 3, mt: 2, mb: 2 }}>
        <Grid container spacing={3} alignItems={'flex-start'}>
          <Grid item xs={12} md={6} lg={3}>
            <StyledInput
              label={t('FIELDS.USER_INITIATOR')}
              value={uid ? currentData?.initiator?.username : userName}
              disabled
            />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <StyledInput label={t('FIELDS.CREATED_AT')} value={formatDate(currentData?.created_at)} disabled />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            {currentData?.canceled_at ? (
              <StyledInput label={t('FIELDS.CANCELED_AT')} value={formatDate(currentData?.canceled_at)} disabled />
            ) : (
              <StyledInput
                label={t('FIELDS.COMPLETE_DATETIME')}
                value={formatDate(currentData?.finished_at)}
                disabled
              />
            )}
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <StyledInput
              label={t('PERMISSIONS.PROCESSES.UPDATE_SUB_AP_METER.SUCCESSFUL_UNIQUE')}
              value={currentData?.successful?.toString() || ''}
              disabled
            />
          </Grid>
        </Grid>
        <Grid container spacing={3} alignItems={'flex-start'}>
          <Grid item xs={12} md={6} lg={6}>
            <StyledInput
              label={t('FIELDS.INITIATOR_COMPANY_NAME')}
              value={uid ? currentData?.executor_company?.full_name : companyName}
              disabled
            />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            {uid ? (
              <StyledInput
                label={t('FIELDS.ACTION_TYPE')}
                value={
                  i18n.exists(`PERMISSIONS.PROCESSES.UPDATE_SUB_AP_METER.ACTION_TYPE.${currentData?.action_type}`)
                    ? t(`PERMISSIONS.PROCESSES.UPDATE_SUB_AP_METER.ACTION_TYPE.${currentData?.action_type}`)
                    : ''
                }
                disabled
              />
            ) : (
              <SelectField
                label={t('FIELDS.ACTION_TYPE')}
                value={data.action_type}
                dataMarker={'action_type'}
                data={[
                  {
                    label: 'PERMISSIONS.PROCESSES.UPDATE_SUB_AP_METER.ACTION_TYPE.CHARACTERISTICS_CORRECTION',
                    value: 'CHARACTERISTICS_CORRECTION'
                  },
                  {
                    label: 'PERMISSIONS.PROCESSES.UPDATE_SUB_AP_METER.ACTION_TYPE.CLOSING_INCONSISTENCIES',
                    value: 'CLOSING_INCONSISTENCIES'
                  },
                  {
                    label: 'PERMISSIONS.PROCESSES.UPDATE_SUB_AP_METER.ACTION_TYPE.NEW_INCONSISTENCIES',
                    value: 'NEW_INCONSISTENCIES'
                  }
                ]}
                onChange={handleChange('action_type')}
              />
            )}
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            {uid ? (
              <StyledInput
                label={t('PERMISSIONS.PROCESSES.UPDATE_SUB_AP_METER.UPDATE_TYPE')}
                value={
                  i18n.exists(`PERMISSIONS.PROCESSES.UPDATE_SUB_AP_METER.UPDATE_TYPE.${currentData?.update_type}`)
                    ? t(`PERMISSIONS.PROCESSES.UPDATE_SUB_AP_METER.UPDATE_TYPE.${currentData?.update_type}`)
                    : ''
                }
                disabled
              />
            ) : (
              <SelectField
                label={t('PERMISSIONS.PROCESSES.UPDATE_SUB_AP_METER.UPDATE_TYPE')}
                value={data.update_type}
                dataMarker={'update_type'}
                data={
                  data.action_type
                    ? UPDATE_TYPES[data.action_type].map((i) => ({
                        label: 'PERMISSIONS.PROCESSES.UPDATE_SUB_AP_METER.UPDATE_TYPE.' + i,
                        value: i
                      }))
                    : []
                }
                disabled={!data.action_type}
                onChange={handleChange('update_type')}
              />
            )}
          </Grid>
        </Grid>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            {uid ? (
              <StyledInput
                label={t('PERMISSIONS.PROCESSES.UPDATE_SUB_AP_METER.REASON')}
                value={
                  currentData?.reason &&
                  reasons &&
                  reasons?.find((i) => i.key === currentData?.reason)?.[`name_${i18n.language}`]
                }
                disabled
              />
            ) : (
              <SelectField
                label={t('PERMISSIONS.PROCESSES.UPDATE_SUB_AP_METER.REASON')}
                value={data.reason}
                dataMarker={'reason'}
                disabled={disableReason}
                data={reasons?.map((i) => ({ label: i[`name_${i18n.language}`], value: i.key })) || []}
                onChange={handleChange('reason')}
                ignoreI18
              />
            )}
          </Grid>
        </Grid>
      </Box>
      {currentData?.status && (
        <>
          <Typography variant="h6" sx={{ mb: 2, color: '#4a5b7a' }}>
            {`${t('PERMISSIONS.PROCESSES.UPDATE_SUB_AP_METER.TITLE')}:`}
          </Typography>
          <UploadedFilesTable files={currentData?.files.data || []} handleUpdateList={refetch} />
        </>
      )}
    </Page>
  );
};

export default UpdateSubApMeter;
