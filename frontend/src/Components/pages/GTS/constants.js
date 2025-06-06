export const REPORT_TYPE = {
  BY_EIC: 'by-eic',
  BY_ZV: 'by-zv',
  BY_PARAMS: 'by-properties',
  BY_RELEASE: 'by-release',
  BY_VERSION: 'by-version',
  BY_COMPONENTS_ZV: 'by-components-zv'
};

export const GTS_REPORTS_ACCEPT_ROLES = [
  'АКО',
  'АКО_Довідники',
  'АКО_Процеси',
  'АКО_Користувачі',
  'АКО_ППКО',
  'АКО_Суперечки',
  'ОДКО',
  'АДКО',
  'ВТКО',
  'СВБ',
  'ОМ',
  'АР (перегляд розширено)'
];

export const FIELDS_SIZE = {
  customer_type: { xs: 12, sm: 6, md: 3 },
  supply_type: { xs: 12, sm: 6, md: 3 },
  meter_reading_periodicity: { xs: 12, sm: 6, md: 3 },
  type_of_accounting_point: { xs: 12, sm: 6, md: 3 },
  customer_status: { xs: 12, sm: 6, md: 3 },
  metered_data_collection_method: { xs: 12, sm: 6, md: 3 },
  settlement_method: { xs: 12, sm: 6, md: 3 },
  metering_method: { xs: 12, sm: 6, md: 3 },
  generation: { xs: 12, sm: 6, md: 3 },
  fuel: { xs: 12, sm: 6, md: 3 },
  metered_data_collector_type: { xs: 12, sm: 6, md: 3 },
  metered_responsible_party_type: { xs: 12, sm: 6, md: 3 },
  metered_data_responsible_type: { xs: 12, sm: 6, md: 3 },
  ap_profile_type: { xs: 12, sm: 6, md: 3 },
  input_output_type: { xs: 12, sm: 6, md: 3 },
  connection_status: { xs: 12, sm: 6, md: 3 },
  region_name: { xs: 12, sm: 6, md: 6 },
  voltage_level: { xs: 12, sm: 6, md: 3 },
  trade_zone: { xs: 12, sm: 6, md: 3 },
  kved: { xs: 12, sm: 6, md: 3 },
  payment_type: { xs: 12, sm: 6, md: 6 },
  territory_type: { xs: 12, sm: 6, md: 3 },
  balance_supplier__name: { xs: 12, sm: 6, md: 9 },
  balance_supplier__eic: { xs: 12, sm: 6, md: 3 },
  grid_access_provider__name: { xs: 12, sm: 6, md: 9 },
  grid_access_provider__eic: { xs: 12, sm: 6, md: 3 },
  metered_data_responsible__name: { xs: 12, sm: 6, md: 9 },
  metered_data_responsible__eic: { xs: 12, sm: 6, md: 3 },
  metered_responsible_party__name: { xs: 12, sm: 6, md: 9 },
  metered_responsible_party__eic: { xs: 12, sm: 6, md: 3 },
  metered_data_collector__name: { xs: 12, sm: 6, md: 9 },
  metered_data_collector__eic: { xs: 12, sm: 6, md: 3 },
  origin_warranty_validity_from: { xs: 12, sm: 6, md: 3 },
  origin_warranty_validity_to: { xs: 12, sm: 6, md: 3 },
  territory_type_validity_from: { xs: 12, sm: 6, md: 3 },
  territory_type_validity_to: { xs: 12, sm: 6, md: 3 },
  contracted_connection_capacity_from: { xs: 12, sm: 6, md: 3 },
  contracted_connection_capacity_to: { xs: 12, sm: 6, md: 3 },
  gen_power_from: { xs: 12, sm: 6, md: 3 },
  gen_power_to: { xs: 12, sm: 6, md: 3 },
  metering_point_amount_from: { xs: 12, sm: 6, md: 6 },
  metering_point_amount_to: { xs: 12, sm: 6, md: 6 },
  metering_grid_area__name: { xs: 12, sm: 6, md: 6 },
  metering_grid_area__eic: { xs: 12, sm: 6, md: 3 },
  add_metering_grid_area__eic: { xs: 12, sm: 6, md: 3 },
  zv__eic: { xs: 12, sm: 6, md: 3 }
};

export const REPORT_MARKET_DATA = [
  {
    label: 'GTS_REPORT_TYPE.BY_EIC',
    value: 'by_eic',
    permission: 'GTS.REPORTS.FUNCTIONS.REPORT_MARKET_FILTER.BY_EIC',
    roles: GTS_REPORTS_ACCEPT_ROLES.filter((i) => i !== 'АР (перегляд розширено)')
  },
  {
    label: 'GTS_REPORT_TYPE.BY_COMPONENTS_ZV',
    value: 'by_components_zv',
    permission: 'GTS.REPORTS.FUNCTIONS.REPORT_MARKET_FILTER.BY_COMPONENTS_ZV',
    roles: GTS_REPORTS_ACCEPT_ROLES.filter((i) => i !== 'АР (перегляд розширено)')
  },
  {
    label: 'GTS_REPORT_TYPE.BY_ZV',
    value: 'by_zv',
    permission: 'GTS.REPORTS.FUNCTIONS.REPORT_MARKET_FILTER.BY_ZV',
    roles: GTS_REPORTS_ACCEPT_ROLES.filter((i) => i !== 'АР (перегляд розширено)')
  },
  {
    label: 'GTS_REPORT_TYPE.BY_PARAMS',
    value: 'by_properties',
    permission: 'GTS.REPORTS.FUNCTIONS.REPORT_MARKET_FILTER.BY_PROPERTIES',
    roles: GTS_REPORTS_ACCEPT_ROLES.filter((i) => i !== 'АР (перегляд розширено)')
  },
  {
    label: 'GTS_REPORT_TYPE.BY_RELEASE',
    value: 'by_release',
    permission: 'GTS.REPORTS.FUNCTIONS.REPORT_MARKET_FILTER.BY_RELEASE',
    roles: GTS_REPORTS_ACCEPT_ROLES.filter((i) => i !== 'АР (перегляд розширено)')
  },
  {
    label: 'GTS_REPORT_TYPE.LAST_AGGREGATED',
    value: 'by_last_agg_mms',
    permission: 'GTS.REPORTS.FUNCTIONS.REPORT_MARKET_FILTER.BY_LAST_AGG_MMS',
    roles: ['АР (перегляд розширено)', 'АКО_Процеси']
  },
  {
    label: 'GTS_REPORT_TYPE.LAST_RELEASES',
    value: 'by_last_release',
    permission: 'GTS.REPORTS.FUNCTIONS.REPORT_MARKET_FILTER.BY_LAST_RELEASE',
    roles: ['АР (перегляд розширено)', 'АКО_Процеси']
  }
];
