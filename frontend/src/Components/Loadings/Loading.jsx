import { Backdrop } from '@material-ui/core';
import makeStyles from '@material-ui/core/styles/makeStyles';

import { ReactComponent as Logo2 } from '../../images/logo_bg.svg';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles(() => ({
  backdrop: {
    top: 0,
    zIndex: 1301,
    color: '#fff',
    backgroundColor: 'rgba(255,255,255,0.4)',
    flexDirection: 'column',
    '&>svg': {
      opacity: 0.7
    },
    '&>p': {
      fontSize: 14,
      fontWeight: 900,
      marginTop: 12,
      color: 'rgb(108, 125, 154)',
      textShadow: '0 0 4px #fff'
    }
  }
}));

const Loading = ({ loading }) => {
  const { t } = useTranslation();
  const classes = useStyles();

  if (!loading) return null;

  return (
    <Backdrop className={classes.backdrop} open={loading}>
      <Logo2
        className={'pulse'}
        width={'115px'}
        data-marker={'Loader_mask--logo'}
        data-status={loading ? 'active' : 'inactive'}
      />
      <p data-marker={'Loader_mask--text'}>{t('LOADING')}...</p>
    </Backdrop>
  );
};

export default Loading;
