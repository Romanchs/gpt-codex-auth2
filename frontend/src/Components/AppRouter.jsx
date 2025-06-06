import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom';

import { tokenUndefined, verifyToken } from '../actions/userActions';
import { getFeature } from '../util/getFeature';
import Login from './auth/Login';
import Passwords from './auth/Passwords';
import DownloadExternalFile from './Global/DownloadExternalFile';
import SideNav from './Global/SideNav';
import User from './Global/User';
import AddUser from './pages/Admin/AddUser';
import Admin from './pages/Admin/Admin';
import Directories from './pages/Directories/Directories';
import Directory from './pages/Directories/Directory';
import GTS from './pages/GTS';
import CreateReport from './pages/GTS/CreateReport';
import GtsFiles from './pages/GTS/GtsFiles';
import GtsReports from './pages/GTS/GtsReports';
import GtsUploadResults from './pages/GTS/GtsUploadResults';
import Home from './pages/Home';
import Instructions from '../features/instructions';
import PpkoCheck from './pages/PPKO/PpkoCheck';
import PpkoDocumentDetail from './pages/PPKO/PpkoDocumentDetail';
import PpkoDocumentEdit from './pages/PPKO/PpkoDocumentEdit';
import PpkoEdit from './pages/PPKO/PpkoEdit';
import ChangeSupplier from './pages/Processes/ChangeSupplier';
import InformingAko from './pages/Processes/ChangeSupplier/InformingAko';
import InformingAkoDetail from './pages/Processes/ChangeSupplier/InformingAkoDetail';
import InformingChangeSupplier from './pages/Processes/ChangeSupplier/InformingChangeSupplier';
import InitChangeSupplier from './pages/Processes/ChangeSupplier/init';
import Predictable from './pages/Processes/ChangeSupplier/Predictable';
import ConnectingDisconnectingTKO from './pages/Processes/ConnectingDisconnectingTKO';
import ConnectingDisconnectingDetails from './pages/Processes/ConnectingDisconnectingTKO/ConnectingDisconnectingDetails';
import DisputeTkoDetails from './pages/Processes/DisputeTko/DisputeTkoDetails';
import DisputeTkoSubprocessDetails from './pages/Processes/DisputeTko/DisputeTkoSubprocessDetails';
import InitDisputeTko from './pages/Processes/DisputeTko/InitDisputeTko';
import ChangeTko from './pages/Processes/EndOfSupply/ChangeTko';
import Eos from './pages/Processes/EndOfSupply/eos/Eos';
import ExportOwnTko from './pages/Processes/EndOfSupply/ExportOwnTko';
import InitEOS from './pages/Processes/EndOfSupply/eos/InitEOS';
import GrantingAuthorityTkoDetails from './pages/Processes/GrantingAuthorityTKO/GrantingAuthorityTKODetails';
import InitGrantingAuthority from './pages/Processes/GrantingAuthorityTKO/InitGrantingAuthority';
import Mms from './pages/Processes/MMS';
import CreatedPON from './pages/Processes/PON/createdPON';
import Informing from './pages/Processes/PON/Informing';
import InformingDetail from './pages/Processes/PON/InformingDetail';
import InformingPon from './pages/Processes/PON/InformingPon';
import InitProcess from './pages/Processes/PON/initProcess';
import PONTkoList from './pages/Processes/PON/PONTkoList';
import ProvideActualDko from './pages/Processes/PON/ProvideActualDko';
import ProvideActualDkoDetails from './pages/Processes/PON/ProvideActualDkoDetails';
import RequestAD from './pages/Processes/PON/RequestAD';
import { RequestADResults } from './pages/Processes/PON/RequestADResults';
import RequestHD from './pages/Processes/PON/RequestHD';
import { RequestHDResults } from './pages/Processes/PON/RequestHDResults';
import RequestsActualDko from './pages/Processes/PON/RequestsActualDko';
import RequestsHistoricalDko from './pages/Processes/PON/RequestsHistoricalDko';
import RequestsTkoData from './pages/Processes/PON/RequestsTkoData';
import RequestTko from './pages/Processes/PON/RequestTko';
import Processes from '../features/processes';
import InitReceivingDkoHistorical from './pages/Processes/ReceivingDkoHistorical/InitReceivingDkoHistorical';
import ReceivingDkoHistorical from './pages/Processes/ReceivingDkoHistorical/ReceivingDkoHistorical';
import InitReceivingDkoActual from './pages/Processes/RecievingDkoActual/InitReceivingDkoActual';
import ReceivingDkoActual from './pages/Processes/RecievingDkoActual/ReceivingDkoActual';
import InitTerminationResumption from './pages/Processes/TerminationResumptionTko/InitTerminationResumption';
import TerminationResumptionDetails from './pages/Processes/TerminationResumptionTko/TerminationResumptionDetails';
import PS from '../features/ps';
import ProcessSettings from '../features/ps/ProcessSettings';
import Reports from '../features/reports';
import SupplierHistory from './pages/Suppliers/History';
import Suppliers from './pages/Suppliers/Main';
import TempUserActivation from './pages/Suppliers/TempUserActivation';
import Transfer from './pages/Suppliers/Transfer';
import TimeSeries from './pages/TimeSeries/TimeSeries';
import Tko from './pages/TKO/Tko';
import TkoList from './pages/TKO/List/TkoList';
import Zv from './pages/ZV';
import { RolesManagement } from '../features/rolesManagement';
import { DisputesRoutes } from '../features/disputes';
import ProcessManagers from '../features/pm';
import Ppko from '../features/ppko';
import GtsRoutes from '../features/gts';
import MonitoringDkoRoutes from '../features/monitoringDko/Routes';
import ConstructorPointsZV from '../features/constructorZV';
import { UsersDirectoryRoutes } from '../features/usersDirectory';
import { IS_PROD, isDisabledInit } from '../util/getEnv';
import { MRRoutes } from '../features/meterReading';
import { NotFoundPage } from './errors/NotFoundPage';
import { useIsActiveMaintenanceQuery, useMaintenanceInfoQuery } from '../features/techWork/api';
import { clearLocalStorage } from '../util/helpers';
import MaintenanceDialogs from '../features/techWork/components/MaintenanceDialogs';
import MaintenanceLogin from '../features/techWork/components/MaintenanceLogin';
import MaintenanceSnackbar from '../features/techWork/components/MaintenanceSnackbar';
import Tools from '../features/Tools';
import CompanyDetails from './pages/Directories/Companies/CompanyDetails';
import CompanyHistory from './pages/Directories/Companies/CompanyHistory';
import Notifications from '../features/notifications';
import ActionsLogRoutes from '../features/actionsLog';
import { Audits } from '../features/audit';
import FAQ from '../features/faq';
import SettingReport from './pages/GTS/ArReport';
import TechWorkRoutes from '../features/techWork/TechWorkRoutes';
import UpdateSubApMeter from '../features/processes/updateSubApMeter';
import { accessToFaq } from '../features/faq/utils';
import DownloadFile from './Global/DownloadFile';
import { allowedRoutesOnMaintenance } from '../features/techWork/TeckWorkHome/constants';
import PublicationCMD from '../features/publicationCMD';

