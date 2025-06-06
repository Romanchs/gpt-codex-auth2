import { mainApi } from '../../app/mainApi';
import { saveAsFile } from '../../util/files';

const BASE_API = '/ms-ts/api/v1/ts-certifications';

export const publicationCmdAPI = mainApi.injectEndpoints({
  endpoints: (build) => ({
    termsFilters: build.query({
      query: () => ({
        url: BASE_API + '/filters',
      }),
      keepUnusedDataFor: 0
    }),
    terms: build.query({
      query: (params) => ({
        url: BASE_API,
        params
      }),
      keepUnusedDataFor: 0
    }),
    files: build.query({
      query: (params) => ({
        url: BASE_API + '/files',
        params
      }),
      keepUnusedDataFor: 0
    }),
    upload: build.mutation({
      query: (body) => ({
        url: BASE_API + '/upload',
        method: 'POST',
        body
      })
    }),
    download: build.query({
      query: () => ({
        url: BASE_API + '/download',
        cache: 'no-cache',
        responseHandler: response => {
          if (response.status !== 200) return response.json();
          const disposition = response.headers.get('content-disposition');
          let fileName = 'Публікація термінів сертифікації ДКО';
          console.log(disposition);
          if (disposition) {
            fileName = decodeURIComponent(disposition.replaceAll('attachment; filename*=utf-8\'\'', ''));
          }
          response.blob().then(file => {
            saveAsFile(file, fileName, response.headers.get('content-type') || '');
          });
        }
      })
    })
  }),
  overrideExisting: false
});

export const {
  useTermsFiltersQuery,
  useTermsQuery,
  useFilesQuery,
  useUploadMutation,
  useLazyDownloadQuery
} = publicationCmdAPI;
