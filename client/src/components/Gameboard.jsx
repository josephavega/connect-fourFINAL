import React, { useState, useEffect } from 'react';
import { Grid2 } from '@mui/material';
import '../styles/gameboard.css';
import EmptyChip from '../assets/Board/BoardTileBack.png';
import RedChip from '../assets/Board/Gamepieces/Chip_Red.png';
import YellowChip from '../assets/Board/Gamepieces/Chip_Yellow.png';
import BoardTileFront from '../assets/Board/BoardTileFront.png';
import HoverIndicator from '../assets/Board/BoardTileBack.png';
import { io } from 'socket.io-client';
import BoardBorder from "../assets/Board/Board_Boarder.png";
import RedSidebarBackground from '../assets/Board/Construction/Sidebar_Red.png';
import RedAnvilButton from '../assets/Board/Construction/Button_Anvil_Red.png';
import RedBrickButton from '../assets/Board/Construction/Button_Brick_Red.png';
import RedLightningButton from '../assets/Board/Construction/Button_Lightning_Red.png';

const socket = io('/game'); // Initialize the socket connection

const Gameboard = ({ board, onClick }) => {
  const [hoveredColumn, setHoveredColumn] = useState(-1);
  const [activePowerup, setActivePowerup] = useState(null); // Track active power-up
  const [currentPlayer, setCurrentPlayer] = useState('red'); // Start with red player
  const sessionID = localStorage.getItem('sessionID');
  

  useEffect(() => {
    socket.on('powerupUsed', ({ powerupType }) => {
      setActivePowerup(powerupType);
    });

    return () => {
      socket.off('powerupUsed');
    };
  }, []);

  const handleMouseEnter = (colIndex) => {
    setHoveredColumn(colIndex);
  };

  const handleMouseLeave = () => {
    setHoveredColumn(-1);
  };

  const createTopGrid = () => {
    const cols = 7;
    return (
      <div className="top-grid">
        {Array.from({ length: cols }, (_, colIndex) => (
          <div key={colIndex} className="top-cell">
            {hoveredColumn === colIndex && (
              <img src={HoverIndicator} alt="Hover Indicator" className="hover-img" />
            )}
          </div>
        ))}
      </div>
    );
  };

  const createMainGrid = () => {
    const rows = 6;
    const cols = 7;
    const grid = [];

    for (let i = 0; i < rows; i++) {
      const rowTiles = [];
      for (let j = 0; j < cols; j++) {
        let chipType;
        if (board[i][j] === 'RedChip') {
          chipType = RedChip;
        } else if (board[i][j] === 'YellowChip') {
          chipType = YellowChip;
        } else {
          chipType = EmptyChip;
        }

        rowTiles.push(
          <Grid2
            item
            key={`${i}-${j}`}
            className="tile-container"
            onMouseEnter={() => handleMouseEnter(j)}
            onMouseLeave={handleMouseLeave}
          >
            <div className="tile" onClick={() => onClick(i, j)}>
              <img src={chipType} alt="Tile Chip" className="tile-back" />
              <img src={BoardTileFront} alt="Tile Front" className="tile-front" />
            </div>
          </Grid2>
        );
      }
      grid.push(
        <Grid2 container key={`row-${i}`} className="row" columns={7}>
          {rowTiles}
        </Grid2>
      );
    }
    return grid;
  };

  return (
    <div className="gameboard-container">
      <div className="sidebar">
        <img src={RedSidebarBackground} alt="Sidebar Background" className="sidebar-background" />
        <div className="sidebar-content">
          <div className="sidebar-text">AAA</div>
          <button className="sidebar-button"><img src={RedAnvilButton} alt="Anvil Button" /></button>
          <button className="sidebar-button"><img src={RedLightningButton} alt="Lightning Button" /></button>
          <button className="sidebar-button"><img src={RedBrickButton} alt="Brick Button" /></button>
        </div>
      </div>
    <div>
      {createTopGrid()}
      <div className="gameboard-wrapper">
          <img src={BoardBorder} alt="Board Border" className="board-border" />
        <div className="gameboard">
        {createMainGrid()}
        </div>
      </div>
    </div>
    </div>
  );
};

// socket.on('sendInstructions', moves => {
//   //'Place', 'Anvil', 'Broken', 'Lightning', 'Flipped', 'Brick', 'StoppedL','StoppedA', 'Win','Full'
// moves.forEach(instruction => {
//   var rule = instruction[0]
//   var col = instruction[1]
//   var row = instruction[2]
//   var type = instruction[3]
//   switch(rule){
//     case 'Place':
//       board[col][row] = type
//       break;
//     case 'Anvil':
//       //Play Anvil animation
//       break;
//     case 'Broken':
//       board[col][row] = type
//       break;
//     case 'Lightning':
//       //Play Lightning Animation
//       break;
//     case 'Flipped':
//       board[col][row] = type
//       break;
      
//   }
// });






// });

export default Gameboard;
