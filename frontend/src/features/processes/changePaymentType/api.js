import { mainApi } from '../../../app/mainApi';

const TAGS = {
  CHANGE_PAYMENT_TYPE: 'CHANGE_PAYMENT_TYPE',
  CHANGE_PAYMENT_TYPE_FILES: 'CHANGE_PAYMENT_TYPE_FILES'
};
const BASE_API = '/ms-processes-v2/api/v1/change-payment-type';
const api = mainApi.injectEndpoints({
  endpoints: (build) => ({
    initChangePaymentType: build.mutation({
      query: (body) => ({
        url: BASE_API,
        method: 'POST',
        body
      })
    }),
    uploadChangePaymentType: build.mutation({
      query: ({ uid, body }) => ({
        url: `${BASE_API}/${uid}/upload`,
        method: 'POST',
        body
      }),
      invalidatesTags: [TAGS.CHANGE_PAYMENT_TYPE, TAGS.CHANGE_PAYMENT_TYPE_FILES]
    }),
    updateChangePaymentType: build.mutation({
      query: ({ uid, type }) => ({
        url: `${BASE_API}/${uid}${type}`,
        method: 'POST'
      }),
      invalidatesTags: [TAGS.CHANGE_PAYMENT_TYPE]
    }),
    changePaymentType: build.query({
      query: ({ uid, params }) => ({
        url: `${BASE_API}/${uid}/aps`,
        params
      }),
      providesTags: [TAGS.CHANGE_PAYMENT_TYPE]
    }),
    filesChangePaymentType: build.query({
      query: ({ uid, params }) => ({
        url: `${BASE_API}/${uid}/files`,
        params
      }),
      providesTags: [TAGS.CHANGE_PAYMENT_TYPE_FILES]
    })
  }),
  overrideExisting: false
});

export const {
  useInitChangePaymentTypeMutation,
  useChangePaymentTypeQuery,
  useFilesChangePaymentTypeQuery,
  useUpdateChangePaymentTypeMutation,
  useUploadChangePaymentTypeMutation
} = api;
