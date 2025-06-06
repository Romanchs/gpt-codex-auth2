export const userSx = {
  '.user-settings': {
    position: 'fixed',
    top: 0,
    right: 0,
    width: '64px',
    height: '64px',
    backgroundColor: '#fff',
    borderRadius: '0 0 0 32px',
    padding: '16px 0',
    overflow: 'hidden',
    zIndex: 998,
    transition: 'width 0.2s ease 0.25s, height 0.2s ease, border-radius 0.25s ease',
    willChange: 'width, height, border-radius',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    '@media (max-width: 599px)': {
      width: '56px'
    },

    '> .content': {
      marginTop: '8px',
      opacity: 0,
      padding: 0,
      transition: '0.2s ease-in-out 0.3s',
      overflowY: 'auto',
      maxHeight: 'calc(100% - 32px)',

      '> .menu-item': {
        backgroundColor: '#567691',
        color: 'white',
        padding: '12px 16px'
      },

      '.collapse': {
        display: 'block',
        position: 'relative',
        padding: '12px 40px 12px 16px',
        '> svg': {
          position: 'absolute',
          right: '12px',
          top: '50%',
          transform: 'translateY(-50%)',
          pointerEvents: 'none'
        },
        '&.active': {
          color: '#f28c60',
          fontWeight: 500
        }
      },

      '.radio-item': {
        padding: '8px 16px',

        '> span': {
          padding: '0 8px',

          svg: {
            fontSize: '14px'
          },

          '&.Mui-checked > span': {
            color: '#f28c60'
          }
        },

        '&.active': {
          color: '#f28c60',
          fontWeight: 500
        }
      }
    },

    '&.open': {
      width: '300px',
      height: '100vh',
      borderRadius: '0',
      transition: 'width 0.2s ease, height 0.2s ease 0.25s, border-radius 0.1s ease 0.3s',
      willChange: 'width, height, border-radius',

      '> .content': {
        opacity: 1
      }
    },

    '> .MuiBadge-root': {
      opacity: 0,
      pointerEvents: 'none',

      '> .MuiBadge-anchorOriginTopRightRectangle': {
        cursor: 'pointer'
      },
    },

    '&.open > .MuiBadge-root': {
      pointerEvents: 'inherit',
      opacity: 1
    },

    '> .icon': {
      position: 'absolute',
      right: '16px',
      top: '16px',
      zIndex: 999,
      color: '#223b82',
      padding: '2px',
      width: '32px',
      height: '32px',
      cursor: 'pointer',
      display: 'inline-block',
      '@media (max-width: 599px)': {
        right: '12px'
      },

      svg: {
        fontSize: '28px',
        transition: '0.3s ease-in-out'
      },

      '&.open svg': {
        transform: 'rotate(180deg) scaleY(0)'
      },

      '&.open .icon--burger': {
        transform: 'rotate(180deg)',
        opacity: 1
      },

      '.MuiBadge-anchorOriginTopRightRectangle': {
        transition: '0.3s ease-in-out'
      },
  
      '&.open .MuiBadge-anchorOriginTopRightRectangle': {
        opacity: 0
      }
    },

    '.icon--burger': {
      backgroundColor: '#223b82',
      opacity: 0,
      position: 'absolute',
      borderRadius: '2px',
      transition: '0.3s ease-in-out',
      width: '21px',
      height: '2px',
      top: '15px',
      left: '5px'
    },

    '.MuiPaper--item': {
      marginTop: '5px'
    }
  }
};
