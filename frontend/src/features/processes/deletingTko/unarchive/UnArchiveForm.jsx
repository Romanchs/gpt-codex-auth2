import { Grid } from '@mui/material';
import DelegateInput from '../../../delegate/delegateInput';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import StyledInput from '../../../../Components/Theme/Fields/StyledInput';
import moment from 'moment/moment';
import SelectField from '../../../../Components/Theme/Fields/SelectField';
import { setMpType, setProcessType, setReason, setReasonInit, setReasonType } from '../slice';
import { checkPermissions } from '../../../../util/verifyRole';
import { process_types } from '../data';
import { useInitDeletingTkoQuery } from '../deleting/api';
import { useParams } from 'react-router-dom';
import { BasisDocumentField } from '../archiving/BasisDocumentField';
import { useCreateUnArchiningTkoMutation, useUnArchiningTkoQuery } from './api';

export const UnArchiveForm = () => {
  const { uid } = useParams();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const companyName = useSelector((store) => store.user.organizations.find((i) => i.active).name);
  const userName = useSelector((store) => store.user.full_name);
  const { processType, mpType, reasonType, reason, reasonInit } = useSelector(({ deletingTko }) => deletingTko);
  const { data: initSettings } = useInitDeletingTkoQuery();
  const [, { error: createError, reset: resetCreate }] = useCreateUnArchiningTkoMutation({
    fixedCacheKey: 'createUnArchivingTko'
  });

  const { currentData: data } = useUnArchiningTkoQuery(uid, {skip: !uid});

  const clearErrors = () => {
    if (createError) {
      resetCreate();
    }
  }

  const onChangeReason = ({ target }) => {
    dispatch(setReason(target.value));
    clearErrors();
  };

  const onChangeReasonInit = ({ target }) => {
    dispatch(setReasonInit(target.value));
    clearErrors();
  };

  return (
    <div className={'boxShadow'} style={{ padding: 24, marginTop: 16, marginBottom: 16 }}>
      <Grid container spacing={3} alignItems={'flex-start'}>
        <Grid item xs={12} md={6} lg={3}>
          <DelegateInput
            label={t('FIELDS.USER_INITIATOR')}
            readOnly
            value={data?.initiator?.username ?? userName ?? ''}
            data={data?.delegation_history || []}
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
        <Grid item xs={12}>
          <StyledInput
            label={t('FIELDS.INITIATOR_COMPANY_NAME')}
            readOnly
            value={data?.initiator_company?.short_name ?? companyName ?? ''}
          />
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <SelectField
            onChange={(value) => dispatch(setProcessType(value))}
            dataMarker={'process_type'}
            data={process_types.filter((i) =>
              checkPermissions('PROCESSES.DELETING_TKO.IS_AKO_PROCESSES', 'АКО_Процеси')
                ? i.value !== process_types[0].value
                : true
            )}
            label={t('FIELDS.ACTION_TYPE')}
            value={uid ? 'Деархівація' : processType}
            readOnly={Boolean(uid)}
          />
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <SelectField
            label={t('FIELDS.AP_TYPE')}
            dataMarker={'mp_type'}
            onChange={(value) => dispatch(setMpType(value))}
            data={
              initSettings?.mp_type?.filter(({ value }) => value !== 'ts_generation_unit')?.map(({ value }) => ({ value, label: `PLATFORM.${value.toUpperCase()}` })) || []
            }
            value={uid ? data?.additional_data?.mp_type : mpType}
            readOnly={Boolean(uid)}
            required={!uid}
            error={createError?.data?.mp_type}
          />
        </Grid>
        {
          (data?.additional_data?.reason_type ||
            (!uid && !checkPermissions('PROCESSES.DELETING_TKO.IS_AKO_PROCESSES', 'АКО_Процеси'))) &&
          <Grid item xs={12} md={6} lg={4}>
            <SelectField
              onChange={(value) => dispatch(setReasonType(value))}
              dataMarker={'reason_type'}
              data={[{ value: 4, label: 'ARCHIVING_REASON_TYPES.OTHER' }]}
              label={t('FIELDS.UN_ARCHIVE_DELETE_REASON')}
              required={!uid}
              value={uid ? data?.additional_data?.reason_type : reasonType}
              error={createError?.data?.reason_type}
              disabled={Boolean(uid) || !mpType}
            />
          </Grid>
        }
        {
          (data?.additional_data?.reason ||
            (!uid && !checkPermissions('PROCESSES.DELETING_TKO.IS_AKO_PROCESSES', 'АКО_Процеси'))) &&
          <Grid item xs={12}>
            <StyledInput
              onChange={onChangeReason}
              label={t('FIELDS.ADDITIONAL_UNARCHIVE_DELETE_REASON')}
              required={!uid}
              value={uid ? data?.additional_data?.reason : reason}
              error={createError?.data?.reason}
              readOnly={Boolean(uid)}
            />
          </Grid>
        }
        <Grid item xs={12}>
          <StyledInput
            onChange={onChangeReasonInit}
            label={t('FIELDS.REASON_INIT_PROCESS')}
            required={!uid}
            value={uid ? data?.additional_data?.reason_init : reasonInit}
            error={createError?.data?.reason_init}
            readOnly={Boolean(uid)}
          />
        </Grid>
        {
          (data?.additional_data?.documents_basis || (!uid && checkPermissions('PROCESSES.DELETING_TKO.IS_AKO_PROCESSES', 'АКО_Процеси'))) &&
          <Grid item xs={12}>
            <BasisDocumentField isUnArchive/>
          </Grid>
        }
      </Grid>
    </div>
  );
};
