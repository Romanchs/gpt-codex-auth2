import {createTheme} from '@material-ui/core/styles'; // import createBreakpoints from "@material-ui/core/styles/createBreakpoints";
// import createBreakpoints from "@material-ui/core/styles/createBreakpoints";

// const breakpoints = createBreakpoints({});

export const theme = createTheme({
  palette: {
    type: 'light',
    primary: {
      main: '#223B82',
      light: '#223B82'
    },
    secondary: {
      main: '#F28C60'
    },
    text: {
      primary: '#0D244D',
      secondary: '#4A5B7A'
    }
  },
  typography: {
    h2: {
      fontWeight: 400,
      fontSize: 18,
      lineHeight: 1.2
    },
    h3: {
      fontWeight: 400,
      fontSize: 15,
      lineHeight: 1.2
    },
    body1: {
      fontSize: 14
    },
    body2: {
      fontSize: 12,
      fontWeight: 400
    }
  }
});
