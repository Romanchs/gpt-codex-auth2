import { useSelector } from 'react-redux';
import { useSendEventMutation } from '../../features/actionsLog/api';
import { useCallback } from 'react';

const useRefreshDataLog = (tags = []) => {
  const userUid = useSelector((s) => s.user.userUid);
  const activeRoles = useSelector((s) => s.user.activeOrganization?.roles.filter((role) => role.active));
  const activeCompanyId = useSelector((s) => s.user.activeOrganization?.uid);
  const [sendEvent] = useSendEventMutation();

  return useCallback(() => {
    sendEvent({
      user: userUid,
      action: 'Оновлення даних',
      source: 'tko-frontend',
      company: activeCompanyId,
      role: activeRoles[0].role,
      tags: tags,
      referer: window.location.pathname
    });
  }, [userUid, activeRoles, activeCompanyId, tags, sendEvent]);
};

export default useRefreshDataLog;
