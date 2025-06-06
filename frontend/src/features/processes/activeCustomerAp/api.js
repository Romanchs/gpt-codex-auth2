import { mainApi } from '../../../app/mainApi';

const BASE_API = '/ms-processes-v2/api/v1/active-customer-ap';


const activeCustomerApApi = mainApi.injectEndpoints({
  endpoints: (build) => ({
    createActiveCustomerAp: build.mutation({
      query: (body) => ({
        url: BASE_API,
        method: 'POST',
        body
      }),
      transformResponse: (response) => response.uid
    }),
    getActiveCustomerAp: build.query({
      query: (uid) => ({
        url: `${BASE_API}/${uid}`
      }),
      providesTags: ['ACTIVE_CUSTOMER_AP']
    }),
    updateActiveCustomerAp: build.mutation({
      query: ({ uid, type }) => ({
        url: `${BASE_API}/${uid}${type}`,
        method: 'POST'
      }),
      async onQueryStarted({ uid }, { dispatch, queryFulfilled }) {
        queryFulfilled.then((res) => {
          dispatch(
            mainApi.util.updateQueryData('getActiveCustomerAp', uid, () => {
              return res.data;
            })
          );
        });
      }
    }),
    uploadActiveCustomerAp: build.mutation({
      query: ({ uid, formData }) => ({
        url: `${BASE_API}/${uid}/upload`,
        method: 'POST',
        body: formData
      }),
      async onQueryStarted({ uid }, { dispatch, queryFulfilled }) {
        try {
          const res = await queryFulfilled;
          if (res?.meta?.response.ok) {
            dispatch(
              mainApi.util.updateQueryData('getActiveCustomerAp', uid, () => {
                return res.data;
              })
            );
          }
        } catch {
          return;
        }
      }
    })
  }),
  overrideExisting: false
});

export const {
  useCreateActiveCustomerApMutation,
  useGetActiveCustomerApQuery,
  useUpdateActiveCustomerApMutation,
  useUploadActiveCustomerApMutation
} = activeCustomerApApi;
