export const formsSx = {
  'input:-webkit-outer-spin-button': {
    WebkitAppearance: 'none',
    margin: 0
  },
  'input:-webkit-inner-spin-button': {
    WebkitAppearance: 'none',
    margin: 0
  },
  'input[type="number"]': {
    MozAppearance: 'textfield'
  },
  'input[type="file"]': {
    display: 'none'
  },

  '.MuiPickersBasePicker-container': {
    '> .MuiToolbar-root': {
      'h6': {
        fontSize: '16px'
      },
      'h4': {
        textTransform: 'capitalize'
      },
      'h2': {
        fontSize: '42px'
      },
      '.MuiTouchRipple-root': {
        display: 'none'
      }
    },

    '> .MuiPickersBasePicker-pickerView': {
      'p': {
        fontSize: '12px'
      },
      'span': {
        fontSize: '12px'
      },
      'svg': {
        fontSize: '19px'
      },
      '.MuiPickersYear-root': {
        fontSize: '14px'
      },
      '.MuiPickersYear-yearSelected': {
        fontSize: '20px'
      }
    }
  },

  '.drop-down-menu': {
    position: 'relative',

    '> .error-text': {
      position: 'absolute',
      top: '100%',
      left: '3px',
      color: '#f90000',
      fontSize: '10px'
    },

    '> .drop-down': {
      position: 'absolute',
      display: 'none',
      top: '100%',
      left: 0,
      width: '100%',
      backgroundColor: '#fff',
      boxShadow: '0 5px 5px -3px rgba(0, 0, 0, 0.2), 0px 8px 10px 1px rgba(0, 0, 0, 0.14), 0px 3px 14px 2px rgba(0, 0, 0, 0.12)',
      maxHeight: '130px',
      borderRadius: '4px',
      zIndex: 3,
      overflowY: 'scroll',

      '> .empty': {
        display: 'flex',
        justifyContent: 'center',
        color: '#777',
        padding: '4px 0'
      },

      '&.open': {
        display: 'block'
      },

      '.supplier-list': {
        padding: '8px 0',

        '&--item': {
          padding: '6px 16px',
          cursor: 'pointer',
          fontSize: '12px',

          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.04)'
          }
        }
      }
    }
  },

  '.autocomplete': {
    '.MuiOutlinedInput-notchedOutline': {
      border: 0
    },

    '.MuiInputLabel-outlined': {
      transform: 'translate(14px, 14px) scale(1)'
    }
  }
};
