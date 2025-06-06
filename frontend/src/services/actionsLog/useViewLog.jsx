import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useSendEventMutation } from '../../features/actionsLog/api';
import { useCallback } from 'react';
import { TAGS } from './tags';

const useViewLog = (tags) => {
  const { pathname } = useLocation();
  const userUid = useSelector((s) => s.user.userUid);
  const activeRoles = useSelector((s) => s.user.activeOrganization?.roles.filter((role) => role.active));
  const activeCompanyId = useSelector((s) => s.user.activeOrganization?.uid);
  const [sendEvent, { isUninitialized }] = useSendEventMutation();

  return useCallback(
    (processUid) => {
      if ((TAGS[pathname] || tags) && userUid && activeRoles && isUninitialized) {
        const body = {
          user: userUid,
          action: 'Огляд',
          source: 'tko-frontend',
          company: activeCompanyId,
          role: activeRoles[0].role,
          tags: TAGS[pathname] || tags,
          referer: pathname,
          ...(processUid ? { resource: 'process', resource_id: processUid } : {})
        };
        sendEvent(body);
      }
    },
    [userUid, activeRoles, pathname, activeCompanyId, isUninitialized, tags, sendEvent]
  );
};

export default useViewLog;
