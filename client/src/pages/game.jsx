import React, { useEffect, useState } from "react";
import GameBoard from "../components/Gameboard";
import "../styles/game.css";
import gameSocket from "../sockets/gameSocket";
import VictoryPopup from "../components/VictoryPopup";
import DebugGameButtons from "../components/DebugGameButtons";

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

  const togglePlayer = () => {
    setCurrentPlayer((prevPlayer) => (prevPlayer === "Red" ? "Yellow" : "Red"));
  };

  // useEffect(() => {
  //   const socket = gameSocket;

  //   const handleInstructions = (moves) => {
  //     setBoard((prevBoard) => {
  //       const updatedBoard = prevBoard.map((row) => [...row]);
  //     moves.forEach((instruction) => {
  //       const [rule, col, row, type] = instruction;
  //       switch (rule) {
  //           case 'Place':
  //             updatedBoard[col][row] = type
  //             break;
  //           case 'Anvil':
  //             //Play Anvil animation
  //             break;
  //           case 'Broken':
  //             updatedBoard[col][row] = type
  //             break;
  //           case 'Lightning':
  //             //Play Lightning Animation
  //             break;
  //           case 'Flipped':
  //             updatedBoard[col][row] = type
  //             break;
  //           case 'Win':
  //           openVictoryPopup()
  //           break;

  //         }
  //       });
  //       return updatedBoard;
  //     });

  //     togglePlayer(); // Switch the player after processing instructions
  //   };

  //   gameSocket.on('sendInstructions', handleInstructions);

  //   return () => {
  //     gameSocket.off('sendInstructions', handleInstructions); // Cleanup listener
  //   };
  // }, []);

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

    // If there is no empty row, the column is full
    // if (lowestEmptyRow === -1) {
    //   console.log(`Column ${colIndex} is full.`);
    //   return; // Exit function if column is full
    // }

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

  const handleConfirm = () => {
    console.log("Confirming move...");
    if (!selectedMove) {
      console.log("No move selected. Exiting.");
      return;
    }

    console.log("Selected move:", selectedMove);

    // const { row, col } = selectedMove;
    // const chipColor = currentPlayer === 'Red' ? 'R' : 'Y';

    // // Update the board with the selected move
    // const updatedBoard = board.map((r, rIdx) =>
    //   r.map((cell, cIdx) => (rIdx === row && cIdx === col ? chipColor : cell))
    // );
    // setBoard(updatedBoard);

    // Emit the move to the server
    handleMove(selectedColumn);

    // Mark the active power-up as used
    if (currentPlayer === "Red" && redActiveButton) {
      console.log(`Using Red Power-Up: ${redActiveButton}`);
      setUsedRedPowerups((prev) => ({ ...prev, [redActiveButton]: true }));
      //if anvil

      //if lightning

      //if brick

      setRedActiveButton(null); // Clear active power-up
    } else if (currentPlayer === "Yellow" && yellowActiveButton) {
      console.log(`Using Yellow Power-Up: ${yellowActiveButton}`);
      setUsedYellowPowerups((prev) => ({
        ...prev,
        [yellowActiveButton]: true,
      }));
      //if anvil

      //if lightning

      //if brick

      setYellowActiveButton(null); // Clear active power-up
    }

    // Reset the selected move and toggle player
    console.log("Resetting move...");
    setSelectedMove(null);
    setSelectedColumn(null);
    console.log("Toggling player...");
    togglePlayer();
  };

  return (
    <div className="game-wrapper">
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
      <p></p>
      <button
        className={`confirm-button ${currentPlayer.toLowerCase()}`}
        onClick={handleConfirm}
        disabled={!selectedMove}
      >
        Confirm Move
      </button>
      <div className="click-info">
        <p>Tile Selected: {lastChanged}</p>
        <p>Column Selected: {selectedColumn + 1}</p>
        <p>Current Player: {currentPlayer}</p>
      </div>

      <button
        className={`player-toggle-button ${currentPlayer.toLowerCase()}`}
        onClick={togglePlayer}
      >
        Switch Player Debug
      </button>
      <button>
        <DebugGameButtons />
      </button>
      <button className="victory-debug-button" onClick={openVictoryPopup}>
        Victory Debug
      </button>
      {/* Victory Popup */}
      {isVictoryPopupOpen && <VictoryPopup />}
    </div>
  );
};

export default Game;
