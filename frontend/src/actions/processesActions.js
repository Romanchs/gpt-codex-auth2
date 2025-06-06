import i18n from '../i18n/i18n';
import api from '../util/api';
import { saveAsFile } from '../util/files';
import { downloadFileByIdFailure, uploadTkoFailure, uploadTkoStarted } from './massLoadActions';
import { enqueueSnackbar } from './notistackActions';
import {
  CLEAR_UPLOAD_DATA,
  CURRENT_PROCESS,
  DOWNLOAD_DISTRICT_PROCESSES_FILE_FAILURE,
  DOWNLOAD_DISTRICT_PROCESSES_FILE_STARTED,
  DOWNLOAD_DISTRICT_PROCESSES_FILE_SUCCESS,
  GET_PROCESSES_FAILURE,
  GET_PROCESSES_STARTED,
  GET_PROCESSES_SUCCESS,
  GET_UPDATE_TKO_DATA_PROCESSES_TKO_FAILURE,
  GET_UPDATE_TKO_DATA_PROCESSES_TKO_STARTED,
  GET_UPDATE_TKO_DATA_PROCESSES_TKO_SUCCESS,
  UPLOAD_FILES_DISTRICT_PROCESSES_TKO_FAILURE,
  UPLOAD_FILES_DISTRICT_PROCESSES_TKO_STARTED,
  UPLOAD_FILES_DISTRICT_PROCESSES_TKO_SUCCESS,
  UPLOAD_TKO_FAILURE,
  UPLOAD_TKO_STARTED
} from './types';

export const getProcessesStarted = () => ({
  type: GET_PROCESSES_STARTED
});

export const getProcessesSuccess = (data) => ({
  type: GET_PROCESSES_SUCCESS,
  payload: {
    data
  }
});

export const getProcessesFailure = (error) => ({
  type: GET_PROCESSES_FAILURE,
  payload: {
    error
  }
});

export const getProcesses = (params) => {
  return async (dispatch) => {
    dispatch(getProcessesStarted());
    api.processes
      .getList(params)
      .then((res) => {
        dispatch(getProcessesSuccess(res.data));
      })
      .catch((err) => {
        dispatch(getProcessesFailure(err));
      });
  };
};

export const downloadExportProcesses = () => {
  return async (dispatch) => {
    dispatch(
      enqueueSnackbar({
        message: i18n.t('NOTIFICATIONS.FILE_STARTED_FORMING'),
        options: {
          key: new Date().getTime() + Math.random(),
          variant: 'success',
          autoHideDuration: 3000
        }
      })
    );
    api.processes
      .downloadExportProcesses()
      .then((res) => {
        if (res.status === 200) {
          const disposition = res.headers['content-disposition'];
          if (disposition) {
            saveAsFile(
              res.data,
              decodeURIComponent(disposition.replaceAll("attachment; filename*=utf-8''", '')),
              res.headers['content-type']
            );
          }
        }
      })
      .catch((error) => dispatch(getProcessesFailure(error)));
  };
};

export const getDistrictProcesses = (uid) => {
  return async (dispatch) => {
    dispatch(getCurrentProcessDataStarted());
    api.processes
      .getDistinctProcesses(uid)
      .then((res) => dispatch(setCurrentProcess(res.data)))
      .catch((error) => dispatch(getCurrentProcessDataFailure(error)));
  };
};

export const getUpdateTkoDataProcessesStarted = () => ({
  type: GET_UPDATE_TKO_DATA_PROCESSES_TKO_STARTED
});

export const getUpdateTkoDataProcessesSuccess = (data) => ({
  type: GET_UPDATE_TKO_DATA_PROCESSES_TKO_SUCCESS,
  payload: {
    data
  }
});

export const getUpdateTkoDataProcessesFailure = (error) => ({
  type: GET_UPDATE_TKO_DATA_PROCESSES_TKO_FAILURE,
  payload: {
    error
  }
});

export const getUpdateTkoDataProcesses = () => {
  return async (dispatch) => {
    dispatch(getUpdateTkoDataProcessesStarted());
    api.processes
      .getUpdateTkoDataProcesses()
      .then((res) => {
        dispatch(getUpdateTkoDataProcessesSuccess(res.data));
      })
      .catch((error) => dispatch(getUpdateTkoDataProcessesFailure(error)));
  };
};

export const createDistrictProcesses = (data, callback) => {
  return async (dispatch) => {
    dispatch(getCurrentProcessDataStarted());
    api.processes
      .createDistinctProcesses(data)
      .then((res) => {
        dispatch(clearCurrentProcess());
        callback(res?.data?.uid);
      })
      .catch((error) => dispatch(getCurrentProcessDataFailure(error)));
  };
};

export const cancelDistrictProcesses = (uid) => {
  return async (dispatch) => {
    dispatch(getCurrentProcessDataStarted());
    api.processes
      .cancelDistinctProcesses(uid)
      .then(() => dispatch(getDistrictProcesses(uid)))
      .catch((error) => dispatch(getCurrentProcessDataFailure(error)));
  };
};

export const completeDistrictProcesses = (uid, comment) => {
  return async (dispatch) => {
    dispatch(getCurrentProcessDataStarted());
    api.processes
      .completeDistinctProcesses(uid, comment)
      .then((res) => {
        const hoursCount = Math.ceil(res.data?.successful / 17000) || 1;
        dispatch(
          enqueueSnackbar({
            message: i18n.t('NOTIFICATIONS.PROCESS_STARTED_FORMING_TIME_PARAM', { hoursCount }),
            options: {
              key: new Date().getTime() + Math.random(),
              variant: 'success',
              autoHideDuration: 5000
            }
          })
        );
        dispatch(setCurrentProcess(res.data));
      })
      .catch((error) => dispatch(getCurrentProcessDataFailure(error)));
  };
};

