import { CLOSE_SNACKBAR, ENQUEUE_SNACKBAR, REMOVE_SNACKBAR } from '../actions/types';

export default function notistack(
  state = {
    notifications: []
  },
  action
) {
  switch (action.type) {
    case ENQUEUE_SNACKBAR:
      return {
        ...state,
        notifications: [
          ...state.notifications,
          {
            key: action.key,
            ...action.notification
          }
        ]
      };

    case CLOSE_SNACKBAR:
      return {
        ...state,
        notifications: state.notifications.find((i) => i.key === action.key)
          ? state.notifications.map((notification) =>
              action.dismissAll || notification.key === action.key
                ? { ...notification, dismissed: true }
                : { ...notification }
            )
          : state.notifications.map((notification) => ({ ...notification, dismissed: true }))
      };

    case REMOVE_SNACKBAR:
      return {
        ...state,
        notifications: state.notifications.filter((notification) => notification.key !== action.key)
      };

    default:
      return state;
  }
}
