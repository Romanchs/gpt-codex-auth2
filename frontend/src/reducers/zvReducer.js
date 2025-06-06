import { ZV } from '../actions/types';

export default function zv(
  state = {
    loading: false,
    data: null,
    error: null
  },
  { type, payload }
) {
  switch (type) {
    case ZV.GET_LIST_STARTED:
      return { ...state, loading: true };
    case ZV.GET_LIST_SUCCESS:
      return { ...state, loading: false, data: payload };
    case ZV.GET_LIST_FAILURE:
      return { ...state, loading: false, error: payload.error?.response };
    case ZV.CLEAR:
      return {
        loading: false,
        data: null,
        error: null
      };
    default:
      return state;
  }
}
