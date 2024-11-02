// server/sockets/queueSocket.js
import users from '../utils/users.js';  // Assuming users is a utility file you created for managing user data

// server/sockets/queueSocket.js
export default function queueSocketHandler(io) {
  const queueNamespace = io.of('/queue');

  queueNamespace.on('connection', (socket) => {
    console.log('A user connected to the queue namespace');

    const { sessionID } = socket.handshake.query;
    let username = null;

    if (sessionID) {
      // Assuming you have a userHashMap to track users
      if (!users.has(sessionID)) {
        users.set(sessionID, username);
        console.log(`New Session: ${sessionID}`);
      } else {
        username = users.get(sessionID);
        console.log(`Updated Session: ${sessionID}, Username: ${username}`);
      }
    }

    socket.on('joinQueue', (sessionID, username) => {
      console.log(`User ${username} with sessionID ${sessionID} joined the queue`);
      const data = {sessionID, username};
      users.addToQueue(data);

    });

    socket.on('message', (data) => {
      console.log(`Message from client: ${data}`);
      socket.emit('message', { message: 'Hello from the server!' });
    });

    socket.on('disconnect', () => {
      console.log('User disconnected from the queue namespace');
    });
  });
}
