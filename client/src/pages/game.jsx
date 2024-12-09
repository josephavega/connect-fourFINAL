import React, { useEffect, useState } from "react";
import GameBoard from "../components/Gameboard";
import "../styles/game.css";
import gameSocket from "../sockets/gameSocket";
import VictoryPopup from "../components/VictoryPopup";
import DebugGameButtons from "../components/DebugGameButtons";
import Background from "../../../public/Forest16_9.png";

const Game = () => {
  const [board, setBoard] = useState(
    Array(6)
      .fill(null)
      .map(() => Array(7).fill("EmptyChip"))
  );
  const [lastChanged, setChanged] = useState("None");
  const [isVictoryPopupOpen, setVictoryPopupOpen] = useState(false);
  const [gameStatus, setGameStatus] = useState("");

  const [currentPlayer, setCurrentPlayer] = useState("Red"); // Track the current player

  const [selectedMove, setSelectedMove] = useState(null);
  const [selectedColumn, setSelectedColumn] = useState(null); // Track the currently clicked column
  const [redActiveButton, setRedActiveButton] = useState(null);
  const [yellowActiveButton, setYellowActiveButton] = useState(null);

  const [usedRedPowerups, setUsedRedPowerups] = useState({
    anvil: false,
    lightning: false,
    brick: false,
  });

  const [usedYellowPowerups, setUsedYellowPowerups] = useState({
    anvil: false,
    lightning: false,
    brick: false,
  });

  const sessionID = localStorage.getItem("sessionID");
  const [activePowerup, setActivePowerup] = useState(null); // Track active power-up

  const openVictoryPopup = () => setVictoryPopupOpen(true);

  useEffect(() => {
    // Listen for board data from the server
    gameSocket.connect();

    gameSocket.on("gameOver", (data) => {
      const winner = data;
      console.log(`${winner} won the match!`);
      setVictoryPopupOpen("true");
      gameSocket.emit("resetGame");
    });

    gameSocket.on("sentBoard", (board) => {
      // Flip the board using a manual loop to create a new flipped board
      const flippedBoard = [];
      for (let i = board.length - 1; i >= 0; i--) {
        flippedBoard.push(board[i]);
      }
      setBoard(flippedBoard);
      console.log("Board updated:", flippedBoard);
    });

    // Listen for game status data from the server
    gameSocket.on("sentGameStatus", (status) => {
      if (status) {
        setGameStatus(status);
        console.log(
          `Game Status: \nRed Player: ${JSON.stringify(
            status.red_player,
            null,
            2
          )}\nYellow Player: ${JSON.stringify(
            status.yellow_player,
            null,
            2
          )}\nGamemode: ${status.gamemode}\nCurrent Player: ${JSON.stringify(
            status.currentPlayer,
            null,
            2
          )}`
        );
      } else {
        console.error("Received undefined game status");
      }
    });

    return () => {
      // Cleanup listeners when component unmounts
      gameSocket.off("sentBoard");
      gameSocket.off("sentGameStatus");
    };
  }, []);

  const handleClick = (rowIndex, colIndex) => {
    // Corrected: Find the lowest empty row in the selected column
    let lowestEmptyRow = -1;

    // Assuming that board[row][col] is the correct representation
    for (let i = board.length - 1; i >= 0; i--) {
      if (board[i][colIndex] === "EmptyChip") {
        lowestEmptyRow = i;
        break;
      }
    }

    console.log(`Move selected at row ${lowestEmptyRow}, column ${colIndex}`);
    setSelectedMove({ row: lowestEmptyRow, col: colIndex }); // Store the move
    setSelectedColumn(colIndex); // Highlight the selected column
    setChanged(`Row ${lowestEmptyRow + 1}, Column ${colIndex + 1}`); // Update last changed info
  };
  function handleMove(colIndex) {
    const sessionID = localStorage.getItem("sessionID");
    const username = localStorage.getItem("username");
    const data = { colIndex, sessionID, username };

    gameSocket.emit("playerMove", data);
    gameSocket.emit("getBoard");
  }

  function handleRedPowerup(colIndex, powerupUsed) {
    const sessionID = localStorage.getItem("sessionID");
    const username = localStorage.getItem("username");
    const data = { colIndex, powerupUsed, sessionID, username };

    gameSocket.emit("playerPowerMove", data);
    gameSocket.emit("getBoard");
  }

  const handleConfirm = () => {
    console.log("Confirming move...");
    if (!selectedMove) {
      console.log("No move selected. Exiting.");
      return;
    }

    console.log("Selected move:", selectedMove);

    if (currentPlayer === "Red") {
      if (redActiveButton != null && redActiveButton === "brick") {
        console.log(`Using Red Power-Up: ${redActiveButton}`);
        gameSocket.emit("playerPowerMove", {
          colIndex: selectedColumn,
          powerupUsed: "brick",
          sessionID: localStorage.getItem("sessionID"),
          username: localStorage.getItem("username"),
        });
        // for now: handleRedPowerup(selectedColumn, redActiveButton);
        gameSocket.emit("getBoard");
        setUsedRedPowerups((prev) => ({ ...prev, [redActiveButton]: true }));
        setRedActiveButton(null); // Clear active power-up
      } else {
        handleMove(selectedColumn);
      }
    } else if (currentPlayer === "Yellow") {
      handleMove(selectedColumn);
    }
    {
      /* 
    else if (currentPlayer === "Yellow" && yellowActiveButton) {
      console.log(`Using Yellow Power-Up: ${yellowActiveButton}`);
      setUsedYellowPowerups((prev) => ({...prev, [yellowActiveButton]: true }));
      setYellowActiveButton(null); // Clear active power-up
    }
      */
    }

    // Reset the selected move and toggle player
    console.log("Resetting move...");
    setSelectedMove(null);
    setSelectedColumn(null);
    console.log("Toggling player...");
  };

  return (
    <div
      className="game-wrapper"
      style={{
        backgroundImage: `url(${Background})`,
        backgroundSize: "cover", // Ensures the image covers the entire background
        backgroundPosition: "center", // Centers the image
        height: "100vh", // Ensures the div takes the full height of the viewport
        width: "100vw", // Ensures the div takes the full width of the viewport
      }}
    >
      <GameBoard
        board={board}
        onClick={handleClick}
        currentPlayer={currentPlayer}
        selectedColumn={selectedColumn}
        redActiveButton={redActiveButton}
        yellowActiveButton={yellowActiveButton}
        setRedActiveButton={setRedActiveButton}
        setYellowActiveButton={setYellowActiveButton}
      />
      <button
        className={`confirm-button ${currentPlayer.toLowerCase()}`}
        onClick={handleConfirm}
        disabled={!selectedMove}
        style={{
          position: "absolute",
          top: "80%",
        }}
      >
        Confirm Move
      </button>

      {isVictoryPopupOpen && <VictoryPopup />}
    </div>
  );
};

export default Game;
