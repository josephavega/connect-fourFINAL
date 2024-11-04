const gameLogic = require("./gameLogic");

class Manager{
    constructor(gl){
        this.gl = new gameLogic()
    }

    setGameType(gameType){
        this.gameType = gameType
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