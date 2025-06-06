import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { mainApi } from '../../app/mainApi';
import Page from '../../Components/Global/Page';
import FormedReportsTab from './FormedReportsTab';
import ListReportsTab from './ListReportsTab';
import { useCreateReportsMutation } from './api';
import { DHTab, DHTabs } from '../../Components/pages/Processes/Components/Tabs';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import PublishedReportsTab from './PublishedReportsTab';
import { verifyRole } from '../../util/verifyRole';

const TAB_LIST = 'list';
const TAB_FILES = 'files';
const TAB_PUBLISHED = 'published-files';

const defaultParams = {
  page: 1,
  size: 25,
  archive: 'false'
};

const defaultParamsPublished = {
  page: 1,
  size: 25
};

const tabParamsMap = {
  [TAB_LIST]: defaultParams,
  [TAB_FILES]: defaultParams,
  [TAB_PUBLISHED]: defaultParamsPublished
};

const Reports = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { search } = useLocation();
  const defaultTab = new URLSearchParams(search).get('tab');
  const [tab, setTab] = useState(defaultTab ?? TAB_LIST);
  const [params, setParams] = useState(tabParamsMap[tab] ?? defaultParams);
  const { relation_id } = useSelector(({ user }) => user.activeRoles[0]);
  const [prevRole, setPrevRole] = useState(relation_id);
  const [, { isLoading: isUpdating }] = useCreateReportsMutation({ fixedCacheKey: 'reports_createReport' });

  const { isFetching: isDataLoading } = mainApi.endpoints.getDataReports.useQueryState(
    tab === TAB_LIST ? { tab } : { tab, params }
  );

  useEffect(() => {
    if (prevRole !== relation_id) {
      setPrevRole(relation_id);
      dispatch(mainApi.util.invalidateTags(['REPORTS_DATA']));
    }
  }, [dispatch, prevRole, relation_id]);

  const handleTabChange = (_, newTab) => {
    setParams(tabParamsMap[newTab] ?? defaultParams);
    setTab(newTab);
  };

  return (
    <Page
      pageName={t('PAGES.REPORTS')}
      backRoute="/"
      loading={isDataLoading || isUpdating}
      faqKey="INFORMATION_BASE__REPORTS"
      acceptPermisions="REPORTS.ACCESS"
      rejectRoles={['АКО_Суперечки', 'АР (перегляд розширено)']}
    >
      <div className="boxShadow" style={{ marginTop: 16, marginBottom: 16, paddingLeft: 24, paddingRight: 24 }}>
        <DHTabs value={tab} onChange={handleTabChange}>
          <DHTab label={t('LIST_OF_REPORTS')} value={TAB_LIST} />
          <DHTab label={t('GENERATED_REPORTS')} value={TAB_FILES} />
          {verifyRole(['АТКО', 'СВБ']) && <DHTab label={t('PUBLISHED_REPORTS')} value={TAB_PUBLISHED} />}
        </DHTabs>
      </div>

      {tab === TAB_LIST && <ListReportsTab toFilesTab={() => setTab(TAB_FILES)} />}
      {tab === TAB_FILES && <FormedReportsTab params={params} setParams={setParams} />}
      {tab === TAB_PUBLISHED && <PublishedReportsTab params={params} setParams={setParams} />}
    </Page>
  );
};

export default Reports;
