import { mainApi } from '../../app/mainApi';

const TAGS = {
  TEMPLATES: 'FAQ__TEMPLATES',
  CONTENT: 'FAQ__CONTENT'
};

const faqApi = mainApi.injectEndpoints({
  endpoints: (build) => ({
    faqTemplates: build.query({
      query: (params) => ({
        url: `/ms-faq/api/v1/faq/list`,
        params
      }),
      providesTags: [TAGS.TEMPLATES]
    }),
    faqByUid: build.query({
      query: (params) => ({
        url: `/ms-faq/api/v1/faq/content`,
        params
      }),
      providesTags: [TAGS.CONTENT]
    }),
    faqByKey: build.query({
      query: (params) => ({
        url: `/ms-faq/api/v1/faq/content/user`,
        params
      })
    }),
    createFaq: build.mutation({
      query: (body) => ({
        url: `/ms-faq/api/v1/faq`,
        method: 'POST',
        body
      }),
      invalidatesTags: [TAGS.TEMPLATES]
    }),
    copyFaq: build.mutation({
      query: (body) => ({
        url: `/ms-faq/api/v1/faq/copy`,
        method: 'POST',
        body
      }),
      invalidatesTags: [TAGS.TEMPLATES]
    }),
    updateFaq: build.mutation({
      query: (body) => ({
        url: `/ms-faq/api/v1/faq/update`,
        method: 'PATCH',
        body: body ?? {}
      }),
      invalidatesTags: (result, error, args) => {
        if (args?.content) return [TAGS.TEMPLATES, TAGS.CONTENT];
        return [TAGS.TEMPLATES];
      }
    }),
    deleteFaq: build.mutation({
      query: (body) => ({
        url: `/ms-faq/api/v1/faq/delete`,
        method: 'DELETE',
        body
      }),
      invalidatesTags: [TAGS.TEMPLATES]
    })
  }),
  overrideExisting: true
});

export const {
  useFaqTemplatesQuery,
  useFaqByUidQuery,
  useFaqByKeyQuery,
  useCreateFaqMutation,
  useCopyFaqMutation,
  useUpdateFaqMutation,
  useDeleteFaqMutation
} = faqApi;
