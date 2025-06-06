import {
  GET_TOKEN_BY_ESIGN_FAILURE,
  GET_TOKEN_BY_ESIGN_STARTED,
  GET_TOKEN_BY_ESIGN_SUCCESS,
  GET_TOKEN_FAILURE,
  GET_TOKEN_STARTED,
  NEED_OPT_TOKEN, SET_ACTIVE_ROLE_STARTED,
  TOKEN_UNDEFINED,
  USER_LOG_OUT,
  VERIFY_OTP_FAILURE,
  VERIFY_OTP_STARTED,
  VERIFY_OTP_SUCCESS,
  VERIFY_TOKEN_FAILURE,
  VERIFY_TOKEN_STARTED,
  VERIFY_TOKEN_SUCCESS
} from '../actions/types';

export default function user(
  state = {
    loading: true,
    authorized: false,
    userName: undefined,
    full_name: undefined,
    organizations: [],
    email: undefined,
    esign_org_required: false,
    openOtpDialog: false,
    otp_error: null,
    activeOrganization: null,
    activeRoles: [],
    error: null,
    esign_error: null,
    permissions: []
  },
  action
) {
  switch (action.type) {
    case VERIFY_TOKEN_STARTED:
    case SET_ACTIVE_ROLE_STARTED:
      return { ...state, loading: true };
    case VERIFY_TOKEN_SUCCESS:
      return {
        ...state,
        authorized: true,
        loading: false,
        esign_org_required: action.payload.esign_org_required,
        userName: action.payload.username,
        organizations: action.payload.organizations,
        email: action.payload.email,
        full_name: action.payload.full_name,
        activeOrganization: action.payload.organizations.find((org) => org.active),
        activeRoles: action.payload.organizations.find((org) => org.active).roles.filter((role) => role.active),
        permissions: action.payload.permissions,
        userUid: action.payload.uid
      };
    case VERIFY_TOKEN_FAILURE:
      return { ...state, loading: false, authorized: false };
    case TOKEN_UNDEFINED:
      return { ...state, loading: false, authorized: false };
    case GET_TOKEN_STARTED:
      return { ...state, error: null, loading: true };
    case GET_TOKEN_FAILURE:
      return { ...state, loading: false, error: action.payload.error };
    case USER_LOG_OUT:
      return {
        ...state,
        loading: false,
        authorized: false,
        userName: undefined,
        organizations: [],
        email: undefined,
        activeOrganization: null,
        activeRoles: []
      };
    case NEED_OPT_TOKEN:
      return { ...state, openOtpDialog: true, loading: false };
    case VERIFY_OTP_STARTED:
      return { ...state, otp_error: null };
    case VERIFY_OTP_SUCCESS:
      return { ...state, openOtpDialog: false };
    case VERIFY_OTP_FAILURE:
      return { ...state, otp_error: action.payload.error?.response?.data?.data };
    case GET_TOKEN_BY_ESIGN_STARTED:
      return { ...state, loading: true, esign_error: null };
    case GET_TOKEN_BY_ESIGN_SUCCESS:
      return { ...state, loading: false };
    case GET_TOKEN_BY_ESIGN_FAILURE:
      return { ...state, loading: false, esign_error: action.payload.error?.response?.data?.detail };
    default:
      return state;
  }
}
