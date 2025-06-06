import { mainApi } from '../../../app/mainApi';

const BASE_API = '/ms-processes-v2/api/v1/request-correction-ts';
const api = mainApi.injectEndpoints({
  endpoints: (build) => ({
    requestCorrectionTS: build.query({
      query: ({ uid, params }) => ({
        url: BASE_API + '/' + uid,
        params
      }),
      providesTags: ['REQUEST_CORRECTION_TS']
    }),
    updateRequestCorrectionTS: build.mutation({
      query: ({ uid, type, body }) => ({
        url: `${BASE_API}/${uid}${type}`,
        method: 'POST',
        body
      }),
      invalidatesTags: ['REQUEST_CORRECTION_TS']
    }),
    requestCorrectionTSReasons: build.query({
      query: () => ({
        url: BASE_API + '/reject-reasons/'
      })
    })
  }),
  overrideExisting: false
});

export const { useRequestCorrectionTSQuery, useUpdateRequestCorrectionTSMutation, useRequestCorrectionTSReasonsQuery } =
  api;
