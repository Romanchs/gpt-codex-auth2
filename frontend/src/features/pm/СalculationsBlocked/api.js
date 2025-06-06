import {mainApi} from "../../../app/mainApi";

const BASE_API = '/ms-locking/api/v1';
const rolesApi = mainApi.injectEndpoints({
  endpoints: (build) => ({
    lockPMBlocked: build.mutation({
      query: ({method, body}) => ({
        url: `${BASE_API}/accounting-lock`,
        method,
        body
      }),
      invalidatesTags: ['PROCESS_MANAGER_BLOCKED_LIST']
    }),
    getListPMBlocked: build.query({
      query: (params) => ({
        url: `${BASE_API}/accounting-list`,
        params
      }),
      providesTags: ['PROCESS_MANAGER_BLOCKED_LIST']
    }),
    initPMBlocked: build.query({
      query: () => ({
        url: `${BASE_API}/accounting-init`
      })
    })
  }),
  overrideExisting: false
})

export const {
  useLockPMBlockedMutation,
  useGetListPMBlockedQuery,
  useInitPMBlockedQuery
} = rolesApi;
