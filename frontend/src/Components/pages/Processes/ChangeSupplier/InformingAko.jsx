import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

import { clearCurrentProcess, exportChangeSupplyAps } from '../../../../actions/processesActions';
import { checkPermissions } from '../../../../util/verifyRole';
import Page from '../../../Global/Page';
import Statuses from '../../../Theme/Components/Statuses';
import { DHTab, DHTabs } from '../Components/Tabs';
import InformingAkoFiles from './InformingAkoFiles';
import InformingAkoInforming from './InformingAkoInforming';
import InformingAkoPredictable from './InformingAkoPredictable';
import InformingAkoTkos from './InformingAkoTkos';
import { useTranslation } from 'react-i18next';
import CircleButton from '../../../Theme/Buttons/CircleButton';

const tabs = {
  tkos: 'tkos',
  files: 'files',
  informing: 'informing',
  predictable: 'predictable'
};

export const INFORMING_AKO_ACCEPT_ROLES = ['АКО_Процеси', 'АКО', 'АКО_Користувачі'];

const InformingAko = () => {
  const {t} = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { state } = useLocation();
  const {
    activeRoles: [{ relation_id }]
  } = useSelector(({ user }) => user);
  const { loading, currentProcess, notFound } = useSelector(({ processes }) => processes);
  const [tab, setTab] = useState(state?.tab || tabs.tkos);

  // Check roles & get data
  useEffect(() => {
    if (
      !checkPermissions('PROCESSES.CHANGE_SUPPLIER.INFORMING_AKO.ACCESS', INFORMING_AKO_ACCEPT_ROLES)
    ) {
      navigate('/processes');
    }
  }, [relation_id, navigate]);

  // Clear store after unmount
  useEffect(() => () => dispatch(clearCurrentProcess()), [dispatch]);

  const handleChangeTab = (_, newValue) => {
    setTab(newValue);
  };

  const handleExportAps = () => {
    dispatch(exportChangeSupplyAps(currentProcess?.uid));
  }

  return (
    <Page
      pageName={currentProcess?.id ? t('PAGES.CHANGE_SUPPLIER_ID', {id: currentProcess?.id}) : t('PAGES.CHANGE_SUPPLIER')}
      backRoute={'/processes'}
      loading={loading}
      faqKey={'PROCESSES__INFORMING_AKO_FOR_CHANGE_SUPPLIER'}
      notFoundMessage={notFound && t('PROCESS_NOT_FOUND')}
      controls={
        <>
          {(currentProcess?.status === 'FORMED' || currentProcess?.status === 'DONE') && (
            <CircleButton type={'download'} title={t('CONTROLS.EXPORT_TKO')} onClick={handleExportAps} dataMarker={'massExport'} />
          )}
        </>
      }
    >
      <Statuses statuses={['FORMED', 'DONE', 'COMPLETED', 'CANCELED']} currentStatus={currentProcess?.status} />
      <div className={'boxShadow'} style={{ paddingLeft: 24, paddingRight: 24, marginTop: 16, marginBottom: 16 }}>
        <DHTabs value={tab} onChange={handleChangeTab}>
          <DHTab label={t('REQUEST_DETAILS')} value={tabs.tkos} />
          <DHTab label={t('LOADED_AP_FILES')} value={tabs.files} />
          <DHTab label={t('INFORMING_MARKET_PARTICIPANTS')} value={tabs.informing} />
          <DHTab label={t('PREDICTABLE_FILES')} value={tabs.predictable} />
        </DHTabs>
      </div>
      {tab === tabs.tkos && <InformingAkoTkos />}
      {tab === tabs.files && <InformingAkoFiles />}
      {tab === tabs.informing && <InformingAkoInforming />}
      {tab === tabs.predictable && <InformingAkoPredictable />}
    </Page>
  );
};

export default InformingAko;
