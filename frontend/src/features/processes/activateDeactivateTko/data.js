import i18n from "../../../i18n/i18n";

export const DEACTIVATING_REASONS = [
  { value: 'CHANGES', label: i18n.t('DEACTIVATING_REASONS.CHANGES') },
  { value: 'DISMANTLING', label: i18n.t('DEACTIVATING_REASONS.DISMANTLING') },
  { value: 'DESTROY', label: i18n.t('DEACTIVATING_REASONS.DESTROY') },
  { value: 'RECONSTRUCTION', label: i18n.t('DEACTIVATING_REASONS.RECONSTRUCTION') },
  { value: 'OTHER', label: i18n.t('DEACTIVATING_REASONS.OTHER') }
];

export const CONNECTION_STATUSES = {
  Underconstruction: 'CONNECTION_STATUSES.UNDERCONSTRUCTION',
  Disconnected: 'CONNECTION_STATUSES.DISCONNECTED',
  Demolished: 'CONNECTION_STATUSES.DEMOLISHED',
  Connected: 'CONNECTION_STATUSES.CONNECTED',
  'Disconnected by GAP': 'CONNECTION_STATUSES.DISCONNECTED_BY_GAP',
  'Disconnected by Cust': 'CONNECTION_STATUSES.DISCONNECTED_BY_CUST',
};

export const ACTION_TYPES = {
  activating: 'ACTIVATE_AP',
  deactivating: 'DEACTIVATE_AP',
  reactivating: 'Reactivating',
  continueReactivating: 'Continue_Reactivating'
};

export const ACTIVATE_AP_LOG = ['Активація ТКО'];
export const DEACTIVATE_AP_LOG = ['Деактивація ТКО'];
export const REQUEST_ACTIVATE_AP_LOG = ['Запит на активацію ТКО'];