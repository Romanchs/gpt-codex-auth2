import api from '../util/api';
import {
  CLEAR_PASSWORD_STATE,
  CREATE_OTP_FAILURE,
  CREATE_OTP_STARTED,
  CREATE_OTP_SUCCESS,
  CREATE_PASSWORD_FAILURE,
  CREATE_PASSWORD_STARTED,
  CREATE_PASSWORD_SUCCESS,
  VERIFY_PASSWORD_TOKEN_FAILURE,
  VERIFY_PASSWORD_TOKEN_SUCCESS
} from './types';

export const clearPasswordState = () => ({
  type: CLEAR_PASSWORD_STATE
});

export const verifyPasswordSuccess = (data) => ({
  type: VERIFY_PASSWORD_TOKEN_SUCCESS,
  payload: {
    data
  }
});

export const verifyPasswordFailure = (error) => ({
  type: VERIFY_PASSWORD_TOKEN_FAILURE,
  payload: {
    error
  }
});

export const verifyPassword = (token) => {
  return async (dispatch) => {
    api.passwords
      .verifyToken(token)
      .then((res) => dispatch(verifyPasswordSuccess(res.data)))
      .catch((error) => dispatch(verifyPasswordFailure(error)));
  };
};

export const createPasswordStarted = () => ({
  type: CREATE_PASSWORD_STARTED
});

export const createPasswordSuccess = (data) => ({
  type: CREATE_PASSWORD_SUCCESS,
  payload: {
    data
  }
});

export const createPasswordFailure = (error) => ({
  type: CREATE_PASSWORD_FAILURE,
  payload: {
    error
  }
});

export const createPassword = (token, data) => {
  return async (dispatch) => {
    dispatch(createPasswordStarted());
    api.passwords
      .create(token, data)
      .then((res) => dispatch(createPasswordSuccess(res.data)))
      .catch((error) => dispatch(createPasswordFailure(error)));
  };
};

export const createOtpStarted = () => ({
  type: CREATE_OTP_STARTED
});

export const createOtpSuccess = (data) => ({
  type: CREATE_OTP_SUCCESS,
  payload: {
    data
  }
});

export const createOtpFailure = (error) => ({
  type: CREATE_OTP_FAILURE,
  payload: {
    error
  }
});

export const createOtp = (token, data) => {
  return async (dispatch) => {
    dispatch(createOtpStarted());
    api.passwords
      .createOtp(token, data)
      .then((res) => dispatch(createOtpSuccess(res.data)))
      .catch((error) => dispatch(createOtpFailure(error)));
  };
};
