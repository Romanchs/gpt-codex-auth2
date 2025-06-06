import { mainApi } from '../../../app/mainApi';

const ENTERING_AP_API = '/ms-processes-v2/api/v1/entering-ap';
const api = mainApi.injectEndpoints({
  endpoints: (build) => ({
    initEnteringAp: build.mutation({
      query: (body) => ({
        url: ENTERING_AP_API,
        method: 'POST',
        body
      })
    }),
    detailsEnteringAp: build.query({
      query: ({ uid, params }) => ({
        url: ENTERING_AP_API + '/' + uid,
        params
      }),
      providesTags: ['ENTERING_AP_DETAILS']
    }),
    filesEnteringAp: build.query({
      query: ({ uid, params }) => ({
        url: `${ENTERING_AP_API}/${uid}/files`,
        params
      }),
      providesTags: ['ENTERING_AP_FILES']
    }),
    updateEnteringAp: build.mutation({
      query: ({ uid, type, body }) => ({
        url: `${ENTERING_AP_API}/${uid}${type}`,
        method: 'POST',
        body
      }),
      invalidatesTags: ['ENTERING_AP_DETAILS', 'ENTERING_AP_FILES']
    })
  }),
  overrideExisting: false
});

export const {
  useInitEnteringApMutation,
  useDetailsEnteringApQuery,
  useFilesEnteringApQuery,
  useUpdateEnteringApMutation
} = api;
