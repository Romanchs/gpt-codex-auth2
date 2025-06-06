import { enqueueSnackbar } from '../../../../actions/notistackActions';
import { mainApi } from '../../../../app/mainApi';

const BASE_API = '/ms-processes-v2/api/v1/dismantle-archive-ap';

const archiningTkoApi = mainApi.injectEndpoints({
  endpoints: (build) => ({
    createArchiningTko: build.mutation({
      query: ({ body }) => ({
        url: BASE_API,
        method: 'POST',
        body
      })
    }),
    archiningTko: build.query({
      query: (uid) => `${BASE_API}/${uid}`,
      providesTags: ['ARCHIVING_TKO']
    }),
    updateArchiningTko: build.mutation({
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
            mainApi.util.updateQueryData('archiningTko', uid, () => {
              return res.data;
            })
          );
        });
      }
    }),
    archiningTkoUpload: build.mutation({
      query: ({ uid, body }) => ({
        url: `/ms-processes-v2/api/v1/dismantle-archive-ap/${uid}/upload-ap`,
        method: 'POST',
        body
      }),
      invalidatesTags: ['ARCHIVING_TKO']
    }),
    uploadBasisDocument: build.mutation({
      query: ({ formData, uid }) => ({
        url: `/ms-processes-v2/api/v1/dismantle-archive-ap/${uid}/upload-document`,
        method: 'POST',
        body: formData
      }),
      invalidatesTags: ['ARCHIVING_TKO']
    })
  }),
  overrideExisting: false
});

export const {
  useCreateArchiningTkoMutation,
  useArchiningTkoQuery,
  useUpdateArchiningTkoMutation,
  useArchiningTkoUploadMutation,
  useUploadBasisDocumentMutation
} = archiningTkoApi;
