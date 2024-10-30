import { io } from 'socket.io-client';

let sessionID = localStorage.getItem('sessionID');
if (!sessionID) {
  sessionID = uuidv4();
  localStorage.setItem('sessionID', sessionID);
}

const socket = io('http://localhost:3000', {
  query: {
    sessionID,
  },
});

export default socket;