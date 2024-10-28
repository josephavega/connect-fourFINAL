const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const req = require('express/lib/request');
const { start } = require('repl');
const config = require('../data/config.json');
const axios = require('axios');

const GameLogic = require('../hooks/gameLogic.js');
//const AI = require('./AI.js');
const Queue = require('../hooks/queue.js');

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

const game = GameLogic();

//const queue = Queue;

const {rows, columns} = config.gameSettings;

// Data that is being stored in the server


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

/* Queue API Handler */
// GET methods for retrieiving Queue Data
app.get('/queue', (req, res) => {

    console.log('API Request: GET /queue');
    console.log(`Current Queue: ${queue}`);
    res.json({ users: queue});

});

// app.get('/firstqueue', (req, res) => {
//     console.log('API Request: GET /firstqueue');
//     console.log(`First in Queue: ${queue}`);
//     res.json({ user: queue[0] });
    
// });

// // POST methods for updating Queue Data
// app.post('/joinQueue', (req, res) => {
//     const { username } = req.body;
//     console.log('API Request: POST /joinQueue, username: ', username);

//     if (!queue.includes(username)) {
//         queue.addPlayer(username);
//         io.emit('queueUpdated', queue);
//         return res.json({ message: `${username} added to the queue.`, queue})
//     }
//     return res.status(400).json({ error: 'Player is already in the queue' });
// });

// app.post('/leaveQueue', (req, res) => {
//     const { username } = req.body;
//     console.log(`API Reqeust: /POST leaveQueue, username:`, username);

//     // filter username from queue

//     io.emit('queueUpdated:', queue);
//     res.json({ message: `${username} left the queue`});
// });

const queue = [];

// POST to join the queue
app.post('/joinQueue', (req, res) => {
    const { username } = req.body;
    console.log('API Request: POST /joinQueue, username: ', username);

    if (!queue.includes(username)) {
        queue.push(username); // Add player to the queue
        io.emit('queueUpdated', queue); // Emit updated queue to clients
        return res.json({ message: `${username} added to the queue.`, queue });
    } else {
        return res.status(400).json({ error: 'Player is already in the queue' });
    }
});

// POST to leave the queue
app.post('/leaveQueue', (req, res) => {
    const { username } = req.body;
    console.log(`API Request: POST /leaveQueue, username:`, username);

    const index = queue.indexOf(username);
    if (index > -1) {
        queue.splice(index, 1); // Remove player from the queue
        io.emit('queueUpdated', queue); // Emit updated queue to clients
        return res.json({ message: `${username} left the queue.`, queue });
    } else {
        return res.status(400).json({ error: 'Player is not in the queue' });
    }
});

io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`); // Log when a user connects

    // Handle disconnect event
    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`); // Log when a user disconnects
        // if (!queue.isEmpty) {
        //     queue = queue.removePlayer(username);
        //     }
        // io.emit('queueUpdated:', queue);
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log('Server started successfully.');


    game.startAIVsAI(handleGameUpdate);
});
