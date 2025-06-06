import {mainApi} from "../../../app/mainApi";

const BASE_API = '/ms-accounting/api/v1';
const rolesApi = mainApi.injectEndpoints({
  endpoints: (build) => ({
    createProcessManager: build.mutation({
      query: ({type, params}) => ({
        url: `${BASE_API}/process-manager/${type}/`,
        method: 'POST',
        body: params
      }),
      invalidatesTags: ['PROCESS_MANAGER_DATA']
    }),
    deleteProcessManager: build.mutation({
      query: (id) => ({
        url: `${BASE_API}/process-manager/task/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['PROCESS_MANAGER_DATA']
    }),
    getDataProcessManager: build.query({
      query: ({type, params = {}}) => ({
        url: `${BASE_API}/process-manager/${type}/`,
        params
      }),
      providesTags: ['PROCESS_MANAGER_DATA']
    })
  }),
  overrideExisting: false
})

export const {
  useCreateProcessManagerMutation,
  useDeleteProcessManagerMutation,
  useGetDataProcessManagerQuery
} = rolesApi;
