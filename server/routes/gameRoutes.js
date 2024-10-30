// server/routes/gameRoutes.js
const express = require('express');
const GameLogic = require('../utils/game/Manager');

const router = express.Router();
const game = new GameLogic(); // Create an instance of GameLogic

router.get('/gameboard', (req, res) => {
  console.log('API Request: GET /gameboard');
  res.json({ board: game.board });
});

router.get('/players', (req, res) => {
  console.log('API Request: GET /players');
  res.json({ players: game.players });
});

router.post('/move', (req, res) => {
  const { column } = req.body;
  console.log('API Request: POST /move, column:', column);
  try {
    game.placePiece(column);
    res.json({ board: game.board });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

module.exports = router;
