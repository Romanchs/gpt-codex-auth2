import { mainApi } from '../../../app/mainApi';

const BASE_API = '/ms-processes-v2/api/v1/export-ap-generation';
const rolesApi = mainApi.injectEndpoints({
  endpoints: (build) => ({
    createExportApGen: build.mutation({
      query: () => ({
        url: BASE_API,
        method: 'POST'
      })
    }),
    exportApGen: build.query({
      query: ({ uid, tab }) => ({
        url: `${BASE_API}/${uid}/${tab}`
      }),
      providesTags: ['EXPORT_AP_GEN']
    }),
    exportApGenUpload: build.mutation({
      query: ({ uid, formData }) => ({
        url: `/ms-upload/api/v1/upload/export-ap-generation/${uid}/xlsx`,
        method: 'POST',
        body: formData
      }),
      invalidatesTags: ['EXPORT_AP_GEN']
    }),
    updateExportApGen: build.mutation({
      query: ({ uid, type, method = 'POST' }) => ({
        url: `${BASE_API}/${uid}/${type}`,
        method
      }),
      invalidatesTags: ['EXPORT_AP_GEN']
    })
  }),
  overrideExisting: false
});

export const {
  useCreateExportApGenMutation,
  useExportApGenQuery,
  useExportApGenUploadMutation,
  useUpdateExportApGenMutation
} = rolesApi;
