import React, { useState, useEffect } from 'react';
import { Grid } from '@mui/material';
import '../styles/gameboard.css';
import BoardTileBack from '../assets/Board/BoardTileBack.png';
import BoardTileFront from '../assets/Board/BoardTileFront.png';
import HoverIndicator from '../assets/Board/BoardTileBack.png'; // Assuming this is the correct asset
import RedChip from '../assets/Board/Gamepieces/Chip_Red.png'; // Assuming you have red chip image
import YellowChip from '../assets/Board/Gamepieces/Chip_Yellow.png'; // Assuming you have yellow chip image
import GameSocket from '../sockets/gameSocket.js';
import gameSocket from '../sockets/gameSocket.js';


const newGameboard = ({ onClick }) => {
  const [hoveredColumn, setHoveredColumn] = useState(-1);
  const [activePowerup, setActivePowerup] = useState(null); // Track active power-up
  const [gameboard, setGameboard] = useState(Array(6).fill(Array(7).fill(null))); // 6 rows x 7 columns, initially empty
  const [currentPlayer, setCurrentPlayer] = useState('red'); // Start with red player
  const sessionID = localStorage.getItem('sessionID');

  useEffect(() => {
    // Listen for active power-up signals from the server
    gameSocket.on('powerupUsed', ({ powerupType }) => {
      setActivePowerup(powerupType);
    });

    return () => {
      gameSocket.off('powerupUsed');
    };
  }, []);

  const handleMouseEnter = (colIndex) => {
    setHoveredColumn(colIndex);
  };

  const handleMouseLeave = () => {
    setHoveredColumn(-1);
  };

  const handleClick = (colIndex) => {
    // Find the lowest empty row in the selected column
    const newGameboard = gameboard.map(row => [...row]); // Create a copy of the current gameboard state
    for (let rowIndex = gameboard.length - 1; rowIndex >= 0; rowIndex--) {
      if (!newGameboard[rowIndex][colIndex]) {
        newGameboard[rowIndex][colIndex] = currentPlayer;
        setGameboard(newGameboard);
        
        // Switch the current player
        setCurrentPlayer(currentPlayer === 'red' ? 'yellow' : 'red');

        // Emit the move to the server
        gameSocket.emit('playerMove', {
          rowIndex,
          colIndex,
          sessionID,
          powerupType: activePowerup, // Include active power-up if any
        });

        // Clear the power-up after use (if needed)
        setActivePowerup(null);

        break;
      }
    }
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

    for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
      const rowTiles = [];
      for (let colIndex = 0; colIndex < cols; colIndex++) {
        rowTiles.push(
          <Grid
            item
            key={`${rowIndex}-${colIndex}`}
            className="tile-container"
            onMouseEnter={() => handleMouseEnter(colIndex)}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleClick(colIndex)}
          >
            <div className="tile">
              <img src={BoardTileBack} alt="Tile Back" className="tile-back" />
              <img src={BoardTileFront} alt="Tile Front" className="tile-front" />
              {gameboard[rowIndex][colIndex] === 'red' && (
                <img src={RedChip} alt="Red Chip" className="chip" />
              )}
              {gameboard[rowIndex][colIndex] === 'yellow' && (
                <img src={YellowChip} alt="Yellow Chip" className="chip" />
              )}
            </div>
          </Grid>
        );
      }
      grid.push(
        <Grid container key={`row-${rowIndex}`} className="row" columns={7}>
          {rowTiles}
        </Grid>
      );
    }
    return grid;
  };

  return (
    <div className="gameboard">
      {createTopGrid()}
      {createMainGrid()}
    </div>
  );
};

export default newGameboard;
