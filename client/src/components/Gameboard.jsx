import React, { useState } from 'react';
import { Grid2 } from '@mui/material';
import '../styles/gameboard.css';
import BoardTileBack from '../assets/Board/BoardTileBack.png';
import BoardTileFront from '../assets/Board/BoardTileFront.png';
import HoverIndicator from '../assets/Board/BoardTileBack.png'; 

const Gameboard = ({ onClick }) => {
  const [hoveredColumn, setHoveredColumn] = useState(-1);

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
        rowTiles.push(
          <Grid2
            item
            key={`${i}-${j}`}
            className="tile-container"
            onMouseEnter={() => handleMouseEnter(j)}
            onMouseLeave={handleMouseLeave}
          >
            <div className="tile" onClick={() => onClick(i, j)}>
              <img src={BoardTileBack} alt="Tile Back" className="tile-back" />
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
    <div className="gameboard">
      {createTopGrid()}
      {createMainGrid()}
    </div>
  );
};

export default Gameboard;