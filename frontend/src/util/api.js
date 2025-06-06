import axios from 'axios';
import { update } from 'lodash';

import { getEnv } from './getEnv';
import { refreshToken } from '../services/refreshToken';

class Api {
  user = {
    getTokens: (params) => this.users_client.post(`/token/`, params),
    getTokenByEsign: (params) => this.users_client.get(`/token/esign/`, { params }),
    verifyToken: () => this.users_client.get(`/token/verify/`),
    verifyOtp: (params) => this.users_client.post(`token/otp/`, params),
    setActiveRole: (data) => this.users_client.patch('/users/set-active-role/', { data: data }),
    getNamesCheckDocs: (name) =>
      this.users_client.get(`/users-ppkos/?full_name_responsible_people_for_check_doc=${name}`)
  };
  admin = {
    getAllUsers: (params) => this.users_client.get('/users/', { params }),
    getAllRoles: () => this.users_client.get('/roles/'),
    getAllOrganizations: (params) => this.users_client.get('/organizations', { params }),
    createUser: (data) => this.users_client.post('/users/create/', { ...data }),
    getUserById: (id) => this.users_client.get(`/users/${id}/`),
    updateUserById: (id, data) => this.users_client.put(`/users/${id}/`, { ...data }),
    resetPassword: (id) => this.users_client.get(`/request_reset_password/${id}/`),
    updateApiKey: (uid) => this.users_client.patch(`/users/set-api-key/${uid}/`, {}),
    generateLogin: (data) => this.users_client.post('/users/username/', data),
    getTemplatesList: () => this.users_client.get(`/users-templates/list_templates/`),
    getTemplates: (uid) => this.users_client.get(`/users-templates/${uid}/`),
    patchTemplates: (uid, data) => this.users_client.patch(`/users-templates/${uid}/`, data ?? {}),
    createTemplates: (data) => this.users_client.post('/users-templates/', data),
    updateTemplates: (data, uid) => this.users_client.patch(`/users-templates/${uid}/`, data ?? {})
  };
  passwords = {
    verifyToken: (token) => this.users_client.get(`/reset_password/${token}/`),
    createOtp: (token, otp) => this.users_client.post(`/reset_password/${token}/`, otp),
    create: (token, passwords) => this.users_client.patch(`/reset_password/${token}/`, passwords ?? {})
  };
  tko = {
    getTkoById: (id, uid) =>
      uid
        ? this.search_client.get(`/ap/${id}/temporary-access/`, { params: { subprocess_uid: uid } })
        : this.search_client.get(`/ap/${id}`),
    uploadFiles: (data) => this.mass_load_client.post('/upload/', data),
    uploadFilesDispute: (data, uid) => this.mass_load_client.post(`/upload/dispute-list-tko/${uid}/xlsx`, data),
    uploadFilesDisputeSubprocess: (data, uid) =>
      this.mass_load_client.post(`/upload/dispute-response-tko-data/${uid}/xlsx`, data),
    checkResult: (file_original_id, params) =>
      this.mass_load_client.get(`/check-result/${file_original_id}`, { params }),

    uploadGrantingAuthorityTKO: (data, id) => this.mass_load_client.post(`/upload/granting-authority/${id}/xlsx`, data),
    downloadGrantingAuthorityTkos: (params) => this.gateway_ms_process.get('/granting-authority/', { params }),
    getGrantingAuthorityTimeRows: (params) =>
      this.gateway_ms_process.get('/granting-authority/export-historical/', { params }),
    downloadDetails: (params) => this.ms_export.get('/export-ap-to-xml/', { params, responseType: 'blob' }),
    getAllOrganizations: (params) => this.gateway_ms_companies_client.get('/temp-party-registers', { params })
  };
  files = {
    downloadByUid: (uid) => this.files_client.get(`/files/${uid}`, { responseType: 'blob' })
  };
  directories = {
    getList: () => this.gateway_ms_reference_book_client.post('/reference-group/', {}),
    getDirectory: (id, params) => this.gateway_ms_reference_book_client.get(`/reference-type/${id}/`, { params }),
    addItemToDirectory: (data) => this.gateway_ms_reference_book_client.post(`/reference-book/`, data),
    archive: (id, data) => this.tko_client.patch(`/reference-book/${id}/archive/`, data ?? {}),
    download: (id) => this.tko_client.get(`/reference-type/${id}/export-file/`, { responseType: 'blob' }),
    // СВБ
    getSuppliers: (params) => this.gateway_ms_companies_client.get(`/suppliers/`, { params }),
    downloadSuppliers: () => this.tko_client.get(`/suppliers/export-file/`, { responseType: 'blob' }),
    uploadSuppliers: (data) => this.tko_client.post(`/suppliers/upload-supplier/`, data),
    // ОСР
    getGridAccessProviders: (params) => this.gateway_ms_companies_client.get(`/grid-access-providers/`, { params }),
    downloadGridAccessProviders: () =>
      this.tko_client.get(`/grid-access-providers/export-file/`, { responseType: 'blob' })
  };
  processes = {
    getList: (params) => this.processes_client_v2.get(`/subprocess/list`, { params }),
    downloadExportProcesses: () => this.reports_client.get('/export-processes', { responseType: 'blob' }),
    getDistinctProcesses: (uid) => this.processes_client_v2.get(`/update-tko-data/${uid}`),
    getUpdateTkoDataProcesses: () => this.processes_client_v2.get(`/update-tko-data`),
    createDistinctProcesses: (data) => this.processes_client_v2.post(`/update-tko-data`, data),
    cancelDistinctProcesses: (uid) => this.processes_client_v2.post(`/update-tko-data/${uid}/cancel`),
    completeDistinctProcesses: (uid, comment) =>
      this.processes_client_v2.post(`/update-tko-data/${uid}/complete`, comment ? { comment } : null),
    uploadFilesDistinctProcesses: (uid, data) =>
      this.mass_load_client.post(`/upload/distinct-update-tko-data/${uid}/xlsx`, data),
    // CONNECTING/DISCONNECTING
    getConnectionDisconnectionAps: (uid, params) =>
      this.processes_client_v2.get(`/connect-disconnect-tko/${uid}/aps`, { params }),
    checkConnectionDisconnectionAp: (uid, data) =>
      this.processes_client_v2.post(`/connect-disconnect-tko/${uid}/bind-ap`, data),
    uncheckConnectionDisconnectionAp: (uid, data) =>
      this.processes_client_v2.post(`/connect-disconnect-tko/${uid}/unbind-ap`, data),
    initConnectionDisconnectionProcess: (data) => this.processes_client_v2.post(`/connect-disconnect-tko`, data),
    uploadConnectingTKOFiles: (uid, data) => this.mass_load_client.post(`/upload/connect-tko/${uid}/xlsx`, data),
    uploadDisconnectingTKOFiles: (uid, data) => this.mass_load_client.post(`/upload/disconnect-tko/${uid}/xlsx`, data),
    uploadConnectingDisconnectingMassActionAp: (uid, data) =>
      this.processes_client_v2.post(`/connect-disconnect-tko/${uid}/mass-action-ap`, data),
    exportConnectingDisconnectingAps: (uid) => this.processes_client_v2.get(`/connect-disconnect-tko/${uid}/export-ap`),
    getConnectionDisconnectionDetails: (uid, params) =>
      this.processes_client_v2.get(`/connect-disconnect-tko/${uid}`, { params }),
    toFormConnectDisconnectProcess: (uid, data) =>
      this.processes_client_v2.post(`/connect-disconnect-tko/${uid}/to-form`, data),
    getConnectingDisconnectingTKOFiles: (uid) => this.processes_client_v2.get(`/connect-disconnect-tko/${uid}/files`),
    getConnectionDisconnectionSubProcesses: (uid, params) =>
      this.processes_client_v2.get(`/connect-disconnect-tko/${uid}/subprocesses`, { params }),
    cancelConnectionDisconnectionProcess: (uid) =>
      this.processes_client_v2.post(`/connect-disconnect-tko/${uid}/cancel`),
    removeConnectionDisconnectionPoint: (process_uid, point_uid) =>
      this.processes_client_v2.post(`/connect-disconnect-tko/${process_uid}/cancel-ap`, { uid: point_uid }),
    confirmConnectionDisconnectionPoint: (uid, data) =>
      this.processes_client_v2.post(`/connect-disconnect-tko/${uid}/confirm-ap`, data),
    rejectConnectionDisconnectionPoint: (uid, data) =>
      this.processes_client_v2.post(`/connect-disconnect-tko/${uid}/reject-ap`, data),
    initConnectionDisconnectionSubprocess: (uid) =>
      this.processes_client_v2.post(`/connect-disconnect-tko/${uid}/take-to-work`),
    doneConnectDisconnect: (uid, data) =>
      this.processes_client_v2.post(`/connect-disconnect-tko/${uid}/complete`, data),

    // DISPUTE TKO
    getDisputePartyAko: (params) => this.gateway_ms_companies_client.get('/dispute-party-registers', { params }),
    createDisputeTko: (data) => this.processes_client_v2.post('/dispute-request-data-in-atko', data),
    getDisputeTko: (uid) => this.processes_client_v2.get(`/dispute-request-data-in-atko/${uid}`),
    getDisputeTkoChild: (uid, params) =>
      this.processes_client_v2.get(`/dispute-request-data-in-atko/${uid}/subprocesses`, {
        params
      }),
    cancelDisputeTko: (uid) => this.processes_client_v2.post(`/dispute-request-data-in-atko/${uid}/cancel`),
    updateDisputeTko: (uid) => this.processes_client_v2.post(`/dispute-request-data-in-atko/${uid}/complete`),
    getDisputeTkoSubprocess: (subprocess_uid) =>
      this.processes_client_v2.get(`/dispute-update-ap-data/${subprocess_uid}`),
    getDisputeAtkos: (params) => this.processes_client_v2.get('/dispute-request-data-in-atko', { params }),
    startDisputeTkoSubprocess: (subprocess_uid) =>
      this.processes_client_v2.post(`/dispute-update-ap-data/${subprocess_uid}/take-to-work`),
    exportFileDisputeTkoSubprocess: (subprocess_uid) =>
      this.processes_client_v2.get(`/dispute-update-ap-data/${subprocess_uid}/export-ap-file`, {
        responseType: 'blob'
      }),
    doneFileDisputeTkoSubprocess: (subprocess_uid, data, withoutAps) =>
      this.processes_client_v2.post(
        `/dispute-update-ap-data/${subprocess_uid}/done${withoutAps ? '-without-aps' : ''}`,
        data
      ),
    uploadFileDisputeDetails: (uid, data) =>
      this.processes_client_v2.post(`/dispute-request-data-in-atko/${uid}/file-description`, data),
    deleteFileDisputeDetails: (uid) =>
      this.processes_client_v2.delete(`/dispute-request-data-in-atko/${uid}/file-description`),

    // CHANGE SUPPLIER
    changeSupplierStart: (data) => this.processes_client_v2.post(`/change-supplier-to-supplier`, data),
    changeSupplierTkos: (uid, params) =>
      this.processes_client_v2.get(`/change-supplier-to-supplier/${uid}/tkos`, { params }),
    changeSupplierPredictableTkos: (uid, params) =>
      this.processes_client_v2.get(`/change-supplier-to-supplier/predictable-consumption-odko/${uid}/tkos`, { params }),
    changeSupplierInforming: (uid, params, path) =>
      this.processes_client_v2.get(`/change-supplier-to-supplier/${path}/${uid}/tkos`, { params }),
    changeSupplierInformingFiles: (uid, path) =>
      this.processes_client_v2.get(`/change-supplier-to-supplier/${path}/${uid}/files`),
    changeSupplierInformingDone: (uid, path) =>
      this.processes_client_v2.post(`/change-supplier-to-supplier/${path}/${uid}/to-form`),
    changeSupplierFiles: (uid, params) =>
      this.processes_client_v2.get(`/change-supplier-to-supplier/${uid}/files`, { params }),
    changeSupplierUpload: (uid, params, data) =>
      this.processes_client_v2.post(`/change-supplier-to-supplier/${uid}/upload`, data),
    changeSupplierUploadApsMassCancel: (uid, data) =>
      this.processes_client_v2.post(`/change-supplier-to-supplier/${uid}/aps-mass-cancel`, data),
    exportChangeSupplyAps: (uid) => this.processes_client_v2.get(`/change-supplier-to-supplier/${uid}/export-ap`),
    uploadChangeSupplyTestFile: (uid, data) =>
      this.mass_load_client.post(`/upload/change-supplier-to-supplier-authority-less/${uid}/xlsx`, data),
    changeSupplierPredictableUpload: (uid, data) =>
      this.mass_load_client.post(`/upload/predictable-consumption-odko/${uid}/xlsx`, data),
    changeSupplierForming: (uid) => this.processes_client_v2.post(`/change-supplier-to-supplier/${uid}/to-form`),
    changeSupplierPredictableForming: (uid) =>
      this.processes_client_v2.post(`/change-supplier-to-supplier/predictable-consumption-odko/${uid}/to-form`),
    deleteTkoById: (uid, body) =>
      this.processes_client_v2.delete(`/change-supplier-to-supplier/${uid}/delete-ap`, { data: body }),
    changeSupplierPredictableDone: (uid) =>
      this.processes_client_v2.post(`/change-supplier-to-supplier/predictable-consumption-odko/${uid}/done`),
    changeSupplierPredictableFiles: (uid, params) =>
      this.processes_client_v2.get(`/change-supplier-to-supplier/predictable-consumption-odko/${uid}/files`, {
        params
      }),
    changeSupplierInformingAkoTkos: (uid, params) =>
      this.processes_client_v2.get(`/change-supplier-to-supplier/informing-ako-for-change-supplier/${uid}/tkos`, {
        params
      }),
    changeSupplierInformingAkoFiles: (uid, type, params) =>
      this.processes_client_v2.get(
        `/change-supplier-to-supplier/informing-ako-for-change-supplier/${uid}/files/${type}`,
        { params }
      ),
    changeSupplierInformingAkoInforming: (uid) =>
      this.processes_client_v2.get(
        `/change-supplier-to-supplier/informing-ako-for-change-supplier/${uid}/informing-process-members`
      ),
    changeSupplierInformingAkoDetails: (uid, type, params) =>
      this.processes_client_v2.get(
        `/change-supplier-to-supplier/informing-ako-for-change-supplier/${uid}/detail-informing/${type}`,
        { params }
      ),
    // Receiving Dko Actual
    getWorkdaysReceivingDkoActual: (data) => this.ms_settings.post(`/workdays`, data),
    initReceivingDkoActual: (data) => this.processes_client_v2.post(`/receiving-dko-actual`, data),
    getReceivingDkoActual: (uid) => this.processes_client_v2.get(`/receiving-dko-actual/${uid}/tkos`),
    getReceivingDkoActualUploadedFiles: (uid, params) =>
      this.processes_client_v2.get(`/receiving-dko-actual/${uid}/uploaded_files`, { params }),
    doneReceivingDkoActual: (uid) => this.processes_client_v2.post(`/receiving-dko-actual/${uid}/formed`),
    cancelReceivingDkoActual: (uid) => this.processes_client_v2.post(`/receiving-dko-actual/${uid}/cancel`),
    uploadReceivingDkoActual: (uid, data) =>
      this.mass_load_client.post(`/upload/receiving-dko-actual/${uid}/xlsx`, data),

    getReceivingDkoActualSubprocess: (uid, params) =>
      this.processes_client_v2.get(`/receiving-dko-actual/${uid}/subprocesses`, { params }),
    // Receiving Dko Historical
    initReceivingDkoHistorical: (data) => this.processes_client_v2.post(`/receiving-dko-historical`, data),
    getReceivingDkoHistorical: (uid, params) =>
      this.processes_client_v2.get(`/receiving-dko-historical/${uid}/tkos`, { params }),
    getReceivingDkoHistoricalFiles: (uid, params) =>
      this.processes_client_v2.get(`/receiving-dko-historical/${uid}/uploaded_files`, { params }),
    doneReceivingDkoHistorical: (uid) => this.processes_client_v2.post(`/receiving-dko-historical/${uid}/formed`),
    cancelReceivingDkoHistorical: (uid) => this.processes_client_v2.post(`/receiving-dko-historical/${uid}/cancel`),
    uploadReceivingDkoHistorical: (uid, data) =>
      this.mass_load_client.post(`/upload/receiving-dko-historical/${uid}/xlsx`, data),
    getReceivingDkoHistoricalSubprocess: (uid, params) =>
      this.processes_client_v2.get(`/receiving-dko-historical/${uid}/subprocesses`, { params }),
    // Termination Resumption TKO
    getTerminationResumptionInitData: (params) =>
      this.processes_client_v2.get('/change-supply-status/accounting_points', { params }),
    initTerminationResumption: (data) => this.processes_client_v2.post(`/change-supply-status`, data),
    toFormTerminationResumption: (uid, data) =>
      this.processes_client_v2.post(`/change-supply-status/${uid}/to-form`, data),
    getTerminationResumptionFiles: (uid) => this.processes_client_v2.get(`/change-supply-status/${uid}/files`),
    getTerminationResumptionCheckedAccountPoints: (uid, ap_uid, params) =>
      this.processes_client_v2.post(`/change-supply-status/${uid}/checkout/${ap_uid}`, {}, { params }),
    getTerminationResumptionAccountingPoints: (uid, params) =>
      this.processes_client_v2.get(`/change-supply-status/${uid}/accounting-points`, { params }),
    uploadTerminationResumptionFiles: (uid, data) =>
      this.mass_load_client.post(`/upload/change-supply-status/${uid}/xlsx`, data),
    uploadTerminationResumptionApsMassCancel: (uid, data) =>
      this.processes_client_v2.post(`/change-supply-status/${uid}/aps-mass-cancel`, data),
    exportTerminationResumptionAps: (uid) => this.processes_client_v2.get(`/change-supply-status/${uid}/export-ap`),
    getTerminationResumptionDetails: (uid, params) =>
      this.processes_client_v2.get(`/change-supply-status/${uid}`, { params }),
    getTerminationResumptionRequests: (uid, params) =>
      this.processes_client_v2.get(`/change-supply-status/${uid}/subprocesses`, { params }),
    confirmTerminationResumption: (uid, data) =>
      this.processes_client_v2.post(`/change-supply-status/${uid}/confirm-supply-status-change`, data),
    // Granting Authority TKO
    initGrantingAuthority: () => this.processes_client_v2.post('/granting-authority'),
    getGrantingAuthority: (uid) => this.processes_client_v2.get(`/granting-authority/${uid}`),
    getTkosGrantingAuthority: (uid, params) =>
      this.processes_client_v2.get(`/granting-authority/${uid}/aps`, { params }),
    getFilesGrantingAuthority: (uid, params) =>
      this.processes_client_v2.get(`/granting-authority/${uid}/files`, { params }),
    getGeneratedFilesGrantingAuthority: (uid, params) =>
      this.processes_client_v2.get(`/granting-authority/${uid}/resulted-files`, { params }),
    formGrantingAuthority: (uid) => this.processes_client_v2.post(`/granting-authority/${uid}/formed`),
    historicalDkoGrantingAuthority: (uid) =>
      this.processes_client_v2.get(`/granting-authority/${uid}/historical-timeseries`),
    removeTerminationResumptionPoint: (uid, pointUid) =>
      this.processes_client_v2.post(`/change-supply-status/${uid}/remove-point/${pointUid}`),
    cancelTerminationResumption: (uid) => this.processes_client_v2.post(`/change-supply-status/${uid}/cancel`)
  };
  pon = {
    getSuppliers: (params) => this.companies_client.get(`/suppliers`, { params }),
    getReasons: () => this.processes_client_v2.get('/change-supplier-to-pon/reasons-termination-supply/'),
    searchSuppliers: (params) => this.tko_client.get(`/suppliers/for-pon/`, { params }),
    createPon: (params) => this.processes_client_v2.post(`/change-supplier-to-pon/`, params),
    getPonById: (id) => this.processes_client_v2.get(`/change-supplier-to-pon/${id}/`),
    cancelProcess: (id) => this.processes_client_v2.patch(`/change-supplier-to-pon/${id}/cancel/`, {}),
    exportTko: (id, params) =>
      this.processes_client_v2.get(`/change-supplier-to-pon/${id}/export-file/`, {
        params,
        responseType: 'blob'
      }),
    getRequests: (uid, requests_type, params) => {
      switch (requests_type) {
        case 'tko':
          return this.processes_client_v2.get(`/change-supplier-to-pon/${uid}/requests-tko-data/`, { params });
        case 'historicalDko':
          return this.processes_client_v2.get(`/change-supplier-to-pon/${uid}/requests-historical-dko/`, { params });
        case 'actualDko':
          return this.processes_client_v2.get(`/change-supplier-to-pon/${uid}/requests-actual-dko/`, { params });
        default:
          return this.processes_client_v2.get(`/change-supplier-to-pon/${uid}/informing-pon/`, { params });
      }
    },

    // Заявка на оновлення характеристик ТКО (для АТКО; в рамках ПОН)

    getRequestTko: (uid) => this.processes_client_v2.get(`/change-supplier-to-pon/request-tko-data/${uid}/`),
    startRequestTko: (uid) =>
      this.processes_client_v2.patch(`/change-supplier-to-pon/request-tko-data/${uid}/start/`, {}),
    cancelRequestTko: (uid) =>
      this.processes_client_v2.patch(`/change-supplier-to-pon/request-tko-data/${uid}/cancel/`, {}),
    doneRequestTko: (uid) =>
      this.processes_client_v2.patch(`/change-supplier-to-pon/request-tko-data/${uid}/done/`, {}),
    deleteRequestTkoUploadedTko: (uid) =>
      this.processes_client_v2.post(`/change-supplier-to-pon/request-tko-data/${uid}/delete_files/`),
    uploadFileWithTko: (mode, subprocess_uid, data) =>
      this.mass_load_client.post(
        mode === 'new'
          ? `/upload/pup-create-tko/${subprocess_uid}/xlsx`
          : `/upload/pup-update-tko/${subprocess_uid}/xlsx`,
        data
      ),
    // ОДКО. Створена для ОДКО заявка на отримання історичних ДКО.

    getHistoricalDko: (uid) => this.processes_client_v2.get(`/change-supplier-to-pon/request-historical-dko/${uid}/`),
    downloadHistoricalDkoTkos: (uid) =>
      this.processes_client_v2.get(`/change-supplier-to-pon/request-historical-dko/${uid}/export-tko-file/`, {
        responseType: 'blob'
      }),
    uploadHistoricalDko: (subprocess_uid, data) =>
      this.ms_ts_client.post(`/upload/request-historical-dko/${subprocess_uid}/xml`, data),
    getHistoricalDkoResults: (subprocess_uid, params) =>
      this.ms_ts_client.get(`/ts-results/request-historical-dko/${subprocess_uid}`, { params }),
    // ОДКО. Створена для ОДКО заявка  на отримання фактичних показників.

    getActualDko: (uid) => this.processes_client_v2.get(`/change-supplier-to-pon/request-actual-dko/${uid}/`),
    downloadActualDkoTkos: (uid) =>
      this.processes_client_v2.get(`/change-supplier-to-pon/request-actual-dko/${uid}/export-tko-file/`, {
        responseType: 'blob'
      }),
    uploadActualDko: (subprocess_uid, data) =>
      this.ms_ts_client.post(`/upload/request-actual-dko/${subprocess_uid}/xml`, data),
    getActualDkoResults: (subprocess_uid) => this.ms_ts_client.get(`/ts-results/request-actual-dko/${subprocess_uid}`),
    checkResult: (file_original_id, params) => this.ms_ts_client.get(`/check-result/${file_original_id}`, { params }),
    // Заявка  на переведення ТКО (Інформування ПОН)

    getPonInforming: (uid) => this.processes_client_v2.get(`/change-supplier-to-pon/informing-pon/${uid}/`),
    getPonInformingList: (uid, params) => this.gateway_ms_companies_client.get(`/ap/for-informing-pon/`, { params }),
    downloadPonInformingFile: (uid) =>
      this.processes_client_v2.get(`/change-supplier-to-pon/informing-pon/${uid}/export-tko-file/`, {
        responseType: 'blob'
      }),
    getPonInformingTkoDetail: (uid, uid_tko) => this.ms_ts_client.get(`/ts-informing-pon/${uid}/${uid_tko}`),
    createFilesPonInforming: (uid) => this.reports_client.post(`/informing-pon/historical-dko/${uid}/create/`),
    getFilesPonInforming: (uid, params) =>
      this.reports_client.get(`/informing-pon/historical-dko/${uid}/files/`, { params }),
    // Заявка  на отримання ДКО на дату (фактично Інформування ПОН, але по іншим часовим рядам)

    getPonProvideActualDko: (uid) => this.processes_client_v2.get(`/change-supplier-to-pon/provide-actual-dko/${uid}/`),
    getPonProvideActualDkoGTS: (params) => this.gts_client.get(`/gts/`, { params }),
    startPonProvideActualDko: (uid) =>
      this.processes_client_v2.patch(`/change-supplier-to-pon/provide-actual-dko/${uid}/start/`, {}),
    downloadPonProvideActualDkoFile: (uid) =>
      this.processes_client_v2.get(`/change-supplier-to-pon/provide-actual-dko/${uid}/export-tko-file/`, {
        responseType: 'blob'
      }),
    getPonProvideActualDkoTkoDetail: (uid, tko_uid) => this.ms_ts_client.get(`/ts-actual-dko/${uid}/${tko_uid}`)
  };
  ppko = {
    getPpkoList: (params) => this.ppko_client.get(`/ppko`, { params }),
    getPpkoById: (id) => this.ppko_client.get(`/ppko/${id}`),
    uploadDocument: (id) => this.ppko_client.get(`/ppko_contract/${id}`),
    downloadDocumentFile: (id) => this.ppko_client.get(`/file_download/${id}`, { responseType: 'blob' }),
    uploadDocumentFile: (data) => this.ppko_client.post(`/ppko_contract_file/`, data),
    updateDocument: (data, id) =>
      id ? this.ppko_client.patch(`/ppko_contract/${id}`, data) : this.ppko_client.post(`/ppko_contract`, data ?? {}),
    download: (id) => this.ppko_client.get(`/ppko_xlsx/download/${id}`, { responseType: 'blob' }),
    getPublicationsEmails: () => this.ppko_client.get('/ppko_publication_emails'),
    updatePublicationsEmails: (data) => this.ppko_client.post('/ppko_publication_emails', data),
    onPublication: () => this.ppko_client.post('/publicate/'),
    getPpkoChecById: (id) => this.ppko_client.get(`/ppko_check/${id}`),
    savePpkoCheck: (data) => this.ppko_client.post(`/ppko_check`, data),
    updatePpkoCheck: (data, id) => this.ppko_client.patch(`/ppko_check/${id}`, data ?? {}),
    getPpkoJSONById: (id) => this.ppko_client.get(`/get-edit-json/${id}`),
    getPpkoConstants: () => this.ppko_client.get(`/constants`),
    getPpkoLists: (type, params) => {
      return {
        region: (params) => this.ms_ppko_submission.get('/address-reference/region', { params }),
        district: (params) => this.ms_ppko_submission.get('/address-reference/district', { params }),
        settlementTypes: (params) => this.ms_ppko_submission.get('/address-reference/settlement-type', { params }),
        streetTypes: (params) => this.ms_ppko_submission.get('/address-reference/street-type', { params }),
        roomTypes: (params) => this.ms_ppko_submission.get('/address-reference/room-type', { params })
      }[type](params);
    },
    savePpko: (id, data) => this.ppko_client.put(`/ppko/${id}`, data ?? {}),
    downloadExternalFile: (id) => this.ppko_client.get(`/file_download/${id}`, { responseType: 'blob' })
  };
  timeSeries = {
    getList: (params) => this.ts_client.get(`/time-series/`, { params }),
    downloadById: (id) => this.ts_client.get(`/download/${id}/`, { responseType: 'blob' }),
    uploadFile: (data) => this.mass_load_client.post('/upload/time-series-load', data)
  };
  reports = {
    getList: () => this.tko_client.get('/reports/info/'),
    download: (url) => this.tko_client.get(url + '/', { responseType: 'blob' })
  };
  eos = {
    getInitList: (params) => this.processes_client_v2.get(`/end-supply/init`, { params }),
    create: (data) => this.processes_client_v2.post(`/end-supply`, data),
    getById: (uid) => this.processes_client_v2.get(`/end-supply/${uid}`),
    uploadFile: (uid, data) => this.mass_load_client.post(`/upload/prolongation-tko-by-supplier/${uid}/xlsx`, data)
  };
  mms = {
    getInfo: (params) => this.mms_client.get(`/mms/info`, { params }),
    uploadFile: (data) => this.mms_client.post('/mms/upload/xml', data),
    getAggregatedData: (transaction_id) => this.mms_client.get(`/mms/aggregated/${transaction_id}`)
  };
  suppliers = {
    getList: (params) => this.companies_client.get(`/suppliers-history`, { params }),
    getHistory: (uid) => this.gateway_ms_companies_client.get(`/suppliers-history/${uid}/`),
    download: () => this.tko_client.get(`/suppliers-history/export/`),
    downloadByUid: (uid) => this.tko_client.get(`/suppliers-history/${uid}/export/`),
    changeStatus: (data) => this.tko_client.put(`/suppliers-history/change-status/`, data),
    getTempUserActivation: (params) => this.users_client.get('/temp-user-activation/', { params }),
    updateTempUserActivation: (uid, data) => this.users_client.patch(`/temp-user-activation/${uid}/`, data ?? {}) // activated: true / false
  };
  gts = {
    getGtsList: (type, params) =>
      type === 'z'
        ? this.gts_client.get(`/gts/`, { params })
        : type === 'zv'
        ? this.zv_client.get('/zv-ts-list/', { params })
        : this.zv_client.get('/zv-custom-ts-list/', { params }),
    gtsDownloadDKO: (type, params) =>
      this.reports_client.post(
        type === 'zv-custom' ? '/export-ts-by-zv-custom/create-file/' : '/export-ts-by-zv/create-file/',
        params,
        { responseType: 'blob' }
      ),
    gtsDownloadFile: (uid, params) =>
      this.ms_ts_client.get(`/z/${uid}/download-file/by-hour/`, {
        params,
        responseType: 'blob'
      }),
    getGtsInfo: (params) => this.gts_client.get(`/gts/info`, { params }),
    uploadFiles: (data) => this.gts_client.post(`/gts/upload/xml`, data),
    getUploadResult: (uid, params) => this.gts_client.get(`/gts/result/detail/${uid}`, { params }),
    downloadFile: (uid, params) =>
      this.ms_ts_client.get(`/tko-ts/${uid}/download-file/by-hour/`, {
        params,
        responseType: 'blob'
      }),
    getDkoData: (uid, type, period, params) => this.ms_ts_client.get(`/${type}/${uid}/${period}/`, { params }),
    getReports: (params) => this.reports_client.get(`/transfer-ts-reports/`, { params }),
    updateReportByEic: (report_uid, data) =>
      this.reports_client.post(`/transfer-ts-reports/by-eic/${report_uid}/update/`, data),
    getReportByEic: (report_uid, params) =>
      this.reports_client.get(`/transfer-ts-reports/by-eic/${report_uid}/`, { params }),
    createReportByEic: (report_uid, data) =>
      this.reports_client.post(`/transfer-ts-reports/by-eic/${report_uid}/create-files/`, data),
    createReportByRelease: (report_uid, data) =>
      this.reports_client.post(`/transfer-ts-reports/by-release/${report_uid}/create-files/`, data),
    createReportByParams: (data) => this.reports_client.post(`/transfer-ts-reports/by-properties/`, data),
    getEicYList: () => this.reports_client.get(`/transfer-ts-reports/zv/mga/`),
    createInstanceByZV: () => this.reports_client.post(`transfer-ts-reports/zv/init/`),
    createInstanceByComponentsZV: () => this.reports_client.post(`transfer-ts-reports/by-components-zv/init/`),
    updateReportByZV: (report_uid, data) =>
      this.reports_client.post(`/transfer-ts-reports/zv/${report_uid}/update/`, data),
    updateReportByComponentsZV: (report_uid, data) =>
      this.reports_client.post(`/transfer-ts-reports/by-components-zv/${report_uid}/update/`, data),
    getReportByZV: (report_uid, params) =>
      this.reports_client.get(`/transfer-ts-reports/zv/${report_uid}/`, { params }),
    getReportByComponentsZV: (report_uid, params) =>
      this.reports_client.get(`/transfer-ts-reports/by-components-zv/${report_uid}/`, { params }),
    verifyZV: (params) => this.reports_client.get(`/transfer-ts-reports/zv/get_zv/`, { params }),
    verifyComponentsZV: (params) =>
      this.reports_client.get(`/transfer-ts-reports/by-components-zv/get_zv/`, { params }),
    verifyZvCode: (report_uid, params) =>
      this.reports_client.get(`/transfer-ts-reports/zv/${report_uid}/get_zv/`, { params }),
    verifyComponentsZvCode: (report_uid, params) =>
      this.reports_client.get(`/transfer-ts-reports/by-components-zv/${report_uid}/get_zv`, { params }),
    createReportByZV: (report_uid, data) =>
      this.reports_client.post(`/transfer-ts-reports/zv/${report_uid}/create-files/`, data),
    createReportByComponentsZV: (report_uid, data) =>
      this.reports_client.post(`/transfer-ts-reports/by-components-zv/${report_uid}/create-files/`, data),
    uploadZVFile: (uid, data) => this.reports_client.post(`/transfer-ts-reports/zv/${uid}/upload-file/`, data),
    uploadComponentsZVFile: (uid, data) =>
      this.reports_client.post(`/transfer-ts-reports/by-components-zv/${uid}/upload-file/`, data),
    revokeReport: (uid) => this.reports_client.post(`/transfer-ts-reports/revoke/${uid}/`),
    settingsDirectoryReport: (type, params) =>
      this.reports_client.get(`/transfer-ts-reports/${type}/settings/`, { params }),
    generalSettingsReport: (type) => this.reports_client.get(`/transfer-ts-reports/${type}/settings/general/`),
    gtsCreateTkoInstance: (type, data) => this.reports_client.post(`/transfer-ts-reports/${type}/create/`, data),
    gtsVerifyTko: (type, uid, data) =>
      this.reports_client.post(`/transfer-ts-reports/${type}/${uid}/validate-tko/`, data),
    updateReportByRelease: (report_uid, data) =>
      this.reports_client.post(`/transfer-ts-reports/by-release/${report_uid}/update/`, data),
    uploadFileByEic: (uid, data) => this.reports_client.post(`/transfer-ts-reports/by-eic/${uid}/upload-file/`, data),
    uploadFileByRelease: (uid, data) =>
      this.reports_client.post(`/transfer-ts-reports/by-release/${uid}/upload-file/`, data),
    getReportByRelease: (report_uid, params) =>
      this.reports_client.get(`/transfer-ts-reports/by-release/${report_uid}/`, { params }),
    updateReportByVersion: (report_uid, data) =>
      this.reports_client.post(`/transfer-ts-reports/by-version/${report_uid}/update/`, data),
    getReportByVersion: (report_uid, params) =>
      this.reports_client.get(`/transfer-ts-reports/by-version/${report_uid}/`, { params }),
    createReportByVersion: (report_uid, data) =>
      this.reports_client.post(`/transfer-ts-reports/by-version/${report_uid}/create-files/`, data),
    uploadFileByVersion: (uid, data) =>
      this.reports_client.post(`/transfer-ts-reports/by-version/${uid}/upload-file/`, data)
  };
  zv = {
    getList: (params) => this.ppko_client.get('/zv/', { params })
  };

