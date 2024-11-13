import GameLogic from './gameLogic.js'
import player from './Player.js'
import gameSocketHandler from '../../sockets/gameSocket.js';


class Manager{
    constructor(gameSocket){
        this.GameLogic = new GameLogic();
        this.gameSocket = gameSocket
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



    setGameType(gameType){
        this.gameType = gameType;
    }

    startAIvsAI() {
        console.log("Starting AI vs. AI game...");
        this.GameLogic.startAIVsAI((gameState) => {
            //console.log('Game state updated:', gameState);
        
        });
    }
    
    setPlayer(name, color){
        player = new Player(name, color, this.GameLogic)
        color === 0 ? this.GameLogic.setPlayer(player, 0) : this.GameLogic.setPlayer(player, 1);
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