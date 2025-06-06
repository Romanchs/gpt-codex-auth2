import { store } from '../store/store';
import { getRoleKey } from './helpers';

export const verifyRole = (roles) => {
  if (!roles) {
    return false;
  }
  const {
    user: { activeRoles }
  } = store.getState();

  if (Array.isArray(roles)) {
    for (let role of roles) {
      if (findRole(activeRoles, role)) {
        return true;
      }
    }
  } else {
    if (findRole(activeRoles, roles)) {
      return true;
    }
  }
  return false;
};

const findRole = (activeRoles, role) => {
  return activeRoles.find((activeRole) =>
    role === 'АКО...'
      ? activeRole.role.includes('COMMERCIAL METERING ADMINISTRATOR')
      : activeRole.role === getRoleKey(role)
  );
};

export const checkPermissions = (path, roleNames, rejectRoleNames = false) => {
  const state = store.getState();

  if (Object.keys(state.user.permissions).length < 1) {
    return rejectRoleNames ? !verifyRole(roleNames) : verifyRole(roleNames);
  }

  let obj = state.user.permissions;

  const properties = path.split('.');

  for (const prop of properties) {
    if (obj && prop in obj) {
      obj = obj[prop];
    } else {
      // console.error(`Permission ${prop} in path ${path} is not defined`);
      obj = -1;
      break;
    }
  }

  return obj > -1 ? obj < 2 : rejectRoleNames ? !verifyRole(roleNames) : verifyRole(roleNames);
};

export const checkOneOfPermissions = (paths, roleNames, rejectRoleNames = false) => {
  for (const path of paths) {
    if (checkPermissions(path, roleNames, rejectRoleNames)) return true;
  }
  return false;
};

export const showInitProcess = (roles) => {
  const state = store.getState();
  const permissions = state.user.permissions;

  if (Object.keys(permissions).length < 1) return verifyRole(roles);
  return Object.values(permissions.PROCESSES).filter((i) => i.INITIALIZATION > -1 && i.INITIALIZATION < 2).length > 0;
};
