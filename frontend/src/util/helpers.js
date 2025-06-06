import { store } from '../store/store';
import { ROLES } from './directories';

export const isUkrinterenergoSVB = () => {
  const state = store.getState();
  return state.user.activeOrganization.eic === '11XUIE---------M' && state.user.activeRoles[0].role === 'BALANCE SUPPLIER';
}

export const isNEK = () => {
  const state = store.getState();
  return state.user.activeOrganization.eic === '10X1001C--00001X';
};

export const isATKO = () => {
  const state = store.getState();
  return state.user.activeRoles[0].role === 'METERING POINT ADMINISTRATOR';
};

export const getRoleKey = (ua_name) => {
  return Object.keys(ROLES).find((key) => ROLES[key] === ua_name);
};

export const isIntegerOrNull = (value) => {
  return !value || /^[0-9]+$/.test(value);
};

export const clearLocalStorage = () => {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('TECH_WORK_PLANNED');
};
