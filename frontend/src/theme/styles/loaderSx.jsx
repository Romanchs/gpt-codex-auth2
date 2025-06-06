export const loaderSx = {
  '.page-loader': {
    position: 'fixed',
    width: '100vw',
    height: '0',
    top: '-100vh',
    left: '0',
    background: 'white',
    zIndex: '1000',
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
    opacity: '0',
    transition: 'opacity 0.2s ease 0.1s, height 0s linear 0.3s, top 0s linear 0.3s',
    '> svg': {
      opacity: '0.7'
    },
    '&.loading': {
      top: '0',
      opacity: '1',
      height: '100vh'
    }
  },
  '.block-loader': {
    width: '100%',
    left: '0',
    background: 'rgba(255, 255, 255, 0.4)',
    transition: 'opacity 0.4s ease 0.2s, height 0s linear 0.6s, top 0s linear 0.6s',
    '> svg': {
      opacity: 0.7
    }
  },
  '.pulse': {
    animation: 'pulse 1.3s infinite'
  },
  '.loading-text': {
    background:
      'linear-gradient(90deg, rgb(108, 125, 154) 10%, rgba(108, 125, 154, 0.2) 40%, rgba(108, 125, 154, 0.2) 50%, rgb(108, 125, 154) 90%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    animation: '10s TextAnim linear infinite',
    '&.white': {
      background:
        'linear-gradient(90deg, rgb(255, 255, 255) 10%, rgba(255, 255, 255, 0.2) 40%, rgba(255, 255, 255, 0.2) 50%, rgb(255, 255, 255) 90%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      animation: '10s TextAnim linear infinite'
    }
  },
  '@keyframes TextAnim': {
    '100%': {
      backgroundPosition: '1000px 0'
    }
  },
  '.default-loader': {
    position: 'relative',
    width: '100%',
    left: '0',
    transition: 'opacity 0.4s ease 0.2s, height 0s linear 0.6s, top 0s linear 0.6s',
    '> svg': {
      opacity: 0.7
    }
  },
  '@keyframes pulse': {
    '0%': {
      opacity: '0.3',
      transform: 'scale(0.6)'
    },
    '50%': {
      opacity: '1',
      transform: 'scale(1)'
    },
    '100%': {
      opacity: '0.3',
      transform: 'scale(0.6)'
    }
  }
};
