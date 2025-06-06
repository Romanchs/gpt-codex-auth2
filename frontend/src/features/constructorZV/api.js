import { enqueueSnackbar } from "../../actions/notistackActions";
import { mainApi } from "../../app/mainApi";

const ConstructorZV_API = '/ms-accounting/api/v1/constructor';

const constructorZVApi = mainApi.injectEndpoints({
  endpoints: (build) => ({
    zvSettings: build.query({
      query: () => `${ConstructorZV_API}/zv-group-settings/`
    }),
    zvGroups: build.query({
      query: (params) => ({
        url: `${ConstructorZV_API}/zv-groups/`,
        params
      }),
      providesTags: ['ZV-GROUPS']
    }),
    zvGroup: build.mutation({
      query: (body) => ({
        url: `${ConstructorZV_API}/zv-group/`,
        method: 'POST',
        body
      }),
      invalidatesTags: ['ZV-GROUPS']
    }),
    pmZV: build.query({
      query: (params) => ({
        url: `${ConstructorZV_API}/process-manager/zv/`,
        params
      }),
      transformResponse: (res) => {
        return res?.data.map((item) => ({
          ...item,
          value: item?.eic,
          label: `${item?.eic} ${item?.properties} ${item?.aggregation_type}`
        }));
      }
    }),
    pmSettings: build.query({
      query: () => `${ConstructorZV_API}/process-manager/settings/`
    }),
    pmStart: build.mutation({
      query: ({type, body}) => ({
        url: `${ConstructorZV_API}/process-manager/${type}/`,
        method: 'POST',
        body
      }),
      invalidatesTags: ['PROCESSES-LIST']
    }),
    pmTasks: build.query({
      query: (params) => ({
        url: `${ConstructorZV_API}/process-manager/tasks/`,
        params
      }),
      providesTags: ['PM-LIST']
    }),
    pmDeleteTask: build.mutation({
      query: (id) => ({
        url: `${ConstructorZV_API}/process-manager/task/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['PM-LIST']
    }),
    processes: build.query({
      query: (params) => ({
        url: `${ConstructorZV_API}/processes/`,
        params
      }),
      providesTags: ['PROCESSES-LIST']
    }),
    updateZvGroup: build.mutation({
      query: ({uid, name}) => ({
        url: `${ConstructorZV_API}/zv-group/${uid}/update/`,
        method: 'PATCH',
        body: name ? {name} : {}
      }),
      async onQueryStarted(_, {dispatch, queryFulfilled}) {
        queryFulfilled.then(response => {
          dispatch(enqueueSnackbar({
            message: response.data.detail,
            options: {
              key: new Date().getTime() + Math.random(),
              variant: 'success',
              autoHideDuration: 5000
            }
          }));
        })
      },
      invalidatesTags: ['ZV-GROUPS']
    }),
  }),
  overrideExisting: false
})

export const {
  useZvSettingsQuery,
  useZvGroupsQuery,
  useZvGroupMutation,
  usePmZVQuery,
  usePmSettingsQuery,
  usePmStartMutation,
  usePmTasksQuery,
  usePmDeleteTaskMutation,
  useProcessesQuery,
  useUpdateZvGroupMutation
} = constructorZVApi;