  disputes = {
    getList: (params) => this.ms_dispute.get('/dispute', { params }),
    getEntity: (uid, params) => this.ms_dispute.get(`/dispute/tko/${uid}`, { params }),
    getEntityDko: (uid, params) => this.ms_dispute.get(`/dispute/dko/${uid}`, { params }),
    updateEntity: (uid, params) => this.ms_dispute.post(`/dispute/tko/${uid}/draft`, { ...params }),
    updateEntityDko: (uid, params) => this.ms_dispute.post(`/dispute/dko/${uid}/draft`, { ...params }),
    create: (data) => this.ms_dispute.post('/dispute/tko/draft', data),
    createDko: (data) => this.ms_dispute.post('/dispute/dko/draft', data),
    uploadFile: (uid, data) => this.ms_dispute.post(`/dispute/tko/${uid}/file`, data),
    uploadFileDko: (uid, data) => this.ms_dispute.post(`/dispute/dko/${uid}/file`, data),
    getFile: (uid) => this.ms_dispute.get(`/file/${uid}`, { responseType: 'blob' }),
    updateProps: (uid, params) => this.ms_dispute.post(`/dispute/tko/${uid}/properties`, { ...params }),
    getSettings: (params) => this.ms_dispute.get('/handbook/dispute-settings', { params }),
    doAction: ({ uid, action, params }) => this.ms_dispute.post(`/dispute/tko/${uid}/action/${action}`, { ...params }),
    doActionDko: ({ uid, action, params }) =>
      this.ms_dispute.post(`/dispute/dko/${uid}/action/${action}`, { ...params }),
    downloadFile: (link) =>
      this.ms_dispute.get(link, {
        responseType: 'blob'
      }),
    deleteFile: (link) => this.ms_dispute.delete(link)
  };