export const uploadFilesDistrictProcessesStarted = () => ({
  type: UPLOAD_FILES_DISTRICT_PROCESSES_TKO_STARTED
});

export const uploadFilesDistrictProcessesSuccess = (data) => ({
  type: UPLOAD_FILES_DISTRICT_PROCESSES_TKO_SUCCESS,
  payload: {
    data
  }
});

export const uploadFilesDistrictProcessesFailure = (error) => ({
  type: UPLOAD_FILES_DISTRICT_PROCESSES_TKO_FAILURE,
  payload: {
    error
  }
});

export const clearDistrictProcessesUpload = () => ({
  type: CLEAR_UPLOAD_DATA
});

export const uploadFilesDistrictProcesses = (uid, data, callback) => {
  return async (dispatch) => {
    dispatch(uploadFilesDistrictProcessesStarted());
    api.processes
      .uploadFilesDistinctProcesses(uid, data)
      .then((res) => {
        if (res.data?.file_original_id) {
          dispatch(uploadFilesDistrictProcessesSuccess(res.data));
          callback();
        }
      })
      .catch((error) => dispatch(uploadFilesDistrictProcessesFailure(error)));
  };
};

export const downloadDistrictProcessesFileStarted = () => ({
  type: DOWNLOAD_DISTRICT_PROCESSES_FILE_STARTED
});

export const downloadDistrictProcessesFileSuccess = () => ({
  type: DOWNLOAD_DISTRICT_PROCESSES_FILE_SUCCESS
});

export const downloadDistrictProcessesFileFailure = (error) => ({
  type: DOWNLOAD_DISTRICT_PROCESSES_FILE_FAILURE,
  payload: {
    error
  }
});

export const downloadDistrictProcessesFile = (id, name) => {
  return async (dispatch) => {
    dispatch(downloadDistrictProcessesFileStarted());
    api.files
      .downloadByUid(id)
      .then((res) => {
        if (res.status === 200) {
          saveAsFile(res.data, name, res.headers['content-type'] || '');
          dispatch(downloadDistrictProcessesFileSuccess());
        }
      })
      .catch((error) => dispatch(downloadDistrictProcessesFileFailure(error)));
  };
};

export const getCurrentProcessDataStarted = () => ({
  type: CURRENT_PROCESS.FETCH_STARTED
});

export const getCurrentProcessDataFailure = (error) => ({
  type: CURRENT_PROCESS.FETCH_FAILURE,
  payload: {
    error
  }
});

export const setCurrentProcess = (payload) => ({
  type: CURRENT_PROCESS.SET_DATA,
  payload
});

export const clearCurrentProcess = () => ({
  type: CURRENT_PROCESS.CLEAR
});

export const setCurrentProcessParams = (params) => ({
  type: CURRENT_PROCESS.SET_PARAMS,
  payload: {
    params
  }
});

export const clearCurrentProcessParams = () => ({
  type: CURRENT_PROCESS.CLEAR_PARAMS
});

export const uploadFileStarted = () => ({
  type: UPLOAD_TKO_STARTED
});

export const uploadFileFailure = (error) => ({
  type: UPLOAD_TKO_FAILURE,
  payload: {
    error
  }
});

export const uploadFileClear = () => ({
  type: CLEAR_UPLOAD_DATA
});

export const getConnectionDisconnectionAps = (uid, params) => {
  return async (dispatch) => {
    dispatch(getCurrentProcessDataStarted());
    api.processes
      .getConnectionDisconnectionAps(uid, params)
      .then((res) => dispatch(setCurrentProcess(res.data)))
      .catch((error) => dispatch(getCurrentProcessDataFailure(error)));
  };
};

export const checkConnectionDisconnectionAp = (uid, data, callback, onFinish) => {
  return async (dispatch) => {
    api.processes
      .checkConnectionDisconnectionAp(uid, data)
      .then(() => callback && callback())
      .catch((err) => dispatch(getCurrentProcessDataFailure(err)))
      .finally(onFinish);
  };
};

export const uncheckConnectionDisconnectionAp = (uid, data, callback, onFinish) => {
  return async () => {
    api.processes
      .uncheckConnectionDisconnectionAp(uid, data)
      .then(() => callback && callback())
      .finally(onFinish);
  };
};

export const initConnectDisconnect = (data, callback) => {
  return async (dispatch) => {
    dispatch(getCurrentProcessDataStarted());
    api.processes
      .initConnectionDisconnectionProcess(data)
      .then((res) => {
        dispatch(clearCurrentProcess());
        callback(res.data?.uid);
      })
      .catch((error) => dispatch(getCurrentProcessDataFailure(error)));
  };
};

export const uploadConnectingTKOFiles = (uid, params, callback) => {
  return async (dispatch) => {
    dispatch(uploadFileStarted());
    api.processes
      .uploadConnectingTKOFiles(uid, params)
      .then(() => {
        callback && callback();
        dispatch(uploadFileClear());
      })
      .catch((error) => {
        dispatch(uploadFileFailure(error));
      });
  };
};

export const uploadDisconnectingTKOFiles = (uid, params, callback) => {
  return async (dispatch) => {
    dispatch(uploadFileStarted());
    api.processes
      .uploadDisconnectingTKOFiles(uid, params)
      .then(() => {
        callback && callback();
        dispatch(uploadFileClear());
      })
      .catch((error) => {
        dispatch(uploadFileFailure(error));
      });
  };
};

