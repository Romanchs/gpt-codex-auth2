import { checkPermissions } from '../../../../util/verifyRole';

export const defaultParams = {
  page: 1,
  size: 25,
  point_type: 'installation_ap'
};

export const DEFAULT_SEARCH_START = 3;

const AKO_ = ['АКО_Довідники', 'АКО_Користувачі', 'АКО_Суперечки', 'АКО_ППКО', 'АКО_Перевірки', 'АКО_Процеси'];

export const pointTypeList = [
  { value: 'installation_ap', label: 'PLATFORM.INSTALLATION_AP', visible: () => true },
  {
    value: 'generation',
    label: 'PLATFORM.GENERATION',
    visible: () =>
      checkPermissions('TKO.LIST.FUNCTIONS.POINT_TYPE_LIST.GENERATION', ['АКО', ...AKO_, 'АТКО', 'ОЗКО', 'ОДКО'])
  },
  {
    value: 'own_consumption',
    label: 'PLATFORM.OWN_CONSUMPTION',
    visible: () =>
      checkPermissions('TKO.LIST.FUNCTIONS.POINT_TYPE_LIST.OWN_CONSUMPTION', ['АКО', ...AKO_, 'АТКО', 'ОЗКО', 'ОДКО'])
  },
  {
    value: 'accumulation_consumption',
    label: 'CHARACTERISTICS.ACCUMULATION_FOR_PRODUCTION_NEEDS',
    visible: () =>
      checkPermissions('TKO.LIST.FUNCTIONS.POINT_TYPE_LIST.ACCUMULATION_CONSUMPTION', [
        'АКО',
        ...AKO_,
        'АТКО',
        'ОЗКО',
        'ОДКО'
      ])
  },
  {
    value: 'generation_unit',
    label: 'PLATFORM.GENERATION_UNIT',
    visible: () =>
      checkPermissions('TKO.LIST.FUNCTIONS.POINT_TYPE_LIST.GENERATION_UNIT', [
        'АКО',
        ...AKO_,
        'АТКО',
        'СВБ',
        'ГарПок',
        'ОЗКО',
        'ОДКО',
        'ОМ'
      ])
  },
  {
    value: 'ts_generation_unit',
    label: 'PLATFORM.TS_GENERATION_UNIT',
    visible: () =>
      checkPermissions('TKO.LIST.FUNCTIONS.POINT_TYPE_LIST.TS_GENERATION_UNIT', [
        'АКО',
        ...AKO_,
        'АТКО',
        'ОЗКО',
        'ОДКО',
        'ОМ'
      ])
  },
  {
    value: 'by_voltage_level',
    label: 'PLATFORM.BY_VOLTAGE_LEVEL',
    visible: () =>
      checkPermissions('TKO.LIST.FUNCTIONS.POINT_TYPE_LIST.BY_VOLTAGE_LEVEL', [
        'АКО',
        ...AKO_,
        'АТКО',
        'СВБ',
        'ОЗКО',
        'ОДКО',
        'ОМ'
      ])
  },
  {
    value: 'by_grid_party',
    label: 'PLATFORM.BY_GRID_PARTY',
    visible: () =>
      checkPermissions('TKO.LIST.FUNCTIONS.POINT_TYPE_LIST.BY_GRID_PARTY', [
        'АКО',
        ...AKO_,
        'АТКО',
        'ОЗКО',
        'ОДКО',
        'ОМ'
      ])
  },
  {
    value: 'queue_generation',
    label: 'PLATFORM.QUEUE_GENERATION',
    visible: () =>
      checkPermissions('TKO.LIST.FUNCTIONS.POINT_TYPE_LIST.QUEUE_GENERATION', [
        'АКО',
        ...AKO_,
        'АТКО',
        'СВБ',
        'ГарПок',
        'ОЗКО',
        'ОДКО',
        'ОМ'
      ])
  },
  {
    value: 'standard_unit',
    label: 'PLATFORM.REFERENCE_UNIT_OF_RELEASE',
    visible: () =>
      checkPermissions('TKO.LIST.FUNCTIONS.POINT_TYPE_LIST.STANDARD_UNIT', [
        'АКО',
        ...AKO_,
        'АТКО',
        'ОЗКО',
        'ОДКО',
        'ОМ'
      ])
  },
  {
    value: 'meter',
    label: 'PLATFORM.METER',
    visible: () =>
      checkPermissions('TKO.LIST.FUNCTIONS.POINT_TYPE_LIST.METER', [
        'АКО',
        ...AKO_,
        'АТКО',
        'ОЗКО',
        'ОЗД',
        'ОДКО',
        'ОМ'
      ])
  },
  {
    value: 'consumption_for_non_domestic_needs',
    label: 'PLATFORM.CONSUMPTION_FOR_NON_DOMESTIC_NEEDS',
    visible: () =>
      checkPermissions('TKO.LIST.FUNCTIONS.POINT_TYPE_LIST.CONSUMPTION_FOR_NON_DOMESTIC_NEEDS', [
        'АКО',
        'АТКО',
        'ОДКО',
        'ОЗКО',
        ...AKO_,
        'СВБ'
      ])
  },
  {
    value: 'consumption_for_domestic_needs',
    label: 'PLATFORM.CONSUMPTION_FOR_DOMESTIC_NEEDS',
    visible: () =>
      checkPermissions('TKO.LIST.FUNCTIONS.POINT_TYPE_LIST.CONSUMPTION_FOR_DOMESTIC_NEEDS', [
        'АКО',
        'АТКО',
        'ОДКО',
        'ОЗКО',
        ...AKO_,
        'СВБ'
      ])
  },
  {
    value: 'consumption_in_static_capacitor',
    label: 'PLATFORM.CONSUMPTION_IN_STATIC_CAPACITOR',
    visible: () =>
      checkPermissions('TKO.LIST.FUNCTIONS.POINT_TYPE_LIST.CONSUMPTION_IN_STATIC_CAPACITOR', [
        'АКО',
        'АТКО',
        'ОДКО',
        'ОЗКО',
        ...AKO_
      ])
  },
  {
    value: 'consumption',
    label: 'PLATFORM.CONSUMPTION',
    visible: () =>
      checkPermissions('TKO.LIST.FUNCTIONS.POINT_TYPE_LIST.CONSUMPTION', ['АКО', 'АТКО', 'ОДКО', 'ОЗКО', ...AKO_])
  },
  {
    value: 'release_generation_unit',
    label: 'PLATFORM.RELEASE_GENERATION_UNIT',
    visible: () =>
      checkPermissions('TKO.LIST.FUNCTIONS.POINT_TYPE_LIST.RELEASE_GENERATION_UNIT', [
        'АКО',
        'АТКО',
        'ОДКО',
        'ОЗКО',
        ...AKO_
      ])
  },
  {
    value: 'losses',
    label: 'PLATFORM.LOSSES',
    visible: () =>
      checkPermissions('TKO.LIST.FUNCTIONS.POINT_TYPE_LIST.LOSSES', ['АКО', 'АТКО', 'ОДКО', 'ОЗКО', ...AKO_])
  }
];
