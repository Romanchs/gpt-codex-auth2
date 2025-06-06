import { mainApi } from '../../app/mainApi';

const instructionsApi = mainApi.injectEndpoints({
  endpoints: (build) => ({
    instructions: build.query({
      query: ({ isAdmin }) => {
        return {
          url: isAdmin ? '/ms-faq/api/v1/instructions/list' : '/ms-faq/api/v1/instructions/info/user',
        };
      },
      transformResponse: (res) => sortInstructions(res),
      providesTags: ['GET_INSTRUCTIOS_LIST']
    }),
    uploadInstruction: build.mutation({
      query: ({ uid, file_uid, body }) => {
        return {
          url: `/ms-faq/api/v1/instructions/update/${uid}/file-id/${file_uid}`,
          method: 'PATCH',
          body: body ?? {}
        };
      },
      invalidatesTags: ['GET_INSTRUCTIOS_LIST']
    }),
    addNewInstruction: build.mutation({
      query: (body) => {
        return {
          url: '/ms-faq/api/v1/instructions/',
          method: 'POST',
          body
        };
      },
      invalidatesTags: ['GET_INSTRUCTIOS_LIST']
    }),
    deleteInstruction: build.mutation({
      query: (body) => {
        return {
          url: '/ms-faq/api/v1/instructions/delete',
          method: 'DELETE',
          body
        };
      },
      transformResponse: (res) => sortInstructions(res),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const res = await queryFulfilled;
          if (res?.meta?.response.ok) {
            dispatch(
              mainApi.util.updateQueryData('instructions', { isAdmin: true }, () => {
                return res.data;
              })
            );
          }
        } catch {
          return;
        }
      }
    }),
    editInstruction: build.mutation({
      query: (body) => {
        return {
          url: '/ms-faq/api/v1/instructions/update',
          method: 'PATCH',
          body
        };
      },
      transformResponse: (res) => sortInstructions(res),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const res = await queryFulfilled;
          if (res?.meta?.response.ok) {
            dispatch(
              mainApi.util.updateQueryData('instructions', { isAdmin: true }, () => {
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
  useInstructionsQuery,
  useUploadInstructionMutation,
  useAddNewInstructionMutation,
  useDeleteInstructionMutation,
  useEditInstructionMutation } = instructionsApi;


const sortInstructions = (instructions) => {
  const sortOrder = [
    "CMP_REGISTER",
    "PROCESSES_OVER_CPM",
    "WORK_WITH_CMD",
    "DISPUTES",
    "CMSP_BLOCK",
    "RECEIVING_REPORTS",
    "TECHNICEL_BLOCK"
  ];

  return instructions.sort((a, b) => sortOrder.indexOf(a.chapter) - sortOrder.indexOf(b.chapter));
}