import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import CircleButton from '../../Theme/Buttons/CircleButton';
import { Card } from '../../Theme/Components/Card';
import { AutocompleteWithChips } from '../../Theme/Fields/AutocompleteWithChips';
import { disputesActions } from '../../../features/disputes/disputes.slice';
import { useTranslation } from 'react-i18next';

export const DisputeActions = ({ showDisputes, onDispute, onCancelDispute, onCreateDispute, disabledCreate }) => {
  const { t } = useTranslation();

  return (
    <>
      {!showDisputes && (
        <CircleButton
          type={'dispute'}
          title={t('CONTROLS.INIT_DISPUTE')}
          dataMarker={'tko-disputes'}
          onClick={onDispute}
        />
      )}

      {showDisputes && (
        <>
          <CircleButton
            type={'remove'}
            title={t('CONTROLS.CANCEL')}
            dataMarker={'tko-disputes-cancel'}
            onClick={onCancelDispute}
          />
          <CircleButton
            type={'forward'}
            title={t('CONTROLS.NEXT')}
            dataMarker={'tko-disputes-create'}
            onClick={onCreateDispute}
            disabled={disabledCreate}
          />
        </>
      )}
    </>
  );
};

export const CreateDispute = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { disputeProperties } = useSelector(({ disputes }) => disputes);
  const disputePropertiesOptions = Object.keys(disputeProperties).map((key) => ({
    value: key,
    label: disputeProperties[key]
  }));

  useEffect(() => {
    dispatch(disputesActions.getSettings());
  }, [dispatch]);

  const handleChange = (value) => {
    dispatch(disputesActions.setSelectedTypes(value.map((item) => item.value)));
  };

  return (
    <Card title={t('CHARACTERISTICS.CHOOSE_CONFICTTING_CHARACTERISTICS')}>
      <AutocompleteWithChips
        options={disputePropertiesOptions}
        label={t('FIELDS.CHARACTERISTICS')}
        textNoMoreOption={t('NO_MORE_CAHRACTERISTICT_TO_SELECT')}
        handleChange={handleChange}
      />
    </Card>
  );
};
