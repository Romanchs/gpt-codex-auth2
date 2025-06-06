import { mainApi } from '../../app/mainApi';

const propertiesTimeline = mainApi.injectEndpoints({
  endpoints: (build) => ({
    propertiesTimeline: build.query({
      query: ({ id, params }) => ({
        url: `/gateway/ms-search/api/v1/ap/properties-timeline/${id}`,
        params
      })
    }),
    propertiesTimelineDates: build.query({
      query: ({ id, params }) => ({
        url: `/gateway/ms-ap/api/v1/accounting-point-timeline-dates/${id}`,
        params
      })
    })
  }),
  overrideExisting: false
});

export const { usePropertiesTimelineQuery, usePropertiesTimelineDatesQuery } = propertiesTimeline;
