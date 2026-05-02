import { io } from 'socket.io-client';

const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL || 'https://qbl-server-site.onrender.com';

let socket = null;

export const getSocket = () => {
  if (!socket) {
    if (typeof window !== 'undefined') {
      console.log(`[socket] connecting to ${SOCKET_URL}`);
    }
    socket = io(SOCKET_URL, {
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
