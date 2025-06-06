import { store } from '../store/store';

export const verifyPermission = (permission) => {
  const {
    user: { permissions }
  } = store.getState();

  return permissions.includes(permission);
};
