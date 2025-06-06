export const DISCONNECTION_REASONS = [
  'termination_of_operation',
  'sale_transfer',
  'expiration_contract',
  'presence_debt_unauthorized_withdrawl',
  'non_supply_payment',
  'non_payment',
  'unauthorized_selection',
  'debt',
  'unauthorized_restoration',
  'system_tests',
  'failure_to_comply',
  'non_admission',
  'violation_of_the_rules',
  'repairs_tests',
  'termination_of_supply'
].map((i) => ({ value: i, label: `DISCONNECTION_AP_REASONS.${i.toUpperCase()}` }));

export const CONNECTION_STATUSES = {
  Underconstruction: 'CONNECTION_STATUSES.UNDERCONSTRUCTION',
  Disconnected: 'CONNECTION_STATUSES.DISCONNECTED',
  Demolished: 'CONNECTION_STATUSES.DEMOLISHED',
  'Disconnected by GAP': 'CONNECTION_STATUSES.DISCONNECTED_BY_GAP',
  'Disconnected by GAP&BS': 'CONNECTION_STATUSES.DISCONNECTED_BY_GAP&BS',
  'Disconnected by Cust': 'CONNECTION_STATUSES.DISCONNECTED_BY_CUST',
  Connected: 'CONNECTION_STATUSES.CONNECTED'
};
