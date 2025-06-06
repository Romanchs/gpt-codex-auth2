import { mainApi } from '../../../../app/mainApi';
import { saveAsFile } from '../../../../util/files';

export const PPKO_CONTACTS_TAG = 'PPKO_CONTACTS_TAG';

const ppkoDetailsApi = mainApi.injectEndpoints({
  endpoints: (build) => ({
    downloadPpkoById: build.query({
      query: ({ id, name }) => ({
        url: `/ms-ppko/api/v1/ppko_xlsx/download/${id}`,
        cache: 'no-cache',
        responseHandler: (response) => {
          response.blob().then((file) => {
            saveAsFile(file, name, response.headers.get('content-type') || '');
          });
        }
      })
    }),
    ppkoById: build.query({
      query: (id) => ({
        url: `/ms-ppko/api/v1/ppko/${id}`
      }),
      providesTags: [PPKO_CONTACTS_TAG]
    }),
    ppkoConstants: build.query({
      query: () => ({
        url: `/ms-ppko/api/v1/constants`
      })
    })
  }),
  overrideExisting: false
});

export const { usePpkoByIdQuery, usePpkoConstantsQuery, useLazyDownloadPpkoByIdQuery } = ppkoDetailsApi;
