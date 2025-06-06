import api from '../util/api';
import { ZV } from './types';

const getListStarted = () => ({
  type: ZV.GET_LIST_STARTED
});

const getListSuccess = (payload) => ({
  type: ZV.GET_LIST_SUCCESS,
  payload
});

const getListFailure = (error) => ({
  type: ZV.GET_LIST_FAILURE,
  payload: {
    error
  }
});

export const clearZV = () => ({ type: ZV.CLEAR });

export const zvGetList = (params) => {
  return async (dispatch) => {
    dispatch(getListStarted());
    api.zv
      .getList(params)
      .then((res) => dispatch(getListSuccess(res.data)))
      .catch((error) => dispatch(getListFailure(error)));
  };
};
