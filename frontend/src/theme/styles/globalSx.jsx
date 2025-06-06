export const globalSx = {
  'p, h1, h2, h3, h4, h5, h6, span': {
    margin: 0,

    '&.success': {
      color: '#1d875a',
      '&--light': {
        color: '#68d060'
      }
    },

    '&.danger': {
      color: '#f90000'
    },

    '&.orange': {
      color: '#ef936c'
    }
  },

  'button:focus': {
    outline: 'none'
  },

  '.text-right': {
    textAlign: 'right'
  },

  '.app-wrapper': {
    position: 'relative',
    width: '100vw',
    '.page': {
      paddingTop: '80px',
      width: '100vw'
    }
  },

  '.rotating': {
    animation: 'rotating 2s linear infinite'
  },

  '@keyframes rotating': {
    from: { transform: 'rotate(0deg)' },
    to: { transform: 'rotate(360deg)' }
  },

  'input[type="checkbox"]': {
    margin: 0
  },

  'input:-webkit-autofill, input:-webkit-autofill:hover, input:-webkit-autofill:focus, textarea:-webkit-autofill, textarea:-webkit-autofill:hover, textarea:-webkit-autofill:focus, select:-webkit-autofill, select:-webkit-autofill:hover, select:-webkit-autofill:focus': {
      WebkitTextFillColor: '#4a5b7a',
      WebkitBoxShadow: '0 0 0 1000px #fff inset',
      transition: 'background-color 5000s ease-in-out 0s'
  },

  input: {
    boxSizing: 'border-box',
    lineHeight: '20px'
  },

  '.MuiFormLabel-root::before': {
    content: '""',
    display: 'block',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: '-3px',
    right: '-3px',
    zIndex: '-1',
    backgroundColor: '#fff'
  }
};
