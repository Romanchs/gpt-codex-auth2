import IconButton from '@material-ui/core/IconButton';
import HighlightOffRounded from '@mui/icons-material/HighlightOffRounded';

import { closeSnackbar, enqueueSnackbar } from '../actions/notistackActions';
import { logOut } from '../actions/userActions';
import i18n from '../i18n/i18n';
import { openSecurityDialog } from '../services/securityHandler/slice';

export default function apiToolkitMiddleware({ dispatch }) {
  return (next) => async (action) => {
    if (typeof action?.payload?.data === 'string' && action?.payload?.data?.toLowerCase()?.includes('<html>')) {
      dispatch(openSecurityDialog(action.payload?.data));
      next(action);
      return;
    }
    if (action?.type?.endsWith('rejected') && !action?.meta?.condition) {
      if (action.payload?.status === 401) {
        dispatch(logOut());
        if (action.payload.data?.detail === 'Given token not valid for any token type') {
          return;
        }
      }

      if (
        action.payload?.status !== 400 ||
        (action.payload?.status === 400 && (action.payload?.data?.detail || action.payload?.data?.details))
      ) {
        const getMessage = async () => {
          if (action.payload?.responseType === 'blob' && action.payload?.status !== 500) {
            let responseObj = await action.payload?.data?.text();
            responseObj = JSON.parse(responseObj);
            console.error('error3 => ', action);
            return (
              responseObj?.detail?.error_msg ||
              responseObj?.detail ||
              responseObj?.details ||
              `${i18n.t('VERIFY_MSG.SOMETHING_WENT_WRONG')}...`
            );
          }
          if (
            typeof action.payload?.data?.detail?.error_msg === 'string' ||
            typeof action.payload?.data?.detail === 'string' ||
            (action.payload?.data?.detail?.length && typeof action.payload?.data?.detail[0] === 'string')
          ) {
            return action.payload?.data?.detail?.error_msg || action.payload?.data?.detail;
          }
          if (
            typeof action.payload?.data?.details?.error_msg === 'string' ||
            typeof action.payload?.data?.details === 'string' ||
            (action.payload?.data?.details?.length && typeof action.payload?.data?.details[0] === 'string')
          ) {
            return action.payload?.data?.details?.error_msg || action.payload?.data?.details;
          }
          if (action.payload?.status >= 500) {
            return i18n.t('VERIFY_MSG.SERVER_IS_NOT_RESPONDING');
          }
          if (action.payload?.error?.message === 'Network Error') {
            return i18n.t('VERIFY_MSG.NETWORK_ERROR');
          }
          console.error('error4 => ', action);
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
