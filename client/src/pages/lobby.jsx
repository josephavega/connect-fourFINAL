import React, { useState, useEffect } from "react";
import QueueComponent from "../components/Queue";
import QueueButton from "../components/QueueButton";
import DebugButton from "../components/DebugButton";
import GameButton from "../components/GameButton";
import PickPlayerPopUp from "../components/PickPlayerPopUp";
import queueSocket from "../sockets/queueSocket";
import gameSocket from "../sockets/gameSocket";
import "../styles/lobby.css";
import { useNavigate } from "react-router-dom";

const Lobby = () => {
  const [view, setView] = useState("queue");
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [queue, setQueue] = useState([]);
  const [selectedOpponent, setSelectedOpponent] = useState("");
  const [usernameA, setUsernameA] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Get the username from local storage
    setUsernameA(localStorage.getItem("username") || "Guest");

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

    // Set up socket event listeners for game and queue
    queueSocket.on("queueUpdated", handleQueueUpdate);
    gameSocket.on("startGame", handleStartGame);

    queueSocket.on("promptStartGame", handlePromptPopup);

    return () => {
      // Clean up socket event listeners when the component is unmounted
      queueSocket.off("queueUpdated", handleQueueUpdate);
      gameSocket.off("startGame", handleStartGame);
    };
  }, [navigate]);

  const currentUser = usernameA;

  const handleJoinClick = () => {
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

  return (
    <div className="lobby-wrapper">
      <div className="lobby-container">
        <div className="queue">
          <QueueComponent />
          <div className="queue-button-container">
            <QueueButton />
          </div>
        </div>
        <div className="debug-game-button">
          <GameButton />
        </div>
      </div>

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
      <div>{/* <iframe src="url" title="description"></iframe> */}</div>
      <aside className="lobby-container">{/*<Spectate/>*/}</aside>
    </div>
  );
};

export default Lobby;
