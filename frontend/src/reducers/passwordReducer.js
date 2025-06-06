import {} from '../actions/types';
import { CLEAR_PASSWORD_STATE } from '../actions/types';
import { VERIFY_PASSWORD_TOKEN_SUCCESS } from '../actions/types';
import { VERIFY_PASSWORD_TOKEN_FAILURE } from '../actions/types';
import { CREATE_PASSWORD_STARTED } from '../actions/types';
import { CREATE_PASSWORD_SUCCESS } from '../actions/types';
import { CREATE_PASSWORD_FAILURE } from '../actions/types';
import { CREATE_OTP_STARTED } from '../actions/types';
import { CREATE_OTP_SUCCESS } from '../actions/types';
import { CREATE_OTP_FAILURE } from '../actions/types';

export default function passwords(
  state = {
    loading: true,
    tokenInvalid: false,
    qr_uri: null,
    creating: false,
    creatingSuccess: false,
    otp_error: false,
    error: null
  },
  action
) {
  switch (action.type) {
    case CLEAR_PASSWORD_STATE:
      return {
        loading: true,
        tokenInvalid: false,
        qr_uri: null,
        creating: false,
        creatingSuccess: false,
        otp_error: false,
        error: null
      };
    case VERIFY_PASSWORD_TOKEN_SUCCESS:
      return {
        ...state,
        qr_uri: action.payload.data?.qr_uri,
        loading: false,
        tokenInvalid: false,
        creatingSuccess: false,
        creating: false
      };
    case VERIFY_PASSWORD_TOKEN_FAILURE:
      return {
        ...state,
        loading: false,
        tokenInvalid: true,
        error: action.payload.error?.response?.data
      };
    case CREATE_PASSWORD_STARTED:
      return { ...state, creating: true };
    case CREATE_PASSWORD_SUCCESS:
      return { ...state, creating: false, creatingSuccess: true };
    case CREATE_OTP_STARTED:
      return { ...state, otp_error: null };
    case CREATE_OTP_SUCCESS:
      return { ...state, qr_uri: null };
    case CREATE_OTP_FAILURE:
      return { ...state, otp_error: action.payload.error?.response?.data?.otp };
    case CREATE_PASSWORD_FAILURE:
      return { ...state, creating: false, error: action.payload.error?.response?.data };
    default:
      return state;
  }
}
