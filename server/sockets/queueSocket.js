// server/sockets/queueSocket.js
import users from '../utils/users.js';  // Assuming users is a utility file you created for managing user data

// server/sockets/queueSocket.js
export default function queueSocketHandler(io) {
  const queueNamespace = io.of('/queue');
  const HEARTBEAT_TIMEOUT = 10000; // 15 seconds timeout

  queueNamespace.on('connection', (socket) => {
    console.log('A user connected to the queue namespace');

    const { sessionID } = socket.handshake.query;

    socket.sessionID = sessionID;

    let username = null;

    if (sessionID) {
      // Assuming you have a userHashMap to track users
      if (!users.userExists(sessionID)) {
        users.addToQueue(sessionID, username);
        console.log(`New Session: ${sessionID}`);
      } else {
        username = users.getUser(sessionID);
        console.log(`Updated Session: ${sessionID}, Username: ${username}`);
      }
    }

    socket.on('joinQueue', data => {
      const {username, sessionID} = data;
      console.log(`User ${username} with sessionID ${sessionID} attempting to join queue`);
      if (users.InQueue(sessionID)) {
        console.log("User already in QUeue.");
        socket.emit('joinQueueResponse', {
          success: false,
          message: 'User already in the queue. Redirecting to lobby',
          redirectToLobby: true
        })
      } else {
        users.addUser(data);
        users.addToQueue(data);
        console.log(users.getQueue());
        const updatedQueue = users.getQueue();
        queueNamespace.emit('queueUpdated', updatedQueue);
        socket.emit('joinQueueResponse', {
          success: true,
          message: `Successfully joined the queue.`,
          redirectToLobby: true
        });
      }
  
    });


    socket.on('message', (data) => {
      console.log(`Message from client: ${data}`);
      socket.emit('message', { message: 'Hello from the server!' });
    });

    socket.on('getQueue', () => {
      console.log('Initial Queue requested');
      const currentQueue = users.getQueue();
      socket.emit('queueUpdated', currentQueue);
    })

    socket.on('inQueue', sessionID => {
      const inQueue = users.InQueue(sessionID);
      socket.emit('inQueueResponse', inQueue);
    })

    let heartbeatTimeout;
    socket.sessionID = sessionID;

  function resetHeartbeatTimeout() {
    clearTimeout(heartbeatTimeout);
    heartbeatTimeout = setTimeout(() => {
      console.log(`${socket.sessionID} did not respond. Removing from queue.`);
      
      // Remove user from queue
      users.removeFromQueue(socket.sessionID);

      // Emit updated queue information
      queueNamespace.emit('queueUpdated', users.getQueue());

      // Disconnect the socket as it has timed out
      socket.disconnect(true);
    }, HEARTBEAT_TIMEOUT);
  }

    socket.on('heartbeat', (data) => {
      const {sessionID, username} = data;
      console.log(`Received heartbeat from ${sessionID}`);
      users.setUser(sessionID, username, true, false);
        // Update user state as active
      resetHeartbeatTimeout();  // Reset timeout when heartbeat is received
    });

    socket.on('disconnect', () => {
      console.log(`${socket.id} disconnected from the queue namespace`);

      // Retrieve the sessionID from the socket object
      const sessionID = socket.sessionID;
  
      // Remove from the queue if necessary
      if (sessionID) {
        users.removeFromQueue(sessionID);
        queueNamespace.emit('queueUpdated', users.getQueue());
      } else {
        console.error('No sessionID found for disconnected socket');
      }
      
    });
  });
}
