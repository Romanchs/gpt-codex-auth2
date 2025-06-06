import { useNavigate } from 'react-router-dom';
import { ReactComponent as Logo } from '../../../images/logo_bg.svg';
import { useTranslation } from 'react-i18next';
import { Grid, Container, Box, Typography } from '@mui/material';
import { useEffect } from 'react';
import { checkPermissions } from '../../../util/verifyRole';
import { menuItems } from './constants';
import styles from './styles';

const TeckWorkHome = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!checkPermissions('TECH_WORK.ACCESS', 'АКО_Процеси')) {
      navigate('/');
    }
  }, []);

  return (
    <Container sx={styles.root} data-marker={'tech-work-home-page'}>
      <Grid container>
        <Grid item xs={12} sm={'auto'} sx={styles.logo}>
          <Logo />
        </Grid>
        <Grid item xs={12} sm={'auto'} sx={styles.header}>
          <p>{t('LOGIN.WELCOME')}</p>
          <h3>
            <span>UA</span> ENERGY <span>DATA</span>HUB
          </h3>
        </Grid>
      </Grid>
      <Typography style={{ marginTop: 32, marginBottom: 24 }}>{`${t('LOGIN.SECTIONS_AVAILABLE')}:`}</Typography>
      <Grid container spacing={3} sx={{ pb: 8 }}>
        {menuItems.map(
          ({ icon, title, path, order }) => path && <MenuItem key={order} title={t(title)} icon={icon} path={path} />
        )}
      </Grid>
    </Container>
  );
};

const MenuItem = ({ title, icon, path }) => {
  const navigate = useNavigate();

  return (
    <Grid item xs={12} sm={6} md={4} lg={3}>
      <Box sx={styles.block} onClick={() => navigate(path)} data-marker={'menu-element'}>
        {icon}
        <h4>{title}</h4>
      </Box>
    </Grid>
  );
};

export default TeckWorkHome;
