import api from '../util/api';
import { saveAsFile } from '../util/files';
import {
  GET_TS_FILE_BY_ID_FAILURE,
  GET_TS_FILE_BY_ID_STARTED,
  GET_TS_FILE_BY_ID_SUCCESS,
  GET_TS_LIST_FAILURE,
  GET_TS_LIST_STARTED,
  GET_TS_LIST_SUCCESS,
  SET_TS_DIALOG_OPEN,
  SET_TS_LIST_PARAMS,
  UPLOAD_TS_FILE_CLEAR,
  UPLOAD_TS_FILE_FAILURE,
  UPLOAD_TS_FILE_STARTED,
  UPLOAD_TS_FILE_SUCCESS
} from './types';

export const getTSListStarted = () => ({
  type: GET_TS_LIST_STARTED
});

export const getTSListSuccess = (data) => ({
  type: GET_TS_LIST_SUCCESS,
  payload: {
    data
  }
});

export const getTSListFailure = (error) => ({
  type: GET_TS_LIST_FAILURE,
  payload: {
    error
  }
});

export const getTSList = (params) => {
  return async (dispatch) => {
    dispatch(getTSListStarted());
    api.timeSeries
      .getList(params)
      .then((res) => dispatch(getTSListSuccess(res.data)))
      .catch((error) => dispatch(getTSListFailure(error)));
  };
};

export const setTSListParams = (params) => ({
  type: SET_TS_LIST_PARAMS,
  payload: {
    params
  }
});

export const getTSFileByIdStarted = () => ({
  type: GET_TS_FILE_BY_ID_STARTED
});

export const getTSFileByIdSuccess = () => ({
  type: GET_TS_FILE_BY_ID_SUCCESS
});

export const getTSFileByIdFailure = (error) => ({
  type: GET_TS_FILE_BY_ID_FAILURE,
  payload: {
    error
  }
});

export const getTSFileById = (id, fileName) => {
  return async (dispatch) => {
    dispatch(getTSFileByIdStarted());
    api.timeSeries
      .downloadById(id)
      .then((res) => {
        if (res.status === 200) {
          saveAsFile(res.data, fileName, res.headers['content-type'] || '');
          dispatch(getTSFileByIdSuccess());
        }
      })
      .catch((error) => dispatch(getTSFileByIdFailure(error)));
  };
};

export const tsDialogOpen = (open) => ({
  type: SET_TS_DIALOG_OPEN,
  payload: {
    open
  }
});

export const uploadTSFileStarted = () => ({
  type: UPLOAD_TS_FILE_STARTED
});

export const uploadTSFileSuccess = (data) => ({
  type: UPLOAD_TS_FILE_SUCCESS,
  payload: {
    data
  }
});

export const uploadTSFileFailure = (error) => ({
  type: UPLOAD_TS_FILE_FAILURE,
  payload: {
    error
  }
});

export const uploadTSFileClear = () => ({
  type: UPLOAD_TS_FILE_CLEAR
});

export const uploadTSFile = (data) => {
  return async (dispatch) => {
    dispatch(uploadTSFileStarted());
    api.timeSeries
      .uploadFile(data)
      .then((res) => dispatch(uploadTSFileSuccess(res.data)))
      .catch((error) => dispatch(uploadTSFileFailure(error)));
  };
};
