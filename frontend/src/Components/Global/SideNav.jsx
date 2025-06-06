import { Box, ListItemIcon, ListItemText } from '@mui/material';
import Collapse from '@material-ui/core/Collapse/Collapse';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import makeStyles from '@material-ui/core/styles/makeStyles';
import AddRounded from '@mui/icons-material/AddRounded';
import ExpandLessRounded from '@mui/icons-material/ExpandLessRounded';
import ExpandMoreRounded from '@mui/icons-material/ExpandMoreRounded';
import HorizontalRuleRounded from '@mui/icons-material/HorizontalRuleRounded';
import MenuRounded from '@mui/icons-material/MenuRounded';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';

import { toggleSideNav } from '../../actions/globalActions';
import useMenu from '../../Hooks/useMenu';
import { ReactComponent as LogoUSD } from '../../images/UDS-logo.svg';
import { availableProcesses, getEnv } from '../../util/getEnv';
import { themeV5 } from '../../theme/themeV5';
import { checkPermissions } from '../../util/verifyRole';
import { useTranslation } from 'react-i18next';
import { COMPARE_CODES } from '../../util/directories';
import { Logo } from './Logo';

const SideNav = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const open = useSelector((store) => store.global.openSideNav);
  const sideNavRef = useRef(null);
  const { pathname } = useLocation();
  const { informData, adminData } = useMenu();
  const classes = useStyles();

  useEffect(() => {
    if (open) {
      dispatch(toggleSideNav());
    }
  }, [dispatch, pathname]);

  const handleClickOutside = ({ target }) => {
    if (!sideNavRef?.current?.contains(target) && sideNavRef?.current?.classList?.contains('open')) {
      dispatch(toggleSideNav());
    }
    if (target?.className === 'active' && target?.tagName === 'A' && sideNavRef?.current?.classList?.contains('open')) {
      dispatch(toggleSideNav());
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, false);
    return () => {
      document.removeEventListener('click', handleClickOutside, false);
    };
  }, []);

  return (
    <div className={`side-nav${open ? ' open' : ''}`} ref={sideNavRef}>
      <Box sx={styles.menuIconContainer} data-marker={'side-menu'} onClick={() => dispatch(toggleSideNav())}>
        {open ? <HorizontalRuleRounded sx={styles.menuIcon} /> : <MenuRounded sx={styles.menuIcon} />}
      </Box>
      <div className={'logo'} onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
        <Logo type={'logoTransparent'} />
      </div>
      <List component="div" disablePadding className={classes.list}>
        {informData.length > 0 && (
          <>
            <h3 className={classes.subTitle} style={{ textTransform: 'uppercase' }}>
              {t('INFORMATION_BASE')}
            </h3>
            {informData.map(({ title, path, icon, id, subMenu }) => (
              <MenuItem key={id} id={id} path={path} icon={icon} title={t(title)} subMenu={subMenu} />
            ))}
          </>
        )}
        {adminData.length > 0 && (
          <>
            <h3 className={classes.subTitle} style={{ marginTop: 24, textTransform: 'uppercase' }}>
              {t('MANAGEMENT')}
            </h3>
            {adminData.map(({ title, path, icon, id, subMenu }) =>
              id !== 'init-processes' ? (
                <MenuItem key={id} id={id} path={path} icon={icon} title={t(title)} subMenu={subMenu} />
              ) : (
                <InitProcess title={t(title)} key={id} />
              )
            )}
          </>
        )}
      </List>
      <div className={'copyright'}>
        <LogoUSD />
        <p>&copy;{t('COPYRIGHT_TEXT')}.</p>
        <p>v.{getEnv().version}</p>
      </div>
    </div>
  );
};

export default SideNav;

const styles = {
  menuIconContainer: {
    marginLeft: '16px',
    marginBottom: '16px',
    position: 'relative',
    display: 'inline-block',
    width: '32px',
    height: '32px',
    color: '#fff',
    cursor: 'pointer',
    zIndex: 999,
    [themeV5.breakpoints.down('sm')]: {
      marginLeft: '12px'
    }
  },
  menuIcon: {
    width: '100%',
    height: '100%',
    pointerEvents: 'none'
  }
};

