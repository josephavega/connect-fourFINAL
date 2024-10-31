import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/connectPopup.css";
import queueSocket from '../sockets/queueSocket';
import gameSocket from '../sockets/gameSocket';
import { v4 as uuidv4 } from 'uuid'; // Use a library like uuid to generate unique IDs

const ConnectPopup = ({ onClose }) => {
  const [username, setUsername] = useState('');
  const [socket, setSocket] = useState(null); // State for socket instance
  const navigate = useNavigate(); // Initialize navigate



  const joinQueue = () => {
    if (username.trim() === '') {
      alert('Please enter a username.');
      return;
    }

    const sessionID = localStorage.getItem('sessionID');

    // Emit join queue event through socket
    
      queueSocket.emit('joinQueue', { username, sessionID });

      // Listen for the server's response
      queueSocket.on('joinQueueResponse', (data) => {
        if (data.success) {
          console.log('Join Queue Response:', data);
          localStorage.setItem('username', username);
          alert(`${username} has joined the queue.`);
          onClose(); // Close the popup after adding the player
          navigate('/lobby'); // Navigate to the lobby page only after successful join
        } else {
          alert(`Failed to join queue: ${data.message}`);
        }
      });
    
  };
  return (
    <div className="connect-popup-overlay">
      <div className="connect-popup">
        <div className="popup-header">
          <h2>Start a Game</h2>
          <button className="close-btn" onClick={onClose}>X</button>
        </div>
        <div className="popup-content">
          <label>
            Username:
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
            />
          </label>
          <button onClick={joinQueue} className="start-btn">
            Join Queue
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConnectPopup;
