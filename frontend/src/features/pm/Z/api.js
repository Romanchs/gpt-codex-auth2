import { saveAsFile } from '../../../util/files';
import { mainApi } from '../../../app/mainApi';

export const TAGS = {
  PROCESS_MANAGER_Z_LIST: 'PROCESS_MANAGER_Z_LIST',
  PROCESS_MANAGER_Z_SETTINGS: 'PROCESS_MANAGER_Z_SETTINGS'
};
const BASE_API = '/ms-locking/api/v1';
const api = mainApi.injectEndpoints({
  endpoints: (build) => ({
    updateLockGlobalPMZ: build.mutation({
      query: ({ action, body }) => ({
        url: `${BASE_API}/global-z-lock`,
        method: action === 'lock' ? 'POST' : 'DELETE',
        body
      }),
      invalidatesTags: [TAGS.PROCESS_MANAGER_Z_LIST]
    }),
    updatePointsPMZ: build.mutation({
      query: ({ type, params, body }) => ({
        url: `${BASE_API}/z/${type}`,
        method: 'POST',
        params,
        body
      }),
      invalidatesTags: [TAGS.PROCESS_MANAGER_Z_LIST]
    }),
    downloadPMZ: build.query({
      query: (name) => ({
        url: `${BASE_API}/z-export`,
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
    getListPMZ: build.query({
      query: (params) => ({
        url: `${BASE_API}/z/list`,
        params
      }),
      providesTags: [TAGS.PROCESS_MANAGER_Z_LIST]
    }),
    initPMZ: build.query({
      query: () => ({
        url: `${BASE_API}/z-init`
      }),
      providesTags: [TAGS.PROCESS_MANAGER_Z_SETTINGS]
    })
  }),
  overrideExisting: false
});

export const {
  useUpdateLockGlobalPMZMutation,
  useUpdatePointsPMZMutation,
  useLazyDownloadPMZQuery,
  useGetListPMZQuery,
  useInitPMZQuery
} = api;
