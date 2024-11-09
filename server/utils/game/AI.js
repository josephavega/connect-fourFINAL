import { MAX } from "uuid";
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
            checked = 0
            for (let row = rows; row > 0; row--) {
                
                if(checked == 3 && oppositeColorCount > 1){//If top 3 valid chips are checked and theres atleast 2 enemy chips, save col
                        validMoves.push([col,oppositeColor])
                        break
                }else if(oppositeColor < 2){
                    break
                }
                if(board[col][row] == 'B'){break}//See a brick within first 3 ignore col
                if(board[col][row] == 0){//Move onto next row if empty
                    continue
                }else{
                    checked++
                    if (board[col][row] === oppositeColor) {
                        oppositeColorCount++ //Track opponents chips
                    }
            }
                
            }

        }
        let bestCol = -1
        let maxCount = -1
        if(validMoves.length>0){
        for(let i = 0; i < validMoves.length;i++){
            let tempCount = maxCount
            maxCount = Math.max(validMoves[i][1], maxCount)
            if(maxCount!=tempCount){
                bestCol = validMoves[i][0]
            }
        }
    }
        return bestCol
    }

    validLightning(board){
        
    }


}

export default AI;