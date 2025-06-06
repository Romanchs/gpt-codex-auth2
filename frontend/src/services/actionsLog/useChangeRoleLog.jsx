import { useSelector } from 'react-redux';
import { useSendEventMutation } from '../../features/actionsLog/api';
import { useCallback } from 'react';

const useChangeRoleLog = () => {
  const userUid = useSelector((s) => s.user.userUid);
  const [sendEvent, { isUninitialized }] = useSendEventMutation();
  const activeRoles = useSelector((s) => s.user.activeOrganization?.roles.filter((role) => role.active));
  const activeCompanyId = useSelector((s) => s.user.activeOrganization?.uid);

  return useCallback(() => {
    if (userUid && isUninitialized) {
      sendEvent({
        user: userUid,
        action: 'Зміна ролі',
        source: 'tko-frontend',
        company: activeCompanyId,
        role: activeRoles[0].role,
        tags: []
      });
    }
  }, [userUid, isUninitialized, activeCompanyId, activeRoles, sendEvent]);
};

export default useChangeRoleLog;
