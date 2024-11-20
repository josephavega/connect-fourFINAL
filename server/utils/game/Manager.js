import users from '../users.js';
import GameLogic from './GameLogic.js'
import Player from './Player.js'


class Manager{
    constructor(){
        this.GameLogic = new GameLogic();
    }

    printBoard() {
        this.GameLogic.printBoard();
    }

    getBoard() {
        return this.GameLogic.board;
    }

    getStatus() {
        let red_player;
        let yellow_player;
        let currentPlayer = 'null';
        let gamemode;

        if (this.GameLogic.player[0]) {
            red_player = this.GameLogic.player[0];
        } else {
            red_player = "null";
        }
        if (this.GameLogic.player[1]) {
            yellow_player = this.GameLogic.player[1];
        }else {
            yellow_player = "null";
        }
       
        gamemode = this.gameType;
        currentPlayer = this.GameLogic.getCurrentPlayer;
        const data = {red_player, yellow_player, gamemode, currentPlayer};
        console.log(data);
        return data;
    }

    createBoard() {
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
            //console.log('Game state updated:', gameState);
        
        });
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


}

export default new Manager();