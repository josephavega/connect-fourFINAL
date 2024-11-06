import GameLogic from './GameLogic.js'
import player from './Player.js'


class Manager{
    constructor(){
        this.GameLogic = new GameLogic();
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
        player = new Player(name, color, this.GameLogic)
        playerCount === 0 ? this.GameLogic.setPlayer(player, 0) : this.GameLogic.setPlayer(player, 1);
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