export const uploadConnectingDisconnectingMassActionAp = (uid, params, callback) => {
  return async (dispatch) => {
    dispatch(uploadFileStarted());
    api.processes
      .uploadConnectingDisconnectingMassActionAp(uid, params)
      .then((res) => {
        dispatch(setCurrentProcess(res.data));
        callback && callback();
        dispatch(uploadFileClear());
      })
      .catch((error) => {
        dispatch(uploadFileFailure(error));
      });
  };
};

export const exportConnectingDisconnectingAps = (uid, callback) => {
  return async (dispatch) => {
    api.processes
      .exportConnectingDisconnectingAps(uid)
      .then((res) => {
        if (res.status === 200) {
          dispatch(
            enqueueSnackbar({
              message: i18n.t('NOTIFICATIONS.FILE_STARTED_FORMING'),
              options: {
                key: new Date().getTime() + Math.random(),
                variant: 'success',
                autoHideDuration: 5000
              }
            })
          );
          callback && callback();
        }
      })
      .catch((error) => dispatch(getCurrentProcessDataFailure(error)));
  };
};

export const getConnectDisconnectDetails = (uid, params, onSuccess, onError) => {
  return async (dispatch) => {
    dispatch(getCurrentProcessDataStarted());
    api.processes
      .getConnectionDisconnectionDetails(uid, params)
      .then((res) => {
        dispatch(setCurrentProcess(res.data));
        onSuccess && onSuccess(res.data);
      })
      .catch((error) => {
        dispatch(getCurrentProcessDataFailure(error));
        onError(error.response);
      });
  };
};

export const getConnectingDisconnectingTKOFiles = (uid) => {
  return async (dispatch) => {
    dispatch(getCurrentProcessDataStarted());
    api.processes
      .getConnectingDisconnectingTKOFiles(uid)
      .then((res) => dispatch(setCurrentProcess(res.data)))
      .catch((error) => dispatch(getCurrentProcessDataFailure(error)));
  };
};

export const toFormConnectDisconnectProcess = (uid, data, callback) => {
  return async (dispatch) => {
    dispatch(getCurrentProcessDataStarted());
    api.processes
      .toFormConnectDisconnectProcess(uid, data)
      .then((res) => {
        dispatch(setCurrentProcess(res.data));
        callback && callback();
      })
      .catch((error) => {
        dispatch(getCurrentProcessDataFailure(error));
      });
  };
};

export const getConnectDisconnectSubprocesses = (uid, params) => {
  return async (dispatch) => {
    dispatch(getCurrentProcessDataStarted());
    api.processes
      .getConnectionDisconnectionSubProcesses(uid, params)
      .then((res) => dispatch(setCurrentProcess(res.data)))
      .catch((error) => dispatch(getCurrentProcessDataFailure(error)));
  };
};

export const cancelConnectDisconnectProcess = (uid, tab, callback) => {
  return async (dispatch) => {
    api.processes
      .cancelConnectionDisconnectionProcess(uid)
      .then((res) => {
        if (tab === 'files') {
          dispatch(getConnectingDisconnectingTKOFiles(uid));
        } else dispatch(setCurrentProcess(res.data));
        callback && callback();
      })
      .catch((error) => dispatch(getCurrentProcessDataFailure(error)));
  };
};

export const removeConnectionDisconnectionPoint = (uid, point_uid, callback) => {
  return async (dispatch) => {
    dispatch(getCurrentProcessDataStarted());
    api.processes
      .removeConnectionDisconnectionPoint(uid, point_uid)
      .then((res) => {
        dispatch(clearCurrentProcess());
        callback(res?.data?.status);
      })
      .catch((error) => dispatch(getCurrentProcessDataFailure(error)));
  };
};

export const initConnectionDisconnectionSubprocess = (uid) => {
  return async (dispatch) => {
    dispatch(getCurrentProcessDataStarted());
    api.processes
      .initConnectionDisconnectionSubprocess(uid)
      .then((res) => dispatch(setCurrentProcess(res.data)))
      .catch((error) => dispatch(getCurrentProcessDataFailure(error)));
  };
};

export const doneConnectDisconnect = (uid, tab, data) => {
  return async (dispatch) => {
    dispatch(getCurrentProcessDataStarted());
    api.processes
      .doneConnectDisconnect(uid, data)
      .then(() =>
        tab === 'details'
          ? dispatch(getConnectDisconnectDetails(uid, { page: 1, size: 25 }))
          : dispatch(getConnectDisconnectSubprocesses(uid, { page: 1, size: 25 }))
      )
      .catch((error) => dispatch(getCurrentProcessDataFailure(error)));
  };
};

export const confirmConnectionDisconnectionPoint = (uid, data, onSuccess, onError) => {
  return async (dispatch) => {
    api.processes
      .confirmConnectionDisconnectionPoint(uid, data)
      .then((res) => onSuccess(res))
      .catch((error) => {
        onError();
        dispatch(getCurrentProcessDataFailure(error));
      });
  };
};

export const rejectConnectionDisconnectionPoint = (uid, data, onSuccess) => {
  return async (dispatch) => {
    api.processes
      .rejectConnectionDisconnectionPoint(uid, data)
      .then(() => onSuccess())
      .catch((error) => dispatch(getCurrentProcessDataFailure(error)));
  };
};

// CHANGE SUPPLIER TO SUPPLIER

export const changeSupplierStart = (data, callback) => {
  return async (dispatch) => {
    dispatch(getCurrentProcessDataStarted());
    api.processes
      .changeSupplierStart(data)
      .then((res) => {
        callback(res?.data?.uid);
        dispatch(clearCurrentProcess());
      })
      .catch((error) => dispatch(getCurrentProcessDataFailure(error)));
  };
};

