import jwtDecode from 'jwt-decode';

import { getAccessToken } from '../services/auth';
import api from '../util/api';
import {
  CLEAR_ADMIN_PARAMS,
  CLEAR_ADMIN_TEMPLATES,
  CREATE_TEMPLATES_FAILURE,
  CREATE_TEMPLATES_STARTED,
  CREATE_TEMPLATES_SUCCESS,
  CREATE_USER_FAILURE,
  CREATE_USER_STARTED,
  CREATE_USER_SUCCESS,
  GENERATE_LOGIN_FAILURE,
  GENERATE_LOGIN_STARTED,
  GENERATE_LOGIN_SUCCESS,
  GET_ALL_ORGANIZATIONS_FAILURE,
  GET_ALL_ORGANIZATIONS_STARTED,
  GET_ALL_ORGANIZATIONS_SUCCESS,
  GET_ALL_ROLES_FAILURE,
  GET_ALL_ROLES_STARTED,
  GET_ALL_ROLES_SUCCESS,
  GET_ALL_USERS_FAILURE,
  GET_ALL_USERS_STARTED,
  GET_ALL_USERS_SUCCESS,
  GET_TEMPLATES_CHECKED_FAILURE,
  GET_TEMPLATES_CHECKED_STARTED,
  GET_TEMPLATES_CHECKED_SUCCESS,
  GET_TEMPLATES_LIST_FAILURE,
  GET_TEMPLATES_LIST_STARTED,
  GET_TEMPLATES_LIST_SUCCESS,
  GET_USER_BY_ID_FAILURE,
  GET_USER_BY_ID_STARTED,
  GET_USER_BY_ID_SUCCESS,
  RESET_PASSWORD_FAILURE,
  RESET_PASSWORD_STARTED,
  RESET_PASSWORD_SUCCESS,
  SET_ADMIN_PARAMS,
  UPDATE_API_KEY_FAILURE,
  UPDATE_API_KEY_SUCCESS,
  UPDATE_USER_BY_ID_FAILURE,
  UPDATE_USER_BY_ID_STARTED,
  UPDATE_USER_BY_ID_SUCCESS,
  CLEAR_ADMIN_ERROR
} from './types';
import { logOut } from './userActions';

export const getAllUsersStarted = () => ({
  type: GET_ALL_USERS_STARTED
});

export const getAllUsersSuccess = (data) => ({
  type: GET_ALL_USERS_SUCCESS,
  payload: {
    data
  }
});

export const getAllUsersFailure = (error) => ({
  type: GET_ALL_USERS_FAILURE,
  payload: {
    error
  }
});

export const getAllUsers = (params) => {
  return async (dispatch) => {
    dispatch(getAllUsersStarted());
    api.admin
      .getAllUsers(params)
      .then((res) => {
        dispatch(getAllUsersSuccess(res.data));
      })
      .catch((error) => dispatch(getAllUsersFailure(error)));
  };
};

export const setAdminParams = (params) => ({
  type: SET_ADMIN_PARAMS,
  payload: {
    params
  }
});

export const clearAdminParams = () => ({
  type: CLEAR_ADMIN_PARAMS
});

export const clearAdminTemplates = () => ({
  type: CLEAR_ADMIN_TEMPLATES
});

export const getAllRolesStarted = () => ({
  type: GET_ALL_ROLES_STARTED
});

export const getAllRolesSuccess = (data) => ({
  type: GET_ALL_ROLES_SUCCESS,
  payload: {
    data
  }
});

export const getAllRolesFailure = (error) => ({
  type: GET_ALL_ROLES_FAILURE,
  payload: {
    error
  }
});

export const getAllRoles = () => {
  return async (dispatch) => {
    dispatch(getAllRolesStarted());
    api.admin
      .getAllRoles()
      .then((res) => dispatch(getAllRolesSuccess(res.data)))
      .catch((error) => dispatch(getAllRolesFailure(error)));
  };
};

export const getAllOrganizationsStarted = () => ({
  type: GET_ALL_ORGANIZATIONS_STARTED
});

export const getAllOrganizationsSuccess = (data) => ({
  type: GET_ALL_ORGANIZATIONS_SUCCESS,
  payload: {
    data
  }
});

export const getAllOrganizationsFailure = (error) => ({
  type: GET_ALL_ORGANIZATIONS_FAILURE,
  payload: {
    error
  }
});

export const getAllOrganizations = (search) => {
  return async (dispatch) => {
    dispatch(getAllOrganizationsStarted());
    api.admin
      .getAllOrganizations({ q: search })
      .then((res) => dispatch(getAllOrganizationsSuccess(res.data)))
      .catch((error) => dispatch(getAllOrganizationsFailure(error)));
  };
};

export const createUserStarted = () => ({
  type: CREATE_USER_STARTED
});

export const createUserSuccess = (data) => ({
  type: CREATE_USER_SUCCESS,
  payload: {
    data
  }
});

export const createUserFailure = (error) => ({
  type: CREATE_USER_FAILURE,
  payload: {
    error
  }
});

export const createUser = (data) => {
  return async (dispatch) => {
    dispatch(createUserStarted());
    api.admin
      .createUser(data)
      .then((res) => dispatch(createUserSuccess(res.data)))
      .catch((error) => dispatch(createUserFailure(error)));
  };
};

export const getUserByIdStarted = () => ({
  type: GET_USER_BY_ID_STARTED
});

export const getUserByIdSuccess = (data) => ({
  type: GET_USER_BY_ID_SUCCESS,
  payload: {
    data
  }
});

export const getUserByIdFailure = (error) => ({
  type: GET_USER_BY_ID_FAILURE,
  payload: {
    error
  }
});

