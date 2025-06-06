import { useEffect, useState } from 'react';
import Form from '../../Forms/Form';
import PasswordField from '../../Forms/fields/PasswordField';
import GetAppRounded from '@mui/icons-material/GetAppRounded';
import ExitToAppRounded from '@mui/icons-material/ExitToAppRounded';
import SaveRounded from '@mui/icons-material/SaveRounded';
import { connect } from 'react-redux';
import { clearPasswordState, createOtp, createPassword, verifyPassword } from '../../actions/passwordActions';
import { GlobalLoading } from '../Loadings/GlobalLoading';
import { useNavigate } from 'react-router-dom';
import { AuthWrapper } from './AuthWrapper';
import makeStyles from '@material-ui/core/styles/makeStyles';
import QRCode from 'react-qr-code';
import { ModalWrapper } from '../Modal/ModalWrapper';
import AppleStore from '../../images/Appstore_link.png';
import GooglePlay from '../../images/GooglePlay_link.png';
import StyledInput from '../Theme/Fields/StyledInput';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles((theme) => ({
  otp_root: {
    minWidth: 280,
    textAlign: 'center',
    '&>h4': {
      color: '#253461',
      fontSize: 18,
      lineHeight: '24px',
      marginBottom: 5
    },
    '&>h5': {
      color: '#344A8B',
      fontSize: 12,
      lineHeight: '18px',
      padding: 5,
      borderTop: '1px solid #D1EDF3',
      borderBottom: '1px solid #D1EDF3',

      '&>span': {
        fontSize: 12,
        cursor: 'pointer',
        color: '#F28C60',
        '&>svg': {
          fontSize: 16,
          verticalAlign: 'bottom'
        },
        '&:hover': {
          textDecoration: 'underline'
        }
      }
    }
  },
  otp_data: {
    marginTop: 18,
    marginBottom: 24,
    '&>p': {
      color: '#253461',
      fontSize: 12,
      fontWeight: 700,
      lineHeight: '18px',
      padding: '4px 0'
    },
    '&>div': {
      width: 160,
      marginTop: 12
    }
  },
  apps: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column'
    },
    '&>div': {
      textAlign: 'center',
      minWidth: 260,
      marginTop: 36,
      '&>p': {
        color: '#253461',
        fontSize: 15,
        paddingTop: 8,
        paddingBottom: 8
      },
      '&>img': {
        cursor: 'pointer',
        width: 160
      }
    }
  }
}));

const Passwords = ({ dispatch, token, qr_uri, loading, creating, creatingSuccess, tokenInvalid, otp_error, error }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [errors, setErrors] = useState(error);
  const [openAppsDialog, setOpenAppsDialogs] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [otpError, setOtpError] = useState(null);

  useEffect(() => {
    if (error) {
      setErrors(error);
    }
  }, [error]);

  useEffect(() => {
    dispatch(verifyPassword(token));
  }, [dispatch, token]);

  useEffect(() => {
    if (otpError) {
      setOtpError(null);
    }
    if (otpValue.length === 6) {
      dispatch(createOtp(token, { otp: otpValue }));
    }
  }, [dispatch, otpValue]);

  useEffect(() => {
    if (otp_error) {
      setOtpError(otp_error);
    }
  }, [otp_error]);

  useEffect(
    () => () => {
      dispatch(clearPasswordState());
    },
    [dispatch]
  );

  const handleChange = (formData) => {
    setErrors(null);
    setForm(formData);
  };

  const handleSave = () => {
    dispatch(createPassword(token, form));
  };

  if (loading) {
    return <GlobalLoading loading={true} />;
  }

  if (creatingSuccess && Boolean(qr_uri)) {
    return (
      <>
        <AuthWrapper>
          <div className={classes.otp_root}>
            <h4>{t('LOGIN.2_FACTOR_AUTHENTICATION')}</h4>
            <h5>
              {t('LOGIN.SCAN_QR_CODE')}{' '}
              <span onClick={() => setOpenAppsDialogs(true)}>
                Microsoft Authentificator
                <GetAppRounded />
              </span>{' '}
              {t('LOGIN.OR')} Google Authentificator
            </h5>
            <div className={classes.otp_data}>
              <QRCode value={qr_uri} size={200} fgColor={'#253461'} />
              <p>{qr_uri?.split('secret=')[1].split('&issuer')[0]}</p>
              <StyledInput
                label={t('LOGIN.CODE_FROM_APP')}
                name={'otp'}
                onChange={({ target: { value } }) => value?.length <= 6 && setOtpValue(value)}
                value={otpValue}
                error={otpError}
              />
            </div>
          </div>
        </AuthWrapper>
        <ModalWrapper
          open={openAppsDialog}
          onClose={() => setOpenAppsDialogs(false)}
          header={t('LOGIN.DOWNLOAD_MICROSOFT_AUTHENTIFICTOR')}
        >
          <div className={classes.apps}>
            <div>
              <QRCode
                value={'https://apps.apple.com/us/app/microsoft-authenticator/id983156458'}
                size={150}
                fgColor={'#253461'}
              />
              <p>{t('LOGIN.FOR_IOS_USERS')}</p>
              <img
                src={AppleStore}
                alt="AppleStore"
                onClick={() => window.open('https://apps.apple.com/us/app/microsoft-authenticator/id983156458')}
              />
            </div>
            <div>
              <QRCode
                value={'https://play.google.com/store/apps/details?id=com.azure.authenticator'}
                size={150}
                fgColor={'#253461'}
              />
              <p>{t('LOGIN.FOR_ANDROID_USERS')}</p>
              <img
                src={GooglePlay}
                alt="GooglePlay"
                onClick={() => window.open('https://play.google.com/store/apps/details?id=com.azure.authenticator')}
              />
            </div>
          </div>
        </ModalWrapper>
      </>
    );
  }

  if (tokenInvalid || error?.data === t('LOGIN.INVALID_KEY') || creatingSuccess) {
    return (
      <AuthWrapper
        title={creatingSuccess ? t('LOGIN.PASSWORD_SET_SUCCESS') : t('LOGIN.PASSWORD_SET_ERROR')}
        btnIcon={<ExitToAppRounded />}
        btnText={t('LOGIN.ENTER')}
        onClick={() => navigate('/')}
      />
    );
  }

  return (
    <AuthWrapper
      title={t('LOGIN.CREATE_PASSWORD')}
      btnText={t('CONTROLS.SAVE')}
      btnIcon={<SaveRounded />}
      disableBtn={creating}
      error={error?.data}
      onClick={handleSave}
    >
      <Form name={'manage-password'} onChange={handleChange} errors={errors}>
        <div style={{ marginBottom: 16 }}>
          <PasswordField name={'password'} label={t('LOGIN.NEW_PASSWORD')} />
        </div>
        <div style={{ marginBottom: 16 }}>
          <PasswordField name={'confirm_password'} label={t('LOGIN.CONFIRM_PASSWORD')} />
        </div>
      </Form>
    </AuthWrapper>
  );
};

const mapStateToProps = ({ passwords }) => {
  return {
    loading: passwords.loading,
    qr_uri: passwords.qr_uri,
    tokenInvalid: passwords.tokenInvalid,
    creating: passwords.creating,
    creatingSuccess: passwords.creatingSuccess,
    otp_error: passwords.otp_error,
    error: passwords.error
  };
};

export default connect(mapStateToProps)(Passwords);
