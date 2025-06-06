import { mainApi } from '../../../app/mainApi';

const activateDeactivateTko = mainApi.injectEndpoints({
  endpoints: (build) => ({
    createActivateDeactivateTko: build.mutation({
      query: (body) => ({
        url: `/ms-processes-v2/api/v1/activate-deactivate-ap`,
        method: 'POST',
        body
      })
    }),
    activateDeactivateTkoProcess: build.query({
      query: (uid) => ({
        url: `/ms-processes-v2/api/v1/activate-deactivate-ap/${uid}`
      }),
      providesTags: ['ACTIVATE_DEACTIVATE_DETAILS']
    }),
    activateDeactivateAps: build.query({
      query: ({ uid, params }) => ({
        url: `/ms-processes-v2/api/v1/activate-deactivate-ap/${uid}/aps`,
        params
      }),
      providesTags: ['UPLOADED_TKO']
    }),
    cancelActivateDeactivateTko: build.mutation({
      query: (uid) => ({
        url: `/ms-processes-v2/api/v1/activate-deactivate-ap/${uid}/cancel`,
        method: 'POST',
        body: { uid }
      }),
      async onQueryStarted(uid, { dispatch, queryFulfilled }) {
        queryFulfilled.then((res) => {
          dispatch(
            mainApi.util.updateQueryData('activateDeactivateTkoProcess', uid, () => {
              return res.data;
            })
          );
        });
      }
    }),
    formedActivateDeactivateTko: build.mutation({
      query: ({ uid, body }) => ({
        url: `/ms-processes-v2/api/v1/activate-deactivate-ap/${uid}/formed`,
        method: 'POST',
        body
      }),
      async onQueryStarted({ uid }, { dispatch, queryFulfilled }) {
        queryFulfilled.then((res) => {
          dispatch(
            mainApi.util.updateQueryData('activateDeactivateTkoProcess', uid, () => {
              return res.data;
            })
          );
        });
      }
    }),
    removeAccountingPoint: build.mutation({
      query: ({ uid, ap_uid, body }) => ({
        url: `/ms-processes-v2/api/v1/activate-deactivate-ap/${uid}/remove-point/${ap_uid}`,
        method: 'POST',
        body
      }),
      async onQueryStarted({ uid }, { dispatch, queryFulfilled }) {
        queryFulfilled.then((res) => {
          dispatch(mainApi.util.invalidateTags(['UPLOADED_TKO']));
          dispatch(
            mainApi.util.updateQueryData('activateDeactivateTkoProcess', uid, () => {
              return res.data;
            })
          );
        });
      }
    }),
    uploadFileWithTKO: build.mutation({
      query: ({ body, uid }) => ({
        url: `ms-processes-v2/api/v1/activate-deactivate-ap/${uid}/upload`,
        method: 'POST',
        body: body
      }),
      invalidatesTags: ['ACTIVATE_DEACTIVATE_DETAILS', 'UPLOADED_TKO']
    }),
    requestForProvider: build.query({
      query: ({ uid, params }) => {
        return {
          url: `/ms-processes-v2/api/v1/activate-deactivate-ap/${uid}/subprocesses`,
          params
        };
      }
    })
  }),
  overrideExisting: false
});

export const {
  useCreateActivateDeactivateTkoMutation,
  useActivateDeactivateTkoProcessQuery,
  useActivateDeactivateApsQuery,
  useCancelActivateDeactivateTkoMutation,
  useFormedActivateDeactivateTkoMutation,
  useUploadFileWithTKOMutation,
  useRemoveAccountingPointMutation,
  useRequestForProviderQuery
} = activateDeactivateTko;
