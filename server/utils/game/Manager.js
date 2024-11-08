import GameLogic from './GameLogic.js'
import player from './Player.js'


class Manager{
    constructor(){
        this.GameLogic = new GameLogic();
    }

    printBoard() {
        this.GameLogic.printBoard();
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
    
    playerCount = 0
    setPlayer(name){
        playerColor = this.playerCount === 0 ? 'R' : 'Y' 
        player = new Player(name, playerColor, this.GameLogic)
        this.GameLogic.setPlayer(player)
        this.playerCount++
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