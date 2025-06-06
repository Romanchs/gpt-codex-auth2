import Grid from '@mui/material/Grid';
import React, { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

import { ModalWrapper } from '../../../Modal/ModalWrapper';
import { BlueButton } from '../../../Theme/Buttons/BlueButton';
import { GreenButton } from '../../../Theme/Buttons/GreenButton';
import StyledInput from '../../../Theme/Fields/StyledInput';
import Typography from '@material-ui/core/Typography';
import SelectField from '../../../Theme/Fields/SelectField';
import { useReferenceBookKeyQuery } from '../../../../app/mainApi';
import { useTranslation } from 'react-i18next';
import { isATKO, isNEK } from '../../../../util/helpers';

export const RejectModal = ({ open, data, onClose, onSubmit }) => {
  const { t } = useTranslation();
  const { error } = useSelector(({ processes }) => processes);
  const [reason, setReason] = useState(null);

  const { data: reasonsData = {} } = useReferenceBookKeyQuery();

  const reasons = useMemo(() => {
    let rejectedReasons =
      isNEK() && isATKO()
        ? ['no_consent', 'canceled_by_owner', 'occupied', 'safety_threat']
        : ['no_consent', 'canceled_by_owner', 'occupied', 'safety_threat', 'ksp_no_compliance'];
    return Object.entries(reasonsData)
      .filter((e) => !rejectedReasons.includes(e[1]))
      .map(([label, value]) => ({
        label,
        value
      }));
  }, [reasonsData]);

  return (
    <ModalWrapper
      open={open}
      header={t('ADD_REASON_FOR_THE_IMPOSSIBILITY_OF_DISCONNECT_AP')}
      onClose={() => {
        onClose();
        setTimeout(() => setReason(null), 100);
      }}
    >
      <Grid container>
        <Typography
          variant={'body1'}
          style={{ paddingTop: 16, paddingBottom: 12, textTransform: 'uppercase' }}
          color={'error'}
        >
          {t('WARNING_AFTER_CONFIRMING_THE_ENTERED_VALUES_THEIR_CHANGE_WILL_NOT_BE_AVAILABLE')}
        </Typography>
      </Grid>
      <Grid container style={{ paddingTop: 30 }} spacing={3}>
        <Grid item xs={6}>
          <StyledInput label={`${t('FIELDS.AP_EIC_CODE')}:`} value={data?.eic} readOnly />
        </Grid>
        <Grid item xs={12}>
          <SelectField
            dataMarker={'reason'}
            label={t('FIELDS.REASON_FOR_THE_IMPOSSIBILITY_OF_DISCONNECTING_AP')}
            value={reason}
            onChange={(value) => {
              setReason(value);
            }}
            error={error?.detail}
            data={reasons}
          />
        </Grid>
      </Grid>
      <Grid container spacing={2} style={{ paddingTop: 40 }}>
        <Grid item xs={12} sm={6}>
          <BlueButton
            data-marker={'buttonModalClose'}
            style={{ width: '100%', textTransform: 'uppercase' }}
            onClick={() => {
              onClose();
              setTimeout(() => setReason(null), 100);
            }}
          >
            {t('CONTROLS.CANCEL')}
          </BlueButton>
        </Grid>
        <Grid item xs={12} sm={6}>
          <GreenButton
            data-marker={'buttonModalSave'}
            style={{ width: '100%', textTransform: 'uppercase' }}
            onClick={() => {
              onSubmit(reason);
              setTimeout(() => setReason(null), 100);
            }}
            disabled={!reason}
          >
            {t('CONTROLS.PERFORM')}
          </GreenButton>
        </Grid>
      </Grid>
    </ModalWrapper>
  );
};
