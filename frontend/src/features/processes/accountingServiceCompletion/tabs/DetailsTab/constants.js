export const roleOptions = [
  { value: 'meter_point_admin', label: 'ROLES.METERING_POINT_ADMINISTRATOR' },
  { value: 'meter_data_collector', label: 'ROLES.METERED_DATA_COLLECTOR' },
  { value: 'meter_data_responsible', label: 'ROLES.METERED_DATA_RESPONSIBLE' },
  { value: 'meter_operator', label: 'ROLES.METER_OPERATOR' }
];

export const defaultColumns = [
  { title: 'FIELDS.AP_CODE_TYPE_Z', key: 'eic' },
  { title: 'FIELDS.CONNECTION_STATUS', key: 'connection_status' },
  { title: 'FIELDS.AP_CUSTOMER_CODE', key: 'customer' },
  { title: 'FIELDS.REGION', key: 'region' },
  { title: 'FIELDS.CITY', key: 'city' },
  {
    title: 'FIELDS.DROPPED_OUT_OF_PROCESS',
    key: 'dropped_out_of_process',
    minWidth: 200
  }
];
