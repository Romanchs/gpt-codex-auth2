import { mainApi } from '../../../../app/mainApi';
import { saveAsFile } from '../../../../util/files';

const TAGS = {
  specialMeteringGridArea: 'SPECIAL_METERING_GRID_AREA'
};

const api = mainApi.injectEndpoints({
  endpoints: (build) => ({
    specialMeteringGridArea: build.query({
      query: (params) => ({
        url: `/ms-reference-book/api/v1/special-mga/`,
        cache: 'no-cache',
        params
      }),
      providesTags: [TAGS.specialMeteringGridArea]
    }),
    createSpecialMeteringGridArea: build.mutation({
      query: (body) => ({
        url: `/ms-reference-book/api/v1/special-mga/`,
        method: 'POST',
        body
      }),
      invalidatesTags: [TAGS.specialMeteringGridArea]
    }),
    archiveSpecialMeteringGridArea: build.mutation({
      query: ({ uid, archived }) => ({
        url: `gateway/ms-reference-book/api/v1/special-mga/${uid}/archive`,
        method: 'PATCH',
        body: { archived }
      }),
      invalidatesTags: [TAGS.specialMeteringGridArea]
    }),
    downloadSpecialMeteringGridArea: build.query({
      query: ({ name, uid }) => ({
        url: `/ms-export/api/v1/reference-type/${uid}/special-mga`,
        method: 'GET',
        responseHandler: (response) => {
          if (response.status !== 200) {
            return response.json();
          }
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
    })
  }),
  overrideExisting: false
});

export const {
  useSpecialMeteringGridAreaQuery,
  useCreateSpecialMeteringGridAreaMutation,
  useArchiveSpecialMeteringGridAreaMutation,
  useLazyDownloadSpecialMeteringGridAreaQuery
} = api;
