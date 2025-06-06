import { TOGGLE_SIDENAV, TOGGLE_USER_MENU } from '../actions/types';

export default function global(
  state = {
    openSideNav: false,
    openUserMenu: false,
    showLoading: false
  },
  action
) {
  switch (action.type) {
    case TOGGLE_SIDENAV:
      return { ...state, openSideNav: !state.openSideNav };
    case TOGGLE_USER_MENU:
      return { ...state, openUserMenu: !state.openUserMenu };
    default:
      return state;
  }
}
