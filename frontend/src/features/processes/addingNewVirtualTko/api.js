import { mainApi } from '../../../app/mainApi';

const BASE_API = '/ms-processes-v2/api/v1/create-metering-point';

const newVirtualTkoApi = mainApi.injectEndpoints({
  endpoints: (build) => ({
    initAddingNewVirtualTko: build.query({
      query: () => {
        return { url: BASE_API };
      }
    }),
    createAddingNewVirtualTko: build.mutation({
      query: (body) => ({
        url: BASE_API,
        method: 'POST',
        body
      }),
      transformResponse: (response) => response.uid
    }),
    getAddingNewVirtualTko: build.query({
      query: (uid) => `${BASE_API}/${uid}`,
      providesTags: ['ADDING_VIRUAL_TKO']
    }),
    updateAddingNewVirtualTko: build.mutation({
      query: ({ uid, type, body }) => ({
        url: `${BASE_API}/${uid}/${type}`,
        method: 'POST',
        body
      }),
      invalidatesTags: ['ADDING_VIRUAL_TKO']
    }),
    uploadFile: build.mutation({
      query: ({ uid, formData }) => ({
        url: `/ms-upload/api/v1/upload/create-metering-point/${uid}/xlsx`,
        method: 'POST',
        body: formData
      }),
      invalidatesTags: ['ADDING_VIRUAL_TKO']
    })
  }),
  overrideExisting: false
});

export const {
  useInitAddingNewVirtualTkoQuery,
  useCreateAddingNewVirtualTkoMutation,
  useGetAddingNewVirtualTkoQuery,
  useUpdateAddingNewVirtualTkoMutation,
  useUploadFileMutation
} = newVirtualTkoApi;
