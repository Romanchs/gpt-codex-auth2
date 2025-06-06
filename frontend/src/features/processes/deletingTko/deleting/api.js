import { enqueueSnackbar } from '../../../../actions/notistackActions';
import { mainApi } from '../../../../app/mainApi';

const BASE_API = '/ms-processes-v2/api/v1/delete-archive-ap';

const deletingTkoApi = mainApi.injectEndpoints({
  endpoints: (build) => ({
    createDeletingTko: build.mutation({
      query: ({ body }) => ({
        url: BASE_API,
        method: 'POST',
        body
      })
    }),
    initDeletingTko: build.query({
      query: () => ({
        url: `${BASE_API}`
      })
    }),
    deletingTko: build.query({
      query: (uid) => `${BASE_API}/${uid}`,
      providesTags: ['DELETING_TKO'],
      keepUnusedDataFor: 0
    }),
    updateDeletingTko: build.mutation({
      query: ({ uid, type, body }) => ({
        url: `${BASE_API}/${uid}/${type}`,
        method: type === 'approve' ? 'PATCH' : 'POST',
        body: body ?? {}
      }),
      async onQueryStarted({ uid }, { dispatch, queryFulfilled }) {
        queryFulfilled.then((res) => {
          if (res.data?.alert) {
            dispatch(
              enqueueSnackbar({
                message: res.data.alert,
                options: {
                  key: new Date().getTime() + Math.random(),
                  variant: 'success',
                  autoHideDuration: 5000
                }
              })
            );
          }
          dispatch(
            mainApi.util.updateQueryData('deletingTko', uid, () => {
              return res.data;
            })
          );
        });
      }
    }),
    deletingTkoUpload: build.mutation({
      query: ({ uid, body }) => ({
        url: `/ms-processes-v2/api/v1/delete-archive-ap/${uid}/upload`,
        method: 'POST',
        body
      }),
      async onQueryStarted({ uid }, { dispatch, queryFulfilled }) {
        queryFulfilled.then((res) => {
          dispatch(mainApi.util.updateQueryData('deletingTko', uid, () => res.data));
        });
      }
    })
  }),
  overrideExisting: false
});

export const {
  useCreateDeletingTkoMutation,
  useInitDeletingTkoQuery,
  useDeletingTkoQuery,
  useUpdateDeletingTkoMutation,
  useDeletingTkoUploadMutation
} = deletingTkoApi;
