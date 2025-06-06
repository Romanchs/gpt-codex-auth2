import i18n from '../i18n/i18n';
import { store } from '../store/store';
import api from '../util/api';
import { saveAsFile } from '../util/files';
import {
  ADD_ITEM_TO_DIRECTORY_FAILURE,
  ADD_ITEM_TO_DIRECTORY_STARTED,
  ADD_ITEM_TO_DIRECTORY_SUCCESS,
  ARCHIVE_DIRECTORY_FAILURE,
  CLEAR_DIRECTORY_LIST_PARAMS,
  CLOSE_SUPPLIERS_DIRECTORY_DIALOGS,
  DOWNLOAD_DIRECTORY_FAILURE,
  DOWNLOAD_DIRECTORY_STARTED,
  DOWNLOAD_DIRECTORY_SUCCESS,
  DOWNLOAD_SUPPLIERS_UPDATE_RESULTS_FAILURE,
  DOWNLOAD_SUPPLIERS_UPDATE_RESULTS_STARTED,
  GET_DIRECTORY_BY_ID_FAILURE,
  GET_DIRECTORY_BY_ID_STARTED,
  GET_DIRECTORY_BY_ID_SUCCESS,
  GET_DIRECTORY_LIST_FAILURE,
  GET_DIRECTORY_LIST_STARTED,
  GET_DIRECTORY_LIST_SUCCESS,
  REMOVE_ARCHIVE_DIRECTORY_DIALOG,
  SET_ARCHIVE_DIRECTORY_DIALOG,
  SET_DIRECTORY_LIST_PARAMS,
  UPLOAD_SUPPLIERS_DIRECTORY_FAILURE,
  UPLOAD_SUPPLIERS_DIRECTORY_STARTED,
  UPLOAD_SUPPLIERS_DIRECTORY_SUCCESS
} from './types';

export const getDirectoryListStarted = () => ({
  type: GET_DIRECTORY_LIST_STARTED
});

export const getDirectoryListSuccess = (data) => ({
  type: GET_DIRECTORY_LIST_SUCCESS,
  payload: {
    data
  }
});

export const getDirectoryListFailure = (error) => ({
  type: GET_DIRECTORY_LIST_FAILURE,
  payload: {
    error
  }
});

export const getDirectoryList = () => {
  return async (dispatch) => {
    dispatch(getDirectoryListStarted());
    api.directories
      .getList()
      .then((res) => dispatch(getDirectoryListSuccess(res.data)))
      .catch((error) => dispatch(getDirectoryListFailure(error)));
  };
};

export const getDirectoryByIdStarted = () => ({
  type: GET_DIRECTORY_BY_ID_STARTED
});

export const getDirectoryByIdSuccess = (data) => ({
  type: GET_DIRECTORY_BY_ID_SUCCESS,
  payload: {
    data
  }
});

export const getDirectoryByIdFailure = (error) => ({
  type: GET_DIRECTORY_BY_ID_FAILURE,
  payload: {
    error
  }
});

export const getDirectoryById = (id, params) => {
  return async (dispatch) => {
    dispatch(getDirectoryByIdStarted());
    api.directories
      .getDirectory(id, params)
      .then((res) => dispatch(getDirectoryByIdSuccess(res.data)))
      .catch((error) => dispatch(getDirectoryByIdFailure(error)));
  };
};

const updateDirectory = () => {
  const {
    directories: { params, selectedDirectory }
  } = store.getState();
  return async (dispatch) => {
    dispatch(getDirectoryByIdStarted());
    api.directories
      .getDirectory(selectedDirectory.reference_type.uid, params)
      .then((res) => dispatch(getDirectoryByIdSuccess(res.data)))
      .catch((error) => dispatch(getDirectoryByIdFailure(error)));
  };
};

export const getSuppliersDirectory = (params) => {
  return async (dispatch) => {
    dispatch(getDirectoryByIdStarted());
    api.directories
      .getSuppliers(params)
      .then((res) => dispatch(getDirectoryByIdSuccess(res.data)))
      .catch((error) => dispatch(getDirectoryByIdFailure(error)));
  };
};

export const getGridAccessProvidersDirectory = (params) => {
  return async (dispatch) => {
    dispatch(getDirectoryByIdStarted());
    api.directories
      .getGridAccessProviders(params)
      .then((res) => dispatch(getDirectoryByIdSuccess(res.data)))
      .catch((error) => dispatch(getDirectoryByIdFailure(error)));
  };
};

export const addItemToDirectoryStarted = () => ({
  type: ADD_ITEM_TO_DIRECTORY_STARTED
});

export const addItemToDirectorySuccess = (data) => ({
  type: ADD_ITEM_TO_DIRECTORY_SUCCESS,
  payload: {
    data
  }
});

export const addItemToDirectoryFailure = (error) => ({
  type: ADD_ITEM_TO_DIRECTORY_FAILURE,
  payload: {
    error
  }
});

