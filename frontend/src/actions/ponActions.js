import i18n from '../i18n/i18n';
import api from '../util/api';
import {saveAsFile} from '../util/files';
import {enqueueSnackbar} from './notistackActions';
import {
  CANCEL_PON_FAILURE,
  CANCEL_PON_STARTED,
  CANCEL_PON_SUCCESS,
  CLEAR_PON_INFORMING_LIST,
  CLEAR_PON_REDUCER,
  CLEAR_PON_REQUEST_DKO_DETAILS,
  CLEAR_PON_REQUEST_TKO,
  CLEAR_PON_REQUEST_TKO_LOADING,
  CLEAR_PON_REQUESTS,
  CLEAR_PON_SUPPLIERS,
  CLEAR_UPLOAD_DATA,
  CREATE_PON_FAILURE,
  CREATE_PON_STARTED,
  CREATE_PON_SUCCESS,
  DOWNLOAD_PON_INFORMING_FILE_FAILURE,
  DOWNLOAD_PON_REQUEST_TKO_FILE_FAILURE,
  EXPORT_PON_TKO_FAILURE,
  EXPORT_PON_TKO_STARTED,
  EXPORT_PON_TKO_SUCCESS,
  GET_PON_BY_ID_FAILURE,
  GET_PON_BY_ID_STARTED,
  GET_PON_BY_ID_SUCCESS,
  GET_PON_INFORMING_DETAIL_FAILURE,
  GET_PON_INFORMING_DETAIL_STARTED,
  GET_PON_INFORMING_DETAIL_SUCCESS,
  GET_PON_INFORMING_LIST_FAILURE,
  GET_PON_INFORMING_LIST_STARTED,
  GET_PON_INFORMING_LIST_SUCCESS,
  GET_PON_REASONS_FAILURE,
  GET_PON_REASONS_STARTED,
  GET_PON_REASONS_SUCCESS,
  GET_PON_REQUEST_DKO_DETAILS_FAILURE,
  GET_PON_REQUEST_DKO_DETAILS_STARTED,
  GET_PON_REQUEST_DKO_DETAILS_SUCCESS,
  GET_PON_REQUEST_TKO_FAILURE,
  GET_PON_REQUEST_TKO_STARTED,
  GET_PON_REQUEST_TKO_SUCCESS,
  GET_PON_REQUESTS_DATA_FAILURE,
  GET_PON_REQUESTS_DATA_STARTED,
  GET_PON_REQUESTS_DATA_SUCCESS,
  GET_PON_SUPPLIERS_FAILURE,
  GET_PON_SUPPLIERS_STARTED,
  GET_PON_SUPPLIERS_SUCCESS,
  SEARCH_PON_SUPPLIERS_FAILURE,
  SEARCH_PON_SUPPLIERS_STARTED,
  SEARCH_PON_SUPPLIERS_SUCCESS,
  SET_PON_INFORMING_LIST_PARAMS,
  SET_PON_REQUESTS_DATA_PARAMS,
  UPLOAD_TKO_FAILURE,
  UPLOAD_TKO_STARTED,
  UPLOAD_TKO_SUCCESS
} from './types';

export const getPonSuppliersStarted = () => ({
  type: GET_PON_SUPPLIERS_STARTED
});

export const getPonSuppliersSuccess = (data) => ({
  type: GET_PON_SUPPLIERS_SUCCESS,
  payload: {
    data
  }
});

export const getPonSuppliersFailure = (error) => ({
  type: GET_PON_SUPPLIERS_FAILURE,
  payload: {
    error
  }
});

export const getPonSuppliers = () => {
  return async (dispatch) => {
    dispatch(getPonSuppliersStarted());
    api.pon
      .getSuppliers({pon: true})
      .then((res) => {
        dispatch(getPonSuppliersSuccess(res.data));
      })
      .catch((err) => {
        dispatch(getPonSuppliersFailure(err));
      });
  };
};

export const getPonReasonsStarted = () => ({
  type: GET_PON_REASONS_STARTED
});

