import SettingsRounded from '@mui/icons-material/SettingsRounded';
import ViewCompactRounded from '@mui/icons-material/ViewCompactRounded';
import ViewWeekRounded from '@mui/icons-material/ViewWeekRounded';
import FilterListRounded from '@mui/icons-material/FilterListRounded';
import TableChartRounded from '@mui/icons-material/TableChartRounded';
import FormatColorTextRounded from '@mui/icons-material/FormatColorTextRounded';

export const DICTIONARY_LABELS = {
  FUNCTIONS: 'Функції',
  showOnMainPage: 'Показувати на головній',
  SHOW_MAIN_PAGE: 'Показувати на головній',
  access: 'Доступ до сторінки',
  ACCESS: 'Доступ до сторінки',
  CONTROLS: 'Дії',
  TABS: 'Таби',
  FIELDS: 'Поля',
  TABLE_CELLS: 'Колонки таблиці',
  FILTERS: 'Фільтри',

  FAQ: 'Модуль: FAQ',
  PPKO: 'Модуль: Реєстр ППКО',
  REPORTS: 'Модуль: Звіти',
  DISPUTES: 'Модуль: Суперечки',
  PROCESSES: 'Модуль: Реєстр процесів',
  SUPPLIERS: 'Модуль: Учасники ринку',
  PPKO_BY_ZV: 'Модуль: Ведення відповідальних ППКО у ролі ОДКО по ZV',
  ADMIN_USERS: 'Модуль: Адміністрування користувачів',
  DIRECTORIES: 'Модуль: Довідники',
  TIME_SERIES: 'Модуль: Завантаження ДКО по ППВДЕ',
  INSTRUCTIONS: 'Модуль: Інструкції',
  INIT_PROCESSES: 'Модуль: Новий процес',
  PROCESS_MANAGER: 'Модуль: Менеджер процесів',
  PROCESS_SETTINGS: 'Модуль: Налаштування процесів',

  GTS: 'Модуль: Часові ряди',
  GTS_PAGE_DKO: 'Сторінка: Перегляд ДКО',
  GTS_PAGE_DKO_CONTROLS_createDispute: 'Ініціювання суперечок',
  GTS_PAGE_FILES: 'Сторінка: Передача часових рядів',
  GTS_PAGE_FILES_CONTROLS_upload: 'Імпорт ДКО',
  GTS_PAGE_REPORTS: 'Сторінка: Звіти',
  GTS_PAGE_TKO_LIST: 'Сторінка: Перегляд списку ТКО',
  GTS_PAGE_TKO_LIST_CONTROLS_uploadDKO: 'Імпорт ДКО',
  GTS_PAGE_TKO_LIST_CONTROLS_regionBalance: 'Звіти',
  GTS_PAGE_TKO_LIST_TABLE_CELLS_DOWNLOAD_DKO: 'Завантаження ДКО',
  GTS_PAGE_UPLOAD_RESULTS: 'Сторінка: Результати завантаження ДКО',
  GTS_PAGE_SETTING_REPORT: 'Сторінка: Налаштування звіту',

  TKO: 'Модуль: Реєстр ТКО',

  // Delete
  GTS_PAGE_MAIN_LIST: 'Сторінка: Перегляд списку ТКО',
  GTS_PAGE_MAIN_LIST_FUNCTIONS_deleteDispute: 'Удалити суперечку',
  GTS_PAGE_MAIN_LIST_FUNCTIONS_exportDKO: 'Експорт ДКО',
  TKO_PAGE_SECOND_LIST: 'Сторінка: Характеристики ТКО',
  TKO_PAGE_SECOND_LIST_FUNCTIONS_createDispute: 'Ініціювати суперечку',
  TKO_PAGE_SECOND_LIST_FUNCTIONS_download: 'Сформувати витяг',

  DISPUTES_PAGE_DISPUTES_LIST: 'Сторінка: Перегляд списку суперечок',
  DISPUTES_PAGE_DISPUTE_TKO_ENTITY: 'Сторінка: Суперечки ТКО',
  DISPUTES_PAGE_DISPUTE_DKO_ENTITY: 'Сторінка: Суперечки ДКО',
  DISPUTES_PAGE_CREATE_DISPUTE_TKO: 'Сторінка: Створення суперечки ТКО',
  DISPUTES_PAGE_CREATE_DISPUTE_DKO: 'Сторінка: Створення суперечки ДКО',

  DISPUTES_PAGE_DISPUTES_LIST_FIELDS_AKO: 'ПІБ відповідального АКО',
  DISPUTES_PAGE_DISPUTES_LIST_FIELDS_DISPUTES_TYPE: 'Тип суперечки',
  DISPUTES_PAGE_DISPUTES_LIST_FIELDS_FINISHED_AT: 'Дата вирішення',
  DISPUTES_PAGE_DISPUTES_LIST_FIELDS_MUST_BE_FINISHED_AT: 'Очікувана дата вирішення суперечки',
  DISPUTES_PAGE_DISPUTES_LIST_FIELDS_CONTINUED: 'Продовжена',

  DISPUTES_PAGE_DISPUTES_LIST_FILTERS_AKO: 'ПІБ відповідального АКО',

  DISPUTES_PAGE_DISPUTE_TKO_ENTITY_FIELDS_AKO: 'ПІБ відповідального АКО',
  DISPUTES_PAGE_DISPUTE_TKO_ENTITY_FIELDS_INITIATOR: 'ПІБ користувача–ініціатора',
  DISPUTES_PAGE_DISPUTE_TKO_ENTITY_FIELDS_EXECUTOR_COMPANY: 'Назва компанії–виконавця',

  DISPUTES_PAGE_DISPUTE_TKO_ENTITY_TABS_AKO: 'AKO',
  DISPUTES_PAGE_DISPUTE_TKO_ENTITY_FUNCTIONS_ADD_DECISION: 'Додати рішення',
  DISPUTES_PAGE_DISPUTE_TKO_ENTITY_FUNCTIONS_ADD_PROPOSITION: 'Додати свої пропозиції на розгляд',
  DISPUTES_PAGE_DISPUTE_TKO_ENTITY_FUNCTIONS_ADD_REPROCESSING: 'Врегулювання суперечки',

  DISPUTES_PAGE_DISPUTE_TKO_ENTITY_CONTROLS_TO_WORK: 'Взяти в роботу',
  DISPUTES_PAGE_DISPUTE_TKO_ENTITY_CONTROLS_PROCESSED: 'Опрацьована',
  DISPUTES_PAGE_DISPUTE_TKO_ENTITY_CONTROLS_CONTINUE: 'Продовжити на 15 днів',
  DISPUTES_PAGE_DISPUTE_TKO_ENTITY_CONTROLS_UPLOAD: 'Завантажити',
  DISPUTES_PAGE_DISPUTE_TKO_ENTITY_CONTROLS_CANCEL: 'Скасувати',
  DISPUTES_PAGE_DISPUTE_TKO_ENTITY_CONTROLS_REPROCESSING: 'На доопрацювання',
  DISPUTES_PAGE_DISPUTE_TKO_ENTITY_CONTROLS_APPROVE: 'Згоден',
  DISPUTES_PAGE_DISPUTE_TKO_ENTITY_CONTROLS_RESOLVED: 'Вирішено',
  DISPUTES_PAGE_DISPUTE_TKO_ENTITY_CONTROLS_TRANSFER_TO_AKO: 'Передати АКО',
  DISPUTES_PAGE_DISPUTE_TKO_ENTITY_CONTROLS_UPLOAD_AKO: 'Завантажити (АКО)',
  DISPUTES_PAGE_DISPUTE_TKO_ENTITY_CONTROLS_AKO_TO_WORK: 'Взяти в роботу (АКО)',
  DISPUTES_PAGE_DISPUTE_TKO_ENTITY_CONTROLS_AKO_RESOLVED: 'Врегульовано (АКО)',

  DISPUTES_PAGE_DISPUTE_DKO_ENTITY_FIELDS_AKO: 'ПІБ відповідального АКО',
  DISPUTES_PAGE_DISPUTE_DKO_ENTITY_TABS_AKO: 'АКО',
  DISPUTES_PAGE_DISPUTE_DKO_ENTITY_FUNCTIONS_ADD_DECISION: 'Додати рішення',
  DISPUTES_PAGE_DISPUTE_DKO_ENTITY_FUNCTIONS_ADD_PROPOSITION: 'Додати свої пропозиції на розгляд',
  DISPUTES_PAGE_DISPUTE_DKO_ENTITY_FUNCTIONS_ADD_REPROCESSING: 'Врегулювання суперечки',

  DISPUTES_PAGE_DISPUTE_DKO_ENTITY_CONTROLS_TO_WORK: 'Взяти в роботу',
  DISPUTES_PAGE_DISPUTE_DKO_ENTITY_CONTROLS_PROCESSED: 'Опрацьована',
  DISPUTES_PAGE_DISPUTE_DKO_ENTITY_CONTROLS_CONTINUE: 'Продовжити на 15 днів',
  DISPUTES_PAGE_DISPUTE_DKO_ENTITY_CONTROLS_UPLOAD: 'Завантажити',
  DISPUTES_PAGE_DISPUTE_DKO_ENTITY_CONTROLS_CANCEL: 'Скасувати',
  DISPUTES_PAGE_DISPUTE_DKO_ENTITY_CONTROLS_REPROCESSING: 'На доопрацювання',
  DISPUTES_PAGE_DISPUTE_DKO_ENTITY_CONTROLS_APPROVE: 'Згоден',
  DISPUTES_PAGE_DISPUTE_DKO_ENTITY_CONTROLS_RESOLVED: 'Вирішено',
  DISPUTES_PAGE_DISPUTE_DKO_ENTITY_CONTROLS_TRANSFER_TO_AKO: 'Передати АКО',
  DISPUTES_PAGE_DISPUTE_DKO_ENTITY_CONTROLS_UPLOAD_AKO: 'Завантажити (АКО)',
  DISPUTES_PAGE_DISPUTE_DKO_ENTITY_CONTROLS_AKO_TO_WORK: 'Взяти в роботу (АКО)',
  DISPUTES_PAGE_DISPUTE_DKO_ENTITY_CONTROLS_AKO_RESOLVED: 'Врегульовано (АКО)'
};

export const DICTIONARY_PROPERTIES = [
  'FUNCTIONS',
  'showOnMainPage',
  'SHOW_MAIN_PAGE',
  'access',
  'ACCESS',
  'CONTROLS',
  'TABS',
  'FIELDS',
  'TABLE_CELLS',
  'FILTERS'
];

export const ICONS = {
  FUNCTIONS: <SettingsRounded />,
  CONTROLS: <ViewCompactRounded />,
  TABS: <TableChartRounded />,
  FIELDS: <FormatColorTextRounded />,
  TABLE_CELLS: <ViewWeekRounded />,
  FILTERS: <FilterListRounded />
};

export const PROPERTY_VALUE = {
  DISABLED: 0,
  ON: 1,
  OFF: 2
};
