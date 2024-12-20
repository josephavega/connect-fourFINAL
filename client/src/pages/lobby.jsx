import React, { useState, useEffect } from 'react';
import QueueComponent from '../components/Queue';
import QueueButton from '../components/QueueButton';
import DebugButton from '../components/DebugButton';
import GameButton from '../components/GameButton';
import PickPlayerPopUp from '../components/PickPlayerPopUp';
import '../styles/lobby.css';

import queueSocket from "../sockets/queueSocket";
import gameSocket from "../sockets/gameSocket";
import { useNavigate } from "react-router-dom";
import SpectateGameboard from "../components/SpectateGameboard";

const Lobby = () => {
  const [board, setBoard] = useState(
    Array(6)
      .fill(null)
      .map(() => Array(7).fill(""))
  );
  const [currentPlayer, setCurrentPlayer] = useState("null");
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [queue, setQueue] = useState([]);
  const [selectedOpponent, setSelectedOpponent] = useState("");
  const [usernameA, setUsernameA] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Get the username from local storage
    setUsernameA(localStorage.getItem("username") || "Guest");
    gameSocket.connect();
    gameSocket.on("connect", () => console.log("Game socket connected!"));
    gameSocket.on("connect_error", (error) =>
      console.error("Connection error:", error)
    );

    gameSocket.emit("getBoard");

    // Event listener for game starting signal
    const handleStartGame = (data) => {
      console.log("Received startGame event:", data);
      if (data.mode === "Player vs AI") {
        navigate("/game", {
          state: { mode: "Player vs AI", difficulty: data.difficulty },
        });
      } else if (data.mode === "Player vs Player") {
        navigate("/game", {
          state: { mode: "Player vs Player", opponent: data.opponent },
        });
      }
    };

    // Event listener for joining the queue
    const handleQueueUpdate = (updatedQueue) => {
      console.log("Queue updated:", updatedQueue);
      setQueue(updatedQueue);
    };

    const handlePromptPopup = (data) => {
      const { sessionID } = data;
      const localSessionID = localStorage.getItem("sessionID");
      console.log("Trying prompt...");
      if (localSessionID === sessionID) {
        console.log("Showing prompt");
        setIsPopupVisible(true);
      } else {
        console.log("Not showing prompt for this user.");
      }
    };

    // Socket event for board update
    const handleBoardUpdate = (board) => {
      const flippedBoard = [];
      for (let i = board.length - 1; i >= 0; i--) {
        flippedBoard.push(board[i]);
      }
      console.log(`Updated Board: ${flippedBoard}`);
      setBoard(flippedBoard);
    };

    // Set up socket event listeners for game and queue
    queueSocket.on("queueUpdated", handleQueueUpdate);
    gameSocket.on("sentBoard", handleBoardUpdate);
    gameSocket.on("startGame", handleStartGame);
    gameSocket.on("promptStartGame", handlePromptPopup);

    // Periodically request board updates
    const intervalId = setInterval(() => {
      console.log("Requesting board update...");
      gameSocket.emit("getBoard");
    }, 2000);

    const checkQueue = setInterval(() => {
      const firstInQueue = true;

      if (firstInQueue) {
        setIsPopupVisible(true);
      }
    }, 500);

    return () => {
      // Clean up socket event listeners when the component is unmounted
      queueSocket.off("queueUpdated", handleQueueUpdate);
      gameSocket.off("sentBoard", handleBoardUpdate);
      gameSocket.off("startGame", handleStartGame);
      gameSocket.off("promptStartGame", handlePromptPopup);
    };
  }, [navigate]);

  const currentUser = usernameA;

  const handleJoinClick = () => {
    fetchQueue();
    setIsPopupVisible(true);
  };

  const handleOpponentSelect = (opponent) => {
    setSelectedOpponent(opponent);
    console.log("Selected opponent:", opponent);
    setIsPopupVisible(false);
  };

  const handlePopupClose = () => {
    setIsPopupVisible(false);
  };

  gameSocket.on("sentBoard", (board) => {
    console.log(board);
  });

  return (
    <div className="lobby-wrapper">
      <aside className="lobby-container">
        <button
          className="back-to-home"
          onClick={() => (window.location.href = '/')} 
        >
          <img src="../src/assets/Menu/Buttons/Help_Settings_Exit.png" alt="Back to Home" />
        </button>

        <div className="queue">
          <QueueComponent />
        </div>

        <div className="queue-button-container">
          <QueueButton />
          <img
            src="../src/assets/Menu/Buttons/Button_Join.png"
            alt="Join Queue"
            className="join-button-overlay"
            onClick={handleJoinClick}
          />
        </div>

        <div className="debug-game-button">
          <GameButton />
        </div>

        <div>
          <main className="right-container">
            <div className="gameboardBox">{/* <Gameboard /> */}</div>
          </main>

          {isPopupVisible && (
            <PickPlayerPopUp
              queue={queue}
              currentUser={currentUser}
              onOpponentSelect={handleOpponentSelect}
              onClose={handlePopupClose}
            />
          )}

          <div>
            <div>
              <SpectateGameboard board={board} currentPlayer={currentPlayer} />
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default Lobby;