export const getChangeSupplierTkos = (uid, params) => {
  return async (dispatch) => {
    dispatch(getCurrentProcessDataStarted());
    api.processes
      .changeSupplierTkos(uid, params)
      .then((res) => dispatch(setCurrentProcess(res.data)))
      .catch((error) => dispatch(getCurrentProcessDataFailure(error)));
  };
};

export const getChangeSupplierPredictableTkos = (uid, params) => {
  return async (dispatch) => {
    dispatch(getCurrentProcessDataStarted());
    api.processes
      .changeSupplierPredictableTkos(uid, params)
      .then((res) => dispatch(setCurrentProcess(res.data)))
      .catch((error) => dispatch(getCurrentProcessDataFailure(error)));
  };
};

export const changeSupplierInforming = (uid, params, path) => {
  return async (dispatch) => {
    dispatch(getCurrentProcessDataStarted());
    api.processes
      .changeSupplierInforming(uid, params, path)
      .then((res) => dispatch(setCurrentProcess(res.data)))
      .catch((error) => dispatch(getCurrentProcessDataFailure(error)));
  };
};

export const getChangeSupplierInformingFiles = (uid, path) => {
  return async (dispatch) => {
    dispatch(getCurrentProcessDataStarted());
    api.processes
      .changeSupplierInformingFiles(uid, path)
      .then((res) => dispatch(setCurrentProcess(res.data)))
      .catch((error) => dispatch(getCurrentProcessDataFailure(error)));
  };
};

export const getChangeSupplierFiles = (uid, params) => {
  return async (dispatch) => {
    dispatch(getCurrentProcessDataStarted());
    api.processes
      .changeSupplierFiles(uid, params)
      .then((res) => dispatch(setCurrentProcess(res.data)))
      .catch((error) => dispatch(getCurrentProcessDataFailure(error)));
  };
};

export const getChangeSupplierPredictableFiles = (uid, params) => {
  return async (dispatch) => {
    dispatch(getCurrentProcessDataStarted());
    api.processes
      .changeSupplierPredictableFiles(uid, params)
      .then((res) => dispatch(setCurrentProcess(res.data)))
      .catch((error) => dispatch(getCurrentProcessDataFailure(error)));
  };
};

export const downloadProcessFileById = (id, name) => {
  return async (dispatch) => {
    api.files
      .downloadByUid(id)
      .then((res) => {
        if (res.status === 200) {
          saveAsFile(res.data, name, res.headers['content-type'] || '');
        }
      })
      .catch((error) => dispatch(getCurrentProcessDataFailure(error)));
  };
};

export const uploadChangeSupply = (uid, params, data, callback) => {
  return async (dispatch) => {
    dispatch(uploadFileStarted());
    api.processes
      .changeSupplierUpload(uid, params, data)
      .then((data) => {
        dispatch(uploadFileClear());
        callback(data);
      })
      .catch((error) => dispatch(uploadFileFailure(error)));
  };
};

export const uploadChangeSupplyApsMassCancel = (uid, data, callback) => {
  return async (dispatch) => {
    dispatch(uploadFileStarted());
    api.processes
      .changeSupplierUploadApsMassCancel(uid, data)
      .then((data) => {
        dispatch(uploadFileClear());
        callback(data);
      })
      .catch((error) => dispatch(uploadFileFailure(error)));
  };
};

export const exportChangeSupplyAps = (uid, callback) => {
  return async (dispatch) => {
    api.processes
      .exportChangeSupplyAps(uid)
      .then((res) => {
        if (res.status === 200) {
          dispatch(
            enqueueSnackbar({
              message: i18n.t('NOTIFICATIONS.FILE_STARTED_FORMING'),
              options: {
                key: new Date().getTime() + Math.random(),
                variant: 'success',
                autoHideDuration: 5000
              }
            })
          );
          callback && callback();
        }
      })
      .catch((error) => dispatch(getCurrentProcessDataFailure(error)));
  };
};

export const uploadChangeSupplyTestFile = (uid, data, callback) => {
  return async (dispatch) => {
    dispatch(uploadFileStarted());
    api.processes
      .uploadChangeSupplyTestFile(uid, data)
      .then((data) => {
        dispatch(uploadFileClear());
        callback(data);
      })
      .catch((error) => dispatch(uploadFileFailure(error)));
  };
};

export const changeSupplierPredictableUpload = (uid, data, callback) => {
  return async (dispatch) => {
    dispatch(uploadFileStarted());
    api.processes
      .changeSupplierPredictableUpload(uid, data)
      .then(callback)
      .catch((error) => dispatch(uploadFileFailure(error)));
  };
};

export const formingChangeSupply = (uid, callback) => {
  return async (dispatch) => {
    dispatch(getCurrentProcessDataStarted());
    api.processes
      .changeSupplierForming(uid)
      .then(callback)
      .catch((error) => dispatch(getCurrentProcessDataFailure(error)));
  };
};

export const formingChangeSupplyPredictable = (uid, callback) => {
  return async (dispatch) => {
    dispatch(getCurrentProcessDataStarted());
    api.processes
      .changeSupplierPredictableForming(uid)
      .then(callback)
      .catch((error) => dispatch(getCurrentProcessDataFailure(error)));
  };
};

export const doneChangeSupplyPredictable = (uid, callback) => {
  return async (dispatch) => {
    dispatch(getCurrentProcessDataStarted());
    api.processes
      .changeSupplierPredictableDone(uid)
      .then(callback)
      .catch((error) => dispatch(getCurrentProcessDataFailure(error)));
  };
};

