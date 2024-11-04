import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/connectPopup.css";
import "../styles/gameButton.css";

const GameButton = () =>  {
  const navigate = useNavigate(); // Initialize navigate

function JoinGame() {
    navigate('/game');
}

  return (
    <>
        <div className="nav-button">
            <button onClick ={JoinGame}>Navigate to Game Debug</button>
        </div>
    </>
  );
}

export default GameButton