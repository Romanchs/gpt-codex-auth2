import { useSelector } from 'react-redux';
import { useSendEventMutation } from '../../features/actionsLog/api';
import { useCallback } from 'react';

const useCancelProcessLog = (tags = []) => {
  const userUid = useSelector((s) => s.user.userUid);
  const activeRoles = useSelector((s) => s.user.activeOrganization?.roles.filter((role) => role.active));
  const activeCompanyId = useSelector((s) => s.user.activeOrganization?.uid);
  const [sendEvent] = useSendEventMutation();

  return useCallback((processUid) => {
    const body =  {
      user: userUid,
      action: 'Скасування процесу',
      source: 'tko-frontend',
      company: activeCompanyId,
      role: activeRoles[0].role,
      tags: tags,
      ...(processUid 
          ? { resource: 'process', resource_id: processUid } 
          : { referer: window.location.pathname })
    };
    sendEvent(body);
  }, [userUid, activeRoles, activeCompanyId, tags, sendEvent]);
};

export default useCancelProcessLog;
