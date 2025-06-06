import { mainApi } from '../../app/mainApi';
import i18n from '../../i18n/i18n';
import { saveAsFile } from '../../util/files';

export const TAGS = {
  EVENTS_DATA: 'EVENTS_DATA'
};

export const actionLog = mainApi.injectEndpoints({
  endpoints: (build) => ({
    actionLogEvents: build.query({
      query: (params) => ({
        url: `/ms-search/api/v1/events`,
        params
      })
    }),
    eventsData: build.query({
      query: (params) => ({
        url: `/ms-upload/api/v1/events-data`,
        params
      }),
      providesTags: [TAGS.EVENTS_DATA]
    }),
    eventsInit: build.query({
      query: () => ({
        url: `/ms-search/api/v1/events/init`
      }),
      transformResponse: (response) => {
        if (!response) return { tags: [], actions: [] };
        const tags = response.tags.data?.filter((t) => t !== '')?.map((t) => ({ label: t, value: t }));
        const actions = response.actions.data?.map((a) => ({ label: a, value: a }));
        return { actions, tags };
      }
    }),
    sendEvent: build.mutation({
      query: (body) => ({
        url: '/ms-events/api/v1/events',
        method: 'POST',
        body
      })
    }),
    createEventsReport: build.mutation({
      query: (body) => ({
        url: 'ms-reports/api/v1/internal-api/create-events-report/',
        method: 'POST',
        body
      }),
      invalidatesTags: [TAGS.EVENTS_DATA]
    }),
    downloadEventsData: build.mutation({
      query: () => ({
        url: 'ms-upload/api/v1/events-data/export',
        method: 'POST',
        cache: 'no-cache',
        responseHandler: response => {
          let fileName = i18n.t('PAGES.USER_ACTIONS_LOG');
          const disposition = response.headers.get('content-disposition');
          if (disposition) {
            fileName = decodeURIComponent(disposition.replaceAll('attachment; filename*=utf-8\'\'', ''));
          }
          response.blob().then(file => {
            saveAsFile(file, fileName, response.headers.get('content-type') || '');
          });
        }
      })
    })
  }),
  overrideExisting: false
});

export const { useActionLogEventsQuery, useEventsInitQuery, useSendEventMutation, useEventsDataQuery, useCreateEventsReportMutation, useDownloadEventsDataMutation } = actionLog;
