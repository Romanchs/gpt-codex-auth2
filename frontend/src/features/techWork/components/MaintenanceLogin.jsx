import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ErrorRounded from '@mui/icons-material/ErrorRounded';
import { AuthWrapper } from '../../../Components/auth/AuthWrapper';
import moment from 'moment';
import { useTranslation } from 'react-i18next';

const MaintenanceLogin = ({ data }) => {
  const { t } = useTranslation();
  return (
    <AuthWrapper>
      <Box sx={{ minHeight: 283, textAlign: 'center' }}>
        <ErrorRounded sx={styles.icon} />
        <Typography component="h3" sx={styles.title}>
          {t('TECH_WORKS.LOGIN.TITLE')}
        </Typography>
        <Box sx={styles.splitter}></Box>
        <Typography component="p" sx={{ ...styles.text, color: '#FF0000' }}>
          {t('TECH_WORKS.LOGIN.DATE_TEXT')}
        </Typography>
        {data && (
          <Typography component="p" sx={{ ...styles.text, color: '#FF0000' }} data-marker="info-text">
            {moment(data).format('DD.MM.YYYY • HH:mm')}
          </Typography>
        )}
        <Typography component="p" sx={{ ...styles.text, color: '#567691' }}>
          {t('TECH_WORKS.LOGIN.TEXT')}
        </Typography>
      </Box>
    </AuthWrapper>
  );
};

export default MaintenanceLogin;

const styles = {
  icon: {
    width: 50,
    height: 50,
    color: '#FF0000'
  },
  title: {
    mt: '22px',
    fontWeight: 700,
    fontSize: 18,
    color: '#0D244D'
  },
  splitter: {
    m: '5px auto 35px',
    width: 264,
    height: '0.5px',
    backgroundColor: '#4A5B7A'
  },
  text: {
    fontWeight: 400,
    fontSize: 12
  }
};
