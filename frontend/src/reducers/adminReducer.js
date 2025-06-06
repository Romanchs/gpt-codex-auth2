import * as moment from 'moment';

import {
  CLEAR_ADMIN_ERROR,
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
  RESET_PASSWORD_SUCCESS,
  SET_ADMIN_PARAMS,
  UPDATE_API_KEY_SUCCESS,
  UPDATE_USER_BY_ID_FAILURE,
  UPDATE_USER_BY_ID_STARTED,
  UPDATE_USER_BY_ID_SUCCESS
} from '../actions/types';

export default function admin(
  state = {
    loading: false,
    params: { page: 1, size: 25 },
    allUsers: null,
    allRoles: [],
    allOrganizations: [],
    currentUser: null,
    generatedLogin: '',
    userListUpdated: false,
    error: null,
    templatesListChecked: null,
    templatesList: null
  },
  action
) {
  switch (action.type) {
    case SET_ADMIN_PARAMS:
      return { ...state, params: action.payload.params, error: null };
    case CLEAR_ADMIN_PARAMS:
      return { ...state, params: { page: 1, size: 25 }, error: null };
    case CLEAR_ADMIN_TEMPLATES:
      return { ...state, templatesList: null, templatesListChecked: null };
    case CLEAR_ADMIN_ERROR:
      return { ...state, error: null };
    case GET_ALL_USERS_STARTED:
    case GET_ALL_ROLES_STARTED:
    case GET_ALL_ORGANIZATIONS_STARTED:
      return { ...state, loading: true, userListUpdated: false };
    case GET_TEMPLATES_CHECKED_STARTED:
      return { ...state, loading: true, templatesListChecked: null };
    case CREATE_TEMPLATES_STARTED:
      return { ...state, loading: true, templatesListChecked: null };
    case GET_TEMPLATES_LIST_STARTED:
      return { ...state, loading: true, templatesList: null };
    case GET_USER_BY_ID_STARTED:
    case CREATE_USER_STARTED:
    case UPDATE_USER_BY_ID_STARTED:
      return { ...state, loading: true, error: null, userListUpdated: false };
    case GET_ALL_USERS_FAILURE:
    case GET_ALL_ROLES_FAILURE:
    case GET_ALL_ORGANIZATIONS_FAILURE:
    case GET_USER_BY_ID_FAILURE:
    case CREATE_USER_FAILURE:
    case UPDATE_USER_BY_ID_FAILURE:
    case GET_TEMPLATES_CHECKED_FAILURE:
    case GET_TEMPLATES_LIST_FAILURE:
    case CREATE_TEMPLATES_FAILURE:
      return { ...state, loading: false, error: action.payload.error };
    case GET_ALL_USERS_SUCCESS:
      return { ...state, loading: false, allUsers: action.payload.data };
    case GET_ALL_ROLES_SUCCESS:
      return { ...state, loading: false, allRoles: action.payload.data };
    case GET_ALL_ORGANIZATIONS_SUCCESS:
      return { ...state, loading: false, allOrganizations: action.payload.data };
    case GET_USER_BY_ID_SUCCESS:
      return { ...state, loading: false, currentUser: action.payload.data, userListUpdated: false };
    case CREATE_USER_SUCCESS:
    case UPDATE_USER_BY_ID_SUCCESS:
      return { ...state, loading: false, userListUpdated: true };
    case RESET_PASSWORD_SUCCESS:
      return { ...state, currentUser: { ...state.currentUser, res_pwd_req_at: moment() } };
    case UPDATE_API_KEY_SUCCESS:
      return {
        ...state,
        currentUser: { ...state.currentUser, tech_users_keys: action.payload.data.data }
      };
    case GENERATE_LOGIN_STARTED:
      return { ...state, error: null };
    case GENERATE_LOGIN_SUCCESS:
      return { ...state, generatedLogin: action.payload.data };
    case GENERATE_LOGIN_FAILURE:
      return { ...state, error: action.payload.error };
    case GET_TEMPLATES_CHECKED_SUCCESS:
      return { ...state, loading: false, templatesListChecked: action.payload.data };
    case CREATE_TEMPLATES_SUCCESS:
      return { ...state, loading: false, templatesListChecked: action.payload.data };
    case GET_TEMPLATES_LIST_SUCCESS:
      return { ...state, loading: false, templatesList: action.payload.data };
    default:
      return state;
  }
}
