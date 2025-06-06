import { enqueueSnackbar } from '../../../actions/notistackActions';
import { mainApi } from '../../../app/mainApi';
import { saveAsFile } from '../../../util/files';
import { store } from '../../../store/store';

const api = mainApi.injectEndpoints({
  endpoints: (build) => ({
    blockedSendingDko: build.query({
      query: (params) => ({
        url: `/ms-search/api/v1/block-cad-sending/search`,
        params
      }),
      keepUnusedDataFor: 0,
      providesTags: ['BLOCKED_SENDING_DKO']
    }),
    updateBlockedSendingDko: build.mutation({
      query: ({ type, method, params, body }) => ({
        url: `/ms-locking/api/v1/${type}`,
        method,
        params,
        body
      }),
      invalidatesTags: (result, error) => error ? [] : ['BLOCKED_SENDING_DKO']
    }),
    downloadBlockedSendingDko: build.mutation({
      query: () => ({
        url: `/ms-reports/api/v1/block-cad-sending/create-file/`,
        method: 'POST',
        cache: 'no-cache',
        responseHandler: async (response) => {
          if (response?.status === 202) {
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
            }
            return data;
          }
          if (response?.status !== 200) return response.json();
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

export const { useBlockedSendingDkoQuery, useUpdateBlockedSendingDkoMutation, useDownloadBlockedSendingDkoMutation } =
  api;
