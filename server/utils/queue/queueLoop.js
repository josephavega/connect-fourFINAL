export default function GameLoop() {
  // mode: 0 === player vs. ai
  // mode: 1 === player vs. player
  setInterval(() => {
    const queue = users.getQueue(); // Assuming this gets the current queue as an array

    if (queue.length === 1) {
      // Single player in queue: Start Player vs AI
      const player = queue[0].username;
      const playerSessionID = users.getUserFromName(player);

      if (playerSessionID) {
        // Notify the player to join the game
        const data = playerSessionID;
        queueNamespace.emit("promptStartGame", data);
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
        const data = { mode: 1, sessionID: player1SessionID };
        queueNamespace.emit("promptStartGame", data);
        queueNamespace.emit("promptJoiningGame", player2SessionID);

        // Remove both players from the queue
        users.removeFromQueue(player1.sessionID);
        users.removeFromQueue(player2.sessionID);
      }
    }

    // Optionally, clean up finished games or stale players
    // Check Manager or Users for ongoing games that need cleanup
  }, 5000); // Run every 5 seconds
}
