import { mainApi } from '../../../app/mainApi';

const PROCESS_NAME = 'change-accounting-group-zv';
const BASE_API = `/ms-processes-v2/api/v1/${PROCESS_NAME}`;
const rolesApi = mainApi.injectEndpoints({
  endpoints: (build) => ({
    createChangeAccountingGroupZV: build.mutation({
      query: () => ({
        url: BASE_API,
        method: 'POST'
      }),
      transformResponse: (response) => response.uid
    }),
    updateChangeAccountingGroupZV: build.mutation({
      query: ({ uid, type }) => ({
        url: `${BASE_API}/${uid}${type}`,
        method: 'POST'
      }),
      async onQueryStarted({ uid }, { dispatch, queryFulfilled }) {
        queryFulfilled.then((res) => {
          dispatch(
            mainApi.util.updateQueryData('getChangeAccountingGroupZV', uid, () => {
              return res.data;
            })
          );
        });
      }
    }),
    uploadChangeAccountingGroupZV: build.mutation({
      query: ({ uid, formData }) => ({
        url: `/ms-upload/api/v1/upload/${PROCESS_NAME}/${uid}/xlsx`,
        method: 'POST',
        body: formData
      }),
      invalidatesTags: ['CHANGE_ACCOUNTING_GROUP_ZV']
    }),
    getChangeAccountingGroupZV: build.query({
      query: (uid) => ({
        url: `${BASE_API}/${uid}`
      }),
      providesTags: ['CHANGE_ACCOUNTING_GROUP_ZV']
    })
  }),
  overrideExisting: false
});

export const {
  useCreateChangeAccountingGroupZVMutation,
  useUpdateChangeAccountingGroupZVMutation,
  useUploadChangeAccountingGroupZVMutation,
  useGetChangeAccountingGroupZVQuery
} = rolesApi;
