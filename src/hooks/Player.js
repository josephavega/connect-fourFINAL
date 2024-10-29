class Player {
    constructor(name, color, gl) {
        this.gl = gl
        this.color = color
        this.name = name
        this.powerups = new Powerups
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