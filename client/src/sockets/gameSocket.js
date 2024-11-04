// client/src/sockets/queueSocket.js
import { io } from "socket.io-client";

const gameSocket = io('http://localhost:3000/game', {
  autoConnect: true,
});

export default gameSocket;
