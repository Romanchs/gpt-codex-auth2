import i18n from '../../../i18n/i18n';

export const process_types = [
  { label: 'DELETE_DATA', value: 'Видалення' },
  { label: 'ARCHIVING', value: 'Демонтаж' },
  { label: 'UN_ARCHIVING', value: 'Деархівація' },
];

export const deleting_reason_types = [
  { value: 1, label: 'DELETE_AP_REASONS.TWO_EIC_CODES_FOR_SAME_SITE' },
  { value: 2, label: 'DELETE_AP_REASONS.CORRECTION_NEEDED' },
  { value: 3, label: 'DELETE_AP_REASONS.OTHER' }
];

export const ap_statuses = [
  { value: 'Активована', label: 'ACTIVATED' }
  // {value: 'Створена', label: 'Створені'}
];

export const completedText = {
  REJECTED: i18n.t('ABOLTION'),
  CANCELED: i18n.t('ABOLTION')
};

export const archiving_reson_types = {
  installation_ap: [
    { value: 1, label: 'ARCHIVING_REASON_TYPES.DISMANTLING_OF_EQUIPMENT' },
    { value: 2, label: 'ARCHIVING_REASON_TYPES.DESTRUCTION' },
    { value: 3, label: 'ARCHIVING_REASON_TYPES.MERGE' },
    { value: 4, label: 'ARCHIVING_REASON_TYPES.OTHER' }
  ],
  by_voltage_level: [
    { value: 1, label: 'ARCHIVING_REASON_TYPES.DISMANTLING_OF_EQUIPMENT' },
    { value: 2, label: 'ARCHIVING_REASON_TYPES.DESTRUCTION' },
    { value: 4, label: 'ARCHIVING_REASON_TYPES.OTHER' }
  ],
  by_grid_party: [
    { value: 1, label: 'ARCHIVING_REASON_TYPES.DISMANTLING_OF_EQUIPMENT' },
    { value: 2, label: 'ARCHIVING_REASON_TYPES.DESTRUCTION' },
    { value: 4, label: 'ARCHIVING_REASON_TYPES.OTHER' }
  ],
  consumption_for_non_domestic_needs: [{ value: 4, label: 'ARCHIVING_REASON_TYPES.OTHER' }],
  consumption_for_domestic_needs: [{ value: 4, label: 'ARCHIVING_REASON_TYPES.OTHER' }],
  consumption_in_static_capacitor: [{ value: 4, label: 'ARCHIVING_REASON_TYPES.OTHER' }],
  consumption: [{ value: 4, label: 'ARCHIVING_REASON_TYPES.OTHER' }],
  release_generation_unit: [{ value: 4, label: 'ARCHIVING_REASON_TYPES.OTHER' }],
  losses: [{ value: 4, label: 'ARCHIVING_REASON_TYPES.OTHER' }],
  generation: [{ value: 4, label: 'ARCHIVING_REASON_TYPES.OTHER' }],
  own_consumption: [{ value: 4, label: 'ARCHIVING_REASON_TYPES.OTHER' }],
  accumulation_consumption: [
    { value: 1, label: 'ARCHIVING_REASON_TYPES.DISMANTLING_OF_EQUIPMENT' },
    { value: 2, label: 'ARCHIVING_REASON_TYPES.DESTRUCTION' },
    { value: 4, label: 'ARCHIVING_REASON_TYPES.OTHER' }
  ],
  queue_generation: [
    { value: 1, label: 'ARCHIVING_REASON_TYPES.DISMANTLING_OF_EQUIPMENT' },
    { value: 2, label: 'ARCHIVING_REASON_TYPES.DESTRUCTION' },
    { value: 3, label: 'ARCHIVING_REASON_TYPES.MERGE' },
    { value: 4, label: 'ARCHIVING_REASON_TYPES.OTHER' }
  ],
  generation_unit: [
    { value: 1, label: 'ARCHIVING_REASON_TYPES.DISMANTLING_OF_EQUIPMENT' },
    { value: 2, label: 'ARCHIVING_REASON_TYPES.DESTRUCTION' },
    { value: 4, label: 'ARCHIVING_REASON_TYPES.OTHER' }
  ],
  standard_unit: [
    { value: 1, label: 'ARCHIVING_REASON_TYPES.DISMANTLING_OF_EQUIPMENT' },
    { value: 2, label: 'ARCHIVING_REASON_TYPES.DESTRUCTION' },
    { value: 4, label: 'ARCHIVING_REASON_TYPES.OTHER' }
  ]
};
