export const ACTION = {
  // Both
  EDIT_PROPERTY: 'EDIT_PROPERTY',
  // Executor
  TO_WORK: 'TO_WORK',
  PROCESSED: 'PROCESSED',
  CONTINUE: 'CONTINUE',
  UPLOAD: 'UPLOAD',
  UPLOAD_AKO: 'UPLOAD_AKO',
  // Initiator
  CANCEL: 'CANCEL',
  REPROCESSING: 'REPROCESSING',
  APPROVE: 'APPROVE',
  TRANSFER_TO_AKO: 'TRANSFER_TO_AKO',
  AKO_TO_WORK: 'AKO_TO_WORK',
  AKO_DECISION_SEND: 'AKO_DECISION_SEND',
  RESOLVED: 'RESOLVED',
  AKO_RESOLVED: 'AKO_RESOLVED',
  NOT_VALIDATE: 'NOT_VALIDATE'
};

export const EXECUTOR_ACTIONS = {
  [ACTION.TO_WORK]: 'CONTROLS.TAKE_TO_WORK',
  [ACTION.PROCESSED]: 'STATUSES.PROCESSED',
  [ACTION.CONTINUE]: 'STATUSES.CONTINUE',
  [ACTION.UPLOAD]: 'CONTROLS.DOWNLOAD',
  [ACTION.UPLOAD_AKO]: 'CONTROLS.DOWNLOAD',
  [ACTION.RESOLVED]: 'STATUSES.BEEN_RESOLVED'
};

export const INITIATOR_ACTIONS = {
  [ACTION.CANCEL]: 'CONTROLS.CANCEL',
  [ACTION.REPROCESSING]: 'STATUSES.FOR_REVISION',
  [ACTION.APPROVE]: 'STATUSES.APPROVE',
  [ACTION.TRANSFER_TO_AKO]: 'STATUSES.TRANSFER_TO_AKO'
};

export const AKO_ACTIONS = {
  [ACTION.AKO_TO_WORK]: 'CONTROLS.TAKE_TO_WORK',
  [ACTION.AKO_RESOLVED]: 'STATUSES.AKO_PROCESSED'
};

export const DATA_TYPES = {
  DRAFT: 'DRAFT',
  FORMED_EXECUTOR: 'FORMED_EXECUTOR',
  FORMED_INITIATOR: 'FORMED_INITIATOR',
  FORMED_AKO: 'FORMED_AKO'
};

export const SECTIONS = {
  PROPOSE: 'propose',
  AKO: 'ako',
  CHARS: 'chars',
  CONFLICT: 'conflict',
  FILES: 'files',
  HISTORY: 'history',
  CHANGE_REQUEST: 'change'
};

export const ACTIONS_MAP = {
  [ACTION.APPROVE]: {
    title: INITIATOR_ACTIONS[ACTION.APPROVE],
    type: 'thumbup',
    color: 'green'
  },

  [ACTION.CANCEL]: {
    title: INITIATOR_ACTIONS[ACTION.CANCEL],
    type: 'remove',
    color: 'red',
    text: 'CANCEL_PROCESS_CONFIRMATION'
  },

  [ACTION.CONTINUE]: {
    title: EXECUTOR_ACTIONS[ACTION.CONTINUE],
    type: 'update',
    color: 'blue'
  },

  [ACTION.REPROCESSING]: {
    title: INITIATOR_ACTIONS[ACTION.REPROCESSING],
    type: 'autorenew',
    color: 'green'
  },

  [ACTION.PROCESSED]: {
    title: EXECUTOR_ACTIONS[ACTION.PROCESSED],
    type: 'done',
    color: 'green'
  },

  [ACTION.TO_WORK]: {
    title: EXECUTOR_ACTIONS[ACTION.TO_WORK],
    type: 'toWork',
    color: 'green'
  },

  [ACTION.TRANSFER_TO_AKO]: {
    title: INITIATOR_ACTIONS[ACTION.TRANSFER_TO_AKO],
    type: 'redo',
    color: 'green'
  },

  [ACTION.UPLOAD]: {
    title: EXECUTOR_ACTIONS[ACTION.UPLOAD],
    type: 'upload',
    text: 'IMPORT_FILE.IMPORT_SOLUTION_FILE'
  },

  [ACTION.UPLOAD_AKO]: {
    title: EXECUTOR_ACTIONS[ACTION.UPLOAD_AKO],
    type: 'upload',
    text: 'IMPORT_FILE.IMPORT_SOLUTION_FILE',
    visibleForSection: SECTIONS.AKO
  },

  [ACTION.AKO_TO_WORK]: {
    title: AKO_ACTIONS[ACTION.AKO_TO_WORK],
    type: 'toWork',
    color: 'green'
  },

  [ACTION.RESOLVED]: {
    title: EXECUTOR_ACTIONS[ACTION.RESOLVED],
    type: 'done',
    color: 'green'
  },

  [ACTION.AKO_RESOLVED]: {
    title: AKO_ACTIONS[ACTION.AKO_RESOLVED],
    type: 'thumbup',
    color: 'green'
  }
};

export const ACTION_LABELS = {
  [DATA_TYPES.FORMED_EXECUTOR]: EXECUTOR_ACTIONS,
  [DATA_TYPES.FORMED_INITIATOR]: INITIATOR_ACTIONS
};

export const ALLOWED_STATUSES = ['NEW', 'IN_PROCESS', 'PROCESSED', 'REPROCESSING', 'RESOLVED', 'CANCELED'];

export const DISPUTE_ALLOWED_ROLES = ['СВБ', 'АТКО', 'АКО_Суперечки', 'ОМ', 'ОДКО'];
export const DISPUTE_AKO_ALLOWED_ROLES = ['АКО_Суперечки'];

export const AKO_STATUSES = ['AKO_TRANSFERRED', 'AKO_IN_PROCESS', 'AKO_PROCESSED', 'AKO_CANCELED'];

export const DISPUTE_STATUSES = {
  NEW: 'NEW',
  DRAFT: 'DRAFT',
  IN_PROCESS: 'IN_PROCESS',
  PROCESSED: 'PROCESSED',
  REPROCESSING: 'REPROCESSING',
  RESOLVED: 'RESOLVED',
  CANCELED: 'CANCELED',
  AKO_TRANSFERRED: 'AKO_TRANSFERRED',
  AKO_IN_PROCESS: 'AKO_IN_PROCESS',
  AKO_PROCESSED: 'AKO_PROCESSED',
  AKO_CANCELED: 'AKO_CANCELED'
};

export const DECISION_VALUE = {
  YES: 'Так',
  NO: 'Ні'
};

export const PROPERTIES_TYPE = {
  STR: 'str',
  DATE: 'date',
  LIST: 'list'
};

export const DISPUTES_TYPE = {
  TKO: 'Зміна характеристик ТКО',
  DKO: 'Зміна даних комерційного обліку'
};
