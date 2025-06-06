import {mainApi} from "../../../app/mainApi";

const mmsApi = mainApi.injectEndpoints({
  endpoints: (build) => ({
    uploadZVforAKO: build.query({
      query: (params) => ({
        url: `/ms-mms/api/v1/mms/history/info`,
        params
      }),
      providesTags: ['GET_UPLOAD_ZV']
    }),
    uploadDkoFile: build.mutation({
        query: (body) => ({
          url: `/ms-mms/api/v1/mms/history/upload/xlsx`,
          method: 'POST',
          body
        }),
        invalidatesTags: ['GET_UPLOAD_ZV']
      })
  }),
  overrideExisting: false
})

export const {
  useUploadZVforAKOQuery,
  useUploadDkoFileMutation
} = mmsApi;
