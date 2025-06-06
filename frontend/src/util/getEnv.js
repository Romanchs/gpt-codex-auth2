const version = '1.3.3';

export const IS_PROD = false;

const ID_GOV_UA = {
  PROD: {
    URL: 'id.gov.ua',
    CLIENT_ID: 'b50a5ab1dad919bb5f5688ba6ec055fd'
  },
  TEST: {
    URL: 'test.id.gov.ua',
    CLIENT_ID: 'dd2ebb774afe4a32eb2b3e9e32bf65fc'
  },
  DEV: {
    URL: 'test.id.gov.ua',
    CLIENT_ID: '2b72d54646d9d3b3905aa4ffc9068e7a'
  }
}

export const getEnv = () => {
  switch (window.location.origin) {
    case 'https://datahub.ua.energy':
      return {
        env: 'prod',
        baseUrl: 'https://datahub.ua.energy',
        client_id: ID_GOV_UA.PROD.CLIENT_ID,
        idGovUrl: ID_GOV_UA.PROD.URL,
        version,
        features: {
          rolesManage: false,
          localization: false,
          tools: false,
          logger: false,
        }
      };
    case 'https://stage.datahub.ua.energy':
      return {
        env: 'prod',
        baseUrl: 'https://stage.datahub.ua.energy',
        client_id: ID_GOV_UA.TEST.CLIENT_ID,
        idGovUrl: ID_GOV_UA.TEST.URL,
        version,
        features: {
          rolesManage: false,
          localization: false,
          tools: false,
          logger: false,
        }
      };
    case 'https://test.datahub.ua.energy':
      return {
        env: 'test',
        baseUrl: 'https://test.datahub.ua.energy',
        client_id: ID_GOV_UA.TEST.CLIENT_ID,
        idGovUrl: ID_GOV_UA.TEST.URL,
        version,
        features: {
          rolesManage: !IS_PROD,
          localization: !IS_PROD,
          tools: !IS_PROD,
          logger: false,
        }
      };
    case 'https://dev.datahub.ua.energy':
      return {
        env: 'dev',
        baseUrl: 'https://dev.datahub.ua.energy',
        client_id: ID_GOV_UA.DEV.CLIENT_ID,
        idGovUrl: ID_GOV_UA.DEV.URL,
        version,
        features: {
          rolesManage: true,
          localization: true,
          tools: true,
          logger: false,
        }
      };
    default:
      return {
        env: 'dev',
        baseUrl: 'https://dev.datahub.ua.energy',
        client_id: ID_GOV_UA.DEV.CLIENT_ID,
        idGovUrl: ID_GOV_UA.DEV.URL,
        version,
        features: {
          rolesManage: true,
          localization: true,
          tools: true,
          logger: false,
        }
      };
  }
};

