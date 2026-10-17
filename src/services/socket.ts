import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export function getSocket(userId?: string): Socket {
  if (!socket) {
    socket = io({
      auth: {
        userId
      },
      transports: ['websocket', 'polling'],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000
    });
  } else if (userId && socket.auth && (socket.auth as any).userId !== userId) {
    socket.auth = { userId };
    socket.disconnect().connect();
  }

  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
