

class Users {
    constructor() {
      // Map to store sessionID -> user information (e.g., username, queue status, game status)
      this.usersMap = new Map();
      this.socketMap = new Map();
  
      // Set to keep track of users in the queue
      this.queue = new Set();
  
      // Set to keep track of users currently in a game
      this.activeGames = new Set();
    }
  
    // Add a new user
    addUser(data) {
      const {username, sessionID} = data;
      if (!sessionID || !username) {
        throw new Error("SessionID and username are required to add a user.");
      } else if (!this.userExists(sessionID)) {
      this.usersMap.set(sessionID, { username, inQueue: false, inGame: false });
      } else {
        console.log(`${username} is already in Queue with sessionID ${sessionID}`);
      }
    }



    setUser(sessionID, username, inQueue, inGame) {
      this.usersMap.set(sessionID, {username, inQueue: inQueue, inGame: inGame});
      console.log(`Updated User: ${username} with ID ${sessionID} | inQueue: ${inQueue} , inGame: ${inGame}`);
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
  
    getUserFromName(username) {
      for (let [sessionID, user] of this.usersMap.entries()) {
        if (user.username === username) {
          return sessionID;
        }
      }
      return null; // Return null if no matching username is found
    }

    // Check if a user exists
    userExists(sessionID) {
      return this.usersMap.has(sessionID);
    }

    userInQueue(sessionID) {
      return this.queue.has(sessionID);
    }
  
    // Add user to queue
    addToQueue(data) {
      const { sessionID, username } = data;
      if (this.userExists(sessionID)) {
        if (!this.userInQueue(sessionID)) {
          this.queue.add(sessionID);
          this.usersMap.set(sessionID, { username, inQueue: true, inGame: false });
          console.log(`${username} added to Queue`);
        } else {
          console.log('User already in queue');
        }
      } else {
        console.error(`User with sessionID ${sessionID} does not exist`);
      }
      this.printStatus();
    }
  
    // Remove user from queue
    removeFromQueue(sessionID) {
      if (this.usersMap.has(sessionID) && this.queue.has(sessionID)) {
        this.queue.delete(sessionID);
        this.usersMap.get(sessionID).inQueue = false;
        console.log(`${sessionID} removed from Queue.`)
      }
    }
  
    // Get all users in the queue
    getQueue() {
      return [...this.queue].map(sessionID => this.usersMap.get(sessionID));
    }
  
    // Add user to an active game
    addToGame(username, team, sessionID) {
      if (this.usersMap.has(sessionID)) {
        this.setUser(username, sessionID, false, true);
        this.activeGames.add([sessionID, team]);
        this.usersMap.get(sessionID).inQueue = false; // Remove from queue if they join a game
        this.usersMap.get(sessionID).inGame = true;
        if (this.queue.has(sessionID)) {
          this.queue.delete(sessionID);
        };
      
        
      }
    }
  
    // Remove user from an active game
    removeFromGame(sessionID) {
      if (this.usersMap.has(sessionID) && this.activeGames.has(sessionID)) {
        this.activeGames.delete(sessionID);
        this.usersMap.get(sessionID).inGame = false;
      }
    }

    clearGameUsers() {
     this.activeGames.clear;
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
  