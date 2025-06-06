import { mainApi } from '../../../app/mainApi';

const PROCESS_NAME = 'update-ap-history';
const BASE_API = `/ms-processes-v2/api/v1/${PROCESS_NAME}`;
const rolesApi = mainApi.injectEndpoints({
  endpoints: (build) => ({
    createUpdateApHistory: build.mutation({
      query: (body) => ({
        url: BASE_API,
        method: 'POST',
        body
      }),
      transformResponse: (response) => response.uid
    }),
    updateUpdateApHistory: build.mutation({
      query: ({ uid, type }) => ({
        url: `${BASE_API}/${uid}${type}`,
        method: 'POST'
      }),
      invalidatesTags: ['UPDATE_AP_HISTORY']
    }),
    uploadUpdateApHistory: build.mutation({
      query: ({ uid, formData }) => ({
        url: `/ms-processes-v2/api/v1/${PROCESS_NAME}/${uid}/file`,
        method: 'POST',
        body: formData
      }),
      invalidatesTags: ['UPDATE_AP_HISTORY']
    }),
    updateApHistory: build.query({
      query: (uid) => ({
        url: `${BASE_API}${uid}`
      }),
      providesTags: ['UPDATE_AP_HISTORY']
    }),
    initDataUpdateApHistory: build.query({
      query: (params) => ({
        url: BASE_API,
        params
      })
    })
  }),
  overrideExisting: false
});

export const {
  useCreateUpdateApHistoryMutation,
  useUpdateUpdateApHistoryMutation,
  useUploadUpdateApHistoryMutation,
  useUpdateApHistoryQuery,
  useInitDataUpdateApHistoryQuery
} = rolesApi;
