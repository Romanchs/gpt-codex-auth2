export const supplierStatuses = {
  ACTIVE: { value: 'ACTIVE', label: 'SUPPLIERS.ACTIVE' },
  DEFAULT: { value: 'DEFAULT', label: 'SUPPLIERS.DEFAULT' },
  PRE_DEFAULT: { value: 'PRE_DEFAULT', label: 'SUPPLIERS.PRE_DEFAULT' },
  NOT_ACTIVE: { value: 'NOT_ACTIVE', label: 'SUPPLIERS.NOT_ACTIVE' }
};

export const supplierReasons = {
  ACTIVE: {
    PRE_DEFAULT: [
      {
        value: 'NONPAYMENT_BR',
        label: 'SUPPLIERS.NON_PAYMENT',
        typeOfDebt: [
          { value: 'INCONSISTENCY_PPB', label: 'SUPPLIERS.INCONSISTENCY_PPB' },
          { value: 'INCONSISTENCY_PDP', label: 'SUPPLIERS.INCONSISTENCY_PDP' },
          { value: 'NO_BALANCES_DECADE', label: 'SUPPLIERS.IMBALANCES_FOR_DECADE' },
          { value: 'BALANCING_EE_DECADE', label: 'SUPPLIERS.BALANCING_EE_DECADE' },
          { value: 'MONTH_SETTLEMENT', label: 'SUPPLIERS.MONTH_SETTLEMENT' }
        ]
      },
      {
        value: 'VOLUME',
        label: 'SUPPLIERS.VOLUME',
        typeOfDebt: [
          { value: 'MAXIMUM_SALES', label: 'SUPPLIERS.MAXIMUM_SALES' },
          { value: 'INSUFFICIENT_FG', label: 'SUPPLIERS.INSUFFICIENT_FG' }
        ]
      },
      {
        value: 'NONPAYMENT_DISPATCHING',
        label: 'SUPPLIERS.NONPAYMENT_DISPATCHING',
        typeOfDebt: [
          { value: 'TRANSFER', label: 'SUPPLIERS.TRANSFER' },
          { value: 'DISPATCHING', label: 'SUPPLIERS.DISPATCHING' }
        ]
      }
    ],
    DEFAULT: [
      {
        value: 'BANKRUPT',
        label: 'SUPPLIERS.BANKRUPT',
        typeOfDebt: []
      },
      {
        value: 'LOSS_LICENSE',
        label: 'SUPPLIERS.LOSS_LICENSE',
        typeOfDebt: []
      }
    ]
  },
  PRE_DEFAULT: {
    ACTIVE: [
      {
        value: 'PAYMENT_BR',
        label: 'SUPPLIERS.PAYMENT_BR',
        typeOfDebt: []
      },
      {
        value: 'ADJUSTMENT_BR',
        label: 'SUPPLIERS.ADJUSTMENT_BR',
        typeOfDebt: []
      },
      {
        value: 'INCREASING_SIZE_FG',
        label: 'SUPPLIERS.INCREASING_SIZE_FG',
        typeOfDebt: []
      },
      {
        value: 'DECREASE_SALES',
        label: 'SUPPLIERS.DECREASE_SALES',
        typeOfDebt: []
      },
      {
        value: 'ADJUSTMENT_FG',
        label: 'SUPPLIERS.ADJUSTMENT_FG',
        typeOfDebt: []
      },
      {
        value: 'PAYMENT_DISPATCHING',
        label: 'SUPPLIERS.PAYMENT_DISPATCHING',
        typeOfDebt: []
      },
      {
        value: 'CREDITING_FUNDS',
        label: 'SUPPLIERS.CREDITING_FUNDS',
        typeOfDebt: []
      },
      {
        value: 'ADJUSTMENT_DISPATCHING',
        label: 'SUPPLIERS.ADJUSTMENT_DISPATCHING',
        typeOfDebt: []
      }
    ],
    DEFAULT: [
      {
        value: 'PRE_DEFAULT',
        label: 'SUPPLIERS.PRE_DEFAULT_DAYS',
        typeOfDebt: []
      },
      {
        value: 'BANKRUPT',
        label: 'SUPPLIERS.BANKRUPT',
        typeOfDebt: []
      },
      {
        value: 'LOSS_LICENSE',
        label: 'SUPPLIERS.LOSS_LICENSE',
        typeOfDebt: []
      }
    ],
    PRE_DEFAULT: [
      {
        value: 'NONPAYMENT_BR',
        label: 'SUPPLIERS.NON_PAYMENT',
        typeOfDebt: [
          { value: 'INCONSISTENCY_PPB', label: 'SUPPLIERS.INCONSISTENCY_PPB' },
          { value: 'INCONSISTENCY_PDP', label: 'SUPPLIERS.INCONSISTENCY_PDP' },
          { value: 'NO_BALANCES_DECADE', label: 'SUPPLIERS.IMBALANCES_FOR_DECADE' },
          { value: 'BALANCING_EE_DECADE', label: 'SUPPLIERS.BALANCING_EE_DECADE' },
          { value: 'MONTH_SETTLEMENT', label: 'SUPPLIERS.MONTH_SETTLEMENT' }
        ]
      },
      {
        value: 'VOLUME',
        label: 'SUPPLIERS.VOLUME',
        typeOfDebt: [
          { value: 'MAXIMUM_SALES', label: 'SUPPLIERS.MAXIMUM_SALES' },
          { value: 'INSUFFICIENT_FG', label: 'SUPPLIERS.INSUFFICIENT_FG' }
        ]
      },
      {
        value: 'NONPAYMENT_DISPATCHING',
        label: 'SUPPLIERS.NONPAYMENT_DISPATCHING',
        typeOfDebt: [
          { value: 'TRANSFER', label: 'SUPPLIERS.TRANSFER' },
          { value: 'DISPATCHING', label: 'SUPPLIERS.DISPATCHING' }
        ]
      }
    ]
  },
  DEFAULT: {
    NOT_ACTIVE: [
      {
        value: 'RE_CONCLUSION_CONTRACT',
        label: 'SUPPLIERS.RE_CONCLUSION_CONTRACT',
        typeOfDebt: []
      },
      {
        value: 'TERMINATION_CONTRACT_LIQUIDATION',
        label: 'SUPPLIERS.TERMINATION_CONTRACT_LIQUIDATION',
        typeOfDebt: []
      },
      {
        value: 'TERMINATION_CONTRACT_LICENSE',
        label: 'SUPPLIERS.TERMINATION_CONTRACT_LICENSE',
        typeOfDebt: []
      }
    ],
    ACTIVE: [
      {
        value: 'ADJUSTMENT_DEFAULT_OUT',
        label: 'SUPPLIERS.ADJUSTMENT_DEFAULT_OUT',
        typeOfDebt: []
      }
    ]
  },
  NOT_ACTIVE: {
    ACTIVE: [
      {
        value: 'ADJUSTMENT_NA_TO_A',
        label: 'SUPPLIERS.ADJUSTMENT_NA_TO_A',
        typeOfDebt: []
      }
    ]
  }
};