export const getPonReasonsSuccess = (data) => ({
  type: GET_PON_REASONS_SUCCESS,
  payload: {
    data
  }
});

export const getPonReasonsFailure = (error) => ({
  type: GET_PON_REASONS_FAILURE,
  payload: {
    error
  }
});

export const getPonReasons = () => {
  return async (dispatch) => {
    dispatch(getPonReasonsStarted());
    api.pon
      .getReasons()
      .then((res) => {
        dispatch(getPonReasonsSuccess(res.data));
      })
      .catch((err) => {
        dispatch(getPonReasonsFailure(err));
      });
  };
};

export const searchPonSuppliersStarted = () => ({
  type: SEARCH_PON_SUPPLIERS_STARTED
});

export const searchPonSuppliersSuccess = (data) => ({
  type: SEARCH_PON_SUPPLIERS_SUCCESS,
  payload: {
    data
  }
});

export const searchPonSuppliersFailure = (error) => ({
  type: SEARCH_PON_SUPPLIERS_FAILURE,
  payload: {
    error
  }
});

export const searchPonSuppliers = (params) => {
  return async (dispatch) => {
    dispatch(searchPonSuppliersStarted());
    api.pon
      .searchSuppliers(params)
      .then((res) => {
        dispatch(searchPonSuppliersSuccess(res.data));
      })
      .catch((err) => {
        dispatch(searchPonSuppliersFailure(err));
      });
  };
};

export const clearSearchPonSuppliers = () => ({
  type: CLEAR_PON_SUPPLIERS
});

export const createPonStarted = () => ({
  type: CREATE_PON_STARTED
});

export const createPonSuccess = (data) => ({
  type: CREATE_PON_SUCCESS,
  payload: {
    data
  }
});

export const createPonFailure = (error) => ({
  type: CREATE_PON_FAILURE,
  payload: {
    error
  }
});

export const createPon = (params) => {
  return async (dispatch) => {
    dispatch(createPonStarted());
    api.pon
      .createPon(params)
      .then((res) => {
        dispatch(createPonSuccess(res.data));
      })
      .catch((err) => {
        dispatch(createPonFailure(err));
      });
  };
};

export const getPonByIdStarted = () => ({
  type: GET_PON_BY_ID_STARTED
});

export const getPonByIdSuccess = (data) => ({
  type: GET_PON_BY_ID_SUCCESS,
  payload: {
    data
  }
});

export const getPonByIdFailure = (error) => ({
  type: GET_PON_BY_ID_FAILURE,
  payload: {
    error
  }
});

export const getPonById = (id) => {
  return async (dispatch) => {
    dispatch(getPonByIdStarted());
    api.pon
      .getPonById(id)
      .then((res) => {
        dispatch(getPonByIdSuccess(res.data));
      })
      .catch((err) => {
        dispatch(getPonByIdFailure(err));
      });
  };
};

export const cancelPonProcessStarted = () => ({
  type: CANCEL_PON_STARTED
});

export const cancelPonProcessSuccess = () => ({
  type: CANCEL_PON_SUCCESS
});

export const cancelPonProcessFailure = (error) => ({
  type: CANCEL_PON_FAILURE,
  payload: {
    error
  }
});

export const cancelPonProcess = (id) => {
  return async (dispatch) => {
    dispatch(cancelPonProcessStarted());
    api.pon
      .cancelProcess(id)
      .then(() => dispatch(cancelPonProcessSuccess()))
      .catch((err) => dispatch(cancelPonProcessFailure(err)));
  };
};

export const clearPonProcessReducer = () => ({
  type: CLEAR_PON_REDUCER
});

export const exportPonTkoStarted = () => ({
  type: EXPORT_PON_TKO_STARTED
});

export const exportPonTkoSuccess = (data) => ({
  type: EXPORT_PON_TKO_SUCCESS,
  payload: {
    data
  }
});

export const exportPonTkoFailure = (error) => ({
  type: EXPORT_PON_TKO_FAILURE,
  payload: {
    error
  }
});

