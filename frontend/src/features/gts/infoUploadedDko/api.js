import { saveAsFile } from '../../../util/files';
import { mainApi } from '../../../app/mainApi';

const BASE_API = '/ms-gts/api/v1/gts';
const api = mainApi.injectEndpoints({
  endpoints: (build) => ({
    infoUploadedDko: build.query({
      query: (params) => ({
        url: `${BASE_API}/info/dko/uploads`,
        params
      })
    }),
    fileInfoUploadedDko: build.mutation({
      query: (params) => ({
        url: `${BASE_API}/download/dko/uploads`,
        params,
        cache: 'no-cache',
        responseHandler: (response) => {
          if (response?.ok) {
            let fileName = '';
            const disposition = response.headers.get('content-disposition');
            if (disposition) {
              fileName = decodeURIComponent(disposition.replaceAll("attachment; filename*=utf-8''", ''));
            }
            response.blob().then((file) => {
              saveAsFile(file, fileName, response.headers.get('content-type') || '');
            });
          } else {
            return response.json();
          }
        }
      }),
      providesTags: ['GTS_FILE_INFO']
    })
  }),
  overrideExisting: false
});

export const { useLazyInfoUploadedDkoQuery, useFileInfoUploadedDkoMutation } = api;
