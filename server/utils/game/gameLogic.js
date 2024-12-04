import AI from "./AI.js";
import Player from "./Player.js";

class GameLogic {
  constructor() {
    this.board = this.createBoard();
    this.player = [
      new Player(-1, "Red", "R", this),
      new Player(-1, "Yellow", "Y", this),
    ];
    this.currentPlayerIndex = 0;
    this.playerCount = 0;
    // this.ai = [new AI(10, "R"), new AI(4, "Y")]; // AI difficulty Medium
    this.ai = [];
    this.isAIvsAI = true;
    this.gameOver = true;
    this.isPlayerVsAI = false;
    this.moves = [];
    this.winner = "";

    //[Rule,Col,Row,Type]
    //Rule 'Place', 'Anvil', 'Broken', 'Lightning', 'Flipped', 'Brick', 'StoppedL','StoppedA', 'Win','Full'
    //Lightning for the inititial shock location
    //Anvil/Brick for column
    //Flipped for chips hit with the lightning
    //StoppedL for if Lightning hits a brick
    //StoppedA for if Anvil hits a brick
  }

  // Resets game state
  resetGame() {
    console.log("Resetting game...");
    this.board = this.createBoard();
    this.currentPlayerIndex = 0;
    this.player = [
      new Player(-1, "Red", "R", this),
      new Player(-1, "Yellow", "Y", this),
    ];
    this.isAIvsAI = false;
    this.isPlayerVsAI = false;
    this.gameOver = true;
    this.moves = [];
    this.winner = "";
    if (this.aiInterval) {
      clearInterval(this.aiInterval);
      this.aiInterval = null;
    }
  }

  getPlayers() {
    player_one = this.player[0];
    player_two = this.player[1];
    console.log(`Player One: ${player_one}, Player Two: ${player_two}`);
  }

  setPlayer(newPlayer) {
    this.player[this.playerCount % 2] = newPlayer;
    this.player[this.playerCount % 2] = this.playerCount % 2 === 0 ? "R" : "Y";
    this.playerCount++;
  }

  startAIVsAI(callback) {
    this.resetGame();

    this.isAIvsAI = true;
    this.gameOver = false;
    this.ai[0] = new AI(5, "R");
    this.ai[1] = new AI(5, "Y");
    this.player[0] = this.ai[0];
    this.player[1] = this.ai[1];
    this.currentPlayerIndex = 0;
    this.board = this.createBoard();
    this.runAIGame(callback);
  }

  startPlayerVsAI(callback) {
    console.log("Starting Player vs AI game...");

    this.board = this.createBoard();
    this.isPlayerVsAI = true;
    this.gameOver = false;
    this.currentPlayerIndex = 1;
    this.runPlayerVsAI(callback);
  }

  runPlayerVsAI(callback) {
    console.log("Running Player vs AI game...");

    if (typeof callback !== "function") {
      console.error("Invalid callback provided. It should be a function.");
      return;
    }
    const interval = setInterval(() => {
      console.log("AI is waiting to make a move...");

      console.log(this.getCurrentPlayer().color);
      if (this.getCurrentPlayer().color === "Y") {
        console.log("AI making move...");
        const move = this.player[1].bestMove(this.board, 5);
        this.placePiece(move);
      }
    }, 2000);

    // Simulate a player's move (you can hook this into your frontend)
    callback({ board: this.board, currentPlayer: "Player" });
  }

  runAIGame(callback) {
    console.log("Running AI vs. AI game...");

    const interval = setInterval(() => {
      if (this.gameOver) {
        clearInterval(interval); // Stop the game loop
        return;
      }
      if (this.isAIvsAI) {
        //this.aiMove(callback); // Perform AI mov
        let move = this.ai[this.currentPlayerIndex].bestMove(this.board, 5);
        this.placePiece(move);
      } else if (!this.isAIvsAI) {
        this.gameOver = true;
      } else if (this.checkWin()) {
        this.gameOver = true; // Mark game as over
        console.log(`Player ${this.getCurrentPlayer().color} wins!`);
        callback({
          board: this.board,
          winner: this.getCurrentPlayer(),
        });
        clearInterval(interval);
        setTimeout(() => {
          this.board = this.createBoard();
          setTimeout(() => {
            if (this.isAIvsAI) {
              this.startAIVsAI(callback);
            }
          }, 2000);
        }, 2000); // Delay in milliseconds (2000ms = 2 seconds)
      } else if (this.isBoardFull()) {
        this.gameOver = true; // Mark game as a draw
        console.log("The game is a draw!");
        callback({ board: this.board, message: "The game is a draw!" });
        clearInterval(interval);
      }
    }, 2000); // 2-second interval between moves
  }

  aiMove(callback) {
    if (this.isAIvsAI) {
      console.log("AI making move");
      const ai = this.ai[this.currentPlayerIndex];
      const move = ai.bestMove(this.board, ai.difficulty);
      console.log(
        `AI (${this.getCurrentPlayer().color}) is playing in column: ${move}`
      );

      if (move !== null) {
        this.placePiece(move);
        this.printBoard();
        if (this.checkWin) {
          this.createBoard();
        }
        callback({
          board: this.board,
          currentPlayer: this.getCurrentPlayer().color,
        });
      }
    } else {
      this.gameOver = true;
      console.log("AI vs AI game interrupted.");
    }
  }
  createBoard() {
    const rows = 6;
    const columns = 7;
    const board = Array.from({ length: rows }, () => Array(columns).fill(0));
    return board;
  }

