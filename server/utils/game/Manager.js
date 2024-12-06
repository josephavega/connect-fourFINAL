import users from "../users.js";
import GameLogic from "./gameLogic.js";
import GamePowerups from "./gamePowerups.js";
import Player from "./Player.js";

class Manager {
  constructor() {
    this.GameLogic = new GameLogic();
    this.GamePowerups = new GamePowerups();

    // Debug GameLogic creation
    if (!this.GameLogic) {
      console.error("GameLogic instance could not be created");
    } else {
      console.log("GameLogic instance created successfully");
    }
    if (!this.GamePowerups) {
      console.error("GamePowerups instance could not be created");
    } else {
      console.log("GamePowerups instance created successfully");
    }
  }
  

  printBoard() {
    this.GameLogic.printBoard();
  }

  getBoard() {
    if (!this.GameLogic) {
      console.error("GameLogic is undefined. Cannot fetch the board.");
      return null;
    }
    return this.GameLogic.board;
  }

  getStatus() {
    let red_player, yellow_player, currentPlayer, gamemode;

    // Extract only the necessary details from player objects
    if (this.GameLogic.player[0]) {
      red_player = {
        username: this.GameLogic.player[0].username,
        sessionID: this.GameLogic.player[0].sessionID,
        color: this.GameLogic.player[0].color,
      };
    } else {
      red_player = "null";
    }

    if (this.GameLogic.player[1]) {
      yellow_player = {
        username: this.GameLogic.player[1].username,
        sessionID: this.GameLogic.player[1].sessionID,
        color: this.GameLogic.player[1].color,
      };
    } else {
      yellow_player = "null";
    }

    gamemode = this.gameType;
    currentPlayer = this.getCurrentPlayer();

    const data = { red_player, yellow_player, gamemode, currentPlayer };
    console.log(data);
    return data;
  }

  getGameOver() {
    return this.GameLogic.gameOver;
  }

  createBoard() {
    if (!this.GameLogic) {
      console.error("Cannot create board. GameLogic is not instantiated.");
      return;
    }
    this.GameLogic.board = this.GameLogic.createBoard();
    console.log("New board created:");
    this.printBoard();
  }

  setGameType(gameType) {
    this.gameType = gameType;
  }

  stopGames() {
    this.GameLogic.resetGame();
    this.GameLogic.isAIvsAI = false;
    this.GameLogic.isPlayerVsAI = false;
  }

  startAIvsAI() {
    console.log("Starting AI vs. AI game...");
    this.GameLogic.startAIVsAI((gameState) => {});
  }

  startPlayerVsAI(sessionID, username, gamemode, difficulty) {
    console.log("Starting Player vs. AI game...");

    // Stop any ongoing AI vs AI games
    if (this.GameLogic.isAIvsAI) {
      console.log("Stopping AI vs. AI game before starting Player vs. AI");
      this.GameLogic.resetGame(); // Reset any previous game state if applicable
    }

    this.createBoard(); // Create a new board for the game
    this.setGameType(gamemode);

    // Create player and AI opponent
    this.GameLogic.currentPlayerIndex = 0;

    const playerColor = "R";
    const player = new Player(sessionID, username, playerColor, this.GameLogic);
    this.GameLogic.player[0] = player; // Assign the player to index 0 of this.player array
    // this.GameLogic.setPlayer(sessionID, username); // Reflect this player in GameLogic

    const aiColor = "Y";
    const aiPlayer = new AI(5, aiColor);
    this.GameLogic.player[1] = aiPlayer; // Assign the AI player to index 1 of this.player array
    // this.GameLogic.setPlayer(aiPlayer); // Reflect this AI player in GameLogic

    this.GameLogic.startPlayerVsAI((callback) => {});
  }

  setPlayer(name) {
    // Declare the playerColor variable
    const playerColor = this.playerCount === 0 ? "R" : "Y";
    const sessionID = users.getUserFromName(name);
    // Create a new player instance
    const player = new Player(sessionID, name, playerColor, this.GameLogic);

    // Call the appropriate method to set the player
    this.GameLogic.setPlayer(player);

    // Increment the player count
    this.playerCount++;
  }

  getCurrentPlayer() {
    // Create a player object with a color property based on the currentPlayerIndex

    return this.GameLogic.getCurrentPlayer().color;
  }

  getCurrentPlayerIndex() {
    return this.GameLogic.currentPlayerIndex;
  }

  getPlayers() {
    const Player1 = this.GameLogic[0];
    const Player2 = this.GameLogic[1];

    const data = { Player1, Player2 };
    return data;
  }

  placeChip(player, column) {
    player.placeChip(column);
    //console.log(this.GameLogic.getStatus);
  }

  useLightning(player, column, row) {
    player.powerups.Lightning(column, row);
  }

  useAnvil(player, column) {
    player.powerups.Anvil(column);
  }

  useBrick(player, column) {
    //new
    //player.powerups.Brick(column); // Place the Brick
    //return this.GameLogic.board;
    
    //working line
    this.GamePowerups.Brick(column);
    return this.GameLogic.board;

    //original
    //player.powerups.Brick(column);
    
  }

  swapPage(currentPage, newPage) {}

  checkWin() {
    return this.GameLogic.checkWin;
  }
}

export default new Manager();
