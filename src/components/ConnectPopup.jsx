import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/connectPopup.css";

const ConnectPopup = ({ onClose }) => {
  const [username, setUsername] = useState('');

  const navigate = useNavigate(); // Initialize navigate

  const joinQueue = () => {
    if (username) {
      // Make API request to join the queue
      fetch('http://localhost:3000/joinQueue', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
      })
        .then(response => {
          if (!response.ok) {
            throw new Error(`Server error: ${response.statusText}`);
          }
          return response.json();
        })
        .then(data => {
          console.log('Join Queue Response:', data);
          alert(`${username} has joined the queue.`);
          onClose(); // Close the popup after adding the player
          navigate('/lobby'); // Navigate to the lobby page only after successful join
        })
        .catch(error => {
          console.error('Error joining queue:', error);
        });
    } else {
      alert('Please enter a username.');
    }
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
