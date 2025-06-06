import Collapse from '@material-ui/core/Collapse';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Radio from '@material-ui/core/Radio';
import ExitToAppRounded from '@mui/icons-material/ExitToAppRounded';
import ExpandLessRounded from '@mui/icons-material/ExpandLessRounded';
import ExpandMoreRounded from '@mui/icons-material/ExpandMoreRounded';
import NotificationsNoneRounded from '@mui/icons-material/NotificationsNoneRounded';
import PersonRounded from '@mui/icons-material/PersonRounded';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { toggleUserMenu } from '../../actions/globalActions';
import { logOut, setActiveRole } from '../../actions/userActions';
import { getFeature } from '../../util/getFeature';
import { Box, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import I18Control from '../../i18n/Control';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import { useUnreadCountQuery } from '../../features/notifications/api';
import { useSendEventMutation } from '../../features/actionsLog/api';
import useChangeRoleLog from '../../services/actionsLog/useChangeRoleLog';

const User = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userNavRef = useRef(null);
  const open = useSelector((s) => s.global.openUserMenu);
  const { authorized } = useSelector((s) => s.user);

  const { data } = useUnreadCountQuery(null, { pollingInterval: 300_000, skip: !authorized });
  const hasUnread = data?.unread;

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, false);
    return () => {
      document.removeEventListener('click', handleClickOutside, false);
    };
  }, []);

  const handleClickOutside = ({ target }) => {
    if (!userNavRef.current?.contains(target) && userNavRef.current?.classList?.contains('open')) {
      dispatch(toggleUserMenu());
    }
  };

  return (
    <div className={`user-settings${open ? ' open' : ''}`} ref={userNavRef}>
      <Badge
        componentsProps={{ badge: { ['data-marker']: 'notifications-indicator' } }}
        overlap="circular"
        color="error"
        variant="dot"
        sx={{ pointerEvents: 'none' }}
        invisible={!hasUnread}
      >
        <IconButton
          data-marker={'notifications'}
          style={{ marginLeft: 16 }}
          size={'small'}
          onClick={() => {
            navigate('/notifications');
            dispatch(toggleUserMenu());
          }}
        >
          <NotificationsNoneRounded style={{ fontSize: 24 }} />
        </IconButton>
      </Badge>
      <div
        className={`icon${open ? ' open' : ''}`}
        data-marker={'user-settings'}
        onClick={() => dispatch(toggleUserMenu())}
      >
        <Badge
          componentsProps={{ badge: { ['data-marker']: 'notifications-indicator' } }}
          overlap="rectangular"
          color="error"
          variant="dot"
          invisible={!getFeature('notifications') || open || !hasUnread}
        >
          <span className="icon--burger"></span>
          <PersonRounded />
        </Badge>
      </div>
      <List className={'content'} style={{ marginTop: 16 }}>
        <Roles />
      </List>
      <Box
        sx={{
          p: '12px',
          position: 'absolute',
          top: open ? 0 : -200,
          right: 50,
          transition: open ? 'top 0.2s ease 0.3s' : 'top 1s ease 0'
        }}
      >
        <I18Control />
      </Box>
    </div>
  );
};
export default User;

const Roles = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    userName,
    organizations,
    esign_org_required: isOrgRequired,
    activeOrganization,
    userUid
  } = useSelector((s) => s.user);
  const activeRoles = activeOrganization?.roles.filter((role) => role.active);
  const activeCompanyId = useSelector((s) => s.user.activeOrganization?.uid);
  const [sendEvent] = useSendEventMutation();
  const [open, setOpen] = useState(false);
  const changeRoleLog = useChangeRoleLog();

  const selectRole = (role) => {
    if (!role.active) {
      const data = activeOrganization.roles.map((r) => ({
        id: r.relation_id,
        active: false
      }));
      changeRoleLog();
      dispatch(setActiveRole([...data, { id: role.relation_id, active: true }]));
    }
    dispatch(toggleUserMenu());
  };

  return (
    <>
      <ListItem button onClick={() => setOpen(!open)} className={'menu-item collapse'}>
        <Stack direction={'row'}>
          <Box
            sx={{
              width: '32px',
              height: '32px',
              backgroundColor: '#fff',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mr: 1
            }}
          >
            <PersonRounded
              sx={{
                color: '#0d244d',
                fontSize: '20px',
                pointerEvents: 'none'
              }}
            />
          </Box>
          <div>
            <Typography component={'p'} sx={{ fontSize: '15px', pb: '5px', lineHeight: 1 }}>
              {userName}
            </Typography>
            <Typography component={'p'} sx={{ fontSize: '12px', lineHeight: 1 }}>
              {activeRoles
                ? activeRoles.length > 1
                  ? 'Усі ролі'
                  : i18n.language === 'ua'
                  ? activeRoles[0].role_ua
                  : activeRoles[0].role
                : ''}
            </Typography>
          </div>
        </Stack>
        <Box sx={{ lineHeight: 1.4, fontSize: '12px', pt: '9px' }}>{activeOrganization?.name}</Box>
        {open ? <ExpandLessRounded sx={{ mr: 1 }} /> : <ExpandMoreRounded sx={{ mr: 1 }} />}
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding data-marker={'organizations'}>
          {organizations?.map((org) => (
            <Organization organization={org} selectRole={selectRole} key={org?.id} disabled={isOrgRequired} />
          ))}
        </List>
      </Collapse>
      <ListItem
        button
        className={'menu-item'}
        onClick={() => {
          sendEvent({
            user: userUid,
            action: 'Вихід',
            source: 'tko-frontend',
            company: activeCompanyId,
            role: activeRoles[0].role,
            tags: [],
            referer: window.location.href
          });
          navigate('/');
          dispatch(logOut());
        }}
      >
        <ExitToAppRounded sx={{ mr: 1 }} />
        {t('LOGIN.SIGN_OUT_OF_ACCOUNT')}
      </ListItem>
    </>
  );
};

const Organization = ({ organization, selectRole, disabled }) => {
  const [open, setOpen] = useState(false);
  const { i18n } = useTranslation();
  const isUA = i18n.language === 'ua';

  return (
    <>
      <ListItem
        button
        onClick={() => setOpen(!open)}
        className={`collapse${organization?.active ? ' active' : ''}`}
        data-marker={'organization'}
        disabled={disabled && !organization?.active}
        data-status={organization?.active ? 'active' : 'inactive'}
      >
        {organization?.name}
        {open ? <ExpandLessRounded /> : <ExpandMoreRounded />}
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding style={{ paddingBottom: 8 }} data-marker={'roles'}>
          {organization?.roles &&
            [...organization.roles]
              ?.sort((a, b) => (isUA ? a?.role_ua.localeCompare(b?.role_ua, 'uk') : a?.role.localeCompare(b?.role)))
              .map((role) => (
                <ListItem
                  button
                  key={role?.relation_id}
                  onClick={() => selectRole(role)}
                  className={`radio-item${role?.active ? ' active' : ''}`}
                  data-marker={'role'}
                  data-status={role?.active ? 'active' : 'inactive'}
                >
                  <Radio checked={role?.active} />
                  {isUA ? role?.role_ua : role?.role.toUpperCase()}
                </ListItem>
              ))}
        </List>
      </Collapse>
    </>
  );
};
