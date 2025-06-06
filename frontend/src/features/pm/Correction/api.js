import { mainApi } from '../../../app/mainApi';

const api = mainApi.injectEndpoints({
  endpoints: (build) => ({
    pmCorrectionTS: build.query({
      query: (params) => ({
        url: '/ms-search/api/v1/correction_ts/manager',
        params
      })
    })
  }),
  overrideExisting: false
});

export const { usePmCorrectionTSQuery } = api;
