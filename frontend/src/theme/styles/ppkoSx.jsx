export const ppkoSx = {
  '.ppko-form': {
    paddingBottom: '50px',

    'section': {
      '> h4': {
        padding: '16px 24px',
        fontWeight: 'bold',
        fontSize: '16px',
        lineHeight: '16px',
        color: '#fff',
        background: '#223b82'
      },

      '> .form-section': {
        width: '100%',
        padding: '28px 24px',
        border: '1px solid #d1edf3',
        boxShadow: '0px 4px 10px rgba(146, 146, 146, 0.25)',
        backgroundColor: '#fff',

        '&.roles': {
          maxHeight: '600px',
          overflowY: 'auto',
          maxWidth: '100%',
          overflowX: 'auto',
          '.roles-body': {
            minWidth: '1150px'
          }
        },

        'h5': {
          margin: '0 8px 20px',
          fontWeight: 'bold',
          fontSize: '16px',
          lineHeight: '19px',
          color: '#4a5b7a'
        },

        '> p.danger': {
          marginBottom: '15px',
          textAlign: 'center',
          paddingRight: 0,
          color: '#f90000',
          fontWeight: 'bold'
        },

        p: {
          fontSize: '14px',
          lineHeight: '17px',
          color: '#6c7d9a',
          fontWeight: 'normal',
          marginBottom: '7px',
          paddingRight: '25px',

          '&.Mui-error': {
            color: '#f90000',
            fontSize: '10px',
            lineHeight: '1.2'
          },

          '> span': {
            marginLeft: '3px',
            fontSize: '15px'
          }
        },

        '.text-field': {
          width: '100%',
          position: 'relative',
          paddingRight: '28px',
          paddingBottom: '24px',

         '> input': {
            width: '100%',
            background: '#fcfcfc',
            outline: 'none',
            border: '1px solid #e9edf6',
            borderRadius: '8px',
            fontSize: '14px',
            color: '#333',
            padding: '5px 28px 5px 8px'
          },

         '> svg': {
            position: 'absolute',
            right: '32px',
            top: '5px',
            color: '#c6c6c6',
            fontSize: '21px'
          }
        },

        '.error': {
          '> .error-text': {
            display: 'block',
            position: 'relative',
            top: '2px',
            left: '3px',
            color: '#f90000',
            fontSize: '10px',
            lineHeight: '1.35'
          },

          '> input': {
            borderColor: '#f90000'
          }
        }
      },

      '&:last-child': {
        '> .form-section': {
          borderRadius: '0 0 8px 8px'
        }
      },

      '&:first-of-type': {
        '> h4': {
          borderRadius: '8px 8px 0 0'
        }
      }
    },

    '> button': {
      marginTop: '30px'
    }
  },
  '#ppko-emails-modal': {
    paddingTop: '32px',
    minWidth: '330px',

    '> .email-row': {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '2px 0',
      borderBottom: '1px solid #ccc',

      '> p': {
        fontSize: '13px',
        maxWidth: '280px',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      },

      '> button': {
        color: '#f90000',
        padding: '8px',

        '&:disabled': {
          color: 'transparentize(#f90000, 0.5)'
        },

        'svg': {
          fontSize: '21px'
        }
      }
    },

    '> .add': {
      marginTop: '16px',
      display: 'flex',
      justifyContent: 'flex-end',
      marginLeft: 'auto',
      position: 'relative',

      '> input': {
        width: 0,
        borderRadius: '20px 0 0 20px',
        border: '0 solid #e9edf6',
        borderRight: 'none',
        outline: 'none',
        padding: '2px 0',
        color: '#fff',
        transition: 'all 0.1s ease-in 0.05s, color 0.1s ease-in',

        '&::placeholder': {
          color: '#fff',
          transition: 'color 0.05s ease-in'
        }
      },

      '> button': {
        borderRadius: '20px',
        transition: 'all 0.1s ease-in 0.2s'
      },

      '.error': {
        position: 'absolute',
        top: '100%',
        left: '6px',
        fontSize: '11px',
        color: '#f90000'
      },

      '&.open': {
        '> input': {
          width: '100%',
          borderRadius: '20px 0 0 20px',
          border: '1px solid #e9edf6',
          borderRight: 'none',
          outline: 'none',
          color: '#333',
          padding: '2px 10px',
          transition: 'all 0.3s ease-in 0.1s, color 0.2s ease-in 0.3s',

          '&::placeholder': {
            color: '#aaa',
            transition: 'color 0.2s ease-in 0.3s'
          }
        },

        '> button': {
          borderRadius: '0 20px 20px 0',
          transition: 'all 0.1s ease-in',
          borderLeft: 'none'
        }
      },

      '&.error': {
        animation: 'shake 0.37s cubic-bezier(0.36, 0.07, 0.19, 0.97) both',
        transform: 'translate3d(0, 0, 0)',
        backfaceVisibility: 'hidden',
        perspective: '1000px',

        input: {
          borderColor: '#f90000',
          transition: 'none'
        },
        button: {
          borderColor: '#f90000',
          transition: 'none'
        }
      }
    },

    '> .controls': {
      display: 'flex',
      margin: '36px -12px 0',

      '> button': {
        margin: '0 12px',
        flex: 1
      }
    }
  },
  '@keyframes shake': {
    '0%': { left: '-2px' },
    '16%': { left: '5px' },
    '33%': { left: '-7px' },
    '50%': { left: '5px' },
    '66%': { left: '-2px' },
    '83%': { left: '1px' },
    '100%': { left: 0 }
  }
};
