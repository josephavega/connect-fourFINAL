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
  const [selectedMove, setSelectedMove] = useState(null);
  const [selectedColumn, setSelectedColumn] = useState(null); // Track the currently clicked column

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
  
    console.log(`Move selected at row ${lowestEmptyRow}, column ${colIndex}`);
    setSelectedMove({ row: lowestEmptyRow, col: colIndex }); // Store the move
    setSelectedColumn(colIndex); // Highlight the selected column
    setChanged(`Row ${lowestEmptyRow + 1}, Column ${colIndex + 1}`); // Update last changed info
  };
  
  function handleMove(colIndex) {
    const sessionID = localStorage.getItem('sessionID');
    const username = localStorage.getItem('username');
    const data = { colIndex, sessionID, username };

    gameSocket.emit('playerMove', data);
}


  const handleConfirm = () => {
    if (!selectedMove) {
      console.log('No move selected to confirm.');
      return;
    }
  
    const { row, col } = selectedMove;
    const chipColor = currentPlayer === 'Red' ? 'R' : 'Y';
  
    // Update the board with the selected move
    const updatedBoard = board.map((r, rIdx) =>
      r.map((cell, cIdx) => (rIdx === row && cIdx === col ? chipColor : cell))
    );
    setBoard(updatedBoard);
  
    // Emit the move to the server
    handleMove(col);
  
    // Reset the selected move and toggle player
    setSelectedMove(null);
    setSelectedColumn(null);
    togglePlayer();
  };

  return (
    <div className="game-wrapper">
      <GameBoard 
      board={board}
      onClick={handleClick}
      currentPlayer={currentPlayer}
      selectedColumn={selectedColumn}
      />
      <div className="click-info">
        <p>Last changed tile: {lastChanged}</p>
        <p>Current Player: {currentPlayer}</p>
      </div>
      <button
      className={`confirm-button ${currentPlayer.toLowerCase()}`}
      onClick={handleConfirm}
      disabled={!selectedMove} 
      >
        Confirm Move
      </button>

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
