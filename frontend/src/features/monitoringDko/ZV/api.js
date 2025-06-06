import { mainApi } from '../../../app/mainApi';

const BASE_API = '/ms-ts/api/v1/monitoring/';
const rolesApi = mainApi.injectEndpoints({
  endpoints: (build) => ({
    createMDZV: build.mutation({
      query: (body) => ({
        url: BASE_API + 'zv',
        method: 'POST',
        body
      }),
      invalidatesTags: ['MONITORING_DKO_ZV_LIST']
    }),
    getListMDZV: build.query({
      query: (params) => ({
        url: BASE_API + 'zv',
        params
      }),
      providesTags: ['MONITORING_DKO_ZV_LIST']
    }),
    downloadReportMDZV: build.mutation({
      query: (body) => ({
        url: BASE_API + 'zv/create-request',
        method: 'POST',
        body
      })
    })
  }),
  overrideExisting: false
});

export const { useCreateMDZVMutation, useGetListMDZVQuery, useDownloadReportMDZVMutation } = rolesApi;
