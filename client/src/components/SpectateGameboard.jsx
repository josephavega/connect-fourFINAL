import React, { useState, useEffect } from "react";
import { Grid2 } from "@mui/material";
import "../styles/gameboard.css";
import TopGrid from "../components/TopGrid.jsx";

import EmptyChip from "../../../public/Board/BoardTileBack.png";
import RedChip from "../../../public/Board/Gamepieces/Chip_Red.png";
import YellowChip from "../../../public/Board/Gamepieces/Chip_Yellow.png";

import BoardTileFront from "../../../public/Board/BoardTileFront.png";
import gameSocket from "../sockets/gameSocket.js";
import BoardBorder from "../../../public/Board/Board_Boarder.png";

import RedSidebarBackground from "../../../public/Board/Construction/Sidebar_Red.png";
import YellowSidebarBackground from "../../../public/Board/Construction/Sidebar_Yellow.png";

const SpectateGameboard = ({ board, currentPlayer }) => {
  const [username, setUsername] = useState("AI1");
  const [usernameB, setUsernameB] = useState("AI2");

  useEffect(() => {}, []);

  const createMainGrid = () => {
    const rows = 6;
    const cols = 7;
    const grid = [];

    for (let i = 0; i < rows; i++) {
      const rowTiles = [];
      for (let j = 0; j < cols; j++) {
        let chipType;
        if (board[i][j] === "R") {
          chipType = RedChip;
        } else if (board[i][j] === "Y") {
          chipType = YellowChip;
        } else {
          chipType = EmptyChip;
        }

        rowTiles.push(
          <Grid2 item key={`${i}-${j}`} className="tile-container">
            <div className="tile">
              <img src={chipType} alt="Tile Chip" className="tile-back" />
              <img
                src={BoardTileFront}
                alt="Tile Front"
                className="tile-front"
              />
            </div>
          </Grid2>
        );
      }

      grid.push(
        <Grid2 container key={`row-${i}`} className="row" columns={7}>
          {rowTiles}
        </Grid2>
      );
    }

    return grid;
  };

  return (
    <div className="gameboard-container">
      {/* LEFT */}
      <div>
        {/* RED SIDEBAR */}
        <div className="red-sidebar">
          <img
            src={RedSidebarBackground}
            alt="Sidebar Background"
            className="red-sidebar-background"
          />
          <div className="red-sidebar-content">
            {/* Red Username */}
            <div className="red-sidebar-text">{username}</div>
          </div>
        </div>
      </div>

      {/* MIDDLE */}
      <div>
        {/* TOP GRID */}
        <div className="top-grid">
          <p></p>
        </div>

        {/* GAMEBOARD */}
        <div className="gameboard-wrapper">
          <img src={BoardBorder} alt="Board Border" className="board-border" />
          <div className="gameboard"> {createMainGrid()} </div>
        </div>
      </div>

      {/* RIGHT */}
      <div>
        {/* YELLOW SIDEBAR */}
        <div className="yellow-sidebar">
          <img
            src={YellowSidebarBackground}
            alt="Sidebar Background"
            className="yellow-sidebar-background"
          />
          <div className="yellow-sidebar-content">
            {/* Yellow Username */}
            <div className="yellow-sidebar-text">{usernameB}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpectateGameboard;
