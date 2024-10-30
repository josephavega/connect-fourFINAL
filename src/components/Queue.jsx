import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import '../styles/queue.css';

const Queue = () => {
  const [queue, setQueue] = useState([]); // Initialize as an empty array to avoid undefined

  useEffect(() => {
    // Fetch initial queue data on component mount
    async function fetchQueueData() {
      try {
        const response = await fetch('http://localhost:3000/queue');
        if (response.ok) {
          const data = await response.json();
          console.log('Initial Queue Data:', data.users); // Log fetched data
          setQueue(data.users || []); // Set queue state, log the state
        } else {
          console.error('Error fetching initial queue:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching initial queue:', error);
      }
    }

    fetchQueueData();

  });


  // Create the list of players dynamically using map
  const queueList = queue.length > 0 ? (
    queue.map((player, index) => (
      <li key={index}>{player}</li>
    ))
  ) : (
    <li>No players in the queue</li>
  );

  return (
    <div className="queue-container">
      <h2>Queue</h2>
      <div className="queue-table">
        <ul>
          {queueList}
        </ul>
      </div>
    </div>
  );
};

export default Queue;
