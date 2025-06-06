import { useTranslation } from 'react-i18next';
import RequestsTable from './RequestsTable';

const RequestsHistoricalDko = () => {
  const {t} = useTranslation();

  return <RequestsTable
    request_type={'historicalDko'}
    company_name={t('ROLES.METERED_DATA_RESPONSIBLE')}
    pageName={t('PON.REQUESTS_HISTORICAL_DKO')}
    basePath={'request-historical-dko/'}
  />
};

export default RequestsHistoricalDko;
