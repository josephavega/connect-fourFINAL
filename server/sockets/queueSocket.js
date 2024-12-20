// server/sockets/queueSocket.js
import users from "../utils/users.js"; // Assuming users is a utility file you created for managing user data

// server/sockets/queueSocket.js
export default function queueSocketHandler(io) {
  const queueNamespace = io.of("/queue");
  const HEARTBEAT_TIMEOUT = 10000; // 15 seconds timeout
  const heartbeatTrackers = new Map(); // Track heartbeat timeouts for each session

  queueNamespace.on("connection", (socket) => {
    const { sessionID } = socket.id;
    console.log(`A user connected to the queue: ${sessionID}`);

    // Function to handle heartbeat timeout
    // const handleTimeout = () => {
    //   console.log(`${sessionID} did not respond. Removing from queue.`);
    //   // Remove user from queue
    //   users.removeFromQueue(sessionID);

    //   // Emit updated queue information
    //   queueNamespace.emit("queueUpdated", users.getQueue());

    //   // Disconnect the socket as it has timed out
    //   socket.disconnect(true);
    // };

    // // Start a heartbeat tracker for this user
    // const startHeartbeatTracker = () => {
    //   if (heartbeatTrackers.has(sessionID)) {
    //     clearTimeout(heartbeatTrackers.get(sessionID));
    //   }
    //   const timeout = setTimeout(() => handleTimeout(), HEARTBEAT_TIMEOUT);
    //   heartbeatTrackers.set(sessionID, timeout);
    // };

    // startHeartbeatTracker();

    // socket.on("heartbeat", () => {
    //   startHeartbeatTracker();
    // });

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

    socket.on("leaveQueue", (data) => {
      const { sessionID } = data;

      console.log(`Removing ${sessionID} from Queue`);
      users.removeFromQueue(sessionID);
    });

    socket.on("joinQueue", (data) => {
      const { username, sessionID } = data;
      console.log(
        `User ${username} with sessionID ${sessionID} attempting to join queue`
      );
      if (users.userInQueue(sessionID)) {
        console.log("User already in Queue.");
        socket.emit("joinQueueResponse", {
          success: false,
          message: "User already in the queue. Redirecting to lobby",
          redirectToLobby: true,
        });
      } else {
        users.addUser(data);
        users.addToQueue(username);
        console.log(users.getQueue());
        const updatedQueue = users.getQueue();
        queueNamespace.emit("queueUpdated", updatedQueue);
        socket.emit("joinQueueResponse", {
          success: true,
          message: `Successfully joined the queue.`,
          redirectToLobby: true,
        });
      }
    });

    socket.on("message", (data) => {
      console.log(`Message from client: ${data}`);
      socket.emit("message", { message: "Hello from the server!" });
    });

    socket.on("getQueue", () => {
      console.log("Initial Queue requested");
      const currentQueue = users.getQueue();
      socket.emit("queueUpdated", currentQueue);
    });

    socket.on("inQueue", (sessionID) => {
      const inQueue = users.userInQueue(sessionID);
      socket.emit("inQueueResponse", inQueue);
    });

    // Handle client disconnection
    socket.on("disconnect", () => {
      // console.log(`${socket.id} disconnected from the queue namespace`);
      // if (heartbeatTrackers.has(sessionID)) {
      //   clearTimeout(heartbeatTrackers.get(sessionID)); // Clear timeout
      //   heartbeatTrackers.delete(sessionID); // Remove tracker
      // }
      // if (!sessionID) {
      //   console.error("No sessionID found for disconnected socket");
      //   return;
      // }
      // // Ensure user is removed from queue
      // users.removeFromQueue(sessionID);
      // // Emit updated queue information
      // queueNamespace.emit("queueUpdated", users.getQueue());
    });
  });

  // Game Loop Implementation
}
