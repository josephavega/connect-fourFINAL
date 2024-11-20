import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/connectPopup.css";
import gameSocket from '../sockets/gameSocket';
import '../styles/debugButton.css';

const DebugGameButtons = () => {

  const [username, setUsername] = useState('');
  const [sessionID, setSessionID] = useState(null);
  const [serverUsername, setServerUsername] = useState('');
  const [board, setBoard] = useState('');
  const [gameStatus, setGameStatus] = useState(''); // Added for game status

  useEffect(() => {
    // Listen for board data from the server
    gameSocket.on('sentBoard', (board) => {
      setBoard(board);
      console.log('Board updated:', board);
    });

    // Listen for game status data from the server
  // Listen for game status data from the server
  gameSocket.on('sentGameStatus', (status) => {
    if (status) {
      const { red_player, yellow_player, gamemode, currentPlayer } = status;
      setGameStatus(status);
      console.log(`Game Status: \nRed: ${red_player}\nYellow: ${yellow_player}\nGamemode: ${gamemode}\nCurrent: ${currentPlayer}`);
    } else {
      console.error("Received undefined game status");
    }
  });

    return () => {
      // Cleanup listeners when component unmounts
      gameSocket.off('sentBoard');
      gameSocket.off('sentGameStatus');
    };
  }, []);

  // Function to join a specific team
  function joinTeam() {
    const localUsername = localStorage.getItem('username');
    const localSessionID = localStorage.getItem('sessionID');

    if (!localUsername || !localSessionID) {
      console.error("No username or sessionID found in local storage.");
      return;
    }

    const data = { localSessionID, localUsername }

    gameSocket.emit('joinGame', data);
    console.log(`Joining game with username: ${localUsername}`);
  }

  // Function to create a new game (emit event to server)
  function createGame() {
    console.log("Requesting game creation...");
    const data = { gameType: 'standard' }; // You can adjust this value based on game type requirements
    gameSocket.emit('createGame', data);
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
  }

  // Function to get the game status from the server
  function getGameStatus() {
    console.log("Requesting game status...");
    gameSocket.emit('getGameStatus');
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

  return (
    <>
      <div className="dev-button">
        <button onClick={() => joinTeam(0)}>Join Red</button>
        <button onClick={updateData}>Update Server Data Debug</button>
        <button onClick={() => joinTeam(1)}>Join Yellow</button>
        <button onClick={fetchBoard}>Fetch Board</button>
        <button onClick={createGame}>Create Game</button>
        <button onClick={getGameStatus}>Get Game Status</button>
      </div>
      <div className="dev-data">
        <p>Local Username: {username}</p>
        <p>Session ID: {sessionID}</p>
        <p>Server Username: {serverUsername}</p>
        <p>Board: {JSON.stringify(board)}</p>
        <p>Game Status: {JSON.stringify(gameStatus)}</p>
      </div>
    </>
  );
};

export default DebugGameButtons;
