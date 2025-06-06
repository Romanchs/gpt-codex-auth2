import ReactDOM from 'react-dom';
import App from './App';
import { store } from './store/store';
import { Provider } from 'react-redux';
import { ThemeProvider as ThemeProviderV5 } from '@mui/material/styles';
import { ThemeProvider } from '@material-ui/core/styles';
import { theme } from './theme/theme';
import { themeV5 } from './theme/themeV5';
import { CssBaseline } from '@mui/material';

ReactDOM.render(
  <Provider store={store}>
    <ThemeProviderV5 theme={themeV5}>
      <ThemeProvider theme={theme}>
        <App />
        <CssBaseline />
      </ThemeProvider>
    </ThemeProviderV5>
  </Provider>,
  document.getElementById('root')
);
