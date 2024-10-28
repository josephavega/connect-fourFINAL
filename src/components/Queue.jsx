import React from 'react';
import useQueue from '../hooks/useQueue.js';
import '../styles/Queue.css';

const Queue = ({ }) => {
  const { users } = useQueue();

  return(
    <div className="queue-container">
    <h2>Leaderboard</h2>
    <div className="queue-table">
      <table>
        <thead>
          <tr>
            <th>Username</th>
          </tr>
        </thead>
        <tbody>
          {players.map((player, index) => (
            <tr key={index}>
              <td>{player.username}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    
  </div>
  );
};

export default Queue;
