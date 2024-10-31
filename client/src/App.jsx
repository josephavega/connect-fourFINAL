import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import queueSocket from './sockets/queueSocket';
import gameSocket from './sockets/gameSocket';

import { v4 as uuidv4 } from 'uuid'; // Use a library like uuid to generate unique IDs


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

      let sessionID = localStorage.getItem('sessionID');
      if (!sessionID) {
        sessionID = uuidv4(); // Generate unique session ID
        localStorage.setItem('sessionID', sessionID);
      }
  
      // Log the session ID for debugging purposes
      console.log("Generated Session ID: ", sessionID);
  

    queueSocket.emit("message", "Sending on the queue!");
    gameSocket.emit("message", "Sending on the game!");
    
    return () => {
      queueSocket.off('message');
      gameSocket.off('message');
    };
  }, []);

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
