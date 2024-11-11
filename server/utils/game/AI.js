
import { MAX } from "uuid";
import Powerups from "./gamePowerups.js";

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
            for (let row = rows-1; row >= 0; row--) {
                
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

    validLightning(board) {
        const rows = board.length;
        const cols = board[0].length;
        let validMoves = []
        const oppositeColor = this.color === 'R' ? 'Y' : 'R';
    
        for (let col = 0; col < cols; col++) {
            for (let row = 0; row <= rows - 4; row++) {
                // Check if we have 3 consecutive chips of AI color
                if (
                    board[col][row] === this.color &&
                    board[col][row + 1] === this.color &&
                    board[col][row + 2] === this.color
                ) {
                    if (row > 0 && board[col][row - 1] === oppositeColor) {
                        validMoves.push([col,row-1])
                        break
                    }
                    if (row + 3 < rows && board[col][row + 3] === oppositeColor) {
                        validMoves.push([col][row+3])
                        break
                    }
                }
                if (
                    board[col][row] === this.color &&
                    board[col][row + 1] === oppositeColor &&
                    board[col][row + 2] === this.color &&
                    board[col][row+3] === this.color
                ) {validMoves.push([col,row+1]) }
                if (
                    board[col][row] === this.color &&
                    board[col][row + 1] === this.color &&
                    board[col][row + 2] === oppositeColor &&
                    board[col][row+3] === this.color
                ) {validMoves.push([col,row+2]) }
            }
        }
        let tile = -1
        if(validMoves>0){
            for(let i = 0; i < validMoves.length;i++){
                for(let row = rows-1; row > validMoves[i][1]; row--){
                    if(board[validMoves[i][0],row] =='B'){
                        for (let col = 0; col < cols; col++) {
                            
                            for(let rowD = rows-1; rowD > validMoves[i][1]-1; rowD--){
                                if(board[col,row] =='B'){
                                    break
                                }
                                if(rowD == validMoves[i][1]){
                                    return [col,rowD]
                                }
                            }
                    }
                }
                if(row == validMoves[i][1]+1){
                    return [col,row]
                }
            }
        }
    }
    
        
        return tile;
    }

    validBrick


}

export default AI;