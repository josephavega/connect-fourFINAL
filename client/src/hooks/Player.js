class Player {
    constructor(name, color, gl) {
        this.gl = gl
        this.color = color
        this.name = name
        this.sessionId = sessionId
        this.powerups = new Powerups
    }

    setColor(playerNum){
        this.playerNum = playerNum
    }

    Lightning(column, row){
        this.powerups.Lightning(column, row)
    }

    Anvil(column){
        this.powerups.Anvil(column)
    }

    Brick(column){
        this.powerups.Brick(column)
    }
}