import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

const parentTypeToCode = (CmoCorrespondParentType) => {
  if (!CmoCorrespondParentType) return 'AP';
  const codes = {
    generation: 'SP03',
    own_consumption: 'SP04',
    accumulation_consumption: 'SP06',
    consumption_in_static_capacitor: 'SP16',
    consumption: 'SP05',
    release_generation_unit: 'SP11',
    losses: 'SP15',
    generation_unit: 'SP08',
    ts_generation_unit: 'SP20',
    by_voltage_level: 'SP01',
    by_grid_party: 'SP02',
    queue_generation: 'SP07',
    standard_unit: 'SP12',
    meter: 'SP21',
    consumption_for_non_domestic_needs: 'SP19',
    consumption_for_domestic_needs: 'SP18'
  };
  return codes[CmoCorrespondParentType];
};

const getAccordion = (selectedTko) => {
  const { t, i18n } = useTranslation();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const typeCode = selectedTko && parentTypeToCode(selectedTko?.CmoCorrespondParentType);

  let data = [
    {
      title: 'CHARACTERISTICS.GENERAL_CHARACTERISTICS',
      content: [
        {
          items: [
            { title: 'FIELDS.EIC_CODE', field: 'EIC', obj: selectedTko },
            { title: 'FIELDS.POINT_TYPE', field: 'PointType', obj: selectedTko },
            {
              title: 'CHARACTERISTICS.QUANTITY_BY_COMMERCIAL_ACCONUNTING_PLATFORM',
              field: 'MeteringPointAmount',
              obj: selectedTko
            },
            {
              title: 'CHARACTERISTICS.DATE_PROVISION_OF_INFORMATION_TKO',
              field: 'SnapshotDate',
              obj: selectedTko,
              type: 'datetime'
            },
            {
              title: 'FIELDS.EFFECTIVE_DATE',
              field: 'ValidityStartDate',
              obj: selectedTko
            },
            {
              title: 'CHARACTERISTICS.EFFECTIVE_DATE_CONTRACT',
              field: 'ValidityStartDateContract',
              obj: selectedTko
            },
            {
              title: 'CHARACTERISTICS.AP_NAME',
              field: 'IdapName',
              obj: selectedTko
            },
            {
              title: 'CHARACTERISTICS.ZV_CODE_AGGREGATION',
              field: 'ZvCodeAggregation',
              obj: selectedTko
            },
            {
              title: 'CHARACTERISTICS.EIC_CODE_SUBSIDIARY_TKO',
              field: 'CmoCorrespondParent',
              action: () => navigate(`/tko/${selectedTko?.CmoCorrespondParentUID}`, { state: { from: { pathname } } }),
              obj: selectedTko,
              is_inherited: typeCode !== 'AP'
            },
            {
              title: 'CHARACTERISTICS.EOB_TYPE',
              field: 'StandardUnitType',
              obj: selectedTko?.PropertiesOfSpecializedElectricalEquipment
            }
          ]
        }
      ]
    },
    {
      title: 'CHARACTERISTICS.LOCATION_TKO',
      content: [
        {
          items: [
            {
              title: 'CHARACTERISTICS.POSTCODE',
              field: 'PostCode',
              obj: selectedTko?.AddressAndGeoCoordinate?.PostalAddress
            },
            {
              title: 'FIELDS.REGION',
              field: 'Region',
              obj: selectedTko?.AddressAndGeoCoordinate?.PostalAddress,
              is_inherited: ['SP07', 'SP08', 'SP12', 'SP20'].includes(typeCode)
            },
            {
              title: 'CHARACTERISTICS.CITY_NAME',
              field: 'City',
              obj: selectedTko?.AddressAndGeoCoordinate?.PostalAddress,
              is_inherited: ['SP07', 'SP08', 'SP12', 'SP20'].includes(typeCode)
            },
            {
              title: 'FIELDS.AREA',
              field: 'AreaName',
              obj: selectedTko?.AddressAndGeoCoordinate?.PostalAddress,
              is_inherited: ['SP07', 'SP08', 'SP12', 'SP20'].includes(typeCode)
            },
            {
              title: 'CHARACTERISTICS.LOCAL_COMMUNITY',
              field: 'LocalCommunity',
              obj: selectedTko?.AddressAndGeoCoordinate?.PostalAddress,
              is_inherited: ['SP07', 'SP08', 'SP12', 'SP20'].includes(typeCode)
            },
            {
              title: 'FIELDS.STREET_NAME',
              field: 'Street',
              obj: selectedTko?.AddressAndGeoCoordinate?.PostalAddress
            },
            {
              title: 'CHARACTERISTICS.BUILDING',
              field: 'Building',
              obj: selectedTko?.AddressAndGeoCoordinate?.PostalAddress
            },
            {
              title: 'CHARACTERISTICS.FLOOR_IDENTIFICATION',
              field: 'FloorIdentification',
              obj: selectedTko?.AddressAndGeoCoordinate?.PostalAddress
            },
            {
              title: 'CHARACTERISTICS.ROOM_IDENTIFICATION',
              field: 'RoomIdentification',
              obj: selectedTko?.AddressAndGeoCoordinate?.PostalAddress
            },
            {
              title: 'CHARACTERISTICS.CADASTRAL_NUMBER',
              field: 'CadastralNumer',
              obj: selectedTko?.AddressAndGeoCoordinate
            },
            {
              title: 'CHARACTERISTICS.COORDINATE_SYSTEM',
              field: 'System',
              obj: selectedTko?.AddressAndGeoCoordinate
            },
            {
              title: 'CHARACTERISTICS.LATITUDE',
              field: 'Latitude',
              obj: selectedTko?.AddressAndGeoCoordinate
            },
            {
              title: 'CHARACTERISTICS.LONGITUDE',
              field: 'Longitude',
              obj: selectedTko?.AddressAndGeoCoordinate
            },
            {
              title: 'CHARACTERISTICS.TERRITORY_TYPE',
              field: 'TerritoryType',
              obj: selectedTko?.AddressAndGeoCoordinate
            },
            {
              title: 'CHARACTERISTICS.CODE_CATUTTC',
              field: 'KATOTTG',
              obj: selectedTko?.AddressAndGeoCoordinate,
              is_inherited: ['SP07', 'SP08', 'SP12', 'SP20'].includes(typeCode)
            }
          ]
        }
      ]
    },
    {
      title: t('CHARACTERISTICS.PARTIES'),
      content: [
        {
          header: 'CHARACTERISTICS.SUPPLIER_DATA_TKO',
          items: [
            {
              title: 'FIELDS.SUPPLIER_NAME',
              field: 'FullName',
              obj: selectedTko?.BalanceSupplier?.PartyRoleRegister?.PartyRegister,
              is_inherited: ['SP01', 'SP03', 'SP05', 'SP07', 'SP08', 'SP18', 'SP19', 'SP20'].includes(typeCode)
            },
            {
              title: 'CHARACTERISTICS.EIC_X_CODE',
              field: 'EIC',
              obj: selectedTko?.BalanceSupplier?.PartyRoleRegister?.PartyRegister,
              is_inherited: ['SP01', 'SP03', 'SP05', 'SP07', 'SP08', 'SP18', 'SP19', 'SP20'].includes(typeCode)
            },
            {
              title: 'CHARACTERISTICS.SUPPLIER_DATE_START',
              field: 'ValidityStartDate',
              obj: selectedTko?.BalanceSupplier,
              is_inherited: ['SP01', 'SP03', 'SP05', 'SP07', 'SP08', 'SP18', 'SP19', 'SP20'].includes(typeCode)
            },
            {
              title: 'CHARACTERISTICS.SUPPLIER_DATE_END',
              field: 'SnapshotDate',
              obj: selectedTko?.BalanceSupplier,
              is_inherited: ['SP01', 'SP03', 'SP05', 'SP07', 'SP08', 'SP18', 'SP19', 'SP20'].includes(typeCode)
            }
          ]
        },
        {
          header: 'CHARACTERISTICS.OS',
          items: [
            {
              title: 'CHARACTERISTICS.NAME_OS_WHOSE_NETWORKS_TKO_CONNECTED',
              field: 'FullName',
              obj: selectedTko?.GridAccessProvider?.PartyRoleRegister?.PartyRegister,
              is_inherited: !['AP', 'SP21'].includes(typeCode)
            },
            {
              title: 'CHARACTERISTICS.EIC_X_CODE',
              field: 'EIC',
              obj: selectedTko?.GridAccessProvider?.PartyRoleRegister?.PartyRegister,
              is_inherited: !['AP', 'SP21'].includes(typeCode)
            }
          ]
        },
        {
          header: 'ROLES.METERED_DATA_RESPONSIBLE',
          items: [
            {
              title: 'CHARACTERISTICS.PPKO_WHICH_PERFOMS_FUNCTION_OF_ODCO',
              field: 'PartyRoleType',
              obj: selectedTko?.MeteredDataResponsible,
              is_inherited: !['AP', 'SP21'].includes(typeCode)
            },
            {
              title: 'CHARACTERISTICS.NAME_PPKO_OPERATOR_COMMERCIAL_ACCOUNTING_DATA',
              field: 'FullName',
              obj: selectedTko?.MeteredDataResponsible?.PartyRoleRegister?.PartyRegister,
              is_inherited: !['AP', 'SP21'].includes(typeCode)
            },
            {
              title: 'CHARACTERISTICS.EIC_X_CODE',
              field: 'EIC',
              obj: selectedTko?.MeteredDataResponsible?.PartyRoleRegister?.PartyRegister,
              is_inherited: !['AP', 'SP21'].includes(typeCode)
            },
            {
              title: 'CHARACTERISTICS.PPKO_OPERATOR_COMMERCIAL_ACCOUNTING_DATA_START_DATE',
              field: 'ValidityStartDate',
              obj: selectedTko?.MeteredDataResponsible,
            },
            {
              title: 'CHARACTERISTICS.PPKO_OPERATOR_COMMERCIAL_ACCOUNTING_DATA_END_DATE',
              field: 'SnapshotDate',
              obj: selectedTko?.MeteredDataResponsible,
            }
          ]
        },
        {
          header: 'ROLES.METERED_DATA_COLLECTOR',
          items: [
            {
              title: 'CHARACTERISTICS.PPKO_WHICH_PERFOMS_FUNCTION_OF_OZD',
              field: 'PartyRoleType',
              obj: selectedTko?.MeteredDataCollector,
              is_inherited: !['AP', 'SP21'].includes(typeCode)
            },
            {
              title: 'CHARACTERISTICS.NAME_PPKO_OPERATOR_COLLECTION_OF_COMMERCIAL_ACCOUNTING_DATA',
              field: 'FullName',
              obj: selectedTko?.MeteredDataCollector?.PartyRoleRegister?.PartyRegister,
              is_inherited: !['AP', 'SP21'].includes(typeCode)
            },
            {
              title: 'CHARACTERISTICS.EIC_X_CODE',
              field: 'EIC',
              obj: selectedTko?.MeteredDataCollector?.PartyRoleRegister?.PartyRegister,
              is_inherited: !['AP', 'SP21'].includes(typeCode)
            },
            {
              title: 'CHARACTERISTICS.PPKO_OZD_START_DATE',
              field: 'ValidityStartDate',
              obj: selectedTko?.MeteredDataCollector,
            },
            {
              title: 'CHARACTERISTICS.PPKO_OZD_END_DATE',
              field: 'SnapshotDate',
              obj: selectedTko?.MeteredDataCollector,
            }
          ]
        },
        {
          header: 'ROLES.METERED_DATA_AGGREGATOR',
          items: [
            {
              title: 'CHARACTERISTICS.NAME_PPKO_AGGREGATOR_COMMERCIAL_ACCOUNTING_DATA',
              field: 'FullName',
              obj: selectedTko?.MeteredDataAggregator?.PartyRoleRegister?.PartyRegister,
              is_inherited: !['AP', 'SP21'].includes(typeCode)
            },
            {
              title: 'CHARACTERISTICS.EIC_X_CODE',
              field: 'EIC',
              obj: selectedTko?.MeteredDataAggregator?.PartyRoleRegister?.PartyRegister,
              is_inherited: !['AP', 'SP21'].includes(typeCode)
            }
          ]
        },
        {
          header: 'ROLES.METERING_POINT_ADMINISTRATOR',
          items: [
            {
              title: 'CHARACTERISTICS.NAME_PPKO_ADMINISTRATOR_POINTS_OF_COMMERCIAL_ACCOUNTING',
              field: 'FullName',
              obj: selectedTko?.MeteringPointAdministrator?.PartyRoleRegister?.PartyRegister,
              is_inherited: !['AP', 'SP21'].includes(typeCode)
            },
            {
              title: 'CHARACTERISTICS.EIC_X_CODE',
              field: 'EIC',
              obj: selectedTko?.MeteringPointAdministrator?.PartyRoleRegister?.PartyRegister,
              is_inherited: !['AP', 'SP21'].includes(typeCode)
            },
            {
              title: 'CHARACTERISTICS.PPKO_ATKO_START_DATE',
              field: 'ValidityStartDate',
              obj: selectedTko?.MeteringPointAdministrator,
            },
            {
              title: 'CHARACTERISTICS.PPKO_ATKO_END_DATE',
              field: 'SnapshotDate',
              obj: selectedTko?.MeteringPointAdministrator,
            }
          ]
        },
        {
          header: 'ROLES.METER_OPERATOR',
          items: [
            {
              title: 'CHARACTERISTICS.NAME_PPKO_OPERATOR_MEANS_OF_COMMERCIAL_ACCOUNTING',
              field: 'FullName',
              obj: selectedTko?.MeterOperator?.PartyRoleRegister?.PartyRegister,
              is_inherited: !['AP', 'SP21'].includes(typeCode)
            },
            {
              title: 'CHARACTERISTICS.EIC_X_CODE',
              field: 'EIC',
              obj: selectedTko?.MeterOperator?.PartyRoleRegister?.PartyRegister,
              is_inherited: !['AP', 'SP21'].includes(typeCode)
            },
            {
              title: 'CHARACTERISTICS.PPKO_OZKO_START_DATE',
              field: 'ValidityStartDate',
              obj: selectedTko?.MeterOperator,
            },
            {
              title: 'CHARACTERISTICS.PPKO_OZKO_END_DATE',
              field: 'SnapshotDate',
              obj: selectedTko?.MeterOperator,
            }
          ]
        },
        {
          header: 'CHARACTERISTICS.VTKO',
          items: [
            {
              title: 'CHARACTERISTICS.TYPE_PARTY_REPRESENTED_BY_VTKO',
              field: 'PartyRoleType',
              obj: selectedTko?.MeteredResponsibleParty,
              is_inherited: ['SP08', 'SP12', 'SP21'].includes(typeCode)
            },
            {
              title: 'CHARACTERISTICS.NAME_VTKO_RESPONSIBLE_FOR_POINT_OF_COMMERCIAL_ACCOUNTING',
              field: 'FullName',
              obj: selectedTko?.MeteredResponsibleParty?.PartyRoleRegister?.PartyRegister,
              is_inherited: ['SP08', 'SP12', 'SP21'].includes(typeCode)
            },
            {
              title: 'CHARACTERISTICS.EIC_X_CODE_VTKO',
              field: 'EIC',
              obj: selectedTko?.MeteredResponsibleParty?.PartyRoleRegister?.PartyRegister,
              is_inherited: ['SP08', 'SP12', 'SP21'].includes(typeCode)
            }
          ]
        }
      ]
    },
    {
      title: 'CHARACTERISTICS.CUSTOMER',
      content: [
        {
          header: 'CHARACTERISTICS.CUSTOMER_OF_NETWORK',
          items: [
            {
              title: 'CHARACTERISTICS.STATUS_SPM',
              field: 'CustomerStatus',
              obj: selectedTko?.GridCustomer,
              is_inherited: !['AP', 'SP21'].includes(typeCode)
            },
            {
              title: 'CHARACTERISTICS.SPM_IDENTIFIER_CUSTOMER_OF_NETWORK',
              field: 'CustomerID',
              obj: selectedTko?.GridCustomer,
              is_inherited: !['AP', 'SP21'].includes(typeCode)
            },
            {
              title: 'CHARACTERISTICS.TYPE_OF_SPM',
              field: 'CustomerType',
              obj: selectedTko?.GridCustomer,
              is_inherited: !['AP', 'SP21'].includes(typeCode)
            },
            {
              title: 'CHARACTERISTICS.CITIZENSHIP',
              field: 'Country',
              obj: selectedTko?.GridCustomer,
              is_inherited: !['AP', 'SP21'].includes(typeCode)
            },
            {
              title: 'CHARACTERISTICS.DATE_OF_SPM_VERIFICATION',
              field: 'VerificationDate',
              obj: selectedTko?.GridCustomer,
              is_inherited: !['AP', 'SP21'].includes(typeCode)
            }
          ]
          //       getDetailInfoParameter: selectedTko?.GridCustomer?.CustomerID
        },
        {
          header: 'CHARACTERISTICS.CUSTOMER_SUPPLY',
          items: [
            {
              title: 'CHARACTERISTICS.CUSTOMER__STATUS',
              field: 'CustomerStatus',
              obj: selectedTko?.SupplyCustomer,
              is_inherited: !['AP', 'SP21'].includes(typeCode)
            },
            {
              title: 'CHARACTERISTICS.IDENTIFIER_CONSUMER_CUSTOMER',
              field: 'CustomerID',
              obj: selectedTko?.SupplyCustomer,
              is_inherited: !['AP', 'SP21'].includes(typeCode)
            },
            {
              title: 'CHARACTERISTICS.TYPE_CONSUMER',
              field: 'CustomerType',
              obj: selectedTko?.SupplyCustomer,
              is_inherited: !['AP', 'SP21'].includes(typeCode)
            },
            {
              title: 'CHARACTERISTICS.CITIZENSHIP',
              field: 'Country',
              obj: selectedTko?.SupplyCustomer,
              is_inherited: !['AP', 'SP21'].includes(typeCode)
            },
            {
              title: 'CHARACTERISTICS.DATE_OF_CONSUMER_VERIFICATION',
              field: 'VerificationDate',
              obj: selectedTko?.SupplyCustomer,
              is_inherited: !['AP', 'SP21'].includes(typeCode)
            }
          ]
          //       getDetailInfoParameter: selectedTko?.SupplyCustomer?.CustomerID
        }
      ]
    },
    {
      title: 'CHARACTERISTICS.NETWORK_ACCOUNTING_AREA',
      content: [
        {
          items: [
            {
              title: 'CHARACTERISTICS.IDENTIFICATION',
              field: 'MeteringGridAreaIdentification',
              obj: selectedTko,
              is_inherited: !['AP', 'SP21'].includes(typeCode)
            },
            {
              title: 'CHARACTERISTICS.ACCOUNTING_AREA_NAME',
              field: 'MeteringGridAreaName',
              obj: selectedTko,
              is_inherited: !['AP', 'SP21'].includes(typeCode)
            },
            {
              title: 'CHARACTERISTICS.CODE_ADDITIONAL_ACCOUNTING_AREA',
              field: 'AddMeteringGridAreaID',
              obj: selectedTko,
              is_inherited: !['AP', 'SP21'].includes(typeCode)
            }
          ]
        }
      ]
    },
    {
      title: 'CHARACTERISTICS.PHYSICAL_CHARACTERISTICS',
      content: [
        {
          items: [
            {
              title: 'FIELDS.CONNECTION_STATUS',
              field: 'ConnectionStatus',
              obj: selectedTko,
              mapLabel: (i) => (CONNECTION_STATUSES[i] ? t(CONNECTION_STATUSES[i]) : i),
              is_inherited: !['AP', 'SP21'].includes(typeCode)
            },
            {
              title: 'CHARACTERISTICS.DISCONNECTION_METHOD',
              field: 'DisconnectionMethod',
              obj: selectedTko
            },
            {
              title: 'CHARACTERISTICS.VOLTAGE_LEVEL',
              field: 'VoltageLevel',
              obj: selectedTko,
              is_inherited: ['SP07', 'SP08', 'SP12', 'SP20'].includes(typeCode)
            },
            {
              title: 'CHARACTERISTICS.SUPPLY_STATUS',
              field: 'SupplyStatus',
              obj: selectedTko,
              is_inherited: ['SP01', 'SP18', 'SP19'].includes(typeCode)
            },
            {
              title: 'CHARACTERISTICS.NUMBER_OF_PHASES',
              field: 'NumberOfPhases',
              obj: selectedTko
            },
            {
              title: 'CHARACTERISTICS.CONTRACTED_CONNECTION_CAPACITY',
              field: 'ContractedConnectionCapacity',
              obj: selectedTko
            },
            {
              title: 'CHARACTERISTICS.BOOKING_POWER',
              field: 'BookingPower',
              obj: selectedTko
            },
            {
              title: 'CHARACTERISTICS.CONNECTION_CAPACITY',
              field: 'ConnectionCapacity',
              obj: selectedTko
            },
            {
              title: 'CHARACTERISTICS.SUPPORT_SCHEME',
              field: 'SupportScheme',
              obj: selectedTko,
              is_inherited: ['SP07', 'SP08', 'SP20'].includes(typeCode)
            },
            {
              title: 'CHARACTERISTICS.DATE_RECEIPT_OF_GREEN_TARIFF',
              field: 'BillingFrom',
              obj: selectedTko,
              is_inherited: ['AP', 'SP07'].includes(typeCode)
            },
            {
              title: 'CHARACTERISTICS.RELIABILITY_CATEGORY',
              field: 'ReliabilityCategory',
              obj: selectedTko
            },
            {
              title: 'CHARACTERISTICS.GENERATION_TYPE',
              field: 'Generation',
              obj: selectedTko,
              is_inherited: ['SP03', 'SP07', 'SP08', 'SP20'].includes(typeCode)
            },
            {
              title: 'CHARACTERISTICS.VOLTAGE_LEVEL_SITE',
              field: 'Idap',
              obj: selectedTko
            },
            {
              title: 'CHARACTERISTICS.PROFILE_TYPE',
              field: 'APProfileType',
              obj: selectedTko,
              is_inherited: ['SP01', 'SP18', 'SP19'].includes(typeCode)
            },
            {
              title: 'CHARACTERISTICS.CODE_OF_PROFILE_TKO',
              field: 'ReferenceAp',
              obj: selectedTko,
              is_inherited: ['SP01', 'SP18', 'SP19'].includes(typeCode)
            },
            {
              title: 'CHARACTERISTICS.AUTONOMY_OF_WORK',
              field: 'AutonomyOfWork',
              obj: selectedTko,
              is_inherited: ['SP07', 'SP08', 'SP12', 'SP20'].includes(typeCode)
            },
            {
              title: 'CHARACTERISTICS.TYPE_OF_GENERATION_PLANT',
              field: 'GenerationType',
              obj: selectedTko?.PropertiesOfSpecializedElectricalEquipment
            },
            {
              title: 'CHARACTERISTICS.VOLTAGE_LEVEL_OF_GENERATIONG_SET',
              field: 'GenerationVoltageLevel',
              obj: selectedTko?.PropertiesOfSpecializedElectricalEquipment
            },
            {
              title: 'CHARACTERISTICS.VOLTAGE_LEVEL_OF_GENERATIONG_SET',
              field: 'GenerationVoltageLevelGeneral',
              obj: selectedTko?.PropertiesOfSpecializedElectricalEquipment,
              is_inherited: typeCode === 'SP07'
            },
            {
              title: 'CHARACTERISTICS.FUEL_TYPE',
              field: 'Fuel', // 202-51
              obj: selectedTko?.PropertiesOfSpecializedElectricalEquipment,
            },
            {
              title: 'CHARACTERISTICS.GENERATION_PLACE',
              field: 'GenerationPlace',
              obj: selectedTko?.PropertiesOfSpecializedElectricalEquipment
            },
            {
              title: 'CHARACTERISTICS.GENERATION_POWER',
              field: 'GenerationPower',
              obj: selectedTko?.PropertiesOfSpecializedElectricalEquipment
            },
            {
              title: 'CHARACTERISTICS.GENERATION_VALIDITY_FROM',
              field: 'GenerationValidityFrom',
              obj: selectedTko?.PropertiesOfSpecializedElectricalEquipment
            },
            {
              title: 'CHARACTERISTICS.TOTAL_COMMISSIONING_DATE_GENERATING_UNITS_KW',
              field: 'GenerationValidityFromGeneral',
              obj: selectedTko?.PropertiesOfSpecializedElectricalEquipment,
              is_inherited: ['AP', 'SP07'].includes(typeCode)
            },
            {
              title: 'CHARACTERISTICS.GENERATION_VALIDITY_TO',
              field: 'GenerationValidityTo',
              obj: selectedTko?.PropertiesOfSpecializedElectricalEquipment,
              is_inherited: ['AP', 'SP07'].includes(typeCode)
            },
            {
              title: 'CHARACTERISTICS.GREEN_BILLING_FROM',
              field: 'GreenBillingFrom',
              obj: selectedTko?.PropertiesOfSpecializedElectricalEquipment,
              is_inherited: ['AP', 'SP03', 'SP07'].includes(typeCode)
            },
            {
              title: 'CHARACTERISTICS.GREEN_BILLING_TO',
              field: 'GreenBillingTo',
              obj: selectedTko?.PropertiesOfSpecializedElectricalEquipment,
              is_inherited: ['AP', 'SP03', 'SP07'].includes(typeCode)
            },
            {
              title: 'CHARACTERISTICS.IDAP_VALIDITY_FROM',
              field: 'IdapValidityFrom',
              obj: selectedTko?.PropertiesOfSpecializedElectricalEquipment
            },
            {
              title: 'CHARACTERISTICS.IDAP_VALIDITY_TO',
              field: 'IdapValidityTo',
              obj: selectedTko?.PropertiesOfSpecializedElectricalEquipment
            },
            {
              title: 'CHARACTERISTICS.FUEL_TYPE',
              field: 'FuelType', // 202-51-1
              obj: selectedTko,
              is_inherited: ['AP', 'SP07'].includes(typeCode)
            }
          ]
        }
      ]
    },
    {
      title: 'CHARACTERISTICS.ADMINISTRATION_CHARACTERISTICS',
      content: [
        {
          items: [
            { title: 'CHARACTERISTICS.METERING_METHOD', field: 'MeteringMethod', obj: selectedTko },
            {
              title: 'CHARACTERISTICS.SETTLEMENT_METHOD',
              field: 'SettlementMethod',
              obj: selectedTko,
              is_inherited: !['AP', 'SP21'].includes(typeCode)
            },
            { title: 'CHARACTERISTICS.AMR_SYSTEM_ID', field: 'AmrSystemID', obj: selectedTko },
            { title: 'CHARACTERISTICS.GRID_AGREEMENT_TYPE', field: 'GridAgreementType', obj: selectedTko },
            { title: 'CHARACTERISTICS.INSTALLATION_PLACE', field: 'InstallationPlace', obj: selectedTko },
            {
              title: 'CHARACTERISTICS.OPERATION_MODE',
              field: 'OperationMode',
              obj: selectedTko,
              mapLabel: (i) => (i18n.exists(`OPERATION_MODE.${i}`) ? t(`OPERATION_MODE.${i}`) : i),
              is_inherited: ['SP01', 'SP18', 'SP19'].includes(typeCode)
            },
            {
              title: 'CHARACTERISTICS.NONSYNCHRONOUS_EIC',
              field: 'NonSyncMeteringGridAreaID',
              obj: selectedTko,
              is_inherited: ['SP01', 'SP18', 'SP19'].includes(typeCode)
            },
            {
              title: 'CHARACTERISTICS.ACTIVE_CONSUMER',
              field: 'ActiveConsumer',
              obj: selectedTko,
              is_inherited: !['AP', 'SP21'].includes(typeCode)
            },
            {
              title: 'CHARACTERISTICS.REFERENCE_GROUP',
              field: 'ReferenceGroup',
              obj: selectedTko,
            },
            {
              title: 'CHARACTERISTICS.REFERENCE_GROUP_RESOLUTION',
              field: 'ReferenceGroupResolution',
              obj: selectedTko,
            }
          ]
        }
      ]
    },
    {
      title: 'CHARACTERISTICS.PHYSICAL_CHARACTERISTICS_ZVT',
      content: [
        {
          items: [
            {
              title: 'CHARACTERISTICS.GENERAL_VOLTAGE_LEVEL',
              field: 'MeterRatedVoltage',
              obj: selectedTko
            },
            { title: 'CHARACTERISTICS.ANNUAL_CONSUMPTION', field: 'Quantity', obj: selectedTko },
            { title: 'CHARACTERISTICS.ANNUAL_VOLUME_OF_GENERATION', field: 'Quantityg', obj: selectedTko },
            {
              title: 'CHARACTERISTICS.ANNUAL_VOLUME_OF_GENERATION',
              field: 'QuantitygGeneral',
              obj: selectedTko,
              is_inherited: typeCode === 'SP07'
            },
            {
              title: 'CHARACTERISTICS.TYPE_ACCOUNTING_POINT',
              field: 'TypeOfAccountingPoint',
              obj: selectedTko,
              is_inherited: !['AP', 'SP21'].includes(typeCode)
            },
            {
              title: 'CHARACTERISTICS.METER_READING_PERIODICITY',
              field: 'MeterReadingPeriodicity',
              obj: selectedTko,
              is_inherited: !['AP', 'SP21'].includes(typeCode)
            },
            {
              title: 'CHARACTERISTICS.METERED_DATA_COLLECTION_METHOD',
              field: 'MeterDataCollectionMethod',
              obj: selectedTko
            },
            {
              title: 'CHARACTERISTICS.METERED_DATA_COLLECTION_SCHEDULE',
              field: 'MeteredDataCollectionSchedule',
              obj: selectedTko
            },
            { title: 'CHARACTERISTICS.CMO_CORRESPOND', field: 'CmoCorrespond', obj: selectedTko },
            {
              title: 'CHARACTERISTICS.APQUANTITY_WHICH_DO_NOT_MEET_REQUIREMENTS',
              field: 'ApQuantity',
              obj: selectedTko
            }
          ]
        }
      ]
    },
    {
      title: 'CHARACTERISTICS.ADDITIONAL_CHARACTERISTICS',
      content: [
        {
          items: [
            { title: 'CHARACTERISTICS.BUILDING_TYPE', field: 'BuildingType', obj: selectedTko },
            {
              title: 'CHARACTERISTICS.SUPPLY_TYPE',
              field: 'SupplyType',
              obj: selectedTko,
              is_inherited: ['SP01', 'SP18', 'SP19'].includes(typeCode)
            },
            {
              title: 'CHARACTERISTICS.PAYMENT_TYPE',
              field: 'PaymentType',
              obj: selectedTko,
              is_inherited: ['SP01', 'SP18', 'SP19'].includes(typeCode)
            },
            {
              title: 'CHARACTERISTICS.KVED',
              field: 'KVED',
              obj: selectedTko,
              is_inherited: !['AP', 'SP21'].includes(typeCode)
            },
            { title: 'CHARACTERISTICS.INPUT_OUTPUT_TYPE', field: 'InputOutputType', obj: selectedTko,
              is_inherited: ['SP01', 'SP02'].includes(typeCode)
            },
            {
              title: 'CHARACTERISTICS.GUARANTEED_CUSTOMER_CONTRACT',
              field: 'GuaranteedCustomerBalancingGroup',
              obj: selectedTko,
              is_inherited: ['SP07', 'SP08'].includes(typeCode)
            },
            {
              title: 'CHARACTERISTICS.BSUS_AGGREGATED_GROUP',
              field: 'BSUSAggregatedGroup',
              obj: selectedTko,
              is_inherited: ['AP', 'SP07'].includes(typeCode)
            }
          ]
        }
      ]
    },
    {
      title: 'CHARACTERISTICS.ELECTRICAL_EQUIPMENT',
      content: [
        {
          items: [
            {
              title: 'CHARACTERISTICS.GENERATION_POWER',
              field: 'GenPower',
              obj: selectedTko,
              is_inherited: ['AP', 'SP03', 'SP07'].includes(typeCode)
            },
            { title: 'CHARACTERISTICS.NUMBER_COMISSION_LINEUP', field: 'NumberComissionLineup', obj: selectedTko }
          ]
        }
      ]
    },
    {
      title: 'CHARACTERISTICS.SPECIAL_EQUIPMENT',
      content: [
        {
          items: [
            { title: 'CHARACTERISTICS.HEATING_EQUIPMENT', field: 'HeatingEquipment', obj: selectedTko },
            { title: 'CHARACTERISTICS.HOT_WATER_SUPPLY_EQUIPMENT', field: 'HotWaterSupplyEquipment', obj: selectedTko },
            {
              title: 'CHARACTERISTICS.FOOD_PREPARATION_EQUIPMENT',
              field: 'FoodPreparationEquipment',
              obj: selectedTko
            }
          ]
        }
      ]
    },
    {
      title: 'CHARACTERISTICS.METER_TITLE',
      content: [
        {
          items: [
            {
              title: 'CHARACTERISTICS.METER_UNCOMPLIANCE_TYPE',
              field: 'MeterUncomplianceType',
              obj: selectedTko
            },
            {
              title: 'CHARACTERISTICS.METER_MODEL',
              field: 'MeterType',
              obj: selectedTko
            },
            {
              title: 'CHARACTERISTICS.METER_PRODUCTION_DATE',
              field: 'MeterProductionDate',
              obj: selectedTko
            },
            {
              title: 'CHARACTERISTICS.METER_ELIMINATION_MEASURES',
              field: 'MeterEliminationMeasures',
              obj: selectedTko
            },
            {
              title: 'CHARACTERISTICS.METER_PLANNED_ELIMINATION_DATE',
              field: 'MeterPlannedEliminationDate',
              obj: selectedTko
            },
            {
              title: 'CHARACTERISTICS.METER_ACTUAL_ELIMINATION_DATE',
              field: 'MeterActualEliminationDate',
              obj: selectedTko
            }
          ]
        }
      ]
    },
    {
      title: 'CHARACTERISTICS.CT_TITLE',
      content: [
        {
          items: [
            {
              title: 'CHARACTERISTICS.CT_UNCOMPLIANCE_TYPE',
              field: 'CtUncomplianceType',
              obj: selectedTko
            },
            {
              title: 'CHARACTERISTICS.CT_MODEL',
              field: 'CTUType',
              obj: selectedTko
            },
            {
              title: 'CHARACTERISTICS.CT_PRODUCTION_DATE',
              field: 'CTUProductionDate',
              obj: selectedTko
            },
            {
              title: 'CHARACTERISTICS.CT_ELIMINATION_MEASURES',
              field: 'CtEliminationMeasures',
              obj: selectedTko
            },
            {
              title: 'CHARACTERISTICS.CT_PLANNED_ELIMINATION_DATE',
              field: 'CtPlannedEliminationDate',
              obj: selectedTko
            },
            {
              title: 'CHARACTERISTICS.CT_ACTUAL_ELIMINATION_DATE',
              field: 'CtActualEliminationDate',
              obj: selectedTko
            }
          ]
        }
      ]
    },
    {
      title: 'CHARACTERISTICS.VT_TITLE',
      content: [
        {
          items: [
            {
              title: 'CHARACTERISTICS.VT_UNCOMPLIANCE_TYPE',
              field: 'VtUncomplianceType',
              obj: selectedTko
            },
            {
              title: 'CHARACTERISTICS.VT_MODEL',
              field: 'VTUType',
              obj: selectedTko
            },
            {
              title: 'CHARACTERISTICS.VT_PRODUCTION_DATE',
              field: 'VTUProductionDate',
              obj: selectedTko
            },
            {
              title: 'CHARACTERISTICS.VT_ELIMINATION_MEASURES',
              field: 'VtEliminationMeasures',
              obj: selectedTko
            },
            {
              title: 'CHARACTERISTICS.VT_PLANNED_ELIMINATION_DATE',
              field: 'VtPlannedEliminationDate',
              obj: selectedTko
            },
            {
              title: 'CHARACTERISTICS.VT_ACTUAL_ELIMINATION_DATE',
              field: 'VtActualEliminationType',
              obj: selectedTko
            }
          ]
        }
      ]
    },
    {
      title: 'CHARACTERISTICS.OTHER_TITLE',
      content: [
        {
          items: [
            {
              title: 'CHARACTERISTICS.OTHER_UNCOMPLIANCE_TYPE',
              field: 'OtherUncomplianceType',
              obj: selectedTko
            },
            {
              title: 'CHARACTERISTICS.OTHER_ELIMINATION_MEASURES',
              field: 'OtherEliminationMeasures',
              obj: selectedTko
            },
            {
              title: 'CHARACTERISTICS.OTHER_PLANNED_ELIMINATION_DATE',
              field: 'OtherPlannedEliminationDate',
              obj: selectedTko
            },
            {
              title: 'CHARACTERISTICS.OTHER_ACTUAL_ELIMINATION_DATE',
              field: 'OtherActualEliminationDate',
              obj: selectedTko
            }
          ]
        }
      ]
    }
  ];

  if (selectedTko?.SublingsAps?.length > 0) {
    let items = [];
    for (let i = 0; i < selectedTko.SublingsAps.length; i++) {
      const eq = selectedTko.SublingsAps[i];
      items.push(
        { title: 'CHARACTERISTICS.EIC_CODE_OF_ASSOCIATED_SITE', field: 'EIC', obj: eq },
        { title: 'CHARACTERISTICS.TYPE_OF_COMMUNICATION', field: 'RelationType', obj: eq },
        { title: 'CHARACTERISTICS.DATE_BEGINNING_OF_SITES_CONNECTION', field: '110-1-f', obj: eq },
        { title: 'CHARACTERISTICS.EIC_CODE_OS_LINKED_SITE', field: '110-1-t', obj: eq }
      );
    }
    data.push({ title: 'CHARACTERISTICS.RELATED_SITES', content: [{ items }] });
  }
  if (selectedTko?.RelatedSubCustomers?.length > 0) {
    const section = { title: 'CHARACTERISTICS.CHARACTERISTICS_IDENTIFICATION_CONSUMER', content: [] };
    for (let i = 0; i < selectedTko?.RelatedSubCustomers?.length; i++) {
      section.content.push({
        accordion: true,
        title: t('CHARACTERISTICS.RELATED_SUBCUSTOMERS', { i: i + 1 }),
        content: [
          {
            items: [
              { title: 'CHARACTERISTICS.IPN', field: '206-32', obj: selectedTko?.RelatedSubCustomers[i] },
              {
                title: 'CHARACTERISTICS.COMMUNICATION_TYPE',
                field: '206-32-1',
                obj: selectedTko?.RelatedSubCustomers[i]
              },
              {
                title: 'CHARACTERISTICS.VERIFICATION_DATE',
                field: '206-9-1',
                obj: selectedTko?.RelatedSubCustomers[i]
              }
            ]
          }
        ]
      });
    }
    data.push(section);
  }

  return data;
};

export default getAccordion;

export const CONNECTION_STATUSES = {
  Underconstruction: 'CONNECTION_STATUSES.UNDERCONSTRUCTION',
  Disconnected: 'CONNECTION_STATUSES.DISCONNECTED',
  Demolished: 'CONNECTION_STATUSES.DEMOLISHED',
  Connected: 'CONNECTION_STATUSES.CONNECTED',
  'Disconnected by GAP': 'CONNECTION_STATUSES.DISCONNECTED_BY_GAP',
  'Disconnected by Cust': 'CONNECTION_STATUSES.DISCONNECTED_BY_CUST',
  'Disconnected by GAP&BS': 'CONNECTION_STATUSES.DISCONNECTED_BY_GAP&BS'
};
