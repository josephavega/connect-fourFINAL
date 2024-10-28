import React from 'react';
import useQueue from '../hooks/useQueue.js';
import '../styles/Queue.css';

const Queue = ({ }) => {
  const { queue, addPlayer, removePlayer } = useQueue();

  return(
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
      <button onClick={removePlayer} className="remove-btn">Remove First Player</button>
    </div>
  );
};

export default Queue;
