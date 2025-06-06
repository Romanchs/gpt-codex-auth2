import { mainApi } from '../../../../app/mainApi';

const requestActivateAp = mainApi.injectEndpoints({
  endpoints: (build) => ({
    requestActivateAp: build.query({
      query: (uid) => ({
        url: `/ms-processes-v2/api/v1/request-activate-ap/${uid}`
      }),
      providesTags: ['REQUEST_ACTIVATE_ACCOUNTING_POINT']
    }),
    doneRequestActivateAp: build.mutation({
      query: (uid) => ({
        url: `/ms-processes-v2/api/v1/request-activate-ap/${uid}/done`,
        method: 'POST',
        body: { uid }
      }),
      async onQueryStarted(uid, { dispatch, queryFulfilled }) {
        queryFulfilled.then((res) => {
          dispatch(
            mainApi.util.updateQueryData('requestActivateAp', uid, () => {
              return res.data;
            })
          );
        });
      }
    }),
    takeToWorkRequestActivateAp: build.mutation({
      query: (uid) => ({
        url: `/ms-processes-v2/api/v1/request-activate-ap/${uid}/take-to-work`,
        method: 'POST',
        body: { uid }
      }),
      async onQueryStarted(uid, { dispatch, queryFulfilled }) {
        queryFulfilled.then((res) => {
          dispatch(
            mainApi.util.updateQueryData('requestActivateAp', uid, () => {
              return res.data;
            })
          );
        });
      }
    }),
    uploadRequestActivateApFile: build.mutation({
      query: ({ body, uid }) => ({
        url: `ms-processes-v2/api/v1/request-activate-ap/${uid}/upload`,
        method: 'POST',
        body: body
      }),
      invalidatesTags: ['REQUEST_ACTIVATE_ACCOUNTING_POINT']
    })
  }),
  overrideExisting: false
});

export const {
  useRequestActivateApQuery,
  useUploadRequestActivateApFileMutation,
  useDoneRequestActivateApMutation,
  useTakeToWorkRequestActivateApMutation
} = requestActivateAp;
