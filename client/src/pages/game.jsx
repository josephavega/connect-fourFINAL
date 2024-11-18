import React, { useState } from 'react';
import GameBoard from '../components/Gameboard';
import '../styles/game.css';
import gameSocket from '../sockets/gameSocket';
import VictoryPopup from '../components/VictoryPopup';
import DebugGameButtons from '../components/DebugGameButtons';

const Game = () => {
  const [board, setBoard] = useState(Array(6).fill(null).map(() => Array(7).fill('EmptyChip')));
  const [lastChanged, setChanged] = useState('None');
  const [isVictoryPopupOpen, setVictoryPopupOpen] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState('Red'); // Track the current player
  const sessionID = localStorage.getItem('sessionID');
  const [activePowerup, setActivePowerup] = useState(null); // Track active power-up

  const openVictoryPopup = () => setVictoryPopupOpen(true);

  const togglePlayer = () => {
    setCurrentPlayer(currentPlayer === 'Red' ? 'Yellow' : 'Red');
  };
  // useEffect(() => {
  //   const socket = gameSocket;

  //   const handleInstructions = (moves) => {
  //     setBoard((prevBoard) => {
  //       const updatedBoard = prevBoard.map((row) => [...row]);
  //     moves.forEach((instruction) => {
  //       const [rule, col, row, type] = instruction;
  //       switch (rule) {
  //           case 'Place':
  //             updatedBoard[col][row] = type
  //             break;
  //           case 'Anvil':
  //             //Play Anvil animation
  //             break;
  //           case 'Broken':
  //             updatedBoard[col][row] = type
  //             break;
  //           case 'Lightning':
  //             //Play Lightning Animation
  //             break;
  //           case 'Flipped':
  //             updatedBoard[col][row] = type
  //             break;
  //           case 'Win':
  //           openVictoryPopup()
  //           break;
              
  //         }
  //       });
  //       return updatedBoard;
  //     });

  //     togglePlayer(); // Switch the player after processing instructions
  //   };

  //   gameSocket.on('sendInstructions', handleInstructions);

  //   return () => {
  //     gameSocket.off('sendInstructions', handleInstructions); // Cleanup listener
  //   };
  // }, []);

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
    const chipColor = currentPlayer === 'Red' ? 'R' : 'Y';
    const updatedBoard = board.map((row, rIdx) =>
      row.map((cell, cIdx) => (rIdx === lowestEmptyRow && cIdx === colIndex ? chipColor : cell))
    );
    setBoard(updatedBoard);

    // Toggle to the other player
    togglePlayer();

    const data = {colIndex, rowIndex, sessionID, activePowerup};
    gameSocket.emit('playerMove', data);
    
  };

  return (
    <div className="game-wrapper">
      <GameBoard board={board} onClick={handleClick} currentPlayer={currentPlayer} />
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
      <button><DebugGameButtons/></button>
      <button className="victory-debug-button" onClick={openVictoryPopup}>
        Victory Debug
      </button>
      {/* Victory Popup */}
      {isVictoryPopupOpen && <VictoryPopup />}
    </div>
  );
};

export default Game;
