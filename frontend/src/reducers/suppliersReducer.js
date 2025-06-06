import { SUPPLIERS } from '../actions/types';

export default function suppliers(
  state = {
    loading: false,
    downloading: false,
    data: [],
    activationList: [],
    params: { page: 1, size: 25 },
    selected: [],
    selectedErrors: [],
    notFound: false,
    error: null
  },
  action
) {
  switch (action.type) {
    case SUPPLIERS.CLEAR_DATA:
      return { ...state, loading: false, data: [], params: { page: 1, size: 25 } };
    case SUPPLIERS.SET_PARAMS:
      return { ...state, params: { ...state.params, ...action.payload }, error: null };
    case SUPPLIERS.GET_LIST.STARTED:
    case SUPPLIERS.GET_BY_UID.STARTED:
      return { ...state, loading: true, error: null, notFound: false };
    case SUPPLIERS.GET_LIST.SUCCESS:
      return { ...state, loading: false, data: action.payload };
    case SUPPLIERS.GET_LIST.ACTIVATION_LIST_SUCCESS:
      return { ...state, loading: false, activationList: action.payload };
    case SUPPLIERS.GET_BY_UID.SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload,
        notFound: action.payload.error?.response?.status === 404
      };
    case SUPPLIERS.GET_LIST.FAILURE:
    case SUPPLIERS.GET_BY_UID.FAILURE:
      return { ...state, loading: false, error: action.payload.error };
    case SUPPLIERS.SET_SELECTED:
      return { ...state, selected: action.payload };
    case SUPPLIERS.UPDATE_STATUS.STARTED:
      return { ...state, loading: true, error: null };
    case SUPPLIERS.UPDATE_STATUS.SUCCESS:
      return {
        ...state,
        loading: false,
        selected: action.payload.data,
        selectedErrors: action.payload.errors
      };
    case SUPPLIERS.UPDATE_STATUS.FAILURE:
      return { ...state, loading: false, error: action.payload.error?.response?.data };
    case SUPPLIERS.DOWNLOAD.STARTED:
      return { ...state, downloading: true };
    case SUPPLIERS.DOWNLOAD.SUCCESS:
      return { ...state, downloading: false };
    case SUPPLIERS.DOWNLOAD.FAILURE:
      return { ...state, downloading: false, error: action.payload.error };
    default:
      return state;
  }
}
