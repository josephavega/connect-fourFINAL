// server/sockets/gameSocket.js
const Manager = require('../utils/game/Manager');
const Queue = require('../utils/queue/Queue');
//const userHashMap = require('../utils/userHashMap');

let userHashMap = new Map();
const game = new Manager(); // Create an instance of the GameLogic class

module.exports = (socket, io) => {
  const { sessionID } = socket.handshake.query;
  let username = userHashMap.get(sessionID);
  
  // Handle game start for a new player or AI vs AI mode
  if (Queue.queue.length === 1) {
    console.log(`Starting Player vs AI game for ${username}`);
    // You can add logic to start a Player vs AI game here
    io.emit('gameStarted', { gameType: 'Player vs AI', player: username });
  } else if (Queue.queue.length >= 2) {
    console.log(`Starting Player vs Player game for ${Queue.queue[0]} and ${Queue.queue[1]}`);
    // You can add logic to start a Player vs Player game here
    io.emit('gameStarted', { gameType: 'Player vs Player', players: [Queue.queue[0], Queue.queue[1]] });
  }

  // Listen for a player move
  socket.on('playerMove', ({ column }) => {
    console.log(`Player ${username} made a move in column: ${column}`);

    try {
      game.placePiece(column); // Place the piece in the game logic
      io.emit('gameBoardUpdated', game.board); // Emit updated board to all connected clients
      const currentPlayer = game.getCurrentPlayer();
      io.emit('playerTurn', currentPlayer); // Notify whose turn it is
      console.log('Gameboard Updated:', game.board);

      // Check if the game is over
      if (game.checkWin()) {
        io.emit('gameOver', { winner: currentPlayer });
        console.log(`Player ${currentPlayer} wins!`);
      }
    } catch (error) {
      socket.emit('moveError', { error: error.message });
      console.error('Error during move:', error.message);
    }
  });

  // Handle disconnect event for players in the middle of a game
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${sessionID}`);
    const username = userHashMap.get(sessionID);
    
    if (username) {
      // If the player was in the game, remove them from the queue and handle game state
      if (Queue.containsPlayer(username)) {
        Queue.removePlayer(username);
        userHashMap.delete(sessionID);
        io.emit('queueUpdated', Queue.queue);
        console.log(`Removed ${username} from the queue due to disconnection.`);
      }
    }
  });

  // Handle restart or reset game request
  socket.on('resetGame', () => {
    console.log(`Game reset requested by ${username}`);
    game.reset(); // Assuming a reset method exists in the game logic
    io.emit('gameReset', { message: 'The game has been reset.' });
  });

  // Handle players joining or leaving a game session
  socket.on('joinGame', () => {
    console.log(`${username} joined the game.`);
    io.emit('playerJoined', { player: username });
  });

  socket.on('leaveGame', () => {
    console.log(`${username} left the game.`);
    io.emit('playerLeft', { player: username });
    if (Queue.containsPlayer(username)) {
      Queue.removePlayer(username);
      userHashMap.delete(sessionID);
      io.emit('queueUpdated', Queue.queue);
      console.log(`Removed ${username} from the queue due to leaving.`);
    }
  });

  // Handle heartbeat from players to ensure they are connected during a game
  socket.on('heartbeat', () => {
    console.log(`Heartbeat received from ${username}`);
  });
};
