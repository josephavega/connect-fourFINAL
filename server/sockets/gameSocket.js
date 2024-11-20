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
    });


    socket.on('getBoard', () => {
      try {
        console.log('Received getBoard request');
        const board = game.getBoard();
        game.printBoard();
        socket.emit('sentBoard', board);
      } catch (error) {
        console.error('Error sending board:', error);
        socket.emit('sentBoard', { error: 'Failed to retrieve board' });
      }
    });


    socket.on('getGameStatus', () => {
      try {
          const redPlayer = game.GameLogic.player[0];
          const yellowPlayer = game.GameLogic.player[1];
          const currentPlayer = game.GameLogic.getCurrentPlayer();
          
          // Prepare a simplified version to avoid circular references
          const data = {
              red_player: redPlayer ? {
                  username: redPlayer.username,
                  sessionID: redPlayer.sessionID,
                  color: redPlayer.color,
              } : null,
              yellow_player: yellowPlayer ? {
                  username: yellowPlayer.username,
                  sessionID: yellowPlayer.sessionID,
                  color: yellowPlayer.color,
              } : null,
              gamemode: game.gameType || null,
              currentPlayer: currentPlayer ? {
                  username: currentPlayer.username,
                  color: currentPlayer.color,
                  sessionID: currentPlayer.sessionID,
              } : null,
          };
  
          socket.emit('sentGameStatus', data);
          console.log(data);
      } catch (error) {
          console.error('Error getting game status:', error);
          socket.emit('sentGameStatus', { error: 'Failed to retrieve game status' });
      }
  });
  


    socket.on('createGame', (data) => {
      //const {gameType} = data;
      game.createBoard();
      //game.setGameType(gameType);
      //const status = game.getStatus();
      //socket.emit('getGameStatus', status);
    })
    

    socket.on('joinGame', data => {
      const {sessionID, username} = data;
      game.setPlayer(sessionID, username);
      console.log(`${username} joined as ${game.getCurrentPlayer.color}`);
    })

    // Listen for a player move
    // socket.on('playerMove', data => {
    //   const {rowIndex, colIndex, sessionID, powerupType} = data;
    //   const username = users.getUser(sessionID);
    //   console.log(`Player ${username} made a move in column: ${colIndex}`);
      
    //   try {
    //     let currentPlayer = game.getCurrentPlayer();
    //     var moves = [];
    //     switch(data.powerupType){
    //       case 'Brick':
    //       moves = game.useBrick(currentPlayer, data.colIndex)
    //       break;
    //       case 'Anvil':
    //       moves = game.useAnvil(currentPlayer, data.colIndex)
    //       break;
    //       case 'Lightning':
    //       moves = game.useLightning(currentPlayer, data.colIndex, data.rowIndex)
    //       break;
    //     default:
    //       moves = game.placeChip(currentPlayer,colIndex); // Place the piece in the game logic
    //     }
    //     gameNamespace.emit('sendInstructions', moves)
    //     gameNamespace.emit('gameBoardUpdated', game.board); // Emit updated board to all connected clients
    //     currentPlayer = game.getCurrentPlayer();
    //     gameNamespace.emit('playerTurn', currentPlayer); // Notify whose turn it is
    //     console.log('Gameboard Updated:', game.board);
  
    //     // // Check if the game is over
    //     // if (game.GameLogic.checkWin()) {
    //     //   io.emit('gameOver', { winner: currentPlayer });
    //     //   console.log(`Player ${currentPlayer} wins!`);
    //     // }
    //   } catch (error) {
    //     socket.emit('moveError', { error: error.message });
    //     console.error('Error during move:', error.message);
    //   }
    // });



  
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
      console.log('Game reset requested');
      this.GameLogic.board = createBoard();  // Resetting the board without instantiating a new Manager
      gameNamespace.emit('gameReset', { message: 'The game has been reset.' });
  });

//   socket.on('getBoard', () => {
//     try {
//         console.log('Received getBoard request');
//         const board = game.getBoard();
//         //game.printBoard();

//         // Ensure the board is a plain structure without references
//         socket.emit('sentBoard', JSON.parse(JSON.stringify(board)));
//     } catch (error) {
//         console.error('Error sending board:', error);
//         socket.emit('sentBoard', { error: 'Failed to retrieve board' });
//     }
// });

socket.on('playerMove', (data) => {

    const  {colIndex, sessionID, username} = data;
    const user = users.getUser(sessionID);
  

    if (!username) {
      console.error("Username not found for sessionID:", sessionID);
      return;
    }

    console.log(`Player ${username} made a move in column: ${colIndex}`);
    
    try {
      // Process the move in the game logic
      const currentPlayer = game.getCurrentPlayer();
      const moves = game.placeChip(currentPlayer, colIndex); 
      
      gameNamespace.emit('sendInstructions', moves);
      console.log('Gameboard Updated:', game.board);

      // Check if the game is over
      if (game.checkWin()) {
        socket.emit('gameOver', currentPlayer );
        console.log(`Player ${currentPlayer} wins!`);
      }
    } catch (error) {
      console.error('Error during move:', error);
      socket.emit('moveError', { error: error.message });
    }
  });
  
    // Handle players joining or leaving a game session
    socket.on('joinGame', data => {
      const { sessionID, username } = data;
      
      if (!sessionID || !username) {
        console.error('Missing sessionID or username in joinGame event');
        return;
      }
    
      game.setPlayer(sessionID, username);
      users.addToGame(username, sessionID);
      console.log(`${username} joined as ${game.getCurrentPlayer().color}`);
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


