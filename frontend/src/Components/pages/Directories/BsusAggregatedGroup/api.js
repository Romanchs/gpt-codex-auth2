import { mainApi } from '../../../../app/mainApi';

const api = mainApi.injectEndpoints({
  endpoints: (build) => ({
    bsusAggregatedGroupDirectory: build.query({
      query: (params) => ({
        url: `/ms-reference-book/api/v1/bsus-aggregated-group`,
        params
      })
    })
  }),
  overrideExisting: false
});

export const { useBsusAggregatedGroupDirectoryQuery } = api;
