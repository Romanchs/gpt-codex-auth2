import IconButton from '@material-ui/core/IconButton';
import HighlightOffRounded from '@mui/icons-material/HighlightOffRounded';

import { closeSnackbar, enqueueSnackbar } from '../actions/notistackActions';
import { logOut } from '../actions/userActions';
import i18n from '../i18n/i18n';

export default function apiMiddleware({ dispatch }) {
  return (next) => async (action) => {
    if (action?.type?.endsWith('FAILURE')) {
      if (action.payload.error?.response?.status === 401) {
        dispatch(logOut());
        if (action.payload.error.response?.data?.detail === 'Given token not valid for any token type') {
          return;
        }
      }
      if (
        action.payload.error?.response?.status !== 400 ||
        (action.payload.error?.response?.status === 400 &&
          (action.payload?.error.response?.data?.detail ||
            action.payload?.error.response?.data?.details ||
            action.payload?.error?.request?.responseType === 'blob'))
      ) {
        const getMessage = async () => {
          if (
            action.payload?.error?.request?.responseType === 'blob' &&
            action.payload.error?.response?.status !== 500
          ) {
            let responseObj = await action.payload?.error?.response?.data?.text();
            responseObj = JSON.parse(responseObj);
            console.error('error1 => ', action);
            return (
              responseObj?.detail?.error_msg ||
              responseObj?.detail ||
              responseObj?.details ||
              `${i18n.t('VERIFY_MSG.SOMETHING_WENT_WRONG')}...`
            );
          }

          if (
            typeof action.payload?.error?.response?.data?.detail?.error_msg === 'string' ||
            typeof action.payload?.error?.response?.data?.detail === 'string' ||
            (action.payload?.error?.response?.data?.detail?.length &&
              typeof action.payload?.error?.response?.data?.detail[0] === 'string')
          ) {
            return (
              action.payload?.error.response?.data?.detail?.error_msg || action.payload?.error.response?.data?.detail
            );
          }
          if (
            typeof action.payload?.error?.response?.data?.details?.error_msg === 'string' ||
            typeof action.payload?.error?.response?.data?.details === 'string' ||
            (action.payload?.error?.response?.data?.details?.length &&
              typeof action.payload?.error?.response?.data?.details[0] === 'string')
          ) {
            return (
              action.payload?.error?.response?.data?.details?.error_msg ||
              action.payload?.error?.response?.data?.details
            );
          }
          if (action.payload?.error?.response?.status >= 500) {
            return i18n.t('VERIFY_MSG.SERVER_IS_NOT_RESPONDING');
          }
          if (action.payload?.error?.message === 'Network Error') {
            return i18n.t('VERIFY_MSG.NETWORK_ERROR');
          }
          console.error('error2 => ', action);
          return `${i18n.t('VERIFY_MSG.SOMETHING_WENT_WRONG')}...`;
        };
        const key = new Date().getTime() + Math.random();
        dispatch(
          enqueueSnackbar({
            message: await getMessage(),
            options: {
              key: key,
              variant: 'error',
              disableWindowBlurListener: true,
              autoHideDuration: 15000,
              action: (key) => (
                <IconButton size={'small'} onClick={() => dispatch(closeSnackbar(key))} data-marker={'closeSnackbar'}>
                  <HighlightOffRounded style={{ color: '#fff' }} />
                </IconButton>
              )
            }
          })
        );
      }
    }
    next(action);
  };
}
