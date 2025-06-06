import { enqueueSnackbar } from '../../../../actions/notistackActions';
import { mainApi } from '../../../../app/mainApi';
import i18n from '../../../../i18n/i18n';
import { store } from '../../../../store/store';

export const TAGS = {
  EXPORT_TKO_SETTINGS: 'EXPORT_TKO_SETTINGS',
  END_OF_SUPPLY: 'END_OF_SUPPLY',
  END_OF_SUPPLY_FILES: 'END_OF_SUPPLY_FILES'
};

const BASE_API = '/ms-processes-v2/api/v1/export-tko/';
export const api = mainApi.injectEndpoints({
  endpoints: (build) => ({
    initExportTko: build.mutation({
      query: ({ type, body }) => ({
        url: BASE_API + type,
        method: 'POST',
        body
      })
    }),
    settingsExportTko: build.query({
      query: (params) => ({
        url: BASE_API + 'settings',
        params
      }),
      providesTags: [TAGS.EXPORT_TKO_SETTINGS]
    }),
    organizationsExportTko: build.query({
      query: (params) => ({
        url: '/ms-companies/api/v1/company-info-small-list',
        params
      })
    }),
    exportTko: build.query({
      query: ({ uid, params }) => ({
        url: BASE_API + uid,
        params
      })
    }),
    createEndOfSupply: build.mutation({
      query: (body) => ({
        url: '/ms-processes-v2/api/v1/end-supply',
        method: 'POST',
        body
      })
    }),
    endOfSupply: build.query({
      query: ({ uid, params }) => ({
        url: `/ms-processes-v2/api/v1/end-supply/${uid}`,
        params
      }),
      providesTags: [TAGS.END_OF_SUPPLY]
    }),
    endOfSupplyFiles: build.query({
      query: (uid) => ({
        url: `/ms-processes-v2/api/v1/end-supply/${uid}/files`
      }),
      providesTags: [TAGS.END_OF_SUPPLY_FILES]
    }),
    uploadProlongationFile: build.mutation({
      query: ({ uid, formData }) => ({
        url: `/ms-processes-v2/api/v1/end-supply/${uid}/upload`,
        method: 'PATCH',
        body: formData ?? {}
      }),
      invalidatesTags: [TAGS.END_OF_SUPPLY_FILES, TAGS.END_OF_SUPPLY]
    }),
    updateAp: build.mutation({
      query: ({ uid, body, check }) => ({
        url: `/ms-processes-v2/api/v1/end-supply/${uid}/${check ? 'bind-ap' : 'unbind-ap'}`,
        method: 'POST',
        body
      }),
      async onQueryStarted({ uid, body, params, check }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          mainApi.util.updateQueryData('endOfSupply', { uid, params }, (data) => {
            data.move_to_slr_aps_amount = check ? data.move_to_slr_aps_amount + 1 : data.move_to_slr_aps_amount - 1;
            data.aps.data = data.aps.data.map((ap) => (ap.uid === body.ap_uid ? { ...ap, is_checked: check } : ap));
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      }
    }),
    formEndOfSupply: build.mutation({
      query: (uid) => ({
        url: `/ms-processes-v2/api/v1/end-supply/${uid}/form`,
        method: 'POST'
      }),
      invalidatesTags: [TAGS.END_OF_SUPPLY]
    }),
    exportEosAps: build.query({
      query: (uid) => ({
        url: `/ms-processes-v2/api/v1/end-supply/${uid}/export-ap`,
        cache: 'no-cache',
        responseHandler: (response) => {
          store.dispatch(
            enqueueSnackbar({
              message: i18n.t('NOTIFICATIONS.FILE_STARTED_FORMING'),
              options: {
                key: new Date().getTime() + Math.random(),
                variant: 'success',
                autoHideDuration: 5000
              }
            })
          );
          return response;
        }
      })
    }),

    // CHANGE TKO
    changeTkoForm: build.mutation({
      query: (uid) => ({
        url: `/ms-processes-v2/api/v1/update-tko-data/${uid}/to-form`,
        method: 'POST'
      })
    }),
    changeTkoFormTakeToWork: build.mutation({
      query: (uid) => ({
        url: `/ms-processes-v2/api/v1/update-tko-data/${uid}/take-to-work`,
        method: 'POST'
      })
    }),
    changeTkoReject: build.mutation({
      query: ({ uid, body }) => ({
        url: `/ms-processes-v2/api/v1/update-tko-data/${uid}/reject`,
        method: 'POST',
        body
      })
    }),
    changeTkoProlong: build.mutation({
      query: (uid) => ({
        url: `/ms-processes-v2/api/v1/update-tko-data/${uid}/prolong`,
        method: 'POST'
      })
    })
  }),
  overrideExisting: false
});

export const {
  useInitExportTkoMutation,
  useSettingsExportTkoQuery,
  useOrganizationsExportTkoQuery,
  useExportTkoQuery,
  useCreateEndOfSupplyMutation,
  useEndOfSupplyQuery,
  useEndOfSupplyFilesQuery,
  useUploadProlongationFileMutation,
  useUpdateApMutation,
  useFormEndOfSupplyMutation,
  useLazyExportEosApsQuery,

  useChangeTkoFormMutation,
  useChangeTkoFormTakeToWorkMutation,
  useChangeTkoRejectMutation,
  useChangeTkoProlongMutation
} = api;
