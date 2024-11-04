// server/routes/gameRoutes.js

import express from 'express';
import Manager from '../utils/game/Manager.js';
import users from '../utils/Users.js'; 

const game = Manager; // initialize GameLogic instance

const router = express.Router();

/* Gamestate API Handler */
// GET methods for retreiving Gamestate Data
router.get('/gameboard', (req, res) => {

    console.log('API Request: GET /gameboard');
    res.json({ board: game.board});

});

router.get('/players', (req, res) => {
    console.log('API Request: GET /players');
    res.json({ players: game.players });
});

router.get('/currentPlayer', (req, res) => {

    // this indicates the current player taking a turn  
    console.log('API Request: GET /currentPlayer');
    res.json({ player: game.currentPlayer});

});

router.get('/winner', (req, res) => {

    console.log('API Request: GET /winner');
    console.log(`Winner: ${game.winner}`);
    res.json({ player: game.winner});

});


router.get('/gamestate', (req, res) => {

    console.log('API Reqeust: GET /gamestate');
    console.log(`Game is Live: ${gameState}`);
    res.json({ state: gameState});

})

router.get('/timer', (req, res) => {
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
router.post('/gamestate', (req, res) => {
    const { gameLive } = req.body;
    console.log('API Request: POST /gamestate, Gamestate: ', gameLive);
    gameState = gameLive;
    io.emit('gameStateUpdated', gameState);
    res.json({message: `Game state updated: ${gameState}`});
});

router.post('/gamemode', (req, res) => {
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


router.post('/move', (req, res) => {
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

router.post('/startAIVsAI', (req, res) => {
    console.log('Starting AI vs AI game...');
    game.startAIVsAI(handleGameUpdate);
    res.json({ message: 'AI vs AI game started' });
});


export default router;
