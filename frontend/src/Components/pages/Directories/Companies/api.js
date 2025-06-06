import { mainApi } from '../../../../app/mainApi';

const api = mainApi.injectEndpoints({
  endpoints: (build) => ({
    companiesDirectory: build.query({
      query: (params) => ({
        url: `/ms-companies/api/v2/companies`,
        params
      })
    }),
    companiesSettings: build.query({
      query: () => `/ms-companies/api/v2/companies/settings`
    }),
    companyDetails: build.query({
      query: (uid) => ({
        url: `/ms-companies/api/v2/companies/${uid}`
      })
    }),
    companyHistory: build.query({
      query: ({ uid, params }) => ({
        url: `/ms-companies/api/v2/companies/${uid}/history`,
        params
      })
    }),
    companyHistorySettings: build.query({
      query: () => `/ms-companies/api/v2/companies/history/settings`
    })
  }),
  overrideExisting: false
});

export const {
  useCompaniesDirectoryQuery,
  useCompaniesSettingsQuery,
  useCompanyDetailsQuery,
  useCompanyHistoryQuery,
  useCompanyHistorySettingsQuery
} = api;
