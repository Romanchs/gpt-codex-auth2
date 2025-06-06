import {
  CLEAR_PPKO_CHECK,
  CLEAR_PPKO_LIST_PARAMS,
  DOWNLOAD_PPKO_BY_ID_FAILURE,
  DOWNLOAD_PPKO_BY_ID_STARTED,
  DOWNLOAD_PPKO_BY_ID_SUCCESS,
  DOWNLOAD_PPKO_EXTERNAL_FILE_BY_ID_STARTED,
  DOWNLOAD_PPKO_EXTERNAL_FILE_BY_ID_SUCCESS,
  DOWNLOAD_PPKO_EXTERNAL_FILE_BY_ID_FAILURE,
  DOWNLOAD_PPKO_DOCUMENT_FILE_FAILURE,
  DOWNLOAD_PPKO_DOCUMENT_FILE_STARTED,
  DOWNLOAD_PPKO_DOCUMENT_FILE_SUCCESS,
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
  UPDATE_PUBLICATION_EMAILS_SUCCESS,
  UPLOAD_PPKO_DOCUMENT_CLEAR,
  UPLOAD_PPKO_DOCUMENT_FAILURE,
  UPLOAD_PPKO_DOCUMENT_FILE_FAILURE,
  UPLOAD_PPKO_DOCUMENT_FILE_STARTED,
  UPLOAD_PPKO_DOCUMENT_FILE_SUCCESS,
  UPLOAD_PPKO_DOCUMENT_STARTED,
  UPLOAD_PPKO_DOCUMENT_SUCCESS
} from '../actions/types';

export default function ppko(
  state = {
    loading: false,
    params: { page: 1, size: 25 },
    selectedPpko: null,
    downloading: false,
    downloadingExternalFile: false,
    uploadFileLoading: false,
    uploadDocumentLoading: false,
    uploadDocumentResult: null,
    readiness_inspection_report: null,
    information_contract: null,
    readiness_protocol: null,
    emails: [],
    publication: false,
    namesCheckDocs: [],
    loadingNameCheckDock: false,
    ppkoCheck: null,
    list: null,
    error: null
  },
  action
) {
  switch (action.type) {
    case SET_PPKO_LIST_PARAMS:
      return { ...state, params: action.payload.params, error: null };
    case CLEAR_PPKO_LIST_PARAMS:
      return { ...state, params: { page: 1, size: 25 }, error: null };
    case GET_PPKO_LIST_STARTED:
    case GET_PPKO_BY_ID_STARTED:
      return { ...state, loading: true, selectedPpko: null, error: null };
    case SAVE_PPKO_CHECK_STARTED:
      return { ...state, loading: true, ppkoCheck: null, error: null };
    case SAVE_PPKO_CHECK_SUCCESS:
      return { ...state, loading: false, error: null };
    case SAVE_PPKO_CHECK_FAILURE:
      return { ...state, loading: false, error: action.payload.error };
    case GET_PPKO_LIST_SUCCESS:
      return { ...state, loading: false, list: action.payload.data };
    case GET_PPKO_BY_ID_SUCCESS:
      return { ...state, loading: false, selectedPpko: action.payload.data };
    case GET_PPKO_BY_ID_CLEAR:
      return { ...state, loading: false };
    case GET_PPKO_CHECK_BY_ID_STARTED:
      return { ...state, loading: true, ppkoCheck: null };
    case GET_PPKO_CHECK_BY_ID_SUCCESS:
      return { ...state, loading: false, ppkoCheck: action.payload.data };
    case GET_PPKO_LIST_FAILURE:
    case GET_PPKO_BY_ID_FAILURE:
    case GET_PPKO_CHECK_BY_ID_FAILURE:
      return { ...state, loading: false, error: action.payload.error };
    case UPLOAD_PPKO_DOCUMENT_CLEAR:
      return { ...state, uploadDocumentResult: null };
    case UPLOAD_PPKO_DOCUMENT_STARTED:
      return { ...state, uploadDocumentLoading: true, uploadDocumentResult: null, error: null };
    case UPLOAD_PPKO_DOCUMENT_SUCCESS:
      return { ...state, uploadDocumentLoading: false, uploadDocumentResult: action.payload.data };
    case UPLOAD_PPKO_DOCUMENT_FAILURE:
      return { ...state, uploadDocumentLoading: false, error: action.payload.error };
    case SAVE_PPKO_DOCUMENT_STARTED:
      return { ...state, uploadDocumentLoading: true, error: null };
    case SAVE_PPKO_DOCUMENT_SUCCESS:
      return { ...state, uploadDocumentLoading: false, error: null, uploadDocumentResult: action.payload.data };
    case SAVE_PPKO_DOCUMENT_FAILURE:
      return { ...state, uploadDocumentLoading: false, error: action.payload.error };
    case UPLOAD_PPKO_DOCUMENT_FILE_STARTED:
      return { ...state, uploadDocumentLoading: true, [action.payload.name]: null, error: null };
    case UPLOAD_PPKO_DOCUMENT_FILE_SUCCESS:
      return {
        ...state,
        uploadDocumentLoading: false,
        uploadDocumentResult: {
          ...state.uploadDocumentResult,
          [`${action.payload.type}_filename`]: action.payload.filename,
          [`${action.payload.type}_fileid`]: action.payload.data.fileid
        }
      };
    case UPLOAD_PPKO_DOCUMENT_FILE_FAILURE:
      return { ...state, uploadDocumentLoading: false, error: action.payload.error };
    case DOWNLOAD_PPKO_DOCUMENT_FILE_STARTED:
      return { ...state, uploadDocumentLoading: true, error: null };
    case DOWNLOAD_PPKO_DOCUMENT_FILE_SUCCESS:
      return { ...state, uploadDocumentLoading: false };
    case DOWNLOAD_PPKO_DOCUMENT_FILE_FAILURE:
      return { ...state, uploadDocumentLoading: false, error: action.payload.error };
    case GET_PUBLICATION_EMAILS_SUCCESS:
      return { ...state, emails: action.payload.data.emails };
    case UPDATE_PUBLICATION_EMAILS_SUCCESS:
      return { ...state, emails: action.payload.data.emails };
    case PPKO_PUBLICATION_STARTED:
      return { ...state, publication: true };
    case PPKO_PUBLICATION_SUCCESS:
      return { ...state, publication: false };
    case PPKO_PUBLICATION_FAILURE:
      return { ...state, publication: false };
    case DOWNLOAD_PPKO_BY_ID_STARTED:
      return { ...state, downloading: true };
    case DOWNLOAD_PPKO_BY_ID_SUCCESS:
    case DOWNLOAD_PPKO_BY_ID_FAILURE:
      return { ...state, downloading: false };
    case DOWNLOAD_PPKO_EXTERNAL_FILE_BY_ID_STARTED:
      return { ...state, downloadingExternalFile: true };
    case DOWNLOAD_PPKO_EXTERNAL_FILE_BY_ID_SUCCESS:
    case DOWNLOAD_PPKO_EXTERNAL_FILE_BY_ID_FAILURE:
      return { ...state, downloadingExternalFile: false };
    case GET_NAMES_CHECK_DOCK_STARTED:
      return { ...state, loadingNameCheckDock: true };
    case GET_NAMES_CHECK_DOCK_SUCCESS:
      return { ...state, namesCheckDocs: action.payload.data, loadingNameCheckDock: false };
    case CLEAR_PPKO_CHECK:
      return { ...state, ppkoCheck: null };
    default:
      return state;
  }
}
