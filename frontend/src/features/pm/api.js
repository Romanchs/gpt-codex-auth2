import { enqueueSnackbar } from '../../actions/notistackActions';
import { mainApi } from '../../app/mainApi';
import i18n from '../../i18n/i18n';

const PM_API = '/ms-accounting/api/v1/process-manager';

const pmApi = mainApi.injectEndpoints({
  endpoints: (build) => ({
    getAggregation: build.query({
      query: () => ({
        url: `${PM_API}/scheduler/`
      })
    }),
    getAggregationByPeriod: build.query({
      query: (params) => ({
        url: `${PM_API}/scheduler-period/`,
        params
      })
    }),
    beginAggregation: build.query({
      query: (body) => ({
        url: `${PM_API}/run-manual/`,
        method: 'POST',
        body
      })
    }),
    sendToMMS: build.query({
      query: (body) => ({
        url: `${PM_API}/run-manual/sent-to-mms/`,
        method: 'POST',
        body
      })
    }),
    saveAggregation: build.query({
      query: (body) => ({
        url: `${PM_API}/update-scheduler/`,
        method: 'PATCH',
        body: body ?? {}
      })
    }),
    getList: build.query({
      query: (params) => ({
        url: `/ms-accounting/api/v1/processes/`,
        params
      })
    }),
    getRunningProcess: build.query({
      query: (uid) => ({
        url: `/ms-accounting/api/v1/processes/${uid}/`
      }),
      transformResponse: (response) => {
        if (response.data?.status === 'DONE') {
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
      }
    }),
    getRequestsSettings: build.query({
      query: () => ({
        url: `/ms-accounting/api/v1/requests-settings/process-list/`
      })
    }),
    getFiles: build.query({
      query: ({ uid, params }) => ({
        url: `/ms-accounting/api/v1/mms/${uid}/files/`,
        params
      }),
      providesTags: ['GET_REGISTER_FILES']
    }),
    resendToMMS: build.query({
      query: ({ uid, file_uid }) => ({
        url: `/ms-accounting/api/v1/mms/${uid}/files/${file_uid}/resend`,
        method: 'PATCH',
        body: {}
      })
    })
  }),
  overrideExisting: false
});

export const {
  useLazyGetAggregationQuery,
  useLazyGetAggregationByPeriodQuery,
  useLazyBeginAggregationQuery,
  useLazySendToMMSQuery,
  useLazySaveAggregationQuery,
  useLazyGetRequestsSettingsQuery,
  useLazyGetRunningProcessQuery,
  useLazyGetListQuery,
  useLazyGetFilesQuery,
  useLazyResendToMMSQuery
} = pmApi;
