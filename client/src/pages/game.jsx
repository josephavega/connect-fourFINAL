import React, { useState } from 'react';
import GameBoard from '../components/Gameboard';
import '../styles/game.css';
import gameSocket from '../sockets/gameSocket';
import VictoryPopup from '../components/VictoryPopup';

const Game = () => {
  const [board, setBoard] = useState(Array(6).fill(null).map(() => Array(7).fill('EmptyChip')));
  const [lastChanged, setChanged] = useState('None');
  const [isVictoryPopupOpen, setVictoryPopupOpen] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState('Red'); // Track the current player
  const sessionID = localStorage.getItem('sessionID');

  const openVictoryPopup = () => setVictoryPopupOpen(true);

  const togglePlayer = () => {
    setCurrentPlayer(currentPlayer === 'Red' ? 'Yellow' : 'Red');
  };

  const handleClick = (rowIndex, colIndex) => {
    // Find the lowest empty row in the selected column
    let lowestEmptyRow = -1;
    for (let i = board.length - 1; i >= 0; i--) {
      if (board[i][colIndex] === 'EmptyChip') {
        lowestEmptyRow = i;
        break;
      }
    }

    // If there is no empty row, the column is full
    if (lowestEmptyRow === -1) {
      console.log(`Column ${colIndex} is full.`);
      return; // Exit function if column is full
    }

    console.log(`Cell clicked at row ${lowestEmptyRow}, column ${colIndex}`);
    setChanged(`Row ${lowestEmptyRow + 1}, Column ${colIndex + 1}`);

    // Update the board with the current player's chip
    const chipColor = currentPlayer === 'Red' ? 'RedChip' : 'YellowChip';
    const updatedBoard = board.map((row, rIdx) =>
      row.map((cell, cIdx) => (rIdx === lowestEmptyRow && cIdx === colIndex ? chipColor : cell))
    );
    setBoard(updatedBoard);

    // Toggle to the other player
    togglePlayer();

    const data = { rowIndex: lowestEmptyRow, colIndex, sessionID };
    gameSocket.emit('playerMove', data);
  };

  return (
    <div className="game-wrapper">
      <GameBoard board={board} onClick={handleClick} />
      <div className="click-info">
        <p>Last changed tile: {lastChanged}</p>
        <p>Current Player: {currentPlayer}</p>
      </div>
      <button
        className={`player-toggle-button ${currentPlayer.toLowerCase()}`}
        onClick={togglePlayer}
      >
        Switch Player Debug
      </button>
      <button className="victory-debug-button" onClick={openVictoryPopup}>
        Victory Debug
      </button>
      {/* Victory Popup */}
      {isVictoryPopupOpen && <VictoryPopup />}
    </div>
  );
};

export default Game;