export const exportPonTko = (id, filename, params) => {
  return async (dispatch) => {
    dispatch(exportPonTkoStarted());
    api.pon
      .exportTko(id, params)
      .then((res) => {
        if (res.status === 200) {
          saveAsFile(res.data, filename, res.headers['content-type'] || '');
        }
      })
      .catch((error) => dispatch(exportPonTkoFailure(error)));
  };
};

export const getPonRequestsStarted = () => ({
  type: GET_PON_REQUESTS_DATA_STARTED
});

export const getPonRequestsSuccess = (data) => ({
  type: GET_PON_REQUESTS_DATA_SUCCESS,
  payload: {
    data
  }
});

export const getPonRequestsFailure = (error) => ({
  type: GET_PON_REQUESTS_DATA_FAILURE,
  payload: {
    error
  }
});

export const getPonRequests = (uid, requests_type, params) => {
  return async (dispatch) => {
    dispatch(getPonRequestsStarted());
    api.pon
      .getRequests(uid, requests_type, params)
      .then((res) => dispatch(getPonRequestsSuccess(res.data)))
      .catch((error) => dispatch(getPonRequestsFailure(error)));
  };
};

export const setPonRequestsParams = (params) => ({
  type: SET_PON_REQUESTS_DATA_PARAMS,
  payload: {
    params
  }
});

export const clearPonRequests = () => ({
  type: CLEAR_PON_REQUESTS
});

export const clearPonRequestsLoading = () => ({
  type: CLEAR_PON_REQUEST_TKO_LOADING
});

export const getPonRequestTkoDataStarted = () => ({
  type: GET_PON_REQUEST_TKO_STARTED
});

export const getPonRequestTkoDataSuccess = (data) => ({
  type: GET_PON_REQUEST_TKO_SUCCESS,
  payload: {
    data
  }
});

export const getPonRequestTkoDataFailure = (error) => ({
  type: GET_PON_REQUEST_TKO_FAILURE,
  payload: {
    error
  }
});

export const getPonRequestTkoData = (uid) => {
  return async (dispatch) => {
    dispatch(getPonRequestTkoDataStarted());
    api.pon
      .getRequestTko(uid)
      .then((res) => dispatch(getPonRequestTkoDataSuccess(res.data)))
      .catch((error) => dispatch(getPonRequestTkoDataFailure(error)));
  };
};

export const deletePonRequestUploadedTko = (uid) => {
  return async (dispatch) => {
    dispatch(getPonRequestTkoDataStarted());
    api.pon
      .deleteRequestTkoUploadedTko(uid)
      .then(() => dispatch(getPonRequestTkoData(uid)))
      .catch((error) => dispatch(getPonRequestTkoDataFailure(error)));
  };
};

export const getPonHistoricalDko = (uid) => {
  return async (dispatch) => {
    dispatch(getPonRequestTkoDataStarted());
    api.pon
      .getHistoricalDko(uid)
      .then((res) => dispatch(getPonRequestTkoDataSuccess(res.data)))
      .catch((error) => dispatch(getPonRequestTkoDataFailure(error)));
  };
};

export const getPonActualDko = (uid) => {
  return async (dispatch) => {
    dispatch(getPonRequestTkoDataStarted());
    api.pon
      .getActualDko(uid)
      .then((res) => dispatch(getPonRequestTkoDataSuccess(res.data)))
      .catch((error) => dispatch(getPonRequestTkoDataFailure(error)));
  };
};

export const getPonInforming = (uid) => {
  return async (dispatch) => {
    dispatch(getPonRequestTkoDataStarted());
    api.pon
      .getPonInforming(uid)
      .then((res) => dispatch(getPonRequestTkoDataSuccess(res.data)))
      .catch((error) => dispatch(getPonRequestTkoDataFailure(error)));
  };
};

