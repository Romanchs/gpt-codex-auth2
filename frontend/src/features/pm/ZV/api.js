import { saveAsFile } from '../../../util/files';
import { mainApi } from '../../../app/mainApi';

export const TAGS = {
  PROCESS_MANAGER_ZV_LIST: 'PROCESS_MANAGER_ZV_LIST',
  PROCESS_MANAGER_ZV_SETTINGS: 'PROCESS_MANAGER_ZV_SETTINGS'
};
const BASE_API = '/ms-locking/api/v1';
const api = mainApi.injectEndpoints({
  endpoints: (build) => ({
    updateLockGlobalPMZV: build.mutation({
      query: ({ action, body }) => ({
        url: `${BASE_API}/global-zv-lock`,
        method: action === 'lock' ? 'POST' : 'DELETE',
        body
      }),
      invalidatesTags: [TAGS.PROCESS_MANAGER_ZV_LIST]
    }),
    updatePointsPMZV: build.mutation({
      query: ({ type, params, body }) => ({
        url: `${BASE_API}/zv/${type}`,
        method: 'POST',
        params,
        body
      }),
      invalidatesTags: [TAGS.PROCESS_MANAGER_ZV_LIST]
    }),
    downloadPMZV: build.query({
      query: (name) => ({
        url: `${BASE_API}/zv-export`,
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
    getListPMZV: build.query({
      query: (params) => ({
        url: `${BASE_API}/zv/list`,
        params
      }),
      providesTags: [TAGS.PROCESS_MANAGER_ZV_LIST]
    }),
    initPMZV: build.query({
      query: () => ({
        url: `${BASE_API}/zv-init`
      }),
      providesTags: [TAGS.PROCESS_MANAGER_ZV_SETTINGS]
    })
  }),
  overrideExisting: false
});

export const {
  useUpdateLockGlobalPMZVMutation,
  useUpdatePointsPMZVMutation,
  useLazyDownloadPMZVQuery,
  useGetListPMZVQuery,
  useInitPMZVQuery
} = api;
