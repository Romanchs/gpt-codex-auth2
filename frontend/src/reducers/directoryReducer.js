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
} from '../actions/types';

export default function directories(
  state = {
    loading: false,
    downloading: false,
    params: { page: 1, size: 25 },
    directoriesList: [],
    selectedDirectory: null,
    archiveDialogData: null,
    uploadSuppliersStatus: {
      openSuccessDialog: false,
      openPartialDialog: false,
      openFailureDialog: false,
      fileId: ''
    },
    error: null
  },
  action
) {
  switch (action.type) {
    case SET_DIRECTORY_LIST_PARAMS:
      return { ...state, params: action.payload.params, error: null };
    case CLEAR_DIRECTORY_LIST_PARAMS:
      return { ...state, params: { page: 1, size: 25 }, error: null, selectedDirectory: null };
    case GET_DIRECTORY_LIST_STARTED:
    case GET_DIRECTORY_BY_ID_STARTED:
    case ADD_ITEM_TO_DIRECTORY_STARTED:
      return { ...state, loading: true, error: null, archiveDialogData: null };
    case GET_DIRECTORY_LIST_SUCCESS:
      return { ...state, loading: false, directoriesList: action.payload.data?.data };
    case GET_DIRECTORY_BY_ID_SUCCESS:
      return { ...state, loading: false, selectedDirectory: action.payload.data };
    case ADD_ITEM_TO_DIRECTORY_SUCCESS:
      return { ...state, loading: false };
    case SET_ARCHIVE_DIRECTORY_DIALOG:
      return { ...state, archiveDialogData: action.payload.data };
    case REMOVE_ARCHIVE_DIRECTORY_DIALOG:
      return { ...state, archiveDialogData: null };
    case GET_DIRECTORY_LIST_FAILURE:
    case GET_DIRECTORY_BY_ID_FAILURE:
    case ADD_ITEM_TO_DIRECTORY_FAILURE:
    case ARCHIVE_DIRECTORY_FAILURE:
    case UPLOAD_SUPPLIERS_DIRECTORY_FAILURE:
      return { ...state, loading: false, error: action.payload.error };
    case DOWNLOAD_DIRECTORY_STARTED:
      return { ...state, downloading: true };
    case DOWNLOAD_DIRECTORY_SUCCESS:
    case DOWNLOAD_DIRECTORY_FAILURE:
      return { ...state, downloading: false };
    case UPLOAD_SUPPLIERS_DIRECTORY_STARTED:
      return { ...state, loading: true };
    case UPLOAD_SUPPLIERS_DIRECTORY_SUCCESS:
      return {
        ...state,
        loading: false,
        uploadSuppliersStatus: {
          ...state.uploadSuppliersStatus,
          openSuccessDialog: action.payload?.status === 'Success',
          openPartialDialog: action.payload?.status === 'Partial update',
          openFailureDialog: action.payload?.status === 'Not update',
          fileId: action.payload?.file_id || ''
        }
      };
    case CLOSE_SUPPLIERS_DIRECTORY_DIALOGS:
      return {
        ...state,
        loading: false,
        uploadSuppliersStatus: {
          openSuccessDialog: false,
          openPartialDialog: false,
          openFailureDialog: false,
          fileId: ''
        }
      };
    case DOWNLOAD_SUPPLIERS_UPDATE_RESULTS_STARTED:
      return { ...state, loading: true };
    case DOWNLOAD_SUPPLIERS_UPDATE_RESULTS_FAILURE:
      return { ...state, loading: false };
    default:
      return state;
  }
}
