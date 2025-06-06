import { mainApi } from '../../../app/mainApi';

const BASE_API = '/ms-processes-v2/api/v1/request-archiving-ts';
const api = mainApi.injectEndpoints({
  endpoints: (build) => ({
    updateRequestArchivingTS: build.mutation({
      query: ({ uid, type, body }) => ({
        url: `${BASE_API}/${uid}${type}`,
        method: 'POST',
        body
      }),
      invalidatesTags: ['REQUEST_ARCHIVING_TS']
    }),
    requestArchivingTS: build.query({
      query: ({ uid, params }) => ({
        url: `${BASE_API}/${uid}`,
        params
      }),
      providesTags: ['REQUEST_ARCHIVING_TS']
    }),
    requestArchivingTSReasons: build.query({
      query: () => ({
        url: `${BASE_API}/reject-reasons/`
      })
    })
  }),
  overrideExisting: false
});

export const { useUpdateRequestArchivingTSMutation, useRequestArchivingTSQuery, useRequestArchivingTSReasonsQuery } =
  api;