  constructor() {
    const env = getEnv();
    const getClient = (url) => {
      const client = axios.create({
        baseURL: env.baseUrl + url,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      });
      client.interceptors.request.use(async (config) => {
        const newAccess = await refreshToken();
        if (newAccess) {
          return update(config, ['headers', 'common', 'Authorization'], () => `Bearer ${newAccess}`);
        } else {
          return config;
        }
      });
      return client;
    };

    this.tko_client = getClient('/ms-tko/api/v1');
    this.gateway_ms_companies_client = getClient('/gateway/ms-companies/api/v1');
    this.gateway_ms_reference_book_client = getClient('/gateway/ms-reference-book/api/v1');
    this.gateway_ms_process = getClient('/gateway/ms-processes-v2/api/v1');
    this.users_client = getClient('/ms-users/api/v1');
    this.ppko_client = getClient('/ms-ppko/api/v1');
    this.ms_ppko_submission = getClient('/ms-ppko-submission/api/v1');
    this.mass_load_client = getClient('/ms-upload/api/v1');
    this.ts_client = getClient('/ms-ved/api/v1');
    this.ms_ts_client = getClient('/ms-ts/api/v1');
    this.files_client = getClient('/ms-files/api/v1');
    this.processes_client_v2 = getClient('/ms-processes-v2/api/v1');
    this.ms_settings = getClient('/ms-settings/api/v1');
    this.mms_client = getClient('/ms-mms/api/v1');
    this.gts_client = getClient('/ms-gts/api/v1');
    this.ms_dispute = getClient('/ms-dispute/api/v1');
    this.reports_client = getClient('/ms-reports/api/v1');
    this.zv_client = getClient('/ms-zv/api/v1');
    this.companies_client = getClient('/ms-companies/api/v1');
    this.search_client = getClient('/gateway/ms-search/api/v1');
    this.ms_export = getClient('/ms-export/api/v1');
  }
}

const api = new Api();

export default api;
