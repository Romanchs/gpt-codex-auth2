import { mainApi } from '../../../app/mainApi';
import i18n from '../../../i18n/i18n';
import { saveAsFile } from '../../../util/files';

const MS_REPORTS = '/ms-reports/api/v1';

const gtsRegionBalanceApi = mainApi.injectEndpoints({
  endpoints: (build) => ({
    regionBalanceList: build.query({
      query: (params) => ({
        url: `${MS_REPORTS}/mga-balance/ts/`,
        params
      })
    }),
    meteringGridAreas: build.query({
      query: () => ({
        url: 'ms-search/api/v1/ap/metering_grid_areas'
      }),
      transformResponse: (res) => res?.map((i) => ({ label: i, value: i }))
    }),
    exportFile: build.mutation({
      query: (body) => ({
        url: `${MS_REPORTS}/mga-balance/create/`,
        body,
        method: 'POST',
        responseHandler: (response) => {
          let fileName = i18n.t('PAGES.REGION_BALANCE');
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

export const { useLazyRegionBalanceListQuery, useMeteringGridAreasQuery, useExportFileMutation } =
  gtsRegionBalanceApi;
