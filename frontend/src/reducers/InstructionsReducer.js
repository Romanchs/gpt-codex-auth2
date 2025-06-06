import {
  DOWNLOAD_INSTRUCTION_FAILURE,
  DOWNLOAD_INSTRUCTION_STARTED,
  DOWNLOAD_REPORT_FAILURE,
  DOWNLOAD_REPORT_STARTED,
  DOWNLOAD_REPORT_SUCCESS,
  GET_REPORTS_LIST_FAILURE,
  GET_REPORTS_LIST_STARTED,
  GET_REPORTS_LIST_SUCCESS
} from '../actions/types';

export default function instructions(
  state = {
    error: null,
    reports: [],
    loadingReports: [],
    loading: false
  },
  action
) {
  switch (action.type) {
    case GET_REPORTS_LIST_STARTED:
      return { ...state, loading: true, error: null };
    case GET_REPORTS_LIST_SUCCESS:
      return { ...state, loading: false, reports: action.payload };
    case GET_REPORTS_LIST_FAILURE:
      return { ...state, loading: false, error: action.payload.error };
    case DOWNLOAD_INSTRUCTION_STARTED:
      return { ...state, error: null };
    case DOWNLOAD_REPORT_STARTED:
      return {
        ...state,
        error: null,
        loadingReports: [...state.loadingReports, action.payload]
      };
    case DOWNLOAD_REPORT_SUCCESS:
      return {
        ...state,
        loadingReports: state.loadingReports.filter((i) => i !== action.payload)
      };
    case DOWNLOAD_INSTRUCTION_FAILURE:
    case DOWNLOAD_REPORT_FAILURE:
      return {
        ...state,
        error: action.payload.error,
        loadingReports: state.loadingReports.filter((i) => i !== action.payload.name)
      };
    default:
      return state;
  }
}
