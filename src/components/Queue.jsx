import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import '../styles/queue.css';

const Queue = ({ }) => {
  const [queue, setQueue] = useState([]);
  
  // Setting up the socket connection
  useEffect(() => {
    const socket = io('http://localhost:3000'); // Replace with your server's URL if necessary

    // Event listener for real-time queue updates
    socket.on('queueUpdated', (updatedQueue) => {
      console.log('Queue updated via WebSocket:', updatedQueue);
      setQueue(updatedQueue);
    });

    // Clean up the socket connection when the component unmounts
    return () => {
      socket.disconnect();
    };
  }, []);

  // Function to fetch initial queue data when the component mounts
  useEffect(() => {
    async function fetchQueueData() {
      try {
        const response = await fetch('http://localhost:3000/queue');
        if (response.ok) {
          const data = await response.json();
          setQueue(data.users);
        } else {
          console.error('Error fetching initial queue:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching initial queue:', error);
      }
    }
    fetchQueueData();
  }, []);


  return <>
  <div className="queue-container">
      <h2>Queue</h2>
      <div className="queue-table">
        <table>
          <thead>
            <tr>
              <th>Username</th>
              <th>Game Type</th>
            </tr>
          </thead>
          <tbody>
            {queue.map((player, index) => (
              <tr key={index}>
                <td>{player.username}</td>
                <td>{player.gameType === 'classic' ? 'Classic' : 'Arcade'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </>

};

export default Queue;
