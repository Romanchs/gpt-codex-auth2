export { default as Audits } from './Routes';

export { default as AuditsRegister } from './Register';
export { default as AuditCreate } from './Create';
export { default as AuditView } from './View';

export const AUDITS_READ_PERMISSION = 'AUDITS.ACCESS';
export const AUDITS_READ_ROLES = ['АКО_Перевірки', 'АКО_ППКО', 'АТКО', 'ОЗД', 'ОДКО', 'ОЗКО'];
export const AUDITS_WRITE_PERMISSION = 'AUDITS.EDIT';
export const AUDITS_WRITE_ROLES = ['АКО_Перевірки'];
