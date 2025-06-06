import { mainApi } from '../../../app/mainApi';

const BASE_API = '/ms-processes-v2/api/v1/create-tko';
const api = mainApi.injectEndpoints({
  endpoints: (build) => ({
    initCreateTKO: build.mutation({
      query: () => ({
        url: BASE_API,
        method: 'POST'
      })
    }),
    updateCreateTKO: build.mutation({
      query: ({ uid, type }) => ({
        url: `${BASE_API}/${uid}${type}`,
        method: 'POST'
      }),
      invalidatesTags: ['CREATE_TKO']
    }),
    uploadCreateTKO: build.mutation({
      query: ({ uid, formData }) => ({
        url: `/ms-upload/api/v1/upload/create-tko/${uid}/xlsx`,
        method: 'POST',
        body: formData
      }),
      invalidatesTags: ['CREATE_TKO']
    }),
    getCreateTKO: build.query({
      query: ({ uid, params }) => ({
        url: BASE_API + '/' + uid,
        params
      }),
      providesTags: ['CREATE_TKO']
    })
  }),
  overrideExisting: false
});

export const {
  useInitCreateTKOMutation,
  useUpdateCreateTKOMutation,
  useUploadCreateTKOMutation,
  useGetCreateTKOQuery
} = api;
