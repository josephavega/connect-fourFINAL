// server/sockets/queueSocket.js
import users from '../utils/users.js';  // Assuming users is a utility file you created for managing user data
import Manager from '../utils/game/Manager.js';

// server/sockets/queueSocket.js
export default function queueSocketHandler(io) {
  const queueNamespace = io.of('/queue');
  const HEARTBEAT_TIMEOUT = 10000; // 15 seconds timeout
  const heartbeatTrackers = new Map(); // Track heartbeat timeouts for each session


  queueNamespace.on('connection', (socket) => {
  
    const { sessionID } = socket.handshake.query;
    console.log(`A user connected to the queue: ${sessionID}`);



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

    socket.on('joinQueue', (data) => {
      const {username, sessionID} = data;
      console.log(`User ${username} with sessionID ${sessionID} attempting to join queue`);
      if (users.userInQueue(sessionID)) {
        console.log("User already in QUeue.");
        socket.emit('joinQueueResponse', {
          success: false,
          message: 'User already in the queue. Redirecting to lobby',
          redirectToLobby: true
        })
      } else {
        users.addUser(data);
        users.addToQueue(username);
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
      const inQueue = users.userInQueue(sessionID);
      socket.emit('inQueueResponse', inQueue);
    })

    socket.on('StartClassicPlayerVSAi', data => {
      const sessionID = data.sessionID;
      const username = data.username; 

      Manager.setPlayer(sessionID, username);
      Manager.startPlayerVsAI();

    })

    socket.on('StartArcadePlayerVsAI', data => {
    })

    // Function to handle heartbeat timeout
    const handleTimeout = () => {
      console.log(`${sessionID} did not respond. Removing from queue.`);
      // Remove user from queue
      users.removeFromQueue(sessionID);

      // Emit updated queue information
      queueNamespace.emit('queueUpdated', users.getQueue());

      // Disconnect the socket as it has timed out
      socket.disconnect(true);
    };

    // Start a heartbeat tracker for this user
    const startHeartbeatTracker = () => {
      if (heartbeatTrackers.has(sessionID)) {
        clearTimeout(heartbeatTrackers.get(sessionID));
      }
      const timeout = setTimeout(() => handleTimeout(), HEARTBEAT_TIMEOUT);
      heartbeatTrackers.set(sessionID, timeout);
    };

    // Start the initial heartbeat timeout
    startHeartbeatTracker();

    // Handle heartbeats from the client
      socket.on('heartbeat', () => {
        //console.log(`Received heartbeat from sessionID: ${sessionID}`);
        // Reset the heartbeat timeout whenever a heartbeat is received
        startHeartbeatTracker();
      });


    socket.on('disconnect', () => {
      console.log(`${socket.id} disconnected from the queue namespace`);
      const sessionID = socket.sessionID;
      if (heartbeatTrackers.has(sessionID)) {
        clearTimeout(heartbeatTrackers.get(sessionID));
        heartbeatTrackers.delete(sessionID);
      }
      
      if (!sessionID) {
        console.error('No sessionID found for disconnected socket');
        return;
        }

    });
  });


  // Game Loop Implementation

  // mode: 0 === player vs. ai
  // mode: 1 === player vs. player
  setInterval(() => {
    console.log("[DEBUG] Game Loop running on Queue namespace...");

    const queue = users.getQueue(); // Assuming this gets the current queue as an array
    
    if (Manager.getGameOver) {
    if (queue.length === 1) {
      console.log("1 Player in Queue detected");
      // Single player in queue: Start Player vs AI
      const player = queue[0].username;
      console.log(player);
      //const playerSessionID = users.getUserFromName(player);
      const playerSessionID = users.getUserFromName(player)
      //console.log(playerSessionID);
      //console.log(`Connected to Player 1 (${player.username}) sessionID: ${playerSessionID ? "found" : "not found"}`);
      if (playerSessionID) {
        // Notify the player to join the game
        const data = playerSessionID;
        console.log(data);
        queueNamespace.emit('promptStartGame', data);
        // Manager.startPlayerVsAI(); // Start Player vs AI in the manager
        // users.removeFromQueue(player.sessionID); // Remove from queue
      }
    } else if (queue.length >= 2) {
      // Multiple players in the queue: Start Player vs Player
      const player1 = queue[0];
      const player2 = queue[1];

      const player1SessionID = player1.sessionID;
      const player2SessionID = player2.sessionID;

      if (player1Socket && player2Socket) {
        // Notify both players to join the game
        const data = { mode: 1, sessionID: player1SessionID}
        queueNamespace.emit('promptStartGame', data);
        queueNamespace.emit('promptJoiningGame', player2SessionID )

        // Set up the game in Manager
        Manager.setPlayer(player1.sessionID, player1.username);
        Manager.setPlayer(player2.sessionID, player2.username);

        // Remove both players from the queue
        users.removeFromQueue(player1.sessionID);
        users.removeFromQueue(player2.sessionID);
      }
    }
  }
    // Optionally, clean up finished games or stale players
    // Check Manager or Users for ongoing games that need cleanup
  }, 5000); // Run every 5 seconds
  

}
