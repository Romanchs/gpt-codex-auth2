import { mainApi } from '../../../app/mainApi';

const erpReportTko = mainApi.injectEndpoints({
  endpoints: (build) => ({
    erpReport: build.query({
      query: (uid) => ({
        url: `/ms-processes-v2/api/v1/report-erp/${uid}`
      }),
      providesTags: ['ERP_REPORT']
    }),
    erpReportFiles: build.query({
      query: (uid) => ({
        url: `/ms-processes-v2/api/v1/report-erp/${uid}/uploaded_files`
      }),
      providesTags: ['ERP_REPORT_FILES']
    }),
    takeToWorkErp: build.mutation({
      query: (body) => ({
        url: `/ms-processes-v2/api/v1/report-erp`,
        method: 'POST',
        body: body
      }),
      invalidatesTags: ['ACTIVATE_DEACTIVATE_DETAILS', 'UPLOADED_TKO']
    }),
    formedErp: build.mutation({
      query: (uid) => ({
        url: `/ms-processes-v2/api/v1/report-erp/${uid}/formed`,
        method: 'POST'
      }),
      invalidatesTags: ['ERP_REPORT']
    }),
    uploadErpFile: build.mutation({
      query: ({ uid, data }) => ({
        url: `/ms-upload/api/v1/upload_erp_report/${uid}/xlsx`,
        method: 'POST',
        body: data
      }),
      invalidatesTags: ['ERP_REPORT_FILES', 'ERP_REPORT']
    })
  }),
  overrideExisting: false
});

export const {
  useErpReportQuery,
  useErpReportFilesQuery,
  useTakeToWorkErpMutation,
  useFormedErpMutation,
  useUploadErpFileMutation
} = erpReportTko;
