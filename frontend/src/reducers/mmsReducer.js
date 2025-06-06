import {
  MMS_CLOSE_SUCCESS_MODAL,
  MMS_GET_INFO_FAILURE,
  MMS_GET_INFO_STARTED,
  MMS_GET_INFO_SUCCESS,
  MMS_GET_SUCCESS_MODAL_FAILURE,
  MMS_GET_SUCCESS_MODAL_STARTED,
  MMS_GET_SUCCESS_MODAL_SUCCESS,
  MMS_SET_FAILURE_MODAL,
  MMS_SET_PARAMS,
  MMS_UPLOAD_FILE_FAILURE,
  MMS_UPLOAD_FILE_STARTED
} from '../actions/types';

export default function mms(
  state = {
    loading: false,
    data: [],
    params: { page: 1, size: 25 },
    successModal: null,
    failureModal: null,
    uploading: false,
    error: null
  },
  action
) {
  switch (action.type) {
    case MMS_GET_INFO_STARTED:
    case MMS_GET_SUCCESS_MODAL_STARTED:
      return { ...state, loading: true };
    case MMS_GET_INFO_SUCCESS:
      return { ...state, loading: false, data: action.payload };
    case MMS_GET_INFO_FAILURE:
    case MMS_GET_SUCCESS_MODAL_FAILURE:
      return { ...state, loading: false, error: action.payload };
    case MMS_SET_PARAMS:
      return { ...state, params: action.payload };
    case MMS_GET_SUCCESS_MODAL_SUCCESS:
      return { ...state, successModal: action.payload, loading: false };
    case MMS_CLOSE_SUCCESS_MODAL:
      return { ...state, successModal: null };
    case MMS_SET_FAILURE_MODAL:
      return { ...state, failureModal: action.payload };
    case MMS_UPLOAD_FILE_STARTED:
      return { ...state, uploading: true, error: null };
    case MMS_UPLOAD_FILE_FAILURE:
      return { ...state, uploading: false, error: action.payload.error };
    default:
      return state;
  }
}
