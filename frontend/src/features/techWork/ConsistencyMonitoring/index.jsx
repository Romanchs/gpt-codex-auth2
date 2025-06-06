import Page from '../../../Components/Global/Page';
import { useTranslation } from 'react-i18next';
import ConsistencyAccordion from './ConsistencyAccordion';
import { useReportsListQuery } from '../api';

const QualityMonitoring = () => {
  const { t } = useTranslation();
  const { data, isFetching } = useReportsListQuery();

  return (
    <Page
      acceptPermisions={'TECH_WORK.ACCESS'}
      acceptRoles={['АКО_Процеси']}
      pageName={t('PAGES.DATA_CONSISTENCY_MONITORING')}
      backRoute={'/tech'}
      loading={isFetching}
    >
      {data?.map((element) => (
        <ConsistencyAccordion key={element.group} data={element} />
      ))}
    </Page>
  );
};

export default QualityMonitoring;
