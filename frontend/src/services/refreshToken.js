import { getAccessToken, getRefreshToken, saveTokens } from './auth';
import { logOut } from '../actions/userActions';
import axios from 'axios';
import { getEnv } from '../util/getEnv';
import { store } from '../store/store';
import jwt_decode from 'jwt-decode';
import moment from 'moment/moment';

export const REFRESH_TOKEN_DELAY = 3;
let isRefreshing = false;
let pendingRequests = [];

export const refreshToken = async () => {
  const access = getAccessToken();
  const refresh = getRefreshToken();
  if (!access || !refresh) {
    return null;
  }
  const accessTokenExp = jwt_decode(access)?.exp || 0;
  const refreshTokenExp = jwt_decode(refresh)?.exp || 0;
  const now = moment().unix() + REFRESH_TOKEN_DELAY;
  if (now < accessTokenExp) {
    return access;
  }
  if (now > refreshTokenExp) {
    store.dispatch(logOut());
    return null;
  }

  if (isRefreshing) {
    return new Promise((resolve) => {
      pendingRequests.push(resolve);
    });
  }

  isRefreshing = true;

  try {
    const response = await axios.post(getEnv().baseUrl + '/ms-users/api/v1/token/refresh/', { refresh: getRefreshToken() });
    if (response?.data?.access && response?.data?.refresh) {
      saveTokens(response.data);
      pendingRequests.forEach(callback => callback(response.data.access));
      pendingRequests = [];
      return response.data.access;
    } else {
      store.dispatch(logOut());
    }
  } catch (error) {
    console.log('Error refreshing token:', error);
    store.dispatch(logOut());
  } finally {
    isRefreshing = false;
  }
}