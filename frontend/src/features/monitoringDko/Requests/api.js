import {mainApi} from '../../../app/mainApi';

const BASE_API = '/ms-ts/api/v1/monitoring-mdr/';
const rolesApi = mainApi.injectEndpoints({
  endpoints: (build) => ({
    downloadRequests: build.mutation({
      query: ({type, body}) => ({
        url: BASE_API + type + '/create-request',
        method: 'POST',
        body
      })
    })
  }),
  overrideExisting: false
});

export const {
  useDownloadRequestsMutation
} = rolesApi;
