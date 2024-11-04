// client/src/sockets/queueSocket.js
import { io } from "socket.io-client";

const queueSocket = io('http://localhost:3000/queue', {
  autoConnect: true,
});

export default queueSocket;