export const addItemToDirectory = (data) => {
  return async (dispatch) => {
    dispatch(addItemToDirectoryStarted());
    api.directories
      .addItemToDirectory(data)
      .then((res) => {
        dispatch(addItemToDirectorySuccess(res.data));
        dispatch(updateDirectory());
      })
      .catch((error) => dispatch(addItemToDirectoryFailure(error)));
  };
};

export const setDirectoryListParams = (params) => ({
  type: SET_DIRECTORY_LIST_PARAMS,
  payload: {
    params
  }
});

export const clearDirectoryListParams = () => ({
  type: CLEAR_DIRECTORY_LIST_PARAMS
});

export const setArchiveDialog = (data) => ({
  type: SET_ARCHIVE_DIRECTORY_DIALOG,
  payload: {
    data
  }
});

export const removeArchiveDialog = () => ({
  type: REMOVE_ARCHIVE_DIRECTORY_DIALOG
});

export const archiveDirectoryFailure = (error) => ({
  type: ARCHIVE_DIRECTORY_FAILURE,
  payload: {
    error
  }
});

export const archiveDirectory = (id, data) => {
  return async (dispatch) => {
    api.directories
      .archive(id, data)
      .then(() => dispatch(updateDirectory()))
      .catch((error) => dispatch(archiveDirectoryFailure(error)));
  };
};

export const downloadStarted = () => ({
  type: DOWNLOAD_DIRECTORY_STARTED
});

export const downloadSuccess = () => ({
  type: DOWNLOAD_DIRECTORY_SUCCESS
});

export const downloadFailure = (error) => ({
  type: DOWNLOAD_DIRECTORY_FAILURE,
  payload: {
    error
  }
});

// DOWNLOADING

export const download = (id, name) => {
  return async (dispatch) => {
    dispatch(downloadStarted());
    api.directories
      .download(id)
      .then((res) => {
        if (res.status === 200) {
          saveAsFile(res.data, name, res.headers['content-type'] || '');
          dispatch(downloadSuccess());
        }
      })
      .catch((error) => dispatch(downloadFailure(error)));
  };
};

export const downloadSuppliers = (name) => {
  return async (dispatch) => {
    dispatch(downloadStarted());
    api.directories
      .downloadSuppliers()
      .then((res) => {
        if (res.status === 200) {
          saveAsFile(res.data, name, res.headers['content-type'] || '');
          dispatch(downloadSuccess());
        }
      })
      .catch((error) => dispatch(downloadFailure(error)));
  };
};

export const downloadGridAccessProviders = (name) => {
  return async (dispatch) => {
    dispatch(downloadStarted());
    api.directories
      .downloadGridAccessProviders()
      .then((res) => {
        if (res.status === 200) {
          saveAsFile(res.data, name, res.headers['content-type'] || '');
          dispatch(downloadSuccess());
        }
      })
      .catch((error) => dispatch(downloadFailure(error)));
  };
};

export const uploadSuppliersDirectoryStarted = () => ({
  type: UPLOAD_SUPPLIERS_DIRECTORY_STARTED
});

export const uploadSuppliersDirectorySuccess = (payload) => ({
  type: UPLOAD_SUPPLIERS_DIRECTORY_SUCCESS,
  payload
});

export const uploadSuppliersDirectoryFailure = (error) => ({
  type: UPLOAD_SUPPLIERS_DIRECTORY_FAILURE,
  payload: {
    error
  }
});

export const uploadSuppliersDirectory = (target) => {
  return async (dispatch) => {
    dispatch(uploadSuppliersDirectoryStarted());
    const formData = new FormData();
    formData.append('file_original', target.files[0]);
    api.directories
      .uploadSuppliers(formData)
      .then((res) => dispatch(uploadSuppliersDirectorySuccess(res.data)))
      .catch((error) => dispatch(uploadSuppliersDirectoryFailure(error)));
  };
};

export const closeAllDialogs = () => ({
  type: CLOSE_SUPPLIERS_DIRECTORY_DIALOGS
});

export const downloadSuppliersUpdateResultStarted = () => ({
  type: DOWNLOAD_SUPPLIERS_UPDATE_RESULTS_STARTED
});

export const downloadSuppliersUpdateResultFailure = (error) => ({
  type: DOWNLOAD_SUPPLIERS_UPDATE_RESULTS_FAILURE,
  payload: {
    error
  }
});

export const downloadSuppliersUpdateResult = (file_id) => {
  return async (dispatch) => {
    dispatch(downloadSuppliersUpdateResultStarted());
    api.files
      .downloadByUid(file_id)
      .then((res) => {
        if (res.status === 200) {
          saveAsFile(
            res.data,
            i18n.t('FILENAMES.RESULT_OF_PARTIAL_UPDATE_SUPPLIERS'),
            res.headers['content-type'] || 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          );
          dispatch(closeAllDialogs());
        }
      })
      .catch((error) => dispatch(downloadSuppliersUpdateResultFailure(error)));
  };
};
