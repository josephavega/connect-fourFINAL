import React, { useState, useEffect } from 'react';
import '../styles/Leaderboard.css';
import { DataGrid } from '@mui/x-data-grid';

const Leaderboard = () => {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
  
    fetch('https://localhost:3000/leaderboard')
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setPlayers(data);
      })
      .catch((error) => {
        console.error("Error fetching player data:", error);
      });
  }, []);

  const columns = [
    { field: 'username', headerName: 'Username', width: 150 },
    { field: 'wins', headerName: 'Wins', width: 100 },
    { field: 'losses', headerName: 'Losses', width: 100 }
  ];

  return (
    <div className="leaderboard-container" style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={players}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        disableSelectionOnClick
      />
    </div>
  );
};

export default Leaderboard;