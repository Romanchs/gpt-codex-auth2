import { mainApi } from '../../../app/mainApi';

const BASE_API = '/ms-ts/api/v1/monitoring/';
const rolesApi = mainApi.injectEndpoints({
  endpoints: (build) => ({
    createMDZ: build.mutation({
      query: (body) => ({
        url: BASE_API + 'z',
        method: 'POST',
        body
      }),
      invalidatesTags: ['MONITORING_DKO_Z_LIST']
    }),
    getListMDZ: build.query({
      query: (params) => ({
        url: BASE_API + 'z',
        params
      }),
      providesTags: ['MONITORING_DKO_Z_LIST']
    }),
    downloadReportMDZ: build.mutation({
      query: (body) => ({
        url: BASE_API + 'z/create-request',
        method: 'POST',
        body
      })
    })
  }),
  overrideExisting: false
});

export const { useCreateMDZMutation, useGetListMDZQuery, useDownloadReportMDZMutation } = rolesApi;
