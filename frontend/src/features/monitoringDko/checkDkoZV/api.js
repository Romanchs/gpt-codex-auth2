import { enqueueSnackbar } from '../../../actions/notistackActions';
import { mainApi } from '../../../app/mainApi';
import { store } from '../../../store/store';
import { saveAsFile } from '../../../util/files';

const BASE_API = 'ms-ts/api/v1/monitoring-ts-by-checks/';

const TAGS = {
  SETTINGS: 'MONITORING_DKO_CHECK_DKO_ZV_SETTINGS',
  LIST: 'MONITORING_DKO_CHECK_DKO_ZV_LIST'
};

const api = mainApi.injectEndpoints({
  endpoints: (build) => ({
    createMDCHECKDKOZV: build.mutation({
      query: (body) => ({
        url: `${BASE_API}zv/create`,
        method: 'POST',
        body
      }),
      invalidatesTags: [TAGS.SETTINGS, TAGS.LIST]
    }),
    settingsMDCHECKDKOZV: build.query({
      query: () => ({
        url: `${BASE_API}zv/settings`
      }),
      providesTags: [TAGS.SETTINGS],
      keepUnusedDataFor: 0
    }),
    listMDCHECKDKOZV: build.query({
      query: (params) => ({
        url: `${BASE_API}zv/get-reports`,
        params
      }),
      providesTags: [TAGS.LIST],
      keepUnusedDataFor: 0
    }),
    detailsMDCHECKDKOZV: build.query({
      query: ({ uid, params }) => ({
        url: `${BASE_API}zv/${uid}/details/`,
        params
      }),
      providesTags: ['MONITORING_DKO_ZV_DETAILS_LIST']
    }),
    controlsDetailsMDCHECKDKOZV: build.mutation({
      query: ({ process_uid, type, body }) => ({
        url: `${BASE_API}zv/${process_uid}${type}`,
        method: 'POST',
        cache: 'no-cache',
        body,
        responseHandler: async (response) => {
          if (type !== '/download-archive' && response?.status === 200) {
            const data = await response.json();
            if (data?.detail) {
              store.dispatch(
                enqueueSnackbar({
                  message: data.detail,
                  options: {
                    key: new Date().getTime() + Math.random(),
                    variant: 'success',
                    autoHideDuration: 5000
                  }
                })
              );
              return response;
            }
          }
          if (response?.status !== 200) return await response.json();
          let fileName;
          const disposition = response.headers.get('content-disposition');
          if (disposition) {
            fileName = decodeURIComponent(disposition.replaceAll("attachment; filename*=utf-8''", ''));
          }
          response.blob().then((file) => {
            saveAsFile(file, fileName, response.headers.get('content-type') || '');
          });
          return response;
        }
      })
    }),
    downloadFileMDCHECKDKOZV: build.query({
      query: ({ process_uid, file_uid }) => ({
        url: `${BASE_API}zv/${process_uid}/details/${file_uid}/download`,
        cache: 'no-cache',
        responseHandler: (response) => {
          let fileName = '';
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
    downloadMDCHECKDKOZV: build.query({
      query: (params) => ({
        url: `${BASE_API}zv/export-reports`,
        params,
        cache: 'no-cache',
        responseHandler: (response) => {
          let fileName = '';
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
    uploadMassFile: build.mutation({
      query: ({ body }) => ({
        url: `${BASE_API}zv/upload`,
        method: 'POST',
        cache: 'no-cache',
        body,
        responseHandler: async (response) => {
          if (response.status === 400) {
            const errorData = await response.json();
            return errorData;
          }
          let fileName;
          const disposition = response.headers.get('content-disposition');
          if (disposition) {
            fileName = decodeURIComponent(disposition.replaceAll("attachment; filename*=utf-8''", '')).replace(
              '.xlsx',
              '_результат обробки.xlsx'
            );
          }
          response.blob().then((file) => {
            saveAsFile(file, fileName || 'export', response.headers.get('content-type') || '');
          });
        }
      })
    })
  }),
  overrideExisting: false
});

export const {
  useCreateMDCHECKDKOZVMutation,
  useSettingsMDCHECKDKOZVQuery,
  useListMDCHECKDKOZVQuery,
  useDetailsMDCHECKDKOZVQuery,
  useControlsDetailsMDCHECKDKOZVMutation,
  useLazyDownloadFileMDCHECKDKOZVQuery,
  useLazyDownloadMDCHECKDKOZVQuery,
  useUploadMassFileMutation
} = api;
