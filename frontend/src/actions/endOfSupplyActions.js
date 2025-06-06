import api from '../util/api';
import {
  CLEAR_UPLOAD_DATA,
  EOS_CREATE_FAILURE,
  EOS_CREATE_STARTED,
  EOS_CREATE_SUCCESS,
  EOS_GET_DATA_FAILURE,
  EOS_GET_DATA_STARTED,
  EOS_GET_DATA_SUCCESS,
  EOS_GET_INIT_LIST_FAILURE,
  EOS_GET_INIT_LIST_STARTED,
  EOS_GET_INIT_LIST_SUCCESS,
  EOS_SET_INIT_LIST_PARAMS,
  UPLOAD_TKO_FAILURE,
  UPLOAD_TKO_STARTED,
  UPLOAD_TKO_SUCCESS
} from './types';

export const eosGetInitListStarted = () => ({
  type: EOS_GET_INIT_LIST_STARTED
});

export const eosGetInitListSuccess = (data) => ({
  type: EOS_GET_INIT_LIST_SUCCESS,
  payload: {
    data
  }
});

export const eosGetInitListFailure = (error) => ({
  type: EOS_GET_INIT_LIST_FAILURE,
  payload: {
    error
  }
});

export const eosSetInitListParams = (data) => ({
  type: EOS_SET_INIT_LIST_PARAMS,
  payload: {
    data
  }
});

export const eosGetInitList = (params) => {
  return async (dispatch) => {
    dispatch(eosGetInitListStarted());
    api.eos
      .getInitList(params)
      .then((res) => dispatch(eosGetInitListSuccess(res.data)))
      .catch((error) => dispatch(eosGetInitListFailure(error)));
  };
};

export const eosCreateStarted = () => ({
  type: EOS_CREATE_STARTED
});

export const eosCreateSuccess = (data) => ({
  type: EOS_CREATE_SUCCESS,
  payload: {
    data
  }
});

export const eosCreateFailure = (error) => ({
  type: EOS_CREATE_FAILURE,
  payload: {
    error
  }
});

export const eosCreate = (data) => {
  return async (dispatch) => {
    dispatch(eosCreateStarted());
    api.eos
      .create(data)
      .then((res) => dispatch(eosCreateSuccess(res.data)))
      .catch((error) => dispatch(eosCreateFailure(error)));
  };
};

export const getEosByIdStarted = () => ({
  type: EOS_GET_DATA_STARTED
});

export const getEosByIdSuccess = (data) => ({
  type: EOS_GET_DATA_SUCCESS,
  payload: {
    data
  }
});

export const getEosByIdFailure = (error) => ({
  type: EOS_GET_DATA_FAILURE,
  payload: {
    error
  }
});

export const getEosById = (uid) => {
  return async (dispatch) => {
    dispatch(getEosByIdStarted());
    api.eos
      .getById(uid)
      .then((res) => dispatch(getEosByIdSuccess(res.data)))
      .catch((error) => dispatch(getEosByIdFailure(error)));
  };
};

export const uploadProlongationFileStarted = () => ({
  type: UPLOAD_TKO_STARTED
});

export const uploadProlongationFileSuccess = (data) => ({
  type: UPLOAD_TKO_SUCCESS,
  payload: {
    data
  }
});

export const uploadProlongationFileFailure = (error) => ({
  type: UPLOAD_TKO_FAILURE,
  payload: {
    error
  }
});

export const clearProlongationFile = () => ({
  type: CLEAR_UPLOAD_DATA
});

const checkResult = (dispatch, file_original_id) => {
  api.tko
    .checkResult(file_original_id, { service: 'ms-processes' })
    .then((res) => {
      if (
        res?.data?.status === 'DONE' ||
        res?.data?.status === 'FAILED' ||
        res?.data?.status === 'BAD_FILE_STRUCTURE'
      ) {
        dispatch(uploadProlongationFileSuccess(res.data));
        clearInterval(window.massLoadInterval);
      }
    })
    .catch((err) => {
      dispatch(clearProlongationFile(err));
      clearInterval(window.massLoadInterval);
    });
};

export const uploadProlongationFile = (subprocess_uid, data, callback) => {
  return async (dispatch) => {
    dispatch(uploadProlongationFileStarted());
    api.eos
      .uploadFile(subprocess_uid, data)
      .then((res) => {
        if (res.data?.file_original_id) {
          const file_original_id = res.data.file_original_id;
          const timeOut = data.get('file_original').size > 1000000 ? 10000 : 5000;
          window.massLoadInterval = setInterval(() => checkResult(dispatch, file_original_id), timeOut);
        }
        callback();
      })
      .catch((error) => dispatch(uploadProlongationFileFailure(error)));
  };
};
