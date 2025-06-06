import { mainApi } from '../../../app/mainApi';
import i18n from '../../../i18n/i18n';

const BASE_API = '/ms-reports/api/v1/transfer-ts-reports';
const api = mainApi.injectEndpoints({
  endpoints: (build) => ({
    searchGTSReportByParams: build.query({
      query: ({ apiPath, name, value }) => ({
        url: `${BASE_API}/${apiPath}?field=${name}&value=${value}`
      }),
      transformResponse: (response) => {
        const list = [{ option: 'Всі', label: 'Всі', value: 'Всі' }];
        let pair = response[0] && Object.entries(response[0]);
        if (pair) {
          if (pair.length === 1) {
            pair = { eic: pair[0][0] };

            for (let i = 0; i < response.length; i++) {
              list.push({
                option: response[i][pair.eic],
                label: response[i][pair.eic],
                value: response[i][pair.eic]
              });
            }
          } else {
            pair = { eic: pair[0][0], name: pair[1][0] };

            for (let i = 0; i < response.length; i++) {
              list.push({
                option: `${response[i][pair.name]} | ЕІС: ${response[i][pair.eic]}`,
                label: response[i][pair.name],
                value: response[i][pair.eic]
              });
            }
          }
        }
        return list;
      }
    }),
    searchMultiReportByParams: build.query({
      query: ({ apiPath, name, value }) => ({
        url: `${BASE_API}/${apiPath}?field=${name}&value=${value}`
      }),
      transformResponse: (response) => {
        const list = [
          {
            label: i18n.t('ALL'),
            value: 'null'
          }
        ];
        let pair = response[0] && Object.entries(response[0]);
        if (pair) {
          pair = { eic: pair[0][0], name: pair[1][0] };
          for (let i = 0; i < response.length; i++) {
            list.push({
              label: `${response[i][pair.name]} | EIC: ${response[i][pair.eic]}`,
              value: response[i][pair.eic]
            });
          }
        }
        return list;
      }
    }),
    searchReportByParams: build.query({
      query: ({ apiPath, name, value }) => ({
        url: `${BASE_API}/${apiPath}?field=${name}&value=${value}`
      }),
      transformResponse: (response) => {
        const list = [];
        let pair = response[0] && Object.entries(response[0]);
        if (pair) {
          pair = { eic: pair[0][0] };
          for (let i = 0; i < response.length; i++) {
            list.push({
              label: response[i][pair.eic],
              value: response[i][pair.eic]
            });
          }
        }
        return list;
      }
    }),
    arGTSReportSettings: build.query({
      query: () => ({
        url: `${BASE_API}/by-properties-usp/settings/general/`
      })
    }),
    uploadArGTSReportFile: build.mutation({
      query: ({ uid, body }) => ({
        url: `${BASE_API}/by-properties-usp/${uid}/upload-file/`,
        method: 'POST',
        body
      })
    }),
    intiArGTSReportFile: build.mutation({
      query: (body) => ({
        url: `${BASE_API}/by-properties-usp/init/`,
        method: 'POST',
        body
      })
    }),
    createArGTSReportFile: build.mutation({
      query: ({ uid, body }) => ({
        url: `${BASE_API}/by-properties-usp/${uid}/create-files/`,
        method: 'POST',
        body
      })
    })
  }),
  overrideExisting: false
});

export const {
  useLazySearchGTSReportByParamsQuery,
  useArGTSReportSettingsQuery,
  useUploadArGTSReportFileMutation,
  useIntiArGTSReportFileMutation,
  useCreateArGTSReportFileMutation,
  useLazySearchMultiReportByParamsQuery
} = api;
