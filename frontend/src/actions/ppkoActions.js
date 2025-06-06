import i18n from '../i18n/i18n';
import api from '../util/api';
import { saveAsFile } from '../util/files';
import { enqueueSnackbar } from './notistackActions';
import {
  CLEAR_PPKO_CHECK,
  CLEAR_PPKO_LIST_PARAMS,
  DOWNLOAD_PPKO_BY_ID_FAILURE,
  DOWNLOAD_PPKO_BY_ID_STARTED,
  DOWNLOAD_PPKO_BY_ID_SUCCESS,
  DOWNLOAD_PPKO_DOCUMENT_FILE_FAILURE,
  DOWNLOAD_PPKO_DOCUMENT_FILE_STARTED,
  DOWNLOAD_PPKO_DOCUMENT_FILE_SUCCESS,
  DOWNLOAD_PPKO_EXTERNAL_FILE_BY_ID_FAILURE,
  DOWNLOAD_PPKO_EXTERNAL_FILE_BY_ID_STARTED,
  DOWNLOAD_PPKO_EXTERNAL_FILE_BY_ID_SUCCESS,
  GET_NAMES_CHECK_DOCK_STARTED,
  GET_NAMES_CHECK_DOCK_SUCCESS,
  GET_PPKO_BY_ID_CLEAR,
  GET_PPKO_BY_ID_FAILURE,
  GET_PPKO_BY_ID_STARTED,
  GET_PPKO_BY_ID_SUCCESS,
  GET_PPKO_CHECK_BY_ID_FAILURE,
  GET_PPKO_CHECK_BY_ID_STARTED,
  GET_PPKO_CHECK_BY_ID_SUCCESS,
  GET_PPKO_LIST_FAILURE,
  GET_PPKO_LIST_STARTED,
  GET_PPKO_LIST_SUCCESS,
  GET_PUBLICATION_EMAILS_FAILURE,
  GET_PUBLICATION_EMAILS_STARTED,
  GET_PUBLICATION_EMAILS_SUCCESS,
  PPKO_PUBLICATION_FAILURE,
  PPKO_PUBLICATION_STARTED,
  PPKO_PUBLICATION_SUCCESS,
  SAVE_PPKO_CHECK_FAILURE,
  SAVE_PPKO_CHECK_STARTED,
  SAVE_PPKO_CHECK_SUCCESS,
  SAVE_PPKO_DOCUMENT_FAILURE,
  SAVE_PPKO_DOCUMENT_STARTED,
  SAVE_PPKO_DOCUMENT_SUCCESS,
  SET_PPKO_LIST_PARAMS,
  UPDATE_PUBLICATION_EMAILS_FAILURE,
  UPDATE_PUBLICATION_EMAILS_STARTED,
  UPDATE_PUBLICATION_EMAILS_SUCCESS,
  UPLOAD_PPKO_DOCUMENT_CLEAR,
  UPLOAD_PPKO_DOCUMENT_FAILURE,
  UPLOAD_PPKO_DOCUMENT_FILE_FAILURE,
  UPLOAD_PPKO_DOCUMENT_FILE_STARTED,
  UPLOAD_PPKO_DOCUMENT_FILE_SUCCESS,
  UPLOAD_PPKO_DOCUMENT_STARTED,
  UPLOAD_PPKO_DOCUMENT_SUCCESS
} from './types';
import { mainApi } from '../app/mainApi';
import { PPKO_CONTACTS_TAG } from '../Components/pages/PPKO/details/api';

export const getPpkoListStarted = () => ({
  type: GET_PPKO_LIST_STARTED
});

export const getPpkoListSuccess = (data) => ({
  type: GET_PPKO_LIST_SUCCESS,
  payload: {
    data
  }
});

export const getPpkoListFailure = (error) => ({
  type: GET_PPKO_LIST_FAILURE,
  payload: {
    error
  }
});

