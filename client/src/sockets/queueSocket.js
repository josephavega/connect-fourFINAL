import { io } from "socket.io-client";
import { v4 as uuidv4 } from 'uuid'; 

let sessionID = localStorage.getItem('sessionID');

if (!sessionID) { 
  sessionID = uuidv4();
  localStorage.setItem('sessionID', sessionID);
}

const queueSocket = io('http://localhost:3000/queue', {
  autoConnect: false,
  query: {
    sessionID: sessionID,
  },
  withCredentials: true,
});

// Connect to the server
queueSocket.connect();

// Join the queue when the client is ready
queueSocket.emit('joinQueue', {
  sessionID: sessionID,
  username: 'Player1', // Can be dynamic based on user input
});

// Listen for the 'startGame' event when the server signals to start Player vs AI
queueSocket.on('startGame', (gameInfo) => {
  console.log('Game started:', gameInfo);
  // Trigger game start here, pass game mode and difficulty to start the game
  startGame(gameInfo);
});

function startGame(gameInfo) {
  // Here you can handle the UI to display the game mode, difficulty, etc.
  console.log(`Starting ${gameInfo.mode} with difficulty ${gameInfo.difficulty}`);
  // Add any further game start logic here (e.g., show the game board, etc.)
}

export default queueSocket;
