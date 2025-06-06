import { Grid } from '@material-ui/core';
import moment from 'moment';

import { checkPermissions } from '../../../util/verifyRole';
import StyledInput from '../../../Components/Theme/Fields/StyledInput';
import { AKO_STATUSES, DISPUTE_AKO_ALLOWED_ROLES } from '../constants';
import { useTranslation } from 'react-i18next';

export const FormDko = ({ disputeEntity }) => {
  const {t} = useTranslation();
  return (
    <>
      <Grid container alignItems={'flex-start'} spacing={3}>
        {(disputeEntity?.initiator || disputeEntity?.executor_company) && (
          <>
            <Grid item xs={12} md={5}>
              <StyledInput label={t('FIELDS.USER_INITIATOR')} value={disputeEntity?.initiator} readOnly />
            </Grid>

            <Grid item xs={12} md={7}>
              <StyledInput label={t('FIELDS.EXECUTOR_COMPANY')} value={disputeEntity?.executor_company} readOnly />
            </Grid>
          </>
        )}

        {checkPermissions('DISPUTES.DKO_ENTITY.FIELDS.AKO', DISPUTE_AKO_ALLOWED_ROLES) && disputeEntity?.ako && (
          <Grid item xs={12} md={4} lg={3}>
            <StyledInput label={t('FIELDS.NAME_OF_RESPONSIBLE_AKO')} value={disputeEntity.ako?.decision_by} readOnly />
          </Grid>
        )}
        {disputeEntity?.initiator_phone && disputeEntity?.initiator_email && (
          <>
            <Grid item xs={12} md={4} lg={3}>
              <StyledInput label={t('FIELDS.PHONE_NUMBER')} value={disputeEntity?.initiator_phone || '-'} readOnly />
            </Grid>

            <Grid item xs={12} md={4} lg={3}>
              <StyledInput label={t('FIELDS.EMAIL')} value={disputeEntity?.initiator_email || '-'} readOnly />
            </Grid>
          </>
        )}
        <Grid item xs={12} md={4} lg={3}>
          <StyledInput
            label={t('FIELDS.DISPUTE_CREATE_DATE')}
            value={moment(disputeEntity?.created_at).format('DD.MM.YYYY  •  HH:mm') || '-'}
            readOnly
          />
        </Grid>
        <Grid item xs={12} md={4} lg={3}>
          <StyledInput label={t('FIELDS.EIC_CODE')} value={disputeEntity?.tko} readOnly />
        </Grid>

        {disputeEntity?.dko_range && (
          <Grid item xs={12} md={4} lg={3}>
            <StyledInput
              label={t('FIELDS.DKO_RANGE')}
              value={disputeEntity?.dko_range ? disputeEntity.dko_range : '-'}
              readOnly
            />
          </Grid>
        )}

        {disputeEntity?.must_be_finished_at && (
          <Grid item xs={12} md={4} lg={3}>
            <StyledInput
              label={
                AKO_STATUSES.includes(disputeEntity?.status)
                  ? t('FIELDS.EXPECTED_DATE_OF_SETTLEMENT_DISPUTE')
                  : t('FIELDS.EXPECTED_DATE_OF_RESOLUTION')
              }
              value={moment(disputeEntity.must_be_finished_at).format('DD.MM.YYYY')}
              readOnly
            />
          </Grid>
        )}

        {disputeEntity?.finished_at && (
          <Grid item xs={12} md={4} lg={3}>
            <StyledInput
              label={
                AKO_STATUSES.includes(disputeEntity?.status)
                  ? t('FIELDS.DATE_OF_SETTLEMENT_DISPUTE')
                  : t('FIELDS.DATE_OF_DISPUTE_RESOLUTION')
              }
              value={moment(disputeEntity.finished_at).format('DD.MM.YYYY')}
              readOnly
            />
          </Grid>
        )}

        {disputeEntity?.canceled_at && (
          <Grid item xs={12} md={4} lg={3}>
            <StyledInput
              label={t('FIELDS.DATE_OF_CANCELATION_DISPUTE')}
              value={moment(disputeEntity.canceled_at).format('DD.MM.YYYY')}
              readOnly
            />
          </Grid>
        )}

        <Grid item xs={12} md={4} lg={3}>
          <StyledInput label={t('FIELDS.RELEASE')} value={disputeEntity.dko_release} readOnly />
        </Grid>

        <Grid item xs={12} md={4} lg={3}>
          <StyledInput label={t('FIELDS.VERSION')} value={disputeEntity.dko_version} readOnly />
        </Grid>
      </Grid>
    </>
  );
};
