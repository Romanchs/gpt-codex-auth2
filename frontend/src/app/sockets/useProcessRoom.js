import { useEffect, useRef } from 'react';
import { sockets } from './index';

const useProcessRoom = (uid, refetch) => {
  const timeout = useRef(null);
  useEffect(() => {
    if (uid && sockets.connection.auth) {
      sockets.joinProcess(uid);
      sockets.connection.on('message', ({ type, payload }) => {
        clearTimeout(timeout.current);
        if (type === 'PROCESS_UPDATED' && payload?.process_uid === uid) {
          timeout.current = setTimeout(() => {
            refetch(type, payload);
            clearTimeout(timeout.current);
          }, 1500);
        }
      });
    }
  }, [uid, sockets.connection.auth]);

  useEffect(
    () => () => {
      if (uid) sockets.leaveProcess(uid);
    },
    [uid]
  );

  return null;
};

export default useProcessRoom;
