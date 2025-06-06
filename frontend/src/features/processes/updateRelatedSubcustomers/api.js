import { mainApi } from '../../../app/mainApi';

const PROCESS_NAME = 'update-related-subcustomers';
const BASE_API = `/ms-processes-v2/api/v1/${PROCESS_NAME}`;
const rolesApi = mainApi.injectEndpoints({
  endpoints: (build) => ({
    createUpdateRelatedSubcustomers: build.mutation({
      query: () => ({
        url: BASE_API,
        method: 'POST'
      }),
      transformResponse: (response) => response.uid
    }),
    updateUpdateRelatedSubcustomers: build.mutation({
      query: ({ uid, type }) => ({
        url: `${BASE_API}/${uid}${type}`,
        method: 'POST'
      }),
      async onQueryStarted({ uid }, { dispatch, queryFulfilled }) {
        queryFulfilled.then((res) => {
          dispatch(
            mainApi.util.updateQueryData('getUpdateRelatedSubcustomers', uid, () => {
              return res.data;
            })
          );
        });
      }
    }),
    uploadUpdateRelatedSubcustomers: build.mutation({
      query: ({ uid, formData }) => ({
        url: `/ms-upload/api/v1/upload/${PROCESS_NAME}/${uid}/xlsx`,
        method: 'POST',
        body: formData
      }),
      invalidatesTags: ['UPDATE_RELATED_SUBCUSTOMERS']
    }),
    getUpdateRelatedSubcustomers: build.query({
      query: (uid) => ({
        url: `${BASE_API}/${uid}`
      }),
      providesTags: ['UPDATE_RELATED_SUBCUSTOMERS']
    })
  }),
  overrideExisting: false
});

export const {
  useCreateUpdateRelatedSubcustomersMutation,
  useUpdateUpdateRelatedSubcustomersMutation,
  useUploadUpdateRelatedSubcustomersMutation,
  useGetUpdateRelatedSubcustomersQuery
} = rolesApi;