const useStyles = makeStyles(() => ({
  list: {
    height: 'calc(100vh - 180px)',
    overflowY: 'auto',
    overflowX: 'hidden'
  },
  subTitle: {
    marginTop: 8,
    marginLeft: 8,
    marginBottom: 8,
    fontSize: 12,
    color: '#fff'
  },
  listItem: {
    color: '#fff',
    textDecoration: 'none',
    borderLeft: '3px solid transparent',
    paddingLeft: 5,
    paddingRight: 8,
    '& .MuiListItemIcon-root': {
      color: '#fff',
      minWidth: 30
    },
    '& .MuiListItemText-root': {
      margin: 0
    },
    '&.active': {
      borderLeft: '3px solid #F28C60',
      '& .MuiListItemIcon-root': {
        color: '#F28C60'
      }
    },
    '&.subMenu': {
      display: 'inline-block',
      position: 'relative',
      borderLeft: 'none',

      '& .MuiListItemIcon-root': {
        color: '#F28C60'
      },

      '& .MuiListItemText-root': {
        paddingLeft: 33
      },

      '&.active': {
        '& .MuiListItemText-root': {
          position: 'relative',

          '&:before': {
            content: '""',
            position: 'absolute',
            display: 'block',
            width: 4,
            height: 8,
            borderRadius: '0 4px 4px 0',
            background: '#F28C60',
            transform: 'translate(0, -50%)',
            left: -4,
            top: '50%'
          }
        }
      }
    }
  }
}));

const MenuItem = ({ id, path, icon, title, subMenu }) => {
  const classes = useStyles();

  return subMenu ? (
    <SubMenuItem id={id} icon={icon} title={title} subMenu={subMenu} />
  ) : (
    <ListItem button component={NavLink} to={path} className={classes.listItem} data-marker={'left-menu-item'}>
      <ListItemIcon>{icon}</ListItemIcon>
      <ListItemText>{title}</ListItemText>
    </ListItem>
  );
};

const SubMenuItem = ({ id, icon, title, subMenu }) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const { t } = useTranslation();

  return (
    <>
      <ListItem
        button
        className={`${classes.listItem} ${pathname.indexOf(id) > 0 && 'active'}`}
        onClick={() => setOpen(!open)}
        data-marker={'left-menu-item'}
      >
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText>{title}</ListItemText>
        {open ? <ExpandLessRounded /> : <ExpandMoreRounded />}
      </ListItem>

      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {subMenu?.map((item) =>
            item?.visible ? (
              <ListItem
                button
                component={NavLink}
                to={item.path}
                className={`${classes.listItem} subMenu`}
                key={item.id}
                data-marker={'left-menu-subitem'}
              >
                <ListItemText>{t(item.title)}</ListItemText>
              </ListItem>
            ) : null
          )}
        </List>
      </Collapse>
    </>
  );
};

const InitProcess = ({ title }) => {
  const navigate = useNavigate();
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const { t, i18n } = useTranslation();

  return (
    <>
      <ListItem button className={classes.listItem} onClick={() => setOpen(!open)} data-marker={'left-menu-item'}>
        <ListItemIcon>
          <AddRounded style={{ transform: `rotate(${open ? 45 : 0}deg)`, transition: '0.3s ease-in-out' }} />
        </ListItemIcon>
        <ListItemText>{title}</ListItemText>
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {availableProcesses
            .sort((a, b) => t(a.title).localeCompare(t(b.title), COMPARE_CODES[i18n.language]))
            .map(({ permission, roles, disabled = false, link, title }) => {
              if (checkPermissions(permission, roles))
                return (
                  <ListItem
                    key={permission}
                    button
                    className={classes.listItem}
                    style={{ paddingLeft: 16 }}
                    disabled={disabled}
                    onClick={() => navigate(link)}
                    data-marker="init-process"
                  >
                    <ListItemIcon style={{ minWidth: 20 }}>
                      <AddRounded fontSize={'small'} />
                    </ListItemIcon>
                    <ListItemText primary={t(title)} />
                  </ListItem>
                );
            })}
        </List>
      </Collapse>
    </>
  );
};