export const getPpkoList = (params) => {
  return async (dispatch) => {
    dispatch(getPpkoListStarted());
    api.ppko
      .getPpkoList(params)
      .then((res) => dispatch(getPpkoListSuccess(res.data)))
      .catch((error) => dispatch(getPpkoListFailure(error)));
  };
};

export const getNamesCheckDocsStarted = () => ({
  type: GET_NAMES_CHECK_DOCK_STARTED
});

export const getNamesCheckDocsSuccess = (data) => ({
  type: GET_NAMES_CHECK_DOCK_SUCCESS,
  payload: {
    data
  }
});

export const getNamesCheckDocs = (params) => {
  return async (dispatch) => {
    dispatch(getNamesCheckDocsStarted());
    api.user
      .getNamesCheckDocs(params)
      .then((res) => dispatch(getNamesCheckDocsSuccess(res.data)))
      .catch((error) => console.log(error));
  };
};

export const setPpkoListParams = (params) => ({
  type: SET_PPKO_LIST_PARAMS,
  payload: {
    params
  }
});

export const clearPpkoListParams = () => ({
  type: CLEAR_PPKO_LIST_PARAMS
});

export const getPpkoByIdStarted = () => ({
  type: GET_PPKO_BY_ID_STARTED
});

export const getPpkoByIdSuccess = (data) => ({
  type: GET_PPKO_BY_ID_SUCCESS,
  payload: {
    data
  }
});

export const getPpkoByIdClear = () => ({
  type: GET_PPKO_BY_ID_CLEAR
});

export const getPpkoByIdFailure = (error) => ({
  type: GET_PPKO_BY_ID_FAILURE,
  payload: {
    error
  }
});

export const getPpkoById = (id) => {
  return async (dispatch) => {
    dispatch(getPpkoByIdStarted());
    api.ppko
      .getPpkoById(id)
      .then((res) => dispatch(getPpkoByIdSuccess(res.data)))
      .catch((error) => dispatch(getPpkoByIdFailure(error)));
  };
};

export const downloadPpkoByIdStarted = () => ({
  type: DOWNLOAD_PPKO_BY_ID_STARTED
});

export const downloadPpkoByIdSuccess = () => ({
  type: DOWNLOAD_PPKO_BY_ID_SUCCESS
});

export const downloadPpkoByIdFailure = (error) => ({
  type: DOWNLOAD_PPKO_BY_ID_FAILURE,
  payload: {
    error
  }
});

export const downloadPpkoById = (id, name) => {
  return async (dispatch) => {
    dispatch(downloadPpkoByIdStarted());
    api.ppko
      .download(id)
      .then((res) => {
        if (res.status === 200) {
          saveAsFile(res.data, name, res.headers['content-type'] || '');
          dispatch(downloadPpkoByIdSuccess());
        }
      })
      .catch((error) => dispatch(downloadPpkoByIdFailure(error)));
  };
};

export const downloadPpkoExternalFileByIdStarted = () => ({
  type: DOWNLOAD_PPKO_EXTERNAL_FILE_BY_ID_STARTED
});

export const downloadPpkoExternalFileByIdSuccess = () => ({
  type: DOWNLOAD_PPKO_EXTERNAL_FILE_BY_ID_SUCCESS
});

export const downloadPpkoExternalFileByIdFailure = (error) => ({
  type: DOWNLOAD_PPKO_EXTERNAL_FILE_BY_ID_FAILURE,
  payload: {
    error
  }
});

export const downloadPpkoExternalFileById = (id, name, routerCallback) => {
  return async (dispatch) => {
    dispatch(downloadPpkoExternalFileByIdStarted());
    api.ppko
      .downloadExternalFile(id)
      .then((res) => {
        if (res.status === 200) {
          saveAsFile(res.data, name, res.headers['content-type'] || '');
          dispatch(downloadPpkoExternalFileByIdSuccess());
        }
      })
      .catch((error) => {
        dispatch(downloadPpkoExternalFileByIdFailure(error));
      })
      .finally(() => routerCallback && routerCallback());
  };
};

