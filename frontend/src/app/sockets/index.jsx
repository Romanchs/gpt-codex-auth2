import { io } from 'socket.io-client';
import { getEnv } from '../../util/getEnv';
import { store } from '../../store/store';
import { mainApi } from '../mainApi';

class SocketService {
  constructor() {
    this.connection = undefined;
  }

  init() {
    if (!this.connection) {
      this.#connect();
      this.#subscribe();
    }
  }

  #connect() {
    console.info('socket: connect');
    this.connection = io.connect(getEnv().baseUrl, {
      path: '/ms-socket/socket.io',
      transports: ['websocket'],
      reconnection: false
    });
  }

  #subscribe() {
    console.info('socket: subscribe');
    this.connection.on('message', ({ type, payload }) => {
      console.info('socket:', { type, payload });
      switch (type) {
        case 'maintenance_started':
        case 'maintenance_completed':
          store.dispatch(mainApi.util.invalidateTags(['IS_ACTIVE_MAINTENANCE']));
          store.dispatch(mainApi.util.invalidateTags(['MAINTENANCE_LIST']));
          store.dispatch(mainApi.util.invalidateTags(['MAINTENANCE_INFO']));
          break;
        case 'maintenance_planned':
        case 'maintenance_pending':
        case 'maintenance_canceled':
          store.dispatch(mainApi.util.invalidateTags(['MAINTENANCE_INFO']));
          break;
        case 'REFRESH_PROCESS':
          if (window.location?.pathname.includes(payload?.process_uid)) {
            window.location.reload();
          }
          break;
      }
    });
  }

  authorize(user_id) {
    console.info('socket: authorize');
    this.connection.auth = { user_id };
    this.connection.disconnect().connect();
  }

  joinProcess(uid) {
    console.info('socket: JOIN uid: ' + uid);
    this.connection.emit('join_process', { uid });
  }

  leaveProcess(uid) {
    console.info('socket: LEAVE uid: ' + uid);
    this.connection.emit('leave_process', { uid });
  }

  logOut() {
    console.info('socket: logOut');
    if (this.connection.auth?.user_id) {
      this.connection.auth = { user_id: null };
      this.connection.disconnect().connect();
    }
  }
}

export const sockets = new SocketService();
