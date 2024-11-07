import Powerups from "./gamePowerups";

class AI {
    constructor(difficulty, color, io) {
        this.io = io;
        this.color = color
        this.difficulty = difficulty;
        this.powerups = new Powerups
    }
    

    makeMove(board) {
        const errorProbability = 1 - (this.difficulty / 3);
        let move = this.findWinningMove(board);
        if (!move || Math.random() < errorProbability) {
            move = this.getRandomMove(board);
        }
        return move;
    }

    findWinningMove(board) {
        let availableMoves = [];  // Declare availableMoves within this method's scope

        // Add logic for determining a winning move (for now, just gathering valid moves)
        for (let col = 0; col < board.length; col++) {
            if (board[col].includes(0)) {
                availableMoves.push(col);
            }
        }

        // This method should return a column that could lead to a win
        // Currently, just returning `null` (replace with actual logic)
        return availableMoves.length > 0 ? availableMoves[0] : null; // Placeholder: return the first available move
    }

    getRandomMove(board) {
        
        let validMoves = [];
        for (let col = 0; col < board.length; col++) {
            if (board[col][0] === 0) {
                validMoves.push(col);
            }
        }
        return validMoves.length > 0 ? validMoves[Math.floor(Math.random() * validMoves.length)] : null;
    }

    validAnvil(board){
        const rows = 6;
        const columns = 7;
        let validMoves = [];
        oppositeColor = this.color === 'R' ? 'Y' : 'R'
        for (let col = 0; col < board.length; col++) {
            oppositeColorCount = 0
            for (let row = 0; row < rows; rows++) {
                if (board[col][row] === oppositeColor) {
                    oppositeColorCount++ //Check how many of opposite color in column
                }
                if(row == row-1 && oppositeColor > 1){//If theres atleast two its a valid column to anvil
                    validMoves.push(col)
                }
            }
        }
    }

    validBrick(board){
        const rows = 6;
        const columns = 7;
        let validMoves = [];
        oppositeColor = this.color === 'R' ? 'Y' : 'R'
        for (let col = 0; col < board.length; col++) {
            oppositeColorCount = 0
            for (let row = 0; row < rows; rows++) {
                if (board[col][row] === oppositeColor) {
                    oppositeColorCount++ //Check how many of opposite color in column
                }
                if(row == row-1 && oppositeColor == 3){//If theres three
                    validMoves.push(col)
                }
            }
        }

        //want to implement a horizontal check and diagnol
    }


}

export default AI;