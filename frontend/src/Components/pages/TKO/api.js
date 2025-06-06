import { mainApi } from '../../../app/mainApi';

const tkoApi = mainApi.injectEndpoints({
  endpoints: (build) => ({
    tkoDataTKO: build.query({
      query: (params) => ({
        url: '/ms-search/api/v1/ap',
        params
      })
    }),
    fuelListTKO: build.query({
      query: () => ({
        url: '/ms-reference-book/api/v1/reference-book/202-51?fields=name_en,name_ua'
      }),
      transformResponse: (response) => {
        return response?.map((i) => ({ value: i, label: i })) || [];
      }
    }),
    voltageListTKO: build.query({
      query: () => ({
        url: '/ms-reference-book/api/v1/reference-book-compact/108-3/parameter'
      }),
      transformResponse: (response) => {
        return response?.map((i) => ({ value: i, label: i })) || [];
      }
    }),
    companyDetail: build.query({
      query: (usreou) => ({
        url: `ms-companies/api/v1/company-detail/${usreou}`
      })
    })
  }),
  overrideExisting: 'throw'
});

export const { useTkoDataTKOQuery, useFuelListTKOQuery, useVoltageListTKOQuery, useCompanyDetailQuery } = tkoApi;
