import { mainApi } from '../../app/mainApi';
import moment from 'moment';
import { saveAsFile } from '../../util/files';

const TAGS = {
  REGISTER: 'AUDIT_REGISTER_LIST',
  AUDIT: 'AUDIT_DATA'
};

const auditsApi = mainApi.injectEndpoints({
  endpoints: (build) => ({
    auditors: build.query({
      query: ({ value: q, assigned }) => {
        return {
          url: `/ms-ppko-submission/api/v1/audit/auditors`,
          params: { q, assigned }
        };
      },
      transformResponse(value) {
        return value?.auditors?.length > 0 ? value.auditors : [];
      }
    }),
    auditsList: build.query({
      query: (params) => ({
        url: `/ms-ppko-submission/api/v1/audit/list`,
        params
      }),
      providesTags: [TAGS.REGISTER]
    }),
    auditPpkoSearch: build.query({
      query: (params) => ({
        url: `/ms-ppko/api/v1/ppko-adress/`,
        params
      })
    }),
    createAudit: build.mutation({
      query: (body) => ({
        url: '/ms-ppko-submission/api/v1/audit/create',
        method: 'POST',
        body
      }),
      invalidatesTags: [TAGS.REGISTER]
    }),
    audit: build.query({
      query: (audit_uid) => `/ms-ppko-submission/api/v1/audit/${audit_uid}`,
      providesTags: [TAGS.AUDIT]
    }),
    deleteAudit: build.mutation({
      query: (uid) => ({
        url: `/ms-ppko-submission/api/v1/audit/${uid}`,
        method: 'DELETE'
      }),
      invalidatesTags: [TAGS.REGISTER]
    }),
    updateAudit: build.mutation({
      query: ({ uid, body }) => ({
        url: `/ms-ppko-submission/api/v1/audit/${uid}`,
        method: 'PATCH',
        body: body ?? {}
      }),
      invalidatesTags: [TAGS.REGISTER, TAGS.AUDIT]
    }),
    cancelAudit: build.mutation({
      query: ({ uid, body }) => ({
        url: `/ms-ppko-submission/api/v1/audit/${uid}/cancel`,
        method: 'PATCH',
        body: body ?? {}
      }),
      invalidatesTags: [TAGS.REGISTER, TAGS.AUDIT]
    }),
    exportAudits: build.query({
      query: (params) => ({
        url: `/ms-ppko-submission/api/v1/audit/export`,
        params,
        cache: 'no-cache',
        responseHandler: (response) => {
          let fileName = `Перелік перевірок ППКО ${moment().format('DD.MM.YYYY HH:mm')}`;
          const disposition = response.headers.get('content-disposition');
          if (disposition) {
            fileName = decodeURIComponent(disposition.replaceAll("attachment; filename*=utf-8''", ''));
          }
          response.blob().then((file) => {
            saveAsFile(
              file,
              fileName,
              response.headers.get('content-type') ||
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            );
          });
        }
      })
    }),
    materingPoint: build.query({
      query: (params) => ({
        url: `/ms-ppko-submission/api/v1/audit/metering-point`,
        params
      })
    }),
    submateringPoint: build.query({
      query: (params) => ({
        url: `/ms-ppko-submission/api/v1/audit/submetering-point`,
        params
      })
    }),
    prepareAct: build.query({
      query: (uid) => ({
        url: `/ms-ppko-submission/api/v1/audit/${uid}/audit-results`,
        cache: 'no-cache',
        responseHandler: (response) => {
          let fileName = `Акт перевірки`;
          const disposition = response.headers.get('content-disposition');
          if (disposition) {
            fileName = decodeURIComponent(disposition.replaceAll("attachment; filename*=utf-8''", ''));
          }
          response.blob().then((file) => {
            saveAsFile(file, fileName, response.headers.get('content-type'));
          });
        }
      })
    }),
    auditCheck: build.mutation({
      query: ({ uid, body }) => ({
        url: `/ms-ppko-submission/api/v1/audit/${uid}/audit-check`,
        method: 'POST',
        body
      }),
      invalidatesTags: [TAGS.REGISTER, TAGS.AUDIT]
    })
  }),
  overrideExisting: false
});

export const {
  useLazyAuditorsQuery,
  useAuditsListQuery,
  useLazyAuditPpkoSearchQuery,
  useCreateAuditMutation,
  useAuditQuery,
  useDeleteAuditMutation,
  useUpdateAuditMutation,
  useCancelAuditMutation,
  useLazyExportAuditsQuery,
  useLazyMateringPointQuery,
  useLazySubmateringPointQuery,
  useLazyPrepareActQuery,
  useAuditCheckMutation
} = auditsApi;
