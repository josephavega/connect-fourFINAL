import React, { useState } from 'react';
import GameBoard from '../components/Gameboard';
import '../styles/game.css';
import gameSocket from '../sockets/gameSocket';


const Game = () => {
  const [board, setBoard] = useState(Array(6).fill(Array(7).fill('')));
  const [lastClicked, setLastClicked] = useState('None');
  const sessionID = localStorage.getItem('sessionID');

  const handleClick = (rowIndex, colIndex) => {
    console.log(`Cell clicked at row ${rowIndex}, column ${colIndex}`);
    setLastClicked(`Row ${rowIndex + 1}, Column ${colIndex + 1}`); 
    const data = {rowIndex, colIndex, sessionID};
    gameSocket.emit('playerMove', data);

  };
  return (
    <div className="game-wrapper">
      <GameBoard board={board} onClick={handleClick} />
      <div className="click-info">
        <p>Last clicked tile: {lastClicked}</p>
      </div>
    </div>
  );
};

export default Game;
