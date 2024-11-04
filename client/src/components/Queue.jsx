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

    // Set up socket connection for real-time queue updates
    const socket = io('http://localhost:3000'); // Replace with your server's URL if necessary

    // Event listener for real-time queue updates
    socket.on('queueUpdated', (updatedQueue) => {
      console.log('Queue updated via WebSocket:', updatedQueue); // Log updated queue
      setQueue(updatedQueue || []); // Update queue state, log the state
    });

    // Clean up the socket connection when the component unmounts
    return () => {
      socket.disconnect();
    };
  }, []); // Empty dependency array means this runs only once when component mounts

  useEffect(() => {
    console.log('Queue state updated:', queue); // Log whenever queue state updates
  }, [queue]);

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