export const createFilesPonInforming = (uid, callback) => {
  return async (dispatch) => {
    dispatch(getPonRequestTkoDataStarted());
    api.pon
      .createFilesPonInforming(uid)
      .then(() => {
        dispatch(clearPonRequestsLoading());
        dispatch(
          enqueueSnackbar({
            message: i18n.t('FILES_HAVE_STARTED_TO_FORM'),
            options: {
              key: new Date().getTime() + Math.random(),
              variant: 'success',
              autoHideDuration: 5000
            }
          })
        );
        callback();
      })
      .catch((error) => dispatch(getPonRequestTkoDataFailure(error)));
  };
};

export const getFilesPonInforming = (uid, params, callback) => {
  return async (dispatch) => {
    dispatch(getPonRequestTkoDataStarted());
    api.pon
      .getFilesPonInforming(uid, params)
      .then((res) => {
        dispatch(clearPonRequestsLoading());
        callback(res.data);
      })
      .catch((error) => dispatch(getPonRequestTkoDataFailure(error)));
  };
};

export const getPonProvideActualDko = (uid, callback) => {
  return async (dispatch) => {
    dispatch(getPonRequestTkoDataStarted());
    api.pon
      .getPonProvideActualDko(uid)
      .then((res) => {
        dispatch(getPonRequestTkoDataSuccess(res.data));
        callback(res.data);
      })
      .catch((error) => dispatch(getPonRequestTkoDataFailure(error)));
  };
};

export const getPonProvideActualDkoGTS = (params, callback) => {
  return async (dispatch) => {
    dispatch(getPonRequestTkoDataStarted());
    api.pon
      .getPonProvideActualDkoGTS(params)
      .then((res) => {
        dispatch(clearPonRequestsLoading());
        callback(res.data);
      })
      .catch((error) => dispatch(getPonRequestTkoDataFailure(error)));
  };
};

export const clearPonRequestTko = () => ({
  type: CLEAR_PON_REQUEST_TKO
});

export const downloadPonRequestTkoFileFailure = (error) => ({
  type: DOWNLOAD_PON_REQUEST_TKO_FILE_FAILURE,
  payload: {
    error
  }
});

export const downloadPonRequestTkoFile = (uid, fileName) => {
  return async (dispatch) => {
    api.files
      .downloadByUid(uid)
      .then((res) => {
        saveAsFile(res.data, fileName, res.headers['content-type'] || '');
      })
      .catch((error) => dispatch(downloadPonRequestTkoFileFailure(error)));
  };
};

export const downloadHistoricalDkoTkos = (uid) => {
  return async (dispatch) => {
    api.pon
      .downloadHistoricalDkoTkos(uid)
      .then((res) => {
        saveAsFile(res.data, i18n.t('FILENAMES.TKO_LIST'), res.headers['content-type'] || '');
      })
      .catch((error) => dispatch(downloadPonRequestTkoFileFailure(error)));
  };
};

export const downloadActualDkoTkos = (uid) => {
  return async (dispatch) => {
    api.pon
      .downloadActualDkoTkos(uid)
      .then((res) => {
        saveAsFile(res.data, i18n.t('FILENAMES.TKO_LIST'), res.headers['content-type'] || '');
      })
      .catch((error) => dispatch(downloadPonRequestTkoFileFailure(error)));
  };
};

export const startPonRequestTko = (uid) => {
  return async (dispatch) => {
    dispatch(getPonRequestTkoDataStarted());
    api.pon
      .startRequestTko(uid)
      .then((res) => {
        dispatch(getPonRequestTkoDataSuccess(res.data));
      })
      .catch((error) => dispatch(getPonRequestTkoDataFailure(error)));
  };
};

export const startPonProvideActualDko = (uid) => {
  return async (dispatch) => {
    dispatch(getPonRequestTkoDataStarted());
    api.pon
      .startPonProvideActualDko(uid)
      .then((res) => dispatch(getPonRequestTkoDataSuccess(res.data)))
      .catch((error) => dispatch(getPonRequestTkoDataFailure(error)));
  };
};

