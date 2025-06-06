import { mainApi } from '../../../app/mainApi';

const PROCESS_NAME_CUSTOMERS = 'request-to-update-customers';

const requestToUpdateCustomersApi = mainApi.injectEndpoints({
  endpoints: (build) => ({
    updateRequestToUpdateCustomers: build.mutation({
      query: ({ uid, type, body }) => ({
        url: `/ms-processes-v2/api/v1/${PROCESS_NAME_CUSTOMERS}/${uid}${type}`,
        method: 'POST',
        body
      }),
      async onQueryStarted({ uid }, { dispatch, queryFulfilled }) {
        queryFulfilled.then((res) => {
          dispatch(
            mainApi.util.updateQueryData('requestToUpdateCustomers', { uid }, () => {
              return res.data;
            })
          );
        }).catch((error) => error);
      }
    }),
    uploadRequestToUpdateCustomers: build.mutation({
      query: ({ uid, formData }) => ({
        url: `/ms-upload/api/v1/upload/${PROCESS_NAME_CUSTOMERS}/${uid}/xlsx`,
        method: 'POST',
        body: formData
      }),
      invalidatesTags: ['REQUEST_UPDATE_CUSTOMERS']
    }),
    requestToUpdateCustomers: build.query({
      query: ({ uid }) => ({
        url: `/ms-processes-v2/api/v1/${PROCESS_NAME_CUSTOMERS}/${uid}`
      }),
      providesTags: ['REQUEST_UPDATE_CUSTOMERS']
    })
  }),
  overrideExisting: false
});

export const {
  useUpdateRequestToUpdateCustomersMutation,
  useUploadRequestToUpdateCustomersMutation,
  useRequestToUpdateCustomersQuery
} = requestToUpdateCustomersApi;
