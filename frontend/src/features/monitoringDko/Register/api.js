import {mainApi} from "../../../app/mainApi";

const BASE_API = '/ms-ts/api/v1/monitoring-requests/';
const rolesApi = mainApi.injectEndpoints({
  endpoints: (build) => ({
    getListMDR: build.query({
      query: ({point_type, ...params}) => ({
        url: BASE_API + point_type,
        params
      })
    })
  }),
  overrideExisting: false
})

export const {
  useGetListMDRQuery
} = rolesApi;
