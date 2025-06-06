import {
  GET_TS_LIST_FAILURE,
  GET_TS_LIST_STARTED,
  GET_TS_LIST_SUCCESS,
  SET_TS_DIALOG_OPEN,
  SET_TS_LIST_PARAMS,
  UPLOAD_TS_FILE_CLEAR,
  UPLOAD_TS_FILE_FAILURE,
  UPLOAD_TS_FILE_STARTED,
  UPLOAD_TS_FILE_SUCCESS
} from '../actions/types';

export default function timeSeries(
  state = {
    loading: false,
    params: { page: 1, size: 25 },
    dialogState: undefined,
    openDialog: false,
    uploading: false,
    uploadingResponse: null,
    list: null,
    error: null
  },
  action
) {
  switch (action.type) {
    case SET_TS_LIST_PARAMS:
      return { ...state, params: { ...state.params, ...action.payload.params }, error: null };
    case GET_TS_LIST_STARTED:
      return { ...state, loading: true, error: null };
    case GET_TS_LIST_SUCCESS:
      return { ...state, loading: false, list: action.payload.data };
    case GET_TS_LIST_FAILURE:
      return { ...state, loading: false, error: action.payload.error };
    case SET_TS_DIALOG_OPEN:
      return { ...state, openDialog: action.payload.open, error: null };
    case UPLOAD_TS_FILE_STARTED:
      return { ...state, uploading: true, error: null };
    case UPLOAD_TS_FILE_SUCCESS:
      return { ...state, uploading: false, uploadingResponse: action.payload.data };
    case UPLOAD_TS_FILE_FAILURE:
      return { ...state, uploading: false, error: action.payload.error?.response?.data };
    case UPLOAD_TS_FILE_CLEAR:
      return { ...state, uploadingResponse: null };
    default:
      return state;
  }
}
