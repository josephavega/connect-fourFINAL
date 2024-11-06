// client/src/sockets/queueSocket.js
import { io } from "socket.io-client";
import { v4 as uuidv4 } from 'uuid'; 

let sessionID = localStorage.getItem('sessionID');

if (!sessionID) { 
  sessionID = uuidv4;
  localStorage.setItem('sessionID', sessionID);
}

const queueSocket = io('http://localhost:3000/queue', {
  autoConnect: true,
  query: {
    sessionID: sessionID,
  },
  withCredentials: true,
});

export default queueSocket;
