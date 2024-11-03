import GameLogic from './GameLogic.js'

class Manager{
    constructor(gl){
        this.GameLogic = GameLogic;
    }

    setGameType(gameType){
        this.gameType = gameType
    }

    startAIvsAI() {
        this.GameLogic.startAIvsAI();
        console.log("Starting AI vs. AI game....")
    }

    setPlayer(name, color){
        player = new Player(name, color, gl)
        color == 0 ? gl.setPlayer(player, 0) : gl.setPlayer(player, 1)
    }

    placeChip(player, column){
        player.placeChip(column)
    }

    useLightning(player, column, row){
        player.Lighting(column,row)
    }

    useAnvil(player, column){
        player.Anvil(column)
    }

    useBrick(player, column){
        player.Brick(column)
    }


    swapPage(currentPage, newPage){

    }


}

export default new Manager();