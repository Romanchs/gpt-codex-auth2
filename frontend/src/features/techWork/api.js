import { mainApi } from '../../app/mainApi';
import { saveAsFile } from '../../util/files';
import { getProcesses } from '../../actions/processesActions';

const TAGS = {
  LIST: 'MAINTENANCE_LIST',
  PROCESSES: 'INTERRUPTED_PROCESSES'
};

const api = mainApi.injectEndpoints({
  endpoints: (build) => ({
    maintenanceList: build.query({
      query: (params) => ({
        url: `/ms-settings/api/v1/maintenance`,
        params
      }),
      providesTags: [TAGS.LIST]
    }),
    maintenance: build.mutation({
      query: (body) => ({
        url: `/ms-settings/api/v1/maintenance`,
        method: 'POST',
        body
      }),
      invalidatesTags: [TAGS.LIST]
    }),
    maintenanceById: build.mutation({
      query: ({ body, type, uid }) => ({
        url: `/ms-settings/api/v1/maintenance/${uid}/${type}`,
        method: 'POST',
        body
      }),
      invalidatesTags: [TAGS.LIST]
    }),
    isActiveMaintenance: build.query({
      query: () => `/ms-settings/api/v1/maintenance-active`,
      providesTags: ['IS_ACTIVE_MAINTENANCE']
    }),
    maintenanceInfo: build.query({
      query: () => `/ms-settings/api/v1/maintenance-for-user`,
      providesTags: ['MAINTENANCE_INFO']
    }),
    interruptedProcesses: build.query({
      query: (params) => ({
        url: `/ms-supervisor/api/v1/interrupted-processes`,
        params
      }),
      providesTags: [TAGS.PROCESSES]
    }),
    interruptedProcessesFiles: build.query({
      query: (uid) => ({
        url: `/ms-supervisor/api/v1/interrupted-processes/${uid}/files`
      })
    }),
    interruptedProcessesRestart: build.mutation({
      query: (uid) => ({
        url: `/ms-supervisor/api/v1/interrupted-processes/${uid}/restart`,
        method: 'POST'
      }),
      invalidatesTags: [TAGS.PROCESSES]
    }),
    getFrequencySettings: build.query({
      query: () => `/ms-settings/api/v1/process-settings/ECONSUMER/REPORT_COOLDOWN`
    }),
    updateFrequencySettings: build.mutation({
      query: (body) => ({
        url: `/ms-settings/api/v1/process-settings/ECONSUMER/REPORT_COOLDOWN`,
        method: 'PATCH',
        body
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        queryFulfilled.then((res) => {
          dispatch(
            mainApi.util.updateQueryData('getFrequencySettings', undefined, () => {
              return res.data;
            })
          );
        });
      }
    }),
    techWorkProcessUpdate: build.mutation({
      query: ({ data, uid, actionType }) => {
        return {
          url: `/ms-processes-v2/api/v1/processes/_admin/${uid}/${actionType}`,
          method: 'POST',
          body: data
        };
      },
      async onQueryStarted(_, { dispatch, getState, queryFulfilled }) {
        try {
          const state = getState();
          const res = await queryFulfilled;
          if (res?.meta?.response.ok) {
            dispatch(
              getProcesses({
                ...state?.processes?.params,
                executor_company: state?.processes?.params?.executor_company?.value || undefined
              })
            );
            return res;
          }
        } catch {
          return;
        }
      }
    }),
    reportsList: build.query({
      query: () => ({
        url: `/ms-consistency/api/v1/reports`
      })
    }),
    reportDetailsList: build.query({
      query: ({ group, name, params }) => ({
        url: `/ms-consistency/api/v1/reports/${group}/${name}`,
        params
      })
    }),
    downloadReport: build.query({
      query: ({ file_uid, name }) => ({
        url: `/ms-consistency/api/v1/reports/files/${file_uid}`,
        cache: 'no-cache',
        responseHandler: (response) => {
          response.blob().then((file) => {
            saveAsFile(file, name, response.headers.get('content-type') || '');
          });
        }
      })
    })
  }),
  overrideExisting: false
});
export const {
  useMaintenanceListQuery,
  useMaintenanceMutation,
  useMaintenanceByIdMutation,
  useIsActiveMaintenanceQuery,
  useMaintenanceInfoQuery,
  useInterruptedProcessesQuery,
  useLazyInterruptedProcessesFilesQuery,
  useInterruptedProcessesRestartMutation,
  useGetFrequencySettingsQuery,
  useUpdateFrequencySettingsMutation,
  useTechWorkProcessUpdateMutation,
  useReportsListQuery,
  useReportDetailsListQuery,
  useLazyDownloadReportQuery
} = api;