  printBoard() {
    const rows = 6;
    const columns = 7;

    for (let row = rows - 1; row >= 0; row--) {
      let rowStr = "";
      for (let col = 0; col < columns; col++) {
        rowStr +=
          this.board[row][col] === 0 ? "[0]" : `[${this.board[row][col]}]`;
      }
      console.log(rowStr);
    }
    console.log("\n");
  }

  getFlippedBoard() {
    // Reverse the rows to "flip" the board upside down
    return this.board.slice().reverse();
  }

  placePiece(columnIndex) {
    // Bottom to top
    for (let row = 0; row < this.board.length; row++) {
      if (this.board[row][columnIndex] === 0) {
        this.board[row][columnIndex] = this.getCurrentPlayer().color;
        this.moves.push([
          "Place",
          row,
          columnIndex,
          this.getCurrentPlayer().color,
        ]);
        if (this.checkWin()) {
          this.gameOver = true;
          this.winner = this.getCurrentPlayer().color;
          console.log(`${this.winner} has won the game!`);
          // this.board = this.createBoard();
          return;
        }

        this.switchPlayer();
        return;
      }
    }
    console.log(`No valid moves available in this column. (${columnIndex})`);
  }

  getCurrentPlayer() {
    return this.player[this.currentPlayerIndex];
  }

  switchPlayer() {
    console.log(`Current Player: ${this.getCurrentPlayer().color}`);
    this.printBoard();
    this.currentPlayerIndex = (this.currentPlayerIndex + 1) % 2;
  }

  checkWin() {
    return (
      this.checkVerticalWin() ||
      this.checkHorizontalWin() ||
      this.checkDiagonalWin()
    );
  }

  checkVerticalWin() {
    const rows = this.board.length;
    const columns = this.board[0].length;

    for (let col = 0; col < columns; col++) {
      let winningMoves = [];
      for (let row = 0; row < rows; row++) {
        if (this.board[row][col] === this.getCurrentPlayer().color) {
          winningMoves.push([row, col]);
          if (winningMoves.length === 4) {
            for (let move of winningMoves) {
              this.moves.push([
                "Win",
                move[0],
                move[1],
                this.getCurrentPlayer().color,
              ]);
            }
            return true;
          }
        } else {
          winningMoves = [];
        }
      }
    }
    return false;
  }

  checkHorizontalWin() {
    const rows = this.board.length;
    const columns = this.board[0].length;

    for (let row = 0; row < rows; row++) {
      let winningMoves = [];
      for (let col = 0; col < columns; col++) {
        if (this.board[row][col] === this.getCurrentPlayer().color) {
          winningMoves.push([row, col]);
          if (winningMoves.length === 4) {
            for (let move of winningMoves) {
              this.moves.push([
                "Win",
                move[0],
                move[1],
                this.getCurrentPlayer().color,
              ]);
            }
            return true;
          }
        } else {
          winningMoves = [];
        }
      }
    }
    return false;
  }

  checkDiagonalWin() {
    const rows = this.board.length;
    const columns = this.board[0].length;

    // Left to right diagonal
    for (let row = 0; row < rows - 3; row++) {
      for (let col = 0; col < columns - 3; col++) {
        if (
          this.board[row][col] === this.getCurrentPlayer() &&
          this.board[row + 1][col + 1] === this.getCurrentPlayer().color &&
          this.board[row + 2][col + 2] === this.getCurrentPlayer().color &&
          this.board[row + 3][col + 3] === this.getCurrentPlayer().color
        ) {
          this.moves.push(["Win", row, col, this.getCurrentPlayer().color]);
          this.moves.push([
            "Win",
            row + 1,
            col + 1,
            this.getCurrentPlayer().color,
          ]);
          this.moves.push([
            "Win",
            row + 2,
            col + 2,
            this.getCurrentPlayer().color,
          ]);
          this.moves.push([
            "Win",
            row + 3,
            col + 3,
            this.getCurrentPlayer().color,
          ]);
          return true;
        }
      }
    }

    // Right to left diagonal
    for (let row = 0; row < rows - 3; row++) {
      for (let col = 3; col < columns; col++) {
        if (
          this.board[row][col] === this.getCurrentPlayer().color &&
          this.board[row + 1][col - 1] === this.getCurrentPlayer().color &&
          this.board[row + 2][col - 2] === this.getCurrentPlayer().color &&
          this.board[row + 3][col - 3] === this.getCurrentPlayer().color
        ) {
          this.moves.push(["Win", row, col, this.getCurrentPlayer()]);
          this.moves.push([
            "Win",
            row + 1,
            col - 1,
            this.getCurrentPlayer().color,
          ]);
          this.moves.push([
            "Win",
            row + 2,
            col - 2,
            this.getCurrentPlayer().color,
          ]);
          this.moves.push([
            "Win",
            row + 3,
            col - 3,
            this.getCurrentPlayer().color,
          ]);
          return true;
        }
      }
    }
    return false;
  }

  isBoardFull() {
    for (let row = 0; row < this.board.length; row++) {
      var winningMoves = [];
      for (let col = 0; col < this.board[0].length; col++) {
        if (this.board[row][col] === 0) {
          return false;
        }
      }
    }
    this.moves.push(["Full", -1, -1, this.getCurrentPlayer().color]);
    return true;
  }
}
export default GameLogic;
