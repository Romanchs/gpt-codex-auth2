import { mainApi } from '../../app/mainApi';

const BASE_API = '/ms-reports/api/v1';
const rolesApi = mainApi.injectEndpoints({
  endpoints: (build) => ({
    createReports: build.mutation({
      query: ({ code, params }) => ({
        url: `${BASE_API}/report-manager/${code}/create/`,
        method: 'POST',
        body: params
      }),
      invalidatesTags: ['REPORTS_DATA']
    }),
    getDataReports: build.query({
      query: ({ tab, params }) => ({
        url: `${BASE_API}/report-manager/${tab}/`,
        params
      }),
      providesTags: ['REPORTS_DATA']
    }),
    getListAreasReports: build.query({
      query: ({ area_id, code }) => ({
        url: `${BASE_API}/report-manager/${code}/metering_grid_areas/`,
        params: { metering_grid_area_id: area_id }
      }),
      transformResponse: (list) => list.map((i) => ({ ...i, title: i.label }))
    }),
    getListCompaniesReports: build.query({
      query: ({ code, value }) => ({
        url: `${BASE_API}/report-manager/${code}/companies/`,
        params: { field: value }
      }),
      transformResponse: (list) =>
        list.map((i) => ({ value: i.eic, label: `${i.name} | ЕІС: ${i.eic}`, title: i.name }))
    }),
    getListOSRCompaniesReports: build.query({
      query: (value) => ({
        url: `${BASE_API}/report-manager/change-supplier-ap-z/companies/grid-access-provider/`,
        params: { field: value }
      }),
      transformResponse: (list) => list.map((i) => ({ ...i, title: i.label }))
    }),
    getPointTypesListReports: build.query({
      query: (code) => ({
        url: `${BASE_API}/report-manager/${code}/point-types/`
      })
    }),
    getAreaEICSListReports: build.query({
      query: () => ({
        url: `${BASE_API}/report-manager/metering_grid_areas/`
      }),
      transformResponse: (list) => list.slice(1)
    }),
    getAuditors: build.query({
      query: ({ value: q, assigned }) => {
        return {
          url: `/ms-ppko-submission/api/v1/audit/auditors`,
          params: { q, assigned }
        };
      },
      transformResponse(value) {
        return value?.auditors?.length > 0 ? value.auditors?.map((i) => ({ label: i, value: i, title: i })) : [];
      }
    }),
    getPpkoList: build.query({
      query: (value ) => {
        return {
          url: '/ms-ppko-submission/api/v1/audit/ppkos',
          params: { ppko: value }
        };
      },
      transformResponse(value) {
        return value?.ppkos?.length > 0 ? value?.ppkos?.map((i) => ({ label: i, value: i, title: i })) : [];
      }
    }),
    getAuditJobs: build.query({
      query: (value ) => {
        return {
          url: '/ms-ppko-submission/api/v1/audit/jobs',
          params: { ppko: value }
        };
      },
      transformResponse(value) {
        return value?.jobs?.length > 0 ? value?.jobs?.map((i) => ({ label: i, value: i, title: i })) : [];
      }
    }),
    markerPremiumFiles: build.query({
      query: () => '/ms-reports/api/v1/report-manager/renewable-objects-market-premium/files'
    }),
    bsusCompanies: build.query({
      query: () => '/ms-reference-book/api/v1/reference-book/106-80'
    })
  }),
  overrideExisting: false
});

export const {
  useCreateReportsMutation,
  useGetDataReportsQuery,
  useLazyGetListAreasReportsQuery,
  useLazyGetListCompaniesReportsQuery,
  useLazyGetListOSRCompaniesReportsQuery,
  useLazyGetAuditorsQuery,
  useLazyGetPpkoListQuery,
  useMarkerPremiumFilesQuery,
  useBsusCompaniesQuery,
} = rolesApi;
