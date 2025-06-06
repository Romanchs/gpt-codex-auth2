import {
  CANCEL_PON_FAILURE,
  CANCEL_PON_STARTED,
  CANCEL_PON_SUCCESS,
  CLEAR_PON_INFORMING_DETAIL,
  CLEAR_PON_INFORMING_LIST,
  CLEAR_PON_REDUCER,
  CLEAR_PON_REQUEST_DKO_DETAILS,
  CLEAR_PON_REQUEST_TKO,
  CLEAR_PON_REQUEST_TKO_LOADING,
  CLEAR_PON_REQUESTS,
  CLEAR_PON_SUPPLIERS,
  CREATE_PON_FAILURE,
  CREATE_PON_STARTED,
  CREATE_PON_SUCCESS,
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
  SET_PON_REQUESTS_DATA_PARAMS
} from '../actions/types';

export default function pon(
  state = {
    ponList: [],
    suppliers: undefined,
    reasons: [],
    creatingFetching: false,
    ponLoading: true,
    ponData: null,
    createdPon: null,
    canceledPon: false,
    requests: {
      loading: false,
      params: { page: 1, size: 25 },
      data: null,
      error: null
    },
    requestTko: {
      loading: false,
      data: null,
      error: null,
      notFound: false
    },
    informingList: {
      loading: false,
      data: null,
      params: { page: 1, size: 25 }
    },
    requestDkoResults: {
      loading: false,
      data: []
    },
    informing: {
      data: null,
      loading: false,
      notFound: false,
      error: null
    },
    notFound: false,
    error: null
  },
  action
) {
  switch (action.type) {
    case GET_PON_SUPPLIERS_STARTED:
    case GET_PON_REASONS_STARTED:
    case SEARCH_PON_SUPPLIERS_STARTED:
      return { ...state, error: null };
    case CREATE_PON_STARTED:
      return { ...state, error: null, creatingFetching: true };
    case GET_PON_BY_ID_STARTED:
      return { ...state, error: null, ponLoading: true, notFound: false };
    case CANCEL_PON_STARTED:
      return { ...state, error: null, ponLoading: true };

    case GET_PON_SUPPLIERS_SUCCESS:
      return { ...state, ponList: action.payload.data.data };
    case GET_PON_REASONS_SUCCESS:
      return { ...state, reasons: action.payload.data };
    case SEARCH_PON_SUPPLIERS_SUCCESS:
      return { ...state, suppliers: action.payload.data };
    case CREATE_PON_SUCCESS:
      return { ...state, createdPon: action.payload.data, creatingFetching: false };
    case GET_PON_BY_ID_SUCCESS:
      return { ...state, ponData: action.payload.data, ponLoading: false };
    case CANCEL_PON_SUCCESS:
      return { ...state, ponLoading: false, canceledPon: true };

    case GET_PON_SUPPLIERS_FAILURE:
    case GET_PON_REASONS_FAILURE:
    case SEARCH_PON_SUPPLIERS_FAILURE:
      return { ...state, error: action.payload.error };
    case CLEAR_PON_SUPPLIERS:
      return { ...state, suppliers: undefined };
    case CREATE_PON_FAILURE:
      return { ...state, error: action.payload.error, creatingFetching: false };
    case GET_PON_BY_ID_FAILURE:
      return {
        ...state,
        error: action.payload.error,
        ponLoading: false,
        notFound: action.payload.error?.response?.status === 404
      };
    case CANCEL_PON_FAILURE:
      return { ...state, error: action.payload.error, ponLoading: false };

    case CLEAR_PON_REDUCER:
      return {
        ...state,
        ponList: [],
        suppliers: undefined,
        reasons: [],
        creatingFetching: false,
        ponLoading: true,
        ponData: null,
        createdPon: null,
        canceledPon: false,
        error: null
      };

    case GET_PON_REQUESTS_DATA_STARTED:
      return { ...state, requests: { ...state.requests, loading: true } };
    case GET_PON_REQUESTS_DATA_SUCCESS:
      return {
        ...state,
        requests: { ...state.requests, loading: false, data: action.payload.data }
      };
    case GET_PON_REQUESTS_DATA_FAILURE:
      return {
        ...state,
        requests: { ...state.requests, loading: false, error: action.payload.error }
      };
    case SET_PON_REQUESTS_DATA_PARAMS:
      return {
        ...state,
        requests: {
          ...state.requests,
          params: { ...state.requests.params, ...action.payload.params }
        }
      };
    case CLEAR_PON_REQUESTS:
      return {
        ...state,
        requests: {
          ...state.requests,
          loading: false,
          params: { page: 1, size: 25 },
          data: null,
          error: null
        }
      };

    case GET_PON_REQUEST_TKO_STARTED:
      return {
        ...state,
        requestTko: { ...state.requestTko, loading: true, error: null, notFound: false }
      };
    case GET_PON_REQUEST_TKO_SUCCESS:
      return {
        ...state,
        requestTko: { ...state.requestTko, loading: false, data: action.payload.data }
      };
    case GET_PON_REQUEST_TKO_FAILURE:
      return {
        ...state,
        requestTko: {
          ...state.requestTko,
          loading: false,
          error: action.payload.error,
          notFound: action.payload.error?.response?.status === 404
        }
      };
    case CLEAR_PON_REQUEST_TKO:
      return {
        ...state,
        requestTko: {
          ...state.requestTko,
          loading: false,
          data: null,
          notFound: false,
          error: null
        }
      };
    case CLEAR_PON_REQUEST_TKO_LOADING:
      return {
        ...state,
        requestTko: { ...state.requestTko, loading: false }
      };

    case GET_PON_INFORMING_LIST_STARTED:
      return { ...state, informingList: { ...state.informingList, loading: true, data: null } };
    case GET_PON_INFORMING_LIST_SUCCESS:
      return {
        ...state,
        informingList: { ...state.informingList, loading: false, data: action.payload.data }
      };
    case GET_PON_INFORMING_LIST_FAILURE:
      return { ...state, informingList: { ...state.informingList, loading: false } };
    case SET_PON_INFORMING_LIST_PARAMS:
      return { ...state, informingList: { ...state.informingList, params: action.payload.data } };
    case CLEAR_PON_INFORMING_LIST:
      return {
        ...state,
        informingList: { loading: false, data: null, params: { page: 1, size: 25 } }
      };

    case GET_PON_REQUEST_DKO_DETAILS_STARTED:
      return { ...state, requestDkoResults: { ...state.requestDkoResults, loading: true } };
    case GET_PON_REQUEST_DKO_DETAILS_SUCCESS:
      return {
        ...state,
        requestDkoResults: {
          ...state.requestDkoResults,
          loading: false,
          data: action.payload.data
        }
      };
    case GET_PON_REQUEST_DKO_DETAILS_FAILURE:
      return { ...state, requestDkoResults: { ...state.requestDkoResults, loading: false } };
    case CLEAR_PON_REQUEST_DKO_DETAILS:
      return { ...state, requestDkoResults: { data: [], loading: false } };

    case GET_PON_INFORMING_DETAIL_STARTED:
      return {
        ...state,
        informing: { ...state.informing, loading: true, notFound: false, error: null }
      };
    case GET_PON_INFORMING_DETAIL_SUCCESS:
      return {
        ...state,
        informing: { ...state.informing, loading: false, data: action.payload.data }
      };
    case GET_PON_INFORMING_DETAIL_FAILURE:
      return {
        ...state,
        informing: {
          ...state.informing,
          loading: false,
          error: action.payload.error,
          notFound: action.payload.error?.response?.status === 404 || action.payload.error?.response?.status === 422
        }
      };
    case CLEAR_PON_INFORMING_DETAIL:
      return { ...state, informing: { data: null, loading: false, notFound: false, error: null } };
    default:
      return state;
  }
}