export const doneChangeSupplyInforming = (uid, path, callback) => {
  return async (dispatch) => {
    dispatch(getCurrentProcessDataStarted());
    api.processes
      .changeSupplierInformingDone(uid, path)
      .then(() => callback(path))
      .catch((error) => dispatch(getCurrentProcessDataFailure(error)));
  };
};

export const deleteChangeSupplyTkoByUid = (uid, body, callback) => {
  return async (dispatch) => {
    dispatch(getCurrentProcessDataStarted());
    api.processes
      .deleteTkoById(uid, body)
      .then(callback)
      .catch((error) => dispatch(getCurrentProcessDataFailure(error)));
  };
};

// DISPUTE TKO

export const get = (params, callback) => {
  return async (dispatch) => {
    api.processes
      .getDisputePartyAko(params)
      .then((res) => {
        callback(res.data);
      })
      .catch((error) => dispatch(getCurrentProcessDataFailure(error)));
  };
};

export const getDisputeBySideAko = (params, callback) => {
  return async (dispatch) => {
    api.processes
      .getDisputePartyAko(params)
      .then((res) => {
        callback(res.data);
      })
      .catch((error) => dispatch(getCurrentProcessDataFailure(error)));
  };
};

export const createDisputeTko = (data, callback) => {
  return async (dispatch) => {
    dispatch(getCurrentProcessDataStarted());
    api.processes
      .createDisputeTko(data)
      .then((res) => {
        dispatch(clearCurrentProcess());
        callback(res.data?.uid);
      })
      .catch((error) => dispatch(getCurrentProcessDataFailure(error)));
  };
};

export const getDisputeTkoSubprocesses = (uid, params, callback) => {
  return async (dispatch) => {
    dispatch(getCurrentProcessDataStarted());
    api.processes
      .getDisputeTkoChild(uid, params)
      .then((res) => {
        dispatch({ type: CURRENT_PROCESS.FETCH_FAILURE_WITHOUT_MESSAGE, payload: { error: null } });
        callback(res.data);
      })
      .catch((error) => dispatch(getCurrentProcessDataFailure(error)));
  };
};

export const getDisputeTko = (uid) => {
  return async (dispatch) => {
    dispatch(getCurrentProcessDataStarted());
    api.processes
      .getDisputeTko(uid)
      .then((res) => dispatch(setCurrentProcess(res.data)))
      .catch((error) => dispatch(getCurrentProcessDataFailure(error)));
  };
};

export const uploadFileDisputeDetails = (uid, data, callback) => {
  return async (dispatch) => {
    dispatch(uploadTkoStarted());
    api.processes
      .uploadFileDisputeDetails(uid, data)
      .then((res) => callback(res.data))
      .catch((error) => dispatch(uploadTkoFailure(error)));
  };
};

export const deleteFileDisputeDetails = (uid) => {
  return async () => {
    api.processes.deleteFileDisputeDetails(uid);
  };
};

export const cancelDisputeTko = (uid, callback) => {
  return async (dispatch) => {
    api.processes
      .cancelDisputeTko(uid)
      .then(() => {
        dispatch(getDisputeTko(uid));
        callback();
      })
      .catch((error) => dispatch(getCurrentProcessDataFailure(error)));
  };
};

export const updateDispute = (uid, callback) => {
  return async (dispatch) => {
    dispatch(getCurrentProcessDataStarted());
    api.processes
      .updateDisputeTko(uid)
      .then((res) => {
        dispatch(setCurrentProcess(res.data));
        callback();
      })
      .catch((error) => dispatch(getCurrentProcessDataFailure(error)));
  };
};

export const getDisputeTkoSubprocess = (subprocess_uid) => {
  return async (dispatch) => {
    dispatch(getCurrentProcessDataStarted());
    api.processes
      .getDisputeTkoSubprocess(subprocess_uid)
      .then((res) => dispatch(setCurrentProcess(res.data)))
      .catch((error) => dispatch(getCurrentProcessDataFailure(error)));
  };
};

export const getDisputeAtkos = (action_type, callback) => {
  return async (dispatch) => {
    api.processes
      .getDisputeAtkos({ action_type })
      .then((res) => callback(res.data))
      .catch((error) => dispatch(getCurrentProcessDataFailure(error)));
  };
};

export const startDisputeSubprocess = (subprocess_uid) => {
  return async (dispatch) => {
    dispatch(getCurrentProcessDataStarted());
    api.processes
      .startDisputeTkoSubprocess(subprocess_uid)
      .then((res) => dispatch(setCurrentProcess(res.data)))
      .catch((error) => dispatch(getCurrentProcessDataFailure(error)));
  };
};

export const doneDisputeSubprocess = (subprocess_uid, data, withoutAps = false) => {
  return async (dispatch) => {
    dispatch(getCurrentProcessDataStarted());
    api.processes
      .doneFileDisputeTkoSubprocess(subprocess_uid, data, withoutAps)
      .then((res) => dispatch(setCurrentProcess(res.data)))
      .catch((error) => dispatch(getCurrentProcessDataFailure(error)));
  };
};

export const exportDisputeTkoSubprocess = (subprocess_uid, name) => {
  return async (dispatch) => {
    api.processes
      .exportFileDisputeTkoSubprocess(subprocess_uid)
      .then((res) => {
        if (res.status === 200) {
          saveAsFile(res.data, name, res.headers['content-type'] || '');
        }
      })
      .catch((error) => dispatch(getCurrentProcessDataFailure(error)));
  };
};

