import { enqueueSnackbar } from '../../../actions/notistackActions';
import { mainApi } from '../../../app/mainApi';
import { store } from '../../../store/store';
import { saveAsFile } from '../../../util/files';

const BASE_API = 'ms-ts/api/v1/monitoring-ts-by-checks/';
const api = mainApi.injectEndpoints({
  endpoints: (build) => ({
    createMDCHECKDKOZ: build.mutation({
      query: (body) => ({
        url: `${BASE_API}z/create`,
        method: 'POST',
        body
      }),
      invalidatesTags: ['MONITORING_DKO_CHECK_DKO_Z_SETTINGS', 'MONITORING_DKO_CHECK_DKO_Z_LIST']
    }),
    settingsMDCHECKDKOZ: build.query({
      query: () => ({
        url: `${BASE_API}z/settings`
      }),
      providesTags: ['MONITORING_DKO_CHECK_DKO_Z_SETTINGS'],
      keepUnusedDataFor: 0
    }),
    listMDCHECKDKOZ: build.query({
      query: (params) => ({
        url: `${BASE_API}z/get-main-reports`,
        params
      }),
      providesTags: ['MONITORING_DKO_CHECK_DKO_Z_LIST'],
      keepUnusedDataFor: 0
    }),
    detailsMDCHECKDKOZ: build.query({
      query: ({ uid, params }) => ({
        url: `${BASE_API}z/${uid}/details/`,
        params
      }),
      providesTags: ['MONITORING_DKO_DETAILS_LIST']
    }),
    controlsDetailsMDCHECKDKOZ: build.mutation({
      query: ({ process_uid, type, body }) => ({
        url: `${BASE_API}z/${process_uid}${type}`,
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
            fileName = decodeURIComponent(disposition.replaceAll('attachment;filename=', ''));
          }
          response.blob().then((file) => {
            saveAsFile(file, fileName, response.headers.get('content-type') || '');
          });
          return response;
        }
      })
    }),
    downloadFileMDCHECKDKOZ: build.query({
      query: ({ process_uid, file_uid }) => ({
        url: `${BASE_API}z/${process_uid}/details/${file_uid}/download`,
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
    downloadMDCHECKDKOZ: build.query({
      query: (params) => ({
        url: `${BASE_API}z/export-reports`,
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
    })
  }),
  overrideExisting: false
});

export const {
  useCreateMDCHECKDKOZMutation,
  useSettingsMDCHECKDKOZQuery,
  useListMDCHECKDKOZQuery,
  useDetailsMDCHECKDKOZQuery,
  useControlsDetailsMDCHECKDKOZMutation,
  useLazyDownloadFileMDCHECKDKOZQuery,
  useLazyDownloadMDCHECKDKOZQuery
} = api;
