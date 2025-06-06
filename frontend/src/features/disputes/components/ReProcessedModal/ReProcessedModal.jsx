import Grid from '@material-ui/core/Grid';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { ModalWrapper } from '../../../../Components/Modal/ModalWrapper';
import { BlueButton } from '../../../../Components/Theme/Buttons/BlueButton';
import { GreenButton } from '../../../../Components/Theme/Buttons/GreenButton';
import DatePicker from '../../../../Components/Theme/Fields/DatePicker';
import SelectField from '../../../../Components/Theme/Fields/SelectField';
import StyledInput from '../../../../Components/Theme/Fields/StyledInput';
import { DATA_TYPES, PROPERTIES_TYPE } from '../../constants';
import { disputesActions } from '../../disputes.slice';
import { Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';

const getLabel = (data_type) => {
  if (data_type === DATA_TYPES.FORMED_INITIATOR) {
    return 'FORMED_INITIATOR';
  }

  if (data_type === DATA_TYPES.FORMED_EXECUTOR) {
    return 'FORMED_EXECUTOR';
  }

  if (data_type === DATA_TYPES.FORMED_AKO) {
    return 'CHARACTERISTICS.AKO';
  }
};

export const ReProcessedModal = ({
  disputeEntity: { uid, data_type } = {},
  property: { property_code, by_initiator, by_executor, property_data_type, property_data_list } = {},
  open,
  onSubmit,
  onClose
}) => {
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const propVal = data_type === DATA_TYPES.FORMED_INITIATOR ? by_initiator : by_executor;
  const [value, setValue] = useState(propVal);
  const [error, setError] = useState(null);

  const label = t(getLabel(data_type));

  const handleSubmit = async () => {
    if (!value) {
      return setError(t('VERIFY_MSG.ENTER_CORRECT_VALUE'));
    }

    try {
      const params = { tko_properties: { [property_code]: value } };
      const { error } = await dispatch(disputesActions.updateProperty({ uid, params }));

      if (error) {
        throw new Error(t('VERIFY_MSG.ENTERED_UNCORRECT_DATA'));
      }

      onSubmit({ uid, params });
      onClose();
    } catch (ex) {
      return setError(ex.message);
    }
  };

  useEffect(() => {
    return () => {
      setValue(null);
      setError(null);
    };
  }, [open]);

  return (
    <ModalWrapper maxWidth={'lg'} header={<p>{t('FINALIZATION_DATA')}</p>} open={open} onClose={onClose}>
      <Grid item style={{ width: 560, paddingTop: 40, paddingBottom: 30 }}>
        {property_data_type === PROPERTIES_TYPE.STR && (
          <StyledInput
            error={error}
            required
            label={t('EDITING_FROM', {name: label})}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            dataMarker={'input_propose'}
          />
        )}
        {property_data_type === PROPERTIES_TYPE.DATE && (
          <DatePicker
            error={error}
            required
            label={t('EDITING_FROM', {name: label})}
            value={value}
            onChange={(d) => setValue(moment(d).format('yyyy-MM-DD'))}
            maxDate={new Date('9999-12-31')}
            dataMarker={'input_propose'}
          />
        )}
        {property_data_type === PROPERTIES_TYPE.LIST && (
          <SelectField
            label={t('EDITING_FROM', {name: label})}
            value={value}
            data={property_data_list.map((property) => ({
              value: property,
              label: property
            }))}
            onChange={(value) => setValue(value)}
            dataMarker={'input_propose'}
          />
        )}
      </Grid>
      <Stack direction={'row'} sx={{ pt: 3 }} justifyContent={'space-between'} spacing={1}>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <BlueButton onClick={onClose} style={{ width: '100%' }}>
              {t('CONTROLS.CANCEL')}
            </BlueButton>
          </Grid>
          <Grid item xs={6}>
            <GreenButton onClick={handleSubmit} style={{ width: '100%' }}>
              {t('CONTROLS.ENGAGE')}
            </GreenButton>
          </Grid>
        </Grid>
      </Stack>
    </ModalWrapper>
  );
};
