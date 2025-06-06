import { mainApi } from '../../app/mainApi';
import { store } from '../../store/store';

const LIST = 'NOTIFICATIONS_LIST';

const notificationsApi = mainApi.injectEndpoints({
  endpoints: (build) => ({
    unreadCount: build.query({
      query: () => `/ms-notifications/api/v1/notice/unread`
    }),
    notifications: build.query({
      query: (params) => ({
        url: `/ms-notifications/api/v1/notice`,
        params
      }),
      providesTags: [LIST]
    }),
    notificationTemplates: build.query({
      query: () => `/ms-notifications/api/v1/notice/template-groups`
    }),
    deleteNotification: build.mutation({
      query: (body) => ({
        url: `/ms-notifications/api/v1/notice`,
        method: 'DELETE',
        body
      }),
      invalidatesTags: [LIST]
    }),
    readNotification: build.mutation({
      query: (body) => ({
        url: `/ms-notifications/api/v1/notice/read`,
        method: 'POST',
        body
      }),
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const res = await queryFulfilled;
          if (res?.meta?.response.ok) {
            dispatch(mainApi.util.updateQueryData('unreadCount', null, () => res?.data?.unread));
            Object.values(store.getState().mainApi.queries)
              .filter((query) => query.endpointName === 'notifications')
              .forEach(({ originalArgs }) => {
                dispatch(
                  mainApi.util.updateQueryData('notifications', originalArgs, (draft) => {
                    return {
                      ...draft,
                      data: draft.data.map((n) => (args.includes(n.id) ? { ...n, read: true } : n))
                    };
                  })
                );
              });
          }
        } catch {
          return;
        }
      }
    })
  }),
  overrideExisting: true
});

export const {
  useUnreadCountQuery,
  useNotificationsQuery,
  useNotificationTemplatesQuery,
  useDeleteNotificationMutation,
  useReadNotificationMutation
} = notificationsApi;
