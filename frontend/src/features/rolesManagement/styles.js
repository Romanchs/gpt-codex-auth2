import makeStyles from '@material-ui/core/styles/makeStyles';

export const useStyles = makeStyles(() => ({
  root: {
    marginTop: 24,
    background: '#fff',
    padding: 20,
    borderRadius: 10
  },
  content: {
    padding: '0 20px'
  },
  tabs: {
    borderRight: '1px solid #D1EDF3'
  },
  tab: {
    justifyContent: 'start',
    minHeight: 40,

    '&.MuiTab-root': {
      padding: '0 20px 0 0',
      textAlign: 'left',
      justifyContent: 'start'
    },

    '& .MuiTab-wrapper': {
      justifyContent: 'start',
      display: 'inline'
    }
  },

  relationModal: {
    width: 764,
    padding: '20px 0'
  },

  tree: {
    '& .rct-text': {
      height: 40,
      paddingLeft: 15,

      '&:hover': {
        background: '#D2FFD6'
      },

      '& .rct-node-clickable': {
        width: '100%',
        height: '100%'
      }
    },

    '& .rct-node-clickable': {
      display: 'flex',
      alignItems: 'center',
      background: 'none',

      '&:hover': {
        background: 'none'
      }
    },

    '& label': {
      '&:hover': {
        background: 'none'
      }
    },

    '& .rct-node-icon': {
      display: 'flex',
      alignItems: 'center',

      '& svg': {
        color: '#0D244D',
        fontSize: '16px',
        width: 24
      }
    },

    '& .rct-node-expanded': {
      '& .rct-text': {
        background: '#D1EDF3',

        '&:hover': {
          background: '#D2FFD6'
        }
      },

      '& ol': {
        '& .rct-text': {
          background: '#DAF3F9'
        },

        '& ol': {
          '& .rct-text': {
            background: '#DAF8FF'
          },

          '& ol': {
            '& .rct-text': {
              background: '#EAFBFF'
            },

            '& ol': {
              '& .rct-text': {
                background: '#F7FEFF'
              }
            }
          }
        }
      }
    },

    '& ol ol': {
      padding: 0,

      '& .rct-text': {
        paddingLeft: 40
      },

      '& ol': {
        '& .rct-text': {
          paddingLeft: 80
        },

        '& ol': {
          '& .rct-text': {
            paddingLeft: 120
          },

          '& ol': {
            '& .rct-text': {
              paddingLeft: 160
            },

            '& ol': {
              '& .rct-text': {
                paddingLeft: 200
              }
            }
          }
        }
      }
    },

    '& .rct-checkbox': {
      width: 24,
      marginTop: 6,
      display: 'inline-block'
    },

    '& .rct-collapse': {
      width: 30
    },

    '& .rct-disabled > .rct-text > label': {
      opacity: 0.2
    }
  },
  halfCheck: {
    opacity: 0.5
  },

  change: { marginBottom: 12 },

  module: { marginBottom: 32 },

  title: {
    marginBottom: 16,
    fontWeight: 500
  },

  list: {
    padding: 0
  },

  listItem: {
    padding: 0,
    marginBottom: 16
  },

  archivedRow: {
    '& > *': {
      background: '#f9f9f9'
    }
  },

  buttonArchive: {
    '& .MuiSvgIcon-root': {
      color: '#f90000',

      '&:hover': {
        opacity: 0.7
      }
    }
  },

  buttonUnArchive: {
    '& .MuiSvgIcon-root': {
      color: '#1d875a',

      '&:hover': {
        opacity: 0.7
      }
    }
  },

  archived: {
    '&.body__table-row td': {
      color: 'rgba(74, 91, 122, .5)'
    }
  }
}));
