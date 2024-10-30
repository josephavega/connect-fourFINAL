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


    // Set up the socket connection using sessionID
    const newSocket = io('http://localhost:3000', {
      query: { sessionID },
    });

    setSocket(newSocket);

    // Heartbeat to ensure client is connected
    const heartbeatInterval = setInterval(() => {
      if (newSocket && newSocket.connected) {
        newSocket.emit('heartbeat', sessionID);
        console.log('Heartbeat emitted');
      }
    }, 5000);

    // Handle tab/browser close to clean up gracefully
    const handleBeforeUnload = () => {
      if (newSocket) {
        newSocket.emit('beforeDisconnect', sessionID);
      }
    };

    // Add event listener for tab/browser close
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Cleanup function for component unmount
    return () => {
      clearInterval(heartbeatInterval);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      newSocket.disconnect();
    };
  }, []); // Empty dependency array means this runs only once when the app mounts

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
