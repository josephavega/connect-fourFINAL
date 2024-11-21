import React, { useState } from 'react';
import "../styles/pickPlayerPopUp.css";

const PickPlayerPopUp = ({ queue, currentUser, onOpponentSelect, onClose }) => {
  const [selectedMode, setSelectedMode] = useState(null); // Track the selected button

  const handleModeSelect = (mode) => {
    setSelectedMode(mode); 
  };

  const handleOpponentChange = (event) => {
    onOpponentSelect(event.target.value);
  };

  return (
    <div className="popup">
      <div className="popup-content">
        <h3>Match Setup</h3>
        <p>
          <b>{currentUser} </b> vs {' '}
          <select onChange={handleOpponentChange} defaultValue="">
            <option value="" disabled>
              Select an opponent
            </option>
            {queue
              .filter((player) => player.username !== currentUser)
              .map((player, index) => (
                <option key={index} value={player.username}>
                  {player.username}
                </option>
              ))}
          </select>
        </p>

        <div className="classicArcadeVS">
          <div className="pair">
            <p>
              Classic{' '}
              <button
                className={`bubble-button1 ${
                  selectedMode === 'classic' ? 'bubble-button-active' : ''
                }`}
                onClick={() => handleModeSelect('classic')}
              ></button>
            </p>
          </div>
          <div className="pair">
            <p>
              Arcade{' '}
              <button
                className={`bubble-button2 ${
                  selectedMode === 'arcade' ? 'bubble-button-active' : ''
                }`}
                onClick={() => handleModeSelect('arcade')}
              ></button>
            </p>
          </div>
        </div>

        <div className="popup-buttons">
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default PickPlayerPopUp;
