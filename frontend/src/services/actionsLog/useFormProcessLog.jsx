import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useSendEventMutation } from '../../features/actionsLog/api';
import { useCallback } from 'react';
import { TAGS } from './tags';

const useFormProcessLog = (tags = []) => {
  const { pathname } = useLocation();
  const userUid = useSelector((s) => s.user.userUid);
  const activeRoles = useSelector((s) => s.user.activeOrganization?.roles.filter((role) => role.active));
  const activeCompanyId = useSelector((s) => s.user.activeOrganization?.uid);
  const [sendEvent] = useSendEventMutation();

  return useCallback((processUid) => {
    const body =  {
      user: userUid,
      action: 'Формування процесу',
      source: 'tko-frontend',
      company: activeCompanyId,
      role: activeRoles[0].role,
      tags: TAGS[pathname] || tags,
      ...(processUid 
          ? { resource: 'process', resource_id: processUid } 
          : { referer: pathname })
    };
    sendEvent(body);
  }, [userUid, activeRoles, pathname, activeCompanyId, tags, sendEvent]);
};

export default useFormProcessLog;
