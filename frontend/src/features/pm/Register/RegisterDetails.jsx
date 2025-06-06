import React, { useState } from 'react';
import Page from '../../../Components/Global/Page';
import { DHTab, DHTabs } from '../../../Components/pages/Processes/Components/Tabs';
import { useGetListPMQuery } from './api';
import { mainApi } from '../../../app/mainApi';
import FilesTab from './FilesTab';
import SubprocessTab from './SubprocessTab';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

const tabs = ['subprocess', 'files'];
const defaultParams = { page: 1, size: 25 };

const RegisterDetails = () => {
  const { t } = useTranslation();
  const { uid } = useParams();
  const [tab, setTab] = useState(tabs[0]);
  const [params, setParams] = useState(defaultParams);
  const { data: runningProcess, isFetching: isDataLoading, isError: notFound } = useGetListPMQuery({ uid });
  const { isFetching: isFilesLoading } = mainApi.endpoints.getFilesPM.useQueryState({ uid, params });

  const handleChangeTab = (...args) => {
    setTab(args[1]);
    if (args[1] === tabs[1]) {
      setParams(defaultParams);
    }
  };

  return (
    <Page
      pageName={runningProcess?.parent_process_name || `${t('LOADING')}...`}
      backRoute={'/process-manager'}
      loading={isDataLoading || isFilesLoading}
      notFoundMessage={notFound && t('PROCESS_NOT_FOUND')}
    >
      <div className={'boxShadow'} style={{ marginBottom: 16, paddingLeft: 24, paddingRight: 24 }}>
        <DHTabs value={tab} onChange={handleChangeTab}>
          <DHTab label={t('SUBPROCESES')} value={tabs[0]} />
          <DHTab label={t('FILES')} value={tabs[1]} />
        </DHTabs>
      </div>
      {tab === tabs[0] && <SubprocessTab process={runningProcess || { uid: null, status: '' }} />}
      {tab === tabs[1] && <FilesTab params={params} setParams={setParams} />}
    </Page>
  );
};

export default RegisterDetails;
