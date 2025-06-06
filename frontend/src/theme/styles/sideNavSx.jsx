export const sideNavSx = {
  '.side-nav': {
    position: 'fixed',
    top: 0,
    left: 0,
    width: 64,
    height: 64,
    backgroundColor: '#223b82',
    borderRadius: '0 0 32px 0',
    padding: '16px 0',
    overflow: 'hidden',
    zIndex: 998,
    transition: 'width 0.2s ease 0.25s, height 0.2s ease, border-radius 0.25s ease',
    willChange: 'width, height, border-radius',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    '@media (max-width: 599px)': {
      width: '56px'
    },

    '& > .logo': {
      position: 'absolute',
      left: '64px',
      top: '16px',
      opacity: 0,
      display: 'inline-block',
      verticalAlign: 'center',
      transition: '0.2s ease-in-out 0.1s',
      willChange: 'opacity',

      '& > svg': {
        width: '181px'
      }
    },

    '.copyright': {
      opacity: 0,
      left: '-1000px'
    },

    '&.open': {
      width: '300px',
      height: '100vh',
      borderRadius: 0,
      transition: 'width 0.2s ease, height 0.2s ease 0.25s, border-radius 0.1s ease 0.3s',
      willChange: 'width, height, border-radius',

      '& > .logo': {
        opacity: 1
      },

      '.copyright': {
        display: 'block',
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        opacity: 1,
        transition: 'opacity 0.3s ease 0.5s',
        textAlign: 'center',
        padding: '16px',

        '& > svg': {
          width: '40px',
          height: '33px',
          '@media (max-height: 600px)': {
            display: 'none'
          }
        },

        '& > p': {
          color: '#ddd',
          fontSize: '11px',
          lineHeight: 1.1,
          paddingTop: '4px'
        }
      }
    }
  }
};
