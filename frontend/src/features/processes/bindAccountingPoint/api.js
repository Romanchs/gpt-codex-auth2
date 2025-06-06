import { mainApi } from '../../../app/mainApi';

const PROCESS_NAME = 'bind-accounting-point';
const BASE_API = `/ms-processes-v2/api/v1/${PROCESS_NAME}`;
const rolesApi = mainApi.injectEndpoints({
  endpoints: (build) => ({
    createBindAccountingPoint: build.mutation({
      query: () => ({
        url: BASE_API,
        method: 'POST'
      }),
      transformResponse: (response) => response.uid
    }),
    updateBindAccountingPoint: build.mutation({
      query: ({ uid, type }) => ({
        url: `${BASE_API}/${uid}${type}`,
        method: 'POST'
      }),
      async onQueryStarted({ uid }, { dispatch, queryFulfilled }) {
        queryFulfilled.then((res) => {
          dispatch(
            mainApi.util.updateQueryData('getBindAccountingPoint', uid, () => {
              return res.data;
            })
          );
        });
      }
    }),
    uploadBindAccountingPoint: build.mutation({
      query: ({ uid, formData }) => ({
        url: `/ms-upload/api/v1/upload/${PROCESS_NAME}/${uid}/xlsx`,
        method: 'POST',
        body: formData
      }),
      invalidatesTags: ['BIND_ACCOUNTING_POINT']
    }),
    getBindAccountingPoint: build.query({
      query: (uid) => ({
        url: `${BASE_API}/${uid}`
      }),
      providesTags: ['BIND_ACCOUNTING_POINT']
    })
  }),
  overrideExisting: false
});

export const {
  useCreateBindAccountingPointMutation,
  useUpdateBindAccountingPointMutation,
  useUploadBindAccountingPointMutation,
  useLazyGetBindAccountingPointQuery
} = rolesApi;
