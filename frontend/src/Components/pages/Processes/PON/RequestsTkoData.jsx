import { useTranslation } from 'react-i18next';
import RequestsTable from './RequestsTable';

const RequestsTkoData = () => {
  const {t} = useTranslation();

  return <RequestsTable
    request_type={'tko'}
    company_name={t('ROLES.METERING_POINT_ADMINISTRATOR')}
    pageName={t('PON.REQUESTS_TKO_DATA')}
    basePath={'request-tko-data/'}
  />
};

export default RequestsTkoData;
