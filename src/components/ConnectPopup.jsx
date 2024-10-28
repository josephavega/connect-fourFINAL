import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useQueue from '../hooks/useQueue';
import "../styles/connectPopup.css";

const ConnectPopup = ({ onClose }) => {
  const [username, setUsername] = useState('');
  const [mode, setMode] = useState('single');
  const [gameType, setGameType] = useState('classic');

  const navigate = useNavigate(); // Initialize navigate

  const joinQueue = ( username ) => {
    if (username != null) {
      addPlayer({ username, mode, gameType });
      onClose(); // Close the popup after adding the player
      alert('added!');
    } else {
      alert('Please enter a username.');
    }

    /*
    To do:
    if(no game is runnning && user is next 2 in queue) {
      navigate('/game'); // Navigate to the game page
    };
    */
  };

  return (
    <div className="connect-popup-overlay">
      <div className="connect-popup">
        <div className="popup-header">
          <h2>Start a Game</h2>
          <button className="close-btn" onClick={onClose}>X</button>
        </div>
        <div className="popup-content">
          <label>
            Username:
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
            />
          </label>

          <div className="game-type-selection">
            <p>Game Type:</p>
            <label>
              <input
                type="radio"
                value="classic"
                checked={gameType === 'classic'}
                onChange={() => setGameType('classic')}
              />
              Classic
            </label>
            <label>
              <input
                type="radio"
                value="arcade"
                checked={gameType === 'arcade'}
                onChange={() => setGameType('arcade')}
              />
              Arcade
            </label>
          </div>

          <button onClick={joinQueue} className="start-btn">
            Join Queue
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConnectPopup;
