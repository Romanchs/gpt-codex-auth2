import { mainApi } from '../../../app/mainApi';

const PROCESS_NAME = 'update-aps-history';
const BASE_API = `/ms-processes-v2/api/v1/${PROCESS_NAME}`;
const api = mainApi.injectEndpoints({
  endpoints: (build) => ({
    initDataUpdateApsHistory: build.query({
      query: (params) => ({
        url: BASE_API,
        params
      })
    }),
    initUpdateApsHistory: build.mutation({
      query: (body) => ({
        url: BASE_API,
        method: 'POST',
        body
      })
    }),
    updateApsHistory: build.query({
      query: (uid) => ({
        url: BASE_API + '/' + uid
      }),
      providesTags: ['UPDATE_APS_HISTORY']
    }),
    updateUpdateApsHistory: build.mutation({
      query: ({ uid, type, body }) => ({
        url: `${BASE_API}/${uid}${type}`,
        method: 'POST',
        body
      }),
      invalidatesTags: ['UPDATE_APS_HISTORY']
    }),
    uploadDescriptionUpdateApsHistory: build.mutation({
      query: ({ uid, type, body }) => ({
        url: `${BASE_API}/${uid}${type}`,
        method: 'POST',
        body
      }),
      invalidatesTags: ['UPDATE_APS_HISTORY']
    }),
    uploadUpdateApsHistory: build.mutation({
      query: ({ uid, body }) => ({
        url: `${BASE_API}/${uid}/file`,
        method: 'POST',
        body
      }),
      invalidatesTags: ['UPDATE_APS_HISTORY']
    })
  }),
  overrideExisting: false
});

export const {
  useInitDataUpdateApsHistoryQuery,
  useInitUpdateApsHistoryMutation,
  useUpdateApsHistoryQuery,
  useUpdateUpdateApsHistoryMutation,
  useUploadUpdateApsHistoryMutation,
  useUploadDescriptionUpdateApsHistoryMutation
} = api;
