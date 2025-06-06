import { mainApi } from '../../../../app/mainApi';

const TAG = 'UNARCHIVING_TKO';

const unArchiningTkoApi = mainApi.injectEndpoints({
  endpoints: (build) => ({
    createUnArchiningTko: build.mutation({
      query: ({ body }) => ({
        url: `/ms-processes-v2/api/v1/unarchive-ap`,
        method: 'POST',
        body
      })
    }),
    uploadUnArchiveBasisDocument: build.mutation({
      query: ({ formData, uid }) => ({
        url: `/ms-processes-v2/api/v1/unarchive-ap/${uid}/upload-documents`,
        method: 'POST',
        body: formData
      }),
      invalidatesTags: ['ARCHIVING_TKO']
    }),
    unArchiningTko: build.query({
      query: (uid) => `/ms-processes-v2/api/v1/unarchive-ap/${uid}`,
      providesTags: [TAG]
    }),
    cancelUnArchiveTko: build.mutation({
      query: (uid) => ({
        url: `/ms-processes-v2/api/v1/unarchive-ap/${uid}/cancel`,
        method: 'POST'
      }),
      invalidatesTags: [TAG]
    }),
    uploadUnArchiveTko: build.mutation({
      query: ({ uid, body }) => ({
        url: `/ms-processes-v2/api/v1/unarchive-ap/${uid}/upload`,
        method: 'POST',
        body
      }),
      invalidatesTags: [TAG]
    }),
    formUnArchiveTko: build.mutation({
      query: (uid) => ({
        url: `/ms-processes-v2/api/v1/unarchive-ap/${uid}/form`,
        method: 'POST'
      }),
      invalidatesTags: [TAG]
    }),
  }),
  overrideExisting: false
});

export const {
  useCreateUnArchiningTkoMutation,
  useUploadUnArchiveBasisDocumentMutation,
  useUnArchiningTkoQuery,
  useCancelUnArchiveTkoMutation,
  useUploadUnArchiveTkoMutation,
  useFormUnArchiveTkoMutation
} = unArchiningTkoApi;
