import { mainApi } from '../../../app/mainApi';

const BASE_API = '/ms-processes-v2/api/v1/new-ap-properties';

export const newApPropertiesApi = mainApi.injectEndpoints({
  endpoints: (build) => ({
    createNewApProperties: build.mutation({
      query: ( body ) => ({
        url: BASE_API,
        method: 'POST',
        body
      }),
      transformResponse: (response) => response.uid
    }),
    newApProperties: build.query({
      query: (uid) => `${BASE_API}/${uid}`,
      providesTags: ['ADD_NEW_AP_PROPERTIES']
    }),
    updateNewApProperties: build.mutation({
      query: ({ uid, type, body }) => ({
        url: `${BASE_API}/${uid}/${type}`,
        method: 'POST',
        body
      }),
      async onQueryStarted({uid}, { dispatch, queryFulfilled }) {
        try {
          const res = await queryFulfilled;
          if (res?.meta?.response.ok) {
            dispatch(mainApi.util.updateQueryData('newApProperties', uid, () => res?.data));
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
  useNewApPropertiesQuery,
  useCreateNewApPropertiesMutation,
  useUpdateNewApPropertiesMutation
} = newApPropertiesApi;
