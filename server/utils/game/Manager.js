import GameLogic from './GameLogic.js'
import Player from './Player.js'; 

class Manager{
    constructor(){
        this.GameLogic = new GameLogic();
    }

    setGameType(gameType){
        this.gameType = gameType;
    }

    startAIvsAI() {
        console.log("Starting AI vs. AI game...");
        this.gameLogic.startAIVsAI((gameState) => {
            console.log('Game state updated:', gameState);
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
        player.Lighting(column,row);
    }

    useAnvil(player, column){
        player.Anvil(column);
    }

    useBrick(player, column){
        player.Brick(column);
    }


    swapPage(currentPage, newPage) {

    }


}

export default new Manager();