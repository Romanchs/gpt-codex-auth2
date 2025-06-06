import { useSelector } from 'react-redux';
import { useSendEventMutation } from '../../features/actionsLog/api';
import { useCallback } from 'react';

const useAuthLog = () => {
  const userUid = useSelector((s) => s.user.userUid);
  const [sendEvent, { isUninitialized }] = useSendEventMutation();

  return useCallback(() => {
    if (userUid && isUninitialized) {
      sendEvent({
        user: userUid,
        action: 'Авторизація',
        source: 'tko-frontend',
        tags: []
      });
    }
  }, [userUid, isUninitialized, sendEvent]);
};

export default useAuthLog;
