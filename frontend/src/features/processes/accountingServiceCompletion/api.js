import { mainApi } from '../../../app/mainApi';

const TAGS = {
  PROCESS_DATA: 'PROCESS_DATA',
  PROCESS_FILES: 'PROCESS_FILES'
};

const accountingServiceCompletion = mainApi.injectEndpoints({
  endpoints: (build) => ({
    autocomplete: build.query({
      query: () => ({
        url: `/ms-processes-v2/api/v1/termination-metering-service/autocomplete`
      })
    }),
    initProcess: build.mutation({
      query: (body) => ({
        url: `/ms-processes-v2/api/v1/termination-metering-service`,
        method: 'POST',
        body
      })
    }),
    getProcess: build.query({
      query: ({ uid }) => ({
        url: `/ms-processes-v2/api/v1/termination-metering-service/${uid}`,
      }),
      providesTags: [TAGS.PROCESS_DATA]
    }),
    getProcessAps: build.query({
      query: ({ uid, params }) => ({
        url: `/ms-processes-v2/api/v1/termination-metering-service/${uid}/aps`,
        params
      }),
      providesTags: [TAGS.PROCESS_DATA, TAGS.PROCESS_FILES]
    }),
    cancelProcess: build.mutation({
      query: (uid) => ({
        url: `/ms-processes-v2/api/v1/termination-metering-service/${uid}/cancel`,
        method: 'POST'
      }),
      invalidatesTags: [TAGS.PROCESS_DATA]
    }),
    formProcess: build.mutation({
      query: ({ uid, body }) => ({
        url: `/ms-processes-v2/api/v1/termination-metering-service/${uid}/form`,
        method: 'POST',
        body
      }),
      invalidatesTags: [TAGS.PROCESS_DATA, TAGS.PROCESS_FILES]
    }),
    uploadTkoFile: build.mutation({
      query: ({ uid, file }) => ({
        url: `/ms-processes-v2/api/v1/termination-metering-service/${uid}/upload`,
        method: 'POST',
        body: file
      }),
      invalidatesTags: [TAGS.PROCESS_DATA, TAGS.PROCESS_FILES]
    }),
    getUploadedTkoFiles: build.query({
      query: ({ uid, params }) => ({
        url: `/ms-processes-v2/api/v1/termination-metering-service/${uid}/uploaded_files`,
        params
      }),
      providesTags: [TAGS.PROCESS_FILES]
    }),
    getSubProcesses: build.query({
      query: ({ uid, params }) => ({
        url: `/ms-processes-v2/api/v1/termination-metering-service/${uid}/subprocesses`,
        params
      }),
      providesTags: [TAGS.PROCESS_DATA]
    }),
    deleteTkoPoint: build.mutation({
      query: ({ processUid, tkoUid }) => ({
        url: `/ms-processes-v2/api/v1/termination-metering-service/${processUid}/delete-point/${tkoUid}`,
        method: 'DELETE'
      }),
      invalidatesTags: [TAGS.PROCESS_DATA, TAGS.PROCESS_FILES]
    }),
    deleteAllTkoPoint: build.mutation({
      query: (processUid) => ({
        url: `/ms-processes-v2/api/v1/termination-metering-service/${processUid}/delete-all-points`,
        method: 'DELETE'
      }),
      invalidatesTags: [TAGS.PROCESS_DATA, TAGS.PROCESS_FILES]
    })
  })
});

export const {
  useAutocompleteQuery,
  useInitProcessMutation,
  useGetProcessQuery,
  useGetProcessApsQuery,
  useCancelProcessMutation,
  useFormProcessMutation,
  useUploadTkoFileMutation,
  useGetUploadedTkoFilesQuery,
  useGetSubProcessesQuery,
  useDeleteTkoPointMutation,
  useDeleteAllTkoPointMutation
} = accountingServiceCompletion;
