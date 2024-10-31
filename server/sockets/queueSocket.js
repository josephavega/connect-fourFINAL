// server/sockets/queueSocket.js
const Queue = require('../utils/queue/Queue');

let userHashMap = new Map();

module.exports = (socket, io) => {
  const { sessionID } = socket.handshake.query;
  let username = null;

  if (sessionID) {
    if (!userHashMap.has(sessionID)) {
      userHashMap.set(sessionID, username);
      console.log(`New Session: ${sessionID}`);
    } else {
      username = userHashMap.get(sessionID);
      console.log(`Updated Session: ${sessionID}, Username: ${username}`);
    }
  }

  socket.on('heartbeat', (sessionID) => {
    console.log(`Heartbeat from ${sessionID}`);
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${sessionID}`);
  });
};
