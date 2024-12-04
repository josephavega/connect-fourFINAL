import React, { useEffect, useState } from "react";
import "../styles/pickPlayerPopUp.css";
import DebugButton from "../components/DebugButton";
import GameButton from "../components/GameButton";
import { useNavigate } from "react-router-dom";
import gameSocket from "../sockets/gameSocket";

const PickPlayerPopUp = ({ queue, currentUser, onOpponentSelect, onClose }) => {
  const [selectedMode, setSelectedMode] = useState("classic"); // Track the selected button
  const [selectedDifficulty, setSelectedDifficulty] = useState(1); // Default difficulty
  const [sessionID, setSessionID] = useState("");
  const [username, setUsername] = useState(currentUser || "Guest");
  const navigate = useNavigate();

  useEffect(() => {
    // Set session ID and username from local storage
    const storedSessionID = localStorage.getItem("sessionID");
    const storedUsername = localStorage.getItem("username");

    if (storedSessionID) {
      setSessionID(storedSessionID);
    }

    if (storedUsername) {
      setUsername(storedUsername);
    }

    // Connect to the game socket
    if (!gameSocket.connected) {
      gameSocket.connect();
    }

    return () => {
      // Clean up socket connection if needed
      if (gameSocket.connected) {
        gameSocket.disconnect();
      }
    };
  }, []); // Only run once when the component mounts

  const handleJoinClick = () => {
    // Create the payload to send to the API
    const payload = {
      sessionID: sessionID,
      username: username,
      gamemode: selectedMode,
      difficulty: selectedDifficulty,
    };

    // Send POST request to the API
    fetch("http://localhost:3000/game/startgame", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Server error: ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Game started successfully:", data);
        // Emit the join game event to the socket server
        gameSocket.emit("/joinGame", { sessionID, username });
        // Navigate to the game page
        navigate("/game");
      })
      .catch((error) => {
        console.error("Error starting game:", error);
      });
  };
  

  const handleDifficultyChange = (difficulty) => {
    setSelectedDifficulty(difficulty);
  };

  const handleOpponentChange = (event) => {
    onOpponentSelect(event.target.value);
  };

  const handleModeSelect = (mode) => {
    setSelectedMode(mode);
  };

  const playersQueue = queue.queue || [];
  //console.log("Players in Queue:", playersQueue); // Debugging: Log the players queue
  //console.log("Current User:", currentUser); // Debugging: Log the current user

  const otherPlayers = playersQueue.filter(
    (player) => player.username !== currentUser
  );
  //console.log("Other Players:", otherPlayers); // Debugging: Log other players

  return (
    <div className="popup">
      <div className="popup-content">
        <h3>Match Setup</h3>
        <button className="close-btn" onClick={onClose}>
        <img src="../src/assets/Menu/Buttons/Help_Settings_Exit.png" alt="Close" />
        </button>
        <p>
          <b>{currentUser}</b> vs{" "}
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
                  selectedDifficulty === 1 ? "difficulty-selected" : ""
                }`}
                onClick={() => handleDifficultyChange(1)}
              >
                Easy
              </button>
              <button
                className={`difficulty-button ${
                  selectedDifficulty === 2 ? "difficulty-selected" : ""
                }`}
                onClick={() => handleDifficultyChange(2)}
              >
                Medium
              </button>
              <button
                className={`difficulty-button ${
                  selectedDifficulty === 3 ? "difficulty-selected" : ""
                }`}
                onClick={() => handleDifficultyChange(3)}
              >
                Hard
              </button>
            </div>
          </div>
        )}

        <div className="classicArcadeVS">
          <div className="pair">
            <p>
              Classic{" "}
              <button
                className={`bubble-button1 ${
                  selectedMode === "classic" ? "bubble-button-active" : ""
                }`}
                onClick={() => handleModeSelect("classic")}
              ></button>
            </p>
          </div>
          <div className="pair">
            <p>
              Arcade{" "}
              <button
                className={`bubble-button2 ${
                  selectedMode === "arcade" ? "bubble-button-active" : ""
                }`}
                onClick={() => handleModeSelect("arcade")}
              ></button>
            </p>
          </div>
        </div>

        <div className="popup-join-game">
        <button onClick={handleJoinClick}>
          <img src="./src/assets/Menu/Buttons/Button_Join.png" alt="Join Button" />
        </button>
      </div>

        <div className="popup-buttons-close">
          <button>
            <img
              src="./src/assets/Menu/Buttons/Button_Join.png"
              alt="Join Button"
              onClick={handleJoinClick}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PickPlayerPopUp;
