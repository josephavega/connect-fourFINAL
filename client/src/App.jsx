import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { io } from 'socket.io-client';


// Page Imports
import Homepage from './pages/Home';
import Spectate from './pages/Spectate';
import Game from './pages/Game';
import Lobby from './pages/Lobby'; 

// Optional Global Styles
// import '../styles/global.css';

const App = () => {
  const [socket, setSocket] = useState(null); // Manage the socket state

  useEffect(() => {
    // Retrieve sessionID or create a new one if not exists
    let sessionID = localStorage.getItem('sessionID');
    if (!sessionID) {
      sessionID = `session_${Math.random().toString(36).substr(2, 9)}`; // Simple unique ID generation
      localStorage.setItem('sessionID', sessionID);
    }
  })

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/game" element={<Game />} /> 
        <Route path="/lobby" element={<Lobby />} />
        <Route path="/spectate" element={<Spectate />} />
      </Routes>
    </Router>
  );
};

export default App;   
