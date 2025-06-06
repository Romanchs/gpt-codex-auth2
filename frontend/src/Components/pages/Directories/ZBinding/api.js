import { mainApi } from '../../../../app/mainApi';
import { saveAsFile } from '../../../../util/files';

const api = mainApi.injectEndpoints({
  endpoints: (build) => ({
    zBindingDirectory: build.query({
      query: (params) => ({
        url: `/ms-zv/api/v1/z-binding`,
        params
      })
    }),
    zBindingDirectoryExport: build.query({
      query: (params) => ({
        url: `/ms-zv/api/v1/z-binding-export`,
        cache: 'no-cache',
        params,
        responseHandler: (response) => {
          response.blob().then((file) => {
            let fileName;
            const disposition = response.headers.get('content-disposition');
            if (disposition) {
              fileName = decodeURIComponent(disposition.replaceAll("attachment; filename*=utf-8''", ''));
            }
            saveAsFile(file, fileName, response.headers.get('content-type') || '');
          });
        }
      })
    }),
    referenceBookTypePoint: build.query({
      query: () => `/ms-reference-book/api/v1/reference-book-kv/106-2/name_ua/key`
    }),
    referenceBookSubType: build.query({
      query: () => `/ms-reference-book/api/v1/reference-book-kv/101-33/name_ua/key`
    })
  }),
  overrideExisting: false
});

export const {
  useZBindingDirectoryQuery,
  useLazyZBindingDirectoryExportQuery,
  useReferenceBookTypePointQuery,
  useReferenceBookSubTypeQuery
} = api;