export const clearPpkoDocumentResult = () => ({
  type: UPLOAD_PPKO_DOCUMENT_CLEAR
});

export const uploadPpkoDocumentStarted = () => ({
  type: UPLOAD_PPKO_DOCUMENT_STARTED
});

export const uploadPpkoDocumentSuccess = (data) => ({
  type: UPLOAD_PPKO_DOCUMENT_SUCCESS,
  payload: {
    data
  }
});

export const uploadPpkoDocumentFailure = (error) => ({
  type: UPLOAD_PPKO_DOCUMENT_FAILURE,
  payload: {
    error
  }
});

export const uploadPpkoDocument = (id) => {
  return async (dispatch) => {
    dispatch(uploadPpkoDocumentStarted());
    api.ppko
      .uploadDocument(id)
      .then((res) => dispatch(uploadPpkoDocumentSuccess(res.data)))
      .catch((error) => dispatch(uploadPpkoDocumentFailure(error)));
  };
};

export const downloadPpkoDocumentFileStarted = () => ({
  type: DOWNLOAD_PPKO_DOCUMENT_FILE_STARTED
});

export const downloadPpkoDocumentFileSuccess = (data) => ({
  type: DOWNLOAD_PPKO_DOCUMENT_FILE_SUCCESS,
  payload: {
    data
  }
});

export const downloadPpkoDocumentFileFailure = (error) => ({
  type: DOWNLOAD_PPKO_DOCUMENT_FILE_FAILURE,
  payload: {
    error
  }
});

export const downloadPpkoDocumentFile = (id, name) => {
  return async (dispatch) => {
    dispatch(downloadPpkoDocumentFileStarted());
    api.ppko
      .downloadDocumentFile(id)
      .then((res) => {
        dispatch(downloadPpkoDocumentFileSuccess());
        if (res.status === 200) {
          saveAsFile(res.data, name, res.headers['content-type'] || '');
        }
      })
      .catch((error) => dispatch(downloadPpkoDocumentFileFailure(error)));
  };
};

export const uploadPpkoDocumentFileStarted = (name) => ({
  type: UPLOAD_PPKO_DOCUMENT_FILE_STARTED,
  payload: {
    name
  }
});

export const uploadPpkoDocumentFileSuccess = (data, type, filename) => ({
  type: UPLOAD_PPKO_DOCUMENT_FILE_SUCCESS,
  payload: {
    data,
    type,
    filename
  }
});

export const uploadPpkoDocumentFileFailure = (error) => ({
  type: UPLOAD_PPKO_DOCUMENT_FILE_FAILURE,
  payload: {
    error
  }
});

export const uploadPpkoDocumentFile = (data, type, filename) => {
  return async (dispatch) => {
    dispatch(uploadPpkoDocumentFileStarted(type));
    const formData = new FormData();
    formData.append([type], data?.files[0] ? data?.files[0] : null);
    api.ppko
      .uploadDocumentFile(formData)
      .then((res) => dispatch(uploadPpkoDocumentFileSuccess(res.data, type, filename)))
      .catch((error) => dispatch(uploadPpkoDocumentFileFailure(error)));
  };
};

export const savePpkoDocumentStarted = () => ({
  type: SAVE_PPKO_DOCUMENT_STARTED
});

export const savePpkoDocumentSuccess = (data) => ({
  type: SAVE_PPKO_DOCUMENT_SUCCESS,
  payload: { data }
});

export const savePpkoDocumentFailure = (error) => ({
  type: SAVE_PPKO_DOCUMENT_FAILURE,
  payload: {
    error
  }
});

export const savePpkoDocument = (data, id, callback) => {
  return async (dispatch) => {
    dispatch(savePpkoDocumentStarted());
    api.ppko
      .updateDocument(data, id)
      .then(() => {
        callback && callback();
        dispatch(savePpkoDocumentSuccess(data));
        dispatch(
          enqueueSnackbar({
            message: i18n.t('NOTIFICATIONS.CHANGES_SUCCESSFULLT_SAVED'),
            options: {
              key: new Date().getTime() + Math.random(),
              variant: 'success',
              autoHideDuration: 5000
            }
          })
        );
      })
      .catch((error) => dispatch(savePpkoDocumentFailure(error)));
  };
};

