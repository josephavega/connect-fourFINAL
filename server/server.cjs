const express = require('express');
const http = require('http');
const session = require('express-session');
const cors = require('cors');
const { Server } = require('socket.io');
const req = require('express/lib/request');
const { start } = require('repl');
const config = require('../server/config/config.json');


const GameLogic = require('../hooks/gameLogic.js');
//const AI = require('./AI.js');
const Queue = require('../hooks/queue.js');

  let userHashMap = new Map();

const app = express();
const server = http.createServer(app);
const io = new Server(server, { 
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

app.use(cors());
app.use(express.json());


// Set up session middleware
const sessionMiddleware = session({
    secret: 'your-secret-key', 
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },

  });

app.use(sessionMiddleware);

let activeUsers = new Map();

// Handle Connections and Disconnects
io.on('connection', (socket) => {
    const { sessionID } = socket.handshake.query; // Extract sessionID from the query parameters

    let username = null;

    if (sessionID) {

        socket.sessionID = sessionID;

        if (!userHashMap.has(sessionID)) {

            userHashMap.get(sessionID);
            console.log(`Updated Session: ${sessionID} Username: ${username} id ${socket.id}`);
        } else {
            socket.id = userHashMap.get(socket.id);
            console.log(`New Session: ${sessionID}`);
        }

        activeUsers.set(sessionID, true);
    }

    socket.on('heartbeat', (sessionID) => {
        // Update the user's active status
        activeUsers.set(sessionID, true);
    });



    // Handle disconnect event
    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`); // Log when a user disconnects

        activeUsers.set(socket.sessionID, false);
        
        let username = userHashMap.get(socket.sessionID);
        setTimeout(() => {
            if (!activeUsers.get(sessionID)) {
                // Perform disconnect logic only if not reconnected
                const username = userHashMap.get(sessionID);
                if (queue.containsPlayer(username)) {
                    queue.removePlayer(username);
                    userHashMap.delete(sessionID);
                    console.log(`Removed ${username} from the queue due to disconnection.`);
                    io.emit('queueUpdated', queue);
                }
            }
        }, 10000); // 10-second delay to allow for reconnections
    });
});




io.use((socket, next) => {
    sessionMiddleware(socket.request, {}, next);
})

  /* Queue API Handler */
app.get('/queue', (req, res) => {
    console.log(`Queue Requested : ${queue.queue}`);
    res.json({ users: queue.queue || []});
});

// POST to join the queue
app.post('/joinQueue', (req, res) => {
    const { username, sessionID } = req.body;
    console.log(`API Request: POST /joinQueue, username:  ${username}, sessionID: ${sessionID}`);
    if (!username) {
        return res.status(400).json({ error: 'Username is required.'});
    } else if (!queue.containsPlayer(username)) {
        queue.addPlayer(username); // Add player to the queue
        userHashMap.set(sessionID, username);
        io.emit('queueUpdated', queue); // Emit updated queue to clients
        return res.json({ message: `${username} added to the queue.`, queue });
    } else {
        return res.status(400).json({ error: 'Player is already in the queue' });
    }
});

// POST to leave the queue
app.post('/leaveQueue', (req, res) => {
    const { sessionID } = req.body;
    const username = userHashMap.get(sessionID);
    console.log(`API Request: POST /leaveQueue, username:`, username );

    
    const index = queue.indexOf(username);
    if (index > -1) {
        queue.removePlayer(username);
        userHashMap.delete(sessionID);
        io.emit('queueUpdated', queue); // Emit updated queue to clients
        return res.json({ message: `${username} left the queue.`, queue });
    } else {
        return res.status(400).json({ error: 'Player is not in the queue' });
    }
});


// Data that is being stored in the server
const game = GameLogic(); // initialize GameLogic instance
const queue = Queue; // use Queue logic
const {rows, columns} = config.gameSettings;


/* Gamestate API Handler */
// GET methods for retreiving Gamestate Data
app.get('/gameboard', (req, res) => {

    console.log('API Request: GET /gameboard');
    res.json({ board: game.board});

});

app.get('/players', (req, res) => {
    console.log('API Request: GET /players');
    res.json({ players: game.players });
});

app.get('/currentPlayer', (req, res) => {

    // this indicates the current player taking a turn  
    console.log('API Request: GET /currentPlayer');
    res.json({ player: game.currentPlayer});

});

app.get('/winner', (req, res) => {

    console.log('API Request: GET /winner');
    console.log(`Winner: ${game.winner}`);
    res.json({ player: game.winner});

});


app.get('/gamestate', (req, res) => {

    console.log('API Reqeust: GET /gamestate');
    console.log(`Game is Live: ${gameState}`);
    res.json({ state: gameState});

})

app.get('/timer', (req, res) => {
    console.log('API Request: GET /timer')
    res.json({ time: time});
});

async function startTimer(duration) {
    time = duration;
    console.log(`${currentPlayer}'s turn`);
    const timerInterval = setInterval(() => {
        if (time <= 0) {
            clearInterval(timerInterval);
            // Player forfeits if they run out of time
            const winner = currentPlayer === 'R' ? 'Y' : 'R'; // The other player wins by default
            console.log(`Player ${currentPlayer} forfeits. Winner is Player ${winner}`);
            io.emit('gameOver', { winner });
            gameState = false; // Stop the game
            return;
        }
        time--;
        io.emit('timerUpdate', { time });
    }, 1000);
}

// POST methods for updating Gamestate Data
app.post('/gamestate', (req, res) => {
    const { gameLive } = req.body;
    console.log('API Request: POST /gamestate, Gamestate: ', gameLive);
    gameState = gameLive;
    io.emit('gameStateUpdated', gameState);
    res.json({message: `Game state updated: ${gameState}`});
});

app.post('/gamemode', (req, res) => {
    const { mode } = req.body;
    console.log('API Request: POST /gamemode, mode:', mode);
    if (mode === 'classic' || mode === 'arcade') {
        game.gameType = mode;
        io.emit('gameModeUpdated', mode);
        res.json({ message: `Game mode set to ${mode}` });
    } else {
        res.status(400).json({ error: 'Invalid game mode' });
    }
});


app.post('/move', (req, res) => {
    const { column } = req.body;
    console.log('API Request: POST /move, column:', column);
    
    try {
        game.placePiece(column); // Place a piece using GameLogic
        currentPlayer = game.getCurrentPlayer(); // Switch player after a move
        io.emit('gameBoardUpdated', game.board); // Emit updated board
        io.emit('playerTurn', currentPlayer); // Emit updated player turn
        console.log('Gameboard Updated', game.board);

        if (game.checkWin()) {
            io.emit('gameOver', { winner: currentPlayer });
            console.log(`Player ${currentPlayer} wins!`);
            return res.json({ message: `Player ${currentPlayer} wins!` });
        }

        startTimer(120); // Restart timer after a move
        res.json({ board: game.board });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
});

// Handle Gameboard Updates will callback functionality to retrieve info
// from players vs. player and player vs. ai games
const handleGameUpdate = (update) => {
    if (update.board) {
        io.emit('gameBoardUpdated', update.board); 
        game.printBoard();
    }
    if (update.winner) {
        io.emit('gameOver', { winner: update.winner });
        //console.log(`${game.winner} won!`)
    }
    if (update.message) {
        io.emit('gameOver', { message: update.message });
    }
    if (update.currentPlayer) {
        io.emit('playerTurn', update.currentPlayer);
    }
};

app.post('/startAIVsAI', (req, res) => {
    console.log('Starting AI vs AI game...');
    game.startAIVsAI(handleGameUpdate);
    res.json({ message: 'AI vs AI game started' });
});


// DEBUG
app.get('/getUsername/:sessionID', (req, res) => {
    const sessionID = req.params.sessionID;
    console.log(`API Request: GET /getUsername/${sessionID}`); // Log to see request

    if (userHashMap.has(sessionID)) {
        const username = userHashMap.get(sessionID);
        console.log(`Username found for sessionID ${sessionID}: ${username}`); // Log to confirm username found
        res.json({ username });
    } else {
        console.log(`SessionID not found in userHashMap: ${sessionID}`); // Log if sessionID is not found
        res.status(404).json({ error: 'User not found' });
    }
});



// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log('Server started successfully.');
    console.log('Starting processes...');
    


    /*
    1. When Server starts, begin AiVsAi Attract Mode. Loop until player connects to Queue
    2. If player connects to an empty Queue, they are prompted to join a Player vs. AI match, that player remains in the Queue
    3. Once two players are in the Queue, the current Ai vs. Player game can be interupted. Player 1 will determine the gamemode.
    (Perhaps we can implement a voting system for gamemode, might be feature creep)
    4. Once gamemode is selected, initialize gamemode until game end condition is met. Return players to end of Queue
    */

    //game.startAIVsAI(handleGameUpdate);
});