export const availableProcesses = [
  {
    permission: 'PROCESSES.ACTIVATING_DEACTIVATING.INITIALIZATION',
    roles: ['АТКО'],
    link: '/processes/activating-deactivating',
    title: 'PROCESSES.ACTIVATING_DEACTIVATING',
    disabled: IS_PROD
  },
  {
    permission: 'PROCESSES.CANCEL_PPKO_REGISTRATION.INITIALIZATION',
    roles: ['АКО_ППКО', 'АТКО', 'ОЗКО', 'ОЗД', 'ОДКО'],
    link: '/processes/cancel-ppko-registration/',
    title: 'SUBPROCESSES.CANCEL_PPKO_REGISTRATION',
  },
  {
    permission: 'PROCESSES.ENTERING_AP.INITIALIZATION',
    roles: ['АТКО'],
    link: '/processes/entering-ap/',
    title: 'SUBPROCESSES.ENTERING_AP_INTO_ACCOUNTING',
    disabled: IS_PROD
  },
  {
    permission: 'PROCESSES.DELETING_TKO.INITIALIZATION',
    roles: ['АТКО', 'АКО_Процеси'],
    link: '/processes/deleting-tko/init',
    title: 'PROCESSES.DELETE_ACTIVATE_TKO'
  },
  {
    permission: 'PROCESSES.CHANGE_MAIN_DATA_TKO.INITIALIZATION',
    roles: ['АТКО', 'АКО', 'АКО_Процеси', 'СВБ', 'ОЗКО', 'ГарПок'],
    link: '/processes/change-main-data-tko',
    title: 'GROUPS.UPDATE_TKO_DATA'
  },
  {
    permission: 'PROCESSES.NEW_AP_PROPERTIES.INITIALIZATION',
    roles: ['АТКО'],
    link: '/processes/new-ap-properties',
    title: 'GROUPS.NEW_AP_PROPERTIES'
  },
  {
    permission: 'PROCESSES.UPDATE_AP_HISTORY.INITIALIZATION',
    roles: ['АТКО', 'СВБ'],
    link: '/processes/update-ap-history/',
    title: 'PROCESSES.UPDATE_AP_HISTORY'
  },
  {
    permission: 'PROCESSES.ADDING_NEW_VIRTUAL_TKO.INITIALIZATION',
    roles: ['АТКО', 'ОЗКО'],
    link: '/processes/adding-new-virtual-tko/',
    title: 'SUBPROCESSES.CREATE_METERING_POINT'
  },
  {
    permission: 'PROCESSES.END_OF_SUPPLY.INITIALIZATION',
    roles: ['СВБ'],
    link: '/processes/end-of-supply/init',
    title: 'GROUPS.END_SUPPLY'
  },
  // {
  //   permission: 'PROCESSES.RECEIVING_DKO_HISTORICAL.INITIALIZATION',
  //   roles: ['СВБ', 'АКО_Процеси'],
  //   link: '/processes/receiving-dko-historical/init',
  //   title: 'SUBPROCESSES.RECEIVING_DKO_HISTORICAL',
  //   disabled: IS_PROD
  // },
  // {
  //   permission: 'PROCESSES.RECEIVING_DKO_ACTUAL.INITIALIZATION',
  //   roles: ['СВБ', 'АКО_Процеси'],
  //   link: '/processes/receiving-dko-actual/init',
  //   title: 'SUBPROCESSES.RECEIVING_DKO_ACTUAL',
  //   disabled: IS_PROD
  // },
  {
    permission: 'PROCESSES.GRANTING_AUTHORITY.INITIALIZATION',
    roles: IS_PROD ? ['СВБ'] : ['СВБ', 'АТКО', 'ОДКО', 'ОЗД', 'ОЗКО'],
    link: '/processes/granting-authority/init',
    title: 'SUBPROCESSES.GRANTING_AUTHORITY'
  },
  {
    permission: 'PROCESSES.METER_READING.INITIALIZATION',
    roles: ['ОДКО', 'СВБ'],
    link: '/meter-reading/process/init',
    title: 'PROCESSES.METER_READING',
  },
  {
    permission: 'PROCESSES.UPDATE_APS_HISTORY.INITIALIZATION',
    roles: ['АТКО', 'АКО_Процеси', 'АКО_Суперечки', 'СВБ'],
    link: '/processes/update-aps-history/',
    title: 'PROCESSES.UPDATE_APS_HISTORY'
  },
  {
    permission: 'PROCESSES.DISPUTE_TKO.INITIALIZATION',
    roles: ['АКО_Процеси', 'ВТКО', 'СПМ', 'ОДКО', 'АДКО', 'ОЗД', 'ОЗКО'],
    link: '/processes/dispute-tko/init',
    title: 'GROUPS.GET_TKO_INFO'
  },
  {
    permission: 'PROCESSES.ERP_REPORT.INITIALIZATION',
    roles: ['АКО_Процеси'],
    link: '/processes/erp-report/',
    title: 'SUBPROCESSES.REPORT_ERP'
  },
  {
    permission: 'PROCESSES.CHANGE_ACCOUNTING_GROUP_ZV.INITIALIZATION',
    roles: ['АТКО'],
    link: '/processes/change-accounting-group-zv/',
    title: 'GROUPS.CHANGE_ACCOUNTING_GROUP_ZV'
  },
  {
    permission: 'PROCESSES.REPORT_GREXEL.INITIALIZATION',
    roles: ['АКО_Процеси'],
    link: '/processes/report-grexel/init',
    title: 'SUBPROCESSES.REPORT_GREXEL'
  },
  {
    permission: 'PROCESSES.CHANGE_SUPPLIER.INITIALIZATION',
    roles: ['СВБ'],
    link: '/processes/change-supplier/init',
    title: 'SUBPROCESSES.CHANGE_SUPPLIET'
  },
  {
    permission: 'PROCESSES.CHANGE_PAYMENT_TYPE.INITIALIZATION',
    roles: ['СВБ'],
    link: '/processes/change-payment-type/',
    title: 'GROUPS.CHANGE_PAYMENT_TYPE'
  },
  {
    permission: 'PROCESSES.PON.INITIALIZATION',
    roles: ['АКО_Процеси'],
    link: '/processes/pon/init',
    title: 'SUBPROCESSES.PON_INIT'
  },
  {
    permission: 'PROCESSES.CHANGE_PPKO.INITIALIZATION',
    roles: ['ОДКО', 'АТКО', 'ОЗД', 'ОЗКО'],
    link: '/processes/request-change-ppko/',
    title: 'SUBPROCESSES.REQUEST_CHANGE_PPKO'
  },
  {
    permission: 'PROCESSES.UPDATE_RELATED_SUBCUSTOMERS.INITIALIZATION',
    roles: ['СВБ'],
    link: '/processes/update-related-subcustomers/',
    title: 'GROUPS.UPDATE_RELATED_SUBCUSTOMERS'
  },
  {
    permission: 'PROCESSES.EXPORT_OWN_TKO.INITIALIZATION',
    roles: ['АТКО', 'СВБ', 'АКО_Процеси', 'ГарПок'],
    link: '/processes/export-own-tko/',
    title: 'GROUPS.EXPORT_TKO'
  },
  {
    permission: 'PROCESSES.CORRECTION_ARCHIVING_TS.INITIALIZATION',
    roles: ['ОДКО', 'АКО_Процеси'],
    link: '/processes/correction-archiving-ts/',
    title: 'GROUPS.CORRECTION_ARCHIVING_TS'
  },
  {
    permission: 'PROCESSES.MMS.INITIALIZATION',
    roles: ['АКО', 'АКО_Процеси', 'АКО_ППКО', 'АКО_Користувачі', 'АКО_Довідники', 'ОДКО', 'АДКО'],
    link: '/processes/mms',
    title: 'PROCESSES.MMS'
  },
  {
    permission: 'PROCESSES.CONNECTING_DISCONNECTING.INITIALIZATION',
    roles: ['АТКО'],
    link: '/processes/connecting-disconnecting/',
    title: 'PROCESSES.CONNECTING_DISCONNECTING'
  },
  {
    permission: 'PROCESSES.BIND_ACCOUNTING_POINT_ZV.INITIALIZATION',
    roles: ['АКО_Процеси', 'АКО/АР_ZV'],
    link: '/processes/bind-accounting-point-zv/',
    title: 'SUBPROCESSES.BIND_ACCOUNTING_POINT_ZV'
  },
  {
    permission: 'PROCESSES.BIND_ACCOUNTING_POINT.INITIALIZATION',
    roles: ['АТКО'],
    link: '/processes/bind-accounting-point/',
    title: 'PROCESSES.BIND_ACCOUNTING_POINT',
    disabled: IS_PROD
  },
  {
    permission: 'PROCESSES.TERMINATION_RESUMPTION.INITIALIZATION',
    roles: ['СВБ'],
    link: '/processes/termination-resumption/',
    title: 'PROCESSES.TERMINATION_RESUMPTION'
  },
  {
    permission: 'PROCESSES.PROLONGATION_SUPPLY.INITIALIZATION',
    roles: ['СВБ'],
    link: '/processes/prolongation-supply/init',
    title: 'PROCESSES.PROLONGATION_SUPPLY',
    disabled: true
  },
  {
    permission: 'PROCESSES.CREATE_TKO.INITIALIZATION',
    roles: ['АТКО'],
    link: '/processes/create-tko/',
    title: 'GROUPS.CREATE_TKO',
    disabled: IS_PROD
  },
  {
    permission: 'PROCESSES.EXPORT_AP_GENERATION.INITIALIZATION',
    roles: ['АКО_Процеси', 'СВБ'],
    link: '/processes/export-ap-generation/',
    title: 'SUBPROCESSES.EXPORT_AP_GENERATION'
  },
  {
    permission: 'PROCESSES.ACTIVE_CUSTOMER_AP.INITIALIZATION',
    roles: ['СВБ', 'ГарПок'],
    link: '/processes/active-customer-ap',
    title: 'GROUPS.ACTIVE_CUSTOMER_AP'
  },
  {
    permission: 'PROCESSES.TRANSFER_TS_TO_GREXEL.INITIALIZATION',
    roles: ['АКО_Процеси'],
    link: '/processes/transfer-ts-to-grexel',
    title: 'GROUPS.TRANSFER_TS_TO_GREXEL'
  },
  {
    permission: 'PROCESSES.UPDATE_SUB_AP_METER.INITIALIZATION',
    roles: ['АТКО'],
    link: '/processes/update-sub-ap-meter/',
    title: 'SUBPROCESSES.UPDATE_SUB_AP_METER',
    disabled: IS_PROD
  },
  {
    permission: 'PROCESSES.SERVICE_TERMINATION_REQUEST.INITIALIZATION',
    roles: ['ОЗД', 'ОДКО', 'ОЗКО', 'АТКО'],
    link: '/processes/accounting-service-completion/',
    title: 'PROCESSES.SERVICE_TERMINATION_REQUEST',
  }
];

export const isDisabledInit = (permission) =>
  Boolean(availableProcesses.find((i) => i.permission === permission)?.disabled);
