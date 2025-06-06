import { mainApi } from '../../app/mainApi';

const BASE_API = '/ms-settings/api/v1/process-settings';
const api = mainApi.injectEndpoints({
  endpoints: (build) => ({
    processSettingsList: build.query({
      query: (params) => ({
        url: BASE_API + '/processes',
        params
      })
    }),
    processSettingsSettingsList: build.query({
      query: ({ process_name, params }) => ({
        url: `${BASE_API}/${process_name}/metering_grid_area`,
        params
      }),
      providesTags: ['PROCESS_SETTINGS_SETTINGS']
    }),
    processSettingsUsers: build.query({
      query: () => ({
        url: BASE_API + '/UPDATE_APS_HISTORY/process_settings'
      }),
      transformResponse: (res) => ({
        users: res?.AKO_USERS?.map((i) => i?.username) || [],
        companies: res?.auto_approve_excluded
      }),
      providesTags: ['PROCESS_SETTINGS_USERS']
    }),
    processSettingsUsersUpdate: build.mutation({
      query: ({ values, type }) => ({
        url: BASE_API + '/UPDATE_APS_HISTORY/',
        method: 'PATCH',
        body: type === 'users' ? { AKO_USERS: values } : { auto_approve_excluded: values }
      }),
      invalidatesTags: ['PROCESS_SETTINGS_USERS']
    }),
    processSettingsSettingsUpdate: build.mutation({
      query: ({ process_name, params, body }) => ({
        url: `${BASE_API}/${process_name}/metering_grid_area`,
        method: 'PATCH',
        params,
        body: body ?? {}
      }),
      invalidatesTags: ['PROCESS_SETTINGS_SETTINGS']
    })
  }),
  overrideExisting: false
});

export const {
  useProcessSettingsListQuery,
  useProcessSettingsSettingsListQuery,
  useProcessSettingsUsersQuery,
  useProcessSettingsUsersUpdateMutation,
  useProcessSettingsSettingsUpdateMutation
} = api;
