import {
  EOS_CREATE_FAILURE,
  EOS_CREATE_STARTED,
  EOS_CREATE_SUCCESS,
  EOS_GET_DATA_FAILURE,
  EOS_GET_DATA_STARTED,
  EOS_GET_DATA_SUCCESS,
  EOS_GET_INIT_LIST_FAILURE,
  EOS_GET_INIT_LIST_STARTED,
  EOS_GET_INIT_LIST_SUCCESS,
  EOS_SET_INIT_LIST_PARAMS
} from '../actions/types';

export default function eos(
  state = {
    init: {
      data: null,
      list: [],
      params: { page: 1, size: 25 },
      responseUid: undefined
    },
    loading: false,
    notFound: false,
    data: null,
    error: null
  },
  action
) {
  switch (action.type) {
    case EOS_GET_INIT_LIST_STARTED:
    case EOS_CREATE_STARTED:
    case EOS_GET_DATA_STARTED:
      return { ...state, loading: true, error: null };

    case EOS_GET_INIT_LIST_SUCCESS:
      return { ...state, loading: false, init: { ...state.init, list: action.payload.data } };
    case EOS_SET_INIT_LIST_PARAMS:
      return { ...state, init: { ...state.init, params: action.payload.data } };
    case EOS_CREATE_SUCCESS:
      return {
        ...state,
        loading: false,
        init: { ...state.init, responseUid: action.payload.data?.uid }
      };
    case EOS_GET_DATA_SUCCESS:
      return { ...state, loading: false, data: action.payload.data };

    case EOS_GET_INIT_LIST_FAILURE:
    case EOS_CREATE_FAILURE:
      return { ...state, loading: false, error: action.payload.error };

    case EOS_GET_DATA_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
        notFound: action.payload.error?.response?.status === 404
      };
    default:
      return state;
  }
}
