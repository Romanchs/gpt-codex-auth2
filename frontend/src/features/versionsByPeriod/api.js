import { mainApi } from '../../app/mainApi';

const versionsByPeriodApi = mainApi.injectEndpoints({
  endpoints: (build) => ({
    versionsByPeriod: build.query({
      query: (params) => ({
        url: `/ms-ts/api/v1/z-zv-versions/versions-in-period/`,
        params
      })
    })
  })
});

export const { useVersionsByPeriodQuery, useLazyVersionsByPeriodQuery } = versionsByPeriodApi;
