import { enqueueSnackbar } from '../../../actions/notistackActions';
import { mainApi } from '../../../app/mainApi';
import i18n from '../../../i18n/i18n';

const BASE_API = '/ms-accounting/api/v1';
const pmApi = mainApi.injectEndpoints({
  endpoints: (build) => ({
    getListPM: build.query({
      query: ({ uid, params }) => ({
        url: `${BASE_API}/processes/` + (uid ? `${uid}/` : ''),
        params
      }),
      transformResponse: (response) => {
        if (!Array.isArray(response.data) && response.data?.status === 'DONE') {
          enqueueSnackbar({
            message: i18n.t('NOTIFICATIONS.FORMING_IN_GROUP_A_IS_DONE'),
            options: {
              key: new Date().getTime() + Math.random(),
              variant: 'success',
              autoHideDuration: 5000
            }
          });
        }
        return response;
      },
      providesTags: ['PROCESS_MANAGER_REGISTER_LIST']
    }),
    getRequestsSettingsPM: build.query({
      query: () => ({
        url: `${BASE_API}/requests-settings/process-list/`
      })
    }),
    getFilesPM: build.query({
      query: ({ uid, params }) => ({
        url: `${BASE_API}/mms/${uid}/files/`,
        params
      })
    }),
    resendToMMSPM: build.query({
      query: ({ uid, file_uid }) => ({
        url: `${BASE_API}/mms/${uid}/files/${file_uid}/resend/`,
        method: 'POST'
      })
    })
  }),
  overrideExisting: false
});

export const { useGetRequestsSettingsPMQuery, useGetListPMQuery, useGetFilesPMQuery, useLazyResendToMMSPMQuery } =
  pmApi;
