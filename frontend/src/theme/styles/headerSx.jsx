export const headerSx = {
  'header.header': {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100vw',
    height: '64px',
    padding: '0 64px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
    backgroundColor: '#fff',
    zIndex: '9',
    '@media (max-width: 599px)': {
      padding: '0 56px'
    },

    '.page-name': {
      display: 'flex',
      alignItems: 'center',
      '> span': {
        marginRight: '8px',
        '@media (max-width: 599px)': {
          display: 'none'
        }
      },

      '> h2': {
        fontWeight: '500',
        fontSize: '16px',
        textTransform: 'uppercase',
        display: 'block',
        maxWidth: '100%',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        '@media (max-width: 599px)': {
          fontSize: '14px'
        }
      }
    },

    '.controls': {
      display: 'flex',
      alignItems: 'flex-end',
      flexWrap: 'nowrap',

      '> *': {
        marginLeft: '16px',
        '@media (max-width: 599px)': {
          marginLeft: '8px'
        }
      }
    }
  }
};