export const getUserById = (id) => {
  return async (dispatch) => {
    dispatch(getUserByIdStarted());
    api.admin
      .getUserById(id)
      .then((res) => dispatch(getUserByIdSuccess(res.data)))
      .catch((error) => dispatch(getUserByIdFailure(error)));
  };
};

export const updateUserByIdStarted = () => ({
  type: UPDATE_USER_BY_ID_STARTED
});

export const updateUserByIdSuccess = () => ({
  type: UPDATE_USER_BY_ID_SUCCESS
});

export const updateUserByIdFailure = (error) => ({
  type: UPDATE_USER_BY_ID_FAILURE,
  payload: {
    error
  }
});

export const updateUserById = (id, data) => {
  return async (dispatch) => {
    dispatch(updateUserByIdStarted());
    api.admin
      .updateUserById(id, data)
      .then(() => {
        dispatch(updateUserByIdSuccess());
        if (jwtDecode(getAccessToken()).user_id === id) {
          dispatch(logOut());
        } else {
          dispatch(getUserById(id));
        }
      })
      .catch((error) => dispatch(updateUserByIdFailure(error)));
  };
};

export const onArchiveUser = (userId, params) => {
  return async (dispatch) => {
    api.admin
      .updateUserById(userId, { is_active: false })
      .then(() => {
        dispatch(getAllUsers(params));
        if (jwtDecode(getAccessToken()).user_id === userId) {
          dispatch(logOut());
        }
      })
      .catch((error) => dispatch(updateUserByIdFailure(error)));
  };
};

export const resetPasswordStarted = () => ({
  type: RESET_PASSWORD_STARTED
});

export const resetPasswordSuccess = () => ({
  type: RESET_PASSWORD_SUCCESS
});

export const resetPasswordFailure = (error) => ({
  type: RESET_PASSWORD_FAILURE,
  payload: {
    error
  }
});

export const resetPassword = (id) => {
  return async (dispatch) => {
    dispatch(resetPasswordStarted());
    api.admin
      .resetPassword(id)
      .then(() => {
        dispatch(resetPasswordSuccess());
        if (jwtDecode(getAccessToken()).user_id === id) {
          dispatch(logOut());
        }
      })
      .catch((error) => dispatch(resetPasswordFailure(error)));
  };
};

export const updateApiKeySuccess = (data) => ({
  type: UPDATE_API_KEY_SUCCESS,
  payload: {
    data
  }
});

export const updateApiKeyFailure = (error) => ({
  type: UPDATE_API_KEY_FAILURE,
  payload: {
    error
  }
});

export const updateApiKey = (uid) => {
  return async (dispatch) => {
    api.admin
      .updateApiKey(uid)
      .then((res) => dispatch(updateApiKeySuccess(res.data)))
      .catch((error) => dispatch(updateApiKeyFailure(error)));
  };
};

export const generateLoginStarted = () => ({
  type: GENERATE_LOGIN_STARTED
});

export const generateLoginSuccess = (data) => ({
  type: GENERATE_LOGIN_SUCCESS,
  payload: {
    data
  }
});

export const generateLoginFailure = (error) => ({
  type: GENERATE_LOGIN_FAILURE,
  payload: {
    error
  }
});

export const generateLogin = (data) => {
  return async (dispatch) => {
    dispatch(generateLoginStarted());
    api.admin
      .generateLogin(data)
      .then((res) => dispatch(generateLoginSuccess(res.data?.username)))
      .catch((error) => dispatch(generateLoginFailure(error)));
  };
};

export const createTemplatesStarted = () => ({
  type: CREATE_TEMPLATES_STARTED
});

export const createTemplatesSuccess = (data) => ({
  type: CREATE_TEMPLATES_SUCCESS,
  payload: {
    data
  }
});

export const createTemplatesFailure = (error) => ({
  type: CREATE_TEMPLATES_FAILURE,
  payload: {
    error
  }
});

export const createTemplates = (data, uid, stateApi) => {
  return async (dispatch) => {
    const state = stateApi?.length ? api.admin.updateTemplates(data, uid) : api.admin.createTemplates(data);
    dispatch(createTemplatesStarted());
    state
      .then((res) => dispatch(createTemplatesSuccess(res.data)))
      .catch((error) => dispatch(createTemplatesFailure(error)));
  };
};

export const getTemplatesStarted = () => ({
  type: GET_TEMPLATES_CHECKED_STARTED
});

export const getTemplatesSuccess = (data) => ({
  type: GET_TEMPLATES_CHECKED_SUCCESS,
  payload: {
    data
  }
});

export const getTemplatesFailure = (error) => ({
  type: GET_TEMPLATES_CHECKED_FAILURE,
  payload: {
    error
  }
});

export const getTemplates = (uid) => {
  return async (dispatch) => {
    dispatch(getTemplatesStarted());
    api.admin
      .getTemplates(uid)
      .then((res) => dispatch(getTemplatesSuccess(res.data)))
      .catch((error) => dispatch(getTemplatesFailure(error)));
  };
};

export const getTemplatesListStarted = () => ({
  type: GET_TEMPLATES_LIST_STARTED
});

export const getTemplatesListSuccess = (data) => ({
  type: GET_TEMPLATES_LIST_SUCCESS,
  payload: {
    data
  }
});

export const getTemplatesListFailure = (error) => ({
  type: GET_TEMPLATES_LIST_FAILURE,
  payload: {
    error
  }
});

export const getTemplatesList = () => {
  return async (dispatch) => {
    dispatch(getTemplatesListStarted());
    api.admin
      .getTemplatesList()
      .then((res) => dispatch(getTemplatesListSuccess(res.data)))
      .catch((error) => dispatch(getTemplatesListFailure(error)));
  };
};

export const clearAdminError = () => ({
  type: CLEAR_ADMIN_ERROR
});
