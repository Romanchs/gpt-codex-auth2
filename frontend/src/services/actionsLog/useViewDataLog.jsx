import { useSelector } from 'react-redux';
import { useSendEventMutation } from '../../features/actionsLog/api';
import { useCallback } from 'react';
import { useLocation } from 'react-router-dom';

const useViewDataLog = (tags = [], resource, resourceId) => {
  const { pathname } = useLocation();
  const userUid = useSelector((s) => s.user.userUid);
  const activeRoles = useSelector((s) => s.user.activeOrganization?.roles.filter((role) => role.active));
  const activeCompanyId = useSelector((s) => s.user.activeOrganization?.uid);
  const [sendEvent, { isUninitialized }] = useSendEventMutation();

  return useCallback(() => {
    if (userUid && activeRoles && isUninitialized) {
      sendEvent({
        user: userUid,
        action: 'Перегляд даних',
        source: 'tko-frontend',
        company: activeCompanyId,
        role: activeRoles[0].role,
        tags: tags,
        resource: resource,
        resource_id: resourceId,
        referer: pathname
      });
    }
  }, [userUid, activeRoles, isUninitialized, activeCompanyId, resource, resourceId, sendEvent, tags]);

};

export default useViewDataLog;