// Receiving Dko Historical
export const initReceivingDkoHistorical = (data, callback) => {
  return async (dispatch) => {
    dispatch(getCurrentProcessDataStarted());
    api.processes
      .initReceivingDkoHistorical(data)
      .then((res) => {
        callback(res?.data?.uid);
      })
      .catch((error) => dispatch(getCurrentProcessDataFailure(error)));
  };
};

export const getReceivingDkoHistorical = (uid, params) => {
  return async (dispatch) => {
    dispatch(getCurrentProcessDataStarted());
    api.processes
      .getReceivingDkoHistorical(uid, params)
      .then((res) => dispatch(setCurrentProcess(res.data)))
      .catch((error) => dispatch(getCurrentProcessDataFailure(error)));
  };
};

export const getReceivingDkoHistoricalFiles = (uid, params) => {
  return async (dispatch) => {
    dispatch(getCurrentProcessDataStarted());
    api.processes
      .getReceivingDkoHistoricalFiles(uid, params)
      .then((res) => dispatch(setCurrentProcess(res.data)))
      .catch((error) => dispatch(getCurrentProcessDataFailure(error)));
  };
};

export const cancelReceivingDkoHistorical = (uid, callback) => {
  return async (dispatch) => {
    dispatch(getCurrentProcessDataStarted());
    api.processes
      .cancelReceivingDkoHistorical(uid)
      .then(callback)
      .catch((error) => dispatch(getCurrentProcessDataFailure(error)));
  };
};

export const uploadReceivingDkoHistorical = (uid, data, callback) => {
  return async (dispatch) => {
    dispatch(uploadTkoStarted());
    api.processes
      .uploadReceivingDkoHistorical(uid, data)
      .then(callback)
      .catch((err) => dispatch(uploadTkoFailure(err)));
  };
};

// Granting Authority TKO
export const initGrantingAuthorityTKO = (callback) => {
  return async (dispatch) => {
    dispatch(getCurrentProcessDataStarted());
    api.processes
      .initGrantingAuthority()
      .then((res) => callback(res?.data?.uid))
      .catch((error) => dispatch(getCurrentProcessDataFailure(error)));
  };
};

export const getGrantingAuthorityTKO = (uid) => {
  return async (dispatch) => {
    dispatch(getCurrentProcessDataStarted());
    api.processes
      .getGrantingAuthority(uid)
      .then((res) => dispatch(setCurrentProcess(res.data)))
      .catch((error) => dispatch(getCurrentProcessDataFailure(error)));
  };
};

export const uploadGrantingAuthorityTKO = (data, id, callback) => {
  return async (dispatch) => {
    dispatch(uploadTkoStarted());
    api.tko
      .uploadGrantingAuthorityTKO(data, id)
      .then(() => {
        callback();
      })
      .catch((err) => dispatch(uploadTkoFailure(err)));
  };
};

export const getGrantingAuthority = (uid) => {
  return async (dispatch) => {
    dispatch(getCurrentProcessDataStarted());
    api.processes.getGrantingAuthority(uid).then((res) => dispatch(setCurrentProcess(res.data)));
  };
};

// TERMINATION RESUMPTION TKO

export const initTerminationResumption = (data, callback) => {
  return async (dispatch) => {
    dispatch(getCurrentProcessDataStarted());
    api.processes
      .initTerminationResumption(data)
      .then((res) => {
        dispatch(clearCurrentProcess());
        callback(res.data?.uid);
      })
      .catch((error) => dispatch(getCurrentProcessDataFailure(error)));
  };
};

export const toFormTerminationResumption = (uid, data) => {
  return async (dispatch) => {
    dispatch(getCurrentProcessDataStarted());
    api.processes
      .toFormTerminationResumption(uid, data)
      .then((res) => dispatch(setCurrentProcess(res.data)))
      .catch((error) => dispatch(getCurrentProcessDataFailure(error)));
  };
};

export const getTerminationResumptionFiles = (uid) => {
  return async (dispatch) => {
    dispatch(getCurrentProcessDataStarted());
    api.processes
      .getTerminationResumptionFiles(uid)
      .then((res) => dispatch(setCurrentProcess(res.data)))
      .catch((error) => dispatch(getCurrentProcessDataFailure(error)));
  };
};

export const getTerminationResumptionCheckedAccountPoints = (uid, ap_uid, params) => {
  return async (dispatch) => {
    dispatch(getCurrentProcessDataStarted());
    api.processes
      .getTerminationResumptionCheckedAccountPoints(uid, ap_uid, params)
      .then((res) => dispatch(setCurrentProcess(res.data)))
      .catch((error) => dispatch(getCurrentProcessDataFailure(error)));
  };
};

export const getTerminationResumptionAccountingPoints = (uid, params) => {
  return async (dispatch) => {
    dispatch(getCurrentProcessDataStarted());
    api.processes
      .getTerminationResumptionAccountingPoints(uid, params)
      .then((res) => dispatch(setCurrentProcess(res.data)))
      .catch((error) => dispatch(getCurrentProcessDataFailure(error)));
  };
};

export const uploadTerminationResumptionFiles = (uid, params, callback) => {
  return async (dispatch) => {
    dispatch(uploadFileStarted());
    api.processes
      .uploadTerminationResumptionFiles(uid, params)
      .then(() => {
        dispatch(uploadFileClear());
        callback();
      })
      .catch((error) => dispatch(uploadFileFailure(error)));
  };
};

export const uploadTerminationResumptionApsMassCancel = (uid, data, callback) => {
  return async (dispatch) => {
    dispatch(uploadFileStarted());
    api.processes
      .uploadTerminationResumptionApsMassCancel(uid, data)
      .then((data) => {
        dispatch(uploadFileClear());
        callback(data);
      })
      .catch((error) => dispatch(uploadFileFailure(error)));
  };
};

