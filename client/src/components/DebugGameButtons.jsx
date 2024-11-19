import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import "../styles/connectPopup.css";
import gameSocket from '../sockets/gameSocket';
import '../styles/debugButton.css';

const DebugGameButtons = () => {

  const [username, setUsername] = useState('');
  const [sessionID, setSessionID] = useState(null);
  const [serverUsername, setServerUsername] = useState('');
  const [board, setBoard] = useState('');

  // Function to join a specific team
  function joinTeam(team) {
    const localUsername = localStorage.getItem('username');
    const localSessionID = localStorage.getItem('sessionID');
    
    if (!localUsername || !localSessionID) {
      console.error("No username or sessionID found in local storage.");
      return;
    }

    const data = {
      username: localUsername,
      color: team === 0 ? 'Red' : 'Yellow',
      sessionID: localSessionID 
    };
    
    gameSocket.emit('joinGame', data);
    console.log(`Joining ${data.color} team with username: ${localUsername}`);
  }

  // Function to create a new board (emit event to server)
  function newBoard() {
    console.log("Requesting new board from the server...");
    gameSocket.emit('newBoard'); // Assuming there's an event on the server to create a new board
  }

  // Function to fetch the current board from the server
  function fetchBoard() {
    console.log("Requesting board data...");
    gameSocket.emit('getBoard');
    gameSocket.on('sentBoard', board => {
        setBoard(board);
        console.log('Fetched Board Data');
    })
  }

  // Function to update data in the debug component
  function updateData() {
    const localUsername = localStorage.getItem('username');
    const localSessionID = localStorage.getItem('sessionID');

    setUsername(localUsername);
    setSessionID(localSessionID);

    // Fetch user data from the server using the session ID
    if (localSessionID) {
      fetch(`http://localhost:3000/queue/getUsername/${localSessionID}`)
        .then(response => {
          if (!response.ok) {
            throw new Error(`Server error: ${response.statusText}`);
          }
          return response.json();
        })
        .then(data => {
          setServerUsername(data.username || 'Unknown');
        })
        .catch(error => {
          console.error('Error retrieving server data:', error);
          setServerUsername('Error retrieving username');
        });
    }
  }

  // Listen for the updated board from the server
  gameSocket.on('sentBoard', (board) => {
    setBoard(board);
    console.log('Board updated:', board);
    
  });

  return (
    <>
      <div className="dev-button">
        <button onClick={() => joinTeam(0)}>Join Red</button>
        <button onClick={updateData}>Update Server Data Debug</button>
        <button onClick={() => joinTeam(1)}>Join Yellow</button>
        <button onClick={fetchBoard}>Fetch Board</button>
      </div>
      <div className="dev-data">
        <p>Local Username: {username}</p>
        <p>Session ID: {sessionID}</p>
        <p>Server Username: {serverUsername}</p>
        <p>Board: {JSON.stringify(board)}</p>
      </div>
    </>
  );
};

export default DebugGameButtons;
