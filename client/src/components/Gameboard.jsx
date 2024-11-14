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

import YellowSidebarBackground from '../assets/Board/Construction/Sidebar_Yellow.png';
import YellowAnvilButton from '../assets/Board/Construction/Button_Anvil_Yellow.png';
import YellowBrickButton from '../assets/Board/Construction/Button_Brick_Yellow.png';
import YellowLightningButton from '../assets/Board/Construction/Button_Lightning_Yellow.png';

import UsedAnvilButton from '../assets/Board/Construction/Button_Anvil_Used.png';
import UsedLightningButton from '../assets/Board/Construction/Button_Lightning_Used.png';
import UsedBrickButton from '../assets/Board/Construction/Button_Brick_Used.png';



const socket = io('/game'); // Initialize the socket connection

const Gameboard = ({ board, onClick }) => {
  const [hoveredColumn, setHoveredColumn] = useState(-1);
  const [activePowerup, setActivePowerup] = useState(null); // Track active power-up
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
        if (board[i][j] === 'R') {
          chipType = RedChip;
        } else if (board[i][j] === 'Y') {
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
   <div className="red-sidebar">
     <img src={RedSidebarBackground} alt="Sidebar Background" className="red-sidebar-background" />
     <div className="red-sidebar-content">
       <div className="red-sidebar-text">ABC</div>
       <button className="red-sidebar-button"><img src={RedAnvilButton} alt="Anvil Button" /></button>
       <button className="red-sidebar-button"><img src={RedLightningButton} alt="Lightning Button" /></button>
       <button className="red-sidebar-button"><img src={RedBrickButton} alt="Brick Button" /></button>
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
   <div className="yellow-sidebar">
     <img src={YellowSidebarBackground} alt="Sidebar Background" className="yellow-sidebar-background" />
     <div className="yellow-sidebar-content">
       <div className="yellow-sidebar-text">DEF</div>
       <button className="yellow-sidebar-button"><img src={YellowAnvilButton} alt="Anvil Button" /></button>
       <button className="yellow-sidebar-button"><img src={YellowLightningButton} alt="Lightning Button" /></button>
       <button className="yellow-sidebar-button"><img src={YellowBrickButton} alt="Brick Button" /></button>
     </div>
   </div>
</div>

  );
};

export default Gameboard;