export const exportTerminationResumptionAps = (uid, callback) => {
  return async (dispatch) => {
    api.processes
      .exportTerminationResumptionAps(uid)
      .then((res) => {
        if (res.status === 200) {
          dispatch(
            enqueueSnackbar({
              message: i18n.t('NOTIFICATIONS.FILE_STARTED_FORMING'),
              options: {
                key: new Date().getTime() + Math.random(),
                variant: 'success',
                autoHideDuration: 5000
              }
            })
          );
          callback && callback();
        }
      })
      .catch((error) => dispatch(getCurrentProcessDataFailure(error)));
  };
};

export const doneReceivingDkoHistorical = (uid, callback) => {
  return async (dispatch) => {
    dispatch(getCurrentProcessDataStarted());
    api.processes
      .doneReceivingDkoHistorical(uid)
      .then(callback)
      .catch((error) => dispatch(getCurrentProcessDataFailure(error)));
  };
};

export const getReceivingDkoHistorySubprocess = (uid, params) => {
  return async (dispatch) => {
    dispatch(getCurrentProcessDataStarted());
    api.processes
      .getReceivingDkoHistoricalSubprocess(uid, params)
      .then((res) => dispatch(setCurrentProcess(res.data)))
      .catch((error) => dispatch(getCurrentProcessDataFailure(error)));
  };
};

export const getTkosGrantingAuthorityTkos = (uid, params) => {
  return async (dispatch) => {
    dispatch(getCurrentProcessDataStarted());
    api.processes
      .getTkosGrantingAuthority(uid, params)
      .then((res) => dispatch(setCurrentProcess(res.data)))
      .catch((error) => dispatch(getCurrentProcessDataFailure(error)));
  };
};

export const getFilesGrantingAuthority = (uid, params) => {
  return async (dispatch) => {
    dispatch(getCurrentProcessDataStarted());
    api.processes
      .getFilesGrantingAuthority(uid, params)
      .then((res) => dispatch(setCurrentProcess(res.data)))
      .catch((error) => dispatch(getCurrentProcessDataFailure(error)));
  };
};

export const getGeneratedFilesGrantingAuthority = (uid, params) => {
  return async (dispatch) => {
    dispatch(getCurrentProcessDataStarted());
    api.processes
      .getGeneratedFilesGrantingAuthority(uid, params)
      .then((res) => dispatch(setCurrentProcess(res.data)))
      .catch((error) => dispatch(getCurrentProcessDataFailure(error)));
  };
};

export const getTerminationResumptionDetails = (uid, params, callback) => {
  return async (dispatch) => {
    dispatch(getCurrentProcessDataStarted());
    api.processes
      .getTerminationResumptionDetails(uid, params)
      .then((res) => {
        dispatch(setCurrentProcess(res.data));
        callback && callback(res.data);
      })
      .catch((error) => dispatch(getCurrentProcessDataFailure(error)));
  };
};

export const getTakeImpressionsHistoricalUploadedFiles = (uid, params, callback) => {
  return async (dispatch) => {
    dispatch(getCurrentProcessDataStarted());
    api.processes
      .getTakeImpressionsHistoricalUploadedFiles(uid, params)
      .then((res) => {
        dispatch(setCurrentProcess(res.data));
        callback();
      })
      .catch((error) => dispatch(getCurrentProcessDataFailure(error)));
  };
};

export const getHistoryGrantingAuthority = (uid, params) => {
  return async (dispatch) => {
    dispatch(getCurrentProcessDataStarted());
    api.processes
      .historicalDkoGrantingAuthority(uid, params)
      .then((res) => dispatch(setCurrentProcess(res.data)))
      .catch((error) => dispatch(getCurrentProcessDataFailure(error)));
  };
};

export const removeTerminationResumptionPoint = (uid, pointUid, params) => {
  return async (dispatch) => {
    dispatch(getCurrentProcessDataStarted());
    api.processes
      .removeTerminationResumptionPoint(uid, pointUid)
      .then(() => dispatch(getTerminationResumptionDetails(uid, params)))
      .catch((error) => dispatch(getCurrentProcessDataFailure(error)));
  };
};

export const confirmTerminationResumption = (uid, data, onSuccess, onError) => {
  return async (dispatch) => {
    api.processes
      .confirmTerminationResumption(uid, data)
      .then(() => {
        onSuccess();
      })
      .catch((error) => {
        onError();
        dispatch(getCurrentProcessDataFailure(error));
      });
  };
};

export const formGrantingAuthority = (uid, callback) => {
  return async (dispatch) => {
    dispatch(getCurrentProcessDataStarted());
    api.processes
      .formGrantingAuthority(uid)
      .then((res) => {
        dispatch(setCurrentProcess(res.data));
        callback();
      })
      .catch((error) => dispatch(getCurrentProcessDataFailure(error)));
  };
};

export const getTerminationResumptionRequests = (uid, params) => {
  return async (dispatch) => {
    dispatch(getCurrentProcessDataStarted());
    api.processes
      .getTerminationResumptionRequests(uid, params)
      .then((res) => dispatch(setCurrentProcess(res.data)))
      .catch((error) => dispatch(getCurrentProcessDataFailure(error)));
  };
};

export const downloadGrantingAuthorityTkos = (uid, callback) => {
  return async (dispatch) => {
    api.tko
      .downloadGrantingAuthorityTkos({ subprocess_uid: uid })
      .then((res) => {
        if (res.status === 200) {
          callback();
        }
      })
      .catch((error) => dispatch(downloadFileByIdFailure(error)));
  };
};

