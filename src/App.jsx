import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Homepage from './pages/Home';
import Spectate from './pages/Spectate';
import Game from './pages/Game';
import Lobby from './pages/Lobby'; 
import Queue from './components/Queue';
//import '../styles/global.css';

const App = () => {
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

