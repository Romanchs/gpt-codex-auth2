import { useTranslation } from 'react-i18next';
import RequestsTable from './RequestsTable';

const RequestsActualDko = () => {
  const {t} = useTranslation();

  return <RequestsTable
    request_type={'actualDko'}
    company_name={t('ROLES.METERED_DATA_RESPONSIBLE')}
    pageName={t('PON.REQUESTS_ACTUAL_DKO')}
    basePath={'request-actual-dko/'}
  />
};

export default RequestsActualDko;
