import Powerups from './gamePowerups.js'
//import GameLogic from '.gameLogic.js'

class Player {

    constructor(sessionID, name, color, gl) {
        this.sessionID = sessionID
        this.gl = gl
        this.color = color
        this.name = name
        this.powerups = new Powerups(this, this.gl)

      
    }


    placeChip(colIndex){
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

export default Player;
