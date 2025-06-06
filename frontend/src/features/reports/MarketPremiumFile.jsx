import SelectField from '../../Components/Theme/Fields/SelectField';
import { useTranslation } from 'react-i18next';
import { useMarkerPremiumFilesQuery } from './api';

export const MarketPremiumFile = ({value, onChange}) => {
  const {t} = useTranslation();
  const {data} = useMarkerPremiumFilesQuery();

  return (
    <SelectField value={value} label={t('CONTROLS.CHOOSE_FILE')} data={data || []} ignoreI18 onChange={onChange}/>
  )
}