import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useSendEventMutation } from '../../features/actionsLog/api';
import { useCallback } from 'react';
import { TAGS } from './tags';

const useSearchLog = (tags = [], resource, resourceId) => {
  const { pathname } = useLocation();
  const userUid = useSelector((s) => s.user.userUid);
  const activeRoles = useSelector((s) => s.user.activeOrganization?.roles.filter((role) => role.active));
  const activeCompanyId = useSelector((s) => s.user.activeOrganization?.uid);
  const [sendEvent] = useSendEventMutation();

  return useCallback(() => {
    sendEvent({
      user: userUid,
      action: 'Пошук даних',
      source: 'tko-frontend',
      company: activeCompanyId,
      role: activeRoles[0].role,
      tags: TAGS[pathname] || tags,
      referer: window.location.pathname,
      resource: resource,
      resource_id: resourceId,
    });
  }, [userUid, activeRoles, pathname, activeCompanyId, sendEvent, tags]);
};

export default useSearchLog;
