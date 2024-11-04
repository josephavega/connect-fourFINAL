
import React from 'react';
import '../styles/Leaderboard.css';

const Leaderboard = ({ players }) => {
  return (
    <div className="leaderboard-container">
      <h2>Leaderboard</h2>
      <div className="leaderboard-table">
        <table>
          <thead>
            <tr>
              <th>Username</th>
              <th>Games Won</th>
              <th>Games Lost</th>
            </tr>
          </thead>
          <tbody>
            {players.map((player, index) => (
              <tr key={index}>
                <td>{player.username}</td>
                <td>{player.gamesWon}</td>
                <td>{player.gamesLost}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leaderboard;