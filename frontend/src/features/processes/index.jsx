import { Navigate, Route, Routes } from 'react-router-dom';
import ProcessesList from './List';
import DeletingTko from './deletingTko';
import ExportApGeneration from './exportApGeneration';
import BindAccountingPointZV from './bindAccountingPointZV';
import AddingNewVirtualTko from './addingNewVirtualTko';
import BindAccountingPoint from './bindAccountingPoint';
import RequestUpdateBasicAp from './requestUpdateBasicAp';
import ChangeAccountingGroupZV from './changeAccountingGroupZV';
import UpdateRelatedSubcustomers from './updateRelatedSubcustomers';
import ActivateDeactivateTKO from './activateDeactivateTko';
import ActivateDeactivateDetails from './activateDeactivateTko/ActivateDeactivateDetails';
import RequestActivateAp from './activateDeactivateTko/requestActivateAp/RequestActivateAp';
import UploadZV from './mms/UploadZV';
import UpdateApHistory from './updateApHistory';
import ErpReportDetails from './erpReport/ErpReportDetails';
import InitErpReport from './erpReport';
import RequestChangePPKO from './changePPKO';
import ChangePPKOToOs from './changePPKO/ChangePPKOToOs';
import RequestChangePPKOApproval from './changePPKO/RequestChangePPKOApproval';
import DeletingTkoDetails from './deletingTko/deleting/DeletingTkoDetails';
import ArchivingTkoDetails from './deletingTko/archiving/ArchivingTkoDetails';
import UnArchiveTkoDetails from './deletingTko/unarchive/UnArchiveTkoDetails';
import CancelPPKO from './cancelPPKO';
import RequestCancelPPKO from './cancelPPKO/pages/RequestCancelPPKO';
import ExpireCancelPPKO from './cancelPPKO/pages/ExpireCancelPPKO';
import ProlongationSupply from './prolongationSupply/ProlongationSupply';
import CreateTKO from './createTKO';
import EnteringAp from './enteringAp';
import { isDisabledInit } from '../../util/getEnv';
import ReportGrexel from '../reportGrexel';
import UpdateApsHistory from './updateApsHistory';
import RequestToUpdateCustomers from './requestToUpdateCustomers';
import InitProlongationSupply from './prolongationSupply';
import ChangePaymentType from './changePaymentType';
import CorrectionArchivingTS from './correctionArchivingTS';
import RequestArchivingTS from './requestArchivingTS';
import AddNewApProperties from './AddNewApProperties';
import ActiveCustomerAp from './activeCustomerAp';
import RequestCorrectionTS from './requestCorrectionTS';
import TransferTsToGrexel from './transferTsToGrexel';
import AccountingServiceCompletion from './accountingServiceCompletion';