export const cancelPonRequestTko = (uid) => {
  return async (dispatch) => {
    dispatch(getPonRequestTkoDataStarted());
    api.pon
      .cancelRequestTko(uid)
      .then((res) => dispatch(getPonRequestTkoDataSuccess(res.data)))
      .catch((error) => dispatch(getPonRequestTkoDataFailure(error)));
  };
};

export const donePonRequestTko = (uid) => {
  return async (dispatch) => {
    dispatch(getPonRequestTkoDataStarted());
    api.pon
      .doneRequestTko(uid)
      .then((res) => dispatch(getPonRequestTkoDataSuccess(res.data)))
      .catch((error) => dispatch(getPonRequestTkoDataFailure(error)));
  };
};

export const uploadPonTkoStarted = () => ({
  type: UPLOAD_TKO_STARTED
});

export const uploadPonTkoSuccess = (data) => ({
  type: UPLOAD_TKO_SUCCESS,
  payload: {
    data
  }
});

export const uploadPonTkoFailure = (error) => ({
  type: UPLOAD_TKO_FAILURE,
  payload: {
    error
  }
});

export const clearPonTkoUpload = () => ({
  type: CLEAR_UPLOAD_DATA
});

const checkResult = (dispatch, file_original_id, service) => {
  const request = service === 'ts' ? api.pon.checkResult : api.tko.checkResult;
  request(file_original_id, {service: 'ms-processes'})
    .then((res) => {
      if (
        res?.data?.status === 'DONE' ||
        res?.data?.status === 'FAILED' ||
        res?.data?.status === 'BAD_FILE_STRUCTURE'
      ) {
        dispatch(uploadPonTkoSuccess(res.data));
        clearInterval(window.massLoadInterval);
      }
    })
    .catch((err) => {
      dispatch(clearPonTkoUpload(err));
      clearInterval(window.massLoadInterval);
    });
};

export const uploadPonTko = (mode, subprocess_uid, data, callback, onError) => {
  return async (dispatch) => {
    dispatch(uploadPonTkoStarted());
    api.pon
      .uploadFileWithTko(mode, subprocess_uid, data)
      .then(callback)
      .catch((err) => {
        dispatch(uploadPonTkoFailure(err));
        onError();
      });
  };
};

export const uploadHistoricalDko = (subprocess_uid, data) => {
  return async (dispatch) => {
    dispatch(uploadPonTkoStarted());
    api.pon
      .uploadHistoricalDko(subprocess_uid, data)
      .then((res) => {
        if (res.data?.file_original_id) {
          const file_original_id = res.data.file_original_id;
          const timeOut = data.get('file_original').size > 1000000 ? 10000 : 5000;
          window.massLoadInterval = setInterval(() => checkResult(dispatch, file_original_id, 'ts'), timeOut);
        }
      })
      .catch((err) => dispatch(uploadPonTkoFailure(err)));
  };
};

export const uploadActualDko = (subprocess_uid, data) => {
  return async (dispatch) => {
    dispatch(uploadPonTkoStarted());
    api.pon
      .uploadActualDko(subprocess_uid, data)
      .then((res) => {
        if (res.data?.file_original_id) {
          const file_original_id = res.data.file_original_id;
          const timeOut = data.get('file_original').size > 1000000 ? 10000 : 5000;
          window.massLoadInterval = setInterval(() => checkResult(dispatch, file_original_id, 'ts'), timeOut);
        }
      })
      .catch((err) => dispatch(uploadPonTkoFailure(err)));
  };
};

export const downloadPonInformingFileFailure = (error) => ({
  type: DOWNLOAD_PON_INFORMING_FILE_FAILURE,
  payload: {
    error
  }
});

export const downloadPonInformingFile = (uid, fileName) => {
  return async (dispatch) => {
    api.pon
      .downloadPonInformingFile(uid)
      .then((res) => {
        saveAsFile(res.data, fileName, res.headers['content-type'] || '');
      })
      .catch((error) => dispatch(downloadPonInformingFileFailure(error)));
  };
};

