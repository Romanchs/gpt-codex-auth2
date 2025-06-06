import { useTranslation } from 'react-i18next';
import RequestsTable from './RequestsTable';

const InformingPon = () => {
  const {t} = useTranslation();
  
  return <RequestsTable pageName={t('PON.INFORMING')} request_type={null} company_name={'ПОН'} basePath={'informing/'}/>
};

export default InformingPon;
