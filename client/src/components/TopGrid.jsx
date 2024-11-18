import React from 'react';
import '../styles/topGrid.css'; // Import the new CSS file
import RedChip from '../assets/Board/Gamepieces/Chip_Red.png';
import YellowChip from '../assets/Board/Gamepieces/Chip_Yellow.png';

const TopGrid = ({ hoveredColumn, currentPlayer }) => {
  const cols = 7;
  return (
    <div className="top-grid">
      {Array.from({ length: cols }, (_, colIndex) => (
        <div key={colIndex} className="top-cell">
          {hoveredColumn === colIndex && (
            <img
              src={currentPlayer === 'Red' ? RedChip : YellowChip}
              alt="Hover Indicator"
              className="hover-img"
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default TopGrid;
