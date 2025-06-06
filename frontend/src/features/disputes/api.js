import { mainApi } from '../../app/mainApi';

const getBaseUrl = (url, service = 'ms-dispute') => {
  return `/${service}/api/v1/${url}`;
};

const rolesApi = mainApi.injectEndpoints({
  endpoints: (build) => ({
    disputeList: build.query({
      query: (params) => ({
        url: getBaseUrl('dispute'),
        params
      })
    })
  }),
  overrideExisting: false
});

export const { useDisputeListQuery } = rolesApi;
