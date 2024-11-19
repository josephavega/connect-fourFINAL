import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/pickPlayerPopUp.css";
import { v4 as uuidv4 } from 'uuid';

const PickPlayerPopUp = ({ queue, currentUser, onOpponentSelect, onClose }) => {
  const handleOpponentChange = (event) => {
    onOpponentSelect(event.target.value);
  };

  return (
    <div className="popup">
      <div className="popup-content">
        <h3>Match Setup</h3>
        <p>
          <b>{currentUser}</b> vs {' '}
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
        <div className="popup-buttons">
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default PickPlayerPopUp;
