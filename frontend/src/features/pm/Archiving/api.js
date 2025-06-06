import { mainApi } from '../../../app/mainApi';

const api = mainApi.injectEndpoints({
  endpoints: (build) => ({
    pmArchivingTS: build.query({
      query: (params) => ({
        url: '/ms-search/api/v1/archiving_ts/manager',
        params
      })
    })
  }),
  overrideExisting: false
});

export const { usePmArchivingTSQuery } = api;
