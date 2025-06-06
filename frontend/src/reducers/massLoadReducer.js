import { CLEAR_UPLOAD_DATA, UPLOAD_TKO_FAILURE, UPLOAD_TKO_STARTED, UPLOAD_TKO_SUCCESS } from '../actions/types';

export default function massLoad(
  state = {
    loading: false,
    params: { page: 1, size: 25 },
    tkoList: null,
    massLoadList: null,
    atkoOrganizations: { data: [] },
    uploading: false,
    uploadingResponse: null,
    error: null
  },
  action
) {
  switch (action.type) {
    case UPLOAD_TKO_STARTED:
      return { ...state, uploading: true, error: null };
    case UPLOAD_TKO_SUCCESS:
      return { ...state, uploading: false, uploadingResponse: action.payload.data };
    case UPLOAD_TKO_FAILURE:
      return { ...state, uploading: false, error: action.payload.error };
    case CLEAR_UPLOAD_DATA:
      return { ...state, uploading: false, error: null, uploadingResponse: null };
    default:
      return state;
  }
}