const AppRouter = () => {
  const dispatch = useDispatch();
  const { pathname, search } = useLocation();
  const authorized = useSelector((store) => store.user.authorized);
  const { data, isSuccess, isError } = useIsActiveMaintenanceQuery();

  const { data: info } = useMaintenanceInfoQuery(null, {
    skip: !authorized
  });

  const isMaintenanceFetched = isSuccess || isError;
  const isMaintenance = Boolean(data) || isError;

  const is404 = pathname === '/file-not-found';

  useEffect(() => {
    if (!isMaintenanceFetched) return;
    if (isMaintenance) {
      clearLocalStorage();
      dispatch(tokenUndefined());
      return;
    }
    if (localStorage.getItem('auth_token') && localStorage.getItem('refresh_token') && !is404) {
      dispatch(verifyToken());
    } else {
      clearLocalStorage();
      dispatch(tokenUndefined());
    }
  }, [dispatch, isMaintenanceFetched, isMaintenance, is404]);

  if (isMaintenance && !allowedRoutesOnMaintenance.includes(pathname)) {
    return <MaintenanceLogin data={data} />;
  }

  if (is404) {
    return <NotFoundPage message={'Файл не знайдено...'} />;
  }

  if (pathname === '/manage-passwords' && search.startsWith('?token=')) {
    return <Passwords token={search.replace('?token=', '')} />;
  }

  if (!authorized) {
    return <Login />;
  }

  return (
    <div className={'page'}>
      <Routes>
        <Route
          path={'/'}
          element={
            <>
              <SideNav />
              <Outlet />
              <User />
            </>
          }
        >
          <Route index exact element={<Home />} />
          <Route path="/tko" exact element={<TkoList />} />
          <Route path="/tko/:id" exact element={<Tko />} />
          <Route path={'/ppko/*'} exact element={<Ppko />} />
          <Route path={'/ppko/edit/:id'} exact element={<PpkoEdit />} />
          <Route path={'/ppko/edit/documentation/:id'} exact element={<PpkoDocumentEdit />} />
          <Route path={'/ppko/documentation/:id'} exact element={<PpkoDocumentDetail />} />
          <Route path={'/ppko/check/:id'} exact element={<PpkoCheck />} />
          <Route path={'/admin/user'} exact element={<Admin />} />
          <Route path={'/admin/manage-user'} exact element={<AddUser />} />
          <Route path={'/admin/manage-user/:id'} exact element={<AddUser />} />
          <Route path={'/directories'} exact element={<Directories />} />
          <Route path={'/directories/:id'} exact element={<Directory />} />
          <Route path={'/directories/companies/:uid'} exact element={<CompanyDetails />} />
          <Route path={'/directories/companies/:uid/history'} exact element={<CompanyHistory />} />
          <Route path={'/time-series'} exact element={<TimeSeries />} />
          <Route path={'/instructions'} exact element={<Instructions />} />
          <Route path={'/reports'} exact element={<Reports />} />
          {/*<Route path={'/processes'} exact element={<Processes />} />*/}
          {/* ===== PON =====*/}
          <Route path={'/processes/*'} exact element={<Processes />} />
          <Route path="/processes/pon/init" exact element={<InitProcess />} />
          <Route path="/processes/pon/:uid" exact element={<CreatedPON />} />
          <Route path="/processes/pon/:uid/requests-tko-data" exact element={<RequestsTkoData />} />
          <Route path="/processes/pon/:uid/requests-historical-dko" exact element={<RequestsHistoricalDko />} />
          <Route path="/processes/pon/:uid/requests-actual-dko" exact element={<RequestsActualDko />} />
          <Route path="/processes/pon/:uid/informing" exact element={<InformingPon />} />
          <Route path="/processes/pon/:uid/tko-list" exact element={<PONTkoList />} />
          <Route path="/processes/pon/request-tko-data/:uid" exact element={<RequestTko />} />
          <Route path="/processes/pon/request-historical-dko/:uid" exact element={<RequestHD />} />
          <Route path="/processes/pon/request-historical-dko/:uid/results" exact element={<RequestHDResults />} />
          <Route path="/processes/pon/request-actual-dko/:uid" exact element={<RequestAD />} />
          <Route path="/processes/pon/request-actual-dko/:uid/results" exact element={<RequestADResults />} />
          <Route path="/processes/pon/informing/:uid" exact element={<Informing />} />
          <Route path="/processes/pon/informing/:uid/tko/:tko_uid" exact element={<InformingDetail />} />
          <Route path="/processes/pon/provide-actual-dko/:uid" exact element={<ProvideActualDko />} />
          <Route
            path="/processes/pon/provide-actual-dko/:uid/tko/:tko_uid"
            exact
            element={<ProvideActualDkoDetails />}
          />

          <Route path={'/processes/end-of-supply/init'} exact element={<InitEOS />} />
          <Route path={'/processes/end-of-supply/:uid'} exact element={<Eos />} />
          <Route path={'/processes/export-own-tko/'} exact element={<ExportOwnTko />} />
          <Route path={'/processes/export-own-tko/:uid'} exact element={<ExportOwnTko />} />
          <Route path={'/processes/change-main-data-tko'} exact element={<ChangeTko />} />
          <Route path={'/processes/change-main-data-tko/:uid'} exact element={<ChangeTko />} />

          <Route path={'/processes/mms'} exact element={<Mms />} />

          <Route path={'/suppliers'} exact element={<Suppliers />} />
          <Route path={'/temp-user-activation'} exact element={<TempUserActivation />} />
          <Route path={'/suppliers/history/:uid'} exact element={<SupplierHistory />} />
          <Route path={'/suppliers/transfer/:type'} exact element={<Transfer />} />

          <Route path={'/processes/connecting-disconnecting/'} exact element={<ConnectingDisconnectingTKO />} />
          <Route path={'/processes/connecting-disconnecting/:uid'} exact element={<ConnectingDisconnectingDetails />} />

          <Route path={'/processes/termination-resumption/'} exact element={<InitTerminationResumption />} />
          <Route path={'/processes/termination-resumption/:uid'} exact element={<TerminationResumptionDetails />} />

          {!isDisabledInit('PROCESSES.RECEIVING_DKO_ACTUAL.INITIALIZATION') && (
            <Route path={'/processes/receiving-dko-actual/init'} exact element={<InitReceivingDkoActual />} />
          )}
          <Route path={'/processes/receiving-dko-actual/:uid'} exact element={<ReceivingDkoActual />} />

          {!isDisabledInit('PROCESSES.RECEIVING_DKO_HISTORICAL.INITIALIZATION') && (
            <Route path={'/processes/receiving-dko-historical/init'} exact element={<InitReceivingDkoHistorical />} />
          )}
          <Route path={'/processes/receiving-dko-historical/:uid'} exact element={<ReceivingDkoHistorical />} />

          <Route path={'/processes/change-supplier/init'} exact element={<InitChangeSupplier />} />
          <Route path={'/processes/change-supplier/:uid'} exact element={<ChangeSupplier />} />
          <Route path={'/processes/predictable-consumption-odko/:uid'} exact element={<Predictable />} />
          <Route path={'/processes/informing/:uid'} exact element={<InformingChangeSupplier />} />
          <Route path={'/processes/informing-ako/:uid'} exact element={<InformingAko />} />
          <Route path={'/processes/informing-ako/:uid/:type'} exact element={<InformingAkoDetail />} />

          <Route path={'/processes/granting-authority/init'} exact element={<InitGrantingAuthority />} />
          <Route path={'/processes/granting-authority/:uid'} exact element={<GrantingAuthorityTkoDetails />} />

          <Route path={'/processes/dispute-tko/init'} exact element={<InitDisputeTko />} />
          <Route path={'/processes/dispute-tko/:uid'} exact element={<DisputeTkoDetails />} />
          <Route path={'/processes/dispute-tko/subprocess/:uid'} exact element={<DisputeTkoSubprocessDetails />} />

          {!isDisabledInit('PROCESSES.UPDATE_SUB_AP_METER.INITIALIZATION') && (
            <Route path={'/processes/update-sub-ap-meter'} exact element={<UpdateSubApMeter />} />
          )}
          {!isDisabledInit('PROCESSES.UPDATE_SUB_AP_METER.INITIALIZATION') && (
            <Route path={'/processes/update-sub-ap-meter/:uid'} exact element={<UpdateSubApMeter />} />
          )}

          {/*<Route path={'/gts'} exact element={<GTS />} />*/}
          {/*<Route path={'/gts/files'} exact element={<GtsFiles />} />*/}
          {/*<Route path={'/gts/files/:uid'} exact element={<GtsUploadResults />} />*/}
          {/*<Route path={'/gts/dko/:uid'} exact element={<GtsDko />} />*/}
          {/*<Route path={'/gts/reports'} exact element={<GtsReports />} />*/}
          {/*<Route path={'/gts/reports/settings'} exact element={<CreateReport />} />*/}

          <Route path={'/gts'} exact element={<GTS />} />
          <Route path={'/gts/files'} exact element={<GtsFiles />} />

          <Route path={'/gts/files/:uid'} exact element={<GtsUploadResults />} />
          <Route path={'/gts/reports'} exact element={<GtsReports />} />
          <Route path={'/gts/reports/settings'} exact element={<CreateReport />} />
          <Route path={'/gts/reports/setting'} exact element={<SettingReport />} />
          <Route path={'/gts/*'} exact element={<GtsRoutes />} />
          <Route path={'/zv'} exact element={<Zv />} />

          <Route path={'/download-external-file/:id'} exact element={<DownloadExternalFile />} />
          <Route path={'/download-file/:id'} exact element={<DownloadFile />} />

          <Route path={'/process-manager/*'} exact element={<ProcessManagers />} />
          {/* <Route path={'/process-manager'} exact element={<PM />} />
        <Route path={'/process-manager/:uid'} exact element={<RegisterDetails/>} /> */}

          <Route path={'/process-settings'} exact element={<PS />} />
          <Route path={'/process-settings/:process_name'} exact element={<ProcessSettings />} />

          <Route path={'/disputes/*'} exact element={<DisputesRoutes />} />

          {accessToFaq() && <Route path={'/faq/*'} exact element={<FAQ />} />}

          <Route path={'/notifications'} exact element={<Notifications />} />

          {getFeature('rolesManage') && <Route path={'/admin/roles-manage/*'} exact element={<RolesManagement />} />}

          <Route path={'/monitoring-dko/*'} exact element={<MonitoringDkoRoutes />} />

          <Route path={'/constructor-ZV/*'} exact element={<ConstructorPointsZV />} />

          <Route path={'/users-directory/*'} exact element={<UsersDirectoryRoutes />} />

          <Route path={'/meter-reading/*'} exact element={<MRRoutes />} />

          <Route path={'/tech/*'} exact element={<TechWorkRoutes />} />

          {getFeature('tools') && <Route path={'/tools/*'} exact element={<Tools />} />}

          <Route path={'actions-log/*'} exact element={<ActionsLogRoutes />} />

          {
            !IS_PROD &&
            <Route path={'publication-cmd'} exact element={<PublicationCMD />} />
          }

          <Route path={'audits/*'} exact element={<Audits />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
      <MaintenanceDialogs data={info} />
      <MaintenanceSnackbar data={info} />
    </div>
  );
};

export default AppRouter;
