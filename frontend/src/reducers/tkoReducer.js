import {
  DOWNLOAD_TKO_FAILURE,
  DOWNLOAD_TKO_STARTED,
  DOWNLOAD_TKO_SUCCESS,
  GET_TKO_ALL_ORGANIZATIONS_SUCCESS,
  GET_TKO_BY_ID_FAILURE,
  GET_TKO_BY_ID_STARTED,
  GET_TKO_BY_ID_SUCCESS,
  SET_TKO_PARAMS
} from '../actions/types';

export default function tko(
  state = {
    loading: false,
    downloading: false,
    params: { page: 1, size: 25, point_type: 'installation_ap' },
    selectedTko: null,
    error: null,
    allOrganizations: []
  },
  action
) {
  switch (action.type) {
    case SET_TKO_PARAMS:
      return { ...state, params: action.payload.params, error: null };
    case GET_TKO_BY_ID_STARTED:
      return { ...state, loading: true, error: null };
    case GET_TKO_BY_ID_SUCCESS:
      return { ...state, loading: false, selectedTko: action.payload.data };
    case GET_TKO_BY_ID_FAILURE:
      return { ...state, loading: false, error: action.payload.error };
    case DOWNLOAD_TKO_STARTED:
      return { ...state, downloading: true };
    case DOWNLOAD_TKO_SUCCESS:
    case DOWNLOAD_TKO_FAILURE:
      return { ...state, downloading: false };
    case GET_TKO_ALL_ORGANIZATIONS_SUCCESS:
      return { ...state, loading: false, allOrganizations: action.payload.data };
    default:
      return state;
  }
}
