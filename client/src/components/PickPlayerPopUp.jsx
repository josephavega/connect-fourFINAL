import React, { useState } from 'react';
import "../styles/pickPlayerPopUp.css";
import DebugButton from '../components/DebugButton';
import GameButton from '../components/GameButton';

const PickPlayerPopUp = ({ queue, currentUser, onOpponentSelect, onClose }) => {
  const [selectedMode, setSelectedMode] = useState(null); // Track the selected button
  const [selectedDifficulty, setSelectedDifficulty] = useState("Easy"); // Default difficulty

  const handleModeSelect = (mode) => {
    setSelectedMode(mode);
  };


  const handleJoinClick = () => {
    fetchQueue(); 
    setIsPopupVisible(true); 
  };

  const handleDifficultyChange = (difficulty) => {
    setSelectedDifficulty(difficulty);
  };

  const handleOpponentChange = (event) => {
    onOpponentSelect(event.target.value);
  };


  const playersQueue = queue.queue || []; 
  console.log('Players in Queue:', playersQueue); // Debugging: Log the players queue
  console.log('Current User:', currentUser); // Debugging: Log the current user

  const otherPlayers = playersQueue.filter((player) => player.username !== currentUser);
  console.log('Other Players:', otherPlayers); // Debugging: Log other players

  return (
    <div className="popup">
      <div className="popup-content">
        <h3>Match Setup</h3>
        <p>
          <b>{currentUser}</b> vs{' '}
          {playersQueue.length > 1 ? (
            <select onChange={handleOpponentChange} defaultValue="">
              <option value="" disabled>
                Select an opponent
              </option>
              {otherPlayers.map((player, index) => (
                <option key={index} value={player.username}>
                  {player.username}
                </option>
              ))}
            </select>
          ) : (
            <span>AI</span>
          )}
        </p>

        {playersQueue.length <= 1 && (
          <div className="difficulty-chooser">
            <p>Select Difficulty:</p>
            <div className="difficulty-buttons">
              <button
                className={`difficulty-button ${
                  selectedDifficulty === "Easy" ? "difficulty-selected" : ""
                }`}
                onClick={() => handleDifficultyChange("Easy")}
              >
                Easy
              </button>
              <button
                className={`difficulty-button ${
                  selectedDifficulty === "Medium" ? "difficulty-selected" : ""
                }`}
                onClick={() => handleDifficultyChange("Medium")}
              >
                Medium
              </button>
              <button
                className={`difficulty-button ${
                  selectedDifficulty === "Hard" ? "difficulty-selected" : ""
                }`}
                onClick={() => handleDifficultyChange("Hard")}
              >
                Hard
              </button>
            </div>
          </div>
        )}

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

<<<<<<< HEAD
        <div className="popup-join-game">
        <button onClick={handleJoinClick}>
          <img src="./src/assets/Menu/Buttons/Button_Join.png" alt="Join Button" />
        </button>
      </div>

=======
>>>>>>> parent of ef7928a (lobby fixes and new buttons)
        <div className="popup-buttons-close">
        <button><img src="./src/assets/Menu/Buttons/Button_Join.png" alt="Join Button" onClick={handleJoinClick} /></button>
      
        </div>
      </div>
    </div>
  );
};

export default PickPlayerPopUp;
