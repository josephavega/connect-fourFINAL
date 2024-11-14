// server/sockets/gameSocket.js
import { io } from 'socket.io-client';
import users from '../utils/users.js'
import Manager from '../utils/game/Manager.js'
const game = Manager; // Create an instance of the GameLogic class


export default function gameSocketHandler(io) {
  
  const gameNamespace = io.of('/game');

  gameNamespace.on('connection', (socket) => {

    socket.on('message', (data) => {
      console.log(`Message from client: ${data}`);
      socket.emit('message', { message: 'Hello from the server!' });
      game.setPlayer(data.sessionID)
    });

    socket.on('/updateGameboard', data => {
      socket.emit('/updatedGameboard')
    })

    socket.on('/joinGame', data => {
      const {username, sessionID} = data;
      game.setPlayer(username);
      console.log(`${username} joined Game with ID: ${sessionID}`);
    })

    // Listen for a player move
    socket.on('playerMove', data => {
      const {rowIndex, colIndex, sessionID, powerupType} = data;
      const username = users.getUser(sessionID);
      console.log(`Player ${username} made a move in column: ${colIndex}`);
      
      try {
        const currentPlayer = game.getCurrentPlayer();
        var moves = null
        game.wipeMoves()
        switch(data.powerupType){
          case 'Brick':
          moves = game.useBrick(currentPlayer, data.colIndex)
          case 'Anvil':
          moves = game.useAnvil(currentPlayer, data.colIndex)
          case 'Lightning':
          moves = game.useLightning(currentPlayer, data.colIndex, data.rowIndex)
        default:
          moves = game.placeChip(currentPlayer,colIndex); // Place the piece in the game logic
        }
        gameNamespace.emit('sendInstructions', moves)
        gameNamespace.emit('gameBoardUpdated', game.board); // Emit updated board to all connected clients
        currentPlayer = game.getCurrentPlayer();
        gameNamespace.emit('playerTurn', currentPlayer); // Notify whose turn it is
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
    socket.on('disconnect', () => {      console.log(`${socket.id} disconnected`);
  
      // const username = users.get(sessionID);
      
      // if (username) {
      //   // If the player was in the game, remove them from the queue and handle game state
      //   if (Queue.containsPlayer(username)) {
      //     users.removeFromGame(sessionID);
      //     users.delete(sessionID);
      //     gameNamespace.emit('queueUpdated', Queue.queue);
      //     console.log(`Removed ${username} from the queue due to disconnection.`);
      //   }
      // }
    });
  
    // Handle restart or reset game request
    socket.on('resetGame', () => {
      console.log(`Game reset requested by ${username}`);
      game = new Manager(this)
      gameNamespace.emit('gameReset', { message: 'The game has been reset.' });
    });
  
    // Handle players joining or leaving a game session
    socket.on('joinGame', () => {
      console.log(`${username} joined the game.`);
      gameNamespace.emit('playerJoined', { player: username });
    });
  
    socket.on('leaveGame', () => {
      console.log(`${username} left the game.`);
      gameNamespace.emit('playerLeft', { player: username });
      if (Queue.containsPlayer(username)) {
        Queue.removePlayer(username);
        users.delete(sessionID);
        gameNamespace.emit('queueUpdated', Queue.queue);
        console.log(`Removed ${username} from the queue due to leaving.`);
      }
    });
  
    // Handle heartbeat from players to ensure they are connected during a game
    socket.on('heartbeat', () => {
      console.log(`Heartbeat received from ${username}`);
    });
  
  

  })

  
  
}


  
  // // Handle game start for a new player or AI vs AI mode
  // if (Queue.queue.length === 1) {
  //   console.log(`Starting Player vs AI game for ${username}`);
  //   // You can add logic to start a Player vs AI game here
  //   io.emit('gameStarted', { gameType: 'Player vs AI', player: username });
  // } else if (Queue.queue.length >= 2) {
  //   console.log(`Starting Player vs Player game for ${Queue.queue[0]} and ${Queue.queue[1]}`);
  //   // You can add logic to start a Player vs Player game here
  //   io.emit('gameStarted', { gameType: 'Player vs Player', players: [Queue.queue[0], Queue.queue[1]] });
  // }


