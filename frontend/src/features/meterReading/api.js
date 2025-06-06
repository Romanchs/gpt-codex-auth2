import { mainApi } from '../../app/mainApi';
import { saveAsFile } from '../../util/files';

const TAGS = {
  PROCESS: 'METER_READING__PROCESS',
  UPLOADS: 'METER_READING__DATA_UPLOADS'
};

const meterReadingApi = mainApi.injectEndpoints({
  endpoints: (build) => ({
    // PROCESS
    meterReadingProcess: build.query({
      query: ({ uid, params }) => ({
        url: `/ms-processes-v2/api/v1/meter-reading-transfer-ppko/${uid}`,
        params
      }),
      providesTags: [TAGS.PROCESS]
    }),
    meterReadingProcessStart: build.mutation({
      query: (body) => ({
        url: `/ms-processes-v2/api/v1/meter-reading-transfer-ppko`,
        method: 'POST',
        body
      })
    }),
    meterReadingProcessUpload: build.mutation({
      query: ({ uid, body }) => {
        return {
          url: `/ms-processes-v2/api/v1/meter-reading-transfer-ppko/${uid}/upload-ap`,
          method: 'POST',
          body
        };
      },
      invalidatesTags: [TAGS.PROCESS]
    }),
    meterReadingProcessForm: build.mutation({
      query: (uid) => ({
        url: `/ms-processes-v2/api/v1/meter-reading-transfer-ppko/${uid}/to-form`,
        method: 'POST'
      }),
      invalidatesTags: [TAGS.PROCESS]
    }),

    // INFORMING
    meterReadingInforming: build.query({
      query: (uid) => `/ms-processes-v2/api/v1/informing-reading-transfer-ppko/${uid}`
    }),

    // VIEW
    meterData: build.query({
      query: (params) => ({
        url: '/ms-upload/api/v1/meter-data',
        params
      }),
      providesTags: [TAGS.UPLOADS]
    }),
    meterDataUploads: build.query({
      query: (params) => ({
        url: '/ms-upload/api/v1/meter-data/uploads',
        params
      }),
      providesTags: [TAGS.UPLOADS]
    }),
    meterDataUpload: build.mutation({
      query: (body) => ({
        url: `/ms-upload/api/v1/meter-data/uploads`,
        method: 'POST',
        body
      }),
      invalidatesTags: [TAGS.UPLOADS]
    }),
    meterDataExport: build.mutation({
      query: ({ name, body }) => ({
        url: `/ms-upload/api/v1/meter-data/export`,
        method: 'POST',
        body,
        responseHandler: (response) => {
          response.blob().then((file) => {
            saveAsFile(file, name, response.headers.get('content-type') || '');
          });
        }
      })
    })
  }),
  overrideExisting: false
});

export const {
  useMeterReadingProcessQuery,
  useMeterReadingProcessStartMutation,
  useMeterReadingProcessUploadMutation,
  useMeterReadingProcessFormMutation,

  useMeterReadingInformingQuery,

  useMeterDataQuery,
  useMeterDataUploadsQuery,
  useMeterDataUploadMutation,
  useMeterDataExportMutation
} = meterReadingApi;
