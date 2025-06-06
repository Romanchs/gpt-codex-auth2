import makeStyles from '@material-ui/core/styles/makeStyles';
import * as moment from 'moment';
import { useEffect, useRef } from 'react';

import { getEnv } from '../../util/getEnv';
import { BlueButton } from '../Theme/Buttons/BlueButton';
import { useTranslation } from 'react-i18next';
import I18Control from '../../i18n/Control';
import { Logo } from '../Global/Logo';
import EsignLogin from "./EsignLogin";

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100vw',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  inner: {
    maxWidth: 800,
    width: '90%',
    border: '1px solid #D1EDF3',
    overflow: 'hidden',
    borderRadius: 16,
    boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.25)',
    display: 'flex',
    [theme.breakpoints.down('sm')]: {
      width: 400,
      maxWidth: '90%'
    },
    '&>svg': {
      width: 480,
      paddingRight: 90,
      paddingLeft: 90,
      background: 'radial-gradient(circle, rgba(34,59,130,0.75) 0%, rgba(34,59,130,1) 100%)',
      [theme.breakpoints.down('sm')]: {
        display: 'none'
      }
    }
  },
  wrapper: {
    minWidth: 320,
    backgroundColor: '#fff',
    padding: '40px 40px 20px',
    [theme.breakpoints.down('sm')]: {
      padding: '30px 40px 20px',
      width: '100%',
      borderRadius: 8
    },
    [theme.breakpoints.down('xs')]: {
      padding: '30px 30px 20px'
    },
    '&>h3': {
      fontSize: 18,
      lineHeight: 1.2,
      color: '#253461',
      fontWeight: 400,
      marginBottom: 24
    },
    '& .MuiInputBase-root.MuiOutlinedInput-root': {
      borderRadius: 10,
      boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)'
    }
  },
  i18Control: {
    width: '100%',
    display: 'flex',
    justifyContent: 'end',
    padding: 0
  },
  buttons: {
    paddingTop: 16,
    marginBottom: 24,

    '& > *': {
      width: '100%',
      marginBottom: 8
    }
  },
  error: {
    color: '#f44336',
    fontSize: 12,
    lineHeight: 1.1
  }
}));

export const AuthWrapper = ({ title, children, btnText, btnIcon, onClick, disableBtn, isLogin, error }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const ref = useRef(null);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown, false);
    return () => document.removeEventListener('keydown', handleKeyDown, false);
  }, []);

  const handleKeyDown = ({ keyCode }) => {
    if (keyCode === 13) {
      ref.current.click();
    }
  };

  const eusignLink = () => {
    const env = getEnv();
    const state = `${moment().unix()}-${(Math.random() * 100000).toFixed(0)}`;

    return `https://${env.idGovUrl}/?response_type=code&auth_type=dig_sign&client_id=${env.client_id}&redirect_uri=${
      window.location.origin
    }/login/esign&state=${state}&lang=${localStorage.getItem('lang') || 'ua'}`;
  };

  return (
    <div className={classes.root}>
      <div className={classes.inner}>
        <Logo />
        <div className={classes.wrapper}>
          <div className={classes.i18Control}>
            <I18Control withOutFetch />
          </div>
          {title && <h3>{title}</h3>}
          {children && children}
          <p className={classes.error}>{error}</p>
          {btnText && (
            <div className={classes.buttons}>
              <BlueButton onClick={onClick} disabled={disableBtn} ref={ref}>
                {btnIcon}
                {btnText}
              </BlueButton>
              {isLogin && (
                <>
                  <BlueButton onClick={() => window.open(eusignLink(), '_self')} disabled={disableBtn}>
                    {t('LOGIN.LOGIN_WITH_ID_GOV_UA')}
                  </BlueButton>
                </>
              )}
            </div>
          )}
        </div>
      </div>
      <EsignLogin onSuccess={() => console.log(123)} />
    </div>
  );
};
