import React from 'react';
import RedChip from '../assets/Board/Gamepieces/Chip_Red.png';
import YellowChip from '../assets/Board/Gamepieces/Chip_Yellow.png';
import '../styles/topgrid.css';

const TopGrid = ({ selectedColumn, currentPlayer }) => {
  if (selectedColumn === null) return null; // Do not render if no column is selected

  const gridStyle = {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '10px',
  };

  return (
    <div style={gridStyle}>
      {Array(7).fill(null).map((_, index) => (
        <div
          key={index}
          style={{
            visibility: index === selectedColumn ? 'visible' : 'hidden',
          }}
        >
          <img
            src={currentPlayer === 'Red' ? RedChip : YellowChip}
            alt={`${currentPlayer} Chip`}
          />
        </div>
      ))}
    </div>
  );
};

export default TopGrid;
