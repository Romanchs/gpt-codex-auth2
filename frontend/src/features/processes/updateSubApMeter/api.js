import { mainApi } from '../../../app/mainApi';

const updateSubApMeterApi = mainApi.injectEndpoints({
  endpoints: (build) => ({
    updateSubApMeterReasons: build.query({
      query: () => `ms-reference-book/api/v1/reference-book/300-20?fields=name_en,name_ua,key`
    }),
    updateSubApMeter: build.query({
      query: (id) => ({
        url: `/ms-processes-v2/api/v1/update-sub-ap-meter/${id}`
      }),
      providesTags: ['SUB_AP_METER']
    }),
    createUpdateSubApMeter: build.mutation({
      query: (body) => ({
        url: '/ms-processes-v2/api/v1/update-sub-ap-meter',
        method: 'POST',
        body
      })
    }),
    updateUpdateSubApMeter: build.mutation({
      query: ({ uid, type, body }) => ({
        url: `/ms-processes-v2/api/v1/update-sub-ap-meter/${uid}/${type}`,
        method: 'POST',
        body
      }),
      invalidatesTags: ['SUB_AP_METER']
    })
  })
});

export const {
  useUpdateSubApMeterReasonsQuery,
  useUpdateSubApMeterQuery,
  useCreateUpdateSubApMeterMutation,
  useUpdateUpdateSubApMeterMutation
} = updateSubApMeterApi;
