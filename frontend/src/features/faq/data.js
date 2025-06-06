import { DIRECTORIES_ACCEPT_ROLES } from '../../Components/pages/Directories/Directories';
import { GTS_TKO_LIST_VIEW_ACCEPT_ROLES } from '../../Components/pages/GTS';
import { CREATE_GTS_REPORT_ACCEPT_ROLES } from '../../Components/pages/GTS/CreateReport';
import { GTS_FILES_ACCEPT_ROLES } from '../../Components/pages/GTS/GtsFiles';
import { GTS_UPLOAD_RESULTS_ACCEPT_ROLES } from '../../Components/pages/GTS/GtsUploadResults';
import { CHANGE_SUPPLIER_ACCESS_ACCEPT_ROLES } from '../../Components/pages/Processes/ChangeSupplier';
import { INFORMING_AKO_ACCEPT_ROLES } from '../../Components/pages/Processes/ChangeSupplier/InformingAko';
import {
  CHANGE_SUPPLIER_INFORMING_ATKO_ACCESS_ACCEPT_ROLES,
  CHANGE_SUPPLIER_INFORMING_SUPPLIER_ACCESS_ACCEPT_ROLES
} from '../../Components/pages/Processes/ChangeSupplier/InformingChangeSupplier';
import { CONNECTING_DISCONNECTING_INITIALIZATION_ACCEPT_ROLES } from '../../Components/pages/Processes/ConnectingDisconnectingTKO';
import { CONNECTING_DISCONNECTING_ACCESS_ACCEPT_ROLES } from '../../Components/pages/Processes/ConnectingDisconnectingTKO/ConnectingDisconnectingDetails';
import { DISPUTE_TKO_ACCEPT_ROLES } from '../../Components/pages/Processes/DisputeTko/DisputeTkoDetails';
import { DISPUTE_TKO_SUBPROCESS_ACCEPT_ROLES } from '../../Components/pages/Processes/DisputeTko/DisputeTkoSubprocessDetails';
import { UPDATE_TKO_DATA_ACCESS_ACCEPT_ROLES } from '../../Components/pages/Processes/EndOfSupply/ChangeTko';
import { EXPORT_OWN_TKO_ACCESS_ACCEPT_ROLES } from '../../Components/pages/Processes/EndOfSupply/ExportOwnTko';
import { END_OF_SUPPLY_ACCEPT_ROLES } from '../../Components/pages/Processes/EndOfSupply/eos/Eos';
import { GRANTING_AUTHORITY_ACCEPT_ROLES } from '../../Components/pages/Processes/GrantingAuthorityTKO/GrantingAuthorityTKODetails';
import { MMS_ACCEPT_ROLES } from '../../Components/pages/Processes/MMS';
import { INFORMING_PON_ACCEPT_ROLES } from '../../Components/pages/Processes/PON/Informing';
import { PROVIDE_ACTUAL_DKO_ACCEPT_ROLES } from '../../Components/pages/Processes/PON/ProvideActualDko';
import { REQUEST_ACTUAL_DKO_ACCEPT_ROLES } from '../../Components/pages/Processes/PON/RequestAD';
import { REQUEST_HISTORICAL_DKO_ACCEPT_ROLES } from '../../Components/pages/Processes/PON/RequestHD';
import { REQUEST_TKO_ACCEPT_ROLES } from '../../Components/pages/Processes/PON/RequestTko';
import { CREATE_PON_ACCEPT_ROLES } from '../../Components/pages/Processes/PON/createdPON';
import { INIT_PON_ACCEPT_ROLES } from '../../Components/pages/Processes/PON/initProcess';
import { RECEIVING_DKO_HISTORICAL_ACCEPT_ROLES } from '../../Components/pages/Processes/ReceivingDkoHistorical/ReceivingDkoHistorical';
import { RECEIVING_DKO_ACTUAL_ACCEPT_ROLES } from '../../Components/pages/Processes/RecievingDkoActual/ReceivingDkoActual';
import { INIT_TERMINATION_RESUMPTION_ACCEPT_ROLES } from '../../Components/pages/Processes/TerminationResumptionTko/InitTerminationResumption';
import { TERMINATION_RESUMPTION_ACCEPT_ROLES } from '../../Components/pages/Processes/TerminationResumptionTko/TerminationResumptionDetails';
import { MASS_DOWNLOAD_DKO_ACCEPT_ROLES } from '../../Components/pages/TimeSeries/TimeSeries';
import { ZV_ACCEPT_ROLES } from '../../Components/pages/ZV';
import { checkOneOfPermissions, checkPermissions } from '../../util/verifyRole';
import { ACTIONS_LOG_ACCEPT_ROLES } from '../actionsLog/ActionsLog';
import { AUDITS_READ_PERMISSION, AUDITS_READ_ROLES } from '../audit';
import { DISPUTE_ALLOWED_ROLES } from '../disputes/constants';
import { GTS_REGION_BALANCE_ACCEPT_ROLES } from '../gts/regionBalance';
import { INFORMING_METER_READING_TRANSFER_PPKO_ACCEPT_ROLES } from '../meterReading/InformingSubProcess';
import { METER_READING_TRANSFER_PPKO_ACCEPT_ROLES } from '../meterReading/Process';
import { METER_READING_UPLOADS_ACCEPT_ROLES } from '../meterReading/Uploads';
import { METER_READING_ACCEPT_ROLES } from '../meterReading/View';
import { MONITORING_DKO_ACCEPT_ROLES } from '../monitoringDko/View';
import { PROCESS_MANAGER_ACCEPT_ROLES } from '../pm/ProcessManager';
import { NEW_AP_PROPERTIES_INITIALIZATION_ACCEPT_ROLES } from '../processes/AddNewApProperties';
import { PROCESSES_LIST_ACCEPT_ROLES } from '../processes/List';
import { ACTIVATING_DEACTIVATING_INITIALIZATION_ACCEPT_ROLES } from '../processes/activateDeactivateTko';
import { ACTIVATE_DEACTIVATE_ACCEPT_ROLES } from '../processes/activateDeactivateTko/ActivateDeactivateDetails';
import { REQUEST_ACTIVATE_ACCEPT_ROLES } from '../processes/activateDeactivateTko/requestActivateAp/RequestActivateAp';
import { ACTIVE_CUSTOMER_AP_ACCEPT_ROLES } from '../processes/activeCustomerAp';
import { ADDING_NEW_VIRTUAL_TKO_ACCEPT_ROLES } from '../processes/addingNewVirtualTko';
import { BIND_ACCOUNTING_POINT_ACCESS_ACCEPT_ROLES } from '../processes/bindAccountingPoint';
import { BIND_ACCOUNTING_POINT_ZV_ACCEPT_ROLES } from '../processes/bindAccountingPointZV';
import { CANCEL_PPKO_ACCEPT_ROLES } from '../processes/cancelPPKO';
import { EXPIRE_CANCEL_PPKO_ACCEPT_ROLES } from '../processes/cancelPPKO/pages/ExpireCancelPPKO';
import { REQUEST_CANCEL_PPKO_REGISTRATION_ACCEPT_ROLES } from '../processes/cancelPPKO/pages/RequestCancelPPKO';
import { CHANGE_ACCOUNTING_GROUP_ZV_ACCESS_ACCEPT_ROLES } from '../processes/changeAccountingGroupZV';
import { CHANGE_PPKO_ACCESS_ACCEPT_ROLES } from '../processes/changePPKO';
import { CHANGE_PAYMENT_TYPE_ACCESS_ACCEPT_ROLES } from '../processes/changePaymentType';
import { CORRECTION_ARCHIVING_TS_ACCEPT_ROLES } from '../processes/correctionArchivingTS';
import { CREATE_TKO_ACCESS_ACCEPT_ROLES } from '../processes/createTKO';
import { DELETE_ACTIVATE_TKO_INITIALIZATION_ACCEPT_ROLES } from '../processes/deletingTko';
import { ARCHIVING_AP_ACCEPT_ROLES } from '../processes/deletingTko/archiving/ArchivingTkoDetails';
import { DELETE_AP_ACCEPT_ROLES } from '../processes/deletingTko/deleting/DeletingTkoDetails';
import { ENTERING_AP_INTO_ACCOUNTING_ACCESS_ACCEPT_ROLES } from '../processes/enteringAp';
import { REPORT_ERP_ACCEPT_ROLES } from '../processes/erpReport/ErpReportDetails';
import { EXPORT_AP_GENERATION_ACCEPT_ROLES } from '../processes/exportApGeneration';
import { PROLONGATION_SUPPLY_ACCEPT_ROLES } from '../processes/prolongationSupply/ProlongationSupply';
import { REQUEST_ACTUALIZATION_TKO_ACCEPT_ROLES } from '../processes/requestUpdateBasicAp';
import { UPDATE_AP_HISTORY_ACCESS_ACCEPT_ROLES } from '../processes/updateApHistory';
import { UPDATE_APS_HISTORY_ACCEPT_ROLES } from '../processes/updateApsHistory';
import { UPDATE_RELATED_SUBCUSTOMERS_ACCESS_ACCEPT_ROLES } from '../processes/updateRelatedSubcustomers';
import { PROCESS_SETTINGS_ACCEPT_ROLES } from '../ps';
import { REPORT_GREXEL_ACCEPT_ROLES } from '../reportGrexel';
import { USERS_DIRECTORY_ACCEPT_ROLES } from '../usersDirectory/UsersDirectory';
import { GTS_REPORTS_ACCEPT_ROLES } from '../../Components/pages/GTS/constants';
import { IS_PROD } from '../../util/getEnv';
import { UN_ARCHIVE_ACCEPT_ROLES } from '../processes/deletingTko/unarchive/UnArchiveTkoDetails';
import {
  PUBLICATION_CMD_ACCEPT_PERMISION,
  PUBLICATION_CMD_ACCEPT_ROLES
} from '../publicationCMD';

