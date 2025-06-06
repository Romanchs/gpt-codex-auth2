import { mainApi } from '../../app/mainApi';
import { saveAsFile } from '../../util/files';

const api = mainApi.injectEndpoints({
  endpoints: (build) => ({
    userDirectoryImport: build.query({
      query: () => ({
        url: `/ms-reports/api/v1/balance-responsible-excerpt/`,
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

export const { useLazyUserDirectoryImportQuery } = api;