// EMAILS

export const getPublicationEmailsStarted = () => ({
  type: GET_PUBLICATION_EMAILS_STARTED
});

export const getPublicationEmailsSuccess = (data) => ({
  type: GET_PUBLICATION_EMAILS_SUCCESS,
  payload: {
    data
  }
});

export const getPublicationEmailsFailure = (error) => ({
  type: GET_PUBLICATION_EMAILS_FAILURE,
  payload: {
    error
  }
});

export const getPublicationEmails = () => {
  return async (dispatch) => {
    dispatch(getPublicationEmailsStarted());
    api.ppko
      .getPublicationsEmails()
      .then((res) => dispatch(getPublicationEmailsSuccess(res.data)))
      .catch((error) => dispatch(getPublicationEmailsFailure(error)));
  };
};

export const updatePublicationEmailsStarted = () => ({
  type: UPDATE_PUBLICATION_EMAILS_STARTED
});

export const updatePublicationEmailsSuccess = (data) => ({
  type: UPDATE_PUBLICATION_EMAILS_SUCCESS,
  payload: {
    data
  }
});

export const updatePublicationEmailsFailure = (error) => ({
  type: UPDATE_PUBLICATION_EMAILS_FAILURE,
  payload: {
    error
  }
});

export const updatePublicationEmails = (data) => {
  return async (dispatch) => {
    dispatch(updatePublicationEmailsStarted());
    api.ppko
      .updatePublicationsEmails(data)
      .then((res) => {
        dispatch(updatePublicationEmailsSuccess(res.data));
      })
      .catch((error) => dispatch(updatePublicationEmailsFailure(error)));
  };
};

export const onPublicationStarted = () => ({
  type: PPKO_PUBLICATION_STARTED
});

export const onPublicationSuccess = (data) => ({
  type: PPKO_PUBLICATION_SUCCESS,
  payload: {
    data
  }
});

export const onPublicationFailure = (error) => ({
  type: PPKO_PUBLICATION_FAILURE,
  payload: {
    error
  }
});

export const onPublication = () => {
  return async (dispatch) => {
    dispatch(onPublicationStarted());
    api.ppko
      .onPublication()
      .then((res) => dispatch(onPublicationSuccess(res.data)))
      .catch((error) => dispatch(onPublicationFailure(error)));
  };
};

export const clearPpkoCheck = () => ({
  type: CLEAR_PPKO_CHECK
});

export const getPpkoCheckByIdStarted = () => ({
  type: GET_PPKO_CHECK_BY_ID_STARTED
});

export const getPpkoCheckByIdSuccess = (data) => ({
  type: GET_PPKO_CHECK_BY_ID_SUCCESS,
  payload: {
    data
  }
});

export const getPpkoCheckByIdFailure = (error) => ({
  type: GET_PPKO_CHECK_BY_ID_FAILURE,
  payload: {
    error
  }
});

export const getPpkoCheckById = (id) => {
  return async (dispatch) => {
    dispatch(getPpkoCheckByIdStarted());
    api.ppko
      .getPpkoChecById(id)
      .then((res) => dispatch(getPpkoCheckByIdSuccess(res.data)))
      .catch((error) => dispatch(getPpkoCheckByIdFailure(error)));
  };
};

export const savePpkoCheckStarted = () => ({
  type: SAVE_PPKO_CHECK_STARTED
});

export const savePpkoCheckSuccess = () => ({
  type: SAVE_PPKO_CHECK_SUCCESS
});

export const savePpkoCheckFailure = (error) => ({
  type: SAVE_PPKO_CHECK_FAILURE,
  payload: {
    error
  }
});