export const NAV_WIDTH = 300;

export const STATUS = {
  DEFAULT: 'default',
  PUBLISHED: 'published',
  DRAFT: 'draft'
};

export const MOCK_UID = 'default';

export const useRoutes = () => [
  {
    name: 'INFORMATION_BASE',
    route: 'information-base',
    pages: [
      {
        name: 'PAGES.MAIN_PAGE',
        apiKey: 'INFORMATION_BASE__MAIN_PAGE',
        route: 'main-page',
        visible: true
      },
      {
        name: 'PAGES.AP',
        apiKey: 'INFORMATION_BASE__AP',
        route: 'ap',
        visible: checkPermissions('TKO.ACCESS', ['АР (перегляд розширено)', 'АР', 'Адміністратор АР', 'АКО/АР_ZV', 'Третя сторона'], true)
      },
      {
        name: 'PAGES.TKO_DETAIL',
        apiKey: 'INFORMATION_BASE__TKO_DETAIL',
        route: 'ap-details',
        visible: checkPermissions('TKO.ACCESS', ['АР (перегляд розширено)', 'АР', 'Адміністратор АР', 'АКО/АР_ZV', 'Третя сторона'], true)
      },
      {
        name: 'PAGES.PPKO',
        apiKey: 'INFORMATION_BASE__PPKO',
        route: 'ppko',
        visible: checkPermissions('PPKO.ACCESS', ['АКО_Суперечки', 'АКО_Перевірки', 'ГарПок'], true)
      },
      {
        name: 'PAGES.CONTACTS_PPKO',
        apiKey: 'INFORMATION_BASE__PPKO_CONTACTS',
        route: 'ppko-contacts',
        visible: checkPermissions('PPKO.ACCESS', ['АКО_Суперечки', 'АКО_Перевірки', 'ГарПок'], true)
      },
      {
        name: 'PAGES.AUDITS',
        apiKey: 'INFORMATION_BASE__AUDITS',
        route: 'audits',
        visible: !IS_PROD && checkPermissions(AUDITS_READ_PERMISSION, AUDITS_READ_ROLES)
      },
      {
        name: 'PAGES.DIRECTORIES',
        apiKey: 'INFORMATION_BASE__DIRECTORIES',
        route: 'directories',
        visible: checkPermissions('DIRECTORIES.ACCESS', DIRECTORIES_ACCEPT_ROLES)
      },
      {
        name: 'PAGES.INSTRUCTIONS',
        apiKey: 'INFORMATION_BASE__INSTRUCTIONS',
        route: 'instructions',
        visible: true
      },
      {
        name: 'PAGES.REPORTS',
        apiKey: 'INFORMATION_BASE__REPORTS',
        route: 'reports',
        visible: checkPermissions('REPORTS.ACCESS', ['АКО_Суперечки', 'АР (перегляд розширено)'], true)
      },
      {
        name: 'FAQ_TYPE.ZV',
        apiKey: 'INFORMATION_BASE__ZV',
        route: 'zv',
        visible: checkPermissions('ZV.ACCESS', ZV_ACCEPT_ROLES)
      },
      {
        name: 'PAGES.PROCESS_MANAGER',
        apiKey: 'INFORMATION_BASE__PROCESS_MANAGER',
        route: 'process-manager',
        visible: checkPermissions('PROCESS_MANAGER.ACCESS', PROCESS_MANAGER_ACCEPT_ROLES)
      },
      {
        name: 'PAGES.PROCESS_SETTINGS',
        apiKey: 'INFORMATION_BASE__PROCESS_SETTINGS',
        route: 'process-setting',
        visible: checkPermissions('PROCESS_SETTINGS.ACCESS', PROCESS_SETTINGS_ACCEPT_ROLES)
      },
      {
        name: 'PAGES.MASS_DOWNLOAD_DKO',
        apiKey: 'INFORMATION_BASE__MASS_DOWNLOAD_DKO',
        route: 'time-series',
        visible: checkPermissions('TIME_SERIES.ACCESS', MASS_DOWNLOAD_DKO_ACCEPT_ROLES)
      },
      {
        name: 'PAGES.MONITORING_DKO',
        apiKey: 'INFORMATION_BASE__MONITORING_DKO',
        route: 'monitoring-dko',
        visible: checkPermissions('MONITORING_DKO.ACCESS', MONITORING_DKO_ACCEPT_ROLES)
      },
      {
        name: 'FAQ_TYPE.METER_READING',
        apiKey: 'INFORMATION_BASE__METER_READING',
        route: 'meter-reading-view',
        visible: !IS_PROD && checkPermissions('METER_READING.ACCESS', METER_READING_ACCEPT_ROLES)
      },
      {
        name: 'PAGES.METER_READING',
        apiKey: 'INFORMATION_BASE__METER_READING_UPLOADS',
        route: 'meter-reading-uploads',
        visible: !IS_PROD && checkPermissions('METER_READING.SEND_DATA.ACCESS', METER_READING_UPLOADS_ACCEPT_ROLES)
      },
      {
        name: 'PAGES.DISPUTES',
        apiKey: 'INFORMATION_BASE__DISPUTES',
        route: 'disputes',
        visible: checkPermissions('DISPUTES.ACCESS', DISPUTE_ALLOWED_ROLES)
      },
      {
        name: 'PAGES.USERS_DIRECTORY',
        apiKey: 'INFORMATION_BASE__USERS_DIRECTORY',
        route: 'meter-reading-uploads',
        visible: checkPermissions('USERS_DIRECTORY.ACCESS', USERS_DIRECTORY_ACCEPT_ROLES)
      },
      {
        name: 'PAGES.USER_ACTIONS_LOG',
        apiKey: 'INFORMATION_BASE__USER_ACTIONS_LOG',
        route: 'actions-log',
        visible: checkPermissions('ACTIONS_LOG.ACCESS', ACTIONS_LOG_ACCEPT_ROLES)
      },
      {
        name: 'PAGES.PUBLICATION_CMD',
        apiKey: 'INFORMATION_BASE__PUBLICATION_CMD',
        route: 'publication-cmd',
        visible: checkPermissions(PUBLICATION_CMD_ACCEPT_PERMISION, PUBLICATION_CMD_ACCEPT_ROLES) && !IS_PROD
      },
    ]
  },
  {
    name: 'FAQ_TYPE.GTS',
    route: 'gts',
    pages: [
      {
        name: 'PAGES.GTS_AP',
        apiKey: 'GTS__AP',
        route: 'ap',
        visible: checkPermissions('GTS.ACCESS', GTS_TKO_LIST_VIEW_ACCEPT_ROLES)
      },
      {
        name: 'PAGES.GTS',
        apiKey: 'GTS__GTS_FILES',
        route: 'gts-files',
        visible: checkOneOfPermissions(
          [
            'GTS.TKO_LIST_VIEW.CONTROLS.UPLOAD_DKO',
            'PROCESSES.PON.REQUEST_ACTUAL_DKO.CONTROLS.UPLOAD',
            'PROCESSES.PON.REQUEST_HISTORICAL_DKO.CONTROLS.UPLOAD'
          ],
          GTS_FILES_ACCEPT_ROLES
        )
      },
      {
        name: 'PAGES.GTS_UPLOAD_RESULTS',
        apiKey: 'GTS__GTS_UPLOAD_RESULTS',
        route: 'gts-upload-results',
        visible: checkPermissions('GTS.FILES.FUNCTIONS.UPLOAD_RESULTS', GTS_UPLOAD_RESULTS_ACCEPT_ROLES)
      },
      {
        name: 'PAGES.REPORTS',
        apiKey: 'GTS__REPORTS',
        route: 'gts-reports',
        visible: checkPermissions('GTS.ACCESS', GTS_REPORTS_ACCEPT_ROLES)
      },
      {
        name: 'PAGES.CREATE_GTS_REPORT',
        apiKey: 'GTS__CREATE_GTS_REPORT',
        route: 'gts-reports-settings',
        visible: checkPermissions('GTS.REPORTS.CONTROLS.CREATE_REPORT', CREATE_GTS_REPORT_ACCEPT_ROLES)
      },
      {
        name: 'PAGES.REGION_BALANCE',
        apiKey: 'GTS__REGION_BALANCE',
        route: 'gts-region-balance',
        visible: checkPermissions('GTS.TKO_LIST_VIEW.CONTROLS.REGION_BALANCE', GTS_REGION_BALANCE_ACCEPT_ROLES)
      }
    ]
  },
  {
    name: 'PAGES.PROCESSES',
    route: 'processes',
    pages: [
      {
        name: 'PAGES.PROCESSES',
        apiKey: 'PROCESSES__PROCESSES_LIST',
        route: 'processes-list',
        visible: checkPermissions('PROCESSES.LIST.ACCESS', PROCESSES_LIST_ACCEPT_ROLES)
      },
      {
        name: 'PAGES.ACTIVATE_DEACTIVATE_AP',
        apiKey: 'PROCESSES__ACTIVATING_DEACTIVATING_AP',
        route: 'activating-deactivating-ap',
        visible: !IS_PROD && checkPermissions(
              'PROCESSES.ACTIVATING_DEACTIVATING.INITIALIZATION',
              ACTIVATING_DEACTIVATING_INITIALIZATION_ACCEPT_ROLES
            )
      },
      {
        name: 'SUBPROCESSES.ACTIVATE_AP',
        apiKey: 'PROCESSES__ACTIVATING_AP',
        route: 'activating-ap',
        visible: !IS_PROD && checkPermissions('PROCESSES.ACTIVATING_DEACTIVATING.ACCESS', ACTIVATE_DEACTIVATE_ACCEPT_ROLES)
      },
      {
        name: 'SUBPROCESSES.DEACTIVATE_AP',
        apiKey: 'PROCESSES__DEACTIVATING_AP',
        route: 'deactivating-ap',
        visible: !IS_PROD && checkPermissions('PROCESSES.ACTIVATING_DEACTIVATING.ACCESS', ACTIVATE_DEACTIVATE_ACCEPT_ROLES)
      },
      {
        name: 'SUBPROCESSES.REQUEST_ACTIVATE_AP',
        apiKey: 'PROCESSES__REQUEST_ACTIVATE_AP',
        route: 'activating-request',
        visible: !IS_PROD && checkPermissions(
              'PROCESSES.ACTIVATING_DEACTIVATING.ACTIVATING_REQUEST.ACCESS',
              REQUEST_ACTIVATE_ACCEPT_ROLES
            )
      },
      {
        name: 'SUBPROCESSES.CANCEL_PPKO_REGISTRATION',
        apiKey: 'PROCESSES__CANCEL_PPKO_REGISTRATION',
        route: 'cancel-ppko-registration',
        visible: checkPermissions('PROCESSES.CANCEL_PPKO_REGISTRATION.ACCESS', CANCEL_PPKO_ACCEPT_ROLES)
      },
      {
        name: 'SUBPROCESSES.CANCEL_PPKO_REGISTRATION_ON_EXPIRE',
        apiKey: 'PROCESSES__CANCEL_PPKO_REGISTRATION_ON_EXPIRE',
        route: 'expire-cancel-ppko-registration',
        visible: checkPermissions('PROCESSES.CANCEL_PPKO_REGISTRATION.EXPIRE.ACCESS', EXPIRE_CANCEL_PPKO_ACCEPT_ROLES)
      },
      {
        name: 'SUBPROCESSES.REQUEST_CANCEL_PPKO_REGISTRATION',
        apiKey: 'PROCESSES__REQUEST_CANCEL_PPKO_REGISTRATION',
        route: 'request-cancel-ppko-registration',
        visible:
          checkPermissions(
            'PROCESSES.CANCEL_PPKO_REGISTRATION.REQUEST_BY_PPKO.ACCESS',
            REQUEST_CANCEL_PPKO_REGISTRATION_ACCEPT_ROLES
          )
      },
      {
        name: 'SUBPROCESSES.ENTERING_AP_INTO_ACCOUNTING',
        apiKey: 'PROCESSES__ENTERING_AP_INTO_ACCOUNTING',
        route: 'entering-ap',
        visible:
          !IS_PROD && checkPermissions('PROCESSES.ENTERING_AP.ACCESS', ENTERING_AP_INTO_ACCOUNTING_ACCESS_ACCEPT_ROLES)
      },
      {
        name: 'PROCESSES.DELETE_ACTIVATE_TKO',
        apiKey: 'PROCESSES__DELETE_ACTIVATE_TKO',
        route: 'deleting-activating-tko',
        visible: checkPermissions(
          'PROCESSES.DELETING_TKO.INITIALIZATION',
          DELETE_ACTIVATE_TKO_INITIALIZATION_ACCEPT_ROLES
        )
      },
      {
        name: 'SUBPROCESSES.DELETE_ARCHIVE_AP',
        apiKey: 'PROCESSES__DELETE_AP',
        route: 'deleting-tko',
        visible: checkPermissions('PROCESSES.DELETING_TKO.ACCESS', DELETE_AP_ACCEPT_ROLES)
      },
      {
        name: 'SUBPROCESSES.DISMANTLE_ARCHIVE_AP',
        apiKey: 'PROCESSES__DISMANTLE_ARCHIVE_AP',
        route: 'dismantle-archive-ap',
        visible: checkPermissions('PROCESSES.DELETING_TKO.ACCESS', ARCHIVING_AP_ACCEPT_ROLES)
      },
      {
        name: 'SUBPROCESSES.UNARCHIVE_AP',
        apiKey: 'PROCESSES__UN_ARCHIVE_AP',
        route: 'unarchive-ap',
        visible: checkPermissions('PROCESSES.DELETING_TKO.ACCESS', UN_ARCHIVE_ACCEPT_ROLES)
      },
      {
        name: 'PROCESSES.NEW_AP_PROPERTIES',
        apiKey: 'PROCESSES__NEW_AP_PROPERTIES',
        route: 'new-ap-properties',
        visible: checkPermissions('PROCESSES.NEW_AP_PROPERTIES.ACCESS', NEW_AP_PROPERTIES_INITIALIZATION_ACCEPT_ROLES)
      },
      {
        name: 'GROUPS.CHANGE_SUPPLY_STATUS',
        apiKey: 'PROCESSES__CHANGE_SUPPLY_STATUS',
        route: 'init-termination-resumption',
        visible: checkPermissions(
          'PROCESSES.TERMINATION_RESUMPTION.INITIALIZATION',
          INIT_TERMINATION_RESUMPTION_ACCEPT_ROLES
        )
      },
      {
        name: 'SUBPROCESSES.RESUMPTION_SUPPLY',
        apiKey: 'PROCESSES__RESUMPTION_SUPPLY',
        route: 'resumption-supply',
        visible: checkPermissions('PROCESSES.TERMINATION_RESUMPTION.MAIN.ACCESS', TERMINATION_RESUMPTION_ACCEPT_ROLES)
      },
      {
        name: 'SUBPROCESSES.TERMINATION_SUPPLY',
        apiKey: 'PROCESSES__TERMINATION_SUPPLY',
        route: 'termination-supply',
        visible: checkPermissions('PROCESSES.TERMINATION_RESUMPTION.MAIN.ACCESS', TERMINATION_RESUMPTION_ACCEPT_ROLES)
      },
      {
        name: 'SUBPROCESSES.DISPUTE_REQUEST_DATA_IN_ATKO',
        apiKey: 'PROCESSES__DISPUTE_REQUEST_DATA_IN_ATKO',
        route: 'dispute-tko',
        visible: checkPermissions('PROCESSES.DISPUTE_TKO.MAIN.ACCESS', DISPUTE_TKO_ACCEPT_ROLES)
      },
      {
        name: 'PAGES.DISPUTE_TKO_SUBPROCESS',
        apiKey: 'PROCESSES__DISPUTE_TKO_SUBPROCESS',
        route: 'dispute-tko-subprocess',
        visible: checkPermissions('PROCESSES.DISPUTE_TKO.SUBPROCESSES.ACCESS', DISPUTE_TKO_SUBPROCESS_ACCEPT_ROLES)
      },
      {
        name: 'SUBPROCESSES.UPDATE_AP_HISTORY',
        apiKey: 'PROCESSES__UPDATE_AP_HISTORY',
        route: 'update-ap-history',
        visible: checkPermissions('PROCESSES.UPDATE_AP_HISTORY.ACCESS', UPDATE_AP_HISTORY_ACCESS_ACCEPT_ROLES)
      },
      {
        name: 'SUBPROCESSES.CREATE_TKO',
        apiKey: 'PROCESSES__CREATE_TKO',
        route: 'create-tko',
        visible: !IS_PROD && checkPermissions('PROCESSES.CREATE_TKO.ACCESS', CREATE_TKO_ACCESS_ACCEPT_ROLES)
      },
      {
        name: 'SUBPROCESSES.CREATE_METERING_POINT',
        apiKey: 'PROCESSES__CREATE_METERING_POINT',
        route: 'adding-new-virtual-tko',
        visible: checkPermissions('PROCESSES.ADDING_NEW_VIRTUAL_TKO.ACCESS', ADDING_NEW_VIRTUAL_TKO_ACCEPT_ROLES)
      },
      {
        name: 'GROUPS.EXPORT_TKO',
        apiKey: 'PROCESSES__EXPORT_TKO',
        route: 'export-own-tko',
        visible: checkPermissions('PROCESSES.EXPORT_OWN_TKO.ACCESS', EXPORT_OWN_TKO_ACCESS_ACCEPT_ROLES)
      },
      {
        name: 'GROUPS.CHANGE_SUPPLIER_TO_PON',
        apiKey: 'PROCESSES__CHANGE_SUPPLIER_TO_PON',
        route: 'change-supplier-to-pon',
        visible: checkPermissions('PROCESSES.PON.MAIN.ACCESS', CREATE_PON_ACCEPT_ROLES)
      },
      {
        name: 'SUBPROCESSES.REQUEST_DATA_IN_ATKO',
        apiKey: 'PROCESSES__REQUEST_DATA_IN_ATKO',
        route: 'request-tko-data',
        visible: checkPermissions('PROCESSES.PON.REQUEST_TKO_DATA.ACCESS', REQUEST_TKO_ACCEPT_ROLES)
      },
      {
        name: 'SUBPROCESSES.INITIALIZATION',
        apiKey: 'PROCESSES__INITIALIZATION',
        route: 'pon',
        visible: checkPermissions('PROCESSES.PON.MAIN.ACCESS', CREATE_PON_ACCEPT_ROLES)
      },
      {
        name: 'SUBPROCESSES.INITIALIZATION_PON_AUTO',
        apiKey: 'PROCESSES__INITIALIZATION_PON_AUTO',
        route: 'pon-auto',
        visible: checkPermissions('PROCESSES.PON.INITIALIZATION', INIT_PON_ACCEPT_ROLES)
      },
      {
        name: 'SUBPROCESSES.INFORMING_PON',
        apiKey: 'PROCESSES__INFORMING_PON',
        route: 'pon-informing',
        visible: checkPermissions('PROCESSES.PON.INFORMING.ACCESS', INFORMING_PON_ACCEPT_ROLES)
      },
      {
        name: 'SUBPROCESSES.GRANTING_AUTHORITY',
        apiKey: 'PROCESSES__GRANTING_AUTHORITY',
        route: 'granting-authority',
        visible: checkPermissions('PROCESSES.GRANTING_AUTHORITY.MAIN.ACCESS', GRANTING_AUTHORITY_ACCEPT_ROLES)
      },
      {
        name: 'SUBPROCESSES.UPDATE_APS_HISTORY',
        apiKey: 'PROCESSES__UPDATE_APS_HISTORY',
        route: 'update-aps-history',
        visible: checkPermissions('PROCESSES.UPDATE_APS_HISTORY.ACCESS', UPDATE_APS_HISTORY_ACCEPT_ROLES)
      },
      {
        name: 'SUBPROCESSES.REQUEST_TO_UPDATE_BASIC_AP_DATA',
        apiKey: 'PROCESSES__REQUEST_TO_UPDATE_BASIC_AP_DATA',
        route: 'request-update-basic-ap',
        visible: checkPermissions('PROCESSES.REQUEST_ACTUALIZATION_TKO.ACCESS', REQUEST_ACTUALIZATION_TKO_ACCEPT_ROLES)
      },
      {
        name: 'SUBPROCESSES.REQUEST_TO_UPDATE_CUSTOMERS',
        apiKey: 'PROCESSES__REQUEST_TO_UPDATE_CUSTOMERS',
        route: 'request-to-update-customers',
        visible: checkPermissions('PROCESSES.REQUEST_ACTUALIZATION_TKO.ACCESS', REQUEST_ACTUALIZATION_TKO_ACCEPT_ROLES)
      },
      {
        name: 'SUBPROCESSES.CHANGE_PAYMENT_TYPE',
        apiKey: 'PROCESSES__CHANGE_PAYMENT_TYPE',
        route: 'change-payment-type',
        visible: checkPermissions('PROCESSES.CHANGE_PAYMENT_TYPE.ACCESS', CHANGE_PAYMENT_TYPE_ACCESS_ACCEPT_ROLES)
      },
      {
        name: 'GROUPS.UPDATE_TKO_DATA',
        apiKey: 'PROCESSES__UPDATE_TKO_DATA',
        route: 'change-main-data-tko',
        visible: checkPermissions('PROCESSES.CHANGE_MAIN_DATA_TKO.ACCESS', UPDATE_TKO_DATA_ACCESS_ACCEPT_ROLES)
      },
      {
        name: 'GROUPS.METER_READING_TRANSFER_PPKO',
        apiKey: 'PROCESSES__METER_READING_TRANSFER_PPKO',
        route: 'meter-reading-process',
        visible:
          !IS_PROD &&
          checkPermissions('PROCESSES.METER_READING.INITIALIZATION', METER_READING_TRANSFER_PPKO_ACCEPT_ROLES)
      },
      {
        name: 'SUBPROCESSES.INFORMING_METER_READING_TRANSFER_PPKO',
        apiKey: 'PROCESSES__INFORMING_METER_READING_TRANSFER_PPKO',
        route: 'meter-reading-process-informing',
        visible:
          !IS_PROD &&
          checkPermissions(
            'PROCESSES.METER_READING.SUBPROCESS.ACCESS',
            INFORMING_METER_READING_TRANSFER_PPKO_ACCEPT_ROLES
          )
      },
      {
        name: 'SUBPROCESSES.METER_READING_TRANSFER_PPKO',
        apiKey: 'PROCESSES__METER_READING_TRANSFER_PPKO_SUBPROCESSES',
        route: 'meter-reading-subprocess',
        visible:
          !IS_PROD &&
          checkPermissions('PROCESSES.METER_READING.INITIALIZATION', METER_READING_TRANSFER_PPKO_ACCEPT_ROLES)
      },
      {
        name: 'PAGES.BIND_ACCOUNTING_POINT',
        apiKey: 'PROCESSES__BIND_ACCOUNTING_POINT',
        route: 'bind-accounting-point',
        visible:
          !IS_PROD &&
          checkPermissions('PROCESSES.BIND_ACCOUNTING_POINT.ACCESS', BIND_ACCOUNTING_POINT_ACCESS_ACCEPT_ROLES)
      },
      {
        name: 'SUBPROCESSES.BIND_ACCOUNTING_POINT_ZV',
        apiKey: 'PROCESSES__BIND_ACCOUNTING_POINT_ZV',
        route: 'bind-accounting-point-zv',
        visible: checkPermissions('PROCESSES.BIND_ACCOUNTING_POINT_ZV.ACCESS', BIND_ACCOUNTING_POINT_ZV_ACCEPT_ROLES)
      },
      {
        name: 'SUBPROCESSES.PROLONGATION_SUPPLY',
        apiKey: 'PROCESSES__PROLONGATION_SUPPLY',
        route: 'prolongation-supply',
        visible: checkPermissions('PROCESSES.PROLONGATION_SUPPLY.ACCESS', PROLONGATION_SUPPLY_ACCEPT_ROLES)
      },
      {
        name: 'SUBPROCESSES.EXPORT_AP_GENERATION',
        apiKey: 'PROCESSES__EXPORT_AP_GENERATION',
        route: 'export-ap-generation',
        visible: checkPermissions('PROCESSES.EXPORT_AP_GENERATION.ACCESS', EXPORT_AP_GENERATION_ACCEPT_ROLES)
      },
      {
        name: 'SUBPROCESSES.REQUEST_ACTUAL_DKO',
        apiKey: 'PROCESSES__REQUEST_ACTUAL_DKO',
        route: 'pon-request-actual-dko',
        visible: checkPermissions('PROCESSES.PON.REQUEST_ACTUAL_DKO.ACCESS', REQUEST_ACTUAL_DKO_ACCEPT_ROLES)
      },
      {
        name: 'SUBPROCESSES.RECEIVING_DKO_ACTUAL',
        apiKey: 'PROCESSES__RECEIVING_DKO_ACTUAL',
        route: 'receiving-dko-actual',
        visible:
          !IS_PROD && checkPermissions('PROCESSES.RECEIVING_DKO_ACTUAL.MAIN.ACCESS', RECEIVING_DKO_ACTUAL_ACCEPT_ROLES)
      },
      {
        name: 'SUBPROCESSES.CONNECT_TKO',
        apiKey: 'PROCESSES__CONNECT_TKO',
        route: 'connecting-tko',
        visible: checkPermissions(
          'PROCESSES.CONNECTING_DISCONNECTING.ACCESS',
          CONNECTING_DISCONNECTING_ACCESS_ACCEPT_ROLES
        )
      },
      {
        name: 'SUBPROCESSES.DISCONNECT_TKO',
        apiKey: 'PROCESSES__DISCONNECT_TKO',
        route: 'disconnecting-tko',
        visible: checkPermissions(
          'PROCESSES.CONNECTING_DISCONNECTING.ACCESS',
          CONNECTING_DISCONNECTING_ACCESS_ACCEPT_ROLES
        )
      },
      {
        name: 'PROCESSES.CONNECTING_DISCONNECTING',
        apiKey: 'PROCESSES__CONNECTING_DISCONNECTING',
        route: 'connecting-disconnecting-tko',
        visible: checkPermissions(
          'PROCESSES.CONNECTING_DISCONNECTING.INITIALIZATION',
          CONNECTING_DISCONNECTING_INITIALIZATION_ACCEPT_ROLES
        )
      },
      {
        name: 'SUBPROCESSES.REQUEST_HISTORICAL_DKO',
        apiKey: 'PROCESSES__REQUEST_HISTORICAL_DKO',
        route: 'pon-request-historical-dko',
        visible: checkPermissions('PROCESSES.PON.REQUEST_HISTORICAL_DKO.ACCESS', REQUEST_HISTORICAL_DKO_ACCEPT_ROLES)
      },
      {
        name: 'SUBPROCESSES.RESPONSE_ACTUAL_DKO',
        apiKey: 'PROCESSES__RESPONSE_ACTUAL_DKO',
        route: 'pon-provide-actual-dko',
        visible: checkPermissions('PROCESSES.PON.PROVIDE_ACTUAL_DKO.ACCESS', PROVIDE_ACTUAL_DKO_ACCEPT_ROLES)
      },
      {
        name: 'SUBPROCESSES.RECEIVING_DKO_HISTORICAL',
        apiKey: 'PROCESSES__RECEIVING_DKO_HISTORICAL',
        route: 'receiving-dko-historical',
        visible:
          !IS_PROD &&
          checkPermissions('PROCESSES.RECEIVING_DKO_HISTORICAL.MAIN.ACCESS', RECEIVING_DKO_HISTORICAL_ACCEPT_ROLES)
      },
      {
        name: 'SUBPROCESSES.REQUEST_CHANGE_PPKO',
        apiKey: 'PROCESSES__REQUEST_CHANGE_PPKO',
        route: 'request-change-ppko',
        visible: checkPermissions('PROCESSES.CHANGE_PPKO.MAIN.ACCESS', CHANGE_PPKO_ACCESS_ACCEPT_ROLES)
      },
      {
        name: 'SUBPROCESSES.CHANGE_SUPPLIET',
        apiKey: 'PROCESSES__CHANGE_SUPPLIET',
        route: 'change-supplier',
        visible: checkPermissions('PROCESSES.CHANGE_SUPPLIER.ACCESS', CHANGE_SUPPLIER_ACCESS_ACCEPT_ROLES)
      },
      {
        name: 'SUBPROCESSES.PREDICTABLE_CONSUMPTION_ODKO',
        apiKey: 'PROCESSES__PREDICTABLE_CONSUMPTION_ODKO',
        route: 'predictable-consumption-odko',
        visible: checkPermissions('PROCESSES.CHANGE_SUPPLIER.PREDICTABLE.ACCESS', 'ОДКО')
      },
      {
        name: 'SUBPROCESSES.INFORMING_AKO_FOR_CHANGE_SUPPLIER',
        apiKey: 'PROCESSES__INFORMING_AKO_FOR_CHANGE_SUPPLIER',
        route: 'informing-ako',
        visible: checkPermissions('PROCESSES.CHANGE_SUPPLIER.INFORMING_AKO.ACCESS', INFORMING_AKO_ACCEPT_ROLES)
      },
      {
        name: 'SUBPROCESSES.INFORMING_ATKO_FOR_CHANGE_SUPPLIER',
        apiKey: 'PROCESSES__INFORMING_ATKO_FOR_CHANGE_SUPPLIER',
        route: 'informing',
        visible: checkPermissions(
          'PROCESSES.CHANGE_SUPPLIER.INFORMING_ATKO.ACCESS',
          CHANGE_SUPPLIER_INFORMING_ATKO_ACCESS_ACCEPT_ROLES
        )
      },
      {
        name: 'SUBPROCESSES.INFORMING_CURRENT_SUPPLIER',
        apiKey: 'PROCESSES__INFORMING_CURRENT_SUPPLIER',
        route: 'informing-supplier',
        visible: checkPermissions(
          'PROCESSES.CHANGE_SUPPLIER.INFORMING_SUPPLIER.ACCESS',
          CHANGE_SUPPLIER_INFORMING_SUPPLIER_ACCESS_ACCEPT_ROLES
        )
      },
      {
        name: 'PROCESSES.MMS',
        apiKey: 'PROCESSES__MMS',
        route: 'mms',
        visible: checkPermissions('PROCESSES.MMS.INITIALIZATION', MMS_ACCEPT_ROLES)
      },
      {
        name: 'PAGES.END_OF_SUPPLY',
        apiKey: 'PROCESSES__END_OF_SUPPLY',
        route: 'end-of-supply',
        visible: checkPermissions('PROCESSES.END_OF_SUPPLY.MAIN.ACCESS', END_OF_SUPPLY_ACCEPT_ROLES)
      },
      {
        name: 'SUBPROCESSES.CHANGE_ACCOUNTING_GROUP_ZV',
        apiKey: 'PROCESSES__CHANGE_ACCOUNTING_GROUP_ZV',
        route: 'change-accounting-group-zv',
        visible: checkPermissions(
          'PROCESSES.CHANGE_ACCOUNTING_GROUP_ZV.ACCESS',
          CHANGE_ACCOUNTING_GROUP_ZV_ACCESS_ACCEPT_ROLES
        )
      },
      {
        name: 'GROUPS.UPDATE_RELATED_SUBCUSTOMERS',
        apiKey: 'PROCESSES__UPDATE_RELATED_SUBCUSTOMERS',
        route: 'update-related-subcustomers',
        visible: checkPermissions(
          'PROCESSES.UPDATE_RELATED_SUBCUSTOMERS.ACCESS',
          UPDATE_RELATED_SUBCUSTOMERS_ACCESS_ACCEPT_ROLES
        )
      },
      {
        name: 'SUBPROCESSES.REPORT_ERP',
        apiKey: 'PROCESSES__REPORT_ERP',
        route: 'erp-report',
        visible: checkPermissions('PROCESSES.ERP_REPORT.ACCESS', REPORT_ERP_ACCEPT_ROLES)
      },
      {
        name: 'SUBPROCESSES.REPORT_GREXEL',
        apiKey: 'PROCESSES__REPORT_GREXEL',
        route: 'report-grexel',
        visible: checkPermissions('PROCESSES.REPORT_GREXEL.ACCESS', REPORT_GREXEL_ACCEPT_ROLES)
      },
      {
        name: 'GROUPS.ACTIVE_CUSTOMER_AP',
        apiKey: 'PROCESSES__ACTIVE_CUSTOMER_AP',
        route: 'active-customer-ap',
        visible: checkPermissions('PROCESSES.ACTIVE_CUSTOMER_AP.ACCESS', ACTIVE_CUSTOMER_AP_ACCEPT_ROLES)
      },
      {
        name: 'GROUPS.CORRECTION_ARCHIVING_TS',
        apiKey: 'PROCESSES__CORRECTION_ARCHIVING_TS',
        route: 'correction-archiving-ts',
        visible: checkPermissions('PROCESSES.CORRECTION_ARCHIVING_TS.ACCESS', CORRECTION_ARCHIVING_TS_ACCEPT_ROLES)
      }
    ]
  }
];