export const downloadPonProvideActualDkoFile = (uid, fileName) => {
  return async (dispatch) => {
    api.pon
      .downloadPonProvideActualDkoFile(uid)
      .then((res) => {
        saveAsFile(res.data, fileName, res.headers['content-type'] || '');
      })
      .catch((error) => dispatch(downloadPonInformingFileFailure(error)));
  };
};

export const getPonInformingListStarted = () => ({
  type: GET_PON_INFORMING_LIST_STARTED
});

export const getPonInformingListSuccess = (data) => ({
  type: GET_PON_INFORMING_LIST_SUCCESS,
  payload: {
    data
  }
});

export const getPonInformingListFailure = (error) => ({
  type: GET_PON_INFORMING_LIST_FAILURE,
  payload: {
    error
  }
});

export const getPonInformingList = (uid, params) => {
  return async (dispatch) => {
    dispatch(getPonInformingListStarted());
    api.pon
      .getPonInformingList(uid, {...params, subprocess_uid: uid})
      .then((res) => dispatch(getPonInformingListSuccess(res.data)))
      .catch((error) => dispatch(getPonInformingListFailure(error)));
  };
};

export const clearPonInformingList = () => ({
  type: CLEAR_PON_INFORMING_LIST
});

export const setPonInformingListParams = (data) => ({
  type: SET_PON_INFORMING_LIST_PARAMS,
  payload: {
    data
  }
});

export const getPonInformingDetailsStarted = () => ({
  type: GET_PON_INFORMING_DETAIL_STARTED
});

export const getPonInformingDetailsSuccess = (data) => ({
  type: GET_PON_INFORMING_DETAIL_SUCCESS,
  payload: {
    data
  }
});

export const getPonInformingDetailsFailure = (error) => ({
  type: GET_PON_INFORMING_DETAIL_FAILURE,
  payload: {
    error
  }
});

export const getPonInformingDetails = (uid, tko_uid) => {
  return async (dispatch) => {
    dispatch(getPonInformingDetailsStarted());
    api.pon
      .getPonInformingTkoDetail(uid, tko_uid)
      .then((res) => dispatch(getPonInformingDetailsSuccess(res.data)))
      .catch((error) => dispatch(getPonInformingDetailsFailure(error)));
  };
};

export const getPonProvideActualDkoTkoDetail = (uid, tko_uid) => {
  return async (dispatch) => {
    dispatch(getPonInformingDetailsStarted());
    api.pon
      .getPonProvideActualDkoTkoDetail(uid, tko_uid)
      .then((res) => dispatch(getPonInformingDetailsSuccess(res.data)))
      .catch((error) => dispatch(getPonInformingDetailsFailure(error)));
  };
};

export const getPonRequestDkoResultsStarted = () => ({
  type: GET_PON_REQUEST_DKO_DETAILS_STARTED
});

export const getPonRequestDkoResultsSuccess = (data) => ({
  type: GET_PON_REQUEST_DKO_DETAILS_SUCCESS,
  payload: {
    data
  }
});

export const getPonRequestDkoResultsFailure = (error) => ({
  type: GET_PON_REQUEST_DKO_DETAILS_FAILURE,
  payload: {
    error
  }
});

export const clearPonRequestDkoResults = () => ({
  type: CLEAR_PON_REQUEST_DKO_DETAILS
});

export const getPonRequestHistoricalDkoResults = (subprocess_uid, params) => {
  return async (dispatch) => {
    dispatch(getPonRequestDkoResultsStarted());
    api.pon
      .getHistoricalDkoResults(subprocess_uid, params)
      .then((res) => dispatch(getPonRequestDkoResultsSuccess(res.data)))
      .catch((error) => dispatch(getPonRequestDkoResultsFailure(error)));
  };
};

export const getPonRequestActualDkoResults = (subprocess_uid) => {
  return async (dispatch) => {
    dispatch(getPonRequestDkoResultsStarted());
    api.pon
      .getActualDkoResults(subprocess_uid)
      .then((res) => dispatch(getPonRequestDkoResultsSuccess(res.data)))
      .catch((error) => dispatch(getPonRequestDkoResultsFailure(error)));
  };
};