export const savePpkoCheck = (id, callback) => {
  return async (dispatch) => {
    dispatch(savePpkoCheckStarted());
    api.ppko
      .savePpkoCheck(id)
      .then((res) => {
        callback(res.data.check_id);
        dispatch(savePpkoCheckSuccess());
        dispatch(getPpkoCheckById(res.data.check_id));
        dispatch(
          enqueueSnackbar({
            message: i18n.t('NOTIFICATIONS.CHANGES_SUCCESSFULLT_SAVED'),
            options: {
              key: new Date().getTime() + Math.random(),
              variant: 'success',
              autoHideDuration: 5000
            }
          })
        );
      })
      .catch((error) => dispatch(savePpkoCheckFailure(error)));
  };
};

export const updatePpkoCheck = (data, id) => {
  return async (dispatch) => {
    dispatch(savePpkoCheckStarted());
    api.ppko
      .updatePpkoCheck(data, id)
      .then((res) => {
        dispatch(savePpkoCheckSuccess(res.data));
        dispatch(getPpkoCheckById(id));
        dispatch(
          enqueueSnackbar({
            message: i18n.t('NOTIFICATIONS.CHANGES_SUCCESSFULLT_SAVED'),
            options: {
              key: new Date().getTime() + Math.random(),
              variant: 'success',
              autoHideDuration: 5000
            }
          })
        );
      })
      .catch((error) => dispatch(savePpkoCheckFailure(error)));
  };
};

export const getPpkoJSONById = (id, callback) => {
  return async (dispatch) => {
    dispatch(getPpkoByIdStarted());
    api.ppko
      .getPpkoJSONById(id)
      .then((res) => {
        callback(res.data);
        dispatch(getPpkoByIdClear());
      })
      .catch((error) => dispatch(getPpkoByIdFailure(error)));
  };
};

export const getPpkoConstants = (callback) => {
  return async (dispatch) => {
    dispatch(getPpkoByIdStarted());
    api.ppko
      .getPpkoConstants()
      .then((res) => {
        callback(res.data);
        dispatch(getPpkoByIdClear());
      })
      .catch((error) => dispatch(getPpkoByIdFailure(error)));
  };
};

export const getPpkoLists = (callback) => {
  return async (dispatch) => {
    dispatch(getPpkoByIdStarted());
    Promise.all([
      api.ppko.getPpkoLists('region', { q: '' }),
      api.ppko.getPpkoLists('settlementTypes', {}),
      api.ppko.getPpkoLists('streetTypes', {}),
      api.ppko.getPpkoLists('roomTypes', {})
    ])
      .then((res) => {
        callback({
          REGION: res[0].data,
          SETTLEMENT_TYPES: res[1].data,
          STREET_TYPES: res[2].data,
          ROOM_TYPES: res[3].data
        });
        dispatch(getPpkoByIdClear());
      })
      .catch((error) => dispatch(getPpkoByIdFailure(error)));
  };
};

export const getPpkoDistrictsList = (region, callback) => {
  return async (dispatch) => {
    dispatch(getPpkoByIdStarted());
    api.ppko
      .getPpkoLists('district', { region })
      .then((res) => {
        callback(res.data);
        dispatch(getPpkoByIdClear());
      })
      .catch((error) => dispatch(getPpkoByIdFailure(error)));
  };
};

export const savePpko = (id, data) => {
  return async (dispatch) => {
    dispatch(getPpkoByIdStarted());
    api.ppko
      .savePpko(id, data)
      .then(() => {
        dispatch(getPpkoByIdClear());
        dispatch(
          enqueueSnackbar({
            message: i18n.t('NOTIFICATIONS.CHANGES_SUCCESSFULLT_SAVED'),
            options: {
              key: new Date().getTime() + Math.random(),
              variant: 'success',
              autoHideDuration: 3000
            }
          })
        );
        dispatch(mainApi.util.invalidateTags([PPKO_CONTACTS_TAG]));
      })
      .catch((error) => dispatch(getPpkoByIdFailure(error)));
  };
};
