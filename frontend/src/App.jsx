import 'moment/locale/uk';
import 'moment-timezone';
import 'react-checkbox-tree/lib/react-checkbox-tree.css';

import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';

import moment from 'moment';
import { SnackbarProvider } from 'notistack';

import Routes from './Components/Routes';
import Notifier from './util/Notifier';
import { useTranslation } from 'react-i18next';
import { i18resources } from './i18n/i18n';
import Logger from './services/Logger';
import { getFeature } from './util/getFeature';
import { sockets } from './app/sockets';
import SecurityHandlerDialog from './services/securityHandler/Dialog';

const App = () => {
  const { i18n } = useTranslation();
  moment.locale(i18resources[i18n.language].localeCode);
  moment.tz.setDefault('Europe/Kiev');
  sockets.init();

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils} locale={i18resources[i18n.language].locale}>
      <SnackbarProvider
        maxSnack={3}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
        hideIconVariant
      >
        <Notifier />
        {getFeature('logger') && <Logger />}
        <Routes />
        <SecurityHandlerDialog />
      </SnackbarProvider>
    </MuiPickersUtilsProvider>
  );
};

export default App;
