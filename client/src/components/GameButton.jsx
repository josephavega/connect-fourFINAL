import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import gameSocket from "../sockets/gameSocket";
import queueSocket from "../sockets/queueSocket";
import "../styles/connectPopup.css";
import "../styles/gameButton.css";

const GameButton = () => {
  const navigate = useNavigate(); // Initialize navigate

  function JoinGame() {
    gameSocket.connect;
    const localUsername = localStorage.getItem("username");
    const sessionID = localStorage.getItem("sessionID");
    const data = { sessionID, localUsername };
    queueSocket.emit("leaveQueue", sessionID);
    gameSocket.emit("joinGame", data);

    navigate("/game");
  }

  return (
    <>
      <div className="nav-button">
        <button onClick={JoinGame}>Navigate to Game Debug</button>
      </div>
    </>
  );
};

export default GameButton;
