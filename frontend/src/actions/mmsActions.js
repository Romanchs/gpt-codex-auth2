import api from '../util/api';
import {
  CLEAR_UPLOAD_DATA,
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
} from './types';

export const mmsGetInfoStarted = () => ({
  type: MMS_GET_INFO_STARTED
});

export const mmsGetInfoSuccess = (payload) => ({
  type: MMS_GET_INFO_SUCCESS,
  payload
});

export const mmsGetInfoFailure = (error) => ({
  type: MMS_GET_INFO_FAILURE,
  payload: { error }
});

export const mmsGetInfo = (params) => {
  return async (dispatch) => {
    dispatch(mmsGetInfoStarted());
    api.mms
      .getInfo(params)
      .then((res) => dispatch(mmsGetInfoSuccess(res.data)))
      .catch((error) => dispatch(mmsGetInfoFailure(error)));
  };
};

export const mmsUploadFileStarted = () => ({
  type: MMS_UPLOAD_FILE_STARTED
});

export const mmsUploadFileFailure = (error) => ({
  type: MMS_UPLOAD_FILE_FAILURE,
  payload: { error }
});

export const mmsUploadFile = (data) => {
  return async (dispatch) => {
    dispatch(mmsUploadFileStarted());
    api.mms
      .uploadFile(data)
      .then(() => dispatch(mmsGetInfo({ page: 1, size: 25 })))
      .catch((error) => dispatch(mmsUploadFileFailure(error)));
  };
};

export const clearMmsUpload = () => ({
  type: CLEAR_UPLOAD_DATA
});

export const mmsSetParams = (payload) => ({
  type: MMS_SET_PARAMS,
  payload
});

const mmsOpenSuccessDialogStarted = () => ({
  type: MMS_GET_SUCCESS_MODAL_STARTED
});

const mmsOpenSuccessDialogSuccess = (payload) => ({
  type: MMS_GET_SUCCESS_MODAL_SUCCESS,
  payload
});

const mmsOpenSuccessDialogFailure = (error) => ({
  type: MMS_GET_SUCCESS_MODAL_FAILURE,
  payload: {
    error
  }
});

export const mmsOpenSuccessDialog = (transaction_id) => {
  return async (dispatch) => {
    dispatch(mmsOpenSuccessDialogStarted());
    api.mms
      .getAggregatedData(transaction_id)
      .then((res) => dispatch(mmsOpenSuccessDialogSuccess(res.data)))
      .catch((error) => dispatch(mmsOpenSuccessDialogFailure(error)));
  };
};

export const mmsCloseSuccessDialog = () => ({
  type: MMS_CLOSE_SUCCESS_MODAL
});

export const mmsSetFailureModal = (payload) => ({
  type: MMS_SET_FAILURE_MODAL,
  payload
});
