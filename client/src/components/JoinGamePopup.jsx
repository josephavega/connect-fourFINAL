import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/connectPopup.css";
import { v4 as uuidv4 } from 'uuid'; // Use a library like uuid to generate unique IDs

const JoinGamePopup = ({ onClose }) => {
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve sessionID or create a new one if it doesn't exist
    let sessionID = localStorage.getItem('sessionID');
    if (!sessionID) {
      sessionID = uuidv4;
      localStorage.setItem('sessionID', sessionID);
    }

    // Check if user is already in the queue using a GET request with fetch
    fetch(`http://localhost:3000/game/joinGame`)
      .then((response) => {
        if (!response.ok) {
          // Throw an error if response is not successful
          throw new Error('Failed to check queue status: ' + response.statusText);
        }
        return response.json();
      })
      .then((data) => {
        if (data) {
          navigate('/game'); // Navigate directly to the lobby if user is already in the queue
          onClose();
        }
      })
      .catch((error) => {
        console.error('Error joining game');
      });
  }, [navigate, onClose]);

  const joinGame= () => {
    const sessionID = localStorage.getItem('sessionID');

    if (username.trim() === '' || username.length !== 3) {
      alert('Username must be exactly 3 characters long.');
      return;
    }

    // Send API request to join the queue using fetch
    fetch('http://localhost:3000/queue/joinQueue', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sessionID, username }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to join queue: ' + response.statusText);
        }
        return response.json();
      })
      .then((data) => {
        if (data.success) {
          localStorage.setItem('username', username);
          navigate('/lobby'); // Navigate to the lobby page after successful join
          onClose();
        } else {
          console.error(data.message);
          alert(`Failed to join queue: ${data.message}`);
        }
      })
      .catch((error) => {
        console.error('Error joining queue:', error);
        alert('An error occurred while attempting to join the queue.');
      });
  };

  return (
    <div className="connect-join-game-overlay">
      <div className="joingame-popup">
        <div className="popup-header">
          <h2>Start a Game</h2>
          <button className="close-btn" onClick={onClose}>X</button>
        </div>
        <div className="joingame-content">
          <label>
            Username:
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value.toUpperCase())}
              placeholder="Enter your username"
              maxLength="3"
            />
          </label>
          <button onClick={joinGame} className="start-btn">
            Join Game
          </button>
        </div>
      </div>
    </div>
  );
};

export default JoinGamePopup;
