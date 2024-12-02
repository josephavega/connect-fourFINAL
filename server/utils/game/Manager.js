import users from '../users.js';
import GameLogic from './gameLogic.js'
import Player from './Player.js'


class Manager{
    constructor() {
        this.GameLogic = new GameLogic();
        
        // Debug GameLogic creation
        if (!this.GameLogic) {
            console.error('GameLogic instance could not be created');
        } else {
            console.log('GameLogic instance created successfully');
        }
    }

    printBoard() {
        this.GameLogic.printBoard();
    }

    getBoard() {
        if (!this.GameLogic) {
            console.error('GameLogic is undefined. Cannot fetch the board.');
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
        currentPlayer = this.GameLogic.getCurrentPlayer();
    
        const data = { red_player, yellow_player, gamemode, currentPlayer };
        console.log(data);
        return data;
    }

    getGameOver() {
        return this.GameLogic.gameOver;
    }
    

    createBoard() {
        if (!this.GameLogic) {
            console.error('Cannot create board. GameLogic is not instantiated.');
            return;
        }
        this.GameLogic.board = this.GameLogic.createBoard();
        console.log("New board created:");
        this.printBoard();
    }


    setGameType(gameType){
        this.gameType = gameType;
    }

    startAIvsAI() {
        console.log("Starting AI vs. AI game...");
        this.GameLogic.startAIVsAI((gameState) => {
            
        });
    }
    
    startPlayerVsAI() {
        console.log("Starting Player vs. AI");
        this.GameLogic.startAIVsAI((gameState) => { 
            
        })
    }
  
    setPlayer(name) {
        // Declare the playerColor variable
        const playerColor = this.playerCount === 0 ? 'R' : 'Y'; 
        const sessionID = users.getUserFromName(name);
        // Create a new player instance
        const player = new Player(sessionID, name, playerColor, this.GameLogic);
    
        // Call the appropriate method to set the player
        this.GameLogic.setPlayer(player);
    
        // Increment the player count
        this.playerCount++;
    }

    getCurrentPlayer(){
        return this.GameLogic.player[this.GameLogic.currentPlayerIndex];
    }

    placeChip(player, column){
        player.placeChip(column);
        //console.log(this.GameLogic.getStatus);
    }

    useLightning(player, column, row){
        player.powerups.Lighting(column,row);
    }

    useAnvil(player, column){
        player.powerups.Anvil(column);
    }

    useBrick(player, column){
        player.powerups.Brick(column);
    }


    swapPage(currentPage, newPage) {

    }

    checkWin() {
        return this.GameLogic.checkWin;
    }


}

export default new Manager();