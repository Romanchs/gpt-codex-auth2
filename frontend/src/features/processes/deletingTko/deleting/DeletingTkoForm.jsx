import React from 'react';
import { Grid } from '@mui/material';
import DelegateInput from '../../../delegate/delegateInput';
import StyledInput from '../../../../Components/Theme/Fields/StyledInput';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import SelectField from '../../../../Components/Theme/Fields/SelectField';
import moment from 'moment';
import { deleting_reason_types, process_types, ap_statuses, completedText } from '../data';
import { setApStatus, setMpType, setProcessType, setReason, setReasonType } from '../slice';
import { useCreateDeletingTkoMutation, useDeletingTkoQuery, useInitDeletingTkoQuery, useUpdateDeletingTkoMutation } from './api';
import { useTranslation } from 'react-i18next';

export const DeletingTkoForm = () => {
  const { uid } = useParams();
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const companyName = useSelector((store) => store.user.organizations.find((i) => i.active).name);
  const userName = useSelector((store) => store.user.full_name);
  const [, { error: createError, reset: resetCreate }] = useCreateDeletingTkoMutation({
    fixedCacheKey: 'createDeletingTko'
  });
  const [, { error, reset }] = useUpdateDeletingTkoMutation({ fixedCacheKey: 'updateDeletingTko' });
  const { currentData: data } = useDeletingTkoQuery(uid, { skip: !uid });
  const { data: initSettings } = useInitDeletingTkoQuery();
  const { reasonType, processType, reason, apStatus, mpType} = useSelector(({ deletingTko }) => deletingTko);


  const onChangeReason = ({ target }) => {
    dispatch(setReason(target.value));
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
            label={t('FIELDS.COMPLETE_DATETIME')}
            readOnly
            value={data?.finished_at && moment(data?.finished_at).format('DD.MM.yyyy • HH:mm')}
          />
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <StyledInput
            label={`${t('FIELDS.DATE_TIME')} ${completedText[data?.status] ?? t('COMPLETE')} ${t('APPLICATIONS')}`}
            readOnly
            value={data?.completed_at && moment(data?.completed_at).format('DD.MM.yyyy • HH:mm')}
          />
        </Grid>
        <Grid item xs={12}>
          <StyledInput
            label={t('FIELDS.INITIATOR_COMPANY')}
            readOnly
            value={data?.initiator_company?.short_name ?? companyName ?? ''}
          />
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <SelectField
            onChange={(value) => dispatch(setProcessType(value))}
            dataMarker={'process_type'}
            data={process_types}
            label={t('FIELDS.ACTION_TYPE')}
            value={data?.additional_data?.process_type ?? processType}
            readOnly={Boolean(data?.process_type)}
          />
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <SelectField
            onChange={(value) => dispatch(setApStatus(value))}
            dataMarker={'ap_status'}
            data={ap_statuses}
            label={t('FIELDS.STATUS_AP')}
            value={uid ? data?.ap_status : apStatus}
            readOnly={uid || processType !== process_types[0].value}
          />
        </Grid>
        {(!uid || data?.mp_type) && (
          <Grid item xs={12} md={6} lg={4}>
            <SelectField
              dataMarker={'mp_type'}
              onChange={value => dispatch(setMpType(value))}
              data={initSettings?.mp_type?.map(({value}) => ({value, label: `PLATFORM.${value.toUpperCase()}`})) || []}
              label={t('FIELDS.AP_TYPE')}
              value={data?.mp_type ?? mpType}
              readOnly={uid}
              required={!uid}
              error={error?.data?.mp_type || createError?.data?.mp_type}
            />
          </Grid>
        )}
        {data?.reason_type !== '1' &&
          data?.reason_type !== '2' &&
          ['DONE', 'PARTIALLY_DONE', 'COMPLETED', 'REJECTED'].includes(data?.status) && (
            <>
              {data?.approved_at && (
                <Grid item xs={12} md={6} lg={3}>
                  <StyledInput
                    label={t('FIELDS.APPROVED_AT')}
                    readOnly
                    value={data?.approved_at && moment(data?.approved_at).format('DD.MM.yyyy • HH:mm')}
                  />
                </Grid>
              )}
              {data?.approved_by && (
                <Grid item xs={12} md={6}>
                  <StyledInput label={t('FIELDS.APPROVED_BY')} readOnly value={data?.approved_by} />
                </Grid>
              )}
            </>
          )}
        {(!uid || data?.reason_type) && (
          <Grid item xs={12} md={6} lg={8}>
            <SelectField
              onChange={(value) => dispatch(setReasonType(value))}
              dataMarker={'reason_type'}
              data={deleting_reason_types}
              label={t('FIELDS.DELETE_REASON')}
              required={!uid}
              value={uid ? data?.reason_type : reasonType}
              error={error?.data?.reason_type || createError?.data?.reason_type}
              readOnly={Boolean(data?.reason_type)}
            />
          </Grid>
        )}
        {(reasonType == 3 || data?.reason_type == 3 || data?.reason) && (
          <Grid item xs={12}>
            <StyledInput
              onChange={onChangeReason}
              label={t('FIELDS.JUSTIFICATION')}
              required={!uid}
              value={uid ? data?.reason : reason}
              error={error?.data?.reason || createError?.data?.reason}
              readOnly={Boolean(data?.reason)}
            />
          </Grid>
        )}
        {data?.reject_reason && (
          <Grid item xs={12}>
            <StyledInput label={t('FIELDS.REJECTED_REASON')} value={data.reject_reason} readOnly />
          </Grid>
        )}
      </Grid>
    </div>
  );
};
