import { mainApi } from '../../app/mainApi';

const reportGrexelApi = mainApi.injectEndpoints({
  endpoints: (build) => ({
    reportGrexelDefaultData: build.query({
      query: () => `/ms-processes-v2/api/v1/report-grexel`
    }),
    reportGrexelInfo: build.query({
      query: (uid) => `/ms-processes-v2/api/v1/report-grexel/${uid}`
    }),
    reportGrexelForm: build.mutation({
      query: (body) => ({
        url: `/ms-processes-v2/api/v1/report-grexel/to-form`,
        method: 'POST',
        body
      })
    }),
    reportGrexelPublish: build.mutation({
      query: (uid) => ({
        url: `/ms-processes-v2/api/v1/report-grexel/${uid}/publish`,
        method: 'POST'
      })
    })
  }),
  overrideExisting: false
});

export const {
  useReportGrexelDefaultDataQuery,
  useReportGrexelInfoQuery,
  useReportGrexelFormMutation,
  useReportGrexelPublishMutation
} = reportGrexelApi;
