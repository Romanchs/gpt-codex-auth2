import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Page from '../../../Global/Page';
import { DHTab, DHTabs } from '../../Processes/Components/Tabs';
import FilesTab from './FilesTab';
import SubprocessTab from './SubprocessTab';
import { useTranslation } from 'react-i18next';

const RegisterDetails = () => {
  const { t } = useTranslation();
  useSelector(({ user }) => user);
  const [tab, setTab] = useState('subprocess');

  const handleChangeTab = (event, newValue) => {
    setTab(newValue);
  };

  return (
    <Page pageName={t('PAGES.SEND_TO_MMS')} backRoute={'/process-manager'}>
      <div className={'boxShadow'} style={{ paddingLeft: 24, paddingRight: 24, marginBottom: 16 }}>
        <DHTabs value={tab} onChange={handleChangeTab}>
          <DHTab label={t('SUBPROCESES')} value={'subprocess'} />
          <DHTab label={t('FILES')} value={'files'} />
        </DHTabs>
      </div>
      {tab === 'subprocess' ? <SubprocessTab /> : <FilesTab />}
    </Page>
  );
};

export default RegisterDetails;