export const getTimeRowsTko = (uid, can_update) => {
  return async (dispatch) => {
    api.tko
      .getGrantingAuthorityTimeRows({ subprocess_uid: uid })
      .then((res) => {
        if (can_update) {
          dispatch(getGeneratedFilesGrantingAuthority(uid, { page: 1, size: 25 }));
        }
        dispatch(
          enqueueSnackbar({
            message: res?.data?.file ? res?.data?.file : i18n.t('NOTIFICATIONS.FILE_STARTED_FORMING'),
            options: {
              key: new Date().getTime() + Math.random(),
              variant: 'success',
              autoHideDuration: 5000
            }
          })
        );
      })
      .catch((error) => dispatch(getCurrentProcessDataFailure(error)));
  };
};

export const cancelTerminationResumption = (uid, callback) => {
  return async (dispatch) => {
    dispatch(getCurrentProcessDataStarted());
    api.processes
      .cancelTerminationResumption(uid)
      .then((res) => {
        dispatch(setCurrentProcess(res.data));
        callback();
      })
      .catch((error) => dispatch(getCurrentProcessDataFailure(error)));
  };
};

// Receiving Dko Actual
export const getWorkdaysReceivingDkoActual = ({ date, days }, callback) => {
  return async (dispatch) => {
    dispatch(getCurrentProcessDataStarted());
    api.processes
      .getWorkdaysReceivingDkoActual({
        method: 'shift',
        value: date,
        delta: { days }
      })
      .then((res) => {
        dispatch(clearCurrentProcess());
        callback(res?.data?.result);
      })
      .catch((error) => dispatch(getCurrentProcessDataFailure(error)));
  };
};

export const initReceivingDkoActual = (data, callback) => {
  return async (dispatch) => {
    dispatch(getCurrentProcessDataStarted());
    api.processes
      .initReceivingDkoActual(data)
      .then((res) => {
        callback(res?.data?.uid);
      })
      .catch((error) => dispatch(getCurrentProcessDataFailure(error)));
  };
};

export const getReceivingDkoActual = (uid, params) => {
  return async (dispatch) => {
    dispatch(getCurrentProcessDataStarted());
    api.processes
      .getReceivingDkoActual(uid, params)
      .then((res) => dispatch(setCurrentProcess(res.data)))
      .catch((error) => dispatch(getCurrentProcessDataFailure(error)));
  };
};

export const getReceivingDkoActualUploadedFiles = (uid, params) => {
  return async (dispatch) => {
    dispatch(getCurrentProcessDataStarted());
    api.processes
      .getReceivingDkoActualUploadedFiles(uid, params)
      .then((res) => dispatch(setCurrentProcess(res.data)))
      .catch((error) => dispatch(getCurrentProcessDataFailure(error)));
  };
};

export const cancelReceivingDkoActual = (uid, callback) => {
  return async (dispatch) => {
    dispatch(getCurrentProcessDataStarted());
    api.processes
      .cancelReceivingDkoActual(uid)
      .then(callback)
      .catch((error) => dispatch(getCurrentProcessDataFailure(error)));
  };
};

export const uploadReceivingDkoActual = (uid, data, callback) => {
  return async (dispatch) => {
    dispatch(uploadTkoStarted());
    api.processes
      .uploadReceivingDkoActual(uid, data)
      .then(callback)
      .catch((err) => dispatch(uploadTkoFailure(err)));
  };
};

export const doneReceivingDkoActual = (uid, callback) => {
  return async (dispatch) => {
    dispatch(getCurrentProcessDataStarted());
    api.processes
      .doneReceivingDkoActual(uid)
      .then(callback)
      .catch((error) => dispatch(getCurrentProcessDataFailure(error)));
  };
};

export const getReceivingDkoActualSubprocess = (uid, params) => {
  return async (dispatch) => {
    dispatch(getCurrentProcessDataStarted());
    api.processes
      .getReceivingDkoActualSubprocess(uid, params)
      .then((res) => dispatch(setCurrentProcess(res.data)))
      .catch((error) => dispatch(getCurrentProcessDataFailure(error)));
  };
};

export const changeSupplierInformingAkoTkos = (uid, params) => {
  return async (dispatch) => {
    dispatch(getCurrentProcessDataStarted());
    api.processes
      .changeSupplierInformingAkoTkos(uid, params)
      .then((res) => dispatch(setCurrentProcess(res.data)))
      .catch((error) => dispatch(getCurrentProcessDataFailure(error)));
  };
};

export const changeSupplierInformingAkoFiles = (uid, type, params) => {
  return async (dispatch) => {
    dispatch(getCurrentProcessDataStarted());
    api.processes
      .changeSupplierInformingAkoFiles(uid, type, params)
      .then((res) => dispatch(setCurrentProcess(res.data)))
      .catch((error) => dispatch(getCurrentProcessDataFailure(error)));
  };
};

export const changeSupplierInformingAkoInforming = (uid) => {
  return async (dispatch) => {
    dispatch(getCurrentProcessDataStarted());
    api.processes
      .changeSupplierInformingAkoInforming(uid)
      .then((res) => dispatch(setCurrentProcess(res.data)))
      .catch((error) => dispatch(getCurrentProcessDataFailure(error)));
  };
};

export const changeSupplierInformingAkoDetails = (uid, type, params) => {
  return async (dispatch) => {
    dispatch(getCurrentProcessDataStarted());
    api.processes
      .changeSupplierInformingAkoDetails(uid, type, params)
      .then((res) => dispatch(setCurrentProcess(res.data?.subprocesses)))
      .catch((error) => dispatch(getCurrentProcessDataFailure(error)));
  };
};
