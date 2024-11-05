class Player {
    constructor(name, color, gl) {
        this.gl = gl
        this.color = color
        this.name = name
        this.powerups = new Powerups
    }

    placeChip(column){
        this.gl.placePiece(colIndex)
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

module.exports = new Player();
