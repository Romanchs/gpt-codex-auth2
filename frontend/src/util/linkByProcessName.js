export const linkByProcessName = ({ uid, status, subprocess_name }) => {
  const subprocessesNames = {
    UPDATE_SUB_AP_METER: `/processes/update-sub-ap-meter/${uid}`,
    INITIALIZATION: `/processes/pon/${uid}`, // Ініціалізація зміни на ПОН
    INITIALIZATION_BY_SA: `/processes/pon/${uid}`,
    INITIALIZATION_PON_AUTO: `/processes/pon/${uid}`,
    INITIALIZATION_BY_SUPPLIER_FOR_AKO: `/processes/pon/${uid}`,
    DISMANTLE_ARCHIVE_AP: `/processes/dismantle-archive-ap/${uid}`,
    UNARCHIVE_AP: `/processes/unarchive-ap/${uid}`,
    REQUEST_DATA_IN_ATKO: `/processes/pon/request-tko-data/${uid}`,
    REQUEST_HISTORICAL_DKO: `/processes/pon/request-historical-dko/${uid}`,
    REQUEST_ACTUAL_DKO: `/processes/pon/request-actual-dko/${uid}`,
    INFORMING_PON: `/processes/pon/informing/${uid}`,
    RESPONSE_ACTUAL_DKO: `/processes/pon/provide-actual-dko/${uid}`,
    INITIALIZATION_BY_SUPPLIER: `/processes/end-of-supply/${uid}`,
    EXPORT_TKO: `/processes/export-own-tko/${uid}`,
    UPDATE_TKO_DATA: `/processes/change-main-data-tko/${uid}`,
    DISCONNECT_TKO: `/processes/connecting-disconnecting/${uid}`,
    CONNECT_TKO: `/processes/connecting-disconnecting/${uid}`,
    PROLONGATION_CONTRACT: `/processes/prolongation-supply/${uid}`,
    GRANTING_AUTHORITY: `/processes/granting-authority/${status === 'NEW' ? 'init/' : ''}${uid}`,
    DISPUTE_REQUEST_DATA_IN_ATKO: `/processes/dispute-tko/${uid}`,
    DISPUTE_UPDATE_TKO_DATA: `/processes/dispute-tko/subprocess/${uid}`,
    CHANGE_SUPPLIER_TO_SUPPLIER: `/processes/change-supplier/${uid}`,
    TERMINATION_SUPPLY: `/processes/termination-resumption/${uid}`,
    RESUMPTION_SUPPLY: `/processes/termination-resumption/${uid}`,
    RECEIVING_DKO_ACTUAL: `/processes/receiving-dko-actual/${uid}`,
    RECEIVING_DKO_HISTORICAL: `/processes/receiving-dko-historical/${uid}`,
    PREDICTABLE_CONSUMPTION_ODKO: `/processes/predictable-consumption-odko/${uid}`, // Запит обсягів розподілу/споживання(ОДКО)
    INFORMING_ATKO_FOR_CHANGE_SUPPLIER: `/processes/informing/${uid}`, // Інформування про зміну СВБ (АТКО)
    INFORMING_CURRENT_SUPPLIER: `/processes/informing/${uid}`, // Інформування про зміну СВБ (СВБ)
    INFORMING_AKO_FOR_CHANGE_SUPPLIER: `/processes/informing-ako/${uid}`, // Інформування про зміну СВБ (АКО)
    CANCEL_PPKO_REGISTRATION: `/processes/cancel-ppko-registration/${uid}`, // Анулювання реєстрації ППКО
    REQUEST_CANCEL_PPKO_REGISTRATION: `/processes/request-cancel-ppko-registration/${uid}`, // Заявка про анулювання реєстрації за власною ініціативою ППКО
    CANCEL_PPKO_REGISTRATION_ON_EXPIRE: `/processes/expire-cancel-ppko-registration/${uid}`, // Анулювання реєстрації ППКО за вичерпанням терміну дії реєстрації ППКО
    CREATE_TKO: `/processes/create-tko/${uid}`, // Створення ТКО || Створення нової ТКО (Z)
    CHANGE_PPKO_TO_OS: `/processes/change-ppko-to-os/${uid}`, // Зміна ППКО на ОС
    REQUEST_CHANGE_PPKO: `/processes/request-change-ppko/${uid}`, // Зміна ППКО
    REQUEST_CHANGE_PPKO_APPROVAL: `/processes/request-change-ppko-approval/${uid}`, // Заявка на погодження зміни ППКО
    EXPORT_AP_GENERATION: `/processes/export-ap-generation/${uid}`, // Формування витягу за генеруючими установками споживача
    BIND_ACCOUNTING_POINT_ZV: `/processes/bind-accounting-point-zv/${uid}`, // Прив’язка ТКО Z до ZV
    CREATE_METERING_POINT: `/processes/adding-new-virtual-tko/${uid}`, // Додавання нових віртуальних/фізичних ТКО
    BIND_ACCOUNTING_POINT: `/processes/bind-accounting-point/${uid}`, // Прив’язка ТКО до іншої ТКО
    DELETE_ARCHIVE_AP: `/processes/deleting-tko/${uid}`, // Видалення даних
    REQUEST_TO_UPDATE_BASIC_AP_DATA: `/processes/request-update-basic-ap/${uid}`, // Запит щодо актуалізації основних даних ТКО
    REQUEST_TO_UPDATE_CUSTOMERS: `/processes/request-to-update-customers/${uid}`, // Запит щодо актуалізації основних даних ТКО
    CHANGE_ACCOUNTING_GROUP_ZV: `/processes/change-accounting-group-zv/${uid}`, // Зміна групи обліку за ТКО
    UPDATE_RELATED_SUBCUSTOMERS: `/processes/update-related-subcustomers/${uid}`, // Заявка щодо ідентифікації пов’язаних осіб СПМ/Споживача
    ACTIVATE_AP: `/processes/activating-deactivating/${uid}`, // Активація ТКО
    DEACTIVATE_AP: `/processes/activating-deactivating/${uid}`, // Деактивація ТКО
    REQUEST_ACTIVATE_AP: `/processes/activating-request/${uid}`, // Запит на активацію ТКО
    UPDATE_AP_HISTORY: `/processes/update-ap-history/${uid}`, // Внесення змін до історії основних даних ТКО
    REPORT_ERP: `/processes/erp-report/${uid}`, //Заявка на отримання звіту для ЕРП
    ENTERING_AP_INTO_ACCOUNTING: `/processes/entering-ap/${uid}`, // Введення ТКО в облік
    METER_READING_TRANSFER_PPKO: `/meter-reading/process/${uid}`,
    INFORMING_METER_READING_TRANSFER_PPKO: `/meter-reading/process/informing/${uid}`,
    REPORT_GREXEL: `/processes/report-grexel/${uid}`,
    UPDATE_APS_HISTORY: `/processes/update-aps-history/${uid}`, // Запит на редагування основних даних ТКО
    CHANGE_PAYMENT_TYPE: `/processes/change-payment-type/${uid}`, // Зміна способу оплати послуг з розподілу/передачі е/е
    ARCHIVING_TS: `/processes/correction-archiving-ts/${uid}`, // Заявка на архівацію ДКО
    CORRECTION_TS: `/processes/correction-archiving-ts/${uid}`, // Заявка на коригування ДКО
    REQUEST_ARCHIVING_TS: `/processes/request-archiving-ts/${uid}`, // Запит на архівацію ДКО
    REQUEST_CORRECTION_TS: `/processes/request-correction-ts/${uid}`, // Запит на коригування ДКО
    NEW_AP_PROPERTIES: `/processes/new-ap-properties/${uid}`, // Запит на додавання нових характеристик ТКО,
    ACTIVE_CUSTOMER_AP: `/processes/active-customer-ap/${uid}`, // Заявка на зміну статусу "Активний споживач" за ТКО
    TRANSFER_TS_TO_GREXEL: `/processes/transfer-ts-to-grexel/${uid}`, // Передача ДКО до системи GREXEL
    TERMINATION_METERING_SERVICE: `/processes/accounting-service-completion/${uid}` // Заявка про завершення надання послуг ком. обліку
  };
  return subprocessesNames[subprocess_name];
};