const Processes = () => {
  return (
    <Routes>
      <Route index element={<ProcessesList />} />
      <Route path={'deleting-tko/init'} element={<DeletingTko />} />
      <Route path={'deleting-tko/:uid'} element={<DeletingTkoDetails />} />
      <Route path={'dismantle-archive-ap/:uid'} element={<ArchivingTkoDetails />} />
      <Route path={'unarchive-ap/:uid'} element={<UnArchiveTkoDetails />} />
      <Route path={'export-ap-generation/'} exact element={<ExportApGeneration />} />
      <Route path={'export-ap-generation/:uid'} exact element={<ExportApGeneration />} />
      {!isDisabledInit('PROCESSES.BIND_ACCOUNTING_POINT_ZV.INITIALIZATION') && (
        <Route path={'bind-accounting-point-zv/'} exact element={<BindAccountingPointZV />} />
      )}
      <Route path={'bind-accounting-point-zv/:uid'} exact element={<BindAccountingPointZV />} />
      <Route path={'adding-new-virtual-tko/'} exact element={<AddingNewVirtualTko />} />
      <Route path={'adding-new-virtual-tko/:uid'} exact element={<AddingNewVirtualTko />} />
      {!isDisabledInit('PROCESSES.BIND_ACCOUNTING_POINT.INITIALIZATION') && (
        <Route path={'bind-accounting-point/'} exact element={<BindAccountingPoint />} />
      )}
      <Route path={'bind-accounting-point/:uid'} exact element={<BindAccountingPoint />} />
      <Route path={'request-update-basic-ap/:uid'} exact element={<RequestUpdateBasicAp />} />
      <Route path={'request-to-update-customers/:uid'} exact element={<RequestToUpdateCustomers />} />
      <Route path={'change-accounting-group-zv/'} exact element={<ChangeAccountingGroupZV />} />
      <Route path={'change-accounting-group-zv/:uid'} exact element={<ChangeAccountingGroupZV />} />
      <Route path={'update-related-subcustomers/'} exact element={<UpdateRelatedSubcustomers />} />
      <Route path={'update-related-subcustomers/:uid'} exact element={<UpdateRelatedSubcustomers />} />
      {!isDisabledInit('PROCESSES.ACTIVATING_DEACTIVATING.INITIALIZATION') && (
        <Route path={'activating-deactivating'} element={<ActivateDeactivateTKO />} />
      )}
      <Route path={'activating-deactivating/:uid'} element={<ActivateDeactivateDetails />} />
      <Route path={'activating-request/:uid'} element={<RequestActivateAp />} />
      <Route path={'mms/upload-zv'} element={<UploadZV />} />
      <Route path={'update-ap-history/'} exact element={<UpdateApHistory />} />
      <Route path={'update-ap-history/:uid'} exact element={<UpdateApHistory />} />
      <Route path={'erp-report/'} element={<InitErpReport />} />
      <Route path={'erp-report/:uid'} element={<ErpReportDetails />} />
      <Route path={'change-ppko-to-os/:uid'} exact element={<ChangePPKOToOs />} />
      {!isDisabledInit('PROCESSES.CHANGE_PPKO.INITIALIZATION') && (
        <Route path={'request-change-ppko/'} exact element={<RequestChangePPKO />} />
      )}
      <Route path={'request-change-ppko/:uid'} exact element={<RequestChangePPKO />} />
      <Route path={'request-change-ppko-approval/:uid'} exact element={<RequestChangePPKOApproval />} />
      <Route path={'cancel-ppko-registration/'} exact element={<CancelPPKO />} />
      <Route path={'cancel-ppko-registration/:uid'} exact element={<CancelPPKO />} />
      <Route path={'request-cancel-ppko-registration/:uid'} exact element={<RequestCancelPPKO />} />
      <Route path={'expire-cancel-ppko-registration/:uid'} exact element={<ExpireCancelPPKO />} />
      {!isDisabledInit('PROCESSES.PROLONGATION_SUPPLY.INITIALIZATION') && (
        <Route path={'prolongation-supply/init'} exact element={<InitProlongationSupply />} />
      )}
      <Route path={'prolongation-supply/:uid'} exact element={<ProlongationSupply />} />
      {!isDisabledInit('PROCESSES.CREATE_TKO.INITIALIZATION') && (
        <Route path={'create-tko/'} exact element={<CreateTKO />} />
      )}
      <Route path={'create-tko/:uid'} exact element={<CreateTKO />} />
      {!isDisabledInit('PROCESSES.ENTERING_AP.INITIALIZATION') && (
        <Route path={'entering-ap/'} exact element={<EnteringAp />} />
      )}
      <Route path={'entering-ap/:uid'} exact element={<EnteringAp />} />
      <Route path={'report-grexel/:uid'} exact element={<ReportGrexel />} />
      <Route path={'update-aps-history/:uid'} exact element={<UpdateApsHistory />} />
      {!isDisabledInit('PROCESSES.UPDATE_APS_HISTORY.INITIALIZATION') && (
        <Route path={'update-aps-history/'} exact element={<UpdateApsHistory />} />
      )}
      <Route path={'change-payment-type/:uid'} exact element={<ChangePaymentType />} />
      {!isDisabledInit('PROCESSES.CHANGE_PAYMENT_TYPE.INITIALIZATION') && (
        <Route path={'change-payment-type/'} exact element={<ChangePaymentType />} />
      )}
      <Route path={'correction-archiving-ts/:uid'} exact element={<CorrectionArchivingTS />} />
      <Route path={'correction-archiving-ts/'} exact element={<CorrectionArchivingTS />} />
      <Route path={'request-archiving-ts/:uid'} exact element={<RequestArchivingTS />} />
      <Route path={'request-correction-ts/:uid'} exact element={<RequestCorrectionTS />} />

      <Route path={'new-ap-properties/:uid'} exact element={<AddNewApProperties />} />
      <Route path={'new-ap-properties/'} exact element={<AddNewApProperties />} />

      <Route path={'active-customer-ap/:uid'} exact element={<ActiveCustomerAp />} />
      <Route path={'active-customer-ap/'} exact element={<ActiveCustomerAp />} />

      <Route path={'transfer-ts-to-grexel/:uid'} exact element={<TransferTsToGrexel />} />
      <Route path={'transfer-ts-to-grexel/'} exact element={<TransferTsToGrexel />} />

      <Route path={'accounting-service-completion'} exact element={<AccountingServiceCompletion />} />
      <Route path={'accounting-service-completion/:uid'} exact element={<AccountingServiceCompletion />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default Processes;