export const DEPT_TYPES = {
  BALANCING_MARKET: 'SUPPLIERS.BALANCING_MARKET',
  INCONSISTENCY_PPB: 'SUPPLIERS.INCONSISTENCY_PPB',
  INCONSISTENCY_PDP: 'SUPPLIERS.INCONSISTENCY_PDP',
  MAXIMUM_SALES: 'SUPPLIERS.MAXIMUM_SALES',
  TRANSFER: 'SUPPLIERS.TRANSFER',
  DISPATCHING: 'SUPPLIERS.NONPAYMENT_DISPATCHING',
  INSUFFICIENT_FG: 'SUPPLIERS.INSUFFICIENT_FG',
  NO_BALANCES_DECADE: 'SUPPLIERS.IMBALANCES_FOR_DECADE',
  BALANCING_EE_DECADE: 'SUPPLIERS.BALANCING_EE_DECADE',
  MONTH_SETTLEMENT: 'SUPPLIERS.MONTH_SETTLEMENT'
};

export const STATUSES = {
  ACTIVE: 'SUPPLIERS.ACTIVE_STATUS',
  NOT_ACTIVE: 'SUPPLIERS.NOT_ACTIVE_STATUS',
  PRE_DEFAULT: 'SUPPLIERS.PRE_DEFAULT_STATUS',
  DEFAULT: 'SUPPLIERS.DEFAULT_STATUS'
};

export const CAUSES = {
  ADJUSTMENT_NA_TO_A: 'SUPPLIERS.ADJUSTMENT',
  NONPAYMENT_BR: 'SUPPLIERS.NON_PAYMENT',
  VOLUME: 'SUPPLIERS.VOLUME',
  NONPAYMENT_DISPATCHING: 'SUPPLIERS.NONPAYMENT_DISPATCHING',
  PAYMENT_BR: 'SUPPLIERS.PAYMENT_BR',
  PAYMENT_DISPATCHING: 'SUPPLIERS.PAYMENT_DISPATCHING',
  INCREASING_SIZE_FG: 'SUPPLIERS.INCREASING_SIZE_FG',
  DECREASE_SALES: 'SUPPLIERS.DECREASE_SALES',
  CREDITING_FUNDS: 'SUPPLIERS.CREDITING_FUNDS',
  ADJUSTMENT_BR: 'SUPPLIERS.ADJUSTMENT_BR',
  ADJUSTMENT_FG: 'SUPPLIERS.ADJUSTMENT_FG',
  ADJUSTMENT_DISPATCHING: 'SUPPLIERS.ADJUSTMENT_DISPATCHING',
  LOSS_LICENSE: 'SUPPLIERS.LOSS_LICENSE',
  BANKRUPT: 'SUPPLIERS.BANKRUPT',
  PRE_DEFAULT: 'SUPPLIERS.PRE_DEFAULT_DAYS',
  RE_CONCLUSION_CONTRACT: 'SUPPLIERS.RE_CONCLUSION_CONTRACT',
  TERMINATION_CONTRACT_LIQUIDATION: 'SUPPLIERS.TERMINATION_CONTRACT_LIQUIDATION',
  TERMINATION_CONTRACT_LICENSE: 'SUPPLIERS.TERMINATION_CONTRACT_LICENSE',
  ADJUSTMENT_DEFAULT_OUT: 'SUPPLIERS.ADJUSTMENT_OUT_DEFAULT'
};

export const CAUSES_EXIT = {
  PAYMENT: 'SUPPLIERS.CAUSES_EXIT.PAYMENT',
  INCREASING_SIZE_FG: 'SUPPLIERS.CAUSES_EXIT.INCREASING_SIZE_FG',
  DECREASE_SALES: 'SUPPLIERS.CAUSES_EXIT.DECREASE_SALES',
  CREDITING_FUNDS: 'SUPPLIERS.CAUSES_EXIT.CREDITING_FUNDS',
  MOVE_TO_DEFAULT: 'SUPPLIERS.CAUSES_EXIT.MOVE_TO_DEFAULT',
  ADJUSTMENT_DEFAULT_OUT: 'SUPPLIERS.ADJUSTMENT_OUT_DEFAULT'
};
