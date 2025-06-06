import { mainApi } from '../../../app/mainApi';

const PROCESS_NAME_AP = 'request-to-update-basic-ap-data';

const rolesApi = mainApi.injectEndpoints({
  endpoints: (build) => ({
    updateRequestUpdateBasicAp: build.mutation({
      query: ({ uid, type, body }) => ({
        url: `/ms-processes-v2/api/v1/${PROCESS_NAME_AP}/${uid}${type}`,
        method: 'POST',
        body
      }),
      async onQueryStarted({ uid }, { dispatch, queryFulfilled }) {
        queryFulfilled.then((res) => {
          dispatch(
            mainApi.util.updateQueryData('requestUpdateBasicAp', { uid }, () => {
              return res.data;
            })
          );
        });
      }
    }),
    uploadRequestUpdateBasicAp: build.mutation({
      query: ({ uid, formData }) => ({
        url: `/ms-upload/api/v1/upload/${PROCESS_NAME_AP}/${uid}/xlsx`,
        method: 'POST',
        body: formData
      }),
      invalidatesTags: ['REQUEST_UPDATE_BASIC_AP']
    }),
    requestUpdateBasicAp: build.query({
      query: ({ uid }) => ({
        url: `/ms-processes-v2/api/v1/${PROCESS_NAME_AP}/${uid}`
      }),
      providesTags: ['REQUEST_UPDATE_BASIC_AP']
    })
  }),
  overrideExisting: false
});

export const {
  useUpdateRequestUpdateBasicApMutation,
  useUploadRequestUpdateBasicApMutation,
  useRequestUpdateBasicApQuery
} = rolesApi;
