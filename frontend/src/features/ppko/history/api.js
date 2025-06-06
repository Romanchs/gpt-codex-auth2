import {saveAsFile} from '../../../util/files';
import {mainApi} from '../../../app/mainApi';

const BASE_API = 'ms-ppko/api/v1';

const api = mainApi.injectEndpoints({
  endpoints: (build) => ({
    downloadPPKOHistory: build.query({
      query: ({params, name}) => ({
        url: `${BASE_API}/export-history`,
        params,
        cache: 'no-cache',
        responseHandler: response => {
          response.blob().then(file => {
            saveAsFile(file, name, response.headers.get('content-type') || '')
          });
        }
      })
    }),
    getPPKOHistory: build.query({
      query: (params) => ({
        url: `${BASE_API}/history/`,
        params
      })
    }),
    getUsersByText: build.query({
      query: (name) => ({
        url: `ms-users/api/v1/users-ppkos/`,
        params: {full_name_responsible_people_for_check_doc: name}
      })
    })
  }),
  overrideExisting: false
})

export const {
  useLazyDownloadPPKOHistoryQuery,
  useGetPPKOHistoryQuery,
  useLazyGetUsersByTextQuery
} = api;
