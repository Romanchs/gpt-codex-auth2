import { mainApi } from '../../../app/mainApi';

const BASE_API = '/ms-processes-v2/api/v1/transfer-ts-to-grexel';

const transferTsToGrexelApi = mainApi.injectEndpoints({
  endpoints: (build) => ({
    transferTsToGrexelVersions: build.query({
      query: (params) => {
        return { 
          url: `${BASE_API}/ts-versions/`,
          params
         };
      },
      transformResponse: (response) => response?.map(v => ({label: v, value: (v).toString()}))
    }),
    createTransferTsToGrexel: build.mutation({
      query: (body) => ({
        url: BASE_API,
        method: 'POST',
        body
      }),
      transformResponse: (response) => response.uid
    }),
    transferTsToGrexel: build.query({
      query: (uid) => `${BASE_API}/${uid}`,
      providesTags: ['TRANSFER_TS_TO_GREXEL']
    }),
    updateTransferTsToGrexel: build.mutation({
      query: ({ uid, type, body, params }) => ({
        url: `${BASE_API}/${uid}/${type}`,
        method: 'POST',
        body,
        params
      }),
      async onQueryStarted({uid}, {dispatch, queryFulfilled}) {
        try {
          const res = await queryFulfilled;
          if (res?.meta?.response.ok) {
            dispatch(mainApi.util.updateQueryData('transferTsToGrexel', uid, () => res?.data));
          }
        } catch {
          return;
        }
      },
    }),
    sendTsVolumesToGrexel: build.query({
      query: (uid) => ({
        url: `${BASE_API}/${uid}/send-ts-volumes-to-grexel`,
      })
    }),
    uploadTransferTsToGrexelCorrectionFile: build.mutation({
      query: ({ uid, body }) => ({
        url: `ms-processes-v2/api/v1/transfer-ts-to-grexel/${uid}/upload`,
        method: 'POST',
        body
      }),
      invalidatesTags: ['TRANSFER_TS_TO_GREXEL']
    }),
  }),
  overrideExisting: false
});

export const {
  useLazyTransferTsToGrexelVersionsQuery,
  useTransferTsToGrexelQuery,
  useCreateTransferTsToGrexelMutation,
  useUpdateTransferTsToGrexelMutation,
  useLazySendTsVolumesToGrexelQuery,
  useUploadTransferTsToGrexelCorrectionFileMutation
} = transferTsToGrexelApi;
