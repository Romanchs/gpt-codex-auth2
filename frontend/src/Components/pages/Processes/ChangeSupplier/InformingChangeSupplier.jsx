import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import {
  changeSupplierInforming,
  clearCurrentProcess,
  doneChangeSupplyInforming,
  exportChangeSupplyAps,
} from '../../../../actions/processesActions';
import { checkPermissions } from '../../../../util/verifyRole';
import Page from '../../../Global/Page';
import CircleButton from '../../../Theme/Buttons/CircleButton';
import Statuses from '../../../Theme/Components/Statuses';
import { useTranslation } from 'react-i18next';
import { DHTab, DHTabs } from '../Components/Tabs';
import InformingChangeSupplierDetailsTab from './InformingChangeSupplierDetailsTab';
import InformingChangeSupplierFilesTab from './InformingChangeSupplierFilesTab';

export const CHANGE_SUPPLIER_INFORMING_ATKO_ACCESS_ACCEPT_ROLES = ['АТКО'];
export const CHANGE_SUPPLIER_INFORMING_SUPPLIER_ACCESS_ACCEPT_ROLES = ['СВБ'];

const tabs = {
  details: 'details',
  files: 'files'
};

const InformingChangeSupplier = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { uid } = useParams();
  const {
    activeRoles: [{ relation_id }]
  } = useSelector(({ user }) => user);
  const { loading, currentProcess, notFound } = useSelector(({ processes }) => processes);
  const [params, setParams] = useState({ page: 1, size: 25 });
  const [tab, setTab] = useState(tabs.details);

  // Check roles & get data
  useEffect(() => {
    if (
      checkPermissions(
        'PROCESSES.CHANGE_SUPPLIER.INFORMING_ATKO.ACCESS',
        CHANGE_SUPPLIER_INFORMING_ATKO_ACCESS_ACCEPT_ROLES
      )
    ) {
      dispatch(changeSupplierInforming(uid, params, 'informing-atko-for-change-supplier'));
    } else if (
      checkPermissions(
        'PROCESSES.CHANGE_SUPPLIER.INFORMING_SUPPLIER.ACCESS',
        CHANGE_SUPPLIER_INFORMING_SUPPLIER_ACCESS_ACCEPT_ROLES
      )
    ) {
      dispatch(changeSupplierInforming(uid, params, 'informing-current-supplier'));
    } else {
      navigate('/processes');
    }
  }, [relation_id, params, dispatch, navigate]);

  // Clear store after unmount
  useEffect(() => () => dispatch(clearCurrentProcess()), [dispatch]);

  const handleDone = () => {
    dispatch(
      doneChangeSupplyInforming(
        uid,
        checkPermissions(
          'PROCESSES.CHANGE_SUPPLIER.INFORMING_ATKO.ACCESS',
          CHANGE_SUPPLIER_INFORMING_ATKO_ACCESS_ACCEPT_ROLES
        )
          ? 'informing-atko-for-change-supplier'
          : 'informing-current-supplier',
        (path) => dispatch(changeSupplierInforming(uid, params, path))
      )
    );
  };

  const handleExportAps = () => {
    dispatch(exportChangeSupplyAps(currentProcess?.uid));
  }

  const handleChangeTab = (_, newValue) => {
    setTab(newValue);
  };

  return (
    <Page
      pageName={
        currentProcess?.id ? t('PAGES.CHANGE_SUPPLIER_ID', { id: currentProcess?.id }) : t('PAGES.CHANGE_SUPPLIER')
      }
      backRoute={'/processes'}
      loading={loading}
      faqKey={
        checkPermissions(
          'PROCESSES.CHANGE_SUPPLIER.INFORMING_ATKO.ACCESS',
          CHANGE_SUPPLIER_INFORMING_ATKO_ACCESS_ACCEPT_ROLES
        )
          ? 'PROCESSES__INFORMING_ATKO_FOR_CHANGE_SUPPLIER'
          : 'PROCESSES__INFORMING_CURRENT_SUPPLIER'
      }
      notFoundMessage={notFound && t('PROCESS_NOT_FOUND')}
      controls={
        <>
          {currentProcess?.can_done_subprocess && (
            <CircleButton type={'done'} title={t('CONTROLS.ACQUAINTED')} onClick={handleDone} />
          )}
          {(currentProcess?.status === 'FORMED' || currentProcess?.status === 'DONE') && (
            <CircleButton type={'download'} title={t('CONTROLS.EXPORT_TKO')} onClick={handleExportAps} dataMarker={'massExport'} />
          )}
        </>
      }
    >
      <Statuses statuses={['NEW', 'DONE', 'CANCELED']} currentStatus={currentProcess?.status} />
       <div className={'boxShadow'} style={{ paddingLeft: 24, paddingRight: 24, marginTop: 16, marginBottom: 16 }}>
        <DHTabs value={tab} onChange={handleChangeTab}>
          <DHTab label={t('REQUEST_DETAILS')} value={tabs.details} />
          <DHTab label={t('LOADED_AP_FILES')} value={tabs.files} />
        </DHTabs>
      </div>
      {tab === tabs.details && <InformingChangeSupplierDetailsTab params={params} setParams={setParams}/>}
      {tab === tabs.files && <InformingChangeSupplierFilesTab />}
    </Page>
  );
};

export default InformingChangeSupplier;
