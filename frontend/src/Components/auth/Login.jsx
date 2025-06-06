import ExitToAppRounded from '@mui/icons-material/ExitToAppRounded';
import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

import { getToken, getTokenByEsign, verifyOtp } from '../../actions/userActions';
import FormInput from '../../Forms/fields/FormInput';
import PasswordField from '../../Forms/fields/PasswordField';
import Form from '../../Forms/Form';
import { ModalWrapper } from '../Modal/ModalWrapper';
import StyledInput from '../Theme/Fields/StyledInput';
import { AuthWrapper } from './AuthWrapper';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

const Login = ({ dispatch, openOtpDialog, otp_error, error }) => {
  const { t } = useTranslation();
  const { pathname, search } = useLocation();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [otpValue, setOtpValue] = useState('');
  const [otpError, setOtpError] = useState(null);
  const [errors, setErrors] = useState({
    password: '',
    username: '',
    notMatch: ''
  });

  useEffect(() => {
    if (pathname === '/login/esign' && !!search) {
      const urlParams = new URLSearchParams(search);
      const code = urlParams.get('code');
      const state = urlParams.get('state');
      if (code) {
        dispatch(getTokenByEsign(code, state, navigate));
      }
    }
  }, [dispatch, pathname]);

  useEffect(() => {
    if (error?.response?.data) {
      setErrors({ ...errors, notMatch: t('LOGIN.WRONG_PASSWORD') });
    }
  }, [error]);

  useEffect(() => {
    if (otpError) {
      setOtpError(null);
    }
    if (otpValue.length === 6) {
      dispatch(verifyOtp({ otp: otpValue }));
    }
  }, [dispatch, otpValue]);

  useEffect(() => {
    if (otp_error) {
      setOtpError(otp_error);
    }
  }, [otp_error]);

  const handleChange = (values) => {
    if (errors.notMatch !== '') setErrors({ ...errors, notMatch: '' });
    if (values?.username && errors.username) setErrors({ ...errors, username: '' });
    if (values?.password && errors.password) setErrors({ ...errors, password: '' });
    setForm(values);
  };

  const handleSignIn = () => {
    if (form?.username && form?.password) {
      dispatch(
        getToken({
          username: form.username,
          password: form.password,
          lang: localStorage.getItem('lang') || 'ua'
        })
      );
    } else {
      setErrors({
        ...errors,
        username: !form?.username && t('LOGIN.ENTER_LOGIN'),
        password: !form?.password && t('LOGIN.ENTER_PASSWORD')
      });
    }
  };

  return (
    <>
      <AuthWrapper
        title={t('LOGIN.ENTER')}
        btnText={t('LOGIN.ENTER_BTN')}
        btnIcon={<ExitToAppRounded />}
        disableBtn={false}
        error={error?.data}
        onClick={handleSignIn}
        isLogin
      >
        <Form name={'log-in'} onChange={handleChange} errors={errors}>
          <div style={{ marginBottom: 16 }}>
            <FormInput name={'username'} label={t('LOGIN.LOGIN')} dataMarker={'login'} />
          </div>
          <div style={{ marginBottom: 8 }}>
            <PasswordField name={'password'} label={t('LOGIN.PASSWORD')} dataMarker={'password'} />
          </div>
        </Form>
        <span className={'danger'}>{error?.response?.data?.data || errors.notMatch}</span>
      </AuthWrapper>
      <ModalWrapper header={t('LOGIN.TWO_FACTOR_AUTH')} open={openOtpDialog}>
        <Box sx={{ pt: 3 }}>
          <Typography component={'p'} sx={{ mb: 1 }}>
            {t('LOGIN.PLEASE_ENTER_AUTHENTIFICATOR_TOKEN')}
          </Typography>
          <StyledInput
            label={t('LOGIN.ENTER_TOKEN')}
            name={'otp'}
            value={otpValue}
            onChange={({ target }) => target.value?.length <= 6 && setOtpValue(target.value)}
            error={otpError}
          />
        </Box>
      </ModalWrapper>
    </>
  );
};

const mapStateToProps = ({ user }) => {
  return {
    openOtpDialog: user.openOtpDialog,
    otp_error: user.otp_error,
    error: user.error,
    esign_error: user.esign_error
  };
};

export default connect(mapStateToProps)(Login);
