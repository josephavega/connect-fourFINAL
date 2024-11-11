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
    <div>
      {createTopGrid()}
      <div className="gameboard-wrapper">
          <img src={BoardBorder} alt="Board Border" className="board-border" />
        <div className="gameboard">
        {createMainGrid()}
        </div>
      </div>
    </div>
  );
};

export default Gameboard;
