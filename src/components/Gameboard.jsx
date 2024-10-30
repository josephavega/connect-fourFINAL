import React from 'react'

function GameBoard({board, onClick }) {
    return (
      <div className="game-board">
        {board.map((row, rowIndex) => (
          <div className="row" key={rowIndex}>
            {row.map((cell, colIndex) => (
              <div
                className="cell"
                key={colIndex}
                onClick={() => onClick(rowIndex, colIndex)}
              >
                {cell}
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  }
  
  export default GameBoard;