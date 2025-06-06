import { mainApi } from '../../../app/mainApi';
import { saveAsFile } from '../../../util/files';

const BASE_API = '/ms-mms/api/v1/mms/manager';

const rolesApi = mainApi.injectEndpoints({
  endpoints: (build) => ({
    initSendingDko: build.query({
      query: (params) => ({
        url: `${BASE_API}/datasource`,
        params
      }),
      providesTags: ['INIT_SENDING_DKO']
    }),
    updateSendingDko: build.mutation({
      query: (body) => ({
        url: `${BASE_API}/datasource/update`,
        method: 'POST',
        body
      }),
      invalidatesTags: ['INIT_SENDING_DKO']
    }),
    downloadSendingDko: build.query({
      query: (name) => ({
        url: `/ms-mms/api/v1/mms/history/source`,
        cache: 'no-cache',
        responseHandler: (response) => {
          let fileName = name;
          const disposition = response.headers.get('content-disposition');
          if (disposition) {
            fileName = decodeURIComponent(disposition.replaceAll("attachment; filename*=utf-8''", ''));
          }
          response.blob().then((file) => {
            saveAsFile(file, fileName, response.headers.get('content-type') || '');
          });
        }
      })
    }),
    downloadRegister: build.query({
      query: () => ({
        url: `/ms-reports/api/v1/accounting-processes`,
        cache: 'no-cache',
        responseHandler: (response) => {
          let fileName;
          const disposition = response.headers.get('content-disposition');
          if (disposition) {
            fileName = decodeURIComponent(disposition.replaceAll("attachment; filename*=utf-8''", ''));
          }
          response.blob().then((file) => {
            saveAsFile(file, fileName, response.headers.get('content-type') || '');
          });
        }
      })
    })
  }),
  overrideExisting: false
});

export const {
  useInitSendingDkoQuery,
  useUpdateSendingDkoMutation,
  useLazyDownloadSendingDkoQuery,
  useLazyDownloadRegisterQuery
} = rolesApi;
