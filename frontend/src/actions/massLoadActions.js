import api from '../util/api';
import { saveAsFile } from '../util/files';
import {
  CLEAR_UPLOAD_DATA,
  DOWNLOAD_FILE_BY_ID_FAILURE,
  DOWNLOAD_FILE_BY_ID_STARTED,
  UPLOAD_TKO_FAILURE,
  UPLOAD_TKO_STARTED
} from './types';

export const uploadTkoStarted = () => ({
  type: UPLOAD_TKO_STARTED
});

export const uploadTkoFailure = (error) => ({
  type: UPLOAD_TKO_FAILURE,
  payload: {
    error
  }
});

export const clearTkoUpload = () => ({
  type: CLEAR_UPLOAD_DATA
});

export const uploadDisputeTko = (data, uid, callback) => {
  return async (dispatch) => {
    dispatch(uploadTkoStarted());
    api.tko
      .uploadFilesDispute(data, uid)
      .then(() => {
        callback();
      })
      .catch((err) => dispatch(uploadTkoFailure(err)));
  };
};

export const uploadDisputeTkoSubprocess = (data, uid, callback) => {
  return async (dispatch) => {
    dispatch(uploadTkoStarted());
    api.tko
      .uploadFilesDisputeSubprocess(data, uid)
      .then(() => {
        callback();
      })
      .catch((err) => dispatch(uploadTkoFailure(err)));
  };
};

export const downloadFileByIdStarted = () => ({
  type: DOWNLOAD_FILE_BY_ID_STARTED
});

export const downloadFileByIdFailure = (error) => ({
  type: DOWNLOAD_FILE_BY_ID_FAILURE,
  payload: {
    error
  }
});

export const downloadFileById = (id, name) => {
  return async (dispatch) => {
    dispatch(downloadFileByIdStarted());
    api.files
      .downloadByUid(id)
      .then((res) => {
        if (res.status === 200) {
          saveAsFile(res.data, name, res.headers['content-type'] || '');
        }
      })
      .catch((error) => dispatch(downloadFileByIdFailure(error)));
  };
};
