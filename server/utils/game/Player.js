import Powerups from './gamePowerups.js'
<<<<<<< HEAD
import GameLogic from './GameLogic.js'
=======
>>>>>>> a2911d37c980e7f913eaeb3c12fd94a0956f6f31

class Player {
    constructor(name, color, gl) {
        this.gl = GameLogic
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
<<<<<<< HEAD

=======
>>>>>>> a2911d37c980e7f913eaeb3c12fd94a0956f6f31
export default new Player();
