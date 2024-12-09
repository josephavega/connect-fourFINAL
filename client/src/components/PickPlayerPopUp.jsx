import React, { useEffect, useState } from "react";
import "../styles/pickPlayerPopUp.css";
import { useNavigate } from "react-router-dom";
import gameSocket from "../sockets/gameSocket";
import JoinButton from "../../../public/Menu/Buttons/Button_Start.png";
import BlueBoard from "../../../public/Menu/BlueBoard.png";

const PickPlayerPopUp = ({ queue, currentUser, onOpponentSelect, onClose }) => {
  const [selectedMode, setSelectedMode] = useState("classic");
  const [selectedDifficulty, setSelectedDifficulty] = useState(1); // Default to Easy
  const [sessionID, setSessionID] = useState("");
  const [username, setUsername] = useState(currentUser || "Guest");
  const navigate = useNavigate();

  useEffect(() => {
    const storedSessionID = localStorage.getItem("sessionID");
    const storedUsername = localStorage.getItem("username");

    if (storedSessionID) setSessionID(storedSessionID);
    if (storedUsername) setUsername(storedUsername);

    if (!gameSocket.connected) {
      gameSocket.connect();
    }

    return () => {
      if (gameSocket.connected) {
        gameSocket.disconnect();
      }
    };
  }, []);

  const handleJoinClick = () => {
    const payload = {
      sessionID,
      username,
      gamemode: selectedMode,
      difficulty: selectedDifficulty,
    };

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
        gameSocket.emit("/joinGame", { sessionID, username });
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
  const otherPlayers = playersQueue.filter(
    (player) => player.username !== currentUser
  );

  return (
    <div className="popup">
      <div
        className="popup-content"
        style={{
          backgroundImage: `url(${BlueBoard})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          borderRadius: "15px",
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
        }}
      >
        <h3>Match Setup</h3>
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

        <div className="popup-buttons-close">
          <button
            onClick={handleJoinClick}
            style={{
              backgroundImage: `url(${JoinButton})`,
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              width: "250px",
              height: "50px",
              border: "none",
              cursor: "pointer",
            }}
          ></button>
        </div>
      </div>
    </div>
  );
};

export default PickPlayerPopUp;
