import { GTS } from '../actions/types';

const initialState = {
  loading: false,
  loadingGeneralSettings: false,
  list: null,
  params: { page: 1, size: 25 },
  uploadFiles: null,
  listResults: [],
  reports: [],
  dkoData: null,
  notFound: false,
  error: null,
  reportSettings: {},
  quality_types: [],
  generalSettings: [],
  report_uid: '',
  reportByEic: null,
  reportByZV: null,
  reportByVersion: null,
  reportByComponentsZV: null,
  reportByCode: [],
  reportByRelease: null,
  report: [],
  eic_y_list: [{ value: 'null', label: 'Всі' }],
  originalSettings: {}
};

export default function gts(state = initialState, { type, payload }) {
  switch (type) {
    case GTS.GET_LIST_STARTED:
    case GTS.GET_DKO_DATA_STARTED:
    case GTS.GET_REPORTS_STARTED:
      return { ...state, loading: true };
    case GTS.GET_LIST_SUCCESS:
      return { ...state, loading: false, list: payload };
    case GTS.SET_LIST_PARAMS:
      return { ...state, params: payload };
    case GTS.GET_UPLOADED_FILES_SUCCESS:
      return { ...state, loading: false, uploadFiles: payload };
    case GTS.GET_RESULT_LIST_SUCCESS:
      return { ...state, loading: false, listResults: payload };
    case GTS.GET_DKO_DATA_SUCCESS:
      return { ...state, loading: false, dkoData: payload };
    case GTS.CLEAR_DKO_DATA:
      return { ...state, loading: false, notFound: false, dkoData: null };
    case GTS.GET_REPORTS_SUCCESS:
      return { ...state, loading: false, reports: payload };
    case GTS.GET_LIST_FAILURE:
    case GTS.GET_DKO_DATA_FAILURE:
    case GTS.GET_REPORTS_FAILURE:
      return {
        ...state,
        loading: false,
        error: payload.error?.response,
        notFound: payload?.error?.response?.status === 404
      };
    case GTS.DOWNLOAD_TKO_REPORT_FAILURE:
      return { ...state, error: payload.error };
    case GTS.CLEAR:
      return initialState;
    case GTS.DOWNLOAD_REPORT_STARTED:
      return { ...state, loading: true };
    case GTS.DOWNLOAD_REPORT_SUCCESS:
      return { ...state, loading: false };
    case GTS.DOWNLOAD_REPORT_FAILURE:
      return { ...state, loading: false };
    case GTS.GTS_REVOKE_REPORT_STARTED:
      return { ...state, loading: true };
    case GTS.GTS_REVOKE_REPORT_SUCCESS:
      return { ...state, loading: false };
    case GTS.GTS_REVOKE_REPORT_FAILURE:
      return { ...state, loading: false };
    case GTS.ORIGINAL_SETTINGS_DATA:
      return { ...state, originalSettings: payload };
    case GTS.SET_REPORT_FILTERS:
      return { ...state, reportSettings: payload };
    case GTS.ERROR:
      return { ...state, error: payload?.error?.response.data, loading: false };
    case GTS.SET_UID_FOR_DIFFERENT_REPORTS:
      return { ...state, report_uid: payload };
    case GTS.UPDATE_REPORT_BY_EIC_STARTED:
    case GTS.UPDATE_REPORT_BY_ZV_STARTED:
    case GTS.CREATE_REPORT_BY_RELEASE_STARTED:
    case GTS.UPDATE_REPORT_BY_COMPONENTS_ZV_STARTED:
    case GTS.UPDATE_REPORT_BY_VERSION_STARTED:
      return { ...state, loading: true };
    case GTS.UPDATE_REPORT_BY_EIC_SUCCESS:
      return { ...state, loading: false, reportByEic: payload };
    case GTS.UPDATE_REPORT_BY_VERSION_SUCCESS:
      return { ...state, loading: false, reportByVersion: payload };
    case GTS.DELETE_ALL_TKOS:
      return { ...state, loading: false, reportByEic: null, report_uid: '' };
    case GTS.DELETE_ALL_TKOS_BY_VERSION:
      return { ...state, loading: false, reportByVersion: null, report_uid: '' };
    case GTS.UPDATE_REPORT_BY_ZV_SUCCESS:
      return { ...state, loading: false, reportByZV: payload };
    case GTS.UPDATE_REPORT_BY_COMPONENTS_ZV_SUCCESS:
      return { ...state, loading: false, reportByComponentsZV: payload };
    case GTS.UPDATE_REPORT_BY_RELEASE_SUCCESS:
      return { ...state, loading: false, reportByRelease: payload };
    case GTS.CREATE_REPORT_BY_EIC_SUCCESS:
      return {
        ...state,
        loading: false,
        reportByEic: null,
        reportSettings: { ...state.reportSettings, period_from: null, period_to: null }
      };
    case GTS.CREATE_REPORT_BY_VERSION_SUCCESS:
      return {
        ...state,
        loading: false,
        reportByVersion: null,
        reportSettings: { ...state.reportSettings, period_from: null, period_to: null }
      };
    case GTS.UPDATE_REPORT_BY_RELEASE_STARTED:
      return { ...state, reportByCode: payload, loading: true };
    case GTS.CREATE_REPORT_BY_RELEASE_SUCCESS:
      return {
        ...state,
        loading: false,
        report_uid: '',
        reportByRelease: null,
        reportSettings: { ...state.reportSettings, period_from: null, period_to: null }
      };
    case GTS.CREATE_REPORT_BY_RELEASE_FAILURE:
      return { ...state, loading: false, error: payload.error?.response };
    case GTS.CLEAR_UP:
      if (state.report_uid || state.reportByRelease) {
        return initialState;
      }
      return state;
    case GTS.GET_EIC_Y_LIST_SUCCESS:
      return {
        ...state,
        eic_y_list: [{ value: 'null', label: 'Всі' }, ...payload]
      };
    case GTS.SET_QUALITY_TYPE_LIST:
      return { ...state, quality_types: payload };

    case GTS.GENERAL_SETTINGS_REPORT_STARTED:
      return { ...state, loadingGeneralSettings: true };
    case GTS.GENERAL_SETTINGS_REPORT_SUCCESS:
      return { ...state, loadingGeneralSettings: false, generalSettings: payload };
    case GTS.GENERAL_SETTINGS_REPORT_FAILURE:
      return { ...state, loadingGeneralSettings: false, generalSettings: null };

    default:
      return state;
  }
}
