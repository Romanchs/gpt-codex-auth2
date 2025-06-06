import { mainApi } from '../../../app/mainApi';

const BASE_API = '/ms-processes-v2/api/v1/bind-accounting-point-zv';
const rolesApi = mainApi.injectEndpoints({
  endpoints: (build) => ({
    createBindAccountingPointZV: build.mutation({
      query: () => ({
        url: BASE_API,
        method: 'POST'
      }),
      transformResponse: (response) => response.uid
    }),
    updateBindAccountingPointZV: build.mutation({
      query: ({ uid, type, body }) => ({
        url: `${BASE_API}/${uid}${type}`,
        method: 'POST',
        body
      }),
      async onQueryStarted({ uid }, { dispatch, queryFulfilled }) {
        queryFulfilled.then((res) => {
          dispatch(
            mainApi.util.updateQueryData('getBindAccountingPointZV', uid, () => {
              return res.data;
            })
          );
        });
      }
    }),
    uploadBindAccountingPointZV: build.mutation({
      query: ({ uid, formData }) => ({
        url: `/ms-upload/api/v1/upload/bind-accounting-point-zv/${uid}/xlsx`,
        method: 'POST',
        body: formData
      }),
      invalidatesTags: ['FILES']
    }),
    getBindAccountingPointZV: build.query({
      query: (uid) => ({
        url: `${BASE_API}/${uid}`
      }),
      providesTags: ['FILES']
    })
  }),
  overrideExisting: false
});

export const {
  useCreateBindAccountingPointZVMutation,
  useUpdateBindAccountingPointZVMutation,
  useUploadBindAccountingPointZVMutation,
  useLazyGetBindAccountingPointZVQuery
} = rolesApi;
