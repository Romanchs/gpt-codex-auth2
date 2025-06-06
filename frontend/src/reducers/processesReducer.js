import {
  CANCEL_DISTRICT_PROCESSES_TKO_FAILURE,
  CANCEL_DISTRICT_PROCESSES_TKO_STARTED,
  CANCEL_DISTRICT_PROCESSES_TKO_SUCCESS,
  CLEAR_UPLOAD_DATA,
  CURRENT_PROCESS,
  DONE_DISTRICT_PROCESSES_TKO_FAILURE,
  DONE_DISTRICT_PROCESSES_TKO_STARTED,
  DONE_DISTRICT_PROCESSES_TKO_SUCCESS,
  GET_DISTRICT_PROCESSES_TKO_FAILURE,
  GET_DISTRICT_PROCESSES_TKO_STARTED,
  GET_DISTRICT_PROCESSES_TKO_SUCCESS,
  GET_PROCESSES_FAILURE,
  GET_PROCESSES_STARTED,
  GET_PROCESSES_SUCCESS,
  GET_UPDATE_TKO_DATA_PROCESSES_TKO_FAILURE,
  GET_UPDATE_TKO_DATA_PROCESSES_TKO_STARTED,
  GET_UPDATE_TKO_DATA_PROCESSES_TKO_SUCCESS,
  START_DISTRICT_PROCESSES_TKO_FAILURE,
  START_DISTRICT_PROCESSES_TKO_STARTED,
  START_DISTRICT_PROCESSES_TKO_SUCCESS,
  UPLOAD_FILES_DISTRICT_PROCESSES_TKO_FAILURE,
  UPLOAD_FILES_DISTRICT_PROCESSES_TKO_STARTED,
  UPLOAD_FILES_DISTRICT_PROCESSES_TKO_SUCCESS
} from '../actions/types';

export default function processes(
  state = {
    loading: false,
    uploading: false,
    processesList: null,
    uploadingResponse: null,
    updateTkoData: null,
    dataChangeTkoDetail: null,
    notFound: false,
    error: null,
    currentProcess: null,
    accountingPoints: null,
    params: { page: 1, size: 25 }
  },
  action
) {
  switch (action.type) {
    case GET_PROCESSES_STARTED:
      return { ...state, loading: true };
    case GET_PROCESSES_SUCCESS:
      return { ...state, loading: false, processesList: action.payload.data };
    case GET_PROCESSES_FAILURE:
      return { ...state, loading: false, error: action.payload.error };

    case GET_DISTRICT_PROCESSES_TKO_STARTED:
      return { ...state, dataChangeTkoDetail: null, loading: true, error: null, notFound: false };
    case GET_DISTRICT_PROCESSES_TKO_SUCCESS:
      return { ...state, dataChangeTkoDetail: action.payload.data, loading: false };
    case GET_DISTRICT_PROCESSES_TKO_FAILURE:
      return {
        ...state,
        dataChangeTkoDetail: action.payload.data,
        loading: false,
        error: action.payload.error,
        notFound: action.payload.error?.response?.status === 404
      };

    case START_DISTRICT_PROCESSES_TKO_STARTED:
      return { ...state, dataChangeTkoDetail: null, loading: true, error: null };
    case START_DISTRICT_PROCESSES_TKO_SUCCESS:
      return { ...state, dataChangeTkoDetail: action.payload.data, loading: false };
    case START_DISTRICT_PROCESSES_TKO_FAILURE:
      return {
        ...state,
        dataChangeTkoDetail: action.payload.data,
        loading: false,
        error: action.payload.error
      };

    case CANCEL_DISTRICT_PROCESSES_TKO_STARTED:
      return { ...state, dataChangeTkoDetail: null, loading: true, error: null };
    case CANCEL_DISTRICT_PROCESSES_TKO_SUCCESS:
      return { ...state, dataChangeTkoDetail: null, loading: false };
    case CANCEL_DISTRICT_PROCESSES_TKO_FAILURE:
      return { ...state, dataChangeTkoDetail: null, loading: false, error: action.payload.error };

    case DONE_DISTRICT_PROCESSES_TKO_STARTED:
      return { ...state, dataChangeTkoDetail: null, loading: true, error: null };
    case DONE_DISTRICT_PROCESSES_TKO_SUCCESS:
      return { ...state, dataChangeTkoDetail: action.payload.data, loading: false };
    case DONE_DISTRICT_PROCESSES_TKO_FAILURE:
      return { ...state, loading: false, error: action.payload.error };

    case UPLOAD_FILES_DISTRICT_PROCESSES_TKO_STARTED:
      return { ...state, uploadingResponse: null, uploading: true, error: null };
    case UPLOAD_FILES_DISTRICT_PROCESSES_TKO_SUCCESS:
      return { ...state, uploadingResponse: action.payload.data, uploading: false };
    case UPLOAD_FILES_DISTRICT_PROCESSES_TKO_FAILURE:
      return {
        ...state,
        uploadingResponse: action.payload.data,
        uploading: false,
        error: action.payload.error
      };

    case GET_UPDATE_TKO_DATA_PROCESSES_TKO_STARTED:
      return { ...state, updateTkoData: null, uploading: true, error: null };
    case GET_UPDATE_TKO_DATA_PROCESSES_TKO_SUCCESS:
      return { ...state, updateTkoData: action.payload.data, uploading: false };
    case GET_UPDATE_TKO_DATA_PROCESSES_TKO_FAILURE:
      return {
        ...state,
        updateTkoData: action.payload.data,
        uploading: false,
        error: action.payload.error
      };

    case CLEAR_UPLOAD_DATA:
      return { ...state, uploading: false, error: null, uploadingResponse: null };
    case CURRENT_PROCESS.FETCH_STARTED:
      return { ...state, loading: true, notFound: false, error: null };
    case CURRENT_PROCESS.FETCH_FAILURE:
    case CURRENT_PROCESS.FETCH_FAILURE_WITHOUT_MESSAGE:
      return {
        ...state,
        loading: false,
        notFound:
          action.payload.error?.response?.status === 404 ||
          action.payload.error?.response?.data?.detail?.includes('немає дозволу'),
        error: action.payload?.error?.response?.data
      };
    case CURRENT_PROCESS.SET_DATA:
      return { ...state, loading: false, currentProcess: action.payload, notFound: false };
    case CURRENT_PROCESS.CLEAR:
      return {
        ...state,
        loading: false,
        currentProcess: null,
        notFound: false,
        uploading: false,
        uploadingResponse: null,
        accountingPoints: null,
        error: null
      };
    case CURRENT_PROCESS.UPDATE:
      return { ...state, currentProcess: action.payload, loading: false };
    case CURRENT_PROCESS.SET_PARAMS:
      return { ...state, params: action.payload.params, error: null };
    case CURRENT_PROCESS.CLEAR_PARAMS:
      return { ...state, params: { page: 1, size: 25 }, error: null };
    default:
      return state;
  }
}
