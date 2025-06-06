import { mainApi } from '../../../app/mainApi';

const BASE_API_CHANGE_PPKO = '/ms-processes-v2/api/v1/request-change-ppko';
const BASE_API_CHANGE_PPKO_TO_OS = '/ms-processes-v2/api/v1/change-ppko-to-os/';
const BASE_API_REQUEST_CHANGE_PPKO_APPROVAL = '/ms-processes-v2/api/v1/request-change-ppko-approval/';
const api = mainApi.injectEndpoints({
  endpoints: (build) => ({
    changePPKORoles: build.query({
      query: () => ({
        url: '/ms-ppko/api/v1/ppko-active-roles/'
      })
    }),
    changePPKOAutocomplete: build.query({
      query: () => ({
        url: BASE_API_CHANGE_PPKO + '/autocomplete'
      })
    }),
    initChangePPKO: build.mutation({
      query: (body) => ({
        url: BASE_API_CHANGE_PPKO,
        method: 'POST',
        body
      })
    }),
    changePPKO: build.query({
      query: ({ uid, params }) => ({
        url: `${BASE_API_CHANGE_PPKO}/${uid}`,
        params
      }),
      providesTags: ['CHANGE_PPKO']
    }),
    changePPKOFiles: build.query({
      query: ({ uid, params }) => ({
        url: `${BASE_API_CHANGE_PPKO}/${uid}/uploaded_files`,
        params
      }),
      providesTags: ['CHANGE_PPKO_FILES']
    }),
    changePPKOSubprocesses: build.query({
      query: ({ uid, params }) => ({
        url: `${BASE_API_CHANGE_PPKO}/${uid}/subprocesses`,
        params
      })
    }),
    updateChangePPKO: build.mutation({
      query: ({ uid, type, body, method = 'POST' }) => ({
        url: `${BASE_API_CHANGE_PPKO}/${uid}${type}`,
        method,
        body
      }),
      invalidatesTags: ['CHANGE_PPKO']
    }),
    uploadChangePPKO: build.mutation({
      query: ({ uid, body }) => ({
        url: `/ms-upload/api/v1/upload/request-change-ppko-file-validation/${uid}/xlsx`,
        method: 'POST',
        body
      }),
      invalidatesTags: ['CHANGE_PPKO_FILES']
    }),
    changePPKOToOs: build.query({
      query: ({ uid, params }) => ({
        url: BASE_API_CHANGE_PPKO_TO_OS + uid,
        params
      })
    }),
    subprocessesChangePPKOToOs: build.query({
      query: (uid) => ({
        url: BASE_API_CHANGE_PPKO_TO_OS + uid + '/subprocesses'
      })
    }),
    requestChangePPKOApproval: build.query({
      query: ({ uid, params }) => ({
        url: BASE_API_REQUEST_CHANGE_PPKO_APPROVAL + uid,
        params
      }),
      providesTags: ['REQUEST_CHANGE_PPKO_APPROVAL']
    }),
    updateRequestChangePPKOApproval: build.mutation({
      query: ({ uid, type, body }) => ({
        url: BASE_API_REQUEST_CHANGE_PPKO_APPROVAL + uid + type,
        method: 'POST',
        body
      }),
      invalidatesTags: ['REQUEST_CHANGE_PPKO_APPROVAL', 'CHANGE_PPKO']
    })
  }),
  overrideExisting: false
});

export const {
  useChangePPKORolesQuery,
  useChangePPKOAutocompleteQuery,
  useInitChangePPKOMutation,
  useChangePPKOQuery,
  useLazyChangePPKOQuery,
  useChangePPKOFilesQuery,
  useChangePPKOSubprocessesQuery,
  useUpdateChangePPKOMutation,
  useUploadChangePPKOMutation,
  useChangePPKOToOsQuery,
  useSubprocessesChangePPKOToOsQuery,
  useRequestChangePPKOApprovalQuery,
  useUpdateRequestChangePPKOApprovalMutation
} = api;
