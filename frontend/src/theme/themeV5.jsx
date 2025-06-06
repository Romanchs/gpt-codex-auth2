import { createTheme } from '@mui/material';
import { MuiTextField } from './components/MuiTextField';
import bgLogo from '../images/logo_bg.svg';
import { loaderSx } from './styles/loaderSx';
import { sideNavSx } from './styles/sideNavSx';
import { tablesSx } from './styles/tablesSx';
import { userSx } from './styles/userSx';
import { globalSx } from './styles/globalSx';
import { headerSx } from './styles/headerSx';
import { ppkoSx } from './styles/ppkoSx';
import { formsSx } from './styles/formsSx';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';

export const themeV5 = createTheme({
  typography: {
    body1: {
      fontWeight: 500
    },
    helper: {
      fontWeight: 400,
      fontSize: 12
    }
  },
  palette: {
    primary: {
      main: '#223B82'
    },
    blue: {
      light: '#4A5B7A',
      dark: '#223B82',
      main: '#223B82',
      contrastText: '#fff'
    },
    orange: {
      light: '#F28C60',
      dark: '#F28C60',
      main: '#F28C60',
      contrastText: '#fff'
    },
    text: {
      secondary: '#567691'
    }
  },
  components: {
    MuiAccordion: {
      defaultProps: {},
      styleOverrides: {
        root: {
          boxShadow: '0px 4px 10px 0px rgba(146, 146, 146, 0.25)',
          '&::before': {
            backgroundColor: 'rgba(0, 0, 0, 0.05)'
          },
          '&:is(.Mui-expanded + .MuiAccordion-root)': {
            borderTopLeftRadius: '8px',
            borderTopRightRadius: '8px',
            '&::before': {
              display: 'none'
            }
          },
          '&:has(+ .Mui-expanded)': {
            borderBottomLeftRadius: '8px',
            borderBottomRightRadius: '8px'
          },
          '&.Mui-expanded': {
            borderRadius: '8px',
            boxShadow: '0px 4px 10px 0px rgba(146, 146, 146, 0.25)',
            backgroundColor: '#D1EDF3'
          },
          '&:first-of-type': {
            borderTopLeftRadius: '8px',
            borderTopRightRadius: '8px'
          },
          '&:last-of-type': {
            borderBottomLeftRadius: '8px',
            borderBottomRightRadius: '8px'
          },
          '&.childAccordion': {
            borderRadius: 0,
            backgroundColor: '#f8faff',
            '&::before': {
              display: 'none'
            },
            '&.Mui-expanded': {
              borderRadius: 0,
              boxShadow: 'none',
              margin: 0
            },
            '&:is(.Mui-expanded + .MuiAccordion-root)': {
              borderRadius: 0,
              '&::before': {
                display: 'none'
              }
            },
            '&:has(+ .Mui-expanded)': {
              borderRadius: 0
            }
          }
        }
      }
    },
    MuiAccordionSummary: {
      defaultProps: {
        expandIcon: <ExpandMoreRoundedIcon />
      },
      styleOverrides: {
        root: {
          flexDirection: 'row-reverse',
          borderRadius: '8px 8px 0 0',
          '&.Mui-expanded': {
            minHeight: '48px'
          }
        },
        expandIconWrapper: {
          marginRight: 12,
          backgroundColor: '#fff',
          boxShadow: '0px 4px 10px 0px rgba(146, 146, 146, 0.25)',
          borderRadius: 15,
          '&>svg': {
            fontSize: 24,
            color: '#223B82'
          },
          [`&.Mui-expanded>svg`]: {
            color: '#F28C60'
          },
          '&.childAccordionExpandIconWrapper': {
            '&.MuiAccordionSummary-expandIconWrapper': {
              marginRight: 12,
              marginLeft: 12,
              backgroundColor: 'transparent',
              borderRadius: 15,
              boxShadow: 'none'
            }
          }
        },
        content: {
          color: '#4A5B7A',
          fontSize: 12,
          fontWeight: 500,
          '&.Mui-expanded': {
            margin: '12px 0'
          }
        }
      }
    },
    MuiAccordionDetails: {
      styleOverrides: {
        root: {
          background: 'white',
          borderRadius: '0 0 8px 8px'
        }
      }
    },
    MuiTextField,
    MuiAutocomplete: {
      styleOverrides: {
        inputRoot: {
          padding: '4.5px 9px'
        }
      }
    },
    MuiFab: {
      styleOverrides: {
        root: {
          zIndex: 0
        }
      }
    },
    MuiCssBaseline: {
      styleOverrides: {
        html: {
          fontSize: 13,
          lineHeight: 1.2,
          backgroundImage: `url(${bgLogo})`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: '100vw calc(100% - 150px)',
          backgroundPosition: 'center 100px',
          backgroundAttachment: 'fixed',
          '*::-webkit-scrollbar': {
            width: 5,
            height: 5
          },
          '*::-webkit-scrollbar-track': {
            WebkitBoxShadow: 'inset 0 0 6px rgba(0, 0, 0, 0.2)',
            borderRadius: 10
          },
          '*::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            borderRadius: 8
          },
          '*::-webkit-scrollbar-button': {
            display: 'none'
          },
          '.boxShadow': {
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
            backgroundColor: '#fff',
            borderRadius: '8px',
            position: 'relative'
          },
          '#notistack-snackbar': {
            fontSize: '12px',
            '& > svg': {
              fontSize: '12px !important',
              marginBottom: '2px'
            }
          },
          ...globalSx,
          ...formsSx,
          ...ppkoSx,
          ...headerSx,
          ...loaderSx,
          ...sideNavSx,
          ...tablesSx,
          ...userSx
        },
        body: {
          backgroundColor: 'rgba(248, 250, 255, 0.9)',
          minHeight: '100vh',
          overflowX: 'hidden'
        }
      }
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          borderRadius: '8px'
        },
        list: {
          padding: 0
        }
      }
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          ':hover': {
            backgroundColor: '#D1EDF3'
          }
        }
      }
    }
  }
});
