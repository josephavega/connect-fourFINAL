
import GameLogic from './gameLogic.js'

import Player from '../game/Player.js'
import Users from '../users.js';



class Manager{
    constructor(){
        this.GameLogic = new GameLogic();
    }

    

    printBoard() {
        this.GameLogic.printBoard();
    }

    updateFrontEnd(){
        this.GameLogic.updateFrontEnd()
    }

    createBoard() {
        this.GameLogic.board = this.GameLogic.createBoard();
        console.log("New board created:");
        this.printBoard();
    }

    getBoard() {
        return this.GameLogic.board;
    }

    setGameType(gameType){
        this.gameType = gameType;
    }

    wipeMoves(){
        this.GameLogic.moves = []
    }

    startAIvsAI() {
        console.log("Starting AI vs. AI game...");
        this.GameLogic.startAIVsAI((gameState) => {
            //console.log('Game state updated:', gameState);
        
        });
    }
    
<<<<<<< HEAD
    setPlayer(name, color){
        let player = new Player(name, color, this.GameLogic)
        color === 0 ? this.GameLogic.setPlayer(player, 0) : this.GameLogic.setPlayer(player, 1);
        
        const sessionID = Users.getUserFromName(name);
        Users.addToGame(name, color, sessionID);
=======
    setPlayer(sessionID,username){
        const player = new Player(sessionID,username, -1, this.GameLogic)
        this.GameLogic.setPlayer(player)
        Users.addToGame(username, color, sessionID);
    }

    getPlayerID(username){
        const sessionID = Users.getUserFromName(username);
    }


    getCurrentPlayer(){
        return this.GameLogic.getCurrentPlayer()
>>>>>>> 1cb37d567b01340d5b8db8923ace74abf4e034ff
    }

    placeChip(player, column){
        player.placeChip(column);
        return this.GameLogic.moves
    }

    useLightning(player, column, row){
        player.powerups.Lighting(column,row);
        return this.GameLogic.moves
    }

    useAnvil(player, column){
        player.powerups.Anvil(column);
        return this.GameLogic.moves
    }

    useBrick(player, column){
        player.powerups.Brick(column);
        return this.GameLogic.moves
    }

    swapPage(currentPage, newPage) {

    }


}

export default new Manager;