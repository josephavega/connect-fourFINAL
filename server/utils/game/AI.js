import { MAX } from "uuid";
import Powerups from "./gamePowerups.js";

class AI {
    constructor(difficulty, color) {
        this.color = color
        this.difficulty = difficulty;
        this.powerups = new Powerups
        this.oppositeColor = this.color === 'R' ? 'Y' : 'R'
        this.ROWS = 6
        this.COLS = 7
        this.movesMade = 0
    }

    
    
    validMoves(board) {
        // if(this.movesMade < 3){
        //    return [this.getRandomInt(0,this.COLS),this.getRandomInt(0,this.COLS),this.getRandomInt(0,this.COLS)]
        // }
        return board[0].map((_, col) => col).filter(col => board[this.ROWS-1][col] === 0).sort(() => Math.random() - Math.random())
    }

    getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    checkWin(board, color) {
        return this.checkVerticalWin(board,color) || this.checkHorizontalWin() || this.checkDiagonalWin();
    }

    checkVerticalWin(board, color) {
        const rows = this.board.length;
        const columns = this.board[0].length;
    
        for (let col = 0; col < columns; col++) {
            let winningMoves = [];
            for (let row = 0; row < rows; row++) {
                if (board[row][col] === color) {
                    winningMoves.push([row, col]);
                    if (winningMoves.length === 4) {
                        return true;
                    }
                } else {
                    winningMoves = [];
                }
            }
        }
        return false;
    }
    
    checkHorizontalWin(board, color) {
        const rows = board.length;
        const columns = board[0].length;
    
        for (let row = 0; row < rows; row++) {
            let winningMoves = [];
            for (let col = 0; col < columns; col++) {
                if (board[row][col] === color) {
                    winningMoves.push([row, col]);
                    if (winningMoves.length === 4) {
                        return true;
                    }
                } else {
                    winningMoves = [];
                }
            }
        }
        return false;
    }
    
    checkDiagonalWin(board, color) {
        const rows = board.length;
        const columns = board[0].length;
    
        // Left to right diagonal
        for (let row = 0; row < rows - 3; row++) {
            for (let col = 0; col < columns - 3; col++) {
                if (
                    board[row][col] === color &&
                    board[row + 1][col + 1] === color &&
                    board[row + 2][col + 2] === color &&
                    board[row + 3][col + 3] === color
                ) {
                    return true;
                }
            }
        }
    
        // Right to left diagonal
        for (let row = 0; row < rows - 3; row++) {
            for (let col = 3; col < columns; col++) {
                if (
                    [row][col] === color &&
                    [row + 1][col - 1] === color &&
                    [row + 2][col - 2] === color &&
                    [row + 3][col - 3] === color
                ) {
                
                    return true;
                }
            }
        }
        return false;
    }
    

    gameOver(board) {
        return this.checkWin(board, this.color) || this.checkWin(board, this.oppositeColor) || this.validMoves(board).length === 0;
    }

    minimax(board, depth, alpha, beta, maximizingPlayer) {
        if (depth === 0 || this.gameOver(board)) {
            return this.evaluate(board);
        }
    
        if (maximizingPlayer) {
            let maxEval = -Infinity;
            for (let col of this.validMoves(board)) {
                const newBoard = this.makeMove(board, col, this.color);
                const check = this.minimax(newBoard, depth - 1, alpha, beta, false);
                maxEval = Math.max(maxEval, check);
                alpha = Math.max(alpha, check);
                if (beta <= alpha) break;
            }
            return maxEval;
        } else {
            let minEval = Infinity;
            for (let col of this.validMoves(board)) {
                const newBoard = this.makeMove(board, col, this.oppositeColor);
                const check = this.minimax(newBoard, depth - 1, alpha, beta, true);
                minEval = Math.min(minEval, check);
                beta = Math.min(beta, check);
                if (beta <= alpha) break;
            }
            return minEval;
        }
    }

     makeMove(board, col, player) {
        const newBoard = board.map(row => [...row]); // Deep copy
        for (let r = this.ROWS - 1; r >= 0; r--) {
            if (newBoard[r][col] === 0) {
                newBoard[r][col] = player;
                break;
            }
        }
        return newBoard;
    }

    bestMove(board, depth) {
        let bestScore = -Infinity;
        let move = null;
    
        // First, check if there's a winning move for the AI
        for (let col of this.validMoves(board)) {
            const newBoard = this.makeMove(board, col, this.color);
            if (this.checkWin(newBoard, this.color)) {
                // If AI can win, return this column immediately
                return col;
            }
        }

        for (let col of this.validMoves(board)) {
            const newBoard = this.makeMove(board, col, this.oppositeColor);
            if (this.checkWin(newBoard, this.oppositeColor)) {
                // If opponent can win, block
                return col;
            }
        }
    
        // If no immediate win, continue with the minimax algorithm
        for (let col of this.validMoves(board)) {
            const newBoard = this.makeMove(board, col, this.color);
            const score = this.minimax(newBoard, depth - 1, -Infinity, Infinity, false);
            if (score > bestScore) {
                bestScore = score;
                move = col;
            }
        }
        this.movesMade++;
        return move;
    }

    evaluate(board) {
        // Simplified scoring: +1000 for win, -1000 for loss, 0 otherwise
        if (this.checkWin(board, this.color)) return 1000;
        if (this.checkWin(board, this.oppositeColor)) return -1000;
        return 0;
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

    validBrick(board){

    }


}

export default AI;