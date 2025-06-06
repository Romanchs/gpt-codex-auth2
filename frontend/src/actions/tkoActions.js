import { enqueueSnackbar } from '../actions/notistackActions';
import i18n from '../i18n/i18n';
import api from '../util/api';
import { saveAsFile } from '../util/files';
import {
  DOWNLOAD_TKO_FAILURE,
  DOWNLOAD_TKO_STARTED,
  DOWNLOAD_TKO_SUCCESS,
  GET_TKO_ALL_ORGANIZATIONS_FAILURE,
  GET_TKO_ALL_ORGANIZATIONS_STARTED,
  GET_TKO_ALL_ORGANIZATIONS_SUCCESS,
  GET_TKO_BY_ID_FAILURE,
  GET_TKO_BY_ID_STARTED,
  GET_TKO_BY_ID_SUCCESS,
  SET_TKO_PARAMS
} from './types';

export const setTkoParams = (params) => ({
  type: SET_TKO_PARAMS,
  payload: {
    params
  }
});

export const getTkoByIdStarted = () => ({
  type: GET_TKO_BY_ID_STARTED
});

export const getTkoByIdSuccess = (data) => ({
  type: GET_TKO_BY_ID_SUCCESS,
  payload: {
    data
  }
});

export const getTkoByIdFailure = (error) => ({
  type: GET_TKO_BY_ID_FAILURE,
  payload: {
    error
  }
});

export const getTkoById = (id, subprocess_uid) => {
  return async (dispatch) => {
    dispatch(getTkoByIdStarted());
    api.tko
      .getTkoById(id, subprocess_uid)
      .then((res) => {
        dispatch(getTkoByIdSuccess(res.data));
      })
      .catch((err) => {
        dispatch(getTkoByIdFailure(err));
      });
  };
};

export const downloadTKOStarted = () => ({
  type: DOWNLOAD_TKO_STARTED
});

export const downloadTKOSuccess = () => ({
  type: DOWNLOAD_TKO_SUCCESS
});

export const downloadTKOFailure = (error) => ({
  type: DOWNLOAD_TKO_FAILURE,
  payload: {
    error
  }
});

export const downloadDetailsTKO = (uid, eic) => {
  return async (dispatch) => {
    dispatch(downloadTKOStarted());
    api.tko
      .downloadDetails({ uid })
      .then((res) => {
        if (res.status === 200) {
          saveAsFile(res.data, i18n.t('FILENAMES.TKO_EXTRACTION_ID', { id: eic }), res.headers['content-type'] || '');
          dispatch(downloadTKOSuccess());
          dispatch(
            enqueueSnackbar({
              message: i18n.t('NOTIFICATIONS.EXTRACTION_STARTED_WAIT_ON_PAGE'),
              options: {
                key: new Date().getTime() + Math.random(),
                variant: 'success',
                autoHideDuration: 5000
              }
            })
          );
        }
      })
      .catch((error) => dispatch(downloadTKOFailure(error)));
  };
};

export const getAllOrganizationsStarted = () => ({
  type: GET_TKO_ALL_ORGANIZATIONS_STARTED
});

export const getAllOrganizationsSuccess = (data) => ({
  type: GET_TKO_ALL_ORGANIZATIONS_SUCCESS,
  payload: {
    data
  }
});

export const getAllOrganizationsFailure = (error) => ({
  type: GET_TKO_ALL_ORGANIZATIONS_FAILURE,
  payload: {
    error
  }
});

export const getAllOrganizations = (search) => {
  return async (dispatch) => {
    dispatch(getAllOrganizationsStarted());
    api.tko
      .getAllOrganizations({ full_fields: search })
      .then((res) => dispatch(getAllOrganizationsSuccess(res.data)))
      .catch((error) => dispatch(getAllOrganizationsFailure(error)));
  };
};
