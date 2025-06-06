import makeStyles from '@material-ui/core/styles/makeStyles';
import clsx from 'clsx';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { clearCurrentProcessParams } from '../../actions/processesActions';
import { clearGts } from '../../actions/gtsActions';
import { clearForm } from '../../Forms/formActions';
import useMenu from '../../Hooks/useMenu';
import { ReactComponent as Logo } from '../../images/logo_bg.svg';
import { useTranslation } from 'react-i18next';
import { Grid } from '@mui/material';
import Container from '@material-ui/core/Container';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: 24,
    maxWidth: 1380,
    [theme.breakpoints.down('sm')]: {
      marginTop: 12
    },
    '& p': {
      color: '#223B82',
      fontSize: 24,
      fontWeight: 300,
      marginBottom: 4,
      lineHeight: 1.4,
      [theme.breakpoints.down('sm')]: {
        fontSize: 18,
        marginBottom: 4
      }
    }
  },
  logo: {
    height: 82,
    marginRight: 28,
    [theme.breakpoints.down('sm')]: {
      height: 64,
      marginRight: 14
    },
    [theme.breakpoints.down('xs')]: {
      marginRight: 14,
      marginBottom: 12
    }
  },
  header: {
    '&>h3': {
      color: '#A97278',
      fontSize: 52,
      lineHeight: 1,
      fontWeight: 700,
      [theme.breakpoints.down('sm')]: {
        fontSize: 36
      },
      [theme.breakpoints.down('xs')]: {
        fontSize: 26
      },
      '&>span': {
        color: '#223B82'
      }
    }
  },
  block: {
    padding: '28px 16px 22px',
    cursor: 'pointer',
    textAlign: 'center',
    height: '100%',
    '&>svg': {
      fontSize: 48,
      color: '#F28C60'
    },
    '&>h4': {
      fontSize: 16,
      textTransform: 'uppercase',
      color: '#223B82',
      marginTop: 12,
      marginBottom: 12
    },
    '&>p': {
      fontSize: 12,
      color: '#6A869F'
    }
  }
}));

const Home = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const classes = useStyles();
  const menu = useMenu(true);

  useEffect(() => {
    dispatch(clearCurrentProcessParams());
    dispatch(clearForm('processes-filter-form'));
    dispatch(clearGts());
  }, [dispatch]);

  return (
    <Container className={classes.root} data-marker={'home-page'}>
      <Grid container>
        <Grid item xs={12} sm={'auto'}>
          <Logo className={classes.logo} />
        </Grid>
        <Grid item xs={12} sm={'auto'} className={classes.header}>
          <p>{t('LOGIN.WELCOME')}</p>
          <h3>
            <span>UA</span> ENERGY <span>DATA</span>HUB
          </h3>
        </Grid>
      </Grid>
      <p style={{ marginTop: 32, marginBottom: 24 }}>{`${t('LOGIN.SECTIONS_AVAILABLE')}:`}</p>
      <Grid container spacing={3} sx={{ pb: 8 }}>
        {menu.map(({ id, icon, title, path, subMenu }) => (
          <React.Fragment key={id}>
            {path && <MenuItem title={t(title)} icon={icon} path={path} />}
            {!path &&
              subMenu &&
              subMenu.map(({ id, icon, title: subTitle, path, visible }) =>
                visible ? <MenuItem key={id} title={`${t(title)} ${t(subTitle)}`} icon={icon} path={path} /> : null
              )}
          </React.Fragment>
        ))}
      </Grid>
    </Container>
  );
};

const MenuItem = ({ title, icon, path }) => {
  const classes = useStyles();
  const navigate = useNavigate();

  return (
    <Grid item xs={12} sm={6} md={4} lg={3}>
      <div className={clsx(classes.block, 'boxShadow')} onClick={() => navigate(path)} data-marker={'menu-element'}>
        {icon}
        <h4>{title}</h4>
      </div>
    </Grid>
  );
};

export default Home;
