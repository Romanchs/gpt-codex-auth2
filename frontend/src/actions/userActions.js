import jwt_decode from 'jwt-decode';

import { saveTokens } from '../services/auth';
import api from '../util/api';
import { getEnv } from '../util/getEnv';
import {
  GET_TOKEN_BY_ESIGN_FAILURE,
  GET_TOKEN_BY_ESIGN_STARTED,
  GET_TOKEN_BY_ESIGN_SUCCESS,
  GET_TOKEN_FAILURE,
  GET_TOKEN_STARTED,
  GET_TOKEN_SUCCESS,
  NEED_OPT_TOKEN,
  SET_ACTIVE_ROLE_FAILURE,
  SET_ACTIVE_ROLE_STARTED,
  TOKEN_UNDEFINED,
  USER_LOG_OUT,
  VERIFY_OTP_FAILURE,
  VERIFY_OTP_STARTED,
  VERIFY_OTP_SUCCESS,
  VERIFY_TOKEN_FAILURE,
  VERIFY_TOKEN_STARTED,
  VERIFY_TOKEN_SUCCESS
} from './types';
import { mainApi } from '../app/mainApi';
import { store } from '../store/store';
import { clearLocalStorage } from '../util/helpers';
import { sockets } from '../app/sockets';
import { actionLog } from '../features/actionsLog/api';
import i18n from 'i18next';
import { getFeature } from '../util/getFeature';

export const getTokenStarted = () => ({
  type: GET_TOKEN_STARTED
});

export const getTokenSuccess = (data) => ({
  type: GET_TOKEN_SUCCESS,
  payload: {
    data
  }
});

export const getTokenFailure = (error) => ({
  type: GET_TOKEN_FAILURE,
  payload: {
    error
  }
});

export const getToken = (form) => {
  return async (dispatch) => {
    dispatch(getTokenStarted());
    api.user
      .getTokens(form)
      .then((res) => {
        saveTokens(res.data);
        if (jwt_decode(res.data?.access)?.otp_required) {
          dispatch(needOtpToken());
        } else {
          dispatch(getTokenSuccess(res.data));
          dispatch(verifyToken());
        }
        dispatch(
          actionLog.endpoints.sendEvent.initiate({
            user: jwt_decode(res.data?.access).user_id,
            action: 'Авторизація',
            source: 'tko-frontend',
            tags: []
          })
        );
      })
      .catch((err) => {
        dispatch(getTokenFailure(err));
      });
  };
};

export const getTokenByEsignStarted = () => ({
  type: GET_TOKEN_BY_ESIGN_STARTED
});

export const getTokenByEsignSuccess = (data) => ({
  type: GET_TOKEN_BY_ESIGN_SUCCESS,
  payload: {
    data
  }
});

export const getTokenByEsignFailure = (error) => ({
  type: GET_TOKEN_BY_ESIGN_FAILURE,
  payload: {
    error
  }
});

export const getTokenByEsign = (code, state, navigate) => {
  return async (dispatch) => {
    dispatch(getTokenByEsignStarted());
    api.user
      .getTokenByEsign({ code, state, lang: localStorage.getItem('lang') || 'ua' })
      .then((res) => {
        if (jwt_decode(res.data?.access)?.temp === 1) {
          window.open(
            `https://suppliers${getEnv().env === 'prod' ? '.' : '-'}${window.location.host}/${res.data?.access}`,
            '_self'
          );
        } else if (jwt_decode(res.data?.access)?.temp_ppko === 1) {
          window.open(
            `https://public${getEnv().env === 'prod' ? '.' : '-'}${window.location.host}/${res.data?.access}`,
            '_self'
          );
        } else {
          saveTokens(res.data);
          dispatch(getTokenByEsignSuccess(res.data));
          if (jwt_decode(res.data?.access)?.otp_required) {
            dispatch(needOtpToken());
          } else {
            dispatch(
              verifyToken(() => {
                const state = store.getState();
                if (
                  Boolean(
                    Object.values(state.mainApi.queries).find((i) => i.endpointName === 'isActiveMaintenance').data
                  ) &&
                  verifyToken(['АКО_Процеси'])
                ) {
                  navigate('/tech');
                }
              })
            );
          }
        }
      })
      .catch((error) => dispatch(getTokenByEsignFailure(error)));
  };
};

const needOtpToken = () => ({
  type: NEED_OPT_TOKEN
});

export const verifyOtpStarted = () => ({
  type: VERIFY_OTP_STARTED
});

export const verifyOtpSuccess = () => ({
  type: VERIFY_OTP_SUCCESS
});

export const verifyOtpFailure = (error) => ({
  type: VERIFY_OTP_FAILURE,
  payload: {
    error
  }
});

export const verifyOtp = (data) => {
  return async (dispatch) => {
    dispatch(verifyOtpStarted());
    api.user
      .verifyOtp(data)
      .then((res) => {
        dispatch(verifyOtpSuccess(res.data));
        dispatch(verifyToken());
      })
      .catch((error) => dispatch(verifyOtpFailure(error)));
  };
};

// VERIFY

export const verifyTokenStarted = () => ({
  type: VERIFY_TOKEN_STARTED
});

export const verifyTokenSuccess = (payload) => ({
  type: VERIFY_TOKEN_SUCCESS,
  payload
});

export const verifyTokenFailure = (error) => ({
  type: VERIFY_TOKEN_FAILURE,
  payload: {
    error
  }
});

export const tokenUndefined = () => ({
  type: TOKEN_UNDEFINED
});

export const verifyToken = (onRes) => {
  return async (dispatch) => {
    dispatch(verifyTokenStarted());
    api.user
      .verifyToken()
      .then((res) => {
        onRes && onRes(res);
        dispatch(verifyTokenSuccess(res.data));
        if (res?.data?.uid) {
          sockets.authorize(res.data.uid);
          if (getFeature('localization')) {
            localStorage.setItem('lang', res.data.language);
            if (i18n.language !== res.data.language) {
              i18n.changeLanguage(res.data.language);
            }
          }
        }
      })
      .catch((err) => {
        dispatch(verifyTokenFailure(err));
      });
  };
};

export const logOut = () => {
  clearLocalStorage();
  setTimeout(() => {
    store.dispatch(mainApi.util.resetApiState());
    sockets.logOut();
  }, 0);
  return { type: USER_LOG_OUT };
};

export const setActiveRoleStarted = () => ({
  type: SET_ACTIVE_ROLE_STARTED
});

export const setActiveRoleFailure = (error) => ({
  type: SET_ACTIVE_ROLE_FAILURE,
  payload: {
    error
  }
});

export const setActiveRole = (data) => {
  return async (dispatch) => {
    dispatch(setActiveRoleStarted());
    api.user
      .setActiveRole(data)
      .then((res) => {
        if (res?.status === 200) window.location.reload();
      })
      .catch((error) => dispatch(setActiveRoleFailure(error)));
  };
};
