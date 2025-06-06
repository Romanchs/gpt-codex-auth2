import React from 'react';
import { Grid } from '@mui/material';
import DelegateInput from '../../../delegate/delegateInput';
import StyledInput from '../../../../Components/Theme/Fields/StyledInput';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import SelectField from '../../../../Components/Theme/Fields/SelectField';
import moment from 'moment';
import DatePicker from '../../../../Components/Theme/Fields/DatePicker';
import { archiving_reson_types, process_types } from '../data';
import { checkPermissions } from '../../../../util/verifyRole';
import { setMpType, setMustBeFinishedAt, setProcessType, setReason, setReasonInit, setReasonType } from '../slice';
import { useArchiningTkoQuery, useCreateArchiningTkoMutation, useUpdateArchiningTkoMutation } from './api';
import { useInitDeletingTkoQuery } from '../deleting/api';
import { BasisDocumentField } from './BasisDocumentField';
import { useTranslation } from 'react-i18next';

export const ArchivingTkoForm = () => {
  const { uid } = useParams();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const companyName = useSelector((store) => store.user.organizations.find((i) => i.active).name);
  const userName = useSelector((store) => store.user.full_name);
  const [, { error: createError, reset: resetCreate }] = useCreateArchiningTkoMutation({
    fixedCacheKey: 'createArchivingTko'
  });
  const [, { error, reset }] = useUpdateArchiningTkoMutation({ fixedCacheKey: 'updateArchivingTko' });
  const { currentData: data } = useArchiningTkoQuery(uid, { skip: !uid });
  const { data: initSettings } = useInitDeletingTkoQuery();
  const { reasonType, processType, reason, reasonInit, mpType, mustBeFinishedAt } = useSelector(
    ({ deletingTko }) => deletingTko
  );

  const MIN_PLANNED_DATE = checkPermissions('PROCESSES.DELETING_TKO.FUNCTIONS.MIN_PLANNED_DATE', 'АТКО')
    ? moment().startOf('month')
    : moment().subtract(90, 'day');
  const MAX_PALNNED_DATE = moment().add(90, 'day');

  const onChangeReason = ({ target }) => {
    dispatch(setReason(target.value));
    if (error) {
      reset();
    }
    if (createError) {
      resetCreate();
    }
  };

  const onChangeReasonInit = ({ target }) => {
    dispatch(setReasonInit(target.value));
    if (error) {
      reset();
    }
    if (createError) {
      resetCreate();
    }
  };

  return (
    <div className={'boxShadow'} style={{ padding: 24, marginTop: 16, marginBottom: 16 }}>
      <Grid container spacing={3} alignItems={'flex-start'}>
        <Grid item xs={12} md={6} lg={3}>
          <DelegateInput
            label={t('FIELDS.USER_INITIATOR')}
            readOnly
            value={data?.initiator?.username ?? userName ?? ''}
            data={data?.delegation_history ?? []}
          />
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <StyledInput
            label={t('FIELDS.FORMED_AT')}
            readOnly
            value={data?.created_at && moment(data?.created_at).format('DD.MM.yyyy • HH:mm')}
          />
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <StyledInput
            label={data?.status.startsWith('CANCELED') ? t('FIELDS.CANCELED_AT') : t('FIELDS.COMPLETE_DATETIME')}
            readOnly
            value={
              data?.status.startsWith('CANCELED')
                ? data?.completed_at && moment(data?.completed_at).format('DD.MM.yyyy • HH:mm')
                : data?.finished_at && moment(data?.finished_at).format('DD.MM.yyyy • HH:mm')
            }
          />
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          {data?.must_be_finished_at ? (
            <StyledInput
              label={t('FIELDS.PLANNED_ARCHIVING_DATE')}
              readOnly={Boolean(data?.must_be_finished_at)}
              value={data?.must_be_finished_at && moment(data?.must_be_finished_at).format('DD.MM.yyyy • HH:mm')}
            />
          ) : (
            <DatePicker
              label={t('FIELDS.PLANNED_ARCHIVING_DATE')}
              value={mustBeFinishedAt}
              maxDate={MAX_PALNNED_DATE}
              minDate={MIN_PLANNED_DATE}
              required
              onChange={(value) => dispatch(setMustBeFinishedAt(value))}
              error={createError?.data?.must_be_finished_at}
            />
          )}
        </Grid>
        <Grid item xs={12}>
          <StyledInput
            label={t('FIELDS.INITIATOR_COMPANY_NAME')}
            readOnly
            value={data?.initiator_company?.short_name ?? companyName ?? ''}
          />
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <SelectField
            dataMarker={'process_type'}
            onChange={(value) => dispatch(setProcessType(value))}
            data={process_types.filter(i =>
              checkPermissions('PROCESSES.DELETING_TKO.IS_AKO_PROCESSES', 'АКО_Процеси') ? i.value !== process_types[0].value : true
            )}
            label={t('FIELDS.ACTION_TYPE')}
            value={data?.additional_data?.process_type ?? processType}
            readOnly={
              Boolean(data?.additional_data?.process_type)
            }
          />
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <SelectField
            onChange={(value) => dispatch(setMpType(value))}
            dataMarker={'mp_type'}
            data={
              initSettings?.mp_type?.filter(({ value }) => value !== 'ts_generation_unit')?.map(({ value }) => ({ value, label: `PLATFORM.${value.toUpperCase()}` })) || []
            }
            label={t('FIELDS.AP_TYPE')}
            value={uid ? data?.additional_data?.mp_type : mpType}
            readOnly={Boolean(uid)}
            required={!uid}
            error={error?.data?.mp_type ?? createError?.data?.mp_type}
          />
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <SelectField
            onChange={(value) => dispatch(setReasonType(value))}
            dataMarker={'reason_type'}
            data={archiving_reson_types[data?.additional_data?.mp_type ?? mpType] || []}
            label={t('FIELDS.ARCHIVE_DELETE_REASON')}
            required={!uid}
            value={uid ? data?.additional_data?.reason_type : reasonType}
            error={error?.data?.reason_type ?? createError?.data?.reason_type}
            disabled={Boolean(data?.additional_data?.reason_type || !mpType)}
          />
        </Grid>
        {(reasonType == 4 || data?.additional_data?.reason_type == 4) && (
          <Grid item xs={12}>
            <StyledInput
              onChange={onChangeReason}
              label={t('FIELDS.ADDITIONAL_ARCHIVE_DELETE_REASON')}
              required={!uid}
              value={uid ? data?.additional_data?.reason : reason}
              error={error?.data?.reason ?? createError?.data?.reason}
              readOnly={Boolean(data?.additional_data?.reason)}
            />
          </Grid>
        )}
        {((!uid && checkPermissions('PROCESSES.DELETING_TKO.FIELDS.INITIATON_PROCESS', 'АКО_Процеси')) ||
          (mustBeFinishedAt && moment(mustBeFinishedAt).isBefore(moment())) ||
          data?.additional_data?.reason_init) && (
          <Grid item xs={12}>
            <StyledInput
              onChange={onChangeReasonInit}
              label={t('FIELDS.REASON_INIT_PROCESS')}
              required={!uid}
              value={uid ? data?.additional_data?.reason_init : reasonInit}
              error={error?.data?.reason_init ?? createError?.data?.reason_init}
              readOnly={Boolean(data?.additional_data?.reason_init)}
            />
          </Grid>
        )}
        {(data?.can_download_document ||
          (!uid && checkPermissions('PROCESSES.DELETING_TKO.FIELDS.INITIATON_PROCESS', 'АКО_Процеси'))) && (
          <BasisDocumentField />
        )}
      </Grid>
    </div>
  );
};
