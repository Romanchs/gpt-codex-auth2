import { mainApi } from '../../../app/mainApi';

export const TAGS = {
  CORRECTION_ARCHIVING_TS: 'CORRECTION_ARCHIVING_TS',
  CORRECTION_ARCHIVING_TS_FILES: 'CORRECTION_ARCHIVING_TS_FILES'
};
const BASE_API = '/ms-processes-v2/api/v1/correction-archiving-ts';
const api = mainApi.injectEndpoints({
  endpoints: (build) => ({
    initCorrectionArchivingTS: build.mutation({
      query: (body) => ({
        url: BASE_API,
        method: 'POST',
        body
      })
    }),
    uploadCorrectionArchivingTS: build.mutation({
      query: ({ uid, body }) => ({
        url: `${BASE_API}/${uid}/upload`,
        method: 'POST',
        body
      }),
      invalidatesTags: [TAGS.CORRECTION_ARCHIVING_TS, TAGS.CORRECTION_ARCHIVING_TS_FILES]
    }),
    changeDescriptionFilesCorrectionArchivingTS: build.mutation({
      query: ({ uid, body, method }) => ({
        url: `${BASE_API}/${uid}/file-description`,
        method,
        body
      }),
      invalidatesTags: [TAGS.CORRECTION_ARCHIVING_TS]
    }),
    updateCorrectionArchivingTS: build.mutation({
      query: ({ uid, type, body }) => ({
        url: `${BASE_API}/${uid}${type}`,
        method: 'POST',
        body
      }),
      invalidatesTags: [TAGS.CORRECTION_ARCHIVING_TS, TAGS.CORRECTION_ARCHIVING_TS_FILES]
    }),
    correctionArchivingTS: build.query({
      query: ({ uid, params }) => ({
        url: `${BASE_API}/${uid}`,
        params
      }),
      providesTags: [TAGS.CORRECTION_ARCHIVING_TS]
    }),
    filesCorrectionArchivingTS: build.query({
      query: (uid) => ({
        url: `${BASE_API}/${uid}/files`
      }),
      providesTags: [TAGS.CORRECTION_ARCHIVING_TS_FILES]
    }),
    subprocessesCorrectionArchivingTS: build.query({
      query: (uid) => ({
        url: `${BASE_API}/${uid}/subprocesses`
      })
    }),
    reasonsCorrectionArchivingTS: build.query({
      query: () => ({
        url: '/ms-reference-book/api/v1/reference-book/ARCHIVING/?fields=name_en,name_ua,key'
      })
    })
  }),
  overrideExisting: false
});

export const {
  useInitCorrectionArchivingTSMutation,
  useUploadCorrectionArchivingTSMutation,
  useChangeDescriptionFilesCorrectionArchivingTSMutation,
  useUpdateCorrectionArchivingTSMutation,
  useCorrectionArchivingTSQuery,
  useFilesCorrectionArchivingTSQuery,
  useSubprocessesCorrectionArchivingTSQuery,
  useReasonsCorrectionArchivingTSQuery
} = api;
