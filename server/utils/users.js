class Users {
    constructor() {
      // Map to store sessionID -> user information (e.g., username, queue status, game status)
      this.usersMap = new Map();
  
      // Set to keep track of users in the queue
      this.queue = new Set();
  
      // Set to keep track of users currently in a game
      this.activeGames = new Set();
    }
  
    // Add a new user
    addUser(sessionID, username) {
      if (!sessionID || !username) {
        throw new Error("SessionID and username are required to add a user.");
      }
      this.usersMap.set(sessionID, { username, inQueue: false, inGame: false });
    }
  
    // Remove a user
    removeUser(sessionID) {
      if (this.usersMap.has(sessionID)) {
        this.queue.delete(sessionID);
        this.activeGames.delete(sessionID);
        this.usersMap.delete(sessionID);
      }
    }
  
    // Get user by sessionID
    getUser(sessionID) {
      return this.usersMap.get(sessionID);
    }
  
    // Check if a user exists
    userExists(sessionID) {
      return this.usersMap.has(sessionID);
    }
  
    // Add user to queue
    addToQueue(sessionID) {
      if (this.usersMap.has(sessionID)) {
        this.queue.add(sessionID);
        this.usersMap.get(sessionID).inQueue = true;
      }
    }
  
    // Remove user from queue
    removeFromQueue(sessionID) {
      if (this.usersMap.has(sessionID) && this.queue.has(sessionID)) {
        this.queue.delete(sessionID);
        this.usersMap.get(sessionID).inQueue = false;
      }
    }
  
    // Get all users in the queue
    getQueue() {
      return [...this.queue].map(sessionID => this.usersMap.get(sessionID));
    }
  
    // Add user to an active game
    addToGame(sessionID) {
      if (this.usersMap.has(sessionID)) {
        this.activeGames.add(sessionID);
        this.usersMap.get(sessionID).inQueue = false; // Remove from queue if they join a game
        this.usersMap.get(sessionID).inGame = true;
        this.queue.delete(sessionID);
      }
    }
  
    // Remove user from an active game
    removeFromGame(sessionID) {
      if (this.usersMap.has(sessionID) && this.activeGames.has(sessionID)) {
        this.activeGames.delete(sessionID);
        this.usersMap.get(sessionID).inGame = false;
      }
    }
  
    // Get all users in active games
    getActiveGames() {
      return [...this.activeGames].map(sessionID => this.usersMap.get(sessionID));
    }
  
    // Utility to print current state (for debugging)
    printStatus() {
      console.log("=== Users ===");
      for (let [sessionID, userData] of this.usersMap) {
        console.log(`SessionID: ${sessionID}, Username: ${userData.username}, InQueue: ${userData.inQueue}, InGame: ${userData.inGame}`);
      }
      console.log("=== Queue ===", [...this.queue]);
      console.log("=== Active Games ===", [...this.activeGames]);
    }
  }
  
 export default new Users(); // Export a single instance of the Users class
